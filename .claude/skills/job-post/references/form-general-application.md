# Application form: general intake

The open application behind the "Introduce yourself" button on
[/careers/](../../../../src/pages/careers/index.astro). Its URL goes in `careersApply` in
[src/config.ts](../../../../src/config.ts), which also makes it the fallback for any
published role that has no form of its own yet.

Modelled on the Supermemory founding-team form. Where this one departs from that
template it is because a fact differs, and each departure is called out below rather
than left for someone to discover.

## This is the one form with a role select

Every other form here is per-role, which is what stops a role select going stale. This
one cannot avoid having one: it exists to catch people who do not know which role they
want, or who want none of them.

So the rule the skill states applies to this form and only this form. **Publishing a
role means adding its exact title to question 3 before the page goes live. Closing one
means taking the option off.** Neither failure is visible from the repository. An
application against a missing option arrives labelled as something else and nobody finds
out until somebody reads the pile.

## Intro copy

Enter as the form's description. Sentence by sentence this is all checkable against the
repository or the site, which is deliberate: a hiring page that overstates a company is
found out by exactly the people worth hiring.

> ### About copperhead
>
> copperhead is an open source agent for hardware design. Given a plain-English change
> request or a written brief, it edits real KiCad files in your own git repository,
> propagates the change into every document that references it and verifies its own work
> by running kicad-cli ERC and DRC until the checks pass. It leaves artifacts on disk
> rather than advice in a chat window.
>
> Two invariants make that loop worth trusting. Nothing starts without a spec: the edit
> tools stay locked until a validated change proposal exists. Nothing is finished until
> the tools agree: every file mutation is followed by a verification run inside a git
> snapshot that rolls back if it fails. Spec-gated in, verification-gated out.
>
> It was built by Chouhan Industries and proven on Open Telegraph, a 40 by 40 mm
> ESP32-S3 Morse key with a 25 microamp deep-sleep budget. Building that board produced
> copperhead and redesigning the board through copperhead proved it. Both are public.
>
> ### Why join
>
> The team is small enough that every hire is a large fraction of it, and the product is
> early enough that the architecture is still being decided. That cuts both ways and we
> would rather you knew which way before you apply.
>
> What is genuinely good here: the work is open by default, so most of what you build
> can be shown to whoever hires you next. The problems are real rather than invented,
> because a board either passes its checks or does not. And there is nobody between you
> and the decision.
>
> What is genuinely hard: there is no playbook, no second team to hand something to and
> no revenue yet at the scale that makes any of this safe.
>
> ### Open roles
>
> **Founding AI Engineer.** The systems that turn a written brief into a validated PCB
> design: agents, tool use, evaluation and the gates that stop a model when it is wrong.
>
> **AI Research Intern.** The open problems underneath the product. Agentic systems,
> reinforcement learning for constrained design, ML-based physics models.
>
> **Forward Deployed Hardware Engineer.** A contract role owning customer boards from
> requirements through bring-up. This one has hard requirements and its own form.
>
> If none of those is quite you, apply anyway and say so. Roles here get written around a
> person about as often as the other way round.
>
> ### What we look for
>
> Visible evidence that you build things. Not a description of things you have built:
> the things themselves, in a repository, a board, a paper or a teardown.
>
> Breadth with at least one deep place. Everyone here has to reach across software and
> electronics at some point, and nobody arrives already fluent in both.
>
> Someone who would rather argue with a benchmark than with an opinion. The whole
> product is built on that preference.
>
> ### What we do not look for
>
> A notable university. Nobody here will check.
>
> An age. Be as young or as old as you are.
>
> Existing PCB experience, except on the hardware contract where it is stated plainly.
> The rate at which you pick up an unfamiliar technical domain matters more.
>
> ### Our stack
>
> TypeScript and Node for the CLI and its tools, over KiCad s-expressions and kicad-cli.
> Next.js and Supabase on Cloudflare for the hosted platform. Astro for the site. Python
> and PyTorch for research work. You are not expected to know all of it.
>
> ### Where the work happens
>
> In person in Bengaluru. Every open role is on-site and we are not hiring remotely.
> This is the honest deal breaker, so it is here rather than three questions in.
>
> ### Compensation
>
> TODO(careers): state the bands before publishing this form.
>
> ### Before you apply
>
> Please install it and try it. `npm i -g copperhead`, and the docs are at
> docs.copperhead.sh. It is free, it runs locally on your own key, and the last question
> on this form asks what you made of it.

**Compensation is the one section that cannot be published as written.** No band exists
in the repository for any of the three roles, every `pay` field is unset, and inventing
one is a promise to a stranger. Fill it in or delete the heading. Do not publish the
TODO.

## Fields

| # | Question | Type | Required |
| --- | --- | --- | --- |
| 1 | Name | Short text | Yes |
| 2 | Email | Email | Yes |
| 3 | Which role are you interested in? | Select | Yes |
| 4 | Can you work in person from Bengaluru? | Select | Yes |
| 5 | Are you authorised to work in India? | Select | Yes |
| 6 | Record a short video about the hardest engineering problem you have solved | Video, 60 seconds | Yes |
| 7 | Previous notable experience | Checkbox | Yes |
| 8 | More context about the above | Long text | Yes |
| 9 | Show us something you have built. Link it. | Short text | Yes |
| 10 | GitHub | Short text | Yes |
| 11 | LinkedIn | Short text | No |
| 12 | X | Short text | No |
| 13 | Portfolio, site or writing | Short text | No |
| 14 | Will you be able to join full time? Any other commitments? | Long text | Yes |
| 15 | Early startups are hard. Why do you want to be at one, and how risk averse are you? | Long text | Yes |
| 16 | You were asked to try copperhead. What did you make of it? | Long text | Yes |
| 17 | Possible start date | Date | Yes |
| 18 | Phone. Optional, we may call you | Phone | No |
| 19 | Resume | File upload, 10MB | Yes |
| 20 | Anything else we should know? | Long text | No |

Options for question 3, which must match the `title` of every published role in
[src/careers.ts](../../../../src/careers.ts):

- Founding AI Engineer
- AI Research Intern
- Forward Deployed Hardware Engineer
- I am not sure, or none of these

Options for question 4:

- I am in Bengaluru
- I am elsewhere in India and will relocate
- I am outside India and will relocate
- I cannot work in person

Options for question 5:

- Yes, I am an Indian citizen
- Yes, I hold a valid work visa or OCI
- No, I would need sponsorship
- I am not sure

Options for question 7:

- Shipped a hardware product that people bought
- Published or participated in academic research
- A notable open-source project or contributions
- Founded a startup that raised
- Taken a company from nothing to its first revenue
- Other

## Where this departs from the Supermemory template, and why

**The visa question is about India, not the US.** The template asks non-citizens in the
US which visa they hold. Every role here is in Bengaluru, so the equivalent question is
Indian work authorisation. Copying the original across would have collected an answer
that means nothing.

**Remote is refused, not welcomed.** The template says "We are open to remote roles!".
Every copperhead role is on-site and the hardware listing says outright that remote
applications will not be considered. This is the largest single filter on the form,
which is why it is question 4 and why the intro says it too.

**The video is required here and optional on the role forms.** A general intake form
takes the most volume and the least targeted applications, which is exactly where a 60
second video pays for its friction. The role forms already filter by their own hard
questions and do not need it.

**Question 16 has no counterpart.** The template asks applicants to read the docs before
applying and then never mentions it again. copperhead is free to install and runs
locally, so trying it costs a candidate ten minutes, and asking what they made of it is
both a filter and the best product feedback in the pile. Expect a few answers that are
better than the application around them.

**No traction numbers anywhere in the intro.** The template opens on customer counts,
tokens processed and press. The equivalent numbers here are live on the site already,
fetched at build time from GitHub and npm, so hardcoding a copy into a form would date
the moment it was entered. Point at the site instead.

## Wiring it in

The published URL goes in `careersApply` in
[src/config.ts](../../../../src/config.ts). That switches the index page's "Introduce
yourself" button off the mailto fallback, and any role without its own `applyUrl` starts
pointing here too, with its button relabelled automatically.
