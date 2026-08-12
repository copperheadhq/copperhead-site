/**
 * Build-time read of the long-run traffic history for the copperhead repo.
 *
 * GitHub's traffic API only remembers 14 days. .github/workflows/repo-stats.yml
 * runs jgehrcke/github-repo-stats once a day to snapshot it and append to CSVs on
 * this repo's `github-repo-stats` branch; this module reads those CSVs during the
 * Astro build so /stats/ ships as static HTML. Same contract as stats.ts: the
 * fetch happens in Node at build time, the numbers are baked into the markup, and
 * the refresh cadence is the deploy cadence (cloudflare-refresh.yml rebuilds every
 * six hours).
 *
 * Everything here is null-guarded the way stats.ts and assets.ts are. The data
 * branch does not exist until the workflow's first successful run, and that run
 * cannot happen until the GHRS_GITHUB_API_TOKEN secret is set — so on a fresh
 * clone, and on every build before that point, this returns null and the page
 * renders a short "not collecting yet" note instead of an empty chart. A missing
 * branch, a failed request, and a malformed CSV all take the same path: no data,
 * no page furniture pretending otherwise.
 */
import { repo } from './config';

/**
 * The repo being measured — the product, not this site. Exported because the
 * page needs it too, to strip the prefix every popular-path row shares; deriving
 * it twice is how the two would come to disagree.
 */
export const trackedSlug = repo.replace(/^https?:\/\/github\.com\//, '');

/** The repo the workflow commits data to, and the branch it uses. */
const dataRepo = 'chouhanindustries/copperhead-site';
const dataBranch = 'github-repo-stats';

/** ghrs lays its output out under <owner>/<repo>/ on the data branch. */
const dataDir = `${trackedSlug}/ghrs-data`;
const rawBase = `https://raw.githubusercontent.com/${dataRepo}/${dataBranch}/${dataDir}`;

/** Link to the rendered PDF report, for readers who want the whole thing. */
export const reportUrl = `https://github.com/${dataRepo}/blob/${dataBranch}/${trackedSlug}/latest-report/report.pdf`;

/** Same optional token as stats.ts: lifts the unauthenticated 60/hr API limit. */
const ghToken = process.env.GITHUB_TOKEN;

export interface Point {
  /** YYYY-MM-DD, in UTC — ghrs buckets everything by UTC day. */
  date: string;
  /** Milliseconds since epoch, for positioning a point on a time axis. */
  t: number;
  value: number;
}

export interface Ranked {
  name: string;
  total: number;
  unique: number;
}

export interface RepoStats {
  views: { total: Point[]; unique: Point[] };
  clones: { total: Point[]; unique: Point[] };
  stars: Point[];
  forks: Point[];
  referrers: Ranked[];
  paths: Ranked[];
  /** First and last day covered by the views/clones series. */
  since: string;
  updated: string;
  /** Days of history, which is the whole point of collecting this. */
  days: number;
}

/**
 * Minimal CSV reader. The input is machine-written by ghrs rather than
 * hand-edited, so the only real-world complication is quoting: a referrer or a
 * URL path may contain a comma, and ghrs quotes those fields. Handles quoted
 * fields and doubled quotes inside them; does not handle embedded newlines,
 * which ghrs never emits.
 */
function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const splitRow = (line: string): string[] => {
    const cells: string[] = [];
    let cell = '';
    let quoted = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (quoted) {
        // A doubled quote inside a quoted field is one literal quote.
        if (c === '"' && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else if (c === '"') {
          quoted = false;
        } else {
          cell += c;
        }
      } else if (c === '"') {
        quoted = true;
      } else if (c === ',') {
        cells.push(cell);
        cell = '';
      } else {
        cell += c;
      }
    }
    cells.push(cell);
    return cells;
  };

  // Keyed by header name rather than by index, so a column added upstream
  // shifts nothing and a column renamed fails loudly at the call site.
  const header = splitRow(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = splitRow(line);
    return Object.fromEntries(header.map((h, i) => [h, (cells[i] ?? '').trim()]));
  });
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: ghToken ? { Authorization: `Bearer ${ghToken}` } : {},
      // A build that cannot reach GitHub should lose a page, not hang. Without
      // this a stalled connection blocks the whole Cloudflare build behind a
      // decorative page, and the timeout lands in the same catch as any other
      // failure, so the result is the "not collecting yet" state.
      signal: AbortSignal.timeout(10_000),
    });
    // 404 is the expected answer before the workflow's first run, not an error.
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function fetchCsv(url: string): Promise<Record<string, string>[] | null> {
  const text = await fetchText(url);
  if (text === null) return null;
  try {
    const rows = parseCsv(text);
    return rows.length ? rows : null;
  } catch {
    return null;
  }
}

/**
 * ghrs timestamps look like `2026-08-10 00:00:00+00:00` — ISO 8601 apart from the
 * space, which not every runtime will parse. Normalising it is cheaper than
 * trusting V8's lenient date parser to stay lenient.
 */
function toPoint(row: Record<string, string>, key: string): Point | null {
  const stamp = row.time_iso8601;
  const raw = row[key];
  if (!stamp || raw === undefined || raw === '') return null;

  const t = Date.parse(stamp.replace(' ', 'T'));
  const value = Number(raw);
  if (Number.isNaN(t) || Number.isNaN(value)) return null;

  return { date: stamp.slice(0, 10), t, value };
}

function series(rows: Record<string, string>[], key: string): Point[] {
  return rows
    .map((r) => toPoint(r, key))
    .filter((p): p is Point => p !== null)
    .sort((a, b) => a.t - b.t);
}

/**
 * Top referrers and top paths are point-in-time snapshots rather than a time
 * series — one file per collection run, named by timestamp. The newest file is
 * the current 14-day window, which is the only one worth showing. Filenames sort
 * lexicographically into chronological order because they lead with the
 * timestamp, so picking the newest needs no date parsing.
 *
 * Listing the directory goes through the git trees API using its `branch:path`
 * subtree syntax, which returns just that directory's entries. The contents API
 * would be the obvious call and caps out at 1000 entries — roughly 500 days of
 * two-files-a-day — so it would quietly start lying partway through year two.
 */
async function latestSnapshot(kind: 'top_referrers' | 'top_paths') {
  const subtree = encodeURIComponent(`${dataBranch}:${dataDir}/snapshots`);
  const text = await fetchText(
    `https://api.github.com/repos/${dataRepo}/git/trees/${subtree}`,
  );
  if (text === null) return null;

  let names: string[];
  try {
    const tree = JSON.parse(text) as { tree?: { path?: string }[] };
    names = (tree.tree ?? [])
      .map((e) => e.path ?? '')
      .filter((p) => p.endsWith(`_${kind}_snapshot.csv`))
      .sort();
  } catch {
    return null;
  }

  const newest = names.at(-1);
  if (!newest) return null;
  return fetchCsv(`${rawBase}/snapshots/${newest}`);
}

function ranked(
  rows: Record<string, string>[] | null,
  nameKey: string,
  limit: number,
): Ranked[] {
  if (!rows) return [];
  return rows
    .map((r) => ({
      name: r[nameKey] ?? '',
      total: Number(r.views_total),
      unique: Number(r.views_unique),
    }))
    .filter((r) => r.name && !Number.isNaN(r.total) && !Number.isNaN(r.unique))
    .sort((a, b) => b.unique - a.unique || b.total - a.total)
    .slice(0, limit);
}

async function load(): Promise<RepoStats | null> {
  // One round of requests, in parallel: this runs once per build, and a build
  // should not spend six sequential round trips on a single page.
  const [traffic, stargazers, forks, referrers, paths] = await Promise.all([
    fetchCsv(`${rawBase}/views_clones_aggregate.csv`),
    fetchCsv(`${rawBase}/stargazers.csv`),
    fetchCsv(`${rawBase}/forks.csv`),
    latestSnapshot('top_referrers'),
    latestSnapshot('top_paths'),
  ]);

  // Traffic is the spine of the page. Stars, forks, and the two snapshot tables
  // are each allowed to be missing on their own — ghrs only writes forks.csv
  // once there is a fork, and stargazers.csv once there is a star — but with no
  // traffic series there is no page.
  if (!traffic) return null;

  const views = { total: series(traffic, 'views_total'), unique: series(traffic, 'views_unique') };
  const clones = { total: series(traffic, 'clones_total'), unique: series(traffic, 'clones_unique') };
  if (!views.unique.length) return null;

  const since = views.unique[0].date;
  const updated = views.unique.at(-1)!.date;
  // Span of the record, not the row count: ghrs writes no row for a day with no
  // traffic at all, so counting rows would understate a quiet stretch.
  const days =
    Math.round((views.unique.at(-1)!.t - views.unique[0].t) / 86_400_000) + 1;

  return {
    views,
    clones,
    stars: stargazers ? series(stargazers, 'stars_cumulative') : [],
    forks: forks ? series(forks, 'forks_cumulative') : [],
    referrers: ranked(referrers, 'referrer', 10),
    paths: ranked(paths, 'url_path', 10),
    since,
    updated,
    days,
  };
}

/** Sum of a series over its trailing `days` days, for the headline tiles. */
export function trailing(points: Point[], days: number): number {
  if (!points.length) return 0;
  const cutoff = points.at(-1)!.t - (days - 1) * 86_400_000;
  return points.reduce((sum, p) => (p.t >= cutoff ? sum + p.value : sum), 0);
}

/** ES modules are singletons, so this fetch runs once for the whole build. */
export const repoStats = await load();
