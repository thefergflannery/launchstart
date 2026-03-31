/**
 * F-008 — Why Choose A11YO (/why-a11yo)
 * Footer link only — not in main navigation.
 * EAA context, Irish statistics, CTA to signup.
 * PRD ref: §F-008
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Why Choose A11YO — Plain English Web Accessibility for Irish Businesses',
  description:
    'The European Accessibility Act is now law. Irish businesses face fines for non-compliant websites. A11YO gives you a plain English report that tells you exactly what to fix — without needing to know what WCAG means.',
};

const STATS = [
  { figure: '28 June 2025', label: 'EAA compliance deadline', note: 'for products and services in the EU' },
  { figure: '15%', label: 'of people in Ireland', note: 'live with a disability affecting web use' },
  { figure: '€5,000+', label: 'typical consultant audit', note: 'A11YO costs a fraction of that' },
  { figure: '97%', label: 'of home pages tested', note: 'have detectable WCAG failures (WebAIM 2024)' },
];

export default function WhyA11YOPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav links={PAGE_NAV_LINKS} />

      <main id="main-content" className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <span className="font-mono text-xs uppercase tracking-widest text-green block mb-4">
            Why A11YO
          </span>
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white mb-4 leading-tight">
            Web accessibility is now the law.<br className="hidden sm:block" /> Most Irish websites aren&apos;t compliant.
          </h1>
          <p className="text-secondary text-lg leading-relaxed mb-12 max-w-2xl">
            The European Accessibility Act (EAA) came into force on 28 June 2025. Businesses that sell
            products or services online in Ireland or the EU must now meet WCAG 2.1 Level AA accessibility
            standards — or face enforcement action.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-16">
            {STATS.map(({ figure, label, note }) => (
              <div key={label} className="corner-mark border border-border bg-surface px-5 py-5">
                <span className="font-display text-3xl font-extrabold text-green block mb-1">{figure}</span>
                <span className="text-white text-sm font-semibold block mb-1">{label}</span>
                <span className="font-mono text-xs text-secondary">{note}</span>
              </div>
            ))}
          </div>

          <div className="space-y-10 text-secondary leading-relaxed">

            <section aria-labelledby="problem-heading">
              <h2 id="problem-heading" className="text-white font-semibold text-xl mb-3">The problem with existing tools</h2>
              <p className="mb-3">
                Tools like Axe, WAVE, and Lighthouse are excellent — if you are an accessibility specialist
                or an experienced developer. They output WCAG criterion codes, DOM selectors, and technical
                audit language that means nothing to a business owner trying to understand what is actually wrong
                with their website.
              </p>
              <p>
                A 5,000 euro consultant audit is thorough, but it is out of reach for most Irish SMEs. And ignoring
                the problem entirely is no longer an option — EAA enforcement is already underway across the EU.
              </p>
            </section>

            <section aria-labelledby="solution-heading">
              <h2 id="solution-heading" className="text-white font-semibold text-xl mb-3">What A11YO does differently</h2>
              <p className="mb-3">
                A11YO runs the same automated checks as Axe and Lighthouse, but rewrites the output in plain
                English. Every issue gets a plain-language title, a human impact explanation, and a specific
                fix instruction your developer can act on immediately — without any further briefing from you.
              </p>
              <p>
                The result is a document that a business owner can read without Googling anything, and a
                developer can use as a checklist. That is the whole job.
              </p>
            </section>

            <section aria-labelledby="who-heading">
              <h2 id="who-heading" className="text-white font-semibold text-xl mb-3">Who A11YO is built for</h2>
              <ul className="space-y-3 list-none">
                {[
                  ['Irish SMEs', 'with a public-facing website and no in-house accessibility knowledge. You got a letter about the EAA and need to understand what it means for your site.'],
                  ['Web agencies', 'who produce accessibility reports for clients and want to deliver plain English reports rather than raw audit outputs.'],
                  ['Public sector bodies', 'tourism operators, and regulated industries with EAA obligations who need a fast, affordable starting point.'],
                ].map(([who, what]) => (
                  <li key={who} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-mid flex-shrink-0" aria-hidden="true" />
                    <span><span className="text-white font-semibold">{who}</span> — {what}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="eaa-heading">
              <h2 id="eaa-heading" className="text-white font-semibold text-xl mb-3">The EAA in plain English</h2>
              <p className="mb-3">
                The European Accessibility Act (EAA) is an EU directive that requires products and services —
                including websites and mobile apps — to meet accessibility standards. In Ireland, it is implemented
                through the European Union (Accessibility Requirements for Products and Services) Regulations 2023.
              </p>
              <p className="mb-3">
                The standard required is WCAG 2.1 Level AA — the same standard used by the UK&apos;s accessibility
                regulations and the US Section 508. Non-compliance can result in complaints, enforcement action,
                and fines from the relevant national authority.
              </p>
              <p>
                The deadline passed on 28 June 2025. If your website is not compliant, the time to fix it is now.
              </p>
            </section>

            <section aria-labelledby="pricing-heading">
              <h2 id="pricing-heading" className="text-white font-semibold text-xl mb-3">Transparent pricing</h2>
              <p className="mb-3">
                A11YO has a generous free tier — run a scan and see your compliance score and a summary of issues
                with no sign-up required. A full report with all issue cards, fix instructions, scan history, and
                PDF export costs €10/month.
              </p>
              <p>
                That is not a consultant. It is a tool that gives you everything you need to brief one.
              </p>
            </section>

          </div>

          {/* CTA */}
          <div className="mt-16 corner-mark border border-green/20 bg-surface px-8 py-8 text-center space-y-4">
            <h2 className="font-display text-2xl font-extrabold text-white">
              See your compliance score in seconds
            </h2>
            <p className="text-secondary text-sm max-w-md mx-auto">
              No sign-up required for your first scan. Enter your URL and get a plain English report immediately.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/"
                className="font-mono text-sm tracking-wider uppercase bg-green text-black px-8 py-3 hover:bg-green-mid transition-colors"
              >
                Scan my website →
              </Link>
              <Link
                href="/sample-report"
                className="font-mono text-sm tracking-wider uppercase border border-border px-8 py-3 text-secondary hover:text-white hover:border-white transition-colors"
              >
                View sample report →
              </Link>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter maxWidth="max-w-3xl" />
    </div>
  );
}
