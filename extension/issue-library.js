// A11YO Plain English Issue Library
// Extracted from lib/issue-library.ts — keep in sync with the web app.

const ISSUE_LIBRARY = {
  'image-alt': {
    severity: 'critical',
    title: 'Images have no text description for screen readers',
    means: 'A blind person using a screen reader will hear nothing when they reach these images — they have no idea what the image shows or where it links to.',
    fix: 'Each image needs a short text description added in the code, called an alt attribute. If an image is purely decorative, mark it with alt="" so screen readers skip it.',
    wcag: 'WCAG 2.2 — 1.1.1 Non-text Content (Level A)',
  },
  'form-labels': {
    severity: 'critical',
    title: 'Form fields have no labels for screen reader users',
    means: 'A person using a screen reader cannot tell what information a form field is asking for — they will hear something like "edit text" with no context.',
    fix: 'Every input field needs a visible label connected to it in the code. Your developer should add a <label for="..."> element paired with each input.',
    wcag: 'WCAG 2.2 — 1.3.1 Info and Relationships (Level A), 3.3.2 Labels or Instructions (Level A)',
  },
  'color-contrast': {
    severity: 'should-fix',
    title: 'Text may be too difficult to read on its background',
    means: 'People with low vision or colour blindness may struggle to read text that does not have enough contrast against its background.',
    fix: 'Check your text and background colour combinations using WebAIM Contrast Checker. Normal-sized text needs a ratio of at least 4.5:1.',
    wcag: 'WCAG 2.2 — 1.4.3 Contrast (Minimum) (Level AA)',
  },
  'title-lang': {
    severity: 'critical',
    title: 'Page is missing a title or language declaration',
    means: 'Screen readers announce the page title when a person arrives — without it, they have no idea where they have landed. The language declaration tells screen readers which language to read in.',
    fix: 'Add a <title> tag inside the <head> of your HTML. Also add lang="en" to the opening <html> tag.',
    wcag: 'WCAG 2.2 — 2.4.2 Page Titled (Level A), 3.1.1 Language of Page (Level A)',
  },
  'aria-errors': {
    severity: 'critical',
    title: 'Accessibility code contains errors that break screen readers',
    means: 'Your website uses accessibility attributes incorrectly. Instead of helping, these errors can confuse or break screen readers.',
    fix: 'Your developer should review the ARIA role values used on the page and correct any that are invalid.',
    wcag: 'WCAG 2.2 — 4.1.2 Name, Role, Value (Level A)',
  },
  'heading-structure': {
    severity: 'should-fix',
    title: 'Headings are in the wrong order or missing',
    means: 'Screen reader users navigate pages by jumping between headings. When headings are in the wrong order or missing, this navigation breaks.',
    fix: 'Make sure your page has exactly one H1 heading. Subheadings should follow in order: H2, then H3 under each H2, and so on.',
    wcag: 'WCAG 2.2 — 1.3.1 Info and Relationships (Level A)',
  },
  'keyboard-focus': {
    severity: 'critical',
    title: 'Parts of this page may be unreachable without a mouse',
    means: 'People who use a keyboard instead of a mouse need to reach every part of a page by pressing the Tab key.',
    fix: 'Remove any positive tabindex values. Add a skip link at the top of the page pointing to the main content area with href="#main-content".',
    wcag: 'WCAG 2.2 — 2.1.1 Keyboard (Level A), 2.4.1 Bypass Blocks (Level A)',
  },
  'meta-description': {
    severity: 'should-fix',
    title: 'No description found for search engines',
    means: 'Search engines use the meta description to show a summary of your page in search results. Without one, Google picks any text from the page.',
    fix: 'Add a <meta name="description" content="Your summary here"> tag inside the <head> of your HTML. Keep it between 120 and 155 characters.',
    wcag: 'Not a WCAG requirement — SEO best practice',
  },
  'og-image': {
    severity: 'nice-to-have',
    title: 'No image set for social media sharing',
    means: 'When someone shares your page on LinkedIn, Twitter, or Facebook, no preview image will appear alongside the link.',
    fix: 'Add a <meta property="og:image" content="https://yoursite.com/share-image.jpg"> tag to your HTML <head>.',
    wcag: 'Not a WCAG requirement — social sharing best practice',
  },
  'og-title': {
    severity: 'nice-to-have',
    title: 'No custom title set for social media sharing',
    means: 'When someone shares your page on social media, the title shown will fall back to your page\'s main title rather than a custom headline.',
    fix: 'Add a <meta property="og:title" content="Your headline here"> tag to your HTML <head>.',
    wcag: 'Not a WCAG requirement — social sharing best practice',
  },
  'viewport': {
    severity: 'should-fix',
    title: 'Mobile display is not configured correctly',
    means: 'Without a correct viewport setting, your site may appear zoomed out on mobile phones and be nearly impossible to read or tap.',
    fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> inside the <head> of your HTML.',
    wcag: 'WCAG 2.2 — 1.4.4 Resize Text (Level AA)',
  },
  'https': {
    severity: 'critical',
    title: 'Site is not using a secure connection',
    means: 'Your website is using HTTP instead of HTTPS, meaning information sent between your visitors and your site is unencrypted.',
    fix: 'Contact your hosting provider to enable an SSL certificate and set up a redirect from all HTTP addresses to HTTPS.',
    wcag: 'Not a WCAG requirement — security requirement',
  },
  'robots-txt': {
    severity: 'nice-to-have',
    title: 'No robots.txt file found',
    means: 'Search engines use robots.txt to understand which parts of your site they are allowed to crawl and index.',
    fix: 'Create a plain text file called robots.txt in the root of your website with "User-agent: *" and "Allow: /".',
    wcag: 'Not a WCAG requirement — SEO best practice',
  },
  'sitemap': {
    severity: 'nice-to-have',
    title: 'No sitemap found for search engines',
    means: 'A sitemap tells search engines about every page on your site, helping them find and index your content.',
    fix: 'Create a sitemap.xml file in the root of your website. Most platforms can generate this automatically with a plugin.',
    wcag: 'Not a WCAG requirement — SEO best practice',
  },
  'load-time': {
    severity: 'should-fix',
    title: 'Page took a long time to load',
    means: 'A slow-loading page frustrates all visitors and is particularly difficult for people on slow internet connections.',
    fix: 'Common causes are large uncompressed images and too many scripts loading at the same time. Run a Google PageSpeed Insights check for specifics.',
    wcag: 'Not a direct WCAG requirement — performance best practice',
  },
  'broken-links': {
    severity: 'should-fix',
    title: 'Broken links found on this page',
    means: 'Some links on your page lead to pages that no longer exist. Broken links create a dead end for visitors.',
    fix: 'Identify and fix or remove links that lead to missing pages (returning a 404 error).',
    wcag: 'Not a direct WCAG requirement — usability best practice',
  },
  'mobile-viewport': {
    severity: 'should-fix',
    title: 'Mobile display is not configured correctly',
    means: 'Without a correct mobile viewport setting, your site may appear zoomed out on phones and be nearly impossible to read or use.',
    fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> inside the <head> of your HTML.',
    wcag: 'WCAG 2.2 — 1.4.4 Resize Text (Level AA)',
  },
};

const SEVERITY_DOT = {
  critical: 'dot-critical',
  'should-fix': 'dot-should',
  'nice-to-have': 'dot-nice',
};

const SEVERITY_ORDER = ['critical', 'should-fix', 'nice-to-have'];
