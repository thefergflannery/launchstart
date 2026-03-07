import Link from 'next/link';
import type { Metadata } from 'next';
import CheckoutButton from './CheckoutButton';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = { title: 'Pricing — A11YO' };

const FREE_FEATURES = [
  '3 scans per day, no account needed',
  'All 17 accessibility, SEO & launch checks',
  'Plain English report with fix instructions',
  'Shareable report URL',
  'PDF export',
];

const PRO_FEATURES = [
  'Everything in Free',
  '20 single-page scans per day',
  'Scan history — all reports saved',
  'Plain English issue cards with WCAG refs',
  'PDF export for developer handoff',
  'Chrome extension access',
];

const AGENCY_FEATURES = [
  'Everything in Pro',
  'Full site crawl — up to 50 pages per scan',
  '50 scans per day',
  'Multi-page compliance score',
  'Priority support',
];

const FAQ = [
  {
    q: 'Do I need an account to scan?',
    a: 'No. You can run up to 3 scans per day without an account. Create a free account and upgrade to save your history and run more scans.',
  },
  {
    q: 'What is the difference between Pro and Full Site?',
    a: 'Pro scans a single page at a time — perfect for checking specific pages or ongoing monitoring. Full Site crawls up to 50 pages in one go and gives you a site-wide compliance score.',
  },
  {
    q: 'Can I use the Chrome extension?',
    a: 'Yes — the Chrome extension is included with a Pro or Full Site subscription. It lets you scan any page you are browsing without leaving the tab.',
  },
  {
    q: 'Is there a money-back guarantee?',
    a: 'Yes. If you are not satisfied in the first 7 days, contact us and we will refund you in full, no questions asked.',
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
              Start free — no account needed. Upgrade for scan history, the Chrome extension, and full-site crawls.
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
                  No account required. Paste any URL and scan instantly.
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
                    Most popular
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-display font-semibold text-white">€5</span>
                  <span className="text-secondary text-sm">/ month</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  Single-page scans with full history, PDF export, and Chrome extension.
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
              <CheckoutButton plan="pro" label="Get Pro — €5/month →" />
            </div>

            {/* Full Site */}
            <div className="bg-black p-8 flex flex-col">
              <div className="mb-8 flex-1">
                <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-3">Full Site</span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-display font-semibold text-white">€15</span>
                  <span className="text-secondary text-sm">/ month</span>
                </div>
                <p className="text-secondary text-sm mb-6">
                  Crawl your entire site and get a single compliance score across all pages.
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
              <CheckoutButton plan="agency" label="Get Full Site — €15/month →" />
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
