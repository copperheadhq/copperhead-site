/**
 * The topic pages: one page per thing people search for when they are looking
 * for what Copperhead does. src/pages/[topic].astro renders each of them.
 *
 * They exist because the site had no page whose subject was a search term. The
 * home page was about a tagline and the blog about arguments, so a search for
 * "KiCad AI" had nothing here to land on. Each page below takes one phrase,
 * answers the question behind it in its first paragraph and links to the
 * posts and research that back the answer up.
 *
 * Every claim on them is one the site already makes elsewhere (src/faq.ts,
 * public/llms.txt, the posts). A topic page is a way in, not a place where new
 * promises get made, so a fact that changes is changed at its source first.
 *
 * Bodies and answers are small HTML fragments, as in src/faq.ts, so they can
 * carry links and inline code.
 */
import { links, pkg } from './config';

export interface Topic {
  /** The URL segment: /<slug>/. */
  slug: string;
  /** <title>, 60 characters at most. */
  title: string;
  /** Meta description, 160 characters at most. */
  description: string;
  /** Mono label over the headline. */
  kicker: string;
  h1: string;
  /** The standfirst: the answer to the search, in two or three sentences. */
  lede: string;
  sections: { h2: string; body: string }[];
  faq: { q: string; a: string }[];
  /** Short label for the footer and the related list. */
  nav: string;
}

// The app's new-conversation page: a visitor with no account describes the
// board there, the model asks for the rest and an account comes up only at
// the build.
const cloud = `<a href="${links.newChat}">Copperhead Cloud</a>`;
const stages = '<a href="/blog/from-brief-to-gerbers/">eight gated stages</a>';
const invariants =
  '<a href="/blog/spec-gated-in-verification-gated-out/">spec-gated in and verification-gated out</a>';
const copperbench = '<a href="/research/copperbench/">copperbench</a>';
const install = `<code>npm i -g ${pkg}</code>`;

export const topics: Topic[] = [
  {
    slug: 'ai-pcb-design',
    nav: 'AI PCB design',
    title: 'AI PCB Design: Brief to Gerbers in KiCad · Copperhead',
    description:
      'How AI PCB design works in practice: an open source agent that takes a brief to a schematic, a layout and Gerbers in KiCad, checked by ERC and DRC.',
    kicker: 'AI PCB design',
    h1: 'AI PCB design that works on real KiCad files',
    lede: `AI PCB design means handing an AI agent a description of a board and getting back design files you can open, check and send to a fab. Copperhead is an open source agent that does this in KiCad: it writes the schematic, lays out the board and exports Gerbers. It runs KiCad's own ERC and DRC until they pass before it calls anything done.`,
    sections: [
      {
        h2: 'What AI PCB design is',
        body: `<p>A language model on its own can talk about circuits. It cannot be trusted to design one, because nothing checks what it says. AI PCB design becomes useful when the model is put inside a loop with real tools: it edits the actual design files, an electrical rule check and a design rule check run on the result. The errors go back to the model until there are none.</p>
<p>That loop is the whole product. Copperhead is ${invariants}: no edit happens before a written change proposal exists, and no run reports success before KiCad's checks agree.</p>`,
      },
      {
        h2: 'From a brief to Gerbers in eight stages',
        body: `<p>You start with a brief, a short markdown file that says what the board is for and which numbers it must hit. In ${cloud} a sentence is enough to start: the model asks for the rest and finalizes the brief with you, with no account until you build. From there <code>copperhead create --brief brief.md</code> runs ${stages}:</p>
<ol>
<li><strong>Spec.</strong> The brief becomes a specification with a budgets section that has numbers in it.</li>
<li><strong>Architecture.</strong> The board is split into subsystems, each with a written rationale.</li>
<li><strong>Parts.</strong> Part numbers are chosen against datasheets and written to a bill of materials.</li>
<li><strong>Schematic.</strong> Symbols are placed and wired in a <code>.kicad_sch</code> file until ERC is clean.</li>
<li><strong>Layout.</strong> Footprints are placed and routed in a <code>.kicad_pcb</code> file until DRC is clean.</li>
<li><strong>Outputs.</strong> Gerbers, drill files and a STEP model are written to disk.</li>
<li><strong>Firmware.</strong> A firmware scaffold is generated with its pins taken from the pinout.</li>
<li><strong>Dev plan.</strong> A bring-up and test plan is written for the finished board.</li>
</ol>
<p>Each stage has a gate it must pass before the next begins. Each one is a commit in your repository.</p>`,
      },
      {
        h2: 'What it does well and where it stops',
        body: `<p>It is strongest at the work that eats an engineer's day without needing their judgment: propagating one decision through the schematic, the bill of materials, the pinout and the documents, then proving the result still checks. That is the drift problem, and <a href="/blog/drift-is-a-build-failure/">drift is what ships to fabrication</a>.</p>
<p>It does not replace a hardware engineer. A draft layout from Copperhead is correct, not optimal: it passes DRC, and <code>LAYOUT.md</code> lists what a layout specialist should redo before fabrication. It will not claim a board is fab-ready beyond "ERC and DRC clean", and it never invents a part number it cannot justify from a datasheet.</p>`,
      },
      {
        h2: 'How it differs from an autorouter or a chatbot',
        body: `<p>An autorouter starts from a finished schematic and a placed board and draws the copper. A chatbot answers questions about a design it cannot open. An AI PCB design agent sits across the whole job, from the requirement to the manufacturing files. Its output is the design source itself: plain KiCad files, markdown and JSON in your own git repository, with no proprietary format in between.</p>
<p>We measure it the same way we ask you to trust it. ${copperbench} is our benchmark for language-model agents on real KiCad boards, with electrical verification as the oracle and cost reported beside pass rate.</p>`,
      },
      {
        h2: 'Try it',
        body: `<p>Describe a board in ${cloud} and finalize the brief with the model. You sign in only when you build. Or run the free CLI yourself: ${install}, then <code>copperhead create --brief brief.md</code>. The CLI needs Node 20 or newer, KiCad with <code>kicad-cli</code> on your path and a model API key of your own. The <a href="${links.docs}">docs</a> cover the rest.</p>`,
      },
    ],
    faq: [
      {
        q: 'What is AI PCB design?',
        a: `It is the use of an AI agent to produce printed circuit board design files from a description. In Copperhead's case the agent writes a KiCad schematic and layout from a written brief, exports Gerbers and verifies its work with KiCad's ERC and DRC.`,
      },
      {
        q: 'Can AI design a PCB?',
        a: `Yes, with limits. An agent that runs real checks on real design files can take a simple board from a brief to Gerbers that pass ERC and DRC. The layout is a correct draft and not an optimal one. An engineer remains responsible for reviewing it before fabrication.`,
      },
      {
        q: 'Is there a free AI tool for PCB design?',
        a: `Copperhead's CLI is open source under Apache-2.0 and free. You bring your own model API key and pay your model provider for tokens: roughly 0.10 to 1.00 dollars for a single change and five to ten times that for a full run from a brief.`,
      },
      {
        q: 'Will AI replace PCB designers?',
        a: `No. It takes over propagation and verification work and flags every assumption it makes. Requirements, review and the judgment calls in a layout stay with the engineer of record.`,
      },
      {
        q: 'Can a board with zero DRC errors go straight to manufacturing?',
        a: `Not on that evidence alone. DRC proves the layout obeys its rules, not that the rules or the circuit are right for the product. Copperhead writes a <code>LAYOUT.md</code> stating what is solid and what should be reviewed first.`,
      },
    ],
  },
  {
    slug: 'kicad-ai',
    nav: 'KiCad AI',
    title: 'KiCad AI: Open Source AI Agent for KiCad · Copperhead',
    description:
      'Copperhead is an open source AI agent for KiCad. It edits your .kicad_sch and .kicad_pcb files from a plain-English request and runs ERC and DRC until clean.',
    kicker: 'KiCad AI',
    h1: 'The AI agent for KiCad',
    lede: `KiCad has no built-in AI. Copperhead adds one from the outside: an open source agent that reads and edits your KiCad project the way an engineer would, from the command line, in your own git repository. You ask for a change in plain English and it edits the schematic and the board, updates the documents that reference them and runs <code>kicad-cli</code> ERC and DRC until they pass.`,
    sections: [
      {
        h2: 'Does KiCad have AI?',
        body: `<p>Not in the application itself. What KiCad does have is an open, text-based file format and a command-line tool, <code>kicad-cli</code>, that runs the same electrical and design rule checks as the editor. Those two things are what make an AI agent for KiCad possible: the design is source code an agent can edit, and the checks are a test suite it can run.</p>`,
      },
      {
        h2: 'How Copperhead edits a KiCad project',
        body: `<p>Point it at an existing KiCad repository and run <code>copperhead init</code>. After that, <code>copperhead do "add a USB-C power input"</code> starts a run:</p>
<ol>
<li>It writes a change proposal and validates it. The edit tools are locked until that proposal exists.</li>
<li>It makes surgical edits to the s-expression source in <code>.kicad_sch</code> and <code>.kicad_pcb</code>, so your diffs stay small. Untouched regions stay byte-identical.</li>
<li>It propagates the change into the pinout, the bill of materials, the subsystem docs and the firmware scaffold.</li>
<li>It runs ERC and DRC through <code>kicad-cli</code> inside a git snapshot. A run that fails verification is rolled back.</li>
</ol>
<p>The reasoning behind that loop is in <a href="/blog/spec-gated-in-verification-gated-out/">Spec-gated in, verification-gated out</a>.</p>`,
      },
      {
        h2: 'Working on a design that already exists',
        body: `<p>Iterating on a real KiCad design is the main case and what the agent is best at. It refuses to run on a dirty git tree, so every run starts from a known state and ends as a commit you can review or revert. It also refuses a change that would break a budget you have documented, and cites the line it would violate.</p>
<p>Starting from nothing works too. <code>copperhead create --brief brief.md</code> takes a written brief through ${stages}. In ${cloud} one sentence is enough to start.</p>`,
      },
      {
        h2: 'An agent, not an MCP server',
        body: `<p>A KiCad MCP server gives a general chat assistant a set of KiCad tools and leaves the workflow to the conversation. Copperhead is the workflow: the spec gate, the edit, the propagation into your documents, the verification and the rollback are one run with one outcome. It is model-agnostic: Claude and GPT-5 are both tested against the same integration suite. You bring your own key.</p>`,
      },
      {
        h2: 'Install',
        body: `<p>${install}. You need Node 20 or newer, <a href="${links.kicad}">KiCad</a> with <code>kicad-cli</code> on your path and a model API key. Set <code>ANTHROPIC_API_KEY</code> or <code>OPENAI_API_KEY</code> before the first run. The <a href="${links.docs}">docs</a> walk through a first change.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does KiCad have built-in AI?',
        a: `No. KiCad ships no AI features of its own. Tools such as Copperhead work on KiCad projects from the outside, through KiCad's open file format and <code>kicad-cli</code>.`,
      },
      {
        q: 'Can Claude design a PCB in KiCad?',
        a: `A model on its own writes text. Inside an agent that edits KiCad files and runs ERC and DRC on the result, it can take a board from a brief to checked design files. Copperhead runs Claude or GPT-5 in that loop with your own API key.`,
      },
      {
        q: 'Does it rewrite my whole schematic?',
        a: `No. Edits are surgical changes to the KiCad s-expression source, so diffs stay small and reviewable and untouched parts of the file stay byte-identical.`,
      },
      {
        q: 'Does it work with Altium, Eagle or OrCAD files?',
        a: `No. Copperhead supports KiCad only. No proprietary EDA formats are supported or planned.`,
      },
      {
        q: 'Where does my KiCad design go?',
        a: `With the CLI it stays in your own git repository. The agent runs on your machine and only sends design context as part of the model API call itself.`,
      },
    ],
  },
  {
    slug: 'ai-schematic-design',
    nav: 'AI schematic design',
    title: 'AI Schematic Design for KiCad · Copperhead',
    description:
      'AI schematic design from a written brief: Copperhead selects parts against datasheets, draws the KiCad schematic and runs ERC until it passes.',
    kicker: 'AI schematic design',
    h1: 'AI schematic design from a written brief',
    lede: `Copperhead generates a KiCad schematic from a brief. It decides the architecture, chooses parts against their datasheets, places and wires the symbols in a <code>.kicad_sch</code> file and runs KiCad's electrical rule check until it is clean. The schematic is a real file you open in KiCad, not a picture of one.`,
    sections: [
      {
        h2: 'From requirements to a netlist',
        body: `<p>A schematic is the end of a chain of decisions, and the agent writes each one down before it draws anything. The brief becomes a spec with a budgets section. The spec becomes a set of subsystems, each with a rationale. Only then are parts chosen and symbols placed. If a later change contradicts an earlier decision, the documents disagree and the run fails, which is the point.</p>`,
      },
      {
        h2: 'Part selection it can justify',
        body: `<p>Parts are chosen against datasheets and recorded in the bill of materials with the reason for each choice. Copperhead never invents a part number it cannot justify. Where the brief leaves a choice open, the agent proposes one and says why, so the decision is yours to overrule.</p>`,
      },
      {
        h2: 'Verified by ERC, every time',
        body: `<p>The schematic stage does not finish until <code>kicad-cli</code> reports a clean electrical rule check. ERC checks the net graph: unconnected pins, conflicting outputs and power pins nothing drives. It has no opinion on whether the design meets your requirements, which is why the spec and the budgets exist beside it and are checked for drift on every run.</p>`,
      },
      {
        h2: 'Changing a schematic you already have',
        body: `<p>Most schematic work is editing, not generating. <code>copperhead do "swap the LDO for a buck converter"</code> edits the existing <code>.kicad_sch</code> in place, updates the bill of materials and the power budget to match and re-runs ERC. See <a href="/kicad-ai/">the AI agent for KiCad</a> for how a change request runs.</p>`,
      },
      {
        h2: 'Start with a brief',
        body: `<p>Describe the board in ${cloud} in one sentence. The model asks for what the schematic depends on and finalizes the brief with you, with no account until you build. Or write the brief yourself and run it with the free CLI.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can AI generate a schematic?',
        a: `Yes. Copperhead writes a KiCad schematic from a written brief, with parts selected against datasheets. The stage only completes when KiCad's ERC is clean.`,
      },
      {
        q: 'How is an AI-generated schematic verified?',
        a: `By KiCad's own electrical rule check, run through <code>kicad-cli</code>. A drift check also compares the schematic with the spec, the bill of materials and the pinout.`,
      },
      {
        q: 'What format is the schematic in?',
        a: `A standard <code>.kicad_sch</code> file. You open and edit it in KiCad like any other schematic.`,
      },
    ],
  },
  {
    slug: 'ai-pcb-layout',
    nav: 'AI PCB layout',
    title: 'AI PCB Layout and Routing in KiCad · Copperhead',
    description:
      'AI PCB layout in KiCad: Copperhead places footprints and routes a draft board, runs DRC until it passes and tells you what a specialist should redo.',
    kicker: 'AI PCB layout',
    h1: 'AI PCB layout and routing, with DRC in the loop',
    lede: `Copperhead lays out a board in KiCad from the schematic it wrote or the one you already have. It places footprints, routes the copper in a <code>.kicad_pcb</code> file and runs KiCad's design rule check until it passes. What you get is a correct draft and an honest note on its limits.`,
    sections: [
      {
        h2: 'Placement, routing and the DRC loop',
        body: `<p>The layout stage ends on one condition: footprints on the board and DRC clean. Every edit to the board file is followed by a <code>kicad-cli</code> design rule check, and the violations go back to the agent until there are none. The run happens inside a git snapshot, so a layout that cannot be made to pass is rolled back instead of left half done.</p>`,
      },
      {
        h2: 'Correct, not optimal',
        body: `<p>A DRC-clean board is producible. It is not necessarily the board an experienced layout engineer would draw. Copperhead says so in writing: each run produces a <code>LAYOUT.md</code> that lists what is solid and what a specialist should redo before fabrication. Dense, high-speed and RF layouts are where that list is longest.</p>
<p>We think that honesty is the feature. A tool that claims a finished layout and is wrong costs you a respin.</p>`,
      },
      {
        h2: 'Layout as evidence',
        body: `<p>When a layout question needs a number, the agent can produce one. In <a href="/research/diffpair-meanders/">our differential pair study</a>, Copperhead built a bent pair and six ways of length-matching it. It solved every one in a field solver to see how much skew each fix removed.</p>`,
      },
      {
        h2: 'From layout to manufacturing files',
        body: `<p>Once the board passes DRC, the next stage writes Gerbers, drill files and a STEP model to disk, beside an orderable bill of materials. The whole path from a brief is described in <a href="/ai-pcb-design/">AI PCB design</a>.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can AI route a production-quality PCB?',
        a: `It can route a board that passes DRC and can be manufactured. For simple boards that is often enough. For dense, high-speed or RF designs, treat the result as a draft: Copperhead lists what a layout specialist should redo in <code>LAYOUT.md</code>.`,
      },
      {
        q: 'Is Copperhead an autorouter?',
        a: `No. An autorouter draws copper for a board that is already placed. Copperhead is an agent that covers the design from the brief to the Gerbers, with layout as one stage of it.`,
      },
      {
        q: 'What does the layout stage output?',
        a: `A standard <code>.kicad_pcb</code> file that passes DRC, then Gerbers, drill files and a STEP model from the stage after it.`,
      },
    ],
  },
  {
    slug: 'text-to-pcb',
    nav: 'Text to PCB',
    title: 'Text to PCB: From a Prompt to Gerbers · Copperhead',
    description:
      'Text to PCB with an open source AI agent: write what the board should do and get a KiCad schematic, a DRC-clean layout and Gerbers.',
    kicker: 'Text to PCB',
    h1: 'Text to PCB: from a prompt to Gerbers',
    lede: `Text to PCB means writing what a board should do and getting manufacturing files back. Copperhead does it in two steps you can see: the text becomes a brief, and the brief becomes a KiCad project with a schematic, a layout and Gerbers, each stage gated on a check it has to pass.`,
    sections: [
      {
        h2: 'What the text has to say',
        body: `<p>One sentence is enough to start: "a USB-C 5V power breakout, 3A, with a screw terminal and a power LED". What turns it into a board is the handful of facts a design depends on: what runs it, how it is powered, what it talks to, what is on it, how big it can be and which numbers it must hit.</p>
<p>In ${cloud} the model asks for exactly those and finalizes the brief with you as you answer, with no account until you build. Anything you leave open, the agent proposes and justifies.</p>`,
      },
      {
        h2: 'What comes out',
        body: `<p>A git repository with plain files in it: a specification, a subsystem breakdown, a bill of materials, <code>design.kicad_sch</code>, <code>design.kicad_pcb</code>, Gerbers and drill files, a STEP model, a firmware scaffold and a bring-up plan. The schematic passes ERC and the layout passes DRC. The <a href="/blog/from-brief-to-gerbers/">stage-by-stage walkthrough</a> shows a real run.</p>`,
      },
      {
        h2: 'Why a chatbot cannot do this alone',
        body: `<p>A general chat model will happily describe a circuit, and it has no way to find out that the description is wrong. Text to PCB only works when the model's output is a real design file and a real checker runs on it. Copperhead puts the model in that loop and does not report success until KiCad's own checks agree.</p>`,
      },
      {
        h2: 'A worked example',
        body: `<p>In <a href="/blog/hardware-as-fast-as-software/">Hardware as fast as software</a> we took two boards from a two-sentence public roadmap to part selection in a day, with every stage a commit. The proof board behind the project, Open Telegraph, is public with its KiCad files and decision log.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can ChatGPT design a PCB?',
        a: `Not by itself. A chat model can suggest a circuit in words, but it cannot open a design file or run a rule check. An agent such as Copperhead runs a model, GPT-5 or Claude, inside a loop that edits KiCad files and verifies them.`,
      },
      {
        q: 'How detailed does the prompt need to be?',
        a: `A sentence starts it. A good brief also states the controller, the power source, the interfaces, the parts that must be on the board and any hard budgets. In Copperhead Cloud the model asks for each one.`,
      },
      {
        q: 'How long does it take and what does it cost?',
        a: `A full run from a brief costs five to ten times a single change, which is roughly 0.10 to 1.00 dollars in model tokens, billed by your model provider.`,
      },
    ],
  },
  {
    slug: 'open-source-ai-pcb-design',
    nav: 'Open source',
    title: 'Open Source AI PCB Design Tool · Copperhead',
    description:
      'Copperhead is an open source AI PCB design tool under Apache-2.0. It runs locally on your KiCad files with your own model key, and the CLI is free.',
    kicker: 'Open source',
    h1: 'Open source AI for PCB design',
    lede: `Copperhead is an open source AI PCB design agent, licensed under Apache-2.0. The CLI is free, runs on your own machine against your own KiCad files and does every core operation without a paid plan. You bring a model API key and you keep your design.`,
    sections: [
      {
        h2: 'What open source means here',
        body: `<p>The agent's source is on <a href="${links.repo}">GitHub</a> under <a href="${links.license}">Apache-2.0</a>. Everything it writes is plain markdown, JSON and KiCad source in your repository, so there is no proprietary format and no editor to move into. If you stop using Copperhead tomorrow, your project is an ordinary KiCad project.</p>`,
      },
      {
        h2: 'Your design stays yours',
        body: `<p>With the CLI the agent runs locally and stores nothing on a server. Design context leaves your machine only as part of the model API call itself, to the provider whose key you supplied. Run transcripts live in <code>.copperhead/runs/</code> with secret patterns redacted, and the agent never reads paths outside your repository.</p>`,
      },
      {
        h2: 'Free CLI, paid hosting',
        body: `<p>Copperhead is open core. The CLI is free forever. The paid plans add what is painful to run yourself: hosted runs on private repositories, team governance and a self-hosted enterprise license. Copperhead Cloud is free for public repositories released under CERN-OHL-S or an OSHWA-certified license, within fair-use limits. The split is on the <a href="/pricing/">pricing page</a>.</p>`,
      },
      {
        h2: 'Built in the open',
        body: `<p>Our reference hardware is CERN-OHL-S, our benchmark ${copperbench} is public and the <a href="/stats/">repository's traffic</a> is published daily. The <a href="/blog/antler-crackathon/">Antler Crackathon write-up</a> covers where the project came from, and we are <a href="/careers/">hiring</a> people who want to build it.</p>`,
      },
      {
        h2: 'Get started',
        body: `<p>${install}, then <code>copperhead create --brief brief.md</code> or <code>copperhead init</code> in an existing KiCad repository. No brief yet? Describe the board in ${cloud} and start from a sentence.</p>`,
      },
    ],
    faq: [
      {
        q: 'Is Copperhead free?',
        a: `The CLI is free and open source under Apache-2.0. You pay your model provider for the tokens a run uses. Hosted plans are paid, and Cloud is free for qualifying open hardware projects.`,
      },
      {
        q: 'Can I run it without sending my design to a server?',
        a: `Yes. The CLI runs locally. The only design data that leaves your machine is the context sent in the model API call to the provider you chose.`,
      },
      {
        q: 'Which models does it work with?',
        a: `It is model-agnostic. Claude and GPT-5 are both tested against the same integration suite, and you bring your own key.`,
      },
    ],
  },
];

export const topicPath = (slug: string) => `/${slug}/`;
