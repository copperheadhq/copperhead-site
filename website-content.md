# copperhead.chouhan.ai - Website Content

Final copy, section by section, matching the layout in brand-and-business.md §2. Voice: precise, confident, understated. No em-dashes anywhere in this copy (Chouhan style rule). Every claim is demonstrable in the repo today.

---

## Meta / SEO

- **Title:** Copperhead. Cursor for circuit boards.
- **Description:** An open source AI agent that designs, documents and verifies real PCBs from a prompt. It works on your KiCad files, in your repo, and nothing is done until the checks pass.
- **OG image:** board render on near-black with the Copperhead wordmark
- **URL:** copperhead.chouhan.ai (or chouhan.ai/copperhead)

---

## 1. Hero

**H1:** Cursor for circuit boards.

**Sub:** Copperhead is an open source AI agent that designs, documents and verifies real PCBs from a prompt. On your files, in your repo, with KiCad's own checks as the gate.

**Buttons:** [View on GitHub] [Watch the demo]

**Under buttons (small, mono):** `npm i -g copperhead` · Apache-2.0 · works with KiCad

---

## 2. Demo video

**Caption:** A real board, redesigned in one prompt. The agent edits the schematic, updates every document that references it, then runs ERC until it passes. Nothing you see is mocked.

---

## 3. How it works

**Section title:** A loop, not a chatbot.

**Intro line:** It looks a lot like pair programming, except the codebase is a circuit board.

1. **Start from the docs.** Every decision lives in the design docs, so the agent knows the whole design, not just the part in front of it.
2. **Talk through the change.** You describe what you want. The agent proposes the parts and circuit, and you push back until the reasoning holds up.
3. **Edit the real files.** Changes go straight into the KiCad schematic and the docs, with the same part names and net names everywhere.
4. **Propagate.** Change one value and it carries across every file that references it. The boring, easy-to-get-wrong step is the one the agent is best at.
5. **Check the work.** The agent runs ERC and DRC, reads the errors back and fixes them.
6. **Write down why.** Every decision gets a one-line reason next to it, so the next change does not quietly undo it.

---

## 4. The two invariants

**Section title:** Spec-gated in. Verification-gated out.

**Left card:** **Nothing starts without a spec.**
The agent cannot touch a design file until a validated change proposal exists. The edit tools stay locked until it passes. Every edit traces back to a documented intent.

**Right card:** **Nothing is done until the tools agree.**
Every change is followed by ERC on the schematic and DRC on the board. Violations get read, fixed and re-run. The agent reports success when the checks do.

**Closing line:** The design cannot drift from its requirements, because drift is a build failure.

---

## 5. What comes out

**Section title:** A product, not a chat log.

**Intro:** Give it a brief and it runs to completion. What lands on disk:

| | |
|---|---|
| Schematic | ERC-clean .kicad_sch |
| Board | DRC-clean first-draft .kicad_pcb, honestly labeled |
| Gerbers and drill | Ready for JLC or PCBWay |
| Outline | DXF and STEP for the enclosure |
| Renders | Schematic and board SVGs |
| BOM | Orderable, with part numbers and the reason behind every pick |
| Firmware | A scaffold that compiles, with pins generated from the design |
| Dev plan | Bring-up steps, test points, what to meter first |

**Footnote:** The draft layout is correct, not optimal, and says so itself. LAYOUT.md lists exactly what is solid and what a specialist should redo before fab. Non-optimal is acceptable. Unlabeled non-optimal is not.

---

## 6. Proof

**Section title:** Proven on real copper.

**Card:** [Open Telegraph board render]
Open Telegraph is a pocket-size Morse key: an ESP32-S3, one button, one RGB LED and a battery, designed to live inside a 25 microamp sleep budget. It was built with this workflow, and every decision, every trap caught, and every file is public.

**Links:** [Read the build story] [Browse the repo]

---

## 7. Why open

**Section title:** Open because it has to be.

Hardware engineers trust what they can inspect. Copperhead is Apache-2.0, built on an open stack (KiCad, kicad-cli, OpenSpec), and everything it writes is plain markdown and JSON in your own repository. No proprietary formats, no lock-in, no black box.

Transparency scales. Trust does not. A closed tool asks you to take its word; an open one hands you the source and invites you to check.

Copperhead is an open source project. The same commitment that puts every hardware schematic we make in public applies to the tool that designs them.

---

## 8. Quickstart

**Section title:** Two minutes to your first run.

```
npm i -g copperhead
export ANTHROPIC_API_KEY=...        # or OPENAI_API_KEY
cd your-kicad-repo
copperhead init
copperhead do "add a second RGB LED on an RTC-capable pin"
```

**Under block:** Requires Node 20+ and kicad-cli. The agent refuses to run on a dirty git tree, refuses edits without a validated proposal and refuses changes that break your documented budgets. You will come to like being told no.

---

## 9. Footer

Copperhead · an open source project
[GitHub] [Discord] [X] [chouhan.ai]
Apache-2.0. Hardware designs referenced here are CERN-OHL-S v2.0.
Built at Antler Crackathon, Bengaluru.

---

## Copy bank (for README, social, launch post)

- Cursor for circuit boards.
- The agent that lives in your copper.
- Spec-gated in. Verification-gated out.
- Drift is a build failure.
- Nothing is done until the tools agree.
- A product, not a chat log.
- Proven on real copper.
- You will come to like being told no.
- The Morse key is just what the workflow made first.

## Show HN draft (post-launch)

**Title:** Show HN: Copperhead, an open source AI agent that designs real PCBs in your KiCad repo

**Body:** I design open hardware and got tired of the part of the job that is not engineering: keeping five documents, a BOM and a schematic from drifting apart every time one value changes. So I turned my workflow into an agent. It writes a change proposal first, edits the real KiCad s-expressions surgically, propagates the change across every doc, then runs kicad-cli ERC and DRC and fixes what they flag. It refused to add a pullup that would have leaked 33 uA against my 25 uA sleep budget, and cited the spec line. That was the moment it earned the repo it lives in. Proof board (a pocket Morse key) and the tool are both fully open. Happy to answer anything.
