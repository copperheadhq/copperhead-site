// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://copperhead.sh',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      // Dual themes with no default: every token carries its two colours as
      // --shiki-light/--shiki-dark custom properties instead of a baked-in
      // inline `color`, and the prose stylesheets resolve them with
      // light-dark() off the page's color-scheme. A single inline theme was
      // how this first shipped, and its github-light ink was unreadable on
      // the dark theme's surface. Same setup as FileBlock.astro, which is
      // where most code on the site actually renders.
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  build: {
    // one small page: keep the CSS inline rather than paying for a second
    // round trip (spec §7 budget)
    inlineStylesheets: 'always',
  },
  // src/pages/[...path].astro builds whatever path a pages entry names. If
  // that path is one another route already builds, the default only warns
  // and drops the entry, while src/signoff.ts still links it from the footer
  // and the sitemap. Failing the build is the honest outcome.
  prerenderConflictBehavior: 'error',
});
