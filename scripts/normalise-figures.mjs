// Prepare screenshots for the blog: trim the chrome, then put a comparison set
// on one canvas so a before and an after occupy the same space on the page.
//
//   node scripts/normalise-figures.mjs --trim a.png b.png
//   node scripts/normalise-figures.mjs --trim --keep-chrome a.png b.png
//   node scripts/normalise-figures.mjs --check a.png b.png
//
// Flags
//   --trim          crop away the outer whitespace, and drop the chrome blocks
//                   at either end: a dashboard's own title bar and live
//                   controls, a vendor watermark
//   --keep-chrome   keep them
//   --chrome N      a leading or trailing block is chrome when it is under this
//                   fraction of the image height, default 0.12
//   --width N       canvas width, default 1600, which is 2x the prose column
//   --margin N      uniform white margin inside the canvas, default 40
//   --gap N         white rows that separate one content block from the next,
//                   default 30
//   --check         report, change nothing
//
// Why blocks rather than fixed pixel crops: these are screenshots of somebody
// else's dashboard, and the runs are taken weeks apart at whatever width the
// browser happened to be. Fixed crops rot. A block is a run of rows carrying
// ink, bounded by white gutters the layout puts there anyway, so "drop the
// title bar" and "drop the watermark" survive the layout moving.
//
// And why chrome is detected by size rather than named by a flag: of the two
// runs of the same report here, one carried the vendor watermark and the other
// did not. A flag that says "drop the last block" is correct for one of them
// and eats the data out of the other. Chrome is small and detached; the report
// is neither.
//
// It pads and never crops the content. A screenshot is evidence; the chrome
// around it is not, and the two are worth telling apart.

import sharp from 'sharp';
import { basename } from 'node:path';

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? Number(argv[i + 1]) : d;
};

const CHECK = flag('check');
const TRIM = flag('trim');
const KEEP_CHROME = flag('keep-chrome');
const WIDTH = opt('width', 1600);
const MARGIN = opt('margin', 40);
const GAP = opt('gap', 30);
const CHROME = opt('chrome', 0.12);

const valued = new Set(['width', 'margin', 'gap', 'chrome']);
const files = argv.filter((a, i) => {
  if (a.startsWith('--')) return false;
  const prev = argv[i - 1];
  return !(prev?.startsWith('--') && valued.has(prev.slice(2)));
});

if (files.length === 0) {
  console.error('usage: node scripts/normalise-figures.mjs [--trim] [--keep-chrome] [--check] <files...>');
  process.exit(1);
}

const INK = 250; // below this a greyscale pixel counts as content

/** Rows carrying ink, grouped into blocks separated by >= GAP blank rows. */
async function analyse(file) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  const inked = [];
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = 0; x < W; x++) if (data[y * W + x] < INK) n++;
    inked.push(n > W * 0.01);
  }

  const blocks = [];
  let start = null;
  let blank = 0;
  for (let y = 0; y < H; y++) {
    if (inked[y]) {
      if (start === null) start = y;
      blank = 0;
    } else if (start !== null) {
      blank++;
      if (blank >= GAP) {
        blocks.push([start, y - blank]);
        start = null;
        blank = 0;
      }
    }
  }
  if (start !== null) blocks.push([start, H - 1]);

  return { W, H, data, blocks };
}

/** Left and right edges of the ink between two rows. */
function columns({ W, data }, top, bottom) {
  let left = W;
  let right = -1;
  for (let y = top; y <= bottom; y++) {
    for (let x = 0; x < W; x++) {
      if (data[y * W + x] < INK) {
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  return [left, right];
}

const prepared = [];

for (const file of files) {
  const a = await analyse(file);
  let blocks = a.blocks;

  if (CHECK) {
    console.log(`${basename(file)}  ${a.W}x${a.H}  ${blocks.length} block(s): ` +
      blocks.map(([t, b]) => `${t}-${b}`).join(', '));
    continue;
  }

  const isChrome = ([t, b]) => (b - t + 1) <= a.H * CHROME;
  if (TRIM && !KEEP_CHROME) {
    while (blocks.length > 1 && isChrome(blocks[0])) blocks = blocks.slice(1);
    while (blocks.length > 1 && isChrome(blocks[blocks.length - 1])) blocks = blocks.slice(0, -1);
  }

  // The kept range can still open or close on blank rows, because a gutter
  // shorter than GAP never split a block. Tighten to real ink, so the uniform
  // margin added below is the whole margin rather than a margin plus whatever
  // slack the screenshot happened to carry.
  const top = blocks[0][0];
  const bottom = blocks[blocks.length - 1][1];
  const [left, right] = TRIM ? columns(a, top, bottom) : [0, a.W - 1];

  prepared.push({
    file,
    was: `${a.W}x${a.H}`,
    region: { left, top, width: right - left + 1, height: bottom - top + 1 },
  });
}

if (CHECK) process.exit(0);

// One canvas for the set: content scaled to a common width, then the tallest
// result sets the height. Top-aligned rather than centred, so the same row of a
// before and an after lands at the same height on the page.
//
// The width is capped at what the set can actually supply. Scaling a 1,100px
// screenshot up to a 1,600px canvas invents no detail, it only makes the file
// bigger and the type softer, and the pipeline downstream is already emitting
// a webp per slot. Ask for 1600 and get whatever of it is real.
const widest = Math.max(...prepared.map((p) => p.region.width));
const CANVAS = Math.min(WIDTH, widest + MARGIN * 2);
const inner = CANVAS - MARGIN * 2;
const scaled = prepared.map((p) => Math.round((p.region.height * inner) / p.region.width));
const HEIGHT = Math.max(...scaled) + MARGIN * 2;

console.log(
  `canvas ${CANVAS}x${HEIGHT}, ${MARGIN}px margin, content ${inner}px wide` +
    (CANVAS < WIDTH ? ` (capped from ${WIDTH}: no upscaling)` : ''),
);

for (const [i, p] of prepared.entries()) {
  const corner = await sharp(p.file)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .raw()
    .toBuffer();
  const background = { r: corner[0], g: corner[1], b: corner[2], alpha: 1 };

  const content = await sharp(p.file)
    .extract(p.region)
    .resize(inner, scaled[i], { fit: 'fill' })
    .toBuffer();

  const out = await sharp({
    create: { width: CANVAS, height: HEIGHT, channels: 3, background },
  })
    .composite([{ input: content, left: MARGIN, top: MARGIN }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await sharp(out).toFile(p.file);
  console.log(`  ${p.was.padEnd(11)} -> ${CANVAS}x${HEIGHT}  content ${inner}x${scaled[i]}  ${basename(p.file)}`);
}
