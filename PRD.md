# A11YO — Product Brief, PRD & Roadmap
**Version 4.0 · March 2026 · Owner: Ferg Flannery**

---

## 0. North Star — What A11YO Actually Is

> **A11YO answers one question: "Tell me what I need to do to comply." It scans a website, finds the problems, and produces a document that any business owner can read and any developer can act on — without either of them needing to know what WCAG means.**

**A11YO doesn't explain the legislation. It tells you what to do.**

Businesses don't understand the EAA, WCAG, or accessibility law. They don't need to. A11YO removes that confusion entirely — replacing legal language and technical codes with a plain English action list any business owner can hand to their developer and any developer can work from without asking questions.

Everything else in this product — the auth, the subscriptions, the Chrome extension, the admin panel — exists to deliver that action plan to more people, more easily. When in doubt about any feature decision, come back to this.

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
- **A11YO doesn't explain the legislation. It tells you what to do.**

### 1.5 Business Model

- **Free tier:** 1 scan/day, no account required, guest Chrome extension scan (1 per 30 min)
- **Early Access:** 25 users, full report access free with a code, valid 12 months
- **Action Plan:** €10 one-time — 10 scans/day, full report access, no subscription. A downloadable PDF action plan for business owners who need something to hand to their developer. No subscription required.
- **Recurring:** €29/month — 20 scans/day, all checks, scan history, PDF export, Chrome extension, score-over-time chart, compliance dashboard
- **Agency:** €99/month — unlimited scans, all features, multi-user use
- **Trigger:** when 25 early access slots are filled, paid model activates

### 1.6 Tech Stack

- Frontend: Next.js (App Router) + Tailwind CSS
- Auth + DB: Supabase (Postgres + Supabase Auth)
- Hosting: Vercel
- Payments: Stripe (Action Plan = one-time, Recurring + Agency = recurring subscriptions)
- Email: Resend (not yet integrated)
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

## 2B. The Dashboard — Compliance Monitor Specification

> **The dashboard is the retention engine for Recurring and Agency users. It is not a history log. It is a live compliance monitor — a recurring user should feel in control of their compliance health at a glance.**

### 2B.1 Design Principle

Every element of the dashboard should answer one of three questions:
- **Where do I stand?** (current score, current issues)
- **Am I getting better?** (trajectory, delta vs last scan)
- **What do I do next?** (re-scan nudge, quick actions)

### 2B.2 Dashboard Components (Recurring + Agency)

| Component | Description |
|---|---|
| **Score over time** | Line chart, per URL, last 12 scans. Shows trajectory at a glance. |
| **Issues over time** | Stacked bar chart — Critical / Should Fix / Nice to Have per scan. Shows whether issue volume is shrinking. |
| **Compliance trajectory** | Plain English verdict: "Improving", "Stable", or "Declining" based on last 3 scans. |
| **What improved since last scan** | Green delta — issues resolved since previous scan. Count + list. |
| **What regressed since last scan** | Red delta — new issues found since previous scan. Count + list. |
| **Quick re-scan button** | Per URL in the history list. One click to re-run scan immediately. |
| **Re-scan nudge** | "Last scanned X days ago — scan again?" for any URL not scanned in 14+ days. |

### 2B.3 Free Tier Dashboard

Free users see scan history and score only — no charts, no delta, no trajectory. Upgrade CTA is prominent but not intrusive.

---

## 2C. Retention — Features That Keep Users Coming Back

> **Retention is not a growth hack. It is the product working correctly. A user who scans once and leaves has not been served — accessibility compliance is ongoing, not a one-time event.**

### 2C.1 Email Retention (requires Resend)

| Trigger | Audience | Content |
|---|---|---|
| **Weekly score email** | Free + paid | "Your site scored X last week. Here's what changed." Free users: score only. Paid users: score + issue summary + link to full report. |
| **Scan decay alert** | Paid only | If a paid user hasn't scanned a URL in 30 days, send a reminder: "Your last scan was 30 days ago. A lot can change in a month." |
| **Score drop alert** | Paid only | If a re-scan shows a score drop of 10+ points vs previous scan, trigger an immediate email: "Your compliance score dropped. Here's what changed." |

### 2C.2 In-Product Retention

| Feature | Description |
|---|---|
| **Chrome extension as retention loop** | The extension gives free users enough value to stay engaged. Guest scan (1/30min) keeps them coming back. Upsell panel shown after every guest scan. |
| **Re-scan nudge on dashboard** | Show "Last scanned X days ago — scan again?" for any URL not scanned in 14+ days. Linked to one-click re-scan. |
| **Score over time chart** | Paid users who see their score improving are more likely to stay subscribed. The chart makes progress visible. |

---

## 3. Chrome Extension — Full Specification

> **The Chrome extension is the report in your browser. It does not just flag issues — it explains them in plain English, right where you are looking at the page.**

### 3.1 Core Purpose

A user is browsing their own website — or a client's website. They click the A11YO extension icon. Without leaving the page, they see exactly what is wrong with what they are looking at, explained in plain English, with a fix instruction attached to every issue.

### 3.2 Extension Popup — UI States

**State 1: Not logged in**
- Show: A11YO logo, one-line description
- Guest scan option: one free scan per 30 minutes, no account needed (cooldown stored in `chrome.storage.local`)
- Sign in form: email + password inline in popup
- 'Create one free →' link → opens a11yo.com/auth/signup in a new tab

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
- Authenticated scans via `Authorization: Bearer <jwt>` → `/api/ext/scan`
- Guest scans (no auth) via public `/api/scan` → CORS and IP rate limit apply
- Stores JWT + refresh token in `chrome.storage.local`; auto-refreshes on expiry
- Guest scan cooldown (30 min) stored in `chrome.storage.local`
- Popup dimensions: 380px wide, max 600px height with scroll
- Issue explanations stored as local `issue-library.js` — loads instantly
- 'View full report' link opens: `a11yo.com/report/:scanId`
- Guest upsell panel shown after guest scan with link to create free account
- Scans saved to user dashboard when logged in; guest scans are ephemeral

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
- Scan history: URL, date, score, score delta, link to full report
- Scan counter for free tier users (X of 1 used today)
- Compliance monitor charts for Recurring/Agency (see Section 2B)
- CTAs: Run new scan, Upgrade (free users only), Enter early access code (free users only)

### F-003 Scan Limit Gate
- Free users capped at 1 scan/day — tracked in Supabase
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

### F-005 Paid Signup — Stripe
- **Action Plan:** €10 one-time — Stripe Checkout (plan: `onceoff`)
- **Recurring:** €29/month — Stripe Checkout (plan: `recurring`)
- **Agency:** €99/month — Stripe Checkout (plan: `agency`)
- Webhook updates user plan to `onceoff`, `recurring`, or `agency` in Supabase on payment success
- Stripe Customer Portal at `/api/stripe/portal` — live, linked from /account
- User retains access until end of billing period on cancellation

### F-006 Admin Dashboard (/admin)
- Visible only to `role: admin` users
- User table: email, tier, scans run, joined date
- Actions: change tier, reset scan count, delete user
- Early access stats: slots used / 25
- Platform stats: total users, total scans, MRR, ARR

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

### F-009 Free Tools Hub (/tools)
- Hub page linking to all standalone free tools
- Currently live: Alt-text checker, Accessibility statement generator, Colour contrast checker

### F-010 Alt-Text Checker (/tools/alt-text)
- Paste a URL → scrapes all images → shows which have missing or weak alt text
- Free, no account required
- SEO: targets 'alt text checker' search queries

### F-011 Accessibility Statement Generator (/tools/accessibility-statement)
- Multi-step form → outputs a compliant accessibility statement
- Covers: EAA 2025, EN 301 549, WCAG 2.2 AA, ADA, Section 508, AODA, ACA
- EAA formal exclusions (6 Article 14 categories), disproportionate burden claim
- Contact section: email, phone, postal address, response timeframe
- One-click copy to clipboard, free, no account required

### F-012 Chrome Extension Landing Page (/extension)
- Marketing page for the extension with popup mockup, how it works, FAQ
- CTA → Chrome Web Store (not yet submitted)

---

## 5. Prioritised Feature Roadmap

> Reference this table when directing Claude Code. Cite the Feature ID. Update Status as you build.

### Phase 1 — Core Product (Complete)

| # | ID | Feature | Effort | Status | Notes |
|---|---|---|---|---|---|
| 1 | CORE | Plain English issue library (17 checks) | QUICK WIN | ✅ Done | lib/issue-library.ts |
| 2 | CORE | Report issue card component | QUICK WIN | ✅ Done | components/IssueCard.tsx |
| 3 | F-007 | Sample full report (/sample-report) | QUICK WIN | ✅ Done | Keogh's Hardware, Athlone |
| 4 | F-001 | Supabase Auth — signup + login | QUICK WIN | ✅ Done | Email/password, protected routes |
| 5 | F-001 | Admin test account (hello@fergflannery.com) | QUICK WIN | ✅ Done | Auto-promote trigger in Supabase |
| 6 | F-003 | Scan limit enforcement (free tier) | QUICK WIN | ✅ Done | check_and_increment_rate_limit RPC |
| 7 | F-004 | Early access code redemption | QUICK WIN | ✅ Done | POST /api/early-access |
| 8 | F-004 | Early access signup page (/early-access) | QUICK WIN | ✅ Done | Slots counter, code form |
| 9 | F-002 | User dashboard | SHORT | ✅ Done | Scan history, counter, upgrade CTAs |
| 10 | CORE | Full report view (/report/:scanId) | SHORT | ✅ Done | 7-section layout, weighted score |
| 11 | CORE | PDF export (print-optimised) | SHORT | ✅ Done | /report/:id/print — auto window.print() |
| 12 | F-006 | Admin dashboard (/admin) | SHORT | ✅ Done | Users, stats, early access progress |
| 13 | F-008 | Why Choose A11YO (/why-a11yo) | SHORT | ✅ Done | EAA explainer, footer link |

### Phase 2 — Growth Features (Complete)

| # | ID | Feature | Effort | Status | Notes |
|---|---|---|---|---|---|
| 14 | F-005 | Stripe checkout (Action Plan + Recurring + Agency) | MEDIUM | ✅ Done | Checkout route live |
| 15 | EXT | Chrome extension — popup UI + scan | MEDIUM | ✅ Done | 4 states, Supabase auth, scan API |
| 16 | EXT | Chrome extension — plain English cards | MEDIUM | ✅ Done | issue-library.js, expandable cards |
| 17 | EXT | Chrome extension — WCAG technical toggle | MEDIUM | ✅ Done | Hidden by default per card |
| 18 | EXT | Chrome extension — 'View full report' link | MEDIUM | ✅ Done | Opens a11yo.com/report/:id |
| 19 | EXT | Chrome extension — guest scan mode | MEDIUM | ✅ Done | 1/30min via /api/scan, cooldown in storage |
| 20 | EXT | Chrome extension — inline sign-in | MEDIUM | ✅ Done | Sign-in form in popup |
| 21 | CORE | Homepage inline registration panel | QUICK WIN | ✅ Done | SignupPanel component |
| 22 | CORE | Pricing page (Action Plan + Recurring + Agency) | QUICK WIN | ✅ Done | /pricing page |
| 23 | F-005 | Stripe recurring subscriptions + webhook | QUICK WIN | ✅ Done | Webhook at /api/stripe/webhook |
| 24 | ADM | Superadmin — full user management | SHORT | ✅ Done | Plan/role edit, delete, MRR stats |
| 25 | ADM | Admin API (/api/admin/user) | SHORT | ✅ Done | PATCH + DELETE via RLS policies |
| 26 | INFRA | URL migration a11yo.io → a11yo.com | QUICK WIN | ✅ Done | Code, Stripe, Vercel env |
| 27 | EXT | Chrome extension — colour contrast checker | MEDIUM | ✅ Done | WCAG AA/AAA, EyeDropper picker |

### Phase 3 — Polish & Production (Complete)

| # | ID | Feature | Effort | Status | Notes |
|---|---|---|---|---|---|
| 28 | INFRA | Security hardening | SHORT | ✅ Done | Open redirect, SSRF (fetch-page.ts + alt-text route), CSP headers, race condition fix, admin guards, sanitised Stripe errors |
| 29 | UI | SVG brand logo + dark/light theme | QUICK WIN | ✅ Done | Logo component, ThemeToggle, all pages updated |
| 30 | UI | Homepage hero redesign | SHORT | ✅ Done | Two-column layout, radar animation, stats row |
| 31 | UI | Auth-aware nav (login/account icons) | QUICK WIN | ✅ Done | NavUserArea — user icon + green dot when authed |
| 32 | UI | Consistent page width (max-w-5xl) | QUICK WIN | ✅ Done | All marketing pages standardised |
| 33 | INFRA | Stripe checkout error handling | QUICK WIN | ✅ Done | try/catch → JSON errors, no more HTML 500s |
| 34 | F-009 | Free tools hub (/tools) | SHORT | ✅ Done | Hub + alt-text checker + accessibility statement generator |
| 35 | F-010 | Alt-text checker (/tools/alt-text) | SHORT | ✅ Done | URL scrape → missing/weak alt text report, 5/day rate limit |
| 36 | F-011 | Accessibility statement generator | SHORT | ✅ Done | EAA exclusions, disproportionate burden, phone/postal contact |
| 37 | F-012 | Chrome extension landing page | SHORT | ✅ Done | /extension — mockup, how it works, FAQ, pricing updated |
| 38 | CORE | Blog (/blog + /blog/[slug]) | SHORT | ✅ Done | MDX-ready, listing page, individual post page |
| 53 | A11Y | Accessibility review + UI legibility fixes | SHORT | ✅ Done | ARIA boolean fix (IssueCard), muted contrast (#7A957A dark / #5A7A5A light), focus indicators on delete confirm input |
| 54 | CORE | Score-over-time chart on report page | SHORT | ✅ Done | Line chart (last 10 scans same URL), shown for paid plans with ≥2 data points |
| 55 | CORE | Plan-based scan rate limits | SHORT | ✅ Done | Free=1/day, Action Plan=10, Recurring=20, Agency=unlimited |
| 56 | DASH | Score delta column on dashboard | SHORT | ✅ Done | Δ vs previous scan for same URL |

### Phase 4 — Next to Build

| # | ID | Feature | Effort | Priority | Notes |
|---|---|---|---|---|---|
| 39 | F-005 | Stripe price IDs in Vercel env | QUICK WIN | ✅ Done | Renamed to STRIPE_PRICE_ONCEOFF / RECURRING / AGENCY. Rotate exposed secret key. |
| 40 | F-005 | Stripe Customer Portal | SHORT | ✅ Done | `/api/stripe/portal` route. 'Manage billing' button in /account for subscription plans. |
| 44 | F-002 | Account settings page (/account) | SHORT | ✅ Done | /account — change email, change password, billing portal link, delete account. |
| 43 | UI | Mobile hamburger nav | SHORT | ✅ Done | Drawer/hamburger for small screens. Escape key, outside click, body scroll lock, ARIA dialog. |
| 48 | SEO | sitemap.xml + robots.txt | QUICK WIN | ✅ Done | app/sitemap.ts + app/robots.ts. Disallows auth/api/dashboard/admin routes. |
| 60 | UI | "Action Plan" naming | QUICK WIN | ✅ Done | Pricing page, dashboard plan badge, account page. Internal plan key (`onceoff`) unchanged. |
| 42 | EMAIL | Resend email integration | MEDIUM | 🔴 High | Blocking all retention features. Welcome email, subscription confirmation, scan-complete. Set RESEND_API_KEY in Vercel. |
| 57 | EMAIL | Weekly score email | SHORT | 🔴 High | Depends on Resend (#42). Free: score only. Paid: score + issue summary + report link. |
| 58 | DASH | Dashboard v2 — compliance monitor | MEDIUM | 🔴 High | Score over time, issues over time, compliance trajectory, delta (improved/regressed), re-scan nudge. See Section 2B. |
| 41 | F-001 | Google OAuth | SHORT | 🟡 Medium | Button exists in auth pages but OAuth redirect not fully tested in production. Verify and fix. |
| 59 | EMAIL | Scan decay + score drop alerts | SHORT | 🟡 Medium | Depends on Resend (#42). 30-day no-scan reminder. 10+ point score drop immediate alert. |
| 45 | EXT | Chrome Web Store submission | SHORT | 🟡 Medium | Package extension/, write store listing, submit for review. |
| 50 | CORE | Blog content (3 launch posts) | MEDIUM | 🟡 Medium | EAA deadline explainer, how accessibility auditing works, top 5 Irish sites that fail WCAG. |
| 46 | CORE | Full Site plan — multi-page crawl | LARGE | 🟢 Low | 50-page crawl feature for 'agency' plan users. Queue-based scanner, progress indicator. |
| 47 | SEO | Dynamic OG images per report | SHORT | 🟢 Low | Vercel OG image generation for /report/:id and /blog/:slug. |
| 49 | CORE | Scan sharing toggle (public/private) | SHORT | 🟢 Low | Reports default to private; user can toggle to public to share a link. |

### Phase 5 — Monitoring & Automation

| # | ID | Feature | Effort | Priority | Notes |
|---|---|---|---|---|---|
| 51 | MON | Per-URL scheduled reporting | LARGE | 🟡 Medium | Recurring/Agency users set scan frequency (daily/weekly/monthly) per URL. Requires: `scheduled_scans` DB table, Vercel Cron or Supabase pg_cron, Resend email delivery of reports. UI: calendar/frequency picker in dashboard. |
| 52 | MON | Scheduled scan email delivery | MEDIUM | 🟡 Medium | Email PDF report on schedule completion. Depends on Resend (item 42) and item 51. |

---

## 6. Current State Summary (March 2026)

### What's live and working
- Full scan → report pipeline (17 checks, plain English output, score-over-time chart)
- Auth (email/password signup, login, password reset, admin role)
- Dashboard with scan history, daily counter, score delta column
- Early access code system (25 slots)
- Stripe checkout — Action Plan €10, Recurring €29/mo, Agency €99/mo
- Stripe webhook → Supabase plan upgrade
- Stripe Customer Portal (manage billing/cancel) via /account
- Account settings page (/account) — email, password, billing, delete account
- Plan-based rate limits: Free=1/day, Action Plan=10, Recurring=20, Agency=unlimited
- Chrome extension (all 4 states, guest mode, colour contrast checker)
- Admin dashboard (full user management, MRR stats)
- Free tools: alt-text checker (5/day rate limit), accessibility statement generator (EAA exclusions, burden)
- Mobile hamburger nav (drawer, Escape key, outside click, ARIA)
- sitemap.xml + robots.txt (auto-generated, SEO-ready)
- "Action Plan" naming consistent across pricing, dashboard, account
- Blog (structure only, no posts yet)
- SVG brand logo, dark/light theme toggle
- Auth-aware nav (user icon when logged in)
- Security hardened (CSP, SSRF protection, admin guards, sanitised errors)
- Accessibility compliant (ARIA, contrast ratios, focus indicators, reduced motion, skip link)

### What's broken / needs immediate attention
- **None known.** All previously flagged issues resolved.

### What's not built yet (priority order)
1. Resend email integration — blocking all retention features
3. Weekly score email — depends on Resend
4. Dashboard v2 — compliance monitor, charts, trajectory, deltas
5. Google OAuth — needs production verification
6. Scan decay + score drop alerts — depends on Resend
7. Chrome Web Store submission
8. Blog content (3 launch posts)
9. Multi-page crawl (Agency plan feature)
10. Per-URL scheduled reporting

---

## 7. Exit Strategy & Acquisition Positioning

> **A11YO is being built to be useful. If it is useful enough, it will also be acquirable. The two goals are not in conflict.**

### Target Acquirers

| Category | Examples |
|---|---|
| **Accessibility platforms** | Siteimprove, Deque Systems, Level Access, UserWay, accessiBe |
| **CMS/hosting platforms adding compliance tooling** | WordPress VIP, WP Engine, Kinsta, Automattic |
| **Digital agency platforms** | Any SaaS that sells to web agencies could bundle accessibility reporting |

### The Data Asset

Every scan is a structured data point on the accessibility health of a real website — URL, score, issue breakdown, scan date, remediation history. At scale, this is a valuable dataset: the largest structured survey of accessibility compliance across Irish and EU websites. No equivalent dataset exists publicly.

### The Moat

The plain English issue library is the differentiator that cannot be easily replicated by a scanner tool. Every issue type has hand-written, human-reviewed copy: a plain English title, a human impact explanation, and a developer fix instruction. This is not generated — it is editorial IP. A scanner can be forked. This library cannot.

### Market Timing

EAA enforcement is active across the EU from 28 June 2025. The addressable market is every public-facing website in Europe. The Irish market is the beachhead — a high-trust, English-language, EU-regulated market with an active SME sector and strong agency channel.

### What Makes A11YO Acquirable

- Recurring revenue (Recurring + Agency subscriptions)
- Retention data (scan frequency, score trajectories, re-scan behaviour)
- Plain English IP (the issue library — hand-written, not generated)
- Agency channel (agencies use A11YO to report to clients → agency account = multiple client URLs)
- Proven non-technical usability (business owners can use it without training)
- Compliance timing (acquirer gets a product that is already relevant on day one of enforcement)

---

## 8. How to Use This Document with Claude Code

**Opening prompt for a new session:**
> "Read `/PRD.md` in the repo root. The next item on the roadmap is [Feature ID / Name]. Here is the current state of the project: [brief description]. Build it as specified in the PRD."

**After completing a feature:**
> "Mark [Feature ID] as Done in the roadmap table in PRD.md and tell me what the next item is."

**Key principle to remind Claude Code:**
> "Remember: the core product is the plain English report. Every issue must have a title, a 'what this means' explanation, and a 'what needs to happen' fix instruction. No WCAG codes visible by default. Build for a business owner who has never heard of WCAG."

---

*Confidential — Ferg Flannery / A11YO*
