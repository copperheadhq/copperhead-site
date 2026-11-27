# copperhead-site

Website for Copperhead, the open source AI agent for PCB design.
Live at [copperhead.sh](https://copperhead.sh/).

Single static page. Astro, vanilla CSS, no client framework, no CMS, no backend.
Built to [website-spec.md](website-spec.md); copy is verbatim from
[website-content.md](website-content.md).

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run shots    # screenshot + layout audit against the running dev server
```

## Assets that are still placeholders

The page gates on these at build time, so nothing renders broken while they are
missing. Drop the file into `public/` and it appears on the next build.

| File | Effect when added |
| --- | --- |
| `copperhead-demo.mp4` | the `#demo` section appears |
| `demo-poster.png` | poster frame on the video |
| `copperhead-demo.vtt` | captions track (narration script is in `pitch-script.md`) |
| `open-telegraph.webp` | replaces the placeholder panel in the proof card |
| `og.png` | currently a generated wordmark card; replace with the 1200x630 board render |

## The fold

The hero is built to be one viewport tall: the chip, the headline, the subhead
and the prompt box, with the backer strip across its foot. The rules that keep
it that way all live in `Hero.astro`, and they are worth stating in one place
before anyone edits it.

`.hero` is `min-height: 100svh`, a floor and not a fixed height. On any screen
with the room it is exactly the fold; on one without, it grows and the page
scrolls. It is deliberately not `height`: a fixed height plus
`overflow: hidden` silently shears off whatever sits at the bottom, and what
sits at the bottom is the backer strip.

**Order of sacrifice, when the stack does not fit: nothing shrinks, and the
backer strip goes below the fold.** The copy column and the strip are both
`flex: none`, so this happens by the column simply running long. The prompt box
is the page's one call to action and keeps its full height.

Three things make it fit anyway on most screens:

- **Every vertical gap carries an `svh` term** (`clamp(22px, 4.4svh, 40px)`
  above the prompt box, and the same shape for the rest), so the rhythm
  compresses on a short window instead of overflowing.
- **The headline is `clamp(2.5rem, min(6.4vw, 10svh), 5.5rem)`.** The `min()`
  is the height term: the headline is the one item that can eat the prompt
  box's room on a short window. "AI for PCB design." is 18 characters and holds
  one line at every desktop width. Phones step down to
  `clamp(2.25rem, 10.4vw, 3rem)`.
- **Top padding is `calc(var(--nav-h) + clamp(...))`**: clear the fixed navbar,
  *then* leave a gap. The bar is fixed and the hero cannot see it. A padding
  expressed as a bare `svh` fraction shrinks toward it on a short viewport
  until the announcement chip is resting on the rule. `--nav-h` lives
  in `global.css` so the bar and this padding cannot drift apart.

`justify-content: safe center` on the column centres the stack when there is
slack, so a 4K screen distributes it above and below rather than leaving a hole
underneath. `safe` is load-bearing: it falls back to top-anchored when the
content overflows, which keeps the headline on screen instead of pushing it off
the top.

### The prompt box

The box is a form whose action is the cloud app's guest chat (`links.newChat`
in `src/config.ts`). Start building, or Enter, sends the visitor there with
what they typed in the URL fragment (`#prompt=<text>`), which reaches no
server, log or referrer. Only the script puts it there. The textarea has no
`name`, so with JavaScript off the button still opens the app but the text
stays behind. A `<noscript>` line under the box says so.

The placeholder types itself out: a fixed opening, then six example boards,
each typed, held and erased. The opening and the examples are data attributes
on the field, set in the component's frontmatter. With reduced motion (or no
script) the field shows one static sentence instead.

The field starts as many lines tall as the longest example needs at that
width, so no example is ever cut off. The breakpoints are in `em`, so they move
with the reader's text size; `Hero.astro` lists the measured line counts they
hold. Typing grows the field up to its CSS `max-height`.

### Scaling the terminal

The terminal is one section down, in `RunDemo.astro` (`#quickstart`), beside
the install lines and the brief they point at. `TerminalDemo.astro` has **one
scale knob**: `font-size` on `.term`. Width, chrome height, padding and radius
are all stated in `em` against it, so changing that number resizes the whole
window **at a fixed 1.6:1 aspect ratio**: 733x458 at the 12px base, 550x344 at
9px. Do not add `px` dimensions to that component; they break the ratio and
turn a scaled window into a letterbox.

This matters more here than in most components. The transcript is
`white-space: pre`, so its width in characters and its height in rows are both
set by the type size; scaling the two by the same factor is the only way the
window keeps its proportion *and* keeps the same 72-character lines unwrapped.

RunDemo sets the knob to 9px where the section runs in two columns, from
1181px. That is the narrowest width whose right track still holds the 550px
window, with room for a classic scrollbar (see the note there). Stacked, below
that, the window keeps the 12px base. Two exceptions inside the component, both
deliberate and commented: at 900px and under the window is pinned to the column
and cannot hold ratio, so its leading tightens instead. On phones it drops to
8px and wraps, and the bar chrome opts out of the scale, because proportional
traffic lights would be useless to a thumb.

The `fitViewport` prop adds a `.fold` class that scales the window down further
on short desktops and short phones, for a window that races a fold. The hero's
terminal had it. No page sets it now.

### Checking it

`npm run shots` drives the running dev server through sixteen viewports and
both themes. It waits for every finite animation to finish before shooting, so
the terminal shows its completed `done · verified erc …` readout rather than an
empty window.

```sh
npm run shots                      # everything -> shots/ (gitignored)
npm run shots -- --audit           # no images, just the table
npm run shots -- --only fhd,2k,4k
npm run shots -- --path /,/pricing
npm run check:layout               # the CI gate: every page, seven widths
```

The audit table answers the questions the home page is built around. Does the
hero seat in the fold? Does every placeholder example fit the prompt box it
starts in? Does the quickstart's terminal hold 1.6:1? It also flags horizontal
overflow and console errors. A clipped example fails the run just as those do.
It covers 1280×720 and 1512×945, the laptop sizes that are easy to forget and
exactly where the fold runs out of room.

Needs a Chromium: it finds one from the Playwright cache or a system Chrome, or
set `CHROME_PATH`. `playwright-core` is the only devDependency.

## Typography

Three self-hosted families, subset with `pyftsubset` to the codepoints the page
actually uses:

| Face | Role |
| --- | --- |
| Space Grotesk, variable 300-700 | everything set in a sans: headings, body, buttons, UI labels |
| JetBrains Mono 400 / 700 | code, wordmark, section indices, terminal |
| DM Sans 500 (9pt optical) | the nav bar's 15px tier, and nothing else |

Space Grotesk reads as drafting-adjacent next to a mono. It used to hold only
the display role, with IBM Plex Sans setting text; Plex has been dropped and the
one variable file now does both, since every step of hierarchy the second family
provided is available off its own weight axis. That took the page from five font
files to four.

DM Sans is supermemory's `--font-body`, and the bar is the one component of this
site that sets out to *be* their bar rather than to be measured against it: nav
links, GitHub count and CTA label at their 15px/500. The row was Space Grotesk
400 before, chosen by matching ink coverage — 0.315 against their 0.314 — which
is a match at a distance and not a match. Subset, the third family is 8.5 KB,
less than either Plex weight the page already dropped. It is reachable only
through `--nav`; keep it that way. See the note in `Navbar.astro`.

`Base.astro` preloads the variable face and DM Sans — the latter because it sets
a fixed bar that is above the fold on every page, so discovering it from the
stylesheet lands a round trip late and swaps the nav under the reader.

**Glyphs outside the subset fall back to a system face.** `★` (U+2605) and `↗`
(U+2197) are both outside it; draw them as inline SVG rather than typing them,
or widen the range below for every face.

To re-subset after a copy change that introduces new glyphs, widen the
`--unicodes` range and rerun `pyftsubset`. For the variable face, do not pass
any instancer flags or the weight axis is flattened out:

```
pyftsubset space-grotesk.woff2 --output-file=space-grotesk-var.woff2 \
  --flavor=woff2 --layout-features=kern,liga,calt --no-hinting --desubroutinize \
  --unicodes="U+0020-007E,U+00A0,U+00B5,U+00B7,U+00D7,U+2013,U+2018-2019,U+201C-201D,U+2026"
```

DM Sans is a static instance, not the variable file — 500 is the only weight the
bar asks for. Source it from the Google Fonts CSS API pinned to that weight, then
subset it to the same range:

```
curl -sA "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36" \
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&display=swap"   # latin src: url(…)
pyftsubset dm-sans-500-full.woff2 --output-file=dm-sans-500.woff2 \
  --flavor=woff2 --layout-features=kern,liga,calt --no-hinting --desubroutinize \
  --unicodes="U+0020-007E,U+00A0,U+00B5,U+00B7,U+00D7,U+2013,U+2018-2019,U+201C-201D,U+2026"
```

## Deviations from website-spec.md

The layout was reworked toward a minimal, cursor.com-style treatment. Where that
conflicts with the spec, the visual direction won:

- **Sticky header.** Spec §4 says none in v1, just a floating GitHub link. There
  is now a fixed bar with section links and a GitHub CTA. It satisfies W-2 more
  directly and is CSS-only, so it still works with JS disabled.
- **Trace dividers.** Spec §3 uses them between every section. They appear once,
  above the footer; section boundaries are negative space instead. The via motif
  still carries identity through the wordmark, the favicon and the OG image.
- **Cards.** Spec §4 calls for cards on the invariants and proof sections. Both
  are borderless now.
- **Headings** are plain text rather than copper, and the invariants closing line
  is plain rather than gold. Copper is reserved for CTAs, links, the eyebrow
  labels and the terminal prompt. This also sidesteps the AA large-text-only
  caveat on copper noted in spec §8.
- **Hero visual.** A terminal showing an agent run, the prompt "add a USB-C
  power input to the key" and the tool calls it makes, was the hero's visual.
  It now sits one section down, in `RunDemo.astro`, beside the quickstart. It
  is DOM and CSS keyframes, not a recorded GIF, so the text stays selectable and
  crisp at any zoom for ~6 KB. It stays inside the W-5 rule by taking its
  *format* from the Copperhead source rather than from a screenshot; every tool
  name is real, out of the agent's registry. `TerminalDemo.astro` lists the
  file each part of the layout came from. Keep that map current if the CLI's
  output changes.
- **Hero layout.** Centred single column: chip, headline, subhead and a prompt
  box drawn after the cloud app's own, with the backer strip across the foot of
  the fold. The product render is in `Proof.astro`. See
  [The fold](#the-fold) for the rules that keep the hero inside one viewport.
- **One hero button.** W-2 asks that both hero buttons work. The hero has one,
  Start building, which opens the cloud app's guest chat with what was typed.
  The GitHub link W-2 also asks for is in the fixed navbar, one interaction
  away from any scroll position.
- **A moving placeholder.** Spec §5 allows one flourish (a hero trace that
  draws itself once) and says nothing else animates. The prompt box's
  placeholder types out example boards from script. It stops while the hero is
  off screen or the box has focus. With reduced motion it is one static
  sentence, so W-9 holds.

## Before launch

- **The install line is not publishable as written.** `src/config.ts` sets the
  package to `@chouhan/copperhead`, per the naming convention in
  brand-and-business.md §1. The bare name in website-content.md §8 cannot be
  used: npm returns 404 "Unpublished on 2022-05-28" and permanently reserves
  unpublished names. Publish the scoped package, or change `pkg` in one place if
  the bare name is ever recovered.
- No Discord or X handle appears in any source doc, so those two footer links
  from website-content.md §9 are omitted rather than guessed. Fill them into
  `links` in `src/config.ts` and they render.

## Deploy

Static output in `dist/`, served at [copperhead.sh](https://copperhead.sh/) as Cloudflare
static assets (see `wrangler.jsonc`). CI builds on push to
main and fails the build on serial commas anywhere in the tree (`npm run
lint:prose`), em-dashes, dead links or a transfer budget over 100 KB.

## Repo traffic (`/stats/`)

GitHub keeps repository traffic for fourteen days and then drops it, with no
archive and no API to recover it from. `.github/workflows/repo-stats.yml` runs
[github-repo-stats](https://github.com/jgehrcke/github-repo-stats) once a day
against `chouhanindustries/copperhead` and appends each snapshot to CSVs on this
repo's orphaned `github-repo-stats` branch, so the record accumulates instead of
rolling over. `src/repo-stats.ts` reads those CSVs at build time and `/stats/`
renders them as static SVG, the same no-client-JS bargain as `src/stats.ts`.

**It needs one secret before it will run.** Add a repository secret named
`GHRS_GITHUB_API_TOKEN`. The built-in `GITHUB_TOKEN` cannot stand in: it is
scoped to the repo the workflow runs in, and the traffic being read belongs to a
different one.

Least privilege is a **fine-grained PAT** covering both repositories:

| Repository | Permission | Why |
| --- | --- | --- |
| `chouhanindustries/copperhead` | Administration: **read** | the traffic endpoints |
| `chouhanindustries/copperhead-site` | Contents: **read and write** | push the data branch |

Administration is a read permission here, so the measured repo never grants push
access. Fine-grained tokens have to be enabled for the org. A classic PAT with
`repo` scope also works and is what upstream documents, but `repo` grants far
more than this needs across every repo you can reach.

Until the first run completes there is no data branch, so `/stats/` renders a
short "nothing collected yet" note rather than empty axes. After adding the
secret, trigger the first snapshot by hand from the Actions tab; the page picks
it up on the next Cloudflare rebuild (`cloudflare-refresh.yml`, every 6 hours).

Nothing in this touches `main`, so collection never triggers a deploy. The data
branch also carries a rendered `latest-report/report.pdf`, which GitHub previews
inline if you want the numbers without the site.

## License

[MIT](LICENSE)
