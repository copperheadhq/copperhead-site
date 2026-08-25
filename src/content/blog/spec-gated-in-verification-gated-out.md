---
title: 'Spec-gated in, verification-gated out'
description: 'The two invariants that make an agent safe to point at real design files, and the six-step loop that runs between them.'
date: 2026-07-16
kind: 'Engineering'
cover: 'spec-gated-in-verification-gated-out'
coverAlt: 'A copperhead title card: one trace running through two gate pads.'
---

An agent that can edit your schematic is only useful if you can predict what it will
not do. copperhead gets that from two invariants that hold on every run.

## Nothing starts without a spec

The agent cannot touch a design file until a validated change proposal exists. This
is not a convention it tries to follow. The edit tools are locked, and the thing
that unlocks them is a proposal that passes validation.

So a request becomes a written document first: what is changing, why, which
constraints it touches, what the agent expects to happen. You read it. You push back
if the reasoning is thin. Only then does anything move.

The side effect is that every edit traces back to a documented intent. Six months
later the question "why is this pin like this" has an answer that was written at the
time, not reconstructed from a diff.

## Nothing is done until the tools agree

Every change is followed by ERC on the schematic and DRC on the board, through
`kicad-cli`. Violations get read back, fixed and re-run. The agent reports success
when the checks report success, not when it feels finished.

This is the part that makes the output auditable. The claim "this schematic is
clean" is not a language model's opinion about its own work. It is the exit code of
a deterministic tool that has no idea an agent is involved.

## The loop in between

It looks a lot like pair programming, except the codebase is a circuit board.

1. **Start from the docs.** Every decision lives in the design documents, so the
   agent knows the whole design, not just the part in front of it.
2. **Talk through the change.** You describe what you want. The agent proposes the
   parts and the circuit, and you push back until the reasoning holds up.
3. **Edit the real files.** Changes go into the KiCad schematic and the docs, with
   the same part names and net names everywhere.
4. **Propagate.** Change one value and it carries across every file that references
   it. The boring, easy-to-get-wrong step is the one the agent is best at.
5. **Check the work.** ERC and DRC run, the agent reads the errors back and fixes
   them.
6. **Write down why.** Every decision gets a one-line reason next to it, so the next
   change does not quietly undo it.

## Surgical edits, not regeneration

The agent never regenerates a whole KiCad file. Edits are targeted changes to the
s-expression source, which means your diffs stay readable and reviewable, and the
parts of the file nobody asked about stay byte-identical. A tool that rewrites the
entire schematic to move one net has made its own work impossible to review.

## Memory that both sides can read

Constraints are dual-written. Every budget, forbidden pin and keepout lands in a
human-readable document and in the machine-readable registry in the same turn, so
the engineer and the agent never end up looking at different versions of the truth.
A constraint the agent knows but you cannot see is a trap waiting to spring.

## What it refuses to claim

The honesty rules matter as much as the checks:

- Assumptions are flagged `ASSUMED`. Part numbers it could not verify against a
  datasheet are flagged `UNVERIFIED`.
- It never claims fab-readiness beyond "ERC and DRC clean". You remain the engineer
  of record.
- The draft layout is labeled as a draft, with a written list of what a layout
  specialist should redo.
- It refuses changes that break a documented budget, and cites the source.

You will come to like being told no.

Questions about any of this are probably covered in [the FAQ](/blog/faq/).
