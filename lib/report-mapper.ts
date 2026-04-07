/**
 * Maps raw scanner CheckResult[] output to the enriched ReportIssue[] format
 * used by the report UI.
 *
 * Each check ID has a static definition covering both the owner-facing business
 * context and the developer-facing technical fix. The scanner status (pass /
 * amber / fail) is applied at runtime.
 *
 * Coverage: all 17 check IDs across accessibility (7), SEO (5), launch (5).
 *
 * PRD ref: §Report Overhaul — Track 1, T1.3
 */

import type { CheckResult } from '@/lib/types';
import type { ReportIssue, ReportSeverity, TaskType, ScopeIndicator, EstimatedCost } from '@/types/report';

type IssueTemplate = Omit<ReportIssue, 'id' | 'status'>;

const REPORT_LIBRARY: Record<string, IssueTemplate> = {

  // ── ACCESSIBILITY (7) ──────────────────────────────────────────────────────

  'image-alt': {
    severity: 'critical',
    title: 'Images have no description for screen readers',
    who_is_affected: 'People who are blind or have low vision and use a screen reader to navigate the web.',
    why_it_matters:
      'Screen reader users will hear nothing when they reach these images — no idea what is shown or where an image link leads. This is a Level A WCAG failure and a direct EAA compliance risk. Roughly 1 in 6 people have some form of visual impairment.',
    owner_action:
      'Forward this report to your developer. Ask them to add a short text description (an alt attribute) to every meaningful image. Purely decorative images should be marked so screen readers skip them.',
    pass_title: 'All images have text descriptions for screen readers',
    fix_instruction:
      'Add an `alt` attribute to every `<img>` element. Meaningful images need a concise description (e.g. `alt="CEO speaking at conference"`). Decorative images should use `alt=""` so assistive technology skips them. For icon buttons, use `aria-label` on the button instead. Run `axe` or the browser accessibility inspector after to confirm no violations remain.',
    wcag_criterion: 'WCAG 2.2 — 1.1.1 Non-text Content (Level A)',
    en_301_549_ref: 'EN 301 549 §9.1.1.1',
    task_type: 'developer',
    scope_indicator: 'page-level',
    estimated_cost: 'hours',
    passes_automated: true,
  },

  'form-labels': {
    severity: 'critical',
    title: 'Form fields have no labels for screen reader users',
    who_is_affected: 'People using screen readers, voice control software, or keyboard-only navigation.',
    why_it_matters:
      'Without labels, a screen reader user hears "edit text" with no context — they cannot tell what the field is asking for. Contact forms, sign-up flows, and checkout forms become completely unusable. This is a Level A WCAG failure and blocks EAA compliance.',
    owner_action:
      'Ask your developer to add a visible label to every form field. This is a straightforward fix that affects every form on the site — sign-up, contact, and checkout.',
    pass_title: 'All form fields have proper labels',
    fix_instruction:
      'Every `<input>`, `<select>`, and `<textarea>` needs a programmatically associated label. The preferred method is a `<label for="inputId">` element paired to the field via its `id`. Where a visible label is not possible (e.g. a search bar with a placeholder), use `aria-label="Search"` or `aria-labelledby` pointing to a visible element. Never rely on `placeholder` alone — it is not a label.',
    wcag_criterion: 'WCAG 2.2 — 1.3.1 Info and Relationships (Level A), 3.3.2 Labels or Instructions (Level A)',
    en_301_549_ref: 'EN 301 549 §9.1.3.1, §9.3.3.2',
    task_type: 'developer',
    scope_indicator: 'component',
    estimated_cost: 'hours',
    passes_automated: true,
  },

  'color-contrast': {
    severity: 'should-fix',
    title: 'Text may be too difficult to read on its background',
    who_is_affected: 'People with low vision, colour blindness, or anyone reading on a bright screen outdoors.',
    why_it_matters:
      'Insufficient contrast makes text hard or impossible to read for roughly 1 in 12 men and 1 in 200 women with colour vision deficiencies. It also affects all users in suboptimal lighting conditions and is a Level AA WCAG requirement under EAA.',
    owner_action:
      'Ask your designer or developer to check the colour combinations used for text across the site. They can use a free tool called WebAIM Contrast Checker to verify each combination and adjust as needed.',
    pass_title: 'Colour contrast appears to meet minimum requirements',
    fix_instruction:
      'Use the WebAIM Contrast Checker (webaim.org/resources/contrastchecker) or the axe DevTools browser extension to identify failing colour pairs. Normal-sized body text needs a ratio of at least 4.5:1 against its background. Large text (18px+ regular or 14px+ bold) needs at least 3:1. Adjust the foreground or background colour until both pass. Check all states: default, hover, focus, disabled.',
    wcag_criterion: 'WCAG 2.2 — 1.4.3 Contrast (Minimum) (Level AA)',
    en_301_549_ref: 'EN 301 549 §9.1.4.3',
    task_type: 'design',
    scope_indicator: 'global',
    estimated_cost: 'hours',
    passes_automated: false,
    manual_check_note: 'Automated contrast checks are limited to static text. Verify hover, focus, and interactive states manually using a browser extension such as axe DevTools or Colour Contrast Analyser.',
  },

  'title-lang': {
    severity: 'critical',
    title: 'Page is missing a title or language declaration',
    who_is_affected: 'All visitors using screen readers, and anyone relying on browser-based translation.',
    why_it_matters:
      'Screen readers announce the page title when a user arrives — without it, they have no idea where they have landed. The language attribute tells screen readers which language rules to apply for correct pronunciation. Both are Level A WCAG failures and EAA requirements.',
    owner_action:
      'Ask your developer to add a descriptive title to the page and confirm the page language is declared. Both are single-line changes that take minutes.',
    pass_title: 'Page has a title and language declaration',
    fix_instruction:
      'Ensure a `<title>` tag is present inside `<head>` with a meaningful, unique description of the page (e.g. "Contact Us — Acme Ltd"). Also confirm the `<html>` element has a `lang` attribute set to the correct BCP 47 language code (e.g. `lang="en"` for English, `lang="en-IE"` for Irish English). In a Next.js App Router project, set `lang` on the `<html>` element in `app/layout.tsx` and use the `metadata.title` export for page titles.',
    wcag_criterion: 'WCAG 2.2 — 2.4.2 Page Titled (Level A), 3.1.1 Language of Page (Level A)',
    en_301_549_ref: 'EN 301 549 §9.2.4.2, §9.3.1.1',
    task_type: 'developer',
    scope_indicator: 'global',
    estimated_cost: 'minutes',
    passes_automated: true,
  },

  'aria-errors': {
    severity: 'critical',
    title: 'Accessibility code contains errors that break screen readers',
    who_is_affected: 'People using screen readers and other assistive technologies.',
    why_it_matters:
      'Invalid ARIA attributes do not just fail silently — they can confuse or completely break how a screen reader interprets the page, making interactive components (menus, modals, sliders) impossible to use. This is a Level A WCAG failure.',
    owner_action:
      'Ask your developer to run an automated accessibility audit and fix all ARIA-related errors. This is a technical fix that requires code changes.',
    pass_title: 'No ARIA errors detected',
    fix_instruction:
      'Run `axe` or the browser accessibility inspector to identify each invalid ARIA attribute. Common causes: invalid `role` values (e.g. `role="navigation"` is valid; `role="nav"` is not), `aria-*` attributes used on elements where they are not permitted, or required `aria-*` attributes missing (e.g. `aria-controls` pointing to a non-existent element). Cross-reference each role and attribute against the WAI-ARIA 1.2 spec at w3.org/TR/wai-aria-1.2. Fix each violation individually — do not bulk-remove ARIA as this can make things worse.',
    wcag_criterion: 'WCAG 2.2 — 4.1.2 Name, Role, Value (Level A)',
    en_301_549_ref: 'EN 301 549 §9.4.1.2',
    task_type: 'developer',
    scope_indicator: 'page-level',
    estimated_cost: 'hours',
    passes_automated: true,
  },

  'heading-structure': {
    severity: 'should-fix',
    title: 'Headings are in the wrong order or missing',
    who_is_affected: 'People using screen readers who navigate by jumping between headings.',
    why_it_matters:
      'Screen reader users navigate pages the way sighted users scan — by jumping to headings. A broken or skipped heading hierarchy makes the page impossible to navigate by heading, forcing users to listen through all content linearly. This affects navigation speed and comprehension.',
    owner_action:
      'Ask your developer to review the heading order on the page. There should be one main H1 heading, with H2 and H3 subheadings below it in logical order — no skipped levels.',
    pass_title: 'Heading structure is logical and well-ordered',
    fix_instruction:
      'The page must have exactly one `<h1>` element — the main page heading. Subheadings should follow a strict descending order: `<h2>` sections, with `<h3>` subsections beneath each `<h2>`. Never skip from `<h1>` to `<h3>` directly. Remove any empty heading tags (`<h2></h2>`). Headings must reflect document structure, not visual styling — if you need large bold text that is not a heading, use a `<p>` with CSS classes instead of a heading element.',
    wcag_criterion: 'WCAG 2.2 — 1.3.1 Info and Relationships (Level A)',
    en_301_549_ref: 'EN 301 549 §9.1.3.1',
    task_type: 'developer',
    scope_indicator: 'page-level',
    estimated_cost: 'hours',
    passes_automated: true,
  },

  'keyboard-focus': {
    severity: 'critical',
    title: 'Parts of this page may be unreachable without a mouse',
    who_is_affected: 'People who navigate using a keyboard only — including many with motor disabilities, and all power users.',
    why_it_matters:
      'Keyboard-only users navigate using Tab, Enter, and arrow keys. Positive tabindex values (tabindex="2" etc.) cause a chaotic and broken tab order. Without a skip link, they must tab through the entire navigation menu on every single page before reaching the content. Both are Level A WCAG failures.',
    owner_action:
      'Ask your developer to check that every interactive element on the site can be reached and operated using only the keyboard, and that pressing Tab moves through the page in a logical order.',
    pass_title: 'Keyboard navigation appears properly configured',
    fix_instruction:
      'Remove all positive `tabindex` values from the codebase (`tabindex="1"`, `tabindex="2"`, etc.) — they override natural tab order and create an unpredictable navigation sequence. Use `tabindex="0"` to add elements to the natural tab order, or `tabindex="-1"` to allow programmatic focus without including in tab order. Add a skip link at the very top of the page: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>`. Ensure the target element has `id="main-content"`. Test by pressing Tab through the entire page — every interactive element must be reachable and have a visible focus outline.',
    wcag_criterion: 'WCAG 2.2 — 2.1.1 Keyboard (Level A), 2.4.1 Bypass Blocks (Level A)',
    en_301_549_ref: 'EN 301 549 §9.2.1.1, §9.2.4.1',
    task_type: 'developer',
    scope_indicator: 'global',
    estimated_cost: 'hours',
    passes_automated: false,
    manual_check_note: 'Automated checks can detect missing skip links and positive tabindex values. Full keyboard navigation must be verified manually — tab through every interactive element and confirm logical order and visible focus state.',
  },

  // ── SEO (5) ─────────────────────────────────────────────────────────────────

  'meta-description': {
    severity: 'should-fix',
    title: 'No description found for search engines',
    who_is_affected: 'Anyone searching for your business on Google or other search engines.',
    why_it_matters:
      'Without a meta description, Google picks arbitrary text from the page to display in search results. This often results in a poor first impression and fewer clicks. A well-written description is one of the fastest wins for improving search result click-through rate.',
    owner_action:
      'Write a 1–2 sentence description of this page (120–155 characters) and ask your developer to add it. Think of it as the text that appears under your page title in Google search results.',
    pass_title: 'Meta description is present',
    fix_instruction:
      'Add `<meta name="description" content="Your summary here">` inside the `<head>`. Keep content between 120 and 155 characters. Write it to clearly describe the page and encourage clicks — it is your pitch in search results. In Next.js, export `metadata.description` from the page file. Unique descriptions for every page are strongly preferred over a sitewide generic fallback.',
    wcag_criterion: 'N/A — SEO best practice (not a WCAG requirement)',
    en_301_549_ref: 'N/A',
    task_type: 'content',
    scope_indicator: 'page-level',
    estimated_cost: 'minutes',
    passes_automated: true,
  },

  'og-image': {
    severity: 'nice-to-have',
    title: 'No image set for social media sharing',
    who_is_affected: 'Anyone who shares your page on LinkedIn, X (Twitter), Facebook, or WhatsApp.',
    why_it_matters:
      'Shared links with no preview image are far less likely to be clicked. A compelling OG image can significantly increase traffic from social sharing at no ongoing cost.',
    owner_action:
      'Create a branded image (1200 × 630 pixels) and ask your developer to set it as the social preview image for the site. A simple branded card with your logo and tagline is sufficient.',
    pass_title: 'Social media preview image is set',
    fix_instruction:
      'Add `<meta property="og:image" content="https://yoursite.com/og.png">` to the `<head>`. The image should be at least 1200 × 630px and under 8 MB. Also add `<meta property="og:image:width" content="1200">` and `<meta property="og:image:height" content="630">` for best compatibility. In Next.js App Router, use `app/opengraph-image.tsx` (edge-rendered) or declare `metadata.openGraph.images`. Validate with the LinkedIn Post Inspector or Twitter Card Validator.',
    wcag_criterion: 'N/A — social sharing best practice (not a WCAG requirement)',
    en_301_549_ref: 'N/A',
    task_type: 'developer',
    scope_indicator: 'global',
    estimated_cost: 'minutes',
    passes_automated: true,
  },

  'og-title': {
    severity: 'nice-to-have',
    title: 'No custom title set for social media sharing',
    who_is_affected: 'Anyone who shares your page on social media.',
    why_it_matters:
      'Without an OG title, social platforms fall back to the page `<title>`. This often works fine, but setting a custom OG title gives you control over the headline that appears in shares — especially useful when the page title includes your brand name in a format that reads oddly in a social card.',
    owner_action:
      'Ask your developer to set a custom social media title for key pages. It takes a few minutes and gives you full control over how pages appear when shared.',
    pass_title: 'Social media title is set',
    fix_instruction:
      'Add `<meta property="og:title" content="Your Headline Here">` to the `<head>`. Also add `<meta name="twitter:title" content="Your Headline Here">` for X/Twitter. Keep it under 70 characters for best display. In Next.js, set `metadata.openGraph.title`. Also consider adding `og:description`, `og:url`, and `og:type` to complete the full Open Graph tag set.',
    wcag_criterion: 'N/A — social sharing best practice (not a WCAG requirement)',
    en_301_549_ref: 'N/A',
    task_type: 'developer',
    scope_indicator: 'global',
    estimated_cost: 'minutes',
    passes_automated: true,
  },

  'viewport': {
    severity: 'should-fix',
    title: 'Mobile display is not configured correctly',
    who_is_affected: 'All visitors on mobile phones and tablets — typically more than half of all web traffic.',
    why_it_matters:
      'Without a viewport meta tag, mobile browsers render the page at desktop width and zoom it out. Text becomes tiny and impossible to read without pinching to zoom. This is a Level AA WCAG requirement and a basic EAA compliance issue.',
    owner_action:
      'Ask your developer to add the mobile viewport tag to the site. It is a single line of code and takes under one minute.',
    pass_title: 'Mobile viewport is correctly configured',
    fix_instruction:
      'Add `<meta name="viewport" content="width=device-width, initial-scale=1">` inside `<head>`. Do not add `maximum-scale=1` or `user-scalable=no` — these prevent users from zooming and are a WCAG 1.4.4 failure. In Next.js App Router, viewport is set automatically if using the `metadata` export; verify it is not being overridden anywhere.',
    wcag_criterion: 'WCAG 2.2 — 1.4.4 Resize Text (Level AA)',
    en_301_549_ref: 'EN 301 549 §9.1.4.4',
    task_type: 'developer',
    scope_indicator: 'global',
    estimated_cost: 'minutes',
    passes_automated: true,
  },

  'https': {
    severity: 'critical',
    title: 'Site is not using a secure connection',
    who_is_affected: 'Every visitor to your website.',
    why_it_matters:
      'HTTP sites transmit data unencrypted. Browsers display a "Not Secure" warning that damages visitor trust immediately. Search engines rank HTTPS sites higher. Under GDPR, transmitting personal data (form submissions, login credentials) over HTTP may constitute a data breach.',
    owner_action:
      'Contact your hosting provider and ask them to enable an SSL certificate and redirect all traffic from HTTP to HTTPS. Most modern hosts provide this for free and can set it up within minutes.',
    pass_title: 'Site is served over a secure HTTPS connection',
    fix_instruction:
      'Obtain an SSL/TLS certificate (Let\'s Encrypt is free and widely supported) and install it on the server. Configure the server to redirect all HTTP requests to HTTPS with a 301 permanent redirect. Update all hardcoded internal links and asset references from `http://` to `https://` or protocol-relative `//`. Set the `Strict-Transport-Security` response header (HSTS) to enforce HTTPS going forward. Verify with SSL Labs (ssllabs.com/ssltest) after deployment.',
    wcag_criterion: 'N/A — security and legal requirement (not a WCAG criterion)',
    en_301_549_ref: 'N/A',
    task_type: 'infrastructure',
    scope_indicator: 'global',
    estimated_cost: 'hours',
    passes_automated: true,
  },

  // ── LAUNCH READINESS (5) ────────────────────────────────────────────────────

  'robots-txt': {
    severity: 'nice-to-have',
    title: 'No robots.txt file found',
    who_is_affected: 'Search engine crawlers (Googlebot, Bingbot, etc.).',
    why_it_matters:
      'Without a robots.txt file, search engines crawl your entire site with no restrictions. This is usually harmless, but you lose the ability to prevent crawling of admin pages, staging areas, or duplicate content that could hurt your search rankings.',
    owner_action:
      'Ask your developer to create a robots.txt file. It takes less than five minutes and gives you control over what search engines can see.',
    pass_title: 'robots.txt file is present and accessible',
    fix_instruction:
      'Create a `robots.txt` file in the root of the site (`/robots.txt`). A safe, permissive default:\n\n```\nUser-agent: *\nAllow: /\nSitemap: https://yoursite.com/sitemap.xml\n```\n\nBlock pages that should not be indexed (e.g. admin areas, thank-you pages, API routes):\n\n```\nDisallow: /admin/\nDisallow: /api/\n```\n\nIn Next.js App Router, export a `robots.ts` file from `app/robots.ts` — Next.js generates the file automatically at build time.',
    wcag_criterion: 'N/A — SEO best practice (not a WCAG requirement)',
    en_301_549_ref: 'N/A',
    task_type: 'developer',
    scope_indicator: 'global',
    estimated_cost: 'minutes',
    passes_automated: true,
  },

  'sitemap': {
    severity: 'nice-to-have',
    title: 'No sitemap found for search engines',
    who_is_affected: 'Search engine crawlers indexing your site.',
    why_it_matters:
      'A sitemap tells search engines about every page on your site. Without one, newer or deeper pages may never appear in search results. A sitemap also lets you tell Google how often pages are updated, which helps with faster indexing.',
    owner_action:
      'Ask your developer to create a sitemap. On most platforms (WordPress, Shopify) a plugin can do this automatically. Once live, submit it to Google Search Console.',
    pass_title: 'sitemap.xml is accessible',
    fix_instruction:
      'Create a `sitemap.xml` file at `/sitemap.xml`. Each `<url>` entry should include `<loc>` (the full URL), `<lastmod>` (last modified date), and optionally `<changefreq>` and `<priority>`. In Next.js App Router, export a `sitemap.ts` from `app/sitemap.ts` — Next.js generates it at build time. After deploying, submit the sitemap URL to Google Search Console under Sitemaps. Regenerate the sitemap whenever new pages are added.',
    wcag_criterion: 'N/A — SEO best practice (not a WCAG requirement)',
    en_301_549_ref: 'N/A',
    task_type: 'developer',
    scope_indicator: 'global',
    estimated_cost: 'minutes',
    passes_automated: true,
  },

  'load-time': {
    severity: 'should-fix',
    title: 'Page took a long time to load',
    who_is_affected: 'All visitors, particularly those on mobile networks or older devices.',
    why_it_matters:
      'A slow page increases bounce rate and reduces conversions — Google reports that each additional second of load time reduces conversions by up to 20%. Search engines also use page speed as a ranking signal. Users with low-bandwidth connections or assistive technology may be disproportionately affected.',
    owner_action:
      'Share this report with your developer and ask them to run a Google PageSpeed Insights check on the page for specific recommendations. The most common culprits are large images and slow hosting.',
    pass_title: 'Page loaded within an acceptable time',
    fix_instruction:
      'Use Google PageSpeed Insights (pagespeed.web.dev) to get a detailed breakdown. Common fixes: compress and serve images in WebP/AVIF format, lazy-load below-the-fold images, defer non-critical JavaScript, enable browser caching headers, and use a CDN. In Next.js, use `next/image` for all images (automatic optimisation and lazy loading), avoid importing large libraries in the client bundle, and ensure the site is deployed on a global CDN (Vercel Edge Network, Cloudflare, etc.).',
    wcag_criterion: 'N/A — performance best practice (not a direct WCAG criterion)',
    en_301_549_ref: 'N/A',
    task_type: 'developer',
    scope_indicator: 'global',
    estimated_cost: 'days',
    passes_automated: true,
  },

  'broken-links': {
    severity: 'should-fix',
    title: 'Broken links found on this page',
    who_is_affected: 'All visitors, but particularly screen reader users who navigate by jumping between links.',
    why_it_matters:
      'Broken links create dead ends that frustrate visitors and signal to search engines that the site is poorly maintained. Screen reader users who navigate by listening to links one-by-one hit these dead ends without visual cues. Each broken link is also a lost conversion opportunity.',
    owner_action:
      'Ask your developer to identify and fix all links that lead to missing pages. This may include updating outdated URLs, removing deleted pages, or setting up redirects.',
    pass_title: 'No broken links detected on this page',
    fix_instruction:
      'Audit all links on the page — internal and external. For each link returning a 4xx or 5xx status: update the URL if the destination moved, set up a 301 redirect if the old URL still receives traffic, or remove the link entirely. For external links that no longer exist, link to an equivalent resource or remove the link. Set up a regular automated broken-link scan (tools: Screaming Frog, Ahrefs Site Audit, or a GitHub Action using `broken-link-checker`).',
    wcag_criterion: 'N/A — usability best practice (not a direct WCAG criterion)',
    en_301_549_ref: 'N/A',
    task_type: 'developer',
    scope_indicator: 'page-level',
    estimated_cost: 'hours',
    passes_automated: true,
  },

  'mobile-viewport': {
    severity: 'should-fix',
    title: 'Mobile display is not configured correctly',
    who_is_affected: 'All visitors on mobile phones and tablets — typically more than half of all web traffic.',
    why_it_matters:
      'Without a correct mobile viewport setting, the page appears zoomed out on phones and is nearly impossible to read or tap without pinching. This affects more than half of all web visitors and is a Level AA WCAG requirement.',
    owner_action:
      'Ask your developer to add the mobile viewport tag to the site. It is a single line of code and takes under one minute.',
    pass_title: 'Mobile viewport is correctly configured',
    fix_instruction:
      'Add `<meta name="viewport" content="width=device-width, initial-scale=1">` inside `<head>`. Do not include `maximum-scale=1` or `user-scalable=no` — these prevent users from zooming and violate WCAG 1.4.4. In Next.js App Router, the viewport is managed via the `metadata.viewport` export or set automatically; verify no layout file is overriding it with a restrictive value.',
    wcag_criterion: 'WCAG 2.2 — 1.4.4 Resize Text (Level AA)',
    en_301_549_ref: 'EN 301 549 §9.1.4.4',
    task_type: 'developer',
    scope_indicator: 'global',
    estimated_cost: 'minutes',
    passes_automated: true,
  },

};

/**
 * Maps an array of raw scanner CheckResults to enriched ReportIssues.
 *
 * Any check ID not found in REPORT_LIBRARY is passed through with a minimal
 * fallback shape so the report never crashes on an unknown check.
 */
export function mapToReportIssues(checks: CheckResult[]): ReportIssue[] {
  return checks.map((check): ReportIssue => {
    const template = REPORT_LIBRARY[check.id];

    if (!template) {
      // Unknown check — emit a safe fallback so the UI does not break
      return {
        id: check.id,
        status: check.status,
        severity: 'nice-to-have',
        title: check.label,
        who_is_affected: 'Site visitors.',
        why_it_matters: check.message,
        owner_action: check.fixHint,
        pass_title: `${check.label} passed`,
        fix_instruction: check.fixHint,
        wcag_criterion: 'N/A',
        en_301_549_ref: 'N/A',
        task_type: 'developer',
        scope_indicator: 'page-level',
        estimated_cost: 'hours',
        passes_automated: true,
      };
    }

    return {
      id: check.id,
      status: check.status,
      ...template,
    };
  });
}

/**
 * Convenience: map a full ScanResults object (all three categories) to a flat
 * ReportIssue array in display order (accessibility → seo → launch).
 */
export function mapScanToReportIssues(scan: {
  accessibility: CheckResult[];
  seo: CheckResult[];
  launch: CheckResult[];
}): ReportIssue[] {
  return [
    ...mapToReportIssues(scan.accessibility),
    ...mapToReportIssues(scan.seo),
    ...mapToReportIssues(scan.launch),
  ];
}
