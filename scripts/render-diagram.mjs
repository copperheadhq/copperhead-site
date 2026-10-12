// Render a diagram page to PNG in both themes at 2x.
//
//   node scripts/render-diagram.mjs                          diagrams/social-flow
//   node scripts/render-diagram.mjs <page.html> <out-prefix>
//
// Writes <out-prefix>-light.png and <out-prefix>-dark.png. The page declares
// its palette with light-dark(), so the theme is picked per pass with
// emulated prefers-color-scheme rather than a second stylesheet.
//
// Generic pages render at 1600x900. social-flow.html is a 4:3 card
// (1280x960) and also carries an `og` layout selected by body class, so for
// that page this script renders:
//   social (default) 1280x960 -> <out-prefix>-{theme}.png, also copied to
//                                public/blog/create-pipeline-{theme}.png for
//                                the blog embed (StageFlow.astro)
//   og               1200x630 -> public/blog/from-brief-to-gerbers-og.png,
//                                the link preview card, designed at native
//                                size instead of the whole diagram scaled
//                                down past legibility
//
// A page named diagrams/<slug>-og.html is a post's share card and nothing
// else: one render at 1200x630, dark only like the one above, straight to
// public/blog/<slug>-og.png for the post's ogImage frontmatter. A page named
// diagrams/<slug>-social.html is the image for posting the article to X or
// LinkedIn: the generic 1600x900 render in both themes, also copied to
// public/blog/<slug>-social-{light,dark}.png.
//
// Needs a Chromium, found the same way as shots.mjs.

import { chromium } from 'playwright-core';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function findChromium() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  // Playwright's own resolution respects PLAYWRIGHT_BROWSERS_PATH, XDG_CACHE_HOME
  // and the platform cache locations; it reports where the browser would live
  // whether or not it is installed, hence the existsSync.
  try {
    const p = chromium.executablePath();
    if (p && existsSync(p)) return p;
  } catch {}
  for (const p of [
    '/usr/bin/google-chrome-stable', '/usr/bin/google-chrome', '/usr/bin/chromium',
    '/usr/bin/chromium-browser', '/snap/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]) if (existsSync(p)) return p;
  throw new Error('No Chromium found. Set CHROME_PATH to a Chrome/Chromium binary.');
}

const html = resolve(process.argv[2] ?? 'diagrams/social-flow.html');
const out = resolve(process.argv[3] ?? html.replace(/\.html$/, ''));
if (!existsSync(html)) throw new Error(`No such page: ${html}`);
const isSocialFlow = out === resolve('diagrams/social-flow');
const ogSlug = html.match(/\/diagrams\/([\w-]+)-og\.html$/)?.[1];
const socialName = html.match(/\/diagrams\/([\w-]+-social)\.html$/)?.[1];

const browser = await chromium.launch({ executablePath: findChromium() });

// One screenshot: the page at `width`x`height` in `theme`, with the body
// class swapped to `variant` when one is named (generic diagram pages keep
// whatever class they load with).
async function shoot({ variant, width, height, theme, path }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  try {
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(html).href);
    if (variant) await page.evaluate((v) => { document.body.className = v; }, variant);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path });
  } finally {
    await ctx.close();
  }
  console.log(path);
}

try {
  if (ogSlug) {
    await shoot({
      width: 1200, height: 630, theme: 'dark',
      path: resolve(`public/blog/${ogSlug}-og.png`),
    });
  }

  for (const theme of ogSlug ? [] : ['light', 'dark']) {
    const size = isSocialFlow ? { width: 1280, height: 960 } : { width: 1600, height: 900 };
    await shoot({ ...size, theme, path: `${out}-${theme}.png` });
    if (socialName) {
      const site = resolve(`public/blog/${socialName}-${theme}.png`);
      copyFileSync(`${out}-${theme}.png`, site);
      console.log(site);
    }

    // The blog embeds this diagram (StageFlow.astro), so the copies under
    // public/ have to track the render or the post quietly goes stale.
    if (isSocialFlow) {
      const site = resolve(`public/blog/create-pipeline-${theme}.png`);
      copyFileSync(`${out}-${theme}.png`, site);
      console.log(site);
    }
  }

  // The post's share card (ogImage in its frontmatter). One theme only, since
  // link previews do not follow the reader's: dark, the brand's home ground.
  if (isSocialFlow) {
    await shoot({
      variant: 'og', width: 1200, height: 630, theme: 'dark',
      path: resolve('public/blog/from-brief-to-gerbers-og.png'),
    });
  }
} finally {
  await browser.close();
}
