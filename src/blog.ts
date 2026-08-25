import type { ImageMetadata } from 'astro';

/** Shared helpers for the blog routes. */

/** Canonical path for a post, from its collection id (the filename slug). */
export const postPath = (id: string) => `/blog/${id}/`;

/** '14 July 2026'. Fixed to en-GB so the build does not depend on the host locale. */
export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * The byline shown on a post that does not name one. Every post here is
 * written by the same person, so the frontmatter field exists for the
 * exception rather than for the rule.
 */
export const defaultAuthor = 'Animesh Chouhan';

/**
 * The underscore-prefixed body partials, as raw source.
 *
 * They are excluded from the collection (content.config.ts) because they are
 * not posts, which means a wrapper that delegates most of its body to one has
 * almost no `body` of its own — from-brief-to-gerbers is 200 words of frame
 * around 1,900 words of partial, and would otherwise be billed as a one-minute
 * read. readingTime folds the partial back in.
 */
const partials = import.meta.glob('./content/blog/_*.{md,mdx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * Reading time in whole minutes, at 200 words a minute.
 *
 * Counted off the raw source, so fenced code, MDX imports and JSX tags are
 * stripped first: a post whose body is half terminal transcript would
 * otherwise be billed for reading output nobody reads line by line.
 */
export const readingTime = (body: string) => {
  let source = body;

  for (const m of body.matchAll(/from\s+['"]\.\/(_[\w.-]+\.mdx?)['"]/g)) {
    const hit = Object.entries(partials).find(([path]) => path.endsWith(`/${m[1]}`));
    if (hit) source += `\n${hit[1]}`;
  }

  const words = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^import\s.*$/gm, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_`>[\]()|-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
};

/**
 * The FAQ page's title card. It lives here rather than beside either use
 * because two routes now need the same one: the blog index lists the page as
 * an entry (index.astro) and the page itself unfurls the card as its share
 * image (faq.astro). The card is rendered like any post's, from
 * diagrams/post-cards.html.
 */
export const faqCover = {
  cover: 'faq',
  alt: 'A copperhead title card: one trace entering a junction and leaving it as three.',
};

/** URL-safe form of a `kind` label, used as a filter chip's value. */
export const kindSlug = (kind: string) =>
  kind.toLowerCase().replace(/[^a-z0-9]+/g, '-');


/**
 * The rendered title cards, keyed by filename.
 *
 * They live in src/assets rather than public/ so Astro's image pipeline
 * resamples them: served raw, a 2400px card was being downscaled by the
 * browser into a 405px grid cell, a 5.9x reduction it does with a cheap filter,
 * and the type on the card went soft. Through the pipeline each slot gets a
 * webp at the width it actually paints.
 */
const cardArt = import.meta.glob<{ default: ImageMetadata }>('./assets/cards/*.png', {
  eager: true,
});

/**
 * The image pair a `cover` frontmatter value names.
 *
 * A bare name ('meet-copperhead') is a rendered card: it resolves to the
 * light/dark pair in src/assets/cards and comes back as ImageMetadata, which
 * is what <Image> needs to optimise it. A path with a file extension
 * ('/blog/art/board.png') is art from somewhere else, used as-is from public/
 * on both themes and returned as a plain string.
 *
 * Returning both halves either way means the callers never branch on theme:
 * they render two images and let the CSS pick. In the single-file case both
 * halves are the same path, which the browser fetches once.
 */
export const coverArt = (cover: string) => {
  if (/\.(png|jpe?g|webp|avif|svg)$/i.test(cover)) {
    return { light: cover, dark: cover, optimised: false as const };
  }

  const light = cardArt[`./assets/cards/${cover}-light.png`]?.default;
  const dark = cardArt[`./assets/cards/${cover}-dark.png`]?.default;

  // A cover naming a card that was never rendered is a build-time typo, and
  // failing here beats shipping a page with a hole where the card should be.
  if (!light || !dark) {
    throw new Error(
      `cover: '${cover}' has no rendered card. Expected src/assets/cards/${cover}-{light,dark}.png. ` +
        `Add the card to diagrams/post-cards.html and run: node scripts/render-cards.mjs ${cover}`,
    );
  }

  return { light, dark, optimised: true as const };
};
