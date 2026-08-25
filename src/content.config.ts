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
     *   '/blog/cards/<slug>'          a themed PAIR; '-light.png' and
     *                                 '-dark.png' are appended
     *   '/blog/cards/<slug>.png'      one image, used on both themes
     *
     * A path carrying a file extension is taken literally, anything else is
     * treated as the base of a pair. The pair is what the house renderer
     * produces (diagrams/post-cards.html via scripts/render-cards.mjs, named
     * after the post's slug); the single form is for artwork that came from
     * somewhere else. A post without either gets the dot-field placeholder in
     * PostCard.astro rather than a gap.
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
 * Research articles: method, measurement, and results. Separate from the blog
 * because the two make different promises. A blog post argues; a research
 * article is bound to evidence in the benchmark repository and says plainly
 * which of its numbers have been measured and which have not.
 */
const research = defineCollection({
  // Same underscore convention as the blog: a draft or body partial named _*.md
  // must not become an article, a route, or a sitemap entry.
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
  }),
});

export const collections = { blog, research };
