/**
 * What a search result shows for a page: its title and its description. Both
 * are cut off past a width, and a cut-off title loses the words at its end,
 * which on this site used to be the post's own subject because the brand came
 * first.
 */
import { links, repo, site } from './config';

/** Past this a title is truncated in a results page. */
const TITLE_MAX = 60;
/** Past this a description is. */
const DESCRIPTION_MAX = 160;

const BRAND = 'Copperhead';

/**
 * The <title> for a post or article: its own title first, the brand after it
 * when there is room. A title that already names the brand is left alone,
 * which is what stops "Copperhead: Copperhead: Cursor for circuit boards".
 */
export const pageTitle = (title: string): string => {
  if (title.includes(BRAND)) return title;
  const branded = `${title} · ${BRAND}`;
  return branded.length <= TITLE_MAX ? branded : title;
};

/**
 * A description that fits a result. Whole sentences are kept from the front
 * until the next one would run past the limit, so the text ends on a full stop
 * instead of an ellipsis somebody else chose. A first sentence that is itself
 * too long is cut at a word.
 */
export const metaDescription = (text: string): string => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= DESCRIPTION_MAX) return clean;

  // A full stop followed by a space and a capital ends a sentence. "9.5 ps"
  // and "e.g. this" do not match, which is the point of asking for both.
  const sentences = clean.split(/(?<=[.!?])\s+(?=[A-Z])/);
  let out = '';
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > DESCRIPTION_MAX) break;
    out = next;
  }
  if (out) return out;

  const cut = clean.slice(0, DESCRIPTION_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}.`;
};

/**
 * The company, as structured data. The About page carries the full node with
 * its address and founder; this is the same entity by @id, so the home page
 * and every landing page can point at it without restating it.
 */
export const ORG_ID = `${site}/#organization`;
export const WEBSITE_ID = `${site}/#website`;

export const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: BRAND,
  url: site,
  logo: new URL('/icon-512.png', site).href,
  description:
    "Copperhead builds an open source AI agent for PCB design that edits real KiCad files and runs KiCad's own checks until they pass.",
  email: links.contact.replace('mailto:', ''),
  founder: { '@type': 'Person', name: 'Animesh Chouhan', url: links.animesh },
  sameAs: [
    repo.split('/').slice(0, 4).join('/'),
    links.x,
    links.linkedin,
    links.youtube,
    links.reddit,
    links.instagram,
  ],
};

export const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: BRAND,
  alternateName: 'Copperhead AI',
  url: site,
  description: 'Copperhead is an open source AI agent for PCB design in KiCad.',
  publisher: { '@id': ORG_ID },
  inLanguage: 'en',
};

/** A breadcrumb trail, from [label, site-root path] pairs. */
export const breadcrumbs = (trail: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: new URL(path, site).href,
  })),
});
