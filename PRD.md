# A11YO — Product Brief, PRD & Roadmap
**Version 2.0 · March 2026 · Owner: Ferg Flannery**

---

## 0. North Star — What A11YO Actually Is

> **A11YO is a plain English accessibility report generator. It scans a website, finds the problems, and produces a document that any business owner can read and any developer can act on — without either of them needing to know what WCAG means.**

Everything else in this product — the auth, the subscriptions, the Chrome extension, the admin panel — exists to deliver that report to more people, more easily. When in doubt about any feature decision, come back to this.

### The two people this product is built for

| The Business Owner | The Developer |
|---|---|
| Has a website. Got a letter about the EAA. Doesn't know what WCAG means and doesn't need to. | Receives the report as a handoff document. May not be an accessibility specialist. |
| **Needs to know:** what is broken, how serious it is, and what to tell their developer to do. | **Needs to know:** exactly what to fix, where it is in the code, and how to confirm it is done. |

### What success looks like

A business owner runs a scan, reads the report without Googling anything, emails it to their developer, and the developer uses it as a checklist to fix the issues. Done. That is the whole job.

---

## 1. Product Brief

### 1.1 The Problem

Irish businesses must comply with the European Accessibility Act by 28 June 2025. The tools that exist to check accessibility are built for developers and accessibility specialists. They output WCAG criterion codes, DOM selectors, and technical audit language that means nothing to a business owner or a generalist developer.

The result: businesses either pay for an expensive consultant, or they ignore the problem entirely.

### 1.2 The Solution

A11YO sits between the automated scanner and the human expert. It runs the same checks, but rewrites the output in plain English — turning 'Missing alt attribute on img element (WCAG 1.1.1)' into 'Your images have no text description for screen readers. Here is what needs to happen to fix it.'

### 1.3 Target Users

- **Primary:** Irish SMEs with a public-facing website and no in-house accessibility knowledge
- **Secondary:** Irish web agencies producing accessibility reports for clients
- **Tertiary:** Public sector bodies, tourism operators, and regulated industries facing EAA obligations

### 1.4 Positioning

- Not a developer tool (that is Axe, WAVE, Lighthouse)
- Not a consultant (that is a €5,000 audit)
- **A11YO is the plain English bridge between the scan and the fix**

### 1.5 Business Model

- **Free tier:** up to 3 scans, summary results only
- **Early Access:** 25 users, full report access free with a code, valid 12 months
- **Paid:** €10/month — full reports, scan history, PDF export
- **Trigger:** when 25 early access slots are filled, paid model activates

### 1.6 Tech Stack

- Frontend: Next.js (App Router) + Tailwind CSS
- Auth + DB: Supabase (Postgres + Supabase Auth)
- Hosting: Vercel
- Payments: Stripe (€10/month)
- Email: Resend
- Chrome Extension: Manifest V3

---

## 2. The Report — Core Product Specification

> **This is the most important section in the document. Every other feature exists to put this report in front of users. Get this right first.**

### 2.1 Design Principles for the Report

1. No WCAG codes in the main view. Technical references exist but are hidden behind a 'show more' toggle.
2. Every issue has a plain English title. No jargon. A 50-year-old shop owner must understand it immediately.
3. Every issue explains the human impact — who is affected and how.
4. Every issue tells the developer exactly what to do, not just what is wrong.
5. The report is a working checklist, not a read-only document.
6. Severity is expressed in plain terms: **Critical, Should Fix, Nice to Have** — not Level A / AA / AAA.

### 2.2 Report Anatomy — Issue Card Specification

Each accessibility issue must be presented as a card with the following fields:

| Field | What it looks like | Why it matters |
|---|---|---|
| **Severity badge** | `CRITICAL — Must fix before EAA deadline` | Tells a non-technical manager exactly how urgent this is |
| **Plain English title** | "Images on your website have no text description for screen readers" | No WCAG codes, no jargon — a business owner must understand this in 5 seconds |
| **What this means** | "A blind person using a screen reader will hear nothing when they reach these images." | Builds empathy for the real impact |
| **What needs to happen** | "Each image needs a short text description added in the code behind it." | Developer handoff instruction. Plain English, actionable, no assumed knowledge |
| **Where it is** | Found on: Homepage, About Us page (14 instances) | Gives the developer a starting point |
| **WCAG reference (collapsed)** | Technical reference: WCAG 2.2 — 1.1.1 Non-text Content (Level A) [show more] | Hidden by default — for developers who want it |
| **Checklist checkbox** | [ ] Fixed — tick when resolved | Turns the report into a working handoff document |

### 2.3 Severity Levels (Plain English, Not WCAG Levels)

| Label | WCAG Equivalent | Shown to Business Owner as | Urgency Message |
|---|---|---|---|
| **CRITICAL** | WCAG Level A | Blocks users entirely. Legal risk. | Must be fixed to meet EAA legal requirements |
| **SHOULD FIX** | WCAG Level AA | Makes the site difficult to use. Required under EAA. | Required for full EAA compliance |
| **NICE TO HAVE** | WCAG Level AAA | Best practice improvements. Not legally required. | Improves experience for all users |

### 2.4 Report Sections (in order)

1. Cover summary: URL scanned, date, overall compliance score (0–100), counts by severity
2. Quick wins: issues that are easy to fix first, regardless of severity
3. Critical issues: all CRITICAL items with full issue cards
4. Should Fix items: all SHOULD FIX items with full issue cards
5. Nice to Have items: collapsed by default, expandable
6. What passed: brief summary of what the site is doing well
7. Next steps: a plain English action plan ('Start with the 3 Critical issues. Your developer should be able to fix these in a few hours.')

### 2.5 Report as Handoff Document

The report must function as a standalone handoff document — a business owner can download it as a PDF, email it to a developer, and the developer has everything they need to start fixing issues without any follow-up conversation.

- PDF export must preserve all issue cards, checkboxes, and fix instructions
- Checkboxes in the web version allow the developer to tick off issues as resolved
- The PDF version shows checkboxes as unticked boxes, ready to be printed
- The report header includes: client URL, scan date, generated by A11YO, and a brief 'how to use this document' paragraph

---

## 3. Chrome Extension — Full Specification

> **The Chrome extension is the report in your browser. It does not just flag issues — it explains them in plain English, right where you are looking at the page.**

### 3.1 Core Purpose

A user is browsing their own website — or a client's website. They click the A11YO extension icon. Without leaving the page, they see exactly what is wrong with what they are looking at, explained in plain English, with a fix instruction attached to every issue.

### 3.2 Extension Popup — UI States

**State 1: Not logged in**
- Show: A11YO logo, one-line description
- CTA: 'Sign in to A11YO' → opens a11yo.io/login in a new tab

**State 2: Logged in, no scan run yet**
- Show: current URL, user email (small, top right)
- Large button: 'Scan this page'

**State 3: Scan running**
- Progress steps: 'Checking images...' / 'Checking colour contrast...' / 'Checking keyboard navigation...'
- Always tell the user what is happening

**State 4: Scan complete — Results view**
- Compliance score (large, colour-coded)
- Three counts: X Critical | X Should Fix | X Nice to Have
- Scrollable issue list, each issue as a compact expandable card

### 3.3 Extension Technical Requirements

- Manifest V3 (Chrome and Chromium-based browsers only)
- Calls A11YO scan API endpoint, authenticated via stored JWT (Supabase session)
- Stores JWT in `chrome.storage.local`
- Popup dimensions: 380px wide, max 600px height with scroll
- Issue explanations stored as local JSON map — loads instantly
- 'View full report' link opens: `a11yo.io/report/:scanId`

### 3.4 The Plain English Issue Library

Every issue type must have three hand-written, human-reviewed pieces of copy:
- **Plain English title** — 10 words max, no jargon
- **What this means** — 2 sentences max, written for a non-technical business owner, focused on human impact
- **What needs to happen** — 2–3 sentences, written as a clear instruction to a developer, no assumed knowledge

---

## 4. All Other Features — PRD

### F-001 User Signup + Login
- Supabase Auth — email + password, plus Google OAuth
- Email confirmation on signup, password reset flow
- Protected routes: `/dashboard`, `/report/:id`, `/admin`
- Test account: `hello@fergflannery.com` — assign role: admin in Supabase
- Admin role bypasses scan limits and early access restrictions

### F-002 User Dashboard
- Scan history: URL, date, score, link to full report
- Scan counter for free tier users (X of 3 used)
- CTAs: Run new scan, Upgrade (free users only), Enter early access code (free users only)

### F-003 Scan Limit Gate
- Free users capped at 3 scans — tracked in Supabase
- On limit: modal with three options — Enter early access code / Upgrade to paid / Learn more
- Do not block access to reports already generated
- Admin account exempt from all limits

### F-004 Early Access Code System
- Single code (e.g. `A11YO-EARLY-2025`) — 25 redemptions maximum
- Input field on `/early-access` page and in the upgrade modal
- On valid code: upgrade user to `early_access` tier, send confirmation email
- On 25th redemption: code marked exhausted, subsequent users see paid option
- Show remaining slots on `/early-access` page
- Admin dashboard shows live redemption count

### F-005 Paid Signup — Stripe €10/month
- Stripe Checkout at `/upgrade` — €10.00/month recurring
- Webhook updates user tier to 'paid' in Supabase on payment success
- Stripe Customer Portal for self-service billing management
- User retains access until end of billing period on cancellation

### F-006 Admin Dashboard (/admin)
- Visible only to `role: admin` users
- User table: email, tier, scans run, joined date
- Actions: change tier, reset scan count
- Early access stats: slots used / 25
- Platform stats: total users, total scans, free-to-paid conversion

### F-007 Sample Full Report (/sample-report)
- Static page, no auth required
- Uses a realistic fictional Irish business URL
- Real WCAG issues, real plain English cards, real structure
- CTA banner: 'Get your own report — free'
- Linked from homepage hero and footer, not main nav

### F-008 Why Choose A11YO (/why-a11yo)
- Footer link only — not in main navigation
- Content: EAA explained, cost of non-compliance, what A11YO does, CTA to signup
- Irish statistics and legal context throughout
- SEO-optimised: title tag, meta description, heading structure

---

## 5. Prioritised Feature Roadmap

> Reference this table when directing Claude Code. Cite the Feature ID. Update Status as you build.

| # | ID | Feature | Effort | Status | Notes |
|---|---|---|---|---|---|
| 1 | CORE | Plain English issue library (JSON — 17 checks) | QUICK WIN | ✅ Done | lib/issue-library.ts — 17 checks with severity, means, fix, WCAG |
| 2 | CORE | Report issue card component (web view) | QUICK WIN | ✅ Done | components/IssueCard.tsx — expandable, severity badge, WCAG toggle, checkbox |
| 3 | F-007 | Sample full report page (/sample-report) | QUICK WIN | ✅ Done | Static fictional Irish business (Keogh's Hardware, Athlone) |
| 4 | F-001 | Supabase Auth — signup + login | QUICK WIN | ✅ Done | Auth pages + Supabase SSR client |
| 5 | F-001 | Create test account hello@fergflannery.com (admin role) | QUICK WIN | ✅ Done | Auto-promote trigger in Supabase migration |
| 6 | F-003 | Scan limit enforcement (3 free scans) | QUICK WIN | ✅ Done | check_and_increment_rate_limit RPC, FREE_LIMIT=3 |
| 7 | F-004 | Early access code input + redemption | QUICK WIN | ✅ Done | POST /api/early-access, EARLY_ACCESS_CODE env var set in Vercel |
| 8 | F-004 | Early access signup page (/early-access) | QUICK WIN | ✅ Done | /early-access — slots counter, code form, success state |
| 9 | F-002 | User dashboard | SHORT | ✅ Done | Scan counter, limit banner, early access + pro CTAs |
| 10 | CORE | Full report view (/report/:scanId) | SHORT | ✅ Done | 7-section layout, weighted score, IssueCard, next steps |
| 11 | CORE | PDF export of full report | SHORT | ⬜ To Do | Printable checklist format for developer handoff |
| 12 | F-006 | Admin dashboard (/admin) | SHORT | ✅ Done | Users table, early access progress bar, platform stats |
| 13 | F-008 | Why Choose A11YO (/why-a11yo) | SHORT | ✅ Done | EAA explainer, stats grid, footer link |
| 14 | F-005 | Stripe €10/month + paid signup flow | MEDIUM | ⬜ To Do | Only needed once 25 early access slots fill |
| 15 | EXT | Chrome extension — popup UI + scan results | MEDIUM | ⬜ To Do | Manifest V3, popup states 1–4 |
| 16 | EXT | Chrome extension — plain English issue cards in popup | MEDIUM | ⬜ To Do | Uses same issue library JSON as web report |
| 17 | EXT | Chrome extension — 'show technical detail' toggle | MEDIUM | ⬜ To Do | Hidden WCAG refs + DOM selectors for devs |
| 18 | EXT | Chrome extension — 'View full report' link to A11YO | MEDIUM | ⬜ To Do | Opens /report/:scanId in new tab |

---

## 6. How to Use This Document with Claude Code

**Opening prompt for a new session:**
> "Read `/PRD.md` in the repo root. The next item on the roadmap is [Feature ID / Name]. Here is the current state of the project: [brief description]. Build it as specified in the PRD."

**After completing a feature:**
> "Mark [Feature ID] as Done in the roadmap table in PRD.md and tell me what the next item is."

**Key principle to remind Claude Code:**
> "Remember: the core product is the plain English report. Every issue must have a title, a 'what this means' explanation, and a 'what needs to happen' fix instruction. No WCAG codes visible by default. Build for a business owner who has never heard of WCAG."

---

*Confidential — Ferg Flannery / A11YO*
