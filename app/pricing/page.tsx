import Link from 'next/link';
import type { Metadata } from 'next';
import CheckoutButton from './CheckoutButton';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

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
    q: 'What does a Pro report include?',
    a: 'A one-time payment gives you all 17 checks, multi-page crawl, AI alt text generator, and a PDF export for client delivery.',
  },
  {
    q: 'Is it a subscription?',
    a: 'No. Pro is a one-off payment per report — no recurring charges, no cancellation needed.',
  },
  {
    q: 'Is there a money-back guarantee?',
    a: 'Yes. If your report fails to generate we\'ll refund you in full, no questions asked.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav links={PAGE_NAV_LINKS} cta={{ href: '/', label: 'Full audit →' }} />

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
            <div className="bg-black p-8 flex flex-col border border-green/20" style={{ boxShadow: '0 0 40px -8px rgba(0,233,106,0.12)' }}>
              <div className="mb-8 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs tracking-widest uppercase text-green block">Pro</span>
                  <span className="font-mono text-[10px] border border-green/30 text-green px-2 py-0.5 uppercase tracking-wider">
                    One-time report
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-display font-semibold text-white">€29</span>
                  <span className="text-secondary text-sm">/ report</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  Pay once. Full 17-check audit with shareable PDF report — no subscription.
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

      <SiteFooter />
    </div>
  );
}
