# copperhead-site — Website Specification

Single-page marketing site for Copperhead. Live at **copperhead.chouhan.ai**. Content is final in website-content.md; visual system in brand-and-business.md §1. This spec covers structure, implementation and acceptance.

## 1. Goals

1. Convert visitors to the GitHub repo (primary CTA) and the demo video (secondary)
2. Communicate the two invariants and the proof board in under 30 seconds of scrolling
3. Ship today: hero + video + quickstart minimum; full page preferred
4. Zero backend. Static, fast, boring infrastructure

Non-goals: docs site (lives in the repo for now), waitlist/payments (later, via Dodo checkout link when Cloud tier opens).

**Superseded:** the blog was originally a non-goal (it was to live on chouhan.ai). It now ships on this site at `/blog`, with an FAQ at `/blog/faq`. See §4a.

## 2. Stack

- **Astro** (matches chouhan.ai; shared components/deploy familiarity) — or a single hand-written `index.html` if time is short. Either is acceptable; no client framework, no CMS
- Styling: vanilla CSS with custom properties (no Tailwind; page is small enough that utility classes cost more than they save)
- Fonts: JetBrains Mono (wordmark, code, numbers) + system sans stack for body (`-apple-system, Segoe UI, Roboto, ...`). Self-host the mono WOFF2; no Google Fonts request
- Video: self-hosted MP4 (H.264, ≤ 15 MB) with poster image; YouTube embed as fallback only if bandwidth is a problem
- Analytics: Plausible or GoatCounter (privacy-respecting, no cookie banner needed) or none today

## 3. Design system

```css
:root {
  --bg:        #121212;  /* near-black, whole page */
  --surface:   #1A1A1A;  /* cards */
  --copper:    #D08F39;  /* primary: wordmark, CTAs, links */
  --copper-hi: #DEA754;  /* hover state */
  --gold:      #C9A84C;  /* brand gold from chouhan.ai: badges, highlights, sparingly */
  --green:     #0E5A38;  /* soldermask green: success/check states only */
  --text:      #EAEAEA;
  --text-dim:  #9A9A9A;
  --mono:      'JetBrains Mono', monospace;
}
```

- Dark throughout. No light mode in v1
- **Brand gold:** `--gold` (#C9A84C) is the chouhan.ai brand gold, taken from the `--gold` variable on [chouhan.ai](https://chouhan.ai). Keep it in sync with the parent site; it doubles here as the ENIG-gold accent and the focus-ring color
- **Motif:** thin 1px copper trace lines as section dividers, each terminating in a small via dot (6px circle, copper ring, bg fill). One motif, used consistently, nothing else
- Wordmark: `copperhead` lowercase in mono, the second "o" drawn as a via (annular ring)
- Background texture: faint schematic grid dots (2% opacity) on the hero only
- Buttons: copper fill / near-black text (primary); 1px copper border, transparent (secondary). Radius 4px. No gradients, no shadows
- Type scale: hero H1 clamp(2.2rem, 5vw, 3.5rem); section titles 1.6rem; body 1.05rem/1.7; code 0.9rem
- Max content width 1080px; section vertical padding 96px desktop / 56px mobile

## 4. Page structure

One route (`/`). Sections in order, anchor-linkable:

| # | id | Content (from website-content.md) | Layout |
|---|---|---|---|
| 1 | `#top` | Hero: H1, sub, two buttons, install line | Centered, grid-dot bg, wordmark above H1 |
| 2 | `#demo` | Video + caption | Full-width video, max 900px, poster frame |
| 3 | `#how` | Six-step loop | Horizontal stepper desktop / vertical list mobile; step number in via-dot circle |
| 4 | `#invariants` | Two invariant cards + closing line | Two-column diptych; closing line centered below in gold |
| 5 | `#outputs` | Outputs table + honesty footnote | Two-column definition grid, mono filenames |
| 6 | `#proof` | Open Telegraph card | Image left, text right; links out to repo + blog |
| 7 | `#open` | Why open (three paragraphs) | Single column prose, Apache-2.0 badge row (KiCad, OpenSpec, CERN-OHL-S logos) |
| 8 | `#quickstart` | Code block + footnote | Terminal-styled block (bg #0C0C0C, copper prompt `$`), copy button |
| 9 | footer | Links, licenses, credit line | Single row, dim text |

Sticky header: none in v1 (page is short). A minimal top-right `GitHub` link floats on scroll.

## 4a. Blog

Routes: `/blog/` (index), `/blog/<slug>/` (posts), `/blog/faq/`.

- Posts are markdown in `src/content/blog/`, typed by the collection schema in `src/content.config.ts` (title, description, date, kind). Adding a file is the whole publishing step: index, routing and sitemap follow from it
- The FAQ is a hand-built page rather than a post, because it carries `FAQPage` JSON-LD and native `<details>` accordions. It is listed on the index alongside the posts
- Same design system, no new tokens. Post prose styles live in the post route; the measure is 760px against the 1120px page max
- Structured data: `Blog` on the index, `BlogPosting` per post, `FAQPage` on the FAQ, each alongside the site-wide `SoftwareApplication` node. `og:type` is `article` on posts
- `sitemap.xml` is generated from the collection (`src/pages/sitemap.xml.ts`), replacing the hand-maintained file in `public/`
- No JS on any blog route. The accordions are native `<details>`, so W-1 holds

## 5. Behavior

- Copy button on the quickstart block (clipboard API, "copied" state 2s)
- Video: `preload="metadata"`, click-to-play, never autoplay with sound; `loading="lazy"` below the fold
- Smooth-scroll for anchor links; respect `prefers-reduced-motion` (disable smooth scroll and any trace-draw animation)
- Optional flourish if time allows: hero trace line draws itself once on load (CSS stroke-dashoffset, 1.2s, motion-safe only). Nothing else animates
- No JS beyond the copy button and video poster swap. Page must be fully legible with JS disabled

## 6. SEO / meta

- Title, description, OG image per website-content.md meta section
- OG image: 1200×630, board render on near-black with wordmark (static file, not generated)
- `<link rel="canonical" href="https://copperhead.chouhan.ai/">`
- JSON-LD: `SoftwareApplication` (name, license Apache-2.0, applicationCategory DeveloperApplication, url, codeRepository)
- Favicon: via dot (copper ring on transparent), SVG + 32px PNG fallback
- robots: index all; sitemap.xml (single URL)

## 7. Performance budget

- ≤ 100 KB total transfer excluding video (HTML + CSS + fonts + hero assets)
- Lighthouse ≥ 95 performance/accessibility/SEO on mobile
- Fonts: `font-display: swap`, subset the mono to latin
- Images: AVIF/WebP with PNG fallback; board render ≤ 120 KB

## 8. Accessibility

- Contrast: copper #D08F39 on #121212 is ~6.8:1, passing AA for normal text — body text is still #EAEAEA; copper reserved for headings, links (underlined) and buttons
- All interactive elements keyboard-reachable with visible focus ring (gold outline)
- Video has captions file (the narration script already exists in pitch-script.md)
- Semantic landmarks: header/main/footer, one h1, sections with h2

## 9. Repo & deploy

- Repo: `copperhead-site` (MIT). Description: "Website for Copperhead, the open source AI agent for PCB design. Live at copperhead.chouhan.ai"
- Structure (Astro): `src/pages/index.astro`, `src/components/` (Hero, Stepper, Invariants, Outputs, Proof, Quickstart, Footer), `public/` (video, og, favicon, fonts)
- Deploy: same host as chouhan.ai (GitHub Pages or Cloudflare Pages). DNS: CNAME `copperhead` → host. HTTPS enforced
- CI: build on push to main; link-check step (no dead links to repo/blog)

## 10. Acceptance criteria

- **W-1** Page loads and is fully readable with JS disabled
- **W-2** Both hero buttons work; GitHub button reachable within one interaction from any scroll position
- **W-3** Quickstart copy button copies the exact five-line block
- **W-4** Lighthouse mobile ≥ 95 across performance/a11y/SEO
- **W-5** Every claim on the page is demonstrable in the Copperhead repo today (manual review against README)
- **W-6** No em-dashes anywhere in rendered copy (grep the built HTML)
- **W-7** OG preview renders correctly (test with an OG checker)
- **W-8** Renders correctly at 360px, 768px, 1440px widths
- **W-9** `prefers-reduced-motion` disables all animation
- **W-10** Total transfer ≤ 100 KB excluding video (network panel check)

## 11. Cut order (if time is short)

Ship: hero + video + quickstart + footer (sections 1, 2, 8, 9).
Then add: invariants (4) → how it works (3) → proof (6) → outputs (5) → why open (7).
The page is useful at every stage of this order.
