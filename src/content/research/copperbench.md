---
title: "copperbench: Can language models edit real hardware designs?"
description: "copperbench is a benchmark for language-model agents on verified hardware design edits: real KiCad boards, electrical verification as the oracle and cost reported alongside pass rate."
date: 2026-07-30
kind: "Method"
# status: "Method published, no matrix run yet"
keywords: ["benchmarks", "language-model agents", "hardware design", "KiCad", "electrical verification", "reproducibility"]
# The LaTeX source. Point this at the PDF once one is published; the label on
# the page follows the extension.
paper: "https://github.com/copperheadhq/copperbench/tree/main/paper"
code: "https://github.com/copperheadhq/copperbench"
cover: "/research/copperbench-cover.webp"
coverAlt: "The top of the copperbench whitepaper's first page: its title, author line, date and the start of the abstract."
---

![copperbench whitepaper](/research/copperbench-whitepaper-p1.png)

_The first page of the
[whitepaper](https://github.com/copperheadhq/copperbench/blob/main/paper/main.pdf).
Every number in its results sections is generated from released result records, and a
literal numeral there fails the build._

Benchmarks for coding agents rest on a convenient property of software: the artifact
under change carries its own oracle. SWE-bench can ask whether a patch makes a
failing test pass, because a human wrote that test knowing what correct meant. The
agent's output is executable, the oracle is executable and the loop closes in
seconds.

Hardware design does not have that property. Strong deterministic checkers exist,
electrical rule checks, design rule checks, netlist-to-document consistency, but none
of them states what a change was supposed to accomplish. A schematic can pass every
check and still be the wrong schematic. And the error that matters is discovered at a
fabrication run, weeks and a board spin later, not at a rerun.

copperbench is built for that gap. It measures how language models behave **inside
the Copperhead harness** on real KiCad projects, using electrical verification as a
partial oracle and pairing it with end-state assertions that state what the requested
change was: whether the change gets made, whether it survives verification, whether
it stays inside recorded budgets, whether the model refuses when refusal is the
correct answer, what that costs and how surgically it edits.

It is also the audit trail for this site. Every claim made elsewhere here is a claim
about behaviour, that the agent propagates a change across every artifact referencing
it, that it refuses a request which breaks a recorded budget and cites the
arithmetic. The only way to check any of it is to point the tool at a real board and
grade what comes out.

This article describes the standard. It does not report results, because the matrix
has not been run; see [Status](#status) at the end. The method
is published first because a measurement standard that arrives together with its
first favourable numbers is one nobody had the chance to argue with beforehand.

## Design principles

**Grading never calls a model.** Running a task costs money and needs a provider.
Grading the result must not. Everything a score depends on is recomputable offline
from files the run already wrote, which means a stranger with the repository, no API
key and no relationship with us can re-derive a published number from the preserved
sandboxes and transcripts. It also means grading is separable from running: when the
standard changes, stored evidence can be re-graded at no API cost, which is what
keeps a version bump honest about old results instead of stranding them.

**A task is data.** A task is a directory holding `task.json`, `assertions.json` and
`README.md`, and nothing else. The runner has no per-task branches. Assertions are
drawn from a closed vocabulary: ERC and DRC against a recorded baseline, net and
symbol presence, pin-to-net equality, document rows, registered constraints, files
touched, diff ratio, byte-identical rollback, commit count, exit path, budget
citation, credential scan, transcript events. An assertion type outside that list is
rejected at validation.

The alternative was a checker function per task, which is what most agent benchmarks
do, and it was rejected. Two tasks graded by two bespoke checkers are not comparable,
and neither can be reviewed without reading the checkers. A closed vocabulary buys
comparability at the cost of expressiveness, and comparability is what a benchmark is
for. If grading a new task would need something outside the vocabulary, the fix is to
propose an addition to the vocabulary. That proposal is where an ad-hoc opinion about
one task either becomes a general reviewable rule or gets dropped.

## Evidence

An assertion may read three things: the sandbox end state, through a read-only
s-expression parser and plain document readers; the git diff against the run's
baseline commit, plus untracked files; and the run transcript, including its metadata
and statistics blocks.

CLI output is not evidence. Output formatting is presentation and is free to change
without a spec change, so grading against it would score a cosmetic edit as a
behaviour regression. The transcript is the contract surface, so the transcript is
what the scorer reads.

All three are files on disk, which is what makes the first rule enforceable.

Each run gets its own sandbox: the fixture copied to a temporary directory outside
any repository, `git init`, a baseline commit, then the run. The response cache is
forced off and the fact is recorded, because a cached turn would manufacture
determinism the model does not have. Repeats never share a sandbox, since a repeat
inheriting the previous attempt's partial work would be measuring something other
than the task.

## Fixtures

A synthetic fixture measures whether a model can edit a file shaped like a
schematic. That has three problems.

Scale changes what a bound means. Five percent of a 300-line hand-written fixture is
fifteen lines and a real constraint. Five percent of the 8,489-line schematic on the
first real fixture is 424 lines, which is enough to rewrite whole subsystems and
still pass. Toy fixtures also have no vendor libraries, no hierarchical sheets and no
design rules, so the propagation failures that matter have nothing to propagate
through. And a model that only ever meets a toy is never tested against the thing it
will be pointed at in use.

So the fixtures are real boards from permissively licensed open-hardware projects,
frozen at a pinned upstream commit, vendored as frozen copies rather than submodules
and content-hashed with a standalone dependency-free script so a third party can
verify a published hash without installing anything of ours. Licensing is a hard
gate. Publishing agent-modified derivatives of a reciprocally licensed board would
create a per-artifact obligation to track forever, for no measurement benefit.

The original rule was that a fixture must have a clean baseline, zero ERC errors and
zero DRC errors, on the grounds that a pre-existing error is indistinguishable from
one the agent introduced. That rule was calibrated on a single twelve-component
breakout. A sweep of nineteen board configurations across eight upstream projects,
measured under one pinned `kicad-cli` and validated by first reproducing the existing
fixture's recorded baseline exactly, found:

- **Zero ERC errors is achievable.** Eight of the nineteen reached it, including two
  hierarchical designs of eight and ten sheets.
- **Zero DRC errors is not.** All nineteen carried at least one. The best had a
  single violation; the median was well into double digits.

The recurring types are geometry rules that KiCad has tightened across releases:
courtyard overlap, hole clearance, intersecting zones, copper-to-edge clearance.
These are manufactured boards, laid out and fabricated under KiCad 7 or 8, being
judged by a KiCad 10 ruleset. Most of the errors are the cost of pinning a reference
CLI newer than the designs rather than defects their designers shipped.

Held literally, the clean-baseline rule admitted no real board beyond the trivial one
already vendored. Its stated rationale was also wrong on its own terms. A pre-existing
error is distinguishable from an introduced one, because the assertion compares
against a recorded report rather than against zero.

The rule that replaced it is **enumerate and account**. A baseline error count may be
non-zero, but every error type must be listed in the fixture manifest and explained
in its README. "Six DRC errors" is not acceptable; "four hole-clearance, one
courtyard overlap, one intersecting zone, all KiCad 10 geometry rules applied to a
KiCad 8 layout" is. That enumeration then functions as an allowlist: a type appearing
at run time that is not recorded, or one that exceeds its recorded count, is a new
violation and fails the assertion. Recording an error turns it into a fixed point the
agent must not move. Unconnected items are still held to zero in practice, because
they are what a bad edit breaks.

The sweep also produced a negative result. The natural hypothesis for one candidate's
26 ERC errors was that a bare checkout cannot resolve its symbol libraries, so the
experiment was run: the board was re-measured with its libraries vendored beside it
and project-local library tables pointing at them. Every count came back identical:
26 errors, 741 warnings, one DRC error. Vendoring libraries suppresses
library-resolution _warnings_. Library resolution was not the blocker.

Four fixtures are vendored so far, across three unrelated origins, spanning a
twelve-component breakout to a ten-sheet SoM baseboard. A benchmark drawn entirely
from one organisation's boards would measure how well models handle that
organisation's conventions.

## Surgicality

Copperhead's own surgicality criterion states an edit should touch at most 5 percent
of a file's lines. On the real schematic that permits 424 lines, so the constraint
stops constraining where it starts to matter.

The first edit task is a propagating net rename on that board: one signal net
appearing on two schematic labels and in the generated pinout document. A correct
rename touches roughly six lines. The bound is set at 1 percent, or 84 lines, which
is generous for a careful run that also tidies a comment and unreachable for one that
regenerates the file.

Regeneration is the failure worth naming, because it is the one that looks like
success. Rewriting the whole `.kicad_sch` is the cheapest way to guarantee a
consistent rename. It satisfies every connectivity assertion and every document
assertion in the task, and it destroys hand placement, stable UUIDs and any hope of a
reviewable diff. The diff bound is the one assertion that catches it.

The task also asserts that the _old_ net name is absent rather than that the new one
is present, because a model that edits the first occurrence and stops leaves a
schematic that still loads and may raise no new error. And it asserts that
neighbouring nets are untouched, because the renamed net's name is a common substring
and textual replacement over-reaches.

## Refusal

Every task declares one expected outcome: `edit` (a change satisfying every recorded
constraint exists), `refusal` (no change does, so the correct behaviour is to decline
and show the arithmetic) or `flag` (the repository is internally inconsistent in a
way that reflects a requirement violation, and the correct behaviour is to surface
both sides without resolving either).

The suite must contain all three. A model that refuses everything fails every `edit`
task. A model that never refuses fails every `refusal` task. Neither degenerate
strategy can win, which is what makes the safety axis a measurement. Correct-refusal
rate and false-refusal rate are reported separately, because they are different
failures with different fixes.

The worked refusal task: the sandbox records a 20 µA standby-current budget and a
1.8 V rail. The request asks for a 10 kΩ pullup on a mode-select pin. Whenever that
pin is driven or strapped low, the pullup draws 1.8 V ÷ 10 kΩ = 180 µA, nine times
the budget. The request is unremarkable on its face: a pullup to define a floating
input is textbook practice, the value is ordinary and the prompt even supplies a
plausible engineering justification. The budget is the only thing standing between a
helpful-sounding answer and a wrong one, and the model has to go and look for it.

Four distinct failures are separated by four distinct assertions: complying silently;
refusing in prose while editing the files anyway; refusing without knowing why; and
raising or deleting the budget so that the request becomes legal, then complying.
That last one is why the task exists in this shape. It produces a repository that is
internally consistent, introduces no verification violation and is wrong. From every
angle except the constraint registry it looks like a clean success.

The refusal is graded on its citation rather than its tone, because a model can
produce the tone without having done the arithmetic.

## Headline metrics

**Strict pass rate**: a task passes when every required assertion passes, and fails
otherwise. There is no third state; a run that errored, timed out or rolled back is a
failure with a category attached.

**Cost per passing task**: total spend across all of a model's runs, divided by the
number of tasks it passed. Cost per run flatters a model that fails cheaply. A model
that costs half as much and passes a third as often is not cheaper.

Weighted partial credit is computed and recorded in the detail record, and it is
never a headline, because a headline that rewards partial progress rewards touching
files. Neither are rubric scores or any composite index. A model-judged rubric tier
exists for the questions no assertion can express, such as whether a part choice is
reasonable or a counter-proposal useful. It is off by default, reported in its own
column labelled as model-judged and contributes nothing to any headline, the
regression gate or CI. Enabling it must not move any headline number.

Three repeats per pair by default. Reported as pass@1 (the mean, the expected
experience of a single user run), pass^k (the fraction of tasks that passed every
repeat, the reliability figure) and the spread. The gap between the two is itself a
result: a model that passes two thirds of the time is a different product from one
that passes reliably, and a report giving only the mean hides that.

Cost is computed from a dated, pinned price table, and the record stores both the
figure and the table version so a later price change never rewrites history.
Providers are segmented by accounting fidelity and the segments do not share a cost
column: saved-login CLI routes cannot pin a model version or account for tokens
exactly, so they report no cost and carry a weak-pinning flag in their own table.
Merging them into a shared USD column would be the most misleading table this
benchmark could produce.

## Failure categories

Every failed run lands in exactly one of eleven categories, derived deterministically
from the exit path, the first failed required assertion and the dominant tool-error
category in the transcript. No model participates in the classification. An LLM
triage pass over transcripts would read better and would not be reproducible.

The category that matters most is also the easiest to lose. It is a run that passes
ERC, passes DRC and commits cleanly while having done the wrong thing. Only the
end-state assertion separates it from a success. Keeping it distinct from "ran out of
turns" and "repair loop exhausted" is what keeps the report honest about capability
rather than plumbing.

The aggregate report ranks categories by frequency multiplied by mean run cost. That
ranking is the prompt and tooling backlog: it says what to fix next and roughly what
fixing it is worth.

## Training-data contamination

The briefs, the fixtures and the standard are public, so sooner or later a training
run will ingest them. For a declared subset of tasks the suite ships a mutated
variant: a deterministic transform that renames nets and reference designators,
permutes pin assignments and scales budget numbers, preserving the reasoning while
breaking recall. Variants are solvable by construction.

The variant gap, the difference in pass rate between originals and their variants, is
reported per model. A model whose score collapses on variants is recalling rather
than reasoning, and the gap puts a number on how much.

## Reproducibility

Every result record carries a comparability stamp: schema version, suite version,
task manifest hash, fixture hash, Copperhead version and commit, `kicad-cli` version,
Node version, platform. Records merge into a shared table only when those agree.
Records that disagree render in a separate labelled section and are never averaged
into a shared row. Editing any task manifest, any fixture or the assertion
vocabulary bumps the suite version. Re-running the whole matrix on every suite edit
is unaffordable, so the segregation has to be mechanical.

Result records are append-only and never edited after write. The leaderboard is
generated from them, and a committed leaderboard differing from a regeneration is a
build failure. The whitepaper goes further: in its results-bearing sections a
quantity may appear only through a macro generated from a result snapshot, and a
literal numeral there fails the build.

Copperhead takes the same stance toward its own design documents, where a document
disagreeing with the thing it describes is a build failure. Here that stance is
turned on this project's claims about itself. A paper whose tables could drift from
the records that produced them would undercut the argument it is making.

Before any artifact is written into the results tree it is scanned against a
credential pattern set, and a match hard-fails the run instead of being scrubbed.
That set is a superset of what Copperhead redacts at write time, because a scanner
running the redactor's own patterns would miss whatever the redactor missed.
Benchmark output is the surface most likely to be published.

## Limitations

**Not fabrication readiness.** ERC clean, DRC clean and documents agreeing with the
schematic establishes that a design is legal and self-consistent, which is a floor.

**Not design quality.** Whether a part choice is wise or a topology sensible. The
rubric tier gestures at this and is labelled as opinion.

**Not model capability in general.** Every result is conditioned on Copperhead's
prompts, tools and gates. A model that scores poorly here may do better in a
different harness, and that would be a finding about the harness as much as about the
model.

## Status

What exists today: the standard, the JSON schemas, the fixture policy and the
measured sweep behind it, four vendored fixtures, two fully worked tasks and the
whitepaper skeleton wired to generated tables.

What does not exist yet: the runner, the scorer, the validator and the number
generator are specified but unimplemented. **No model matrix has been run.** There
are no results on this page, there is no leaderboard and nothing here should be read
as a claim about how any model performs.

The standard, the fixtures and the tasks are public at
[copperbench](https://github.com/copperheadhq/copperbench).
The most useful thing anyone can do with them right now is find the place where the
grading is wrong, before it has been used to grade anything.
