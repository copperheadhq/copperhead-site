# Application form: Founding AI Engineer

Build at binary.so. The published URL goes in the `applyUrl` of the
`founding-ai-engineer` role in [src/careers.ts](../../../../src/careers.ts).

> **The live form at [binary.so/ejd7Mkv](https://binary.so/ejd7Mkv) predates this
> spec.** It was built against the earlier listing, which asked for a strong AI product
> engineer. The role now states a research-level bar, and questions 13 to 17 below are
> what test it. Until they are entered by hand, the form accepts applications it cannot
> sort: nothing asks whether the candidate has trained a model, implemented an RL
> algorithm or changed an architecture.

**Form title:** Founding AI Engineer, copperhead
**Intro text:**

> copperhead is an open source agent that designs, documents and verifies real circuit
> boards. This role is the founding engineer on the core of it, on-site in Bengaluru.
> The bar is research-level: training, reinforcement learning and custom architectures,
> then the production engineering that decides whether any of it ships. The questions
> below are about what you have actually built and trained. Those are the ones we read
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
| 13 | Which of these have you worked in? | Checkbox | Yes |
| 14 | Describe a model you trained or fine-tuned end to end. What was the architecture, what was the data and how did you know it worked? | Long text | Yes |
| 15 | Which reinforcement learning algorithms have you implemented yourself, and what did you apply them to? | Long text | Yes |
| 16 | Describe an architecture you designed or modified rather than used off the shelf. What did you change, and what did it buy you? | Long text | Yes |
| 17 | A paper you implemented from its description. What did the paper leave out? | Long text | Yes |
| 18 | Tell us about something agentic you have built that had to be right rather than impressive. What was it, what broke, and what did you do about it? | Long text | Yes |
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

- PyTorch
- JAX
- TensorFlow
- Distributed or multi-GPU training
- CUDA or custom kernels
- None of these

## What each question is for

Questions 14 to 17 are the rigour gate, and they are the reason this form is longer
than the other two. The listing now asks for someone who can derive and debug the
methods rather than call them, so each one asks for a thing done rather than a
familiarity claimed. "None of these" is a real option on question 13 because a
candidate who picks it has answered the form honestly and quickly, which is worth more
than a form they abandon.

Question 14 asks how the candidate knew the model worked, and that half matters more
than the architecture half. Anyone can name a model. Evaluation is what separates a
training run from a result.

Question 16 is where a custom transformer encoder would be described. It is worded
more broadly than the listing on purpose: an encoder over netlists is the shape this
role needs, and someone who has built a different custom architecture for a different
structured domain has demonstrated the same thing.

Question 17 tests reading rather than writing. What a paper leaves out is the part you
only find by implementing it, so an answer that names a real omission cannot be
produced by having skimmed the abstract.

Question 18 was the question that used to decide most applications, and it still
decides most of the ones that clear 14 to 17. The follow-up about what broke is the
half that separates a demo from a system someone operated.

Question 20 covers "comfort working through ambiguous technical problems and owning
outcomes end to end", which is unanswerable as a yes or no and is why it is asked as a
story with a cost attached.

Question 21 stands in for the hardware requirement this role does not have. Previous
PCB experience is not required, so what is being tested is the rate at which someone
picks up an unfamiliar domain, which is the thing they will actually have to do here.

Question 22 is optional on purpose. Making it required would filter for the experience
the listing explicitly does not ask for.

## On length

Twenty-two questions is long, and six of them are long text. That is a deliberate
trade for a founding role with a hard bar: the form is doing work an early call would
otherwise do, and someone unwilling to write five paragraphs about their own work is
not going to enjoy this job. Watch the completion rate anyway. If good candidates are
starting and not finishing, question 17 is the first one to make optional and question
21 is the second, because the listing tests both again in conversation.
