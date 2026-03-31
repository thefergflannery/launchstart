# A11YO — Claude Code Build Prompt
## Monetisation Sprint: Issue Preview Lock + Scan History + Pricing Update
**Drop this file in the repo root and paste the contents as your opening Claude Code message.**

---

Read `/PRD.md` in the repo root before doing anything else. Everything we are building today is specified there.

We are building the three features that unlock revenue for A11YO. These must be built in order because each one depends on the last. Do not skip ahead.

---

## Context

A11YO (pronounced "ally-oh" — a play on a11y, the developer shorthand for accessibility) is a plain English accessibility compliance platform for Irish and EU businesses navigating the European Accessibility Act. The core product is working: scan a URL, get a plain English report. What is missing is the monetisation layer.

Current broken state:
- Stripe price IDs are not set in Vercel (`STRIPE_PRICE_PRO` and `STRIPE_PRICE_AGENCY` env vars point to product IDs, not price IDs)
- Pricing model is wrong (€5/€15 is too low — needs to change to €10/€29/€99)
- Free users get the full report — there is no conversion pressure
- There is no scan history or score trend — nothing to justify recurring payment

We are fixing all three today.

---

## Build Order — Do These in Sequence

### STEP 1 — Fix Stripe env and update pricing model

**What to change:**

1. In the Stripe dashboard (I will set the env vars manually in Vercel — just tell me what variable names you expect):
   - Create three prices: `STRIPE_PRICE_ONCEOFF` (€10, one-time), `STRIPE_PRICE_RECURRING` (€29/month), `STRIPE_PRICE_AGENCY` (€99/month)
   - Update the webhook handler to recognise these three tiers and map them to Supabase user plan values: `onceoff`, `recurring`, `agency`

2. Update `/pricing` page to show the new three-tier model:
   - **Free** — €0 — 1 scan, issue titles visible, fix detail locked
   - **One-Off Report** — €10 — full single-page report, PDF export, DEV/OWNER split
   - **Recurring** — €29/month — everything in One-Off + scan history, score over time, scheduled rescan, multiple URLs
   - **Agency** — €99/month — everything in Recurring + multi-client dashboard, white-label PDF, client sharing

3. Update the Supabase `profiles` table (or equivalent) to support four plan values: `free`, `onceoff`, `recurring`, `agency`. Check what column is currently used and migrate if needed.

4. Update all plan-checking logic in the codebase to use the new four-tier model. Search for any hardcoded references to `pro`, `early_access`, `full_site` and update accordingly. Early access users map to `recurring` for feature access purposes.

Do not touch the scan pipeline or report components yet. Just fix the payment and plan infrastructure.

---

### STEP 2 — Issue Preview Lock

> This is the highest-leverage conversion feature. A free user sees every issue on their report — title, severity, count — but cannot read the fix detail. This creates motivated anxiety. They know they have problems. They cannot act without paying.

**What to build:**

In the report view (`/report/:scanId` or equivalent), add tier-based content gating:

**Free and unauthenticated users see:**
- Compliance score (large, colour-coded, real number — do not hide this)
- Full issue list with: severity badge, plain English title, instance count ("Found on 3 pages")
- All fix detail blurred: "What this means", "What needs to happen", DEV/OWNER badge, specific locations
- A lock icon overlay on each blurred section
- A single inline CTA on each locked card: "Unlock this fix — from €10 one-off or €29/month"
- One upgrade modal that triggers from any locked element (do not spam multiple modals)

**Paid users (onceoff, recurring, agency) see:**
- Full report, all content visible, no locks

**Implementation notes:**
- The blur should use CSS (`filter: blur(4px)`) with a positioned overlay div containing the lock icon and CTA
- Do not use `display: none` — the user should be able to see that content exists, just not read it
- The upgrade CTA inside the card should open a modal or link to `/pricing`
- Apply the same lock to the sample report's "try scanning your own site" flow but NOT to `/sample-report` itself — that page is a full demo and should always show everything

**Compliance score on free tier:**
- Show the score number
- Below it: a greyed-out chart placeholder with caption: "Track your score over time — upgrade to Recurring"
- The placeholder should look like a real chart (flat grey bars or a blurred line) to communicate what the paid version looks like

---

### STEP 3 — Scan History + Delta View + Compliance Score Trend

> This is the feature that justifies paying €29 every month. Without it, there is no honest answer to "why do I keep paying?" A business owner who can see their accessibility score going from 34 to 67 over three months will not cancel.

**What to build:**

**3a — Scan history storage**

Check whether scan results are currently persisted in Supabase. If yes, confirm the schema. If no, create a `scans` table with:
```sql
create table scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  url text not null,
  score integer not null,           -- 0-100 weighted score
  critical_count integer default 0,
  should_fix_count integer default 0,
  nice_to_have_count integer default 0,
  result_json jsonb,                -- full axe output or processed issues
  created_at timestamptz default now()
);

-- RLS: users can only see their own scans
alter table scans enable row level security;
create policy "Users see own scans" on scans for select using (auth.uid() = user_id);
create policy "Users insert own scans" on scans for insert with check (auth.uid() = user_id);
```

After each scan completes, insert a row into `scans` for authenticated users. Guest/unauthenticated scans are ephemeral and not stored.

**3b — Dashboard scan history table**

On the user dashboard, replace or extend the current scan history view with:

| URL | Date | Score | Change | |
|-----|------|-------|--------|---|
| acmecoffee.ie | 12 Mar 2026 | 74 | +12 ↑ | View report |
| acmecoffee.ie | 01 Mar 2026 | 62 | –3 ↓ | View report |

- Delta calculated by comparing current scan score to the previous scan for the same URL
- Green arrow + positive number if improved, red arrow + negative number if declined, dash if first scan
- "View report" links to `/report/:scanId`
- Free users: show only the most recent scan row, with a note "Upgrade to Recurring to see your full history"

**3c — Compliance score trend chart**

On the dashboard (for `recurring` and `agency` users), add a line chart above the history table showing score over time for their most-scanned URL (or a URL selector dropdown if they have multiple).

- Use Recharts (`LineChart`, `Line`, `XAxis`, `YAxis`, `Tooltip`) — it is likely already in the project
- X axis: scan dates (last 6 scans)
- Y axis: score 0–100
- Line colour: green if trending up, neutral if flat, red if trending down (calculate from first to last point)
- Chart title: "Compliance score — [URL]"

For `free` and `onceoff` users: render the chart area as a blurred/greyed placeholder with an upgrade CTA overlay. Show them what it looks like but not the data.

**3d — Delta badge on report header**

On the full report page, if a previous scan exists for the same URL, show a delta badge in the report header:
- "+12 since your last scan" in green if improved
- "–4 since your last scan" in red if declined
- "First scan for this URL" if no prior scan

This only shows for authenticated users with scan history.

---

## Design Principles — Do Not Break These

1. **No WCAG codes visible by default.** If any WCAG references appear outside the collapsed 'show more' toggle, remove them.
2. **Severity is Critical / Should Fix / Nice to Have only.** Never Level A / AA / AAA in user-facing copy.
3. **Every issue card has:** plain English title, what this means, what needs to happen. These are the three layers. Do not reduce them.
4. **DEV TASK / OWNER TASK badges** should appear on all paid-tier issue cards. Check `lib/issue-library.ts` — if `task_type` is not present on issue objects, add it using the classification table in PRD.md Section 7.
5. **Irish market framing throughout.** EAA, NDA, Irish businesses. Not generic "compliance tool" language.
6. **No em dashes in copy.** Use double hyphens (--) or rewrite the sentence.
7. **Chrome and Firefox only** in any browser-specific copy. No Edge references.

---

## What NOT to Build in This Session

- Agency tier features (multi-client dashboard, white-label PDF) — wait for 20+ recurring subscribers
- Full site crawl / multi-page scanning — this is a Phase 5 feature
- Scheduled rescanning — build after scan history is stable and tested
- Chrome Web Store submission — separate session
- Blog content — separate session
- Mobile hamburger nav — separate session (important but not revenue-blocking)

---

## After This Session

When all three steps are complete:

1. Update the roadmap table in `/PRD.md`: mark items 22, 23, 24, 25, 26 as ✅ Done
2. Tell me the next item on the Phase 4 roadmap (item 27 — Stripe Customer Portal)
3. Confirm the Vercel env variables that need to be set manually (I will set them — do not hardcode values)

---

## Key Files to Know About

These are likely relevant — check they exist before assuming:
- `lib/issue-library.ts` — the plain English issue content library
- `components/IssueCard.tsx` — the report issue card component
- `app/report/[scanId]/page.tsx` — the full report view (add Issue Preview Lock here)
- `app/dashboard/page.tsx` — the user dashboard (add scan history + chart here)
- `app/pricing/page.tsx` — the pricing page (update to new model)
- `app/api/stripe/webhook/route.ts` — the Stripe webhook (update tier mapping)
- `app/api/scan/route.ts` — the scan API (add scan storage to Supabase here)

If any of these paths are wrong, find the correct paths before building.

---

*A11YO — ally-oh — know your shortfalls, prove your progress.*
