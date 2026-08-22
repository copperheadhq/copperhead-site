// Responsive screenshot + layout audit for the running dev server.
//
//   npm run shots                     every viewport, both themes
//   npm run shots -- --only fhd,2k    just those viewports
//   npm run shots -- --audit          no images, print the measurement table
//
// The point of this over eyeballing a browser window is the audit table: it
// answers the two questions the hero's layout is actually built around — does
// the fold seat the whole stack, and does the terminal hold its aspect ratio —
// at fourteen viewports and two themes in one run, including the 1280x720 and
// 1512x945 laptop sizes that are easy to forget and are exactly where the fold
// runs out of room.
//
// Needs a Chromium. It finds one from PUPPETEER/PLAYWRIGHT caches, a system
// Chrome, or $CHROME_PATH. Start the dev server first (astro dev --background).

import { chromium } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.URL ?? 'http://localhost:4321';
const OUT = process.env.OUT ?? 'shots';

const argv = process.argv.slice(2);
const flag = n => argv.includes(`--${n}`);
const opt = n => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : null; };

const AUDIT_ONLY = flag('audit');
const PATHS = (opt('path') ?? '/').split(',');
const THEMES = (opt('themes') ?? 'light,dark').split(',');

// Named so `--only` reads well. Heights are the usable viewport, not the panel:
// a "1080p" desktop browser shows ~980px once chrome is subtracted, which is
// why the short-viewport rules key off values well under 1080.
const VIEWPORTS = [
  { name: 'iphone-se',      w: 375,  h: 667,  dpr: 2,   mobile: true },
  { name: 'iphone-12',      w: 390,  h: 844,  dpr: 3,   mobile: true },
  { name: 'pixel-7',        w: 412,  h: 915,  dpr: 2.6, mobile: true },
  { name: 'iphone-pro-max', w: 430,  h: 932,  dpr: 3,   mobile: true },
  { name: 'ipad-mini',      w: 768,  h: 1024, dpr: 2,   mobile: true },
  { name: 'ipad-pro',       w: 1024, h: 1366, dpr: 2,   mobile: true },
  { name: 'laptop-720',     w: 1280, h: 720,  dpr: 1 },
  { name: 'laptop-800',     w: 1440, h: 800,  dpr: 1 },
  { name: 'macbook-14',     w: 1512, h: 945,  dpr: 2 },
  { name: 'fhd',            w: 1920, h: 1080, dpr: 1 },
  { name: '2k',             w: 2560, h: 1440, dpr: 1 },
  { name: '4k',             w: 3840, h: 2160, dpr: 1 },
  { name: '4k-at-150',      w: 2560, h: 1440, dpr: 1.5 },
  { name: '4k-at-200',      w: 1920, h: 1080, dpr: 2 },
];

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

const only = opt('only')?.split(',');
const targets = only ? VIEWPORTS.filter(v => only.includes(v.name)) : VIEWPORTS;
if (!targets.length) throw new Error(`--only matched nothing. Names: ${VIEWPORTS.map(v => v.name).join(', ')}`);

if (!AUDIT_ONLY) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: findChromium() });
const rows = [];

for (const theme of THEMES) {
  for (const v of targets) {
    const ctx = await browser.newContext({
      viewport: { width: v.w, height: v.h },
      deviceScaleFactor: v.dpr,
      isMobile: !!v.mobile,
      hasTouch: !!v.mobile,
      colorScheme: theme,
    });
    // The site stamps <html data-theme> from this key before first paint, so
    // setting it here is what actually pins the theme; colorScheme above only
    // covers the no-preference path.
    await ctx.addInitScript(t => {
      try { localStorage.setItem('copperhead-theme', t); } catch {}
    }, theme);

    for (const path of PATHS) {
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', m => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));

      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);

      // The hero transcript is a ~10.4s timed run. Let every finite animation
      // finish so a shot shows the completed readout — the `done · verified
      // erc …` line — rather than an empty window. The spinner never ends, so
      // it is filtered out by its iteration count.
      await page.evaluate(() => Promise.all(
        document.getAnimations()
          .filter(a => a.effect?.getComputedTiming?.().iterations !== Infinity)
          .map(a => a.finished.catch(() => {}))
      ));
      await page.waitForTimeout(400);

      rows.push({
        theme, path, viewport: v.name, size: `${v.w}x${v.h}`,
        errors: errors.slice(0, 3),
        ...await page.evaluate(() => {
          const q = s => document.querySelector(s);
          const box = el => el && Object.fromEntries(
            ['top', 'bottom', 'width', 'height'].map(k => [k, +el.getBoundingClientRect()[k].toFixed(1)]));

          // Anything sticking out sideways is a real bug at every width; a page
          // that scrolls horizontally on a phone is the classic one.
          //
          // Except where an ancestor clips it. A box that hangs past the
          // viewport inside `overflow: hidden` cannot move the page, and some
          // are meant to: the hero's backer marquee is a rail deliberately
          // wider than the screen, and reported raw it buried the real signal
          // under one line per logo per viewport. Checking overflow-x alone is
          // enough — a non-visible overflow-y forces x to compute to at least
          // auto, so a clip on either axis shows up here.
          const vw = document.documentElement.clientWidth;
          const clipped = el => {
            for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
              if (getComputedStyle(p).overflowX !== 'visible') return true;
            }
            return false;
          };
          const bleed = [...document.querySelectorAll('body *')]
            .filter(el => {
              const b = el.getBoundingClientRect();
              return (b.width || b.height) && getComputedStyle(el).position !== 'fixed'
                && (b.right > vw + 1 || b.left < -1) && !clipped(el);
            })
            .map(el => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
              ? '.' + el.className.trim().split(/\s+/).join('.') : ''));

          const term = q('.hero .term');
          return {
            innerH: window.innerHeight,
            hScroll: document.documentElement.scrollWidth - vw,
            bleed: [...new Set(bleed)].slice(0, 5),
            hero: box(q('.hero')),
            chipTop: box(q('.hero .chip'))?.top ?? null,
            term: box(term),
            termBase: term ? getComputedStyle(term).fontSize : null,
            statsBottom: box(q('.hero .proof'))?.bottom ?? null,
          };
        }),
      });

      if (!AUDIT_ONLY) {
        const slug = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '-');
        await page.screenshot({ path: join(OUT, `${slug}-${v.name}-${theme}.png`) });
      }
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();

const pad = (s, w) => String(s).padEnd(w);
const yes = b => (b ? 'yes' : 'NO');
console.log(`\n${pad('viewport', 16)}${pad('theme', 7)}${pad('size', 11)}${pad('base', 6)}${pad('terminal', 13)}${pad('aspect', 9)}${pad('term in fold', 14)}${pad('stats in fold', 14)}hScroll`);
for (const r of rows) {
  const t = r.term;
  console.log(
    pad(r.viewport, 16) + pad(r.theme, 7) + pad(r.size, 11) + pad(r.termBase ?? '-', 6) +
    pad(t ? `${t.width.toFixed(0)}x${t.height.toFixed(0)}` : '-', 13) +
    pad(t ? `${(t.width / t.height).toFixed(2)}:1` : '-', 9) +
    pad(t ? yes(t.bottom <= r.innerH + 1) : '-', 14) +
    pad(r.statsBottom == null ? '-' : yes(r.statsBottom <= r.innerH + 1), 14) +
    (r.hScroll > 0 ? `+${r.hScroll}px !!` : 'none'));
}

const problems = rows.filter(r => r.hScroll > 0 || r.bleed.length || r.errors.length);
if (problems.length) {
  console.log('\nProblems:');
  for (const r of problems) {
    if (r.hScroll > 0) console.log(`  ${r.viewport} ${r.path} scrolls horizontally by ${r.hScroll}px`);
    if (r.bleed.length) console.log(`  ${r.viewport} ${r.path} overflows: ${r.bleed.join(', ')}`);
    for (const e of r.errors) console.log(`  ${r.viewport} ${r.path} console: ${e}`);
  }
} else {
  console.log('\nNo horizontal overflow or console errors.');
}
if (!AUDIT_ONLY) console.log(`\n${rows.length} screenshots in ${OUT}/`);
