import type { Metadata } from 'next';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Accessibility Statement — A11YO',
  description: 'A11YO accessibility statement and commitment to WCAG 2.2 AA compliance.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav links={PAGE_NAV_LINKS} />

      <main id="main-content" className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <span className="font-mono text-xs uppercase tracking-widest text-green block mb-4">
            Accessibility
          </span>
          <h1 className="text-4xl font-display font-semibold text-white mb-2">
            Accessibility Statement
          </h1>
          <p className="font-mono text-xs text-secondary mb-12">Last updated: March 2026</p>

          <div className="space-y-10 text-secondary leading-relaxed">

            <section aria-labelledby="commitment-heading">
              <h2 id="commitment-heading" className="text-white font-semibold text-lg mb-3">Our commitment</h2>
              <p>
                A11YO is an accessibility auditing tool. We are committed to ensuring our own
                product meets the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA.
                We run our own scanner on ourselves and publish the results here.
              </p>
            </section>

            <section aria-labelledby="conformance-heading">
              <h2 id="conformance-heading" className="text-white font-semibold text-lg mb-3">Conformance status</h2>
              <p>
                A11YO is <strong className="text-white">partially conformant</strong> with WCAG 2.2 Level AA.
                Partially conformant means that some parts of the content do not fully conform to the
                accessibility standard. We are actively working to resolve the known limitations listed
                below.
              </p>
            </section>

            <section aria-labelledby="measures-heading">
              <h2 id="measures-heading" className="text-white font-semibold text-lg mb-3">Measures taken</h2>
              <ul className="space-y-2 list-none">
                {[
                  'Skip-to-main-content link at the top of every page (SC 2.4.1)',
                  'lang="en" declared on the html element (SC 3.1.1)',
                  'Semantic HTML5 landmarks on every page — header, main, footer, nav (SC 1.3.1)',
                  '3 px green (#00E96A) focus outline on all interactive elements, 12.8:1 contrast on dark backgrounds (SC 2.4.7, SC 2.4.13)',
                  'Colour contrast ratios verified ≥ 4.5:1 for all normal-sized text (SC 1.4.3)',
                  'Heading hierarchy h1 → h2 → h3 maintained throughout (SC 1.3.1)',
                  'prefers-reduced-motion respected — animations disabled when user preference is set (SC 2.3.3)',
                  'SC 2.4.11 Focus Not Obscured — scroll-margin-top: 4rem prevents the 56 px sticky header from obscuring any focused element',
                  'SC 2.5.8 Target Size — all interactive targets meet the 24 × 24 CSS px minimum; nav links padded to 44 px touch targets',
                  'autocomplete attributes on all authentication form inputs (SC 1.3.5)',
                  'aria-invalid and aria-describedby on all form fields that surface validation errors (SC 3.3.1, SC 4.1.2)',
                  'Error messages use role="alert" so screen readers announce them immediately (SC 4.1.3)',
                  'Loading status messages in scan forms use aria-live="polite" (SC 4.1.3)',
                  'Visible labels or sr-only labels on every form input (SC 3.3.2)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-mid flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="known-issues-heading">
              <h2 id="known-issues-heading" className="text-white font-semibold text-lg mb-3">Known limitations</h2>
              <ul className="space-y-2 list-none">
                {[
                  'Report page score visualisation has no text alternative for the graphic — fix in progress (SC 1.1.1)',
                  'AI-generated alt text suggestions are provided as a starting point and require human review before use (advisory)',
                  'Some third-party content loaded during page scans may not meet WCAG 2.2 AA',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warn flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="feedback-heading">
              <h2 id="feedback-heading" className="text-white font-semibold text-lg mb-3">Feedback and contact</h2>
              <p>
                If you experience any accessibility barriers on A11YO, please contact us at{' '}
                <a
                  href="mailto:a11y@a11yo.com"
                  className="text-green underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green rounded-sm"
                >
                  a11y@a11yo.com
                </a>
                . We aim to respond within 2 business days.
              </p>
            </section>

            <section aria-labelledby="enforcement-heading">
              <h2 id="enforcement-heading" className="text-white font-semibold text-lg mb-3">Enforcement</h2>
              <p>
                If you are not satisfied with our response, you may contact the relevant national
                enforcement authority in your country. In the EU, this is typically the national
                monitoring body responsible for implementing the Web Accessibility Directive.
              </p>
            </section>

          </div>
        </div>
      </main>

      <SiteFooter maxWidth="max-w-3xl" />
    </div>
  );
}
