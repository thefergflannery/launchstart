import Link from 'next/link';
import type { Metadata } from 'next';
import CheckoutButton from './CheckoutButton';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = { title: 'Pricing — A11YO' };

const FREE_FEATURES = [
  '1 scan per day, no account needed',
  'All accessibility, SEO & launch checks',
  'Plain English report with fix instructions',
  'Shareable report URL',
];

const ONCEOFF_FEATURES = [
  'Everything in Free',
  '10 scans per day',
  'Scan history — reports saved to dashboard',
  'PDF export for developer handoff',
];

const RECURRING_FEATURES = [
  'Everything in Action Plan',
  '20 scans per day',
  'Score trend chart — track progress over time',
  'Chrome extension access',
  'Delta badge — see improvement scan-to-scan',
];

const AGENCY_FEATURES = [
  'Everything in Recurring',
  'Unlimited scans per day',
  'Full site crawl — up to 50 pages per scan',
  'Multi-page compliance score',
  'Priority support',
];

const FAQ = [
  {
    q: 'Do I need an account to scan?',
    a: 'No. You can run 1 scan per day without an account. Create a free account and upgrade to save your history and run more scans.',
  },
  {
    q: 'What is the Action Plan?',
    a: 'A one-time €10 payment that gives you 10 scans per day and full scan history saved to your dashboard. No subscription required — pay once, keep access.',
  },
  {
    q: 'What is the difference between Recurring and Agency?',
    a: 'Recurring is for developers and site owners monitoring a handful of pages. Agency unlocks unlimited scans and a full site crawl that audits up to 50 pages in one go.',
  },
  {
    q: 'Is there a money-back guarantee?',
    a: 'Yes. If you are not satisfied in the first 7 days, contact us and we will refund you in full, no questions asked.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav links={PAGE_NAV_LINKS} cta={{ href: '/', label: 'Audit →' }} />

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
              Start free — no account needed. Upgrade for scan history, score trends, and full-site crawls.
            </p>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-px bg-border mb-20">

            {/* Free */}
            <div className="bg-black p-7 flex flex-col">
              <div className="mb-8 flex-1">
                <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Free</span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-display font-semibold text-white">€0</span>
                  <span className="text-secondary text-sm">forever</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  No account required. Paste any URL and scan instantly.
                </p>
                <ul className="space-y-3">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-border flex-shrink-0" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/"
                className="block text-center font-mono text-xs tracking-wider uppercase border border-border px-4 py-3 text-white hover:border-white transition-colors"
              >
                Start scanning →
              </Link>
            </div>

            {/* Action Plan */}
            <div className="bg-black p-7 flex flex-col">
              <div className="mb-8 flex-1">
                <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Action Plan</span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-display font-semibold text-white">€10</span>
                  <span className="text-secondary text-sm">one-time</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  A PDF action plan to hand to your developer. One payment, no subscription.
                </p>
                <ul className="space-y-3">
                  {ONCEOFF_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-mid flex-shrink-0" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <CheckoutButton plan="onceoff" label="Get Action Plan — €10 →" />
            </div>

            {/* Recurring */}
            <div className="bg-black p-7 flex flex-col border border-green/20" style={{ boxShadow: '0 0 40px -8px rgba(0,233,106,0.12)' }}>
              <div className="mb-8 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs tracking-widest uppercase text-green block">Recurring</span>
                  <span className="font-mono text-[10px] border border-green/30 text-green px-2 py-0.5 uppercase tracking-wider">
                    Popular
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-display font-semibold text-white">€29</span>
                  <span className="text-secondary text-sm">/ month</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  Ongoing monitoring with score trends and Chrome extension.
                </p>
                <ul className="space-y-3">
                  {RECURRING_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <CheckoutButton plan="recurring" label="Get Recurring — €29/mo →" />
            </div>

            {/* Agency */}
            <div className="bg-black p-7 flex flex-col">
              <div className="mb-8 flex-1">
                <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Agency</span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-display font-semibold text-white">€99</span>
                  <span className="text-secondary text-sm">/ month</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  Full site crawls and unlimited scans for agencies.
                </p>
                <ul className="space-y-3">
                  {AGENCY_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <CheckoutButton plan="agency" label="Get Agency — €99/mo →" />
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
