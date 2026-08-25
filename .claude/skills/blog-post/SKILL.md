---
name: blog-post
description: Write or edit a post for this site's blog or research collection, in the house voice. Use whenever the task is drafting a new post, rewriting an existing one, writing a section or intro for one or reviewing a draft for tone. Enforces no em dashes, no serial commas, prose that reads as written by a person and continuous argument rather than bullet scaffolding. Triggers on "blog post", "write a post", "draft an article", "research writeup", "make this sound less like AI", "rewrite this section".
---

# Writing a post

## Before drafting

Read the two existing posts closest in kind to the one you are writing. They are the
specification for the voice; this file only names what they do.

- `src/content/blog/` for argument posts. Frontmatter: `title`, `description`, `date`,
  `kind`, optional `deck`.
- `src/content/research/` for method and measurement. Same fields plus `status`, and
  `status` is load-bearing: an article about an unrun benchmark must not read like one
  reporting results.

Schema lives in [src/content.config.ts](src/content.config.ts). `description` is both
the index card blurb and the meta description, so write it as one or two full
sentences, not a fragment.

Prose is hard-wrapped at 88 columns. Frontmatter values, tables, component props and
code blocks are exempt and stay on one line. `copperhead` is lowercase everywhere,
including sentence-initial.

If the post needs numbers you were not given, ask for them. Never invent a token
count, a runtime, a price or a benchmark result. Every number in these posts is read
off a real run and a reader may go check it.

## Rule 1: no em dashes

Not one, anywhere in prose. No `—`, no `–`, no ` - ` standing in for one. This holds
in MDX comments too, since those are read during review.

An em dash is nearly always a joint that a different piece of punctuation makes
better. Pick from these, in rough order of preference:

- **Comma pair** for an aside: `every observed failure in that run, provider error,
  budget exhaustion, stall, landed on one of them`
- **Colon** when the second half delivers what the first half promised: `Software has
  an answer to this: the build breaks.`
- **A full stop.** Two shorter sentences beat one hinged sentence most of the time:
  `That is drift. It is the default state of every hardware project past a certain
  size.`
- **Rewrite the clause** so the interruption is gone entirely.

Ranges in prose spell the word: `five to eight weeks`, `12V to 5V`. Hyphens are fine
inside tight technical references (`stages 1-6`, `rule-based`).

## Rule 2: no serial comma

`speed, scale and simplicity`, never `speed, scale, and simplicity`. A list takes a
comma between each item and nothing before the closing `and` or `or`. Same for `or`
lists, and for the same reason: it is one more mark the sentence does not need.

If a list reads ambiguously without it, do not put the comma back. Reorder the items
or split the sentence, which is the better fix anyway.

`npm run lint:prose` checks this rule and rule 1 over both collections, and CI runs
the same command. It cannot tell a series from two joined clauses, so a sentence it
flags wrongly gets recorded in `scripts/prose-allow.json`. Read the sentence twice
before you put it there. If the comma is closing a list of three, delete the comma.

## Rule 3: language a person would actually use

Write like an engineer explaining something to another engineer who is smart but has
not seen this system. Plain words, concrete nouns, working verbs.

Never ship these:

- Openers: `In today's fast-paced world`, `In the world of`, `Imagine a scenario`,
  `Let's dive in`, `Have you ever wondered`
- Verbs and adjectives: `delve`, `leverage`, `utilize`, `unlock`, `harness`,
  `seamless`, `robust`, `powerful`, `cutting-edge`, `game-changing`, `revolutionary`,
  `comprehensive`, `myriad`, `plethora`
- Frames: `It's not just X, it's Y`, `X isn't just about Y`, `more than just`,
  `the key takeaway is`, `at the end of the day`, `it's worth noting that`
- Enthusiasm: `We're thrilled to`, `exciting`, `simply put`, exclamation marks
- Closers: `In conclusion`, `To sum up`, a final paragraph that restates each section

Also avoid the shapes that give a model away even when the words are fine:

- The abstract tricolon: `speed, scale and simplicity`. Three concrete items are
  fine. Three abstractions are filler.
- The rhetorical question answered in the next sentence.
- Hedging stacks: `it could potentially be somewhat helpful`. Claim it or drop it.
- Symmetry as a tic: every paragraph the same length, every heading the same grammar,
  every list three items long.
- Explaining that you are about to explain: `Let's look at how this works.` Just work.

And the rhetorical formulas, which are the hardest tell to see in your own draft
because each one reads well on its own. They give the post away by recurring.

- The negation reveal: `This is not a misconfiguration. It is the tier.` `Not shorter
  round trips, and not fewer database calls. Fewer round trips.` One of these in a
  post is a flourish. Three is a template.
- The paired reveal: `One of those is a performance bug. The other is the worst thing
  this platform can do.` Same shape as above with the halves spread across two
  sentences.
- `It is not X, it is Y`, and its cousin `X is not a Y, it is a Z`.
- The sentence fragment dropped in for drama: `Two long crossings to learn nothing.`
  Fine once. By the fourth the reader hears the machine.
- A closing maxim on every section. Some sections should end on a fact and stop.
- Leaning on a word for emphasis rather than on the sentence: `exactly`, `the whole`,
  `nothing`, `one`. Once each in a post, and only where it is load bearing: `the rule
  is conditioned on cookie absence and on nothing else` earns it.

Keep the one or two contrasts that carry real weight and rewrite the rest flat. A
paragraph that states the finding and stops is not a weaker paragraph.

Contractions are allowed and rare. Roughly one per five hundred words, used when a
sentence needs to land lighter. Default to `it is`, `does not`, `cannot`.

Dry understatement is the house humour, and it is always attached to something real:
`It would keep the obligation open, refuse to finish and eventually stop for a human,
correctly and uselessly.` Never a joke for its own sake.

## Rule 4: flow

The post is one continuous argument. Headings mark turns in it; they are not chapter
labels stuck on top of independent blocks.

- Open cold, on a specific situation or a claim with an edge. `There is a failure mode
  that looks like success.` No throat-clearing, no summary of what the post will
  cover, no restating the title.
- Vary sentence length on purpose. Let a six-word sentence land after a long one.
  `The circuit is the fun part.` `The absence was the engineering.` Uniform cadence is
  the single loudest AI tell.
- Carry the thread across the seam. Each section should follow from the one above it,
  and a heading should be readable as the next move in the argument: `Where the
  coordinates were coming from`, then `Intent in, geometry out`, then `Determinism is
  the whole point`.
- Headings are sentence case and say something. Not `Benefits`, not `Key Features`,
  not a gerund pileup.
- Prose over bullets. A list is correct for genuinely parallel items, such as the
  three defects a checker found. It is wrong for reasoning, which needs connective
  tissue that bullets delete. Look at any existing post: mostly paragraphs.
- Paragraphs run two to five sentences.
- Prefer the specific: `the board draws 800 microamps in sleep instead of 25 and the
  coin cell is dead in a week` over `power consumption issues`.
- Second person is welcome when the reader is the one acting: `you open it and the
  refdes text sits on top of a symbol body`.

## Rule 5: every number belongs to a labelled run

A post reporting measurements makes a promise the reader can check, and the
provenance is the first thing an edit breaks.

- One run per column. If the before and after come from different days, put the dates
  in the header. Never merge two runs into one `After` column, which is what happens
  by accident when a draft is updated from a newer set of notes and the figures beside
  it are not.
- A screenshot in the post is canonical. Prose, tables, captions and alt text all have
  to agree with the image next to them, because a reader compares them in seconds.
- When two runs disagree, publish both and say what they agree on. `Santiago 534 ms
  and then 756` is a finding about how stable the thing is. Silently choosing one is
  not a finding at all.
- Keep measured and inferred apart. A value back-solved from a model cannot then be
  evidence for that model, and a delta column of zeroes is arithmetic rather than a
  result. Say which rows had both quantities measured.
- `Consistent with` is not `confirmed`. Where the explanation is a hypothesis, say so
  and name the evidence that would settle it: the responding colo, a traceroute, one
  run against a cacheable URL.

## Close honestly

Every post here ends on a limit rather than a victory lap. `What this does not do
yet`, `What it refuses to claim`, `What it does not prove`. Name what is unfinished,
what the change cost or what you would need to believe the claim. Then, if there is
a next post, one line linking to it.

That section is what makes the rest credible. Do not drop it.

## Pictures

Two kinds, and they are not interchangeable.

### The title card

Every post carries one. It is authored, not screenshotted: add an `<article
class="card" data-slug="<the post's slug>">` block to `diagrams/post-cards.html`,
copying the one above it, then run

```bash
node scripts/render-cards.mjs <slug>
```

which writes `src/assets/cards/<slug>-{light,dark}.png` at 2400x1260, read at
1200x630. Wire it up with two lines of frontmatter. `cover` is the bare slug,
carrying no directory, no theme suffix and no extension, and `coverArt` in
[src/blog.ts](src/blog.ts) resolves it to the pair:

```yaml
cover: '<slug>'
coverAlt: 'A copperhead title card: <what the drawing shows, not what the post argues>.'
```

A `cover` naming a card nobody rendered throws at build time rather than
shipping a hole, so render before you write the frontmatter. For art from
somewhere other than the renderer, give `cover` a site-root path carrying a file
extension and it is used unoptimised on both themes:

```yaml
cover: '/blog/cards/<slug>.png'
```

The card is the wordmark, a rule, the title and one piece of geometry. Nothing
else. The geometry is the site's own PCB language, a trace and a pad and a via
in copper hairlines. It should diagram the post's argument: two traces that
diverge for a post about drift, one trace through two gates for a post about
gating. If the argument has no shape, the fiducial mark on its own is a fine
answer.

Everything is drawn at three times the size it is read at: the card is authored
at 1200px wide and its main job is a 405px grid cell. So nothing may be set
small. A date, a byline or a domain along the bottom lands under five pixels
tall in the grid and reads as noise, which is why the layout has no bottom row.
Do not add one. Do not set the title in anything but the display face, and do
not reach for an illustration.

### Figures inside the post

Screenshots come off somebody else's dashboard carrying their furniture: a
title bar, a live control that means nothing in a still, a vendor watermark. It
is not evidence and it does not belong in the post. Run every figure through:

```bash
node scripts/normalise-figures.mjs --trim src/assets/ttfb-summary-*.png   # one set
node scripts/normalise-figures.mjs --check src/assets/ttfb-*.png          # report only
```

`--trim` crops to the content's own edges, drops the chrome at either end, adds
a uniform 40px margin and puts the whole set on one canvas, top-aligned so the
same row of a before and an after lands at the same height on the page.

Pass the files of one comparison set together, not the whole directory. The
canvas is derived from the set, and a before and an after that do not share one
occupy different space on the page, which a reader will read as a difference in
the data.

Three things it does that are worth knowing:

**Chrome is detected by size, not named by a flag.** A leading or trailing block
under 12% of the height, separated by a white gutter, is chrome. Of the two runs
of the same report in the TTFB post, one carried the vendor watermark and the
other did not, so `--drop-bottom` would have been right for one and would have
eaten the data out of the other.

**It never upscales.** Ask for a 1600px canvas and you get whatever of it the
set can actually supply. Scaling a 1,100px screenshot up invents no detail, it
only makes the file bigger and the type softer.

**It pads and never crops the content.** A screenshot is evidence, and cropping
one to fit a layout throws away the part of the evidence that did not fit. The
chrome around it is not evidence, which is the whole distinction.

Do not give the whole blog one aspect ratio. It is the obvious first answer and
it is wrong: every figure renders at 100% of the column, so padding a tall
screenshot sideways to reach 16:9 is the same thing as shrinking its content. A
2264x1662 report forced into 16:9 came out at 613px of content in an 800px
column and its text stopped being readable.

Do not pass a `width` to `<Image>` either. The source is already the right size
and the column already sets `width: 100%`; a per-figure width is one more number
to keep in sync and it will drift.

Every figure gets a `<figcaption>` saying what the reader is looking at and what
to notice, not a repeat of the alt text. Animated GIFs are the one exception,
since they cannot be padded losslessly.

## Check before finishing

```bash
f=<path to the post>   # .md or .mdx, under src/content/blog/ or src/content/research/
node scripts/lint-prose.mjs "$f"                      # rules 1 and 2, same check CI runs
grep -nEi 'delve|leverage|seamless|robust|cutting-edge|game-chang|plethora|myriad|in conclusion|dive in|not just|thrilled|it.s worth noting' "$f"
grep -nEi 'it is not a? ?[a-z]+, it is|one of those is|is not a .*\. it is' "$f"   # reveal formulas
grep -cEi 'exactly|the whole|nothing|precisely' "$f"    # emphasis words, expect a handful
awk 'length > 88 {print FILENAME":"FNR": "length}' "$f"   # prose wrap, ignore tables/props
grep -n 'cover:' "$f"                                 # every post has a title card
node scripts/normalise-figures.mjs --check src/assets/ttfb-*.png   # per set
```

Then read the draft aloud in your head, start to finish. If any sentence has a rhythm
you would not use out loud, rewrite it. If a paragraph could be deleted without the
argument losing a step, delete it.
