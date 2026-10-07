import { links, careersApply, site } from './config';

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

/**
 * schema.org spelling of `commitment`, and the set `commitment` may take.
 *
 * Declared above `Role` so the field can be typed against it instead of being
 * a bare string. A free string compiles a typo like 'Full time' straight
 * through: the meta row prints it, the lookup below misses it and the posting
 * loses `employmentType` with nothing failing anywhere to say so.
 */
const EMPLOYMENT_TYPE = {
  'Full-time': 'FULL_TIME',
  'Part-time': 'PART_TIME',
  Contract: 'CONTRACTOR',
  Internship: 'INTERN',
} as const;

/**
 * Pay: the sentence a candidate reads, and optionally the numbers Google wants.
 *
 * `text` is the only part that renders. The rest exists because a band written
 * for a person, '40L to 60L plus equity', cannot be parsed back into currency,
 * value and unit without guessing at precisely the fields a stranger may act
 * on. Fill the numbers in and the page and the posting agree. Fill in only
 * `text` and the page states a band the markup stays silent about, which is
 * incomplete rather than wrong, and is the right way round of the two.
 */
export interface RolePay {
  /** The sentence under the Pay heading. Required whenever pay is stated. */
  text: string;
  /** ISO 4217, e.g. 'INR'. Emits `baseSalary` together with `unit` and a bound. */
  currency?: string;
  min?: number;
  max?: number;
  unit?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
}

/** Everything about a role except where it is worked. See `Role`. */
interface RoleBase {
  /** URL segment. Stable once posted: it is what a candidate bookmarks. */
  slug: string;
  title: string;
  /** Short mono tag on the card, e.g. 'Engineering'. One word where possible. */
  discipline: string;
  /** Display string for the meta row, e.g. 'Bengaluru, India'. */
  location: string;
  /** Matched against EMPLOYMENT_TYPE for the schema, so it is typed against it. */
  commitment: keyof typeof EMPLOYMENT_TYPE;
  /** One sentence. Shown on the card and used as the role page's meta description. */
  summary: string;
  /**
   * Why the role exists, in the team's own words rather than a requirements
   * preamble. One string per paragraph: the first says what the job is, the
   * second what it asks of the person.
   */
  context: string[];
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
  pay?: RolePay;
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
  /**
   * ISO date the posting stops being true, if one is known.
   *
   * Google keeps serving a posting it has ingested until it expires or the URL
   * stops answering, so a role closed by flipping `published` to false leaves
   * a listing in the index pointing at a 404. Setting this is how a closing
   * date announces itself in advance. It is a date, so it is never guessed.
   */
  validThrough?: string;
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

/**
 * A role, with `workplace` and the field describing where it is worked bound
 * together rather than left as three fields that happen to agree.
 *
 * They were optional and independent, which let an on-site role with no
 * `address` compile, build and render a normal-looking page while emitting a
 * JobPosting carrying neither `jobLocation` nor `jobLocationType`. Google
 * requires one of the two, so that posting is invalid, and nothing on the page
 * looks wrong. The union makes the two bad pairings unwriteable instead.
 *
 * On-site and hybrid are described by the place you would go. Remote is
 * described by where it may be worked from: sending TELECOMMUTE for a role
 * with an address is how a Bengaluru job turns up in a search for remote work.
 */
export type Role =
  | (RoleBase & {
      workplace: 'On-site' | 'Hybrid';
      address: RoleAddress;
      hiringRegion?: never;
    })
  | (RoleBase & {
      workplace: 'Remote';
      /** Country name. Google wants it on a TELECOMMUTE posting. */
      hiringRegion: string;
      address?: never;
    });

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
      'Design, train and ship the models and agents that turn a written brief into a validated PCB design.',
    context: [
      'You would be the founding engineer on the core of the product: the models and agent systems that translate written requirements into PCB designs the tools agree are correct. Off-the-shelf models do not do this well enough on their own, so the work runs from the current literature through training runs, reinforcement learning on constrained design problems, fine-tuning and custom architectures.',
      'It then runs into the half that decides whether any of it ships: evaluation harnesses, inference cost, tool-use reliability and the backend that serves it. You would make those calls with the founder and own them from first experiment to production, most of it in the open alongside the developer and hardware community already using the tool. The bar is research-level and the setting is a production team, so a result that does not survive an eval does not ship.',
    ],
    work: [
      'Build AI agents that plan, generate, modify and verify PCB designs.',
      'Train, fine-tune and evaluate models for the parts of the design problem where a general model is not good enough.',
      'Apply reinforcement learning to constrained design, placement and routing problems.',
      'Design custom architectures, including transformer encoders over schematics, netlists and layout.',
      'Develop the tool-use, context, orchestration and evaluation systems that decide what ships.',
      'Improve schematic generation, PCB layout, component selection and datasheet understanding.',
      'Integrate LLMs with KiCad, deterministic verification tools and open-source EDA infrastructure.',
      'Design production-quality backend systems and developer-facing interfaces.',
      'Improve system reliability, performance, observability and test coverage.',
      'Own projects from first experiment through to production deployment.',
      'Contribute to technical documentation and open-source engineering practices.',
      'Help establish copperhead’s engineering culture and development processes.',
    ],
    fitHeading: 'Hard requirements',
    fit: [
      'Working knowledge of machine learning deep enough to derive, implement and debug the methods you use rather than call them.',
      'You have trained and fine-tuned transformer models, and you understand their internals well enough to change them.',
      'You have implemented reinforcement learning algorithms yourself and applied them to constrained or combinatorial problems.',
      'You have designed custom architectures, including encoders over structured or graph-shaped data, rather than only fine-tuning what already exists.',
      'You read current AI research, can tell a real result from a benchmark artefact and can implement a paper from its description.',
      'Experience designing evaluations, benchmarks and reliability metrics for systems whose output has to be correct.',
      'Strong software engineering in Python, and production experience in TypeScript, Go, Rust or a similar language.',
      'Experience building AI products, agents, model integrations or workflow orchestration systems.',
      'You write clean, tested and maintainable production code.',
      'A sound understanding of system design, APIs, infrastructure, performance and monitoring.',
      'Comfort working through ambiguous technical problems and owning the outcome end to end.',
      'Strong written and verbal communication.',
      'An interest in electronics, hardware design or PCB engineering, and the ability to pick up an unfamiliar technical domain quickly.',
    ],
    fitNote:
      'Previous PCB design experience is useful and not required. Nor is a PhD or a publication record: a degree in computer science, engineering or a related field is welcome, and evidence that you have built and trained these systems counts for just as much.',
    extra: [
      'Publications or preprints at a major ML venue',
      'Reinforcement learning for combinatorial optimisation',
      'Graph neural networks, geometric deep learning or physics-informed models',
      'Structured generation, constrained decoding or grammar-based sampling',
      'Distributed training, quantisation or inference optimisation',
      'Experience building developer tools or open-source software',
      'Familiarity with KiCad or another EDA tool',
      'Contributions to technically ambitious open-source projects',
      'Prior experience at an early-stage startup',
    ],
    applyUrl: 'https://binary.so/ejd7Mkv',
    // TODO(careers): no band was given for this role, so the Pay section does
    // not render. Set it to the range and equity you are willing to state.
    published: true,
    posted: '2026-09-01',
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
    context: [
      'This internship points at the open problems rather than at a backlog: agentic systems, reinforcement learning for constrained design, ML-based physics models and the reliable generation of engineering artifacts. They are real research problems and they sit directly underneath a shipping open-source product, so a result that holds up ends up in the product itself.',
      'You would work with the founder on what gets tried, own a direction instead of a set of isolated intern tasks and publish or open-source what comes out of it. Full-time and on-site in Bengaluru.',
    ],
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
      'The form asks for your GitHub, your portfolio and your publications, so have them to hand. That is the part we read first.',
    // TODO(careers): no stipend was given for this role, so the Pay section does
    // not render. Set it to the figure you are willing to state.
    published: true,
    posted: '2026-09-01',
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
    context: [
      'We need an advanced PCB engineer who can own complex customer hardware projects from requirements through manufacturing and board bring-up. You would work directly with customers, design production-grade boards natively in KiCad and use copperhead across the whole engineering workflow, which means your experience on real hardware shapes the product about as directly as it shapes the boards.',
      'This is a senior, execution-heavy role. It is not suitable for beginners, or for engineers whose experience stops at basic microcontroller boards. The engagement starts as a paid contract of six to eight weeks around an active CM5 carrier-board project, and work that goes well can lead to a longer-term or founding hardware role. It is in person in Bengaluru for the whole engagement and remote applications will not be considered.',
    ],
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
    posted: '2026-09-01',
  },
  {
    slug: 'senior-ai-pcb-design-engineer',
    title: 'Senior AI PCB Design Engineer',
    discipline: 'Hardware',
    location: 'Bengaluru, India',
    workplace: 'On-site',
    address: { locality: 'Bengaluru', region: 'Karnataka', country: 'IN' },
    commitment: 'Full-time',
    summary:
      'Own production-grade multilayer boards from written brief to bring-up in KiCad, and turn the way you make those decisions into rules copperhead can check.',
    context: [
      'We need a senior PCB engineer who can own complex hardware projects from requirements and system architecture through schematic design, layout, simulation, fabrication, bring-up and validation. The boards span high-speed digital, RF, mixed-signal, power and embedded systems, they are designed natively in KiCad and copperhead is used across the whole workflow, so you would be designing real customer hardware and using the product on it every day.',
      'The other half of the role is encoding how an experienced hardware engineer reasons about architecture, component selection, constraints, simulation, verification and manufacturability, so that copperhead makes better engineering decisions and can tell whether a board is ready to build. That means finding the failure modes in AI-generated hardware and working with the software and AI engineers to fix them systematically, which is slower and less glamorous than the layout work and is the part that changes the product. It is a hands-on role for someone who has shipped complex hardware and wants to help build the next generation of electronic design automation, full-time and on-site in Bengaluru.',
    ],
    work: [
      'Own end-to-end development of complex multilayer PCBs, from requirements to manufacturing and validation.',
      'Translate product requirements and written briefs into system architectures and detailed electrical specifications.',
      'Design analog, digital, RF, mixed-signal and power circuits.',
      'Design and modify production-grade boards natively in KiCad.',
      'Define PCB stack-ups, impedance requirements, routing constraints and length-matching rules.',
      'Work with high-speed interfaces such as PCIe, USB, DDR, MIPI CSI/DSI, Ethernet and other serial buses.',
      'Design RF sections including matching networks, filters, antennas and RF front ends.',
      'Design mixed-signal systems involving ADCs, DACs, sensors, analog front ends and precision measurement circuits.',
      'Design power architectures including regulators, sequencing, protection, battery systems and high-current power distribution.',
      'Perform circuit simulation, signal integrity, power integrity and RF/EM analysis where the design calls for it.',
      'Conduct schematic, layout, ERC, DRC, DFM, DFT and design reviews.',
      'Prepare BOMs, fabrication files, assembly files and production documentation.',
      'Coordinate prototype fabrication and assembly.',
      'Lead board bring-up, validation, debugging and design revisions.',
      'Work directly with customers to understand requirements, constraints and existing hardware.',
      'Use copperhead to design, document, simulate and verify real customer projects.',
      'Bring PCB and electronics domain knowledge into copperhead’s AI workflows: how the system reasons about design decisions, constraints, trade-offs and verification.',
      'Convert expert hardware engineering knowledge into structured rules, reference designs, evaluation benchmarks and automated verification workflows.',
      'Develop engineering test cases and reference designs for evaluating AI-generated hardware.',
      'Identify failure modes in AI-generated hardware and work with software and AI engineers to fix them systematically.',
      'Work closely with software and AI engineers on schematic generation, placement, routing, simulation and verification capabilities.',
      'Mentor engineers and contribute to copperhead’s open-source engineering ecosystem.',
    ],
    fit: [
      'Five or more years of professional electronics, PCB or hardware engineering experience.',
      'Advanced, production-level KiCad experience.',
      'You have taken complex multilayer boards from requirements through fabrication, assembly, bring-up and validation.',
      'A strong foundation in analog, digital and mixed-signal circuit design.',
      'Strong understanding of high-speed digital design, signal integrity and power integrity.',
      'Experience with controlled-impedance routing, differential pairs, length matching and high-speed PCB constraints.',
      'You have designed boards carrying PCIe, USB, DDR, MIPI, Ethernet or similar high-speed buses.',
      'Practical RF design experience: impedance matching, transmission lines, filtering and noise mitigation.',
      'Strong understanding of power-tree design, regulators, sequencing, protection and component selection.',
      'Experience with EMI/EMC, DFM, DFT and reliability considerations.',
      'You have debugged hardware with oscilloscopes, logic analysers, spectrum analysers, network analysers and laboratory power supplies.',
      'You can troubleshoot complex hardware issues independently and own the engineering outcome.',
      'Strong technical communication and documentation skills.',
      'You work well with software and AI engineering teams.',
    ],
    fitNote:
      'A bachelor’s or master’s degree in electrical engineering, electronics engineering or a related field is welcome. Equivalent practical experience counts for just as much.',
    extra: [
      'System-on-Module carrier boards, embedded computing platforms or custom processor boards',
      'PCIe, USB 3.x, DDR3/DDR4/LPDDR, MIPI CSI/DSI, Gigabit Ethernet and other high-speed interfaces',
      'RF and wireless hardware, including antenna matching networks, RF front ends, impedance matching and filters',
      'Mixed-signal systems combining precision analog circuitry, ADCs/DACs and high-speed digital',
      'Compact, high-density multilayer boards: 6 to 12+ layers, HDI, microvias and fine-pitch BGA routing',
      'Power electronics, battery systems, motor drives, DC-DC converters or high-current power distribution',
      'Signal integrity, power integrity, EMI/EMC and thermal analysis',
      'SPICE, RF/EM simulation, VNA measurements or automated hardware verification',
      'Hardware for robotics, drones, industrial systems, automotive, medical devices, telecommunications or edge computing',
      'Altium Designer or Cadence Allegro, in addition to KiCad',
      'Embedded Linux, FPGA-based systems or complex SoCs',
      'Taking hardware products from prototype through manufacturing and production',
      'Working directly with customers on commercial hardware projects',
      'Contributions to open-source hardware, EDA tooling or engineering automation',
      'Collaborating with AI/ML teams or building AI-assisted engineering workflows',
    ],
    // The form at binary.so asks for each of these as its own field, including
    // the KiCad samples as a required upload. The list stays on the page so a
    // candidate can gather the material before opening a form that will not
    // let them submit without it.
    applyUrl: 'https://binary.so/jaa9B4X',
    applyNote:
      'The form asks for all of this, so have it to hand before you start. An application without KiCad samples cannot be assessed.',
    applySend: [
      'A short introduction',
      'The most complex multilayer board you personally designed and brought up',
      'Native KiCad screenshots or project samples, with confidential details removed',
      'Board specifications: layer count, stack-up, interfaces and your exact contribution',
      'The bring-up and validation work you performed, and what went wrong first',
      'One design rule you follow routinely, and when it does not apply',
    ],
    // TODO(careers): no band was given for this role, so the Pay section does
    // not render. Set it to the range and equity you are willing to state.
    published: true,
    posted: '2026-10-07',
  },
  {
    slug: 'founding-software-engineer',
    title: 'Founding Software Engineer - AI Infrastructure',
    discipline: 'Engineering',
    location: 'Bengaluru, India',
    workplace: 'On-site',
    address: { locality: 'Bengaluru', region: 'Karnataka', country: 'IN' },
    commitment: 'Full-time',
    summary:
      'Build the agent infrastructure, sandboxes, job pipelines and evaluation harnesses that let AI create, modify and verify real PCB designs reliably.',
    context: [
      'copperhead’s agents help engineers create, modify and verify real PCB designs using frontier models, deterministic engineering tools and open-source EDA infrastructure. This role builds the infrastructure that makes that reliable: the execution loops, sandboxes, queues, evaluation harnesses and tracing that sit underneath every agent, rather than another thin wrapper around a model API.',
      'It is a hands-on engineering role for someone who enjoys building AI systems, backend infrastructure and developer tools from the ground up. You would join at the founding stage, take real ownership from the first day and shape the product, the architecture and the company, most of it in the open alongside the developer and hardware community already using the tool, for a competitive salary and meaningful equity. Whatever you have built before, you should be able to explain what you personally owned, the tradeoffs you made and how the system behaved when something failed.',
    ],
    work: [
      'Build the agent infrastructure used to create, modify and verify PCB designs.',
      'Develop reliable tool-use, context management, memory, evaluation and orchestration systems.',
      'Build stateful execution loops that can plan work, call engineering tools, inspect results and recover from failures.',
      'Create sandboxed environments for safely operating on real KiCad projects and user files.',
      'Improve schematic generation, PCB layout, component selection and datasheet understanding.',
      'Integrate LLMs with KiCad, deterministic verification tools and open-source EDA infrastructure.',
      'Build job queues, workers, APIs and artifact pipelines for long-running engineering workflows.',
      'Develop evaluation harnesses and benchmarks for measuring engineering correctness, reliability and regressions.',
      'Design production-quality backend systems and developer-facing interfaces.',
      'Improve system reliability, latency, performance, observability and test coverage.',
      'Build logging and tracing systems that make agent behaviour inspectable and reproducible.',
      'Own projects from initial exploration and prototyping through production deployment.',
      'Contribute to technical documentation and open-source engineering practices.',
      'Help establish copperhead’s engineering culture, architecture and development processes.',
    ],
    fit: [
      'Strong software engineering in Python, TypeScript, Go, Rust or a similar language.',
      'You have designed, built and operated production backend or infrastructure systems.',
      'You have built AI products, intelligent agents, model integrations or workflow orchestration systems.',
      'You understand LLM tool calling, structured outputs, context management and multi-step execution.',
      'Experience with APIs, databases, background workers, message queues or distributed job-processing systems.',
      'Familiarity with failure handling: retries, idempotency, timeouts, checkpointing and resumable execution.',
      'You have used containers and cloud infrastructure to run isolated or compute-intensive workloads.',
      'You write clean, tested and maintainable production code.',
      'A strong understanding of system design, performance, security, monitoring and observability.',
      'You have debugged failures across application code, infrastructure and external services.',
      'Comfort working through ambiguous technical problems and owning the outcome end to end.',
      'You can move between fast prototypes and reliable production systems.',
      'Strong written and verbal communication.',
      'An interest in electronics, hardware design or PCB engineering, and the ability to pick up an unfamiliar technical domain quickly.',
    ],
    fitNote:
      'The systems you have built and the problems you have solved matter more to us than your exact number of years of experience. Previous PCB design experience is useful and not required. A degree in computer science, engineering or a related field is welcome, and equivalent practical experience counts for just as much.',
    // The listing had two optional lists, "the kind of experience that stands
    // out" and "nice to have". Both describe things a candidate may have done
    // and neither is a requirement, so they are one list here and the items
    // the two had in common appear once.
    extra: [
      'AI agents that call tools and operate on files, codebases or external environments',
      'Coding agents, developer tools, CI systems or remote execution platforms',
      'Distributed workers that execute long-running, asynchronous jobs',
      'Sandboxed code or workflow execution environments, including multi-tenant execution infrastructure',
      'Evaluation systems for the reliability of probabilistic AI behaviour, structured generation or agent reliability',
      'Model routing, fallback, caching or provider abstraction layers',
      'Production systems using PostgreSQL, Redis, queues, object storage and containerised workers',
      'CLIs, language tooling, compilers, static analysis, intermediate representations or program transformation',
      'Infrastructure where auditability, reproducibility and failure recovery were important',
      'Docker, Kubernetes, Terraform or cloud infrastructure',
      'Experience building developer tools or open-source software',
      'Familiarity with KiCad or another EDA or CAD tool',
      'Contributions to technically ambitious open-source projects',
      'Prior experience at an early-stage startup',
    ],
    applyUrl: 'https://binary.so/evoDv0z',
    applyNote:
      'Send your LinkedIn, GitHub or personal website, links to projects, technical writing, open-source contributions or products you have shipped and a short note covering three things.',
    applySend: [
      'The hardest infrastructure, AI agent or developer-tooling system you have built',
      'What you personally owned',
      'A difficult technical failure you encountered and how you solved it',
    ],
    // TODO(careers): the listing promises a competitive salary and meaningful
    // equity and gives no numbers, so the Pay section does not render. Set it
    // to the range and equity you are willing to state.
    published: true,
    posted: '2026-09-07',
  },
];

/** Canonical path for a role page. */
export const rolePath = (slug: string) => `/careers/${slug}/`;

/**
 * Role copy, escaped for embedding in the description's HTML.
 *
 * The description is the one JSON-LD value that carries markup, and Base.astro
 * writes the serialised block with set:html, so an unescaped angle bracket in
 * a listing is the only thing standing between role copy and the page's own
 * script tag. Nothing in `roles` contains one today. This is so that staying
 * true is not a thing anyone has to remember while writing a job ad.
 */
const esc = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const htmlList = (items: string[]) =>
  `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;

/**
 * The posting's description, as the full HTML Google asks for.
 *
 * Not `summary`. Google's JobPosting guidance wants the complete description
 * and rules out a summary or a restatement of the title, so sending the card
 * blurb is how a listing that renders four sections of real copy enters a job
 * index describing itself in one sentence. The headings below are the role
 * page's own headings, so the posting and the page cannot drift into
 * describing different jobs.
 */
function jobDescriptionHtml(role: Role): string {
  return [
    role.context.map((para) => `<p>${esc(para)}</p>`).join(''),
    '<h2>What you would own</h2>',
    htmlList(role.work),
    `<h2>${esc(role.fitHeading ?? 'What we look for')}</h2>`,
    htmlList(role.fit),
    role.fitNote ? `<p>${esc(role.fitNote)}</p>` : '',
    role.extra.length ? `<h2>Nice to have</h2>${htmlList(role.extra)}` : '',
    role.pay ? `<h2>Pay</h2><p>${esc(role.pay.text)}</p>` : '',
  ].join('');
}

/**
 * `baseSalary`, and only for a band whose numbers were actually given.
 *
 * A role may state pay as prose alone. That renders a Pay section and emits no
 * salary, which is a posting that says less than the page rather than one that
 * says something different, and only the second of those misleads anybody.
 */
function baseSalary(pay: RolePay | undefined) {
  if (!pay?.currency || !pay.unit) return null;
  if (pay.min === undefined && pay.max === undefined) return null;
  return {
    '@type': 'MonetaryAmount',
    currency: pay.currency,
    value: {
      '@type': 'QuantitativeValue',
      ...(pay.min !== undefined ? { minValue: pay.min } : {}),
      ...(pay.max !== undefined ? { maxValue: pay.max } : {}),
      unitText: pay.unit,
    },
  };
}

/**
 * JobPosting node for a role, or null for one that has no `posted` date.
 *
 * Null is the normal answer for a role that is not open yet, and both routes
 * are written to take it: the index drops the role from its list and the role
 * page emits no job markup at all. That is the whole reason the gate is a date
 * rather than a boolean. A boolean can be set on a listing nobody has actually
 * published; `datePosted` is required by schema.org and by Google's job
 * guidelines, so a role cannot enter a job index without someone having
 * answered the one question that makes the posting true.
 */
export function jobPostingJsonLd(role: Role): Record<string, unknown> | null {
  if (!role.posted) return null;

  // The union on Role guarantees the field each branch reads, so neither can
  // fall through to a posting with no location.
  const where =
    role.workplace === 'Remote'
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: {
            '@type': 'Country',
            name: role.hiringRegion,
          },
        }
      : {
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: role.address.locality,
              ...(role.address.region ? { addressRegion: role.address.region } : {}),
              addressCountry: role.address.country,
            },
          },
        };

  const salary = baseSalary(role.pay);

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description: jobDescriptionHtml(role),
    datePosted: role.posted,
    ...(role.validThrough ? { validThrough: role.validThrough } : {}),
    // Stable across every edit to the listing. Without it a retitled role reads
    // as a second job rather than the same one, which is how one opening ends
    // up in a job index twice.
    identifier: {
      '@type': 'PropertyValue',
      name: 'copperhead',
      value: role.slug,
    },
    url: new URL(rolePath(role.slug), site).href,
    employmentType: EMPLOYMENT_TYPE[role.commitment],
    ...(salary ? { baseSalary: salary } : {}),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'copperhead',
      // The URL Google reconciles the posting against is the site serving it.
      // chouhan.ai is the same organisation and belongs in sameAs, which is the
      // property for exactly that: naming it as the canonical url is what
      // produces a hiringOrganization that does not match the host.
      url: site,
      sameAs: links.chouhan,
    },
    ...where,
    // The application is off-site wherever `careersApply` points, and it stays
    // off-site while that is null and the button opens an email.
    directApply: false,
  };
}

/** The roles that actually render. Everything downstream reads this, not `roles`. */
export const openRoles = roles.filter((r) => r.published);

/**
 * A published role with no `posted` date is announced by every means the site
 * has, the navbar, the index, the sitemap and llms.txt, and emits no
 * JobPosting, so it cannot be found in a job index at all. That is the right
 * state for a listing being staged and the wrong one for a listing that is
 * live, and the two are indistinguishable from the page. Say which roles are
 * in it at build time rather than leaving it to be noticed.
 */
const unposted = openRoles.filter((r) => !r.posted).map((r) => r.slug);
if (unposted.length) {
  console.warn(
    `[careers] published with no \`posted\` date, so no JobPosting markup and ` +
      `no entry in a job index: ${unposted.join(', ')}`,
  );
}

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
