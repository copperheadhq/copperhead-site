---
name: job-post
description: Add, edit or close a role on this site's careers section, in the house voice. Use whenever the task is writing a job post, converting a LinkedIn or ATS listing into the site's schema, editing an existing role, filling in pay or a posting date, or taking a role down. Enforces the two publication gates, the no-invented-facts rule and the same prose rules as the blog. Triggers on "job post", "add a role", "we're hiring", "careers page", "new opening", "job description", "close the role", "take the job down".
---

# Posting a role

## Where a role lives

Everything is one array in [src/careers.ts](src/careers.ts). There is no content
collection for roles and there should not be: every field lands in a fixed slot on the
card and on the role page, so two roles cannot end up making different promises about
what a role page contains.

- [src/careers.ts](src/careers.ts) is the `Role` interface, the array and the helpers.
  Read the interface first. Every field carries a comment saying what it is for.
- [src/pages/careers/index.astro](src/pages/careers/index.astro) is the index: role
  cards, the "how we work" block, the open application at the foot.
- [src/pages/careers/[...slug].astro](src/pages/careers/%5B...slug%5D.astro) is one
  page per role.

Adding a role means adding one object to `roles`. The route, the card, the sitemap
entry and the structured data all follow from it. Do not add a page by hand.

`slug` is what a candidate bookmarks and what a recruiter pastes into Slack. Set it
once and leave it alone. Renaming one silently breaks every link that already exists.

`copperhead` is lowercase everywhere, including sentence-initial and including inside
a listing pasted from somewhere that capitalised it.

## The two gates

Both exist so that a listing which is not real yet cannot behave as though it is. Know
which one you are touching.

**`published`** decides whether the role exists on the site at all. False keeps it out
of the index, out of `getStaticPaths` and out of the sitemap at once. A half-written
role is committed with `published: false`, the same way a draft post is committed with
an underscore in front of its filename.

**`posted`** is the ISO date the listing actually went live, and it alone turns on the
JobPosting structured data. A role with no `posted` renders a full page and emits no
job markup, which is the correct state for a role that is written but not yet open.

Never guess a `posted` date, including "today". It is the one field that decides
whether the role enters Google Jobs, and a date nobody chose is a fact nobody checked.
If you were not told when the posting went live, leave it unset, leave the TODO in
place and say so.

## Converting a listing you were handed

Most roles arrive as a LinkedIn or ATS post. Map it, do not paste it:

| What you were given | Where it goes |
| --- | --- |
| The "About <company>" preamble | Nowhere. The index standfirst already does this, better. |
| The role paragraph | `context` |
| "What you'll work on" | `work` |
| "What we're looking for" | `fit` |
| "X experience is useful but not required", degree notes | `fitNote` |
| "Nice to have" | `extra` |
| "Why join" | Fold into `context` as prose. It is not a fifth bullet list. |
| "To apply, send ..." | `applyNote` |
| Salary band, stipend, equity | `pay`, and only if you were actually given one |

Four bullet lists on one page is already the ceiling. A fifth list is a sign that
something belongs in `context` as a sentence.

Keep every requirement. Trimming a listing changes who applies, which is not a
formatting decision. Rewriting its punctuation is.

## Voice

Rules 1 to 3 of [blog-post](../blog-post/SKILL.md) apply in full: no em dashes, no
serial comma, none of the AI tells. Read that file if you have not.

`npm run lint:prose` does **not** cover this copy. It walks the two content
collections and a role lives in TypeScript, so both rules here are enforced by
reading. Check the pasted listing for serial commas specifically. Job posts are full
of them: `plan, generate, modify, and verify` becomes `plan, generate, modify and
verify`.

Beyond that:

- `summary` is one sentence and it is doing two jobs, the card blurb and the page's
  meta description. Write it as the sentence you would say to a candidate who asked
  what the job is. Not the title again in longer words.
- `context` is prose, two to five sentences, and it says why the role exists rather
  than what the company does. It is the only part of the page a good candidate reads
  slowly.
- `work` items are things you would own, `fit` items are things a person has done.
  Neither is a years-served count.
- Say the unglamorous half out loud. A listing that only describes the interesting
  quarter of a job is how someone leaves in four months.

## Location, and getting the markup right

`location` is the display string. `workplace` is `'On-site' | 'Hybrid' | 'Remote'` and
it picks which branch of the JobPosting node applies, so it is not decoration:

- On-site or hybrid needs `address` (locality, optional region, ISO alpha-2 country).
  It renders a real `jobLocation`.
- Remote needs `hiringRegion`, a country name. It renders `TELECOMMUTE` plus
  `applicantLocationRequirements`.

Sending `TELECOMMUTE` for a role with an address is how a Bengaluru job turns up in a
search for remote work. If you change `workplace` on an existing role, change the
copy that depends on it too: the "Hardware in the loop" entry on the index page names
where the team sits.

`commitment` is matched against `EMPLOYMENT_TYPE` in careers.ts for the schema. Use a
key that is in that map, or add one.

## Where applications go

Applications are collected on binary.so: one form per role rather than one form with a
role select, plus a general intake form for people who do not know which role they want.
[references/binary-form.md](references/binary-form.md) explains why and indexes the four
specs; each spec is complete on its own and is entered field by field into binary.

`applyHref` resolves most specific first: the role's own `applyUrl`, then
`careersApply` in [src/config.ts](src/config.ts), then `careers@copperhead.sh` with the
subject line pre-filled. The button label follows, so a mailto is never dressed up as
an application form.

`careersApply` is null until the form exists. Do not put a guessed ATS URL there. A
button wired to an address nobody owns is a broken application that nobody finds out
about, which is worse than an email.

A new role needs a form of its own, and the URL goes in that role's `applyUrl`. Until
it has one the role falls back correctly, so nothing breaks, but a live role collecting
applications by email is collecting them somewhere nobody is scoring. Closing a role
means closing its form at binary too: a form that outlives its page keeps taking
applications for a job that is gone, and nothing in this repository will tell you.

The general form's role select is the one place a stale option still bites. Add a
published role's exact title to it before the page goes live, and take the option off
when the role closes.

Binary has no documented public API. The form is built and edited by hand in an
authenticated dashboard, which means an agent cannot do it and should not claim to have
done it. Write the spec, hand it over, and wire the URL when it comes back.

## What you may not invent

Pay, location, dates, application URLs, headcount, funding, benefits. Every one of
these is a promise to a stranger who may act on it.

`pay` is optional and the section is dropped when it is unset, so a role with no band
is publishable. That is the honest outcome and it is not an invitation to make a band
up. Leave the TODO in the object and tell whoever asked that the section is missing.

## Closing a role

Set `published: false` and leave the object in place. The page and the sitemap entry
disappear on the next build. Delete the object only when the role is not coming back,
and remember the URL is now a 404 for anyone holding the link.

## Before you finish

```bash
npm run build            # the routes and the sitemap follow from the array
npx astro dev --background
npm run check:layout     # every viewport, sitemap-driven, so it now covers /careers
npx astro dev stop
```

If you added or closed a role, its binary.so form needs the matching change. That work
is not in this repository and nothing here will fail without it.

Then read the built page. Two things worth checking with your eyes rather than a
grep: that the meta row reads correctly for the workplace you set, and that no
`TODO(careers)` string is rendering on a live page. `pay` is the one field whose
placeholder would print in front of a candidate.
