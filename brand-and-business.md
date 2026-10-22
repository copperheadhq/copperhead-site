# Copperhead - Brand, Website, Pitch & Business

_(Companion to SPEC.md and pitch-script.md. Website copy follows Chouhan voice: precise, confident, understated. No em-dashes in customer-facing copy.)_

---

## 1. Brand

### Identity

- **Name:** Copperhead (capital C in prose; the logo wordmark and the CLI command stay lowercase `copperhead`)
- **One-liner:** Cursor for circuit boards.
- **Tagline options:**
  - "The agent that lives in your copper." (primary)
  - "From prompt to manufacturable board."
  - "Hardware design at software speed."
- **Elevator:** Copperhead is an open source AI agent that takes a product brief and produces a complete, verified hardware design: schematics, a first-draft board, gerbers, firmware and a build plan. It works on real KiCad files in your own repo, and nothing is done until the tools agree.

### Voice

- Engineering-grade, not marketing hype. Claims are verifiable or absent.
- Say what it does not do (no autorouting perfection, human stays engineer of record). Honesty is the differentiator.
- Vocabulary: verified, traceable, open, yours. Avoid: revolutionary, magic, effortless.

### Visual direction

- **Colors:** copper (#D08F39) on near-black (#121212), with PCB soldermask green (#0E5A38) or ENIG gold (#C9A84C, the shared brand gold from chouhan.ai) as accent. White text.
- **Motif:** PCB traces. Logo: a snake formed from a single copper trace with a via as the eye. Fallback for today: wordmark `copperhead` in a mono font (JetBrains Mono / IBM Plex Mono) with the "o" rendered as a via (annular ring).
- **Texture:** schematic grid dots, thin trace lines as section dividers.
- **Terminal aesthetic** for demos: dark background, copper prompt.

### Naming conventions

- CLI: `copperhead` · Repo: `animesh-chouhan/copperhead` · npm: `@chouhan/copperhead`
- Hosted product (later): "Copperhead Cloud". Never "Copperhead AI".

---

## 2. Website (single landing page, ship today)

Stack suggestion: one static HTML page, same infra as chouhan.ai. Section order:

1. **Hero** - wordmark + tagline. H1: "Cursor for circuit boards." Sub: "An open source AI agent that designs, documents and verifies real PCBs from a prompt. On your files, in your repo." Two buttons: `GitHub` (primary), `Watch the demo` (video). Background: faint animated ratsnest resolving into routed traces.
2. **The demo** - the 60-second video, autoplay muted. Caption: "A real board, redesigned in one prompt, checks passing."
3. **How it works** - the six-step loop from the blog (§4.0 of SPEC.md), as a horizontal stepper: Docs → Propose → Edit → Propagate → Verify → Rationale. One line each.
4. **Spec-gated in, verification-gated out** - the two invariants as a diptych. Left: "Nothing starts without a spec." Right: "Nothing is done until the tools agree." This is the trust section.
5. **What comes out** - the outputs grid: schematic, board, gerbers, DXF/STEP, renders, ordering BOM, firmware, dev plan. Each with a real file icon and a sample from open-telegraph.
6. **Proof** - Open Telegraph card: board render, "designed to a 25 µA sleep budget, every decision public", link to repo + blog post.
7. **Why open** - three lines from the Chouhan philosophy: transparency scales, trust does not. Apache-2.0 badge, KiCad + OpenSpec logos.
8. **Quickstart** - the four-command install block, copy button.
9. **Footer** - chouhan.ai, GitHub, X, license links.

Copy rule: every claim on the page must be demonstrable in the repo today. Nothing aspirational above the fold.

---

## 3. Monetization

### Model: open core + hosted (GitLab/Grafana pattern)

| Tier           | Price                | What                                                                                                                  | Who                                 |
| -------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **OSS**        | Free forever         | Full CLI, all modes, bring your own API key, public or private use                                                    | Individuals, hobbyists, funnel      |
| **Cloud**      | $49/user/mo (launch) | Hosted agent (no keys to manage), private repo support, run history UI, live viewer hosted, team sharing              | Small hardware teams, consultancies |
| **Team**       | $199/user/mo         | CI integration (check-as-a-service, PR review bot), constraint libraries shared across projects, priority models, SSO | Funded startups, 5–50 EE orgs       |
| **Enterprise** | Custom               | Self-hosted/VPC, Altium format support, audit exports (the OpenSpec paper trail is a compliance feature), SLAs        | Regulated: medical, aero, defense   |

### Why customers pay when the tool is free

The design runs locally forever. What's paid is _operational_: hosted compute and keys, team memory (shared constraint libraries), CI enforcement and the audit trail as a compliance artifact. Same reason GitHub charges while git is free.

### Unit economics sanity check

- A respin costs $5–50K and 6–8 weeks. One caught strapping-pin trap pays for years of Team tier.
- EE consultancies bill $150–300/hr; Copperhead compresses exactly the billable drudgery (doc sync, BOM checks, verification loops). They are both customer and channel.
- LLM cost per `do` run: ~$0.10–1.00 (tool-loop, small context). Gross margin at $49/mo survives heavy use; cap runs or metered top-ups beyond fair use.

### Sequencing

1. **Now → 3 mo:** OSS only. Metric: boards fabbed by strangers. Waitlist for Cloud (collect via Dodo Payments checkout page, $0 reserve).
2. **3–9 mo:** Cloud beta at $49. First 100 users hand-onboarded from the repo's issue traffic.
3. **9–18 mo:** Team tier + CI bot (the GitHub PR "hardware check" is the viral wedge inside orgs).
4. **18 mo+:** Enterprise/Altium once pull exists; never before.

---

## 4. GTM (expanded from pitch)

- **Wedge:** the open repo + the Open Telegraph proof board. Hardware people trust what they can inspect.
- **Launch channels, in order:** Hacker News (Show HN: the blog post + video), r/PrintedCircuitBoard + r/embedded, KiCad forums/Discord, Hackaday tip line (they cover open hardware tooling reliably), X hardware/EE community.
- **Content engine:** every interesting `do` run is a post. "The agent refused my pullup" is a better ad than any banner.
- **US beachhead:** crowdfunded-device startups (Crowd Supply ecosystem is exactly our buyer and already open-hardware native), YC hardware companies, defense-tech's EE shortage.
- **Partnerships, not fights:** Quilter (we hand them DRC-clean drafts to optimize), fab houses (JLC/PCBWay export profiles built in; referral potential).

---

## 5. Demo-day slide outline (5 slides behind the 5 minutes)

1. **Title:** copperhead. Cursor for circuit boards. (wordmark, one line, nothing else)
2. **Problem:** photo of a real schematic + the five docs. "One change touches all of these. They drift. Drift ships to fab at $5–50K per respin."
3. **[LIVE DEMO - no slide, terminal + viewer]**
4. **Delta 4:** the before/after table. Months→days, specialist→anyone, drift→build failure. "Users never go back."
5. **Ask/close:** global on day 0 (KiCad's install base), US GTM (Crowd Supply/YC hardware), open core business. "The Morse key is what the workflow made first."

---

## 6. Launch checklist (today, non-code)

- [ ] Repo: description, topics, Apache-2.0 LICENSE, README with GIF
- [ ] 1-min video recorded (script in pitch-script.md), uploaded, linked in README
- [ ] Landing page live (even a single section: hero + video + GitHub link)
- [ ] X thread drafted from the blog post (post after submission, tag @antler)
- [ ] Team name + members ready for the form
- [ ] Submission at 5:15 PM, not 5:29
