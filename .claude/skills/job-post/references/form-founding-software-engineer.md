# Application form: Founding Software Engineer - AI Infrastructure

Built at binary.so and live at [binary.so/evoDv0z](https://binary.so/evoDv0z), which is
the `applyUrl` of the `founding-software-engineer` role in
[src/careers.ts](../../../../src/careers.ts).

**Form title:** Founding Software Engineer - AI Infrastructure, Copperhead
**Intro text:**

> Copperhead is an open source agent that designs, documents and verifies real circuit
> boards. This role builds the infrastructure underneath the agents, on-site in
> Bengaluru: the execution loops, sandboxes, job pipelines, evaluation harnesses and
> tracing that decide whether an agent's work can be trusted. The questions below are
> about systems you have built and operated, what you personally owned and what happened
> when they failed. Those are the ones we read first.

## Common block

| # | Question | Type | Required |
| --- | --- | --- | --- |
| 1 | Name | Short text | Yes |
| 2 | Email | Email | Yes |
| 3 | Can you work in person from Bengaluru? | Select | Yes |
| 4 | GitHub | Short text | Yes |
| 5 | LinkedIn | Short text | No |
| 6 | Portfolio, site or writing | Short text | No |
| 7 | Resume | File upload, 10MB | Yes |
| 8 | When could you start, and what notice do you owe? | Short text | Yes |
| 9 | What are you expecting to be paid? | Short text | Yes |
| 10 | Anything else we should know? | Long text | No |
| 11 | Optional, 60 seconds: what is a hard engineering problem you solved recently? | Video | No |

Options for question 3:

- I am in Bengaluru
- I am elsewhere in India and will relocate
- I am outside India and will relocate
- I cannot work in person

## Role block

| # | Question | Type | Required |
| --- | --- | --- | --- |
| 12 | Which languages have you shipped production code in? | Checkbox | Yes |
| 13 | Which of these have you built or operated in production? | Checkbox | Yes |
| 14 | The hardest infrastructure, AI agent or developer-tooling system you have built. What did it do, and what did you personally own? | Long text | Yes |
| 15 | A difficult technical failure in a system you ran, and how you solved it. What broke, how did you find it and what changed afterwards? | Long text | Yes |
| 16 | Describe an agent or execution loop you built that called tools and had to recover from failures. How did it decide it was done, and how did it recover? | Long text | Yes |
| 17 | How have you isolated untrusted or compute-heavy work? Sandboxes, containers, workers: what did the boundary look like, and what got through it? | Long text | Yes |
| 18 | How have you measured whether a probabilistic system was getting better or worse? Describe the evaluation, what it caught and what it missed. | Long text | Yes |
| 19 | A repository, pull request or system you would point at as your best work | Short text | Yes |
| 20 | Describe a technical problem you owned end to end when the requirements were not clear. What did you decide, and what did it cost? | Long text | Yes |
| 21 | What is the most unfamiliar technical domain you have had to get productive in, and how long did that take? | Long text | Yes |
| 22 | Any exposure to electronics, hardware or EDA tools? | Long text | No |

Options for question 12:

- Python
- TypeScript
- Go
- Rust
- Other

Options for question 13:

- Background workers or job queues
- Message queues or distributed job processing
- Containerised or sandboxed execution
- LLM tool calling or structured outputs
- Tracing, logging or observability pipelines
- None of these

## What each question is for

Questions 14 and 15 are the two things the listing asks a candidate to send, asked as
their own fields so that neither can be skipped inside a cover note. Both end on the
half that matters: ownership on 14 and what changed on 15. A system described without an
owner and a failure described without a fix are the two answers that look complete and
are not.

Question 16 is the role. Stateful execution loops that plan work, call tools, inspect
results and recover are the first thing on the listing's work list, and someone who has
built one has an answer to "how did it decide it was done" that a demo does not.

Question 17 covers the sandbox half of the listing. The follow-up about what got through
the boundary is deliberate: a boundary nobody has seen breached has not been tested.

Question 18 stands in for the evaluation and benchmark work. It asks what the evaluation
missed because an evaluation that has never missed anything has not been run for long.

Question 20 covers "comfort working through ambiguous technical problems and owning
outcomes end to end", which is unanswerable as a yes or no and is why it is asked as a
story with a cost attached.

Question 21 stands in for the hardware requirement this role does not have. Previous
PCB experience is not required, so what is being tested is the rate at which someone
picks up an unfamiliar domain, which is the thing they will actually have to do here.

Question 22 is optional on purpose. Making it required would filter for the experience
the listing explicitly does not ask for.

"None of these" is a real option on question 13 because a candidate who picks it has
answered the form honestly and quickly, which is worth more than a form they abandon.

## On length

Twenty-two questions, six of them long text, matches the Founding AI Engineer form and
for the same reason: a founding role with a bar the form is meant to test, where someone
unwilling to write five paragraphs about their own systems is not going to enjoy the
job. Watch the completion rate anyway. If good candidates are starting and not
finishing, question 18 is the first to make optional and question 21 the second, because
the listing tests both again in conversation.
