/**
 * Plain English Issue Library
 *
 * Every check the scanner can return has an entry here with:
 * - severity:  how urgent this is (critical / should-fix / nice-to-have)
 * - title:     plain English, ≤10 words, no jargon
 * - means:     2 sentences max — human impact for a business owner
 * - fix:       2–3 sentences — developer instruction, no assumed knowledge
 * - wcag:      technical reference (hidden from business owners by default)
 * - quickWin:  true = easy one-line fix, shown in Quick Wins section
 * - passTitle: short message shown when this check passes
 *
 * PRD ref: §2.1, §2.2, §3.4
 */

export type IssueSeverity = 'critical' | 'should-fix' | 'nice-to-have';

export interface IssueEntry {
  id: string;
  severity: IssueSeverity;
  title: string;
  means: string;
  fix: string;
  wcag: string;
  quickWin: boolean;
  passTitle: string;
}

export const ISSUE_LIBRARY: Record<string, IssueEntry> = {

  // ── ACCESSIBILITY ──────────────────────────────────────────────────────────

  'image-alt': {
    id: 'image-alt',
    severity: 'critical',
    title: 'Images have no text description for screen readers',
    means:
      'A blind person using a screen reader will hear nothing when they reach these images — they have no idea what the image shows or where it links to. This affects roughly 1 in 6 people who have some form of visual impairment.',
    fix:
      'Each image needs a short text description added in the code, called an alt attribute. If an image is purely decorative, mark it with alt="" so screen readers skip it. Your developer can add these quickly across the site.',
    wcag: 'WCAG 2.2 — 1.1.1 Non-text Content (Level A)',
    quickWin: false,
    passTitle: 'All images have text descriptions for screen readers',
  },

  'form-labels': {
    id: 'form-labels',
    severity: 'critical',
    title: 'Form fields have no labels for screen reader users',
    means:
      'A person using a screen reader cannot tell what information a form field is asking for — they will hear something like "edit text" with no context. This makes contact forms, sign-up forms, and checkout forms completely unusable for screen reader users.',
    fix:
      'Every input field needs a visible label connected to it in the code. Your developer should add a <label for="..."> element paired with each input, or an aria-label attribute where a visible label is not possible. This is a straightforward change that applies to every form on the site.',
    wcag: 'WCAG 2.2 — 1.3.1 Info and Relationships (Level A), 3.3.2 Labels or Instructions (Level A)',
    quickWin: false,
    passTitle: 'All form fields have proper labels',
  },

  'color-contrast': {
    id: 'color-contrast',
    severity: 'should-fix',
    title: 'Text may be too difficult to read on its background',
    means:
      'People with low vision or colour blindness may struggle to read text that does not have enough contrast against its background. This affects roughly 1 in 12 men and 1 in 200 women worldwide.',
    fix:
      'Check your text and background colour combinations using a contrast checker tool (such as WebAIM Contrast Checker, which is free). Normal-sized text needs a ratio of at least 4.5:1, and large text needs 3:1. Your designer or developer can adjust the colours to meet this requirement.',
    wcag: 'WCAG 2.2 — 1.4.3 Contrast (Minimum) (Level AA)',
    quickWin: false,
    passTitle: 'Colour contrast requires a browser tool to verify — see the fix hint',
  },

  'title-lang': {
    id: 'title-lang',
    severity: 'critical',
    title: 'Page is missing a title or language declaration',
    means:
      'Screen readers announce the page title when a person arrives — without it, they have no idea where they have landed. The language declaration tells screen readers which language to read in, so your text is pronounced correctly.',
    fix:
      'Add a <title> tag inside the <head> of your HTML with a clear, descriptive page title. Also add lang="en" (or the appropriate language code) to the opening <html> tag. Both are single-line changes that your developer can make in minutes.',
    wcag: 'WCAG 2.2 — 2.4.2 Page Titled (Level A), 3.1.1 Language of Page (Level A)',
    quickWin: true,
    passTitle: 'Page has a title and language declaration',
  },

  'aria-errors': {
    id: 'aria-errors',
    severity: 'critical',
    title: 'Accessibility code contains errors that break screen readers',
    means:
      'Your website uses accessibility attributes incorrectly. Instead of helping, these errors can confuse or break screen readers, making parts of the page completely unusable for screen reader users.',
    fix:
      'Your developer should review the ARIA role values used on the page and correct any that are invalid. Invalid role values are the most common cause of this issue. Each role value must match an entry in the WAI-ARIA specification — your developer can check these easily with a browser extension or automated linter.',
    wcag: 'WCAG 2.2 — 4.1.2 Name, Role, Value (Level A)',
    quickWin: false,
    passTitle: 'No ARIA errors detected',
  },

  'heading-structure': {
    id: 'heading-structure',
    severity: 'should-fix',
    title: 'Headings are in the wrong order or missing',
    means:
      'Screen reader users navigate pages by jumping between headings, the way sighted users scan a page visually. When headings are in the wrong order, skipped, or missing entirely, this navigation breaks and the page is impossible to follow.',
    fix:
      'Make sure your page has exactly one H1 heading (the main title). Subheadings should then follow in order: H2, then H3 under each H2, and so on — never skip from H1 directly to H3. Remove any empty heading tags. Your developer can fix this by reviewing the heading hierarchy in the HTML.',
    wcag: 'WCAG 2.2 — 1.3.1 Info and Relationships (Level A)',
    quickWin: false,
    passTitle: 'Heading structure is logical and well-ordered',
  },

  'keyboard-focus': {
    id: 'keyboard-focus',
    severity: 'critical',
    title: 'Parts of this page may be unreachable without a mouse',
    means:
      'People who use a keyboard instead of a mouse — including many with motor disabilities — need to reach every part of a page by pressing the Tab key. Without a skip link, they must also tab through every navigation item on every page before reaching the actual content.',
    fix:
      'Remove any positive tabindex values from the code (tabindex="1" and above causes unpredictable and broken tab order — use tabindex="0" or remove it entirely). Add a skip link: a hidden link that appears at the top of the page when Tab is pressed, pointing to the main content area with href="#main-content".',
    wcag: 'WCAG 2.2 — 2.1.1 Keyboard (Level A), 2.4.1 Bypass Blocks (Level A)',
    quickWin: false,
    passTitle: 'Keyboard navigation appears properly configured',
  },

  // ── SEO ────────────────────────────────────────────────────────────────────

  'meta-description': {
    id: 'meta-description',
    severity: 'should-fix',
    title: 'No description found for search engines',
    means:
      'Search engines use the meta description to show a summary of your page in search results. Without one, Google picks any text from the page, which may not represent your business well and results in fewer people clicking through.',
    fix:
      'Add a <meta name="description" content="Your summary here"> tag inside the <head> of your HTML. Keep it between 120 and 155 characters and write it to describe the page clearly and encouragingly. Your developer can add this in under five minutes.',
    wcag: 'Not a WCAG requirement — SEO best practice',
    quickWin: true,
    passTitle: 'Meta description is present',
  },

  'og-image': {
    id: 'og-image',
    severity: 'nice-to-have',
    title: 'No image set for social media sharing',
    means:
      'When someone shares your page on LinkedIn, Twitter, or Facebook, no preview image will appear alongside the link. Links shared with images get significantly more clicks than those without.',
    fix:
      'Add a <meta property="og:image" content="https://yoursite.com/share-image.jpg"> tag to your HTML <head>. Use an image that is at least 1200 × 630 pixels. Your developer can add this in a few minutes.',
    wcag: 'Not a WCAG requirement — social sharing best practice',
    quickWin: true,
    passTitle: 'Social media preview image is set',
  },

  'og-title': {
    id: 'og-title',
    severity: 'nice-to-have',
    title: 'No custom title set for social media sharing',
    means:
      'When someone shares your page on social media, the title shown will fall back to your page\'s main title rather than a custom headline. This usually works fine but gives you less control over how your business appears.',
    fix:
      'Add a <meta property="og:title" content="Your headline here"> tag to your HTML <head>. Write it as an engaging headline for the social audience. Your developer can add this alongside the og:image tag.',
    wcag: 'Not a WCAG requirement — social sharing best practice',
    quickWin: true,
    passTitle: 'Social media title is set',
  },

  'viewport': {
    id: 'viewport',
    severity: 'should-fix',
    title: 'Mobile display is not configured correctly',
    means:
      'Without a correct viewport setting, your site may appear zoomed out on mobile phones and be nearly impossible to read or tap. This affects every visitor who accesses your site on a phone or tablet.',
    fix:
      'Add <meta name="viewport" content="width=device-width, initial-scale=1"> inside the <head> of your HTML. This single line tells mobile browsers how to scale your page correctly. Your developer can add it immediately.',
    wcag: 'WCAG 2.2 — 1.4.4 Resize Text (Level AA)',
    quickWin: true,
    passTitle: 'Viewport is correctly configured',
  },

  'https': {
    id: 'https',
    severity: 'critical',
    title: 'Site is not using a secure connection',
    means:
      'Your website is using HTTP instead of HTTPS, meaning information sent between your visitors and your site is unencrypted. Browsers mark HTTP sites as "Not Secure", which damages trust and can expose visitor data.',
    fix:
      'Contact your hosting provider to enable an SSL certificate and set up a redirect from all HTTP addresses to HTTPS. Most modern hosting providers include this for free. This is a security and legal requirement, not just an accessibility consideration.',
    wcag: 'Not a WCAG requirement — security and trust requirement',
    quickWin: false,
    passTitle: 'Site is served over a secure HTTPS connection',
  },

  // ── LAUNCH READINESS ──────────────────────────────────────────────────────

  'robots-txt': {
    id: 'robots-txt',
    severity: 'nice-to-have',
    title: 'No robots.txt file found',
    means:
      'Search engines use robots.txt to understand which parts of your site they are allowed to crawl and index. Without it, they will crawl everything, which is usually fine, but you have no control over it.',
    fix:
      'Create a plain text file called robots.txt in the root of your website. A simple starting point is two lines: "User-agent: *" and "Allow: /". Your developer can create and upload this file in a few minutes.',
    wcag: 'Not a WCAG requirement — SEO best practice',
    quickWin: true,
    passTitle: 'robots.txt file is accessible',
  },

  'sitemap': {
    id: 'sitemap',
    severity: 'nice-to-have',
    title: 'No sitemap found for search engines',
    means:
      'A sitemap tells search engines about every page on your site, helping them find and index your content. Without one, some pages may never appear in search results — especially newer or deeper pages.',
    fix:
      'Create a sitemap.xml file and place it in the root of your website. Most platforms (WordPress, Shopify, Squarespace) can generate this automatically with a plugin or built-in setting. Once live, submit it to Google Search Console.',
    wcag: 'Not a WCAG requirement — SEO best practice',
    quickWin: true,
    passTitle: 'sitemap.xml is accessible',
  },

  'load-time': {
    id: 'load-time',
    severity: 'should-fix',
    title: 'Page took a long time to load',
    means:
      'A slow-loading page frustrates all visitors and is particularly difficult for people on slow internet connections or older devices. Search engines also rank faster pages higher in results.',
    fix:
      'The most common causes of slow pages are large uncompressed images, too many scripts loading at the same time, and no use of a content delivery network (CDN). Share this report with your developer and ask them to run a Google PageSpeed Insights check for specific recommendations.',
    wcag: 'Not a direct WCAG requirement — performance and usability best practice',
    quickWin: false,
    passTitle: 'Page loaded at a good speed',
  },

  'broken-links': {
    id: 'broken-links',
    severity: 'should-fix',
    title: 'Broken links found on this page',
    means:
      'Some links on your page lead to pages that no longer exist. Broken links create a dead end for visitors and make your site look unmaintained. Screen reader users who navigate by jumping between links are particularly affected.',
    fix:
      'Identify and fix or remove links that lead to missing pages (returning a 404 error). Review each flagged link and either update the URL, point it to a new page, or remove it entirely. Ask your developer to check the site regularly for broken links as you add and update content.',
    wcag: 'Not a direct WCAG requirement — usability and SEO best practice',
    quickWin: false,
    passTitle: 'No broken links detected on this page',
  },

  'mobile-viewport': {
    id: 'mobile-viewport',
    severity: 'should-fix',
    title: 'Mobile display is not configured correctly',
    means:
      'Without a correct mobile viewport setting, your site may appear zoomed out on phones and be nearly impossible to read or use. More than half of all web traffic comes from mobile devices.',
    fix:
      'Add <meta name="viewport" content="width=device-width, initial-scale=1"> inside the <head> of your HTML. This single line tells mobile browsers how to scale your page correctly. Your developer can add it immediately.',
    wcag: 'WCAG 2.2 — 1.4.4 Resize Text (Level AA)',
    quickWin: true,
    passTitle: 'Mobile viewport is correctly configured',
  },

};

/** Look up an issue by its scanner check ID. Returns undefined if not in library. */
export function getIssue(id: string): IssueEntry | undefined {
  return ISSUE_LIBRARY[id];
}

/** Severity display config used by components */
export const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    badge: 'Must fix for EAA compliance',
    textClass: 'text-fail',
    bgClass: 'bg-fail/10',
    borderClass: 'border-fail/30',
  },
  'should-fix': {
    label: 'Should Fix',
    badge: 'Required for full EAA compliance',
    textClass: 'text-warn',
    bgClass: 'bg-warn/10',
    borderClass: 'border-warn/30',
  },
  'nice-to-have': {
    label: 'Nice to Have',
    badge: 'Improves experience for all users',
    textClass: 'text-blue-400',
    bgClass: 'bg-blue-400/10',
    borderClass: 'border-blue-400/30',
  },
} as const;
