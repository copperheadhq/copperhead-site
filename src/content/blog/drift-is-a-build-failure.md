---
title: 'Drift is a build failure'
description: 'Hardware design holds dozens of cross-cutting constraints at once, and every change touches artifacts that quietly fall out of sync. That drift is what ships to fabrication.'
date: 2026-07-15
kind: 'Problem'
cover: 'drift-is-a-build-failure'
coverAlt: 'A copperhead title card: two traces leaving one pad and arriving at different places.'
---

Ask a hardware engineer what the hard part of the job is and almost nobody says the
circuit. The circuit is the fun part. The hard part is that a board is a dozen
documents pretending to be one thing.

## The shape of the problem

A single design carries constraints that cut across everything: a sleep current
budget, a set of strapping pins you must not use at boot, RF keepouts, thermal
limits, a connector pinout someone else already committed to. None of them live in
one file. They live in your head, in a spec document, in a comment on the schematic
and in a Slack message from four weeks ago.

Now change one value. A resistor moves from 100k to 10k. That value appears in the
schematic, in the BOM, in the power budget calculation, in the subsystem document
that explains the input stage and in the firmware comment that says why the pin is
configured the way it is. Update four of those five and nothing complains. No
compiler runs. No test fails. The design is now internally inconsistent and it looks
completely fine.

That is drift, and it is the default state of every hardware project past a certain
size.

## Why it is expensive here specifically

Software has an answer to this: the build breaks. Rename a function and the
references that did not follow it stop compiling. The feedback arrives in seconds
and costs nothing.

Hardware has no such reflex. The inconsistency survives review, survives sign-off
and gets discovered at bring-up when the board draws 800 microamps in sleep instead
of 25 and the coin cell is dead in a week. Then you respin: 5,000 to 50,000 dollars
and six to eight weeks, per attempt. For a small team, one unplanned respin is the
difference between shipping and not.

The worst version is the constraint nobody wrote down. Someone deliberately left a
pullup off a pin because the mono plug grounds the ring and an external pullup would
leak 33 microamps against a 25 microamp budget. Six weeks later a reviewer sees a
floating input and helpfully adds the pullup back. The absence was the engineering.
Nothing recorded that, so nothing defended it.

## What the agent is actually for

The propagation step is boring, mechanical and unforgiving, which makes it a poor
use of an engineer's attention and a good fit for a machine. copperhead treats the
design documents as the source of truth, edits the real files rather than
regenerating them, carries every change across every artifact that references it
and then asks KiCad whether the result is valid.

It also refuses. Ask for that 100k pullup on a battery-powered input and it computes
the leakage against the recorded budget, declines, cites the line in the spec that
the change would violate and proposes the internal pullup released before sleep
instead. Being told no by your tools, with a citation, is the point.

The design cannot drift from its requirements, because drift is a build failure.

[How the loop enforces that](/blog/spec-gated-in-verification-gated-out/) is the
next post.
