# The binary.so application forms

One form per published role, built by hand at binary.so and linked from that role's
`applyUrl` in [src/careers.ts](../../../../src/careers.ts), plus one general intake form
behind `careersApply`. The specs are here, ready to enter field by field:

- [form-founding-ai-engineer.md](form-founding-ai-engineer.md), live at [binary.so/ejd7Mkv](https://binary.so/ejd7Mkv)
- [form-ai-research-intern.md](form-ai-research-intern.md), live at [binary.so/lazoJrH](https://binary.so/lazoJrH)
- [form-forward-deployed-hardware-engineer.md](form-forward-deployed-hardware-engineer.md), live at [binary.so/3sX6dXu](https://binary.so/3sX6dXu)
- [form-general-application.md](form-general-application.md), the open application

Each file is complete on its own. Building a form should not mean reading two documents
at once, so the common block is repeated in all three rather than referenced from here.

Binary has no documented public API, so this is dashboard work. An agent can write the
spec and wire the URL. It cannot build the form and must not claim to have built one.

## Why one form per role, and not one form with a role select

The reference form this was modelled on,
[binary.so/UeNYHHE](https://binary.so/UeNYHHE), is a single form with a "which role"
select and conditional sections behind it. That shape has one failure mode, and it is
silent: the select goes stale. Publish a fourth role, forget the option, and every
application for it arrives labelled as something else. Nothing in this repository fails,
and nobody finds out until someone reads the pile.

A form per role cannot drift that way. It also lets each form ask its own hard questions
first instead of hiding them three conditionals deep, and it gives the hardware contract
a form that is honestly a gate rather than a general application with extra fields.

The cost is that the common block is duplicated three times, so a change to it has to be
made three times. That is a worse trade for eleven forms and a better one for three.

The general intake form is the exception, and it has to be. It exists for people who do
not know which role they want, so it carries a role select and therefore carries the
staleness problem too. That is one form to remember rather than the only form there is,
which is the point of the split.

## The common block

Every role form opens with the same eleven questions, in the same order. Two of them are
doing more work than they look:

**Bengaluru is question three, not question ten.** All three roles are on-site and the
hardware listing says outright that remote applications will not be considered. It is
the largest single filter, and asking it late wastes the time of everyone who answers it
wrong.

**Expected pay is asked on every form**, including the two where the site states no
band. A form that does not ask it defers the conversation to a call that both sides may
regret taking.

## The video question

Binary is built around video answers and the reference form makes a 60 second video
required. It is a real signal and it is also the highest-friction question on any form,
excluding people answering on a borrowed laptop at midnight.

Every spec here has it optional. Make it required only if applications are too many
rather than too few, which is a decision to take on evidence.

## Wiring a form in

A form's URL goes in that role's `applyUrl` in
[src/careers.ts](../../../../src/careers.ts). `applyHref` prefers it over everything
else, and the button label switches from "Apply by email" to "Apply for this role" on
its own.

`careersApply` in [src/config.ts](../../../../src/config.ts) holds the general intake
form. It serves the index page's "Introduce yourself" button and every role that has no
form of its own. A role with neither falls back to `careers@copperhead.sh` with the
subject line pre-filled, which is a working application rather than a broken one.

## When a role is added or closed

- Publishing a role: it needs its own form and its own `applyUrl`, and its exact title
  added to the general form's role select. Until it has a form of its own it falls back
  correctly, so that half is not urgent, but a live role collecting applications by
  email is collecting them somewhere nobody is scoring. The select is urgent.
- Closing a role: close its form at binary and take its option off the general form's
  select. The page disappears on the next build, and a form that outlives its page keeps
  taking applications for a job that is gone.
