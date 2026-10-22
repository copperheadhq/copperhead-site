# Use-Case Description — Copperhead

## Agent Objective

Copperhead is an open source AI agent for end-to-end hardware product development. It takes a product brief (requirements, constraints, budgets) and produces a complete, verified electronics design: KiCad schematics, a first-draft PCB layout, gerbers, an orderable BOM, firmware scaffold and a bring-up plan. It also iterates on existing designs: a single natural-language request ("cut the sleep current", "move the key off a strapping pin") is turned into surgical edits on real KiCad source files, propagated across every design document and verified with KiCad's own ERC/DRC tooling before anything is reported done.

The problem it solves: hardware design requires holding dozens of cross-cutting constraints simultaneously (power budgets, strapping pins, leakage currents, RF keepouts), and every change touches multiple artifacts that silently drift apart. Drift ships to fabrication at $5–50K and 6–8 weeks per respin.

## Target Users

- **Hardware engineers using KiCad** (the world's most-used open PCB tool) — professionals and serious hobbyists who want design iteration, doc consistency and verification automated
- **Small hardware teams (1–3 EEs)** at crowdfunded-device and early-stage hardware startups, where one respin is existential
- **Software engineers entering hardware** — technically strong, hardware-inexperienced; the agent's constraint memory and datasheet-trap checks are their guardrails

Technical level is high; interaction is via CLI and a live web viewer, on the user's own git repository.

## Task Examples

- **User**: "Move the key input to a different RTC-capable pin."
  **Agent**: Consults the MCU strapping table in memory, selects an RTC-capable non-strapping GPIO, edits the schematic, updates the pinout and subsystem docs, runs ERC until clean, commits with rationale.

- **User**: "Add a 100kΩ pullup on KEY_DAH."
  **Agent**: Recalls the 25 µA sleep-current budget from constraint memory, calculates the pullup would leak ~33 µA, **refuses the change**, cites the budget's source and proposes using the MCU's internal pullup released before sleep instead.

- **User**: "Cut the sleep current."
  **Agent**: Reviews every part's quiescent draw against the budget registry, identifies offenders, proposes substitutions with datasheet rationale, propagates part changes across BOM/docs/schematic, re-verifies.

- **User**: `copperhead create --brief brief.md` ("a pocket-size Morse key that types over Bluetooth…")
  **Agent**: Runs the full pipeline: spec with flagged assumptions → architecture → part selection → schematic → draft layout → gerbers/renders/firmware scaffold → dev plan. Every stage gated by validation tooling.

- **User**: "Why is there no pullup on GPIO7?"
  **Agent**: Retrieves the recorded rationale ("mono plug grounds the ring; external pullup leaks 33 µA against the 25 µA budget") — decisions whose *absence* looks like a mistake must be explainable.

## Behavioral Guidelines

**Do's**:
- Always write a validated change proposal (OpenSpec) before touching any design file — edits are tool-locked until it passes
- Always verify with `kicad-cli` ERC/DRC after edits; nothing is "done" until the tools agree
- Record a one-line rationale for every design decision, including deliberate omissions
- Flag every assumption (`ASSUMED`) and every unverified part number (`UNVERIFIED`) for human review
- Refuse changes that violate documented budgets/constraints, citing the source

**Don'ts**:
- Never regenerate a whole KiCad file — surgical s-expression edits only
- Never invent part numbers without datasheet-verifiable justification
- Never claim fab-readiness beyond "ERC/DRC clean" — the human remains engineer of record
- Never write API keys or secrets to any file, transcript or commit
- Never access paths outside the user's repository

## Role Descriptions

- **Client**: Copperhead — open source hardware project (chouhan.ai); Copperhead is our open source (Apache-2.0) design agent
- **Customer**: hardware teams and individual engineers adopting the agent on their own repositories
- **User**: the engineer invoking the CLI/viewer — typically also the customer at current stage

## Compliance & Data Sensitivity

- All design data lives in the user's own git repository; the agent stores nothing server-side today (local CLI, BYO API key)
- Transcripts are local (`.copperhead/runs/`) and redact anything matching secret patterns
- Open source designs are public by user choice (CERN-OHL-S for our boards); private repos must never leak into prompts/logs beyond the LLM API call itself
- Future hosted tier: SOC 2 posture, deletable run history, VPC option for defense/medical customers whose designs are export-controlled (ITAR-sensitive customers get self-hosted only)

## Memory Priorities

- **High priority**: Hardware constraints registry (budgets, forbidden pins, keepouts, leakage sums — with source and affected components); design decisions and their rationales; part-selection reasoning; the MCU's datasheet facts (strapping table, RTC-capable pins, ADC limits)
- **Medium priority**: User preferences (preferred vendors, assembly method, MCU families); past refusals and their outcomes; recurring ERC/DRC failure patterns per repo
- **Low priority**: Conversational phrasing, one-off queries
- **Disable**: Emotional state tracking; anything about the user beyond engineering preferences

Memory must be *dual-written*: every constraint lands simultaneously in human-readable docs and the machine-readable registry (`constraints.json`) in the same turn, so human and agent never see different truths.

## Additional Context

- Stack: Node.js/TypeScript CLI; model-agnostic (GPT-5 and Claude tested against the same integration suite); tools are subprocess wrappers around `kicad-cli` and `openspec`
- LLM usage profile: long agentic tool-use loops (up to ~40 turns/run) with moderate context (design docs < ~2k lines + tool results); estimated $0.10–1.00 per `do` run; `create` pipeline runs are 5–10x that. Credits directly fund the free open source tier and demo/benchmark runs
- Verification-first architecture makes LLM output auditable: every claim the agent makes is checked by deterministic tooling (ERC, DRC, spec validation, drift checks, firmware compilation)
- Proof of work: Open Telegraph, a real ESP32-S3 board designed with this workflow, fully public — github.com/animesh-chouhan/open-telegraph
- Built at Antler Crackathon, Bengaluru, July 2026. Contact: chouhanindustries@outlook.com
