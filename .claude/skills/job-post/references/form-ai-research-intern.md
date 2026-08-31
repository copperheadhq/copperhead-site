# Application form: AI Research Intern

Build at binary.so. The published URL goes in the `applyUrl` of the `ai-research-intern`
role in [src/careers.ts](../../../../src/careers.ts).

**Form title:** AI Research Intern, copperhead
**Intro text:**

> copperhead is an open source agent that designs, documents and verifies real circuit
> boards. This internship is aimed at the open research problems underneath it, full-time
> and on-site in Bengaluru. Evidence of curiosity and strong experiments matters more
> here than credentials, so the questions ask for both.

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
| 12 | How many months are you available for, and are you currently enrolled anywhere? | Short text | Yes |
| 13 | Which frameworks have you worked in? | Checkbox | Yes |
| 14 | A paper you implemented, or an experiment you ran that changed your mind. What was the hypothesis, and what did the result actually say? | Long text | Yes |
| 15 | What have you built or trained that involved LLMs, transformers, tool use or agents? | Long text | Yes |
| 16 | Publications, research projects or open-source work | Long text | No |
| 17 | Name a research direction in AI for electronics you would want to attack, and say why it is tractable | Long text | Yes |

Options for question 13:

- PyTorch
- JAX
- TensorFlow
- Other

## What each question is for

Question 12 is first in the role block because an internship is bounded and a mismatch on
dates makes everything below it moot. Enrolment is asked in the same breath because it
decides what "full-time" can mean.

Question 14 is the one that matters. "Changed your mind" is doing the work: it asks for
an experiment whose result was not the one wanted, which is the difference between
someone who runs experiments and someone who runs demonstrations. A candidate who
answers it with a result that confirmed everything has told you something.

Question 17 tests the curiosity the listing says it values over credentials, and the
"why it is tractable" half stops it collecting wish lists.

Question 16 is optional because the listing is explicit that publications are a nice to
have. Requiring it would filter for exactly the credential the role says it does not
need.
