/**
 * Build-time read of the Show HN launch thread, for the card on /about/. Same
 * contract as stats.ts: fetched in Node during the build, baked into the markup
 * and refreshed by the six-hourly rebuild (cloudflare-refresh.yml), so the
 * points and comment count are at most that stale and the page ships no client
 * JS for them.
 *
 * Null on any failure, and the page falls back to a plain sentence linking the
 * thread rather than a card with blanks in it.
 */
import { links } from './config';

export interface HnStory {
  title: string;
  points: number;
  comments: number;
  by: string;
  posted: Date;
}

// Read off the thread URL in config.ts, so the link and the numbers cannot
// come from two different threads.
const id = new URL(links.hn).searchParams.get('id');

/** Same reasoning as the warn in stats.ts: a null card should say why in the build log. */
function warn(message: string): null {
  console.warn(`[hn] ${message}`);
  return null;
}

async function fetchStory(): Promise<HnStory | null> {
  if (!id) return warn(`no item id in ${links.hn}`);
  try {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
      // A decorative card is not worth a hung build; see repo-stats.ts.
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return warn(`item ${id}: HTTP ${res.status} ${res.statusText}`);
    // The API answers an unknown id with a 200 and a literal `null`.
    const d = await res.json();
    if (!d || typeof d.title !== 'string' || typeof d.score !== 'number' || typeof d.time !== 'number') {
      return warn(`item ${id} came back without a title, score or time`);
    }
    return {
      title: d.title,
      points: d.score,
      // `descendants` counts every comment in the tree, which is the number HN
      // itself prints under the title. Absent rather than zero on a story with
      // no comments yet.
      comments: typeof d.descendants === 'number' ? d.descendants : 0,
      by: typeof d.by === 'string' ? d.by : '',
      posted: new Date(d.time * 1000),
    };
  } catch (err) {
    return warn(`item ${id}: ${err}`);
  }
}

export const launch = await fetchStory();
