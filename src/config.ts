/** Single source of truth for outbound links and the install command. */
export const pkg = 'copperhead';

/**
 * git remote of the Copperhead repo (brand doc says animesh-chouhan; remote wins).
 * The repo moved from the chouhanindustries org to copperheadhq; GitHub 301s the
 * old path, but everything published from here uses the current one. Note that
 * src/repo-stats.ts deliberately does NOT follow this rename — see the comment
 * on `trackedDataSlug` there.
 */
export const repo = 'https://github.com/copperheadhq/copperhead';

export const site = 'https://copperhead.sh';

/**
 * The share card a page falls back to when it has none of its own: the site
 * card in public/. Named here rather than inlined in Base.astro because the
 * blog post route needs the same value for its JSON-LD `image`, and two
 * literals a directory apart is how a page ends up unfurling one picture and
 * telling search engines about another.
 */
export const siteCard = '/og-image.png';

export const links = {
  repo,
  // Primary navbar CTA ("Let's talk") — books a Copperhead demo call.
  getStarted: 'https://cal.com/animeshchouhan/demo-copperhead',
  // The blog now lives on this site (spec §non-goals said chouhan.ai; superseded).
  // The docs are a separate Astro Starlight site on GitHub Pages (source: repo
  // docs/). They cannot live at /docs here: this Worker owns the whole apex.
  pricing: '/pricing/',
  blog: '/blog/',
  faq: '/blog/faq/',
  docs: 'https://docs.copperhead.sh/',
  // The hosted platform, Copperhead Cloud (the copperhead-cloud repo). This
  // site links to it and does nothing else with it: cloud SPEC §3.1 scopes
  // copperhead-site to "links only" and forbids auth code, a Supabase client
  // or any secret landing here.
  app: 'https://app.copperhead.sh/',
  demoVideo: '/copperhead-demo.mp4',
  telegraphRepo: 'https://github.com/animesh-chouhan/open-telegraph',
  buildStory: 'https://chouhan.ai/building-with-claude',
  // Placeholder page on this site; chouhan.ai/research is a different thing.
  research: '/research/',
  // Fang, the hardware kernel behind simulation and verification, on its own
  // site (source: copperheadhq/fang). The About page links it.
  fang: 'https://fang.copperhead.sh/',
  // The long traffic record for the repo, drawn from the data branch that
  // .github/workflows/repo-stats.yml appends to daily.
  stats: '/stats/',
  // Service status, drawn on this domain from UptimeRobot's public record
  // (src/status.ts). Their hosted copy is the fallback linked from the page.
  status: '/status/',
  // Open roles. In the navbar and in the footer's Company column: it replaced
  // Discord in the bar.
  careers: '/careers/',
  // Who builds Copperhead, and the page carrying the Organization node. In the
  // footer's Company column and in the navbar, where it follows Careers so the
  // two company links sit together.
  about: '/about/',
  // The Show HN launch thread, which made the front page.
  hn: 'https://news.ycombinator.com/item?id=49610059',
  // The thread for OpenAI's Navier-Stokes post, which made the same front page
  // the same day (news.ycombinator.com/front?day=2026-09-08).
  hnNavierStokes: 'https://news.ycombinator.com/item?id=49613262',
  // The Antler write-up, on chouhan.ai rather than this site's own /blog copy.
  antler: 'https://chouhan.ai/antler-crackathon',
  // General enquiries. copperhead.sh now has MX records on Cloudflare Email
  // Routing, so the domain receives mail; whether this particular address does
  // still depends on a routing rule (or a catch-all) existing for it there.
  contact: 'mailto:contact@copperhead.sh',
  // Applications. Separate from `contact` so a careers reply-to never lands in
  // the same thread as a sales enquiry, and so this address can be routed to a
  // different person without moving everything else with it. It is the fallback
  // behind every "Apply" button until `careersApply` and the per-role
  // `applyUrl`s are filled in: see `applyHref` in src/careers.ts.
  // TODO(careers): confirm a routing rule (or a catch-all) exists for this
  // address before the roles are announced anywhere. It is the destination of
  // every apply button while `careersApply` is null, so if nothing routes it,
  // applications bounce and nothing here reports it.
  careersEmail: 'mailto:careers@copperhead.sh',
  // This website's own repo, distinct from the product repo above; the 404
  // page points a reader who followed a broken internal link at its issues.
  siteIssues: 'https://github.com/copperheadhq/copperhead-site/issues',
  discord: 'https://discord.gg/24zYXuR3Pq',
  x: 'https://x.com/copperheadhq',
  linkedin: 'https://www.linkedin.com/company/copperheadhq',
  instagram: 'https://www.instagram.com/copperhead.hq/',
  youtube: 'https://www.youtube.com/@CopperheadHQ',
  reddit: 'https://www.reddit.com/r/copperheadhq/',
  chouhan: 'https://chouhan.ai',
  kicad: 'https://www.kicad.org/',
  openspec: 'https://github.com/Fission-AI/OpenSpec',
  license: `${repo}/blob/main/LICENSE`,
};

/**
 * The external application form every "Apply" button on /careers points at.
 *
 * Applications are collected on binary.so, one form per role. Each role's form
 * URL belongs in its own `applyUrl` in src/careers.ts; this is the general
 * form behind the index page's "Introduce yourself" button, and the fallback
 * for any role that has no form yet. Its spec is
 * .claude/skills/job-post/references/form-general-application.md, and the
 * per-role specs sit beside it.
 *
 * Null until that form exists. It is deliberately not a placeholder URL: a
 * button wired to a guessed address is a broken application nobody finds out
 * about, whereas null makes `applyHref` in src/careers.ts fall back to
 * `careersEmail` with the subject line already filled in. Set this to the real
 * form and every button on the section, index and role pages both, follows it
 * in one edit, labels included.
 *
 * TODO(careers): fill in with the binary.so form URL once it is built.
 */
export const careersApply: string | null = null;

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
 * Antler write-up. A deliberately ordinary board: a Bluetooth speaker, an ESP32
 * doing A2DP into a class-D amp, on a battery and a standby budget. The budget
 * line is the load-bearing one, since it is what the agent refuses to break.
 * One string, so the renderings and their copy buttons cannot drift.
 */
export const speakerBrief = `# Pocket Bluetooth speaker

A palm-size Bluetooth speaker that plays for a day on one charge.

- ESP32, Bluetooth audio (A2DP sink)
- 3 W class-D amp into a 4 Ω driver
- Li-Po cell, USB-C charging
- Standby current budget: 100 µA`;
