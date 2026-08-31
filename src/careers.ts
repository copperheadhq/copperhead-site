import { links, careersApply } from './config';

/**
 * Open roles, and the helpers the two /careers routes share.
 *
 * Roles are a data file rather than a fourth content collection because a
 * listing is a record, not an essay. Every field below lands in a fixed slot on
 * both the index card and the role page, so two roles cannot quietly disagree
 * about what a role page contains — which is exactly what a markdown body would
 * allow. The blog and research collections exist for prose; this does not need
 * one.
 */

/** A postal address, in the shape schema.org's PostalAddress wants it. */
export interface RoleAddress {
  locality: string;
  /** State or province. Optional: plenty of places do not have one worth naming. */
  region?: string;
  /** ISO 3166-1 alpha-2, e.g. 'IN'. Not the country's name. */
  country: string;
}

export interface Role {
  /** URL segment. Stable once posted: it is what a candidate bookmarks. */
  slug: string;
  title: string;
  /** Short mono tag on the card, e.g. 'Engineering'. One word where possible. */
  discipline: string;
  /** Display string for the meta row, e.g. 'Bengaluru, India'. */
  location: string;
  /**
   * Where the work happens. Shown beside `location`, and it decides which
   * branch of the JobPosting markup applies: a remote role is described by the
   * region it can be worked from, anything else by a real address.
   */
  workplace: 'On-site' | 'Hybrid' | 'Remote';
  /**
   * The address behind `location`. Required for an On-site or Hybrid role:
   * schema.org wants a jobLocation for one, and 'Bengaluru, India' as a display
   * string is not one.
   */
  address?: RoleAddress;
  /**
   * Where a Remote role may be worked from, as a country name. Google wants
   * `applicantLocationRequirements` on a TELECOMMUTE posting, so a remote role
   * with `posted` set and this left off produces an incomplete one.
   */
  hiringRegion?: string;
  commitment: string;
  /** One sentence. Shown on the card and used as the role page's meta description. */
  summary: string;
  /** Why the role exists, in the team's own words rather than a requirements preamble. */
  context: string;
  /** What the person would own. */
  work: string[];
  /** What we look for. Written as things a person has done, not years served. */
  fit: string[];
  /**
   * Heading over `fit`, when 'What we look for' would misdescribe the list.
   * A role that states its requirements are hard gets 'Hard requirements': a
   * soft heading over a firm list wastes the time of everyone it misleads, in
   * both directions.
   */
  fitHeading?: string;
  /** Qualifications the list above should not be read as demanding. */
  fitNote?: string;
  /** Genuinely optional. Anything load-bearing belongs in `fit`. */
  extra: string[];
  /**
   * Pay and equity, stated on the page rather than discovered in a third call.
   * The section is omitted when this is unset, because an empty Pay heading is
   * worse than no heading. Leaving it unset is a choice, not a default.
   */
  pay?: string;
  /**
   * False keeps a role out of the index, out of getStaticPaths and out of the
   * sitemap. Same idea as the underscore prefix on a draft post: a half-written
   * listing must not become a live page by being committed.
   */
  published: boolean;
  /**
   * ISO date the role went up. Its absence is load-bearing: JobPosting
   * structured data is emitted only for a role that has one, because
   * schema.org requires datePosted and Google's guidelines are for roles that
   * are actually open. A draft listing must not reach a job index, and gating
   * on the one field that cannot be guessed is how that stays true without a
   * second flag to forget.
   */
  posted?: string;
  /** Per-role override of the application destination. `applyHref` explains the order. */
  applyUrl?: string;
  /**
   * What to send with an application, when a role asks for something specific.
   * Replaces the generic line under the apply button rather than joining it.
   */
  applyNote?: string;
  /**
   * The specific items an application must carry, when a role asks for a list
   * rather than a sentence. Renders under `applyNote`, which becomes its
   * lead-in. Every item here is something a candidate will be judged on
   * sending, so it is a list rather than a paragraph on purpose.
   */
  applySend?: string[];
}

export const roles: Role[] = [
  {
    slug: 'founding-ai-engineer',
    title: 'Founding AI Engineer',
    discipline: 'Engineering',
    location: 'Bengaluru, India',
    workplace: 'On-site',
    address: { locality: 'Bengaluru', region: 'Karnataka', country: 'IN' },
    commitment: 'Full-time',
    summary:
      'Work directly with the founder on the systems that turn a written brief into a validated PCB design.',
    context:
      'You would be the founding engineer on the core of the product: the systems that translate written requirements into PCB designs the tools agree are correct. That means deciding with the founder what the product is, making the architecture calls that are expensive to revisit later, trying agentic workflows that may not work and turning the ones that do into software reliable enough for real electronics engineering. The work runs across AI, backend systems and electronics, most of it in the open alongside the developer and hardware community already using the tool. Ownership is real from the first week, and what gets built here decides how a lot of engineers end up designing hardware with an agent.',
    work: [
      'Build AI agents that plan, generate, modify and verify PCB designs.',
      'Develop reliable tool-use, context, evaluation and orchestration systems.',
      'Improve schematic generation, PCB layout, component selection and datasheet understanding.',
      'Integrate LLMs with KiCad, deterministic verification tools and open-source EDA infrastructure.',
      'Design production-quality backend systems and developer-facing interfaces.',
      'Improve system reliability, performance, observability and test coverage.',
      'Own projects from first exploration through to production deployment.',
      'Contribute to technical documentation and open-source engineering practices.',
      'Help establish copperhead’s engineering culture and development processes.',
    ],
    fit: [
      'Strong software engineering in Python, TypeScript, Go, Rust or a similar language.',
      'Experience building AI products, agents, model integrations or workflow orchestration systems.',
      'You write clean, tested and maintainable production code.',
      'A sound understanding of system design, APIs, infrastructure, performance and monitoring.',
      'Comfort working through ambiguous technical problems and owning the outcome end to end.',
      'Strong written and verbal communication.',
      'An interest in electronics, hardware design or PCB engineering, and the ability to pick up an unfamiliar technical domain quickly.',
    ],
    fitNote:
      'Previous PCB design experience is useful and not required. A degree in computer science, engineering or a related field is welcome, and equivalent practical experience counts for just as much.',
    extra: [
      'Experience building developer tools or open-source software',
      'Familiarity with KiCad or another EDA tool',
      'Experience with LLM evaluation, structured generation or agent reliability',
      'Contributions to technically ambitious open-source projects',
      'Prior experience at an early-stage startup',
    ],
    applyUrl: 'https://binary.so/ejd7Mkv',
    // TODO(careers): no band was given for this role, so the Pay section does
    // not render. Set it to the range and equity you are willing to state.
    published: true,
    // TODO(careers): set to the date this posting actually went live, in
    // YYYY-MM-DD. That is what turns the JobPosting structured data on, and it
    // is deliberately not guessed here — see the note on `posted` above.
  },
  {
    slug: 'ai-research-intern',
    title: 'AI Research Intern',
    discipline: 'Research',
    location: 'Bengaluru, India',
    workplace: 'On-site',
    address: { locality: 'Bengaluru', region: 'Karnataka', country: 'IN' },
    commitment: 'Internship',
    summary:
      'Take open research problems in AI for electronics from a hypothesis to something hardware engineers run.',
    context:
      'This internship points at the open problems rather than at a backlog: agentic systems, reinforcement learning for constrained design, ML-based physics models and the reliable generation of engineering artifacts. They are real research problems and they sit directly underneath a shipping open-source product, so a result that holds up ends up in something hardware engineers use rather than in a slide. You would work with the founder on what gets tried, own a direction rather than a set of isolated intern tasks and publish or open-source what comes out of it. Full-time and on-site in Bengaluru.',
    work: [
      'Research new approaches to schematic generation, component selection, placement and routing.',
      'Build and evaluate AI agents that plan, modify and verify PCB designs.',
      'Explore reinforcement learning for constrained design and optimisation problems.',
      'Develop ML-based physics and surrogate models for electrical and physical validation.',
      'Implement ideas from recent AI, ML, EDA and computational engineering research.',
      'Design experiments, evaluation datasets, benchmarks and reliability metrics.',
      'Integrate research prototypes with KiCad and deterministic engineering tools.',
      'Analyse failures, and turn the experiments that look promising into production systems.',
      'Document findings and contribute to technical reports or research publications.',
      'Contribute directly to copperhead’s open-source codebase.',
    ],
    fit: [
      'Strong foundations in machine learning and deep learning.',
      'Proficiency in Python, and experience with PyTorch, JAX or a similar framework.',
      'Experience with LLMs, transformers, tool use or agentic systems.',
      'You can read a research paper, understand it and implement the idea.',
      'Familiarity with experimental design and quantitative evaluation.',
      'Strong software engineering and problem-solving skills.',
      'Curiosity about electronics, PCB design, EDA or computational engineering.',
      'You can work independently and take a research project from hypothesis to prototype.',
    ],
    fitNote:
      'Previous PCB design experience is helpful and not required. Evidence of curiosity, strong experiments and things you have built matters more than credentials.',
    extra: [
      'Reinforcement learning or combinatorial optimisation',
      'Physics-informed machine learning or graph neural networks',
      'Simulation, surrogate modelling or scientific computing',
      'KiCad, circuit design or another EDA tool',
      'Publications, research projects or technically ambitious open-source work',
      'AI systems you have built that real users used',
    ],
    applyUrl: 'https://binary.so/lazoJrH',
    applyNote:
      'Send your GitHub, your portfolio, your publications or a technically ambitious project you have built. That is the part we read first.',
    // TODO(careers): no stipend was given for this role, so the Pay section does
    // not render. Set it to the figure you are willing to state.
    published: true,
    // TODO(careers): set to the date this posting actually went live, in
    // YYYY-MM-DD. That is what turns the JobPosting structured data on.
  },
  {
    slug: 'forward-deployed-hardware-engineer',
    title: 'Forward Deployed Hardware Engineer',
    discipline: 'Hardware',
    location: 'Bengaluru, India',
    workplace: 'On-site',
    address: { locality: 'Bengaluru', region: 'Karnataka', country: 'IN' },
    commitment: 'Contract',
    summary:
      'Own a live Raspberry Pi CM5 carrier-board project from requirements through bring-up, on a six to eight week contract in Bengaluru.',
    context:
      'We need an advanced PCB engineer who can own complex customer hardware projects from requirements through manufacturing and board bring-up. You would work directly with customers, design production-grade boards natively in KiCad and use copperhead across the whole engineering workflow, which means your experience on real hardware shapes the product about as directly as it shapes the boards. This is a senior, execution-heavy role. It is not suitable for beginners, or for engineers whose experience stops at basic microcontroller boards. The engagement starts as a paid contract of six to eight weeks around an active CM5 carrier-board project, and work that goes well can lead to a longer-term or founding hardware role. It is in person in Bengaluru for the whole engagement and remote applications will not be considered.',
    work: [
      'Work directly with customers to understand product requirements, constraints and existing designs.',
      'Own system architecture, component selection, schematic design and PCB layout.',
      'Design and modify complex multilayer boards natively in KiCad.',
      'Use copperhead to design, document and verify customer projects.',
      'Define stack-ups, impedance requirements, routing constraints and length-matching rules.',
      'Conduct schematic, layout, ERC, DRC, DFM and design reviews.',
      'Prepare BOMs, fabrication files, assembly files and production documentation.',
      'Coordinate prototype fabrication and assembly.',
      'Lead board bring-up, validation, debugging and design revisions.',
      'Translate what you learn in the field into improvements to copperhead’s tools and verification systems.',
    ],
    fitHeading: 'Hard requirements',
    fit: [
      'Five or more years of professional electronics or PCB engineering experience.',
      'Advanced, production-level KiCad experience.',
      'You have personally designed at least one Raspberry Pi CM4 or CM5 carrier board.',
      'You can share evidence of that carrier-board work, with confidential details removed.',
      'Experience taking multilayer boards from requirements through fabrication, assembly and bring-up.',
      'Strong understanding of high-speed digital design, signal integrity and power integrity.',
      'Experience with controlled-impedance routing, differential pairs and length matching.',
      'Hands-on experience with MIPI CSI/DSI, USB, PCIe, Ethernet and microSD interfaces.',
      'Strong knowledge of power-tree design, protection, sequencing and component selection.',
      'Experience debugging boards with oscilloscopes, logic analysers and laboratory power supplies.',
      'Understanding of DFM, DFT, EMI/EMC and production test requirements.',
      'You work independently and own the engineering outcome.',
      'You can work in person from Bengaluru for the whole engagement.',
    ],
    extra: [
      'Raspberry Pi CM5 carrier-board design specifically',
      'Compact, high-density four to eight layer boards',
      'Camera and vision hardware',
      'Embedded Linux and device-tree configuration',
      'Hardware designed for industrial temperature ranges',
      'Prototype sourcing, assembly and manufacturing coordination in India',
      'Customer-facing engineering or technical consulting',
    ],
    // The form at binary.so asks for each of these as its own field, including
    // the KiCad samples as a required upload. The list stays on the page so a
    // candidate can gather the material before opening a form that will not let
    // them submit without it.
    applyUrl: 'https://binary.so/3sX6dXu',
    applyNote:
      'The form asks for all of this, so have it to hand before you start. An application missing the carrier-board evidence cannot be assessed.',
    applySend: [
      'A short introduction',
      'Details of the CM4 or CM5 carrier board you personally designed',
      'Native KiCad screenshots or project samples',
      'Board specifications: layer count, interfaces and your exact contribution',
      'The bring-up and validation work you performed',
      'Your availability and expected contract rate',
    ],
    // TODO(careers): the listing asks the candidate for their rate and states
    // none of its own, so the Pay section does not render. Set it if you decide
    // to publish a range for the engagement.
    published: true,
    // TODO(careers): set to the date this posting actually went live, in
    // YYYY-MM-DD. That is what turns the JobPosting structured data on.
  },
];

/** schema.org spelling of `commitment`. Anything unmapped is simply left off. */
const EMPLOYMENT_TYPE: Record<string, string> = {
  'Full-time': 'FULL_TIME',
  'Part-time': 'PART_TIME',
  Contract: 'CONTRACTOR',
  Internship: 'INTERN',
};

/**
 * JobPosting node for a role, or null for one that has no `posted` date.
 *
 * Null is the normal answer for a role that is not open yet, and both routes
 * are written to take it: the index drops the role from `hasPart` and the role
 * page emits no job markup at all. That is the whole reason the gate is a date
 * rather than a boolean. A boolean can be set on a listing nobody has actually
 * published; `datePosted` is required by schema.org and by Google's job
 * guidelines, so a role cannot enter a job index without someone having
 * answered the one question that makes the posting true.
 */
export function jobPostingJsonLd(role: Role): Record<string, unknown> | null {
  if (!role.posted) return null;

  const employmentType = EMPLOYMENT_TYPE[role.commitment];

  // Two different claims, not two spellings of one. A remote role is described
  // by where it may be worked from; an on-site or hybrid role is described by
  // the place you would go. Sending TELECOMMUTE for a role with an address is
  // how a Bengaluru job turns up in a search for remote work.
  const where =
    role.workplace === 'Remote'
      ? {
          jobLocationType: 'TELECOMMUTE',
          ...(role.hiringRegion
            ? {
                applicantLocationRequirements: {
                  '@type': 'Country',
                  name: role.hiringRegion,
                },
              }
            : {}),
        }
      : role.address
        ? {
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: role.address.locality,
                ...(role.address.region ? { addressRegion: role.address.region } : {}),
                addressCountry: role.address.country,
              },
            },
          }
        : {};

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description: role.summary,
    datePosted: role.posted,
    ...(employmentType ? { employmentType } : {}),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Chouhan Industries',
      url: links.chouhan,
    },
    ...where,
    // The application is off-site wherever `careersApply` points, and it stays
    // off-site while that is null and the button opens an email.
    directApply: false,
  };
}

/** Canonical path for a role page. */
export const rolePath = (slug: string) => `/careers/${slug}/`;

/** The roles that actually render. Everything downstream reads this, not `roles`. */
export const openRoles = roles.filter((r) => r.published);

/**
 * Where an application goes, most specific first: a role's own link, then the
 * site-wide form, then the careers address with the subject already written.
 *
 * The fallback is the reason this is a function rather than a constant. The
 * external form does not exist yet (`careersApply` in src/config.ts is null),
 * and a careers page whose only button is dead is worse than one that opens an
 * email to careers@. When the form URL lands, every button on the section
 * follows it.
 */
export function applyHref(role?: Role): string {
  if (role?.applyUrl) return role.applyUrl;
  if (careersApply) return careersApply;
  const subject = role ? `Application: ${role.title}` : 'Introducing myself';
  return `${links.careersEmail}?subject=${encodeURIComponent(subject)}`;
}

/** True when `applyHref` resolved to a form rather than to the mailto fallback. */
export const isExternalApply = (role?: Role) =>
  Boolean(role?.applyUrl ?? careersApply);

/** Button label, so a mailto is never dressed up as an application form. */
export const applyLabel = (role?: Role) =>
  isExternalApply(role) ? 'Apply for this role' : 'Apply by email';
