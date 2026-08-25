---
title: 'The model should not be writing coordinates'
description: 'A schematic that passes ERC can still be unreadable, because ERC checks the net graph and nothing checks the drawing. copperhead now has the model author intent and a deterministic engine compute every coordinate.'
date: 2026-07-31
kind: 'Engineering'
---

There is a failure mode that looks like success. The schematic passes ERC. Every net
is right, every part is real, the pin types check out. And then you open it and the
refdes text sits on top of a symbol body, the whole design is crammed into 40% of
the page, nothing flows left to right and the title block is empty.

Nothing caught that, because nothing was looking. ERC checks the net graph. It has
no opinion about the drawing.

## Where the coordinates were coming from

Until this week, every number in a copperhead schematic was a token the model
sampled. Placement was not computed. It was generated, one s-expression at a time,
through the same text-edit tool the agent uses on markdown.

That is expensive in the obvious way. On one recorded run, the schematic stage took
65 minutes, and five of its forty turns emitted 89% of the run's 170,920 output
tokens. Every one of those oversized turns was a geometry-emission turn, and every
observed failure in that run, provider error, budget exhaustion, stall, landed on
one of them.

It is also expensive in a less obvious way. If placement is sampled, it is different
every time. There is nothing to regression-test, nothing to pin and no way to say
that a fix stayed fixed.

## Intent in, geometry out

The model no longer writes geometry. It writes a netlist intent file: parts, nets,
group assignments, declared no-connects and a few hints. No coordinates, and not by
convention. The schema has no field for one.

```json
{ "ref": "U1", "libId": "Regulator_Switching:TPS54560BDDA",
  "value": "TPS54560BDDA", "group": "Converter" },
{ "name": "SW", "kind": "signal",
  "pins": ["U1.8", "C4.2", "D1.1", "L1.1"] }
```

A rule-based engine turns that into the sheet. It classifies nets by pin electrical
type, works out which capacitor decouples which chip, tiles the subsystem groups
left to right, places parts within a group by layering and barycenter ordering on an
integer 1.27mm grid, hangs rails up and grounds down, decides per net whether a
short local wire or a pair of labels reads better, then sizes the paper to the
content.

For the DC-DC converter we drafted this week, the model's authored surface is 45
lines. The sheet is 3,614. About a third of the emitted file is symbol definitions
copied verbatim out of the KiCad libraries, authored by nobody.

## Determinism is the whole point

Identical intent produces a byte-identical file. That is a hard guarantee, and it
took some care to hold. Identifiers are UUIDv5 derived from stable semantic paths
rather than generated fresh. The title block date comes from the intent file instead
of the wall clock. Symbol definitions are vendored into a committed project cache
on first use, so a KiCad library upgrade cannot silently change your output.

Which means a drafted board can be a test fixture. We keep control boards in the
repository: an LDO, a transistor switch and now a buck converter. CI re-drafts each
one and compares it to a committed reference byte for byte. A single changed
coordinate fails the build.

## What we gave up

You cannot hand-edit an engine-drafted schematic. The agent will not do it either.
Point the edit tool at a sheet carrying the engine's generator marker and it refuses,
and tells you to revise the intent instead. A hand edit would be destroyed by the
next re-draft anyway, and it would break the check that says the sheet still matches
its intent.

This narrows the repair surface deliberately. Anything expressible as intent is
fixable. Nothing else is.

It also means an earlier claim on this blog now needs scoping. copperhead still
never regenerates a schematic it did not draft, so surgical edits remain the rule
for hand-drawn projects and for any board you bring to it. But for sheets the engine
authored, regeneration from intent is the mechanism, not a fallback.

## The first hard board

The two original control boards were tame. So we pointed the engine at a 12V to 5V,
20W buck converter: a TPS54560B with an enable-divider lockout, a compensation
network, a bootstrap capacitor, a Schottky catch diode, a feedback divider with a
feedforward capacitor, 24 parts and 11 nets and 18 endpoints on ground.

It produced a schematic that passed ERC with zero violations and failed the
legibility checker with three errors.

A rail symbol hanging below an inductor threw its "+5V" text back up onto the coil,
because the text offset was chosen by net class instead of by which way the stub
pointed. One net label landed on another net's wire, because nets are drafted in
name order and an earlier net cannot see routing a later one has not laid down yet.
And the converter carries ground on both pin 7 and its thermal pad pin 9, at one
coordinate, so the engine stacked two identical ground symbols and two identical
labels exactly on top of each other, invisible in the render and wrong in the file.

Three fixes later the same board drafts at zero errors, with a legibility score of
86 where it had been capped at 40. The two older control boards came back
byte-identical, so nothing regressed, and the buck converter is now a third pinned
reference.

## Why that is worth something

An engine that makes a mistake makes it the same way every time. That is not a
consolation, it is the property that makes the mistake findable, fixable and
provably gone. A model that samples placement can produce the same three defects and
you would never be able to tell, because it would not produce the same file twice.

## What this does not do yet

The engine drafts in one pass. It does not run the legibility checker against its
own output and re-place until clean. It has local repair moves, the router tries
several trunk positions before falling back to labels, and a colliding label will
walk itself outward along its stub, but there is no draft-check-redraft cycle inside
the engine.

That boundary has a consequence worth stating plainly. The agent's only lever is the
intent file, so a legibility error caused by the engine's own placement is not
something the agent can repair. It would keep the obligation open, refuse to finish
and eventually stop for a human, correctly and uselessly. All three defects above
were of exactly that kind. They needed an engine change, not a better prompt.

Closing that gap means either giving the engine a self-repair pass or treating any
engine-caused legibility error as a hard failure of the draft rather than a task
handed to a model that cannot do it. We are going with the second, first.
