/**
 * The FAQ, as data. It lives here rather than in the page because two surfaces
 * render it now — /blog/faq in full, and a short section on the homepage — and
 * a copy-paste between them would be exactly the drift this product exists to
 * catch.
 *
 * Answers are small HTML fragments so a few can carry links and inline code.
 * `stripTags` gives the JSON-LD the same string without markup, which keeps the
 * structured data and the visible answer from parting company.
 */
import { links, pkg } from './config';

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const groups: FaqGroup[] = [
  {
    title: 'The basics',
    items: [
      {
        q: 'What is Copperhead?',
        a: `An open source AI agent that designs, documents and verifies printed circuit boards. You describe a change or hand it a product brief, and it edits your real KiCad files, updates every document that references them, and runs KiCad's own checks until they pass. <a href="/blog/meet-copperhead/">Longer introduction here</a>.`,
      },
      {
        q: 'What problem does it actually solve?',
        a: `Drift. A hardware design spreads one decision across a schematic, a bill of materials, a power budget and several documents, and nothing breaks when they fall out of sync. The inconsistency is found at bring-up, and a respin costs 5,000 to 50,000 dollars and six to eight weeks. <a href="/blog/drift-is-a-build-failure/">The full argument is here</a>.`,
      },
      {
        q: 'Is this a chatbot for circuits?',
        a: `No. A run ends with edited KiCad source, updated documents, passing ERC and DRC and a commit in your repository, all of it on disk for you to review.`,
      },
      {
        q: 'Does it replace a hardware engineer?',
        a: `No. It automates the propagation and verification work that eats the day, and it flags every assumption it made. You remain the engineer of record, and it will not claim fab-readiness beyond "ERC and DRC clean".`,
      },
    ],
  },
  {
    title: 'Using it',
    items: [
      {
        q: 'What do I need installed?',
        a: `Node 20 or newer, <a href="${links.kicad}">KiCad</a> with <code>kicad-cli</code> on your path and a model API key of your own. Then <code>npm i -g ${pkg}</code>.`,
      },
      {
        q: 'Does it work on a design that already exists?',
        a: `That is the main case. Point it at a KiCad repository, run <code>copperhead init</code> and start asking for changes. It can also run the full pipeline from a written brief with <code>copperhead create</code>, but iterating on real designs is what it is best at.`,
      },
      {
        q: 'Which EDA tools does it support?',
        a: `KiCad, the most widely used open PCB tool. Verification runs through <code>kicad-cli</code>, so the checks are the same ones you would run yourself. There is no support for proprietary EDA formats and none is planned.`,
      },
      {
        q: 'Which model does it use?',
        a: `It is model-agnostic. Claude and GPT-5 are both tested against the same integration suite, and you bring your own key for whichever you prefer. Set <code>ANTHROPIC_API_KEY</code> or <code>OPENAI_API_KEY</code> before the first run.`,
      },
      {
        q: 'What does a run cost?',
        a: `A single change request is roughly 0.10 to 1.00 dollars in model tokens. A full <code>create</code> pipeline run is five to ten times that. You are billed by your model provider directly; Copperhead itself is free.`,
      },
    ],
  },
  {
    title: 'Trust and safety',
    items: [
      {
        q: 'What will it refuse to do?',
        a: `It refuses to run on a dirty git tree, refuses to edit any design file before a validated change proposal exists and refuses changes that break a budget or constraint you have documented, citing the line it would violate. It also never invents a part number it cannot justify from a datasheet.`,
      },
      {
        q: 'Will it rewrite my whole schematic?',
        a: `No. Edits are surgical changes to the KiCad s-expression source, so your diffs stay small and reviewable and untouched parts of the file stay byte-identical.`,
      },
      {
        q: 'Is the board ready to send to fabrication?',
        a: `The gerbers are producible and the layout is DRC-clean, but the draft layout is correct rather than optimal. <code>LAYOUT.md</code> lists what is solid and what a layout specialist should redo first.`,
      },
      {
        q: 'Where does my design data go?',
        a: `It stays in your own git repository. The agent runs locally, stores nothing on a server and only sends design context as part of the model API call itself. Run transcripts live in <code>.copperhead/runs/</code> with secret patterns redacted, and the agent never reads paths outside your repository.`,
      },
      {
        q: 'What is the license?',
        a: `The agent is <a href="${links.license}">Apache-2.0</a>. Everything it writes is plain markdown, JSON and KiCad source in your repository. Our own reference hardware is CERN-OHL-S v2.0.`,
      },
      {
        q: 'Is there a hosted version?',
        a: `Not today. The local CLI with your own key is the product right now. A hosted tier is planned, and teams with export-controlled designs will stay on self-hosted.`,
      },
    ],
  },
];

export const stripTags = (s: string): string => s.replace(/<[^>]+>/g, '');
