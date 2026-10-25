import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // Underscore-prefixed files are not posts: they are body partials imported
  // by an .mdx wrapper (see from-brief-to-gerbers), kept as plain markdown so
  // formatters cannot break the MDX around them.
  loader: glob({ base: './src/content/blog', pattern: ['**/*.{md,mdx}', '!**/_*'] }),
  schema: z.object({
    title: z.string(),
    /** Shown on the index card and used as the meta description, so keep it a full sentence. */
    description: z.string(),
    date: z.coerce.date(),
    /** Short mono label on the index, e.g. 'Product' or 'Engineering'. */
    kind: z.string(),
    /** Path to the post's pitch deck PDF, referenced in the body as {frontmatter.deck}. */
    deck: z.string().optional(),
    /**
     * The post's title card. Two forms:
     *
     *   'meet-copperhead'        a bare name, carrying no directory and no
     *                            extension: a themed PAIR under
     *                            src/assets/cards, '-light.png' and
     *                            '-dark.png' appended
     *   '/blog/art/board.png'    a site-root path carrying a file extension:
     *                            one image from public/, both themes
     *
     * A value carrying a file extension is taken literally, anything else is
     * treated as the name of a rendered pair. The pair is what the house
     * renderer produces (diagrams/post-cards.html via
     * scripts/render-cards.mjs, named after the post's slug); the single form
     * is for artwork that came from somewhere else. coverArt in src/blog.ts
     * resolves both, and throws on a name it has no rendered pair for. A post
     * without either gets the dot-field placeholder in PostCard.astro rather
     * than a gap.
     */
    cover: z.string().optional(),
    /** Alt text for that pair. Describes the picture, not the post. */
    coverAlt: z.string().optional(),
    /** Byline. Defaults to defaultAuthor in blog.ts. */
    author: z.string().optional(),
    /** Site-root-relative path of a post-specific 1200x630 share image; the site card otherwise. */
    ogImage: z.string().optional(),
    /** Alt text for that image. Describes the picture, not the post. */
    ogImageAlt: z.string().optional(),
  }),
});

/**
 * Research articles: method, measurement and results. Separate from the blog
 * because the two make different promises. A blog post argues; a research
 * article is bound to evidence in the benchmark repository and says plainly
 * which of its numbers have been measured and which have not.
 */
const research = defineCollection({
  // Same underscore convention as the blog: a draft or body partial named _*.md
  // must not become an article, a route or a sitemap entry.
  loader: glob({ base: './src/content/research', pattern: ['**/*.{md,mdx}', '!**/_*'] }),
  schema: z.object({
    title: z.string(),
    /** Shown on the index card and used as the meta description, so keep it a full sentence. */
    description: z.string(),
    date: z.coerce.date(),
    /** Short mono label on the index, e.g. 'Method' or 'Results'. */
    kind: z.string(),
    /**
     * What state the work is in, shown beside the date. 'Method, no results yet'
     * is a legitimate value and the reason this field exists: an article
     * describing an unrun benchmark must not read like one reporting it.
     */
    status: z.string().optional(),
    /**
     * Byline, in order, each with the institution it is credited to. Defaults
     * to the blog's defaultAuthor at Copperhead (authorsOf in src/research.ts),
     * so the field exists for a co-authored piece rather than for every one.
     */
    authors: z
      .array(z.object({ name: z.string(), affiliation: z.string().optional() }))
      .optional(),
    /** Shown under the abstract and emitted as citation_keywords. */
    keywords: z.array(z.string()).optional(),
    /**
     * The paper this article is the web edition of. A URL ending in .pdf is
     * labelled as the PDF and a site-root one is also handed to Google Scholar
     * as citation_pdf_url; anything else is labelled as the paper's source.
     */
    paper: z.string().optional(),
    /** The repository holding the code, fixtures or data the article describes. */
    code: z.string().optional(),
    /**
     * The article's card on the research index, in either of the blog's two
     * forms (see `cover` on the blog collection above). For a paper this is
     * usually a 16:9 crop of its first page, title block on top, from public/.
     */
    cover: z.string().optional(),
    /** Alt text for that card. Describes the picture, not the article. */
    coverAlt: z.string().optional(),
  }),
});

/**
 * Standalone documents that need a sign-off before they go live, starting with
 * the legal pages. Each entry names its own URL, and src/pages/[...path].astro
 * renders it there.
 *
 * `draft` is the gate. A draft is built by `astro dev`, so it can be read in
 * place with the site around it, and left out of every production build: no
 * route, no sitemap entry, no footer link. The route also refuses to build a
 * non-draft entry that still holds a bracketed placeholder, so a page cannot
 * be signed off with "[Grievance Officer]" still in it.
 */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: ['**/*.{md,mdx}', '!**/_*'] }),
  schema: z.object({
    title: z.string(),
    /** The meta description. A full sentence. */
    description: z.string(),
    /** Site-root path with both slashes, e.g. '/legal/privacy/'. */
    path: z.string().regex(/^\/[a-z0-9/-]+\/$/),
    /** Short mono label over the title, e.g. 'Legal'. */
    kind: z.string(),
    /** The date of the text, shown as "Updated". */
    updated: z.coerce.date(),
    draft: z.boolean(),
    /**
     * Where the master lives, for an entry copied in by scripts/sync-pages.mjs.
     * Edit the master and re-sync rather than editing the copy here.
     */
    source: z.string().optional(),
  }),
});

export const collections = { blog, research, pages };
