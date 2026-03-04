import Link from 'next/link';

const FREE_FEATURES = [
  'Single-page scan',
  '17 checks — accessibility, SEO, launch readiness',
  'Shareable report URL',
  'Pass / amber / fail per check with fix hints',
  'Powered by axe-core + Puppeteer',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Multi-page crawl — up to 50 pages per scan',
  'Multi-site comparison reports',
  'AI Alt Text Generator (Claude-powered)',
  'Scheduled weekly scans with email diff',
  'PDF export for client delivery',
  'White-label report branding',
  'Priority scan queue',
];

const FAQ = [
  {
    q: 'When is Pro launching?',
    a: 'We are building the paid tier now. Join the waitlist to be notified first and lock in the launch price.',
  },
  {
    q: 'Will the free tier stay free?',
    a: 'Yes. Single-page scans with shareable reports will always be free — no account required.',
  },
  {
    q: 'How does multi-page crawl work?',
    a: 'Pro scans follow internal links from your starting URL and runs the full 17-check audit on each page, then rolls up a site-wide report.',
  },
  {
    q: 'What does multi-site comparison do?',
    a: 'Enter two or more URLs and get a side-by-side breakdown of scores across all three categories — useful for auditing competitors or client sites.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-lc-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-lc-border bg-lc-bg/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm tracking-widest uppercase text-lc-fg hover:text-lc-purple transition-colors"
          >
            A11YO
          </Link>
          <Link
            href="/"
            className="font-mono text-xs tracking-wider uppercase text-lc-muted hover:text-lc-fg transition-colors"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="flex-1 py-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-4">
              Pricing
            </span>
            <h1 className="text-5xl font-semibold text-lc-fg tracking-tight mb-4">
              Simple, honest pricing.
            </h1>
            <p className="text-lc-muted text-lg max-w-md mx-auto">
              Start free. Upgrade when you need multi-page crawls,
              AI tools, and scheduled scans.
            </p>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-lc-border mb-20">

            {/* Free */}
            <div className="bg-lc-bg p-10">
              <div className="mb-8">
                <span className="font-mono text-xs tracking-widest uppercase text-lc-muted block mb-3">
                  Free
                </span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-semibold text-lc-fg font-mono">£0</span>
                  <span className="text-lc-muted text-sm">forever</span>
                </div>
                <p className="text-lc-muted text-sm">
                  No account. No credit card. Just paste and scan.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pass flex-shrink-0" />
                    <span className="text-lc-muted text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/"
                className="block text-center font-mono text-sm tracking-wider uppercase border border-lc-border px-6 py-3.5 text-lc-fg hover:border-lc-fg transition-colors"
              >
                Start scanning →
              </Link>
            </div>

            {/* Pro */}
            <div className="corner-mark bg-lc-fg p-10">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block">
                    Pro
                  </span>
                  <span className="font-mono text-xs bg-lc-purple text-white px-2 py-0.5 uppercase tracking-wider">
                    Coming soon
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-semibold text-lc-bg font-mono">£29</span>
                  <span className="text-lc-bg/60 text-sm">/ month</span>
                </div>
                <p className="text-lc-bg/60 text-sm">
                  For agencies, freelancers, and teams shipping regularly.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-lc-purple flex-shrink-0" />
                    <span className="text-lc-bg/80 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:hello@a11yo.io?subject=Pro waitlist"
                className="block text-center font-mono text-sm tracking-wider uppercase border border-lc-purple px-6 py-3.5 text-lc-purple hover:bg-lc-purple hover:text-white transition-colors"
              >
                Join waitlist →
              </a>
            </div>

          </div>

          {/* FAQ */}
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-lc-purple block mb-8">
              FAQ
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-lc-border">
              {FAQ.map((item) => (
                <div key={item.q} className="bg-lc-bg p-7">
                  <h3 className="text-lc-fg font-semibold mb-2">{item.q}</h3>
                  <p className="text-lc-muted text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-lc-border px-6 py-5 bg-lc-card mt-16">
        <div className="max-w-5xl mx-auto text-center">
          <span className="font-mono text-xs text-lc-muted">
            Powered by A11YO
          </span>
        </div>
      </footer>
    </div>
  );
}
