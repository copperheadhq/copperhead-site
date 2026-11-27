/**
 * Build-time fetch of live adoption stats (GitHub stars, npm installs). Runs in
 * the Astro build (Node), so the numbers are baked into the HTML: no client JS,
 * no layout shift, no visitor-facing rate limits. The refresh cadence is the
 * deploy cadence: Cloudflare's Git integration owns the build, and since it has
 * no cron of its own, .github/workflows/cloudflare-refresh.yml POSTs a deploy
 * hook every six hours to keep the numbers current.
 *
 * Every fetch is guarded the same way assets.ts gates on file presence: if the
 * repo or package is not published yet (or an API is down), the value is null
 * and the UI hides that stat rather than shipping a broken control. Nothing to
 * render until `copperheadhq/copperhead` and the `copperhead` npm package
 * are public — the numbers appear on the first build after that.
 *
 * ES modules are singletons, so the two fetches run once for the whole build
 * even though RunDemo, the navbar and TrendChart all import from it.
 */
import { pkg, repo } from './config';

// Strip the origin so the same value feeds both the API path and any link.
const ghSlug = repo.replace(/^https?:\/\/github\.com\//, '');

// GITHUB_TOKEN is present in Actions and in Cloudflare's build environment; it
// lifts the unauthenticated 60/hr rate limit that a scheduled build would
// otherwise brush against. Optional locally.
const ghToken = process.env.GITHUB_TOKEN;

/**
 * A silent null is the right thing to render and the wrong thing to debug: a
 * dead stat looks identical whether the repo is private, the API is down or the
 * token has expired. So every miss says why on stderr, which is the Cloudflare
 * build log.
 */
function warn(message: string): null {
  console.warn(`[stats] ${message}`);
  return null;
}

/**
 * The status alone does not say why it failed. GitHub puts the explanation in a
 * JSON `message` and the quota in the rate limit headers, and those are what
 * separate an expired token from an unauthorised one from an exhausted budget.
 * Reading the body consumes the response, which is safe because every caller
 * here is already on a failure path.
 */
async function reason(res: Response): Promise<string> {
  const limit = res.headers.get('x-ratelimit-limit');
  const quota = limit ? `, quota ${res.headers.get('x-ratelimit-remaining') ?? '?'}/${limit}` : '';
  let message = '';
  try {
    const body = (await res.json()) as { message?: unknown; error?: unknown };
    const text = typeof body.message === 'string' ? body.message : body.error;
    if (typeof text === 'string') message = `, ${text}`;
  } catch {
    // a non-JSON error page carries nothing worth quoting
  }
  return `HTTP ${res.status} ${res.statusText}${message}${quota}`;
}

async function fetchRepo(withToken: boolean): Promise<Response> {
  return fetch(`https://api.github.com/repos/${ghSlug}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(withToken && ghToken ? { Authorization: `Bearer ${ghToken}` } : {}),
    },
  });
}

async function ghStars(): Promise<number | null> {
  try {
    let res = await fetchRepo(true);

    // A token is worse than no token at all here: the repo is public, so an
    // anonymous request is the ground truth and the header can only ever take
    // the stat down. Expired credentials earn a 401. A fine-grained token whose
    // repository access does not list this repo earns a 404, because GitHub will
    // not confirm a repo it thinks the caller cannot see. Org SSO enforcement or
    // a spent quota earns a 403. Keying this retry to 401 alone therefore
    // rescued one of those three and left the other two looking exactly like a
    // repo that was never published. So retry once without the header on any
    // failure and spend the anonymous budget rather than the star count.
    if (!res.ok && ghToken) {
      warn(`GitHub refused the token (${await reason(res)}), retrying unauthenticated`);
      res = await fetchRepo(false);
    }

    if (!res.ok) return warn(`no GitHub stars: ${await reason(res)}`);
    const data = await res.json();
    if (typeof data.stargazers_count !== 'number') {
      return warn('no GitHub stars: no stargazers_count in the response');
    }
    return data.stargazers_count;
  } catch (err) {
    return warn(`no GitHub stars: ${err}`);
  }
}

async function npmDownloads(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${pkg}`,
    );
    if (!res.ok) return warn(`no npm installs: ${await reason(res)}`);
    const data = await res.json();
    if (typeof data.downloads !== 'number') {
      return warn('no npm installs: no downloads in the response');
    }
    return data.downloads;
  } catch (err) {
    return warn(`no npm installs: ${err}`);
  }
}

export const stats = {
  stars: await ghStars(),
  downloads: await npmDownloads(),
};

/** 1240 -> "1.2k", 12400 -> "12k", 980 -> "980". */
export function compact(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k >= 10 ? Math.round(k) : k.toFixed(1)}k`;
}
