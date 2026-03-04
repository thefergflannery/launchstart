import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement — A11YO',
  description: 'A11YO accessibility statement and commitment to WCAG 2.2 AA compliance.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-lc-bg flex flex-col">
      <header className="border-b border-lc-border bg-lc-bg/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-sm font-bold text-lc-fg hover:text-lc-accent transition-colors">
            A11YO
          </Link>
          <Link href="/" className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <span className="font-mono text-xs uppercase tracking-widest text-lc-accent block mb-4">
            Accessibility
          </span>
          <h1 className="text-4xl font-display font-semibold text-lc-fg mb-2">
            Accessibility Statement
          </h1>
          <p className="font-mono text-xs text-lc-muted mb-12">Last updated: March 2026</p>

          <div className="space-y-10 text-lc-muted leading-relaxed">

            <section aria-labelledby="commitment-heading">
              <h2 id="commitment-heading" className="text-lc-fg font-semibold text-lg mb-3">Our commitment</h2>
              <p>
                A11YO is an accessibility auditing tool. We are committed to ensuring our own
                product meets the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA.
                We run our own scanner on ourselves and publish the results here.
              </p>
            </section>

            <section aria-labelledby="conformance-heading">
              <h2 id="conformance-heading" className="text-lc-fg font-semibold text-lg mb-3">Conformance status</h2>
              <p>
                A11YO is <strong className="text-lc-fg">partially conformant</strong> with WCAG 2.2 Level AA.
                Partially conformant means that some parts of the content do not fully conform to the
                accessibility standard. We are actively working to resolve known issues.
              </p>
            </section>

            <section aria-labelledby="measures-heading">
              <h2 id="measures-heading" className="text-lc-fg font-semibold text-lg mb-3">Measures taken</h2>
              <ul className="space-y-2 list-none">
                {[
                  'Semantic HTML5 landmarks on every page (header, main, footer, nav)',
                  'Skip-to-main-content link at the top of every page (SC 2.4.1)',
                  'Visible focus indicators on all interactive elements (SC 2.4.7)',
                  'Colour contrast ratios ≥ 4.5:1 for normal text (SC 1.4.3)',
                  'All images include descriptive alt attributes (SC 1.1.1)',
                  'Error messages associated with form fields via aria-describedby (SC 3.3.1)',
                  'Status messages use role="alert" (SC 4.1.3)',
                  'Keyboard navigation tested across all major browsers',
                  'Screen reader tested with VoiceOver (macOS) and NVDA (Windows)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pass flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="known-issues-heading">
              <h2 id="known-issues-heading" className="text-lc-fg font-semibold text-lg mb-3">Known limitations</h2>
              <ul className="space-y-2 list-none">
                {[
                  'Report charts do not yet include text alternatives (fix in progress)',
                  'Some third-party embedded content may not meet AA',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="feedback-heading">
              <h2 id="feedback-heading" className="text-lc-fg font-semibold text-lg mb-3">Feedback and contact</h2>
              <p>
                If you experience any accessibility barriers on A11YO, please contact us at{' '}
                <a
                  href="mailto:a11y@a11yo.io"
                  className="text-lc-accent underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lc-accent rounded-sm"
                >
                  a11y@a11yo.io
                </a>
                . We aim to respond within 2 business days.
              </p>
            </section>

            <section aria-labelledby="enforcement-heading">
              <h2 id="enforcement-heading" className="text-lc-fg font-semibold text-lg mb-3">Enforcement</h2>
              <p>
                If you are not satisfied with our response, you may contact the relevant national
                enforcement authority in your country. In the EU, this is typically the national
                monitoring body responsible for implementing the Web Accessibility Directive.
              </p>
            </section>

          </div>
        </div>
      </main>

      <footer className="border-t border-lc-border px-6 py-5 mt-16">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-lc-muted">A11YO</span>
          <Link href="/pricing" className="font-mono text-xs text-lc-muted hover:text-lc-fg transition-colors">
            Pricing
          </Link>
        </div>
      </footer>
    </div>
  );
}
