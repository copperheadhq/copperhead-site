import type { MarkdownHeading } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { site } from './config';
import { defaultAuthor } from './blog';

/** Shared helpers for the research routes. Dates format via `formatDate` in ./blog. */

type Article = CollectionEntry<'research'>;

/** Canonical path for a research article, from its collection id (the filename slug). */
export const articlePath = (id: string) => `/research/${id}/`;

/** The byline of an article that does not name one: the blog's author, at copperhead. */
export const authorsOf = (a: Article) =>
  a.data.authors ?? [{ name: defaultAuthor, affiliation: 'copperhead' }];

/** 'Animesh Chouhan' as 'Chouhan, Animesh', the form BibTeX and Google Scholar both read. */
const inverted = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const family = parts.pop() ?? name;
  return parts.length ? `${family}, ${parts.join(' ')}` : family;
};

/** 'Animesh Chouhan' as 'Chouhan, A.', for the plain-text citation. */
const initialled = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const family = parts.pop() ?? name;
  return parts.length ? `${family}, ${parts.map((p) => `${p[0]}.`).join(' ')}` : family;
};

/** Byline names for citation_author tags, one per author. */
export const scholarAuthors = (a: Article) =>
  authorsOf(a).map((p) => ({ name: inverted(p.name), affiliation: p.affiliation }));

/** citation_publication_date wants YYYY/MM/DD. */
export const scholarDate = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '/');

/**
 * Back matter, left unnumbered as a paper leaves it: a References section is
 * the list the [n] marks point into, not a step in the argument. The article
 * page's CSS skips the same slugs.
 */
const unnumbered = new Set(['references']);

/**
 * Section numbers as the article page draws them, h2 as '3' and h3 as '3.1'.
 *
 * The prose numbers its own headings with CSS counters, and the contents rail
 * links to them by number, so the two have to count the same way. This is
 * the rail's count: same depths, same order, same reset of the sub-count at
 * each h2 and the same unnumbered back matter.
 */
export const numberSections = (headings: MarkdownHeading[]) => {
  let sec = 0;
  let sub = 0;
  return headings
    .filter((h) => h.depth === 2 || h.depth === 3)
    .map((h) => {
      if (h.depth === 2) {
        if (unnumbered.has(h.slug)) return { ...h, n: '' };
        sec++;
        sub = 0;
        return { ...h, n: `${sec}` };
      }
      sub++;
      return { ...h, n: `${sec}.${sub}` };
    });
};

/** The paper and the repository, labelled by what they are. */
export const resourcesOf = (a: Article) => {
  const out: { label: string; href: string }[] = [];
  if (a.data.paper) {
    out.push({
      label: a.data.paper.endsWith('.pdf') ? 'Paper (PDF)' : 'Paper source',
      href: a.data.paper,
    });
  }
  if (a.data.code) out.push({ label: 'Repository', href: a.data.code });
  return out;
};

/** A site-root PDF only: Scholar wants the file itself, not a viewer page round it. */
export const scholarPdf = (a: Article) =>
  a.data.paper?.startsWith('/') && a.data.paper.endsWith('.pdf')
    ? new URL(a.data.paper, site).href
    : undefined;

/** LaTeX's special characters, for the free-text BibTeX fields. */
const tex = (s: string) => s.replace(/([&%$#_{}])/g, '\\$1');

/**
 * The article as a BibTeX entry.
 *
 * @misc rather than @article or @techreport: it is a web article with no
 * journal and no report number, and @misc is the one type every style renders
 * without complaining about a missing field. The title is double-braced so a
 * style that sentence-cases titles leaves 'copperbench' and 'KiCad' alone.
 */
export const bibtex = (a: Article) => {
  const authors = authorsOf(a);
  const year = a.data.date.getUTCFullYear();
  const month = a.data.date
    .toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })
    .toLowerCase();
  const family = inverted(authors[0].name).split(',')[0].toLowerCase().replace(/[^a-z]/g, '');
  const key = `${family}${year}${a.id.replace(/[^a-z0-9]/gi, '')}`;

  const fields: [string, string][] = [
    ['author', `{${authors.map((p) => inverted(p.name)).join(' and ')}}`],
    ['title', `{{${tex(a.data.title)}}}`],
    ['howpublished', '{copperhead research}'],
    ['year', `{${year}}`],
    // Unbraced: jan..dec are BibTeX's own month macros, which every style
    // knows how to print.
    ['month', month],
    ['url', `{${new URL(articlePath(a.id), site).href}}`],
  ];
  if (a.data.code) fields.push(['note', `{Code: \\url{${a.data.code}}}`]);

  const width = Math.max(...fields.map(([k]) => k.length));
  const body = fields.map(([k, v]) => `  ${k.padEnd(width)} = ${v}`).join(',\n');
  return `@misc{${key},\n${body}\n}`;
};

/** The article as a plain reference, author-date, for pasting into prose. */
export const citation = (a: Article) => {
  const names = authorsOf(a).map((p) => initialled(p.name));
  const byline =
    names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0];
  const title = a.data.title.replace(/[.?!]$/, '');
  const end = /[?!]$/.test(a.data.title) ? a.data.title.at(-1) : '.';
  return `${byline} (${a.data.date.getUTCFullYear()}). ${title}${end} copperhead research. ${new URL(articlePath(a.id), site).href}`;
};
