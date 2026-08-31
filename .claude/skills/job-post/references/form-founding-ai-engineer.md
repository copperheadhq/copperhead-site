# Application form: Founding AI Engineer

Build at binary.so. The published URL goes in the `applyUrl` of the
`founding-ai-engineer` role in [src/careers.ts](../../../../src/careers.ts).

**Form title:** Founding AI Engineer, copperhead
**Intro text:**

> copperhead is an open source agent that designs, documents and verifies real circuit
> boards. This role is the founding engineer on the core of it, on-site in Bengaluru.
> Six questions below are about what you have actually built. Those are the ones we read
> first.

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
| 13 | Tell us about something agentic you have built that had to be right rather than impressive. What was it, what broke, and what did you do about it? | Long text | Yes |
| 14 | A repository, pull request or system you would point at as your best work | Short text | Yes |
| 15 | Describe a technical problem you owned end to end when the requirements were not clear. What did you decide, and what did it cost? | Long text | Yes |
| 16 | What is the most unfamiliar technical domain you have had to get productive in, and how long did that take? | Long text | Yes |
| 17 | Any exposure to electronics, hardware or EDA tools? | Long text | No |

Options for question 12:

- Python
- TypeScript
- Go
- Rust
- Other

## What each question is for

Question 13 is the one that decides most applications. The listing asks for something
agentic that had to be right rather than impressive, and the follow-up about what broke
is the half that separates a demo from a system someone operated.

Question 15 covers "comfort working through ambiguous technical problems and owning
outcomes end to end", which is unanswerable as a yes or no and is why it is asked as a
story with a cost attached.

Question 16 stands in for the hardware requirement this role does not have. Previous PCB
experience is not required, so what is being tested is the rate at which someone picks
up an unfamiliar domain, which is the thing they will actually have to do here.

Question 17 is optional on purpose. Making it required would filter for the experience
the listing explicitly does not ask for.
