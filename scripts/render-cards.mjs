// Render the blog title cards to PNG in both themes at 2x.
//
//   node scripts/render-cards.mjs            every card in diagrams/post-cards.html
//   node scripts/render-cards.mjs faq        just the cards whose slug matches
//
// Writes src/assets/cards/<slug>-{light,dark}.png at 2400x1260. One card per
// <article data-slug> in the page; the slug is the post's collection id, which
// is what wires the output to `cover` frontmatter without a lookup table.
//
// Same shape as render-diagram.mjs: the page declares its palette with
// light-dark(), so the theme is picked per pass with an emulated
// prefers-color-scheme rather than a second stylesheet.
//
// Needs a Chromium, found the same way as render-diagram.mjs.

import { chromium } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function findChromium() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
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

const html = resolve('diagrams/post-cards.html');
if (!existsSync(html)) throw new Error(`No such page: ${html}`);

const filter = process.argv[2] ?? null;
// src/assets, not public/: these go through Astro's image pipeline, which
// resamples them to the size each slot actually paints and emits webp. Served
// raw from public/ the browser was downscaling 2400px into a 405px grid cell,
// a 5.9x reduction it does with a cheap filter, and the card text went soft.
const outDir = resolve('src/assets/cards');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: findChromium() });
let written = 0;

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    // The viewport only has to hold one card; each screenshot is taken off the
    // element, so the page can be as long as it likes below the fold.
    viewport: { width: 1240, height: 700 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const slugs = await page.$$eval('article.card[data-slug]', (els) =>
    els.map((el) => el.dataset.slug),
  );

  for (const slug of slugs) {
    if (filter && !slug.includes(filter)) continue;
    const el = await page.$(`article.card[data-slug="${slug}"]`);
    const path = `${outDir}/${slug}-${theme}.png`;
    await el.screenshot({ path });
    console.log(`  ${path.replace(process.cwd() + '/', '')}`);
    written++;
  }

  await ctx.close();
}

await browser.close();
console.log(`${written} card${written === 1 ? '' : 's'} written.`);
