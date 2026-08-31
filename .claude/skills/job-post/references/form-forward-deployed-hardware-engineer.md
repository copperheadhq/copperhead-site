# Application form: Forward Deployed Hardware Engineer

**Live at [binary.so/3sX6dXu](https://binary.so/3sX6dXu)**, wired to the `applyUrl` of
the `forward-deployed-hardware-engineer` role in
[src/careers.ts](../../../../src/careers.ts). Edit the form at binary rather than here,
then bring this file back into line with it.

This form is a gate, not a general application. The listing states hard requirements and
says outright that the role is not suitable for beginners, so the form asks for evidence
rather than for claims.

**Form title:** Forward Deployed Hardware Engineer, copperhead
**Intro text:**

> A six to eight week paid contract in Bengaluru, in person, around an active Raspberry
> Pi CM5 carrier-board project. This role has hard requirements. The most important is
> that you have personally designed a CM4 or CM5 carrier board and can show evidence of
> it with confidential details removed. An application without that cannot be assessed.

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
| 9 | What contract rate are you expecting? | Short text | Yes |
| 10 | Anything else we should know? | Long text | No |
| 11 | Optional, 60 seconds: walk us through a board you brought up and what went wrong first | Video | No |

Options for question 3:

- I am in Bengaluru
- I am elsewhere in India and will relocate for the engagement
- I am outside India and will relocate for the engagement
- I cannot work in person

GitHub is optional on this form alone. A twenty year PCB career leaves its evidence in
fabrication files and photographs rather than in commits, and requiring a profile would
screen out the strongest candidates for this role.

## Role block

| # | Question | Type | Required |
| --- | --- | --- | --- |
| 12 | A short introduction | Long text | Yes |
| 13 | Years of professional electronics or PCB engineering experience | Short text | Yes |
| 14 | Are you available full-time for a six to eight week engagement, and from when? | Short text | Yes |
| 15 | Describe the Raspberry Pi CM4 or CM5 carrier board you personally designed | Long text | Yes |
| 16 | Native KiCad screenshots or project samples, with confidential information removed | File upload | Yes |
| 17 | Board specifications: layer count, interfaces and your exact contribution | Long text | Yes |
| 18 | The bring-up and validation work you performed on it | Long text | Yes |
| 19 | Which of these have you designed and brought up on a production board? | Checkbox | Yes |
| 20 | Which instruments do you use routinely? | Checkbox | Yes |
| 21 | Describe your experience with DFM, DFT, EMI/EMC and production test | Long text | Yes |

Options for question 19:

- Controlled-impedance routing
- Differential pairs
- Length matching
- MIPI CSI or DSI
- USB
- PCIe
- Ethernet
- microSD
- Power-tree design, sequencing and protection

Options for question 20:

- Oscilloscope
- Logic analyser
- Bench power supply
- VNA or TDR
- Thermal camera

## What each question is for

Questions 12 and 15 to 18 are the listing's own "How to apply" list, field for field. If
that list changes in [src/careers.ts](../../../../src/careers.ts), change these with it.
They are the only reason this form exists.

Question 16 is the gate. The listing requires evidence of the carrier-board work and the
intro text says an application without it cannot be assessed, so this is a required file
upload rather than a link that may or may not resolve in three months.

Question 19 covers seven hard requirements in one question. Asked as prose they would be
answered as prose, and a checkbox row is both faster to fill in and far faster to score
against a list that is genuinely pass or fail.

Question 20 is a proxy for the debugging requirement. What someone reaches for
routinely says more about the bring-up work they have really done than a sentence
claiming they have done it.
