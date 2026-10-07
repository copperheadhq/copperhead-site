# Application form: Senior AI PCB Design Engineer

**Live at [binary.so/jaa9B4X](https://binary.so/jaa9B4X)**, wired to the `applyUrl` of
the `senior-ai-pcb-design-engineer` role in
[src/careers.ts](../../../../src/careers.ts). Edit the form at binary rather than here,
then bring this file back into line with it.

Modelled on
[form-forward-deployed-hardware-engineer.md](form-forward-deployed-hardware-engineer.md).
Like that form it is a gate rather than a general application: the listing states hard
requirements, so the form asks for evidence of boards rather than for claims about them.
Where it differs, the role differs. This is full-time rather than a contract, it is not
tied to one carrier board and half of it is turning how the candidate reasons into rules
copperhead can check, which is why question 23 exists.

**Form title:** Senior AI PCB Design Engineer, copperhead
**Intro text:**

> A full-time, in-person role in Bengaluru, designing production-grade multilayer boards
> in KiCad and encoding how you make those decisions into copperhead. This role has hard
> requirements: five or more years of professional PCB work, production-level KiCad and
> complex multilayer boards you have personally taken through bring-up. The form asks
> for evidence of that work with confidential details removed. An application without
> KiCad samples cannot be assessed.

## Common block

| # | Question | Type | Required |
| --- | --- | --- | --- |
| 1 | Name | Short text | Yes |
| 2 | Email | Email | Yes |
| 3 | Can you work in person from Bengaluru? | Select | Yes |
| 4 | GitHub | Short text | No |
| 5 | LinkedIn | Short text | No |
| 6 | Portfolio, site or writing | Short text | No |
| 7 | Resume | File upload, 10MB | Yes |
| 8 | When could you start, and what notice do you owe? | Short text | Yes |
| 9 | What are you expecting to be paid? | Short text | Yes |
| 10 | Anything else we should know? | Long text | No |
| 11 | Optional, 60 seconds: walk us through a board you brought up and what went wrong first | Video | No |

Options for question 3:

- I am in Bengaluru
- I am elsewhere in India and will relocate
- I am outside India and will relocate
- I cannot work in person

GitHub is optional here for the same reason it is on the contract form. A long PCB
career leaves its evidence in fabrication files and photographs rather than in commits.

## Role block

| # | Question | Type | Required |
| --- | --- | --- | --- |
| 12 | A short introduction | Long text | Yes |
| 13 | Years of professional electronics or PCB engineering experience | Short text | Yes |
| 14 | Describe the most complex multilayer board you personally designed and brought up | Long text | Yes |
| 15 | Native KiCad screenshots or project samples, with confidential information removed | File upload | Yes |
| 16 | Board specifications: layer count, stack-up, interfaces and your exact contribution | Long text | Yes |
| 17 | The bring-up and validation work you performed on it, and what went wrong first | Long text | Yes |
| 18 | Which high-speed interfaces have you designed and brought up on a production board? | Checkbox | Yes |
| 19 | Which of these have you designed on a production board? | Checkbox | Yes |
| 20 | Which analyses have you run on your own designs? | Checkbox | Yes |
| 21 | Which instruments do you use routinely? | Checkbox | Yes |
| 22 | Describe your experience with EMI/EMC, DFM, DFT and production test | Long text | Yes |
| 23 | Pick one decision you make routinely when designing a board, such as a stack-up or a regulator choice. Write down the rule you follow and when it does not apply | Long text | Yes |
| 24 | Have you worked directly with customers on commercial hardware, or with AI/ML teams on engineering workflows? | Long text | No |

Options for question 18:

- PCIe
- USB 2.0
- USB 3.x
- DDR3, DDR4 or LPDDR
- MIPI CSI or DSI
- Gigabit Ethernet
- Another high-speed serial interface
- None of these

Options for question 19:

- RF matching networks or filters
- Antennas or RF front ends
- Precision analog front ends, ADCs or DACs
- Battery systems
- DC-DC converters or high-current power distribution
- Motor drives
- Six to twelve or more layer boards
- HDI, microvias or fine-pitch BGA routing
- None of these

Options for question 20:

- SPICE circuit simulation
- Signal integrity
- Power integrity
- RF or EM simulation
- Thermal analysis
- None of these

Options for question 21:

- Oscilloscope
- Logic analyser
- Spectrum analyser
- VNA or TDR
- Bench power supply
- Thermal camera

## What each question is for

Questions 12 and 14 to 17 are the role page's own "have it to hand" list, field for
field. If that list changes in [src/careers.ts](../../../../src/careers.ts), change these
with it.

Question 15 is the gate. The listing requires production-level KiCad and the intro says
an application without samples cannot be assessed, so it is a required upload rather
than a link that may not resolve in three months.

Question 14 replaces the contract form's CM4 or CM5 carrier-board question. This role is
not tied to one board, so it asks for the most complex one the candidate owned and lets
questions 16 and 17 pin down what that means.

Questions 18 to 20 cover the listing's hard requirements and most of its preferred list
as checkboxes. Asked as prose they would be answered as prose, and a checkbox row is
faster to fill in and far faster to score. "None of these" is a real option on each so
that an honest short answer beats an abandoned form.

Question 21 is a proxy for the debugging requirement, with spectrum analyser added
because the listing names it. What someone reaches for routinely says more than a
sentence claiming they have done bring-up.

Question 23 is the half of the role the contract form does not test. The job is to
turn an experienced engineer's reasoning into rules, test cases and benchmarks.
Someone who can write one of their own rules down with its exceptions has already done
the job once. It is the answer to read after the samples.

Question 24 is optional on purpose. Both are on the preferred list and neither is
required, so a required field would filter for experience the listing does not demand.

## On length

Twenty-four questions, seven of them long text, is two more than the contract form.
Question 23 is the one worth keeping if the form has to shrink. Questions 20 and 24 are
the first to cut.
