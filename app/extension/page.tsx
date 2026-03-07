import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import WaitlistForm from '@/components/WaitlistForm';
import { PassIcon, SparkleIcon } from '@/components/Icons';

export const metadata = {
  title: 'Chrome Extension — A11YO | Accessibility Audits in Your Browser',
  description: 'The A11YO Chrome extension runs a full accessibility and launch-readiness audit on any page you\'re viewing — staging, production, or a client\'s live site. Results in seconds, shareable report in one click.',
};

const FEATURES = [
  {
    title: 'One click on any page',
    desc: 'No copy-pasting URLs. Click the A11YO icon while you\'re on any page — staging, production, or a client\'s live site.',
  },
  {
    title: 'Full 17-check audit in seconds',
    desc: 'The same accessibility, SEO, and launch-readiness checks as the web app — running right from your browser toolbar.',
  },
  {
    title: 'Plain English results, no jargon',
    desc: 'Every issue is explained in plain English with a one-line fix instruction. No WCAG codes unless you ask for them.',
  },
  {
    title: 'Guest scan — no account needed',
    desc: 'Try it immediately. One free scan every 30 minutes with no sign-in required. Create an account to save results.',
  },
  {
    title: 'Shareable report link',
    desc: 'Logged-in users get a full shareable report URL — perfect for sending to a developer or a client.',
  },
  {
    title: 'Works on local dev servers',
    desc: 'Test accessibility before you deploy. The extension works on localhost and any staging URL your browser can reach.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Install the extension',
    desc: 'Add A11YO to Chrome from the Web Store. Takes 10 seconds.',
  },
  {
    n: '02',
    title: 'Open any page',
    desc: 'Navigate to any website — your own, a client\'s, or a staging URL. No copy-pasting.',
  },
  {
    n: '03',
    title: 'Click the A11YO icon',
    desc: 'A full accessibility audit runs instantly. Issues are listed in plain English with fix instructions.',
  },
];

const FAQ = [
  {
    q: 'Does it work without an account?',
    a: 'Yes. Guest mode gives you one free scan every 30 minutes — no sign-in required. Create a free account to unlock unlimited scans and save your report history.',
  },
  {
    q: 'Which plan includes the extension?',
    a: 'The extension is included with the Pro plan (€5/month). Guest mode is free with no account needed.',
  },
  {
    q: 'Does it work on local dev servers?',
    a: 'Yes — any URL your browser can reach, including localhost, 127.0.0.1, and staging domains.',
  },
  {
    q: 'Which browsers are supported?',
    a: 'Chrome and all Chromium-based browsers (Edge, Brave, Arc). Firefox support is planned.',
  },
  {
    q: 'Can I share results with a client?',
    a: 'Yes. Logged-in users get a full shareable report URL that opens in the A11YO web app — ideal for client handoff.',
  },
];

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav
        links={[
          ...PAGE_NAV_LINKS,
          { href: '/extension', label: 'Extension', hideBelow: 'sm' },
        ]}
        cta={{ href: '/#scan', label: 'Try web app →' }}
      />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="grid-bg border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-24 lg:py-36">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Copy */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-xs tracking-widest uppercase text-green">Chrome Extension</span>
                  <span className="font-mono text-[10px] border border-green/30 text-green/70 px-2 py-0.5 uppercase tracking-wider">Beta</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-display font-extrabold text-white leading-none tracking-tight mb-6">
                  Audit any page.<br />
                  Right from<br />
                  <span className="text-green">your browser.</span>
                </h1>
                <p className="text-secondary text-lg leading-relaxed mb-10 max-w-lg">
                  Click the A11YO icon while you&apos;re on any page. A full accessibility, SEO, and launch-readiness audit runs in seconds — plain English results, shareable report, no copy-pasting.
                </p>

                <div className="mb-6">
                  <p className="font-mono text-xs text-secondary mb-3 uppercase tracking-wider">Get notified at Chrome Web Store launch</p>
                  <WaitlistForm placeholder="your@email.com" />
                </div>

                <p className="font-mono text-xs text-secondary">
                  Already have an account?{' '}
                  <a href="/auth/login" className="text-green hover:underline">Sign in →</a>
                  {' '}·{' '}
                  <a href="/pricing" className="text-secondary hover:text-white">See pricing →</a>
                </p>
              </div>

              {/* Extension popup mockup */}
              <div className="relative">
                <div className="border border-border bg-black" style={{ width: 320, maxWidth: '100%' }}>
                  {/* Popup header */}
                  <div className="border-b border-border px-4 py-3 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white">A11<span className="text-green">YO</span></span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-green uppercase tracking-wider">Scan complete</span>
                    </div>
                  </div>

                  {/* Score row */}
                  <div className="px-4 py-4 border-b border-border flex items-center justify-between">
                    <div>
                      <div className="font-mono text-3xl font-bold text-green">78</div>
                      <div className="font-mono text-[10px] text-secondary uppercase tracking-wider">compliance score</div>
                    </div>
                    <div className="flex gap-4 text-right">
                      <div>
                        <div className="font-mono text-lg font-bold text-red-400">2</div>
                        <div className="font-mono text-[9px] text-secondary uppercase tracking-wider">Critical</div>
                      </div>
                      <div>
                        <div className="font-mono text-lg font-bold text-amber-400">3</div>
                        <div className="font-mono text-[9px] text-secondary uppercase tracking-wider">Should Fix</div>
                      </div>
                      <div>
                        <div className="font-mono text-lg font-bold text-secondary">1</div>
                        <div className="font-mono text-[9px] text-secondary uppercase tracking-wider">Nice to have</div>
                      </div>
                    </div>
                  </div>

                  {/* Issue cards */}
                  <div className="divide-y divide-border">
                    {[
                      { label: 'Images have no text description', sev: 'CRITICAL', color: 'text-red-400 bg-red-400/10' },
                      { label: 'Form fields have no labels', sev: 'CRITICAL', color: 'text-red-400 bg-red-400/10' },
                      { label: 'Text may be hard to read', sev: 'SHOULD FIX', color: 'text-amber-400 bg-amber-400/10' },
                      { label: 'No meta description found', sev: 'SHOULD FIX', color: 'text-amber-400 bg-amber-400/10' },
                    ].map((item) => (
                      <div key={item.label} className="px-4 py-3 flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-white leading-snug flex-1">{item.label}</span>
                        <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${item.color}`}>
                          {item.sev}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border px-4 py-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-green cursor-pointer hover:underline">View full report →</span>
                    <span className="font-mono text-[10px] text-secondary cursor-pointer hover:text-white">Scan again</span>
                  </div>
                </div>

                {/* Glow */}
                <div className="absolute -inset-px bg-green/5 -z-10 blur-2xl pointer-events-none" aria-hidden="true" />
              </div>

            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-b border-border py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">How it works</span>
              <h2 className="text-3xl font-semibold text-white tracking-tight">Three steps to a browser audit</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {STEPS.map((step) => (
                <div key={step.n} className="bg-black p-8">
                  <span className="font-mono text-xs tracking-widest text-green block mb-6">{step.n}</span>
                  <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-b border-border py-20 bg-surface">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Features</span>
              <h2 className="text-3xl font-semibold text-white tracking-tight">Everything you need, in your toolbar</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-black p-7">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="mt-0.5 flex-shrink-0 text-green"><PassIcon size={13} /></span>
                    <h3 className="text-white font-semibold text-sm leading-snug">{f.title}</h3>
                  </div>
                  <p className="text-secondary text-sm leading-relaxed pl-6">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing callout ── */}
        <section className="border-b border-border py-20 grid-bg">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">

              {/* Free / Guest */}
              <div className="bg-black p-10">
                <span className="font-mono text-xs tracking-widest uppercase text-secondary block mb-4">Guest mode</span>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-mono text-4xl font-semibold text-white">Free</span>
                </div>
                <p className="text-secondary text-sm mb-6 leading-relaxed">No account. No sign-in. One scan every 30 minutes — try it immediately.</p>
                <ul className="space-y-3 mb-8">
                  {[
                    'One scan every 30 minutes',
                    'All 17 accessibility checks',
                    'Plain English issue explanations',
                    'Results shown in popup',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 text-green-mid"><PassIcon size={13} /></span>
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#notify" className="block text-center font-mono text-sm tracking-wider uppercase border border-border px-6 py-3 text-white hover:border-white transition-colors">
                  Get notified at launch →
                </a>
              </div>

              {/* Pro */}
              <div className="relative corner-mark p-10 bg-black border border-green/20" style={{ boxShadow: '0 0 40px -8px rgba(0,233,106,0.12)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-xs tracking-widest uppercase text-green">Pro</span>
                  <span className="font-mono text-[10px] border border-green/30 text-green px-2 py-0.5 uppercase tracking-wider">Includes extension</span>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-mono text-4xl font-semibold text-white">€5</span>
                  <span className="text-secondary text-sm">/ month</span>
                </div>
                <p className="text-secondary text-sm mb-6 leading-relaxed">Full extension access — unlimited scans, saved history, shareable report links.</p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Unlimited scans via extension',
                    'Scan history saved to dashboard',
                    'Shareable report URL per scan',
                    'PDF export for client delivery',
                    'All 17 checks on every scan',
                    'Works on local dev servers',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 text-green"><SparkleIcon size={11} /></span>
                      <span className="text-secondary text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="/pricing" className="block text-center font-mono text-sm tracking-wider uppercase bg-green text-black px-6 py-3 hover:bg-green-mid transition-colors">
                  Get Pro — €5/month →
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── Lead capture (anchor target) ── */}
        <section id="notify" className="border-b border-border py-20 bg-surface">
          <div className="max-w-5xl mx-auto px-6">
            <div className="max-w-lg">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Chrome Web Store launch</span>
              <h2 className="text-3xl font-semibold text-white tracking-tight mb-4">
                Be first to know when it drops.
              </h2>
              <p className="text-secondary text-sm leading-relaxed mb-8">
                The extension is in beta. Drop your email and we&apos;ll send you a direct link the moment it goes live on the Chrome Web Store.
              </p>
              <WaitlistForm placeholder="your@email.com" />
              <p className="mt-4 font-mono text-xs text-secondary">No spam. One email when it launches, that&apos;s it.</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-b border-border py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">FAQ</span>
              <h2 className="text-3xl font-semibold text-white tracking-tight">Common questions</h2>
            </div>
            <div className="divide-y divide-border">
              {FAQ.map((item) => (
                <div key={item.q} className="py-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <h3 className="text-white font-semibold text-sm">{item.q}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
