# copperhead copy

The written half of the brand. `README.md` in this folder covers the mark,
the wordmark, and the palette; this file covers the words that go next to
them, so the same sentences show up on the site, in the repo, in a store
listing, and in a social bio instead of being rewritten from memory each
time.

Pick the block that fits the space you are filling. Do not mix two of them
into a new one, and do not trim a longer block to fake a shorter one when a
shorter one already exists here.

The wordmark is always lowercase `copperhead` when it is set as artwork. In
running prose it is capitalized as `Copperhead`, the way any product name is
at the start of a sentence.

## Name

**Copperhead**

## Tagline

> Cursor for circuit boards.

Four words, for places that give you one line and no room to explain: a
conference badge, a slide footer, the line under the logo. It borrows a
reference point the reader already has, so it only works where the audience
knows what Cursor is. Use the one-liner instead where they might not.

## One-liner

> Copperhead is an open-source AI engineering platform that helps hardware
> teams design, verify, and ship circuit boards.

The default sentence. Repo description, package description, meta
description, the first line of a cold email. It stands on its own with no
prior context, which the tagline does not.

## Short description

> Copperhead turns product requirements into real, editable KiCad designs.
> It helps with circuit architecture, component selection, schematic
> capture, PCB layout, documentation, and verification through
> deterministic ERC and DRC feedback loops.

Two sentences for an about section, a directory listing, or the top of a
README. The list is the point: it names the actual steps of the workflow
rather than claiming the whole of it.

## Social bio

> Open-source AI for electronics engineering. Design, document, and verify
> real PCBs from a written brief.

Sized for the ~160 character bio fields. Pair it with the tile
(`svg/copperhead-mark-tile.svg`) as the avatar.

## Website hero

> ### Design circuit boards with AI.
>
> Go from requirements to verified, editable KiCad designs with an AI
> engineering agent built for real hardware workflows.

- Primary CTA: **Start building**
- Secondary CTA: **View on GitHub**

## Positioning statement

> Copperhead treats every PCB like a codebase: structured intent, traceable
> decisions, version-controlled changes, executable verification, and
> recoverable workflows.

The internal north star. It is what the other blocks are compressions of,
and it is the sentence to check a new piece of copy against. It reads as
written for an audience that already knows what it is looking at, so it
belongs on an about page or in a deck, not on the fold.

## Bolder version

> Hardware engineering is becoming programmable.
>
> Copperhead is the AI-native workspace for designing, reviewing, and
> verifying electronics.

For a launch post, a keynote slide, or anywhere the claim is allowed to be
a claim. It leads with the category rather than the product.

## Developer-focused version

> An open-source AI agent that works directly with your KiCad projects,
> understands datasheets and design constraints, and keeps iterating until
> the board passes verification.

For audiences that will judge it on specifics: Hacker News, the KiCad
forums, a Show HN, an issue thread. It names the file format and the exit
condition, which is what that reader is checking for.

## Pitch version

> Hardware teams still design circuit boards through fragmented tools,
> manual datasheet work, and endless review cycles. Copperhead brings the
> agentic software workflow to electronics, helping engineers move from
> requirements to verified PCB designs while keeping every decision
> inspectable and every output editable.

Problem then answer, for an investor deck, a grant application, or a press
boilerplate paragraph. The longest block here; if you have room for more
than this, write something specific instead of padding it.

## Where each block currently ships

| Surface | Block |
| --- | --- |
| Site hero (`src/components/Hero.astro`) | Website hero |
| `package.json` description | One-liner |
| GitHub repo description | One-liner |
| GitHub / X / LinkedIn bio | Social bio |

If you change a block here, change it on the surfaces above in the same
pass. Copy that only got fixed in one place is how two versions of the
product's name for itself start circulating.
