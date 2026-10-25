import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * The sign-off gate for the pages collection (src/content.config.ts). One
 * place decides which of those pages exist in a build, so the route, the
 * sitemap and the footer cannot disagree about it.
 */

/**
 * A bracketed placeholder: "[CIN]", "[three (3)] years", "[with CIN [CIN]]".
 * One level of nesting, because the legal drafts nest a field inside an
 * optional clause. A markdown link's text is followed by "(" and is not one.
 */
const PLACEHOLDER = /\[(?:[^[\]]|\[[^[\]]*\])*\](?!\()/g;

/** Every placeholder left in a body, whitespace collapsed, in order. */
export function placeholders(body: string): string[] {
  return [...body.matchAll(PLACEHOLDER)].map((m) => m[0].replace(/\s+/g, ' '));
}

/** The entries this build carries: the signed-off ones, plus drafts in `astro dev`. */
export async function builtPages(): Promise<CollectionEntry<'pages'>[]> {
  const pages = await getCollection('pages', (p) => !p.data.draft || import.meta.env.DEV);
  for (const p of pages) {
    const open = placeholders(p.body ?? '');
    if (!p.data.draft && open.length) {
      throw new Error(
        `src/content/pages/${p.id} is signed off (draft: false) with ${open.length} ` +
          `bracketed placeholder(s) left, the first "${open[0]}". Resolve them in ` +
          `${p.data.source ?? 'the entry'} and re-sync, or put it back to draft.`,
      );
    }
  }
  return pages;
}

/**
 * The signed-off entries' paths, keyed by entry id ('privacy', 'terms'),
 * for the sitemap and the footer. Never drafts, even in dev, so a link to a
 * page appears in the same commit that signs the page off and not before.
 */
export async function liveHrefs(): Promise<Partial<Record<string, string>>> {
  const pages = await getCollection('pages', (p) => !p.data.draft);
  return Object.fromEntries(pages.map((p) => [p.id, p.data.path]));
}
