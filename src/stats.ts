/**
 * Build-time fetch of live adoption stats (GitHub stars, npm installs). Runs in
 * the Astro build (Node), so the numbers are baked into the HTML: no client JS,
 * no layout shift, no visitor-facing rate limits. The refresh cadence is the
 * deploy cadence, so a scheduled Actions run keeps them current (see the
 * `schedule` trigger in .github/workflows/astro.yml).
 *
 * Every fetch is guarded the same way assets.ts gates on file presence: if the
 * repo or package is not published yet (or an API is down), the value is null
 * and the UI hides that stat rather than shipping a broken control. Nothing to
 * render until `copperheadhq/copperhead` and the `copperhead` npm package
 * are public — the numbers appear on the first build after that.
 *
 * ES modules are singletons, so the two fetches run once for the whole build
 * even though the hero, proof, and navbar all import `stats`.
 */
import { pkg, repo } from './config';

// Strip the origin so the same value feeds both the API path and any link.
const ghSlug = repo.replace(/^https?:\/\/github\.com\//, '');

// GITHUB_TOKEN is present in Actions; it lifts the unauthenticated 60/hr rate
// limit that a scheduled build would otherwise brush against. Optional locally.
const ghToken = process.env.GITHUB_TOKEN;

async function ghStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${ghSlug}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(ghToken ? { Authorization: `Bearer ${ghToken}` } : {}),
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

async function npmDownloads(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${pkg}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.downloads === 'number' ? data.downloads : null;
  } catch {
    return null;
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
