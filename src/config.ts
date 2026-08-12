/** Single source of truth for outbound links and the install command. */
export const pkg = 'copperhead';

/** git remote of the copperhead repo (brand doc says animesh-chouhan; remote wins). */
export const repo = 'https://github.com/chouhanindustries/copperhead';

export const site = 'https://copperhead.sh';

export const links = {
  repo,
  // Primary navbar CTA ("Let's talk") — books a copperhead demo call.
  getStarted: 'https://cal.com/animeshchouhan/demo-copperhead',
  // The blog now lives on this site (spec §non-goals said chouhan.ai; superseded).
  // The docs are a separate Astro Starlight site on GitHub Pages (source: repo
  // docs/). They cannot live at /docs here: this Worker owns the whole apex.
  pricing: '/pricing/',
  blog: '/blog/',
  faq: '/blog/faq/',
  docs: 'https://docs.copperhead.sh/',
  demoVideo: '/copperhead-demo.mp4',
  telegraphRepo: 'https://github.com/animesh-chouhan/open-telegraph',
  buildStory: 'https://chouhan.ai/building-with-claude',
  // Placeholder page on this site; chouhan.ai/research is a different thing.
  research: '/research/',
  // The long traffic record for the repo, drawn from the data branch that
  // .github/workflows/repo-stats.yml appends to daily.
  stats: '/stats/',
  // The Antler write-up, on chouhan.ai rather than this site's own /blog copy.
  antler: 'https://chouhan.ai/antler-crackathon',
  // TODO(launch): confirm the real inbox before launch; copperhead.sh has no MX
  // record yet, so this address may bounce.
  contact: 'mailto:hello@copperhead.sh',
  discord: 'https://discord.gg/24zYXuR3Pq',
  x: 'https://x.com/copperheadhq',
  linkedin: 'https://www.linkedin.com/company/copperheadhq',
  chouhan: 'https://chouhan.ai',
  kicad: 'https://www.kicad.org/',
  openspec: 'https://github.com/Fission-AI/OpenSpec',
  license: `${repo}/blob/main/LICENSE`,
};

/**
 * Quickstart block (acceptance W-3: the copy button copies exactly these lines).
 * Supersedes the website-content.md §8 `init`/`do` flow: this shows the
 * start-from-a-prompt pipeline (`copperhead create`, usecase-copperhead.md),
 * which scaffolds a new design from a brief rather than editing an existing repo.
 */
export const quickstart = [
  `npm i -g ${pkg}`,
  'export ANTHROPIC_API_KEY=<api-key>',
  'copperhead create --brief brief.md',
];

/**
 * The brief.md the quickstart points at, shown beside it (CtaEnd) and in the
 * Antler write-up. Content grounded in the Open Telegraph brief
 * (usecase-copperhead.md): ESP32-S3, BLE HID, the 25 µA sleep budget, the
 * 3.5 mm key jack. One string, so the renderings and their copy buttons
 * cannot drift.
 */
export const morseBrief = `# Pocket Morse key

A pocket-size Morse key that types over Bluetooth as a standard keyboard.

- ESP32-S3, BLE HID
- Li-Po cell, USB-C charging
- Sleep current budget: 25 µA
- 3.5 mm jack for an external paddle`;
