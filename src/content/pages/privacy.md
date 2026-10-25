---
title: "Privacy Policy"
description: "How Copperhead handles personal data on copperhead.sh and app.copperhead.sh."
path: /legal/privacy/
kind: Legal
updated: 2026-10-25
draft: false
source: copperhead-legal/product/Copperhead_Privacy_Policy_revB.md
---

## 1. About this Policy

**1.1** This Privacy Policy explains how Copperhead Private Limited ("Copperhead") collects,
uses, shares, keeps and protects personal data when you use the Copperhead cloud platform at
app.copperhead.sh, including hosted workspaces at workspaces.copperhead.sh, visit
copperhead.sh, or contact Copperhead (together, the "Service"). "You" and "your" mean the
individual whose personal data is processed. Read it with the [Terms of Service](/legal/terms/), which govern
your use of the Service.

**1.2** Copperhead processes personal data in accordance with the Digital Personal Data
Protection Act, 2023 (the "DPDP Act"), the Digital Personal Data Protection Rules, 2025 (the
"DPDP Rules"), and the Information Technology Act, 2000 and the rules made under it.

**1.3** For the personal data described in this Policy, Copperhead is the Data Fiduciary: it
decides why and how the data is processed.

**1.4** The open-source copperhead command-line agent runs on your own computer and sends
nothing to Copperhead. This Policy covers it only where it runs inside the Service.

**1.5** Some features this Policy describes, such as hosted workspaces and projects kept by
Copperhead, are not yet available to every account. The Policy describes what happens to your
personal data when you use them.

**1.6** This Policy takes effect on 25 October 2026. You can ask for this Policy in English or
in any language listed in the Eighth Schedule to the Constitution of India by writing to the
contact in Section 2.2.

## 2. Who we are and how to contact us

**2.1 Copperhead.** Copperhead Private Limited is a private limited company incorporated in
India with CIN U62099KA2026PTC227555, having its registered office at 101, 1st Floor, Abhee
Prince Apartment, Bellandur, Bangalore South, Bangalore-560103, Karnataka, India.

**2.2 Questions about your personal data.** Animesh Singh Chouhan, Founder and CEO, can answer
questions about how Copperhead processes your personal data. Write to privacy@copperhead.sh.

**2.3 Grievance Officer.** Complaints about how Copperhead handles your personal data can be
sent to its Grievance Officer:

- Name: Animesh Singh Chouhan
- Designation: Founder and CEO
- Email: privacy@copperhead.sh
- Address: the registered office in Section 2.1

Section 13 explains how complaints are handled.

## 3. Personal data we collect

### Sign-in and account data

**3.1 GitHub sign-in.** When you sign in with GitHub, Copperhead requests the read:user and
user:email permissions. GitHub shares your public profile, including your name, username,
user identifier and profile picture link, and your email address. Copperhead stores your
display name, profile picture link, GitHub username and GitHub user identifier in your
profile, and your email address in its authentication records.

**3.2 Google sign-in.** When you sign in with Google, Copperhead requests only the openid,
email and profile scopes. Google shares your name, email address, profile picture link and an
identifier for your Google account. Copperhead stores your display name and profile picture
link in your profile, and your email address in its authentication records. Copperhead uses
this data only to create your account, sign you in, show your name and picture in the Service
and send you service emails. It does not use it for advertising, does not sell it and shares
it only with the service providers in Section 7 that run the Service on its behalf. Copperhead
does not request access to any other Google data, such as your files, email or contacts.

**3.3 Email sign-in.** If you sign in with your email address, Copperhead collects that
address and, if you set one, your password, which its authentication provider stores in hashed
form. Copperhead sends sign-in links, confirmation emails and password-reset emails to that
address.

**3.4 Linked sign-in methods.** If you sign in with more than one method using the same
verified email address, the methods are linked to one account. Your account page lists each
linked sign-in method and its email address.

**3.5 Profile and preferences.** Your display name, the name you give your organisation, the
organisation you last used, and settings you choose in the Service.

### Organisation, project and repository data

**3.6 Organisations.** The name and plan of each organisation you belong to, your role in it,
and its usage allowance and consumption.

**3.7 GitHub App installation.** When you install the Copperhead GitHub App, the name and type
of the GitHub account you install it on.

**3.8 Connected repositories.** For each repository you connect, its name, identifier,
default branch and visibility. When you start a task, the Service reads files in the
repository and works on a copy of it at a specific commit. These files may contain personal
data, such as the names and email addresses of commit authors or names in design documents.

**3.9 Projects kept by Copperhead.** A project that is not connected to GitHub is kept by
Copperhead: its files and its full version history, including any author names and email
addresses recorded in that history.

**3.10 Imported designs.** If you import a design as a ZIP archive or from a public GitHub
link, Copperhead stores the archive and creates a project from it.

**3.11 Changes written to GitHub.** The repositories, branches, commits and pull requests the
Service creates for you.

### Content and activity in the Service

**3.12 Briefs and conversations.** Product briefs you write, messages you send, the Service's
responses, conversation titles, plans you approve or reject, and feedback you give on them.

**3.13 Runs.** The settings of each design run, including the model used, and a record of
its progress, including agent transcript events and the output of design tools and checks.
Before storing this record, Copperhead removes text that matches common secret formats, such
as access tokens and API keys.

**3.14 Run files.** Files that runs produce and Copperhead stores: agent transcripts, raw
check output, bill-of-materials exports, check reports, and a verification manifest. The
manifest records the run, organisation, project, repository name, commit, model, start and
finish times, and a summary of the result.

**3.15 Hosted workspaces.** When you open a workspace, the Service runs a container for you
that holds a copy of your project, a code editor, KiCad, the copperhead command-line agent and
Claude Code. Copperhead gives the container your user identifier, display name and email
address, so that work you do there can carry your name. A workspace keeps, for the next time
you open one:

- a snapshot of changes you have not yet saved to the project, including new files;
- your home folder, which holds your Claude Code sessions, your command history and your
  editor settings; and
- your organisation's shared folder.

The Service also stores messages you send to Claude Code in a workspace from the console,
Claude Code's replies, and summaries of the permission requests it shows you.

**3.16 Verification records.** When you record a verification decision in a workspace, the
record written to the project includes your name, email address and user identifier.

**3.17 Verification tools.** Files the Service sends to Copperhead's verification tools, such
as board, schematic and source files, and a record of each tool run with its outcome and the
sizes of its files.

**3.18 Model provider keys.** If your organisation adds its own API key for an AI model
provider, Copperhead stores the key encrypted and displays only its last four (4)
characters.

**3.19 Usage and audit records.** Records of actions taken in the Service, such as signing
up, creating an organisation, connecting or importing a project, starting or cancelling a run,
starting or stopping a workspace, and deleting an account, with the time and the account that
took the action. Records of model and workspace usage and their cost.

### Technical, analytics and communication data

**3.20 Technical data.** When you use the Service, Copperhead's hosting, network and
authentication providers process technical data such as your IP address, browser and device
information, and the time and address of each request, and record some of it in service
logs.

**3.21 Product analytics.** Copperhead records events about how the app is used, such as
signing in, creating an organisation, connecting a project, starting a workspace, and the
outcome and duration of a run. Each event carries a random identifier for your account and for
your organisation, and may include the sign-in method, the organisation's type and plan,
counts and sizes, and the address of the page you viewed. Copperhead does not send your name,
your email address or the content of your projects and conversations to its analytics
provider.

**3.22 Website analytics.** On copperhead.sh, Google Analytics collects information about
your visit through cookies, such as the pages you view, your browser and device, and your
approximate location.

**3.23 Emails, bookings and applications.** If you email Copperhead, it receives your email
address and your message. If you book a call or apply for a role through a scheduling or
application form linked from copperhead.sh, the form provider collects the details you enter
and shares them with Copperhead.

**3.24 Payments.** The Service does not currently take payments. Before it does, Copperhead
will update this Policy to describe the payment data it receives.

**3.25 Sources.** Copperhead collects personal data from you, from GitHub and Google when you
sign in or connect repositories, from members of your organisation, and automatically from
your use of the Service.

## 4. How we use personal data, and on what basis

**4.1 Purposes.** Copperhead uses personal data to:

- create your account, sign you in and keep your session secure;
- provide the Service you ask for: connect, import and keep projects, run the design agent,
  run hosted workspaces, generate designs, write changes to your projects and repositories,
  and show your conversations, runs and files;
- send your content to the AI model providers described in Section 5, to generate responses
  and designs;
- apply usage allowances and limits;
- send service emails, such as sign-in links, confirmations and password resets;
- keep the Service secure, detect and prevent abuse, fraud and unauthorised access, and keep
  audit records;
- understand how the Service is used, fix problems and improve it, using the analytics
  described in Section 6;
- respond to your requests, questions and grievances; and
- comply with the law, respond to lawful requests from authorities, and establish, exercise
  or defend legal claims.

**4.2 Basis.** Copperhead processes personal data for the specified purpose for which you
voluntarily provided it, such as signing in and using the features you ask for, and otherwise
on the basis of your consent, as the DPDP Act permits. Copperhead also processes personal data
without consent where the law requires or permits it, such as to comply with a legal
obligation, a court order or a direction of a competent authority.

**4.3 No sale or advertising.** Copperhead does not sell personal data and does not use it for
targeted advertising.

**4.4 Training.** Copperhead does not use your content, including briefs, messages, project
and repository files and generated designs, to train artificial-intelligence models. Section 5
describes what AI model providers do with your content.

## 5. AI model providers and your content

**5.1 What is sent.** To generate responses and designs, the Service sends AI model providers
the instructions and messages you write, your product briefs, files read from your projects,
summaries of earlier conversations and runs, and the output of design tools. In a workspace,
Claude Code also sends what it reads and produces as it works, such as project files, command
output and the parts of a board you select or show it. When a workspace starts from a brief,
Claude Code may read the brief and the project before you arrive. Any personal data in that
content is sent with it.

**5.2 Copperhead's model accounts.** Unless your organisation uses its own key or you sign in
with your own account under Section 5.3, the Service uses these accounts:

- **Microsoft Azure.** Models developed by OpenAI and by xAI, hosted by Microsoft in
  Copperhead's Azure account in the East US region. Copperhead uses global deployments, so
  Microsoft may process a request in any region where the model is available, while data that
  Microsoft stores stays in the United States. Microsoft states that it does not use prompts or
  outputs to train models and does not make them available to OpenAI or other model
  developers. Microsoft may store prompts and outputs that its abuse monitoring flags, for
  review under its terms.
- **Anthropic.** Claude models, used by Claude Code in workspaces, through Copperhead's
  Anthropic account. Anthropic's commercial terms do not permit it to train models on this
  content. Anthropic may keep it for a limited period, including for safety review, under those
  terms. If Claude Code searches the web, Anthropic carries out the search.

**5.3 Your own key or account.** If your organisation adds its own API key for OpenAI or
Anthropic, requests made with that key go to that provider under your organisation's agreement
with it. In a workspace, you can also sign Claude Code in with your own Claude account or
Anthropic API key. Its requests then go to Anthropic under your own agreement with Anthropic,
and Copperhead does not receive that credential. In both cases, that provider's terms govern
how it uses and keeps the data.

**5.4 What Copperhead keeps.** Copperhead's model gateway records the usage and cost of each
request but does not keep a log of prompts or responses. The content of your conversations,
runs and workspace sessions is stored as described in Section 3 and kept as described in
Section 9.

## 6. Cookies, browser storage and analytics

**6.1** A cookie is a small file that a website stores in your browser. Browser storage works
in a similar way. The Service uses the following.

<div data-bleed-ok>

| Name | Used by | Purpose | How long |
|---|---|---|---|
| Cookies whose names begin with sb- | Copperhead | Keep you signed in | Up to four hundred (400) days |
| copperhead-sidebar | Copperhead | Remembers the sidebar layout | One (1) year |
| copperhead-sidebar-tree | Copperhead | Remembers folded project groups | One (1) year |
| copperhead-install-state | Copperhead | Protects the GitHub App installation step | Ten (10) minutes |
| copperhead-workspace | Copperhead | Admits you to your workspace | Twenty-four (24) hours |
| PostHog cookie and local storage, whose names begin with ph_ | PostHog | Product analytics identifier | One (1) year |
| copperhead-theme (local storage) | Copperhead | Remembers your light or dark theme | Until cleared |
| copperhead-prompt-history (local storage) | Copperhead | Copy of your last twenty-five (25) prompts, for recall in the composer | Until cleared |
| Session storage | Copperhead | Remembers view settings and whether a workspace has already opened | Until the tab closes |
| Editor storage on workspaces.copperhead.sh (local storage and IndexedDB) | Copperhead | Remembers the workspace editor's layout | Until cleared |
| Google Analytics cookies, whose names begin with _ga | Google | Website analytics on copperhead.sh | Two (2) years |

</div>

**6.2 Analytics.** Copperhead uses PostHog, hosted in the United States, for product analytics
in the app. Analytics requests pass through Copperhead's own servers, which forward no
cookies. Session recording, automatic capture of clicks and surveys are switched off, and
page text is masked. Copperhead uses Google Analytics on copperhead.sh.

**6.3 Your choices.** Cookies that keep you signed in, protect sign-in steps and admit you to
your workspace are needed for the Service to work. You can block or delete other cookies and
browser storage in your browser settings, and you can stop Google Analytics on every website
with Google's opt-out browser add-on at tools.google.com/dlpage/gaoptout. Blocking necessary
cookies will stop you from signing in.

## 7. Who we share personal data with

**7.1 Service providers.** Copperhead uses these service providers, which process personal
data on its behalf under their terms with Copperhead:

<div data-bleed-ok>

| Provider | Service | Location |
|---|---|---|
| Microsoft Azure | Hosting, including hosted workspaces; file storage; key management; logs and service email | United States |
| Microsoft Azure AI Foundry | AI models developed by OpenAI and xAI | United States, with processing in other regions |
| Anthropic | AI models for Claude Code in workspaces | United States |
| Supabase | Authentication and database | United States |
| GitHub | Scheduled jobs on GitHub Actions, including the nightly database backup | United States |
| Cloudflare | Network and security for app.copperhead.sh; hosting for copperhead.sh | Global network |
| PostHog | Product analytics | United States |
| Google | Email for copperhead.sh addresses; website analytics on copperhead.sh | United States and other countries |
| UptimeRobot | Uptime monitoring and the status page on copperhead.sh | European Union and other countries |

</div>

**7.2 Sign-in and repository providers.** GitHub and Google provide sign-in. GitHub also hosts
your connected repositories. Changes the Service makes for you on GitHub are handled under
GitHub's terms and your repository's visibility settings. GitHub and Google act under their own
privacy policies, not on Copperhead's behalf, when they provide sign-in and repository hosting.

**7.3 AI model providers.** Copperhead shares content with the AI model providers described in
Section 5.

**7.4 Your organisation.** Members of an organisation can see its projects, conversations,
runs, files and shared folder, including your display name and the messages you send in it.
Owners and administrators of an organisation can see its audit records. A verification record
you write to a project, with your name and email address, can be read by anyone with access to
that project or its repository.

**7.5 Legal and business reasons.** Copperhead may disclose personal data where the law, or an
order or direction of a court, regulator or other competent authority, requires it; to protect
the rights, property or safety of Copperhead, its users or others; or in connection with a
merger, acquisition, restructuring or sale of all or part of its business, subject to this
Policy.

## 8. Transfers outside India

**8.1** Copperhead stores personal data in the United States, and its service providers may
process it in other countries, as Section 7 shows. The DPDP Act allows personal data to be
transferred outside India, except to countries or territories that the Central Government
restricts by notification. Copperhead will comply with any such restriction and with the
requirements the Central Government specifies for transfers.

## 9. How long we keep personal data

**9.1** Copperhead keeps personal data only for as long as it needs it for the purposes in
Section 4, or as the law requires. These periods apply:

<div data-bleed-ok>

| Data | How long |
|---|---|
| Account, profile and sign-in data | Until you delete your account |
| Organisations, projects, briefs, conversations, workspace messages, run records and usage records | Until you delete them, or until they are deleted with your account |
| Files and history of a project kept by Copperhead | For as long as the project exists. Copies of the history that a later save replaces are deleted thirty (30) days after it |
| Imported archives | Until the design is first saved from a workspace |
| Snapshots of unsaved work in a workspace | Thirty (30) days |
| Workspace home folders | Until you leave the organisation or it is deleted. Claude Code sessions in a home folder that has not been used for ninety (90) days are deleted |
| Organisation shared folders | Until the organisation is deleted |
| Files sent to the verification tools | Twenty-four (24) hours after they were last used |
| Agent transcripts and raw check output | Thirty (30) days after they are created |
| Bill-of-materials exports and check reports | Ninety (90) days after they are created |
| Verification manifests | Seven (7) years after they are created, and they cannot be changed or deleted earlier |
| Audit records | For as long as the organisation exists. The record that your account was created and deleted is kept after it |
| Database backups | Up to thirty (30) days |
| Service logs | Up to thirty (30) days |
| Product analytics | Up to seven (7) years |
| Website analytics | Up to fourteen (14) months |
| Emails, requests and grievance records | Up to three (3) years after the request is closed |

</div>

**9.2 Legal retention.** Copperhead may keep personal data longer where the law requires. When
Rule 8(3) of the DPDP Rules comes into force, Copperhead will keep personal data, associated
traffic data and logs of processing for at least one (1) year from the date of processing, for
the purposes that Rule specifies, including after an account is deleted.

## 10. Deleting your account

**10.1** You can delete your account from your account page. You will be asked to confirm by
typing your email address.

**10.2** Deleting your account:

- deletes your profile, your sign-in methods and your organisation memberships;
- deletes each organisation in which you are the only member, together with its projects,
  the history of projects kept by Copperhead, imported archives, conversations, runs and
  workspace snapshots, and the exports, reports, transcripts and logs stored for it;
- deletes your workspace snapshots in organisations that have other members; and
- is refused while you are the only owner of an organisation that has other members.

Before you confirm, the Service offers a download of the history of each project it will
delete.

**10.3** After you delete your account:

- your workspace home folders, and the shared folders of the organisations deleted with your
  account, are deleted by the next nightly clean-up;
- files sent to the verification tools are deleted within twenty-four (24) hours;
- content you created in an organisation that has other members stays in that organisation,
  no longer linked to your profile;
- the records that your account was created and deleted keep its random identifier;
- verification manifests are kept until their seven (7) year period ends;
- verification records written to a project or repository keep the name and email address
  they were written with;
- backups containing your data are deleted within thirty (30) days;
- product analytics records, which hold your account's random identifier but not your name
  or email address, are not deleted; and
- anything the Service wrote to your GitHub repositories stays there, under your control.

**10.4 Disconnecting a project.** Disconnecting a project that is connected to GitHub removes
the project, its runs and its conversations from the Service. Files already stored for its runs
are deleted when their periods in Section 9 end. A project kept by Copperhead that has saved
history cannot be disconnected until it has been moved to GitHub, so that its history is not
lost.

**10.5 Deleting a conversation.** You can delete a conversation, which deletes its messages.

**10.6 Copies of your data.** Projects connected to GitHub are stored in your own repositories.
For a project kept by Copperhead, owners and administrators can download its full history as a
git bundle, a standard format that git reads, or move it to a GitHub repository. You can also
download your workspace snapshots and the files your runs produced. To ask for a copy of other
personal data Copperhead holds about you, write to the contact in Section 2.2.

## 11. Security

**11.1** Copperhead takes reasonable security safeguards to protect personal data, including:

- encrypting connections to the Service and to its database;
- encrypting model provider keys, with the encryption keys held in a separate key management
  service;
- separating each organisation's data with access rules that the database enforces, and
  checking that you belong to an organisation before serving any of its stored files;
- giving access to stored files only through download links that expire after five (5)
  minutes and open one file;
- not storing GitHub access tokens, and creating a short-lived token for each repository
  operation;
- running each workspace in its own container;
- removing common secret formats from run records; and
- keeping service logs and backups.

**11.2** No system is completely secure. If you believe your account or data has been
compromised, write to security@copperhead.sh.

## 12. Your rights

**12.1** Subject to the DPDP Act, you have the right to:

- **access:** obtain a summary of the personal data Copperhead processes about you and its
  processing activities, and the identities of the other Data Fiduciaries and Data Processors
  it has shared that data with, with a description of the data shared;
- **correction and erasure:** have inaccurate or misleading data corrected, incomplete data
  completed and outdated data updated, and have your personal data erased unless Copperhead
  must keep it for the specified purpose or to comply with the law;
- **withdraw consent:** withdraw your consent at any time, as easily as you gave it.
  Withdrawal does not affect processing carried out before it. Copperhead will then stop
  processing, and cause its processors to stop, unless the law requires or permits the
  processing to continue. If you withdraw consent that the Service depends on, Copperhead may
  be unable to keep providing it;
- **grievance redressal:** have your grievances about Copperhead's processing addressed, as
  set out in Section 13; and
- **nomination:** nominate one or more individuals to exercise these rights on your behalf if
  you die, or become unable to exercise them because of unsoundness of mind or infirmity of
  body.

**12.2 How to exercise them.** Write to privacy@copperhead.sh. Include the email address of
your account and, if you sign in with GitHub, your GitHub username, so that Copperhead can
identify you. Copperhead may ask for information to confirm your identity before acting on a
request. You can also delete your account as described in Section 10.

**12.3 Timing.** Copperhead will respond to a request within thirty (30) days of receipt.

**12.4 Your duties.** When you exercise these rights, you must comply with the law, not
impersonate anyone, provide only authentic information, and not make a false or frivolous
grievance or complaint.

## 13. Grievances and complaints

**13.1** If you have a grievance about how Copperhead processes your personal data or handles a
request, contact the Grievance Officer in Section 2.3.

**13.2** Copperhead will acknowledge your grievance within forty-eight (48) hours and resolve
it within one (1) month of receipt.

**13.3** If your grievance is not resolved, you may complain to the Data Protection Board of
India, in the manner the Board specifies. The DPDP Act requires you to use Copperhead's
grievance process first.

## 14. Children

**14.1** The Service is for adults using it for business or professional purposes. It is not
directed at children, meaning individuals under eighteen (18) years of age, and Copperhead
does not knowingly collect their personal data.

**14.2** Copperhead does not track, monitor the behaviour of, or direct targeted advertising at
children. If Copperhead learns that it has processed a child's personal data without the
verifiable consent of a parent or lawful guardian, it will delete that data and close the
account. Write to privacy@copperhead.sh if you believe this has happened.

## 15. Personal data breaches

**15.1** If a personal data breach affects you, Copperhead will tell you without delay, through
your account or the email address registered with it. The notice will describe the breach,
including its nature, extent and timing; its likely consequences for you; what Copperhead has
done and is doing to reduce the risk; steps you can take to protect yourself; and a contact who
can answer your questions.

**15.2** Copperhead will also report the breach to the Data Protection Board of India and to
any other authority as the law requires.

## 16. Changes to this Policy

**16.1** Copperhead may update this Policy. It will show the effective date of the latest
version, and will tell you about material changes by email or in the Service before they take
effect.

**16.2** Copperhead will not use personal data in a way this Policy does not describe without
first telling you and, where the new use depends on consent, asking for your consent.

## 17. Users in the European Economic Area and the United Kingdom

**17.1 Scope.** This Section applies if the General Data Protection Regulation (EU) 2016/679,
or the United Kingdom General Data Protection Regulation, applies to Copperhead's processing of
your personal data. Copperhead is the controller.

**17.2 Legal bases.** Copperhead relies on performance of its contract with you, to provide the
Service; its legitimate interests in securing, supporting and improving the Service, balanced
against your rights; your consent, where it asks for it; and compliance with its legal
obligations.

**17.3 Additional rights.** In addition to the rights in Section 12, you may ask Copperhead to
restrict processing, object to processing based on legitimate interests, and receive the
personal data you provided in a structured, commonly used, machine-readable format. You may
complain to the data protection supervisory authority where you live or, in the United
Kingdom, to the Information Commissioner's Office.

**17.4 Transfers.** Copperhead is established in India, and its service providers process
personal data in the United States and other countries, as Section 7 shows. Copperhead relies
on the data protection terms of its service providers, including standard contractual clauses
where they offer them, to protect personal data transferred outside the European Economic Area
and the United Kingdom.

before execution.*
