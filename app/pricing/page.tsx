import Link from 'next/link';
import type { Metadata } from 'next';
import CheckoutButton from './CheckoutButton';

export const metadata: Metadata = { title: 'Pricing — A11YO' };

const FREE_FEATURES = [
  'Single-page scan only',
  '5 checks (accessibility, SEO, load time)',
  'Shareable report URL',
  'Pass / amber / fail with fix hints',
];

const PRO_FEATURES = [
  'Everything in Free',
  'All 17 checks per scan',
  'Up to 50 pages per scan (crawl)',
  'AI Alt Text Generator',
  'Scheduled weekly scans + email diff',
  'PDF export for client delivery',
];

const AGENCY_FEATURES = [
  'Everything in Pro',
  'Unlimited scans per day',
  'Multi-site comparison reports',
  'White-label report branding',
  'Priority scan queue',
  'Team seats (coming soon)',
];

const FAQ = [
  {
    q: 'Do I need a credit card for Free?',
    a: 'No. Single-page scans are free forever — no account or card required.',
  },
  {
    q: 'What happens when I upgrade?',
    a: 'You get immediate access to all 17 checks, multi-page crawl, and the AI alt text generator.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. Cancel from your account settings and your plan reverts to Free at the end of the billing period.',
  },
  {
    q: 'Is there a trial?',
    a: 'Sign up free and run up to 5 scans per day. Pro and Agency plans have a 7-day money-back guarantee.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-sm font-bold text-white hover:text-green transition-colors"
          >
            A11YO
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-mono text-xs text-secondary hover:text-white transition-colors uppercase tracking-wider">
              Dashboard
            </Link>
            <Link
              href="/"
              className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 py-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-widest uppercase text-green block mb-4">
              Pricing
            </span>
            <h1 className="text-5xl font-display font-semibold text-white tracking-tight mb-4">
              Simple, honest pricing.
            </h1>
            <p className="text-secondary text-lg max-w-md mx-auto">
              Start free. Upgrade when you need all 17 checks, multi-page crawls, and AI tools.
            </p>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border mb-20">

            {/* Free */}
            <div className="bg-black p-8 flex flex-col">
              <div className="mb-8 flex-1">
                <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Free</span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-display font-semibold text-white">€0</span>
                  <span className="text-secondary text-sm">forever</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  No account required. Paste and scan instantly.
                </p>
                <ul className="space-y-3">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-mid flex-shrink-0" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/"
                className="block text-center font-mono text-sm tracking-wider uppercase border border-border px-6 py-3 text-white hover:border-white transition-colors"
              >
                Start scanning →
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-surface p-8 flex flex-col border-t-2 border-green">
              <div className="mb-8 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs tracking-widest uppercase text-green block">Pro</span>
                  <span className="font-mono text-xs bg-green text-black px-2 py-0.5 uppercase tracking-wider font-semibold">
                    Popular
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-display font-semibold text-white">€29</span>
                  <span className="text-secondary text-sm">/ month</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  For freelancers and agencies shipping client sites.
                </p>
                <ul className="space-y-3">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <CheckoutButton plan="pro" label="Upgrade to Pro →" />
            </div>

            {/* Agency */}
            <div className="bg-black p-8 flex flex-col">
              <div className="mb-8 flex-1">
                <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Agency</span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-display font-semibold text-white">€79</span>
                  <span className="text-secondary text-sm">/ month</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  For teams with multiple clients and high scan volume.
                </p>
                <ul className="space-y-3">
                  {AGENCY_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <CheckoutButton plan="agency" label="Upgrade to Agency →" />
            </div>

          </div>

          {/* FAQ */}
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-green block mb-8">FAQ</span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
              {FAQ.map((item) => (
                <div key={item.q} className="bg-black p-7">
                  <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-border px-6 py-5 mt-16">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-secondary">A11YO</span>
          <Link href="/accessibility" className="font-mono text-xs text-secondary hover:text-white transition-colors">
            Accessibility statement
          </Link>
        </div>
      </footer>
    </div>
  );
}
