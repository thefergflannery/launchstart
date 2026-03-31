import { Metadata } from 'next';
import Link from 'next/link';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms of Service — A11YO',
  description: 'Terms and conditions for using A11YO.',
};

const LAST_UPDATED = '31 March 2026';
const CONTACT_EMAIL = 'hello@a11yo.com';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav links={PAGE_NAV_LINKS} />

      <main id="main-content" className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="mb-12">
            <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Legal</span>
            <h1 className="text-4xl font-display font-extrabold text-white tracking-tight mb-3">Terms of Service</h1>
            <p className="font-mono text-xs text-secondary">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="space-y-10 text-secondary leading-relaxed">

            <section aria-labelledby="t1">
              <h2 id="t1" className="text-white font-semibold text-lg mb-4">1. Agreement</h2>
              <p>
                By using A11YO (&ldquo;the Service&rdquo;) at <strong className="text-white">a11yo.com</strong>, you agree to these Terms of Service. The Service is operated by Ferg Flannery (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). If you do not agree, do not use the Service.
              </p>
            </section>

            <section aria-labelledby="t2">
              <h2 id="t2" className="text-white font-semibold text-lg mb-4">2. What the Service does</h2>
              <p>
                A11YO scans websites for accessibility issues and produces plain English reports to help organisations understand and address their obligations under accessibility legislation including the European Accessibility Act (EAA), WCAG 2.2, ADA, and related standards.
              </p>
              <p className="mt-3">
                Our reports are informational only. They are not a substitute for a formal legal accessibility audit or legal advice. Compliance with accessibility legislation remains your responsibility.
              </p>
            </section>

            <section aria-labelledby="t3">
              <h2 id="t3" className="text-white font-semibold text-lg mb-4">3. Accounts</h2>
              <p>You must provide a valid email address to create an account. You are responsible for maintaining the security of your account credentials. Notify us immediately at <a href={`mailto:${CONTACT_EMAIL}`} className="text-green hover:underline">{CONTACT_EMAIL}</a> if you suspect unauthorised access.</p>
              <p className="mt-3">You may only scan websites you own or have explicit permission to scan. Scanning websites without permission may violate applicable laws.</p>
            </section>

            <section aria-labelledby="t4">
              <h2 id="t4" className="text-white font-semibold text-lg mb-4">4. Paid plans and billing</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Action Plan (€10 one-time)</h3>
                  <p>A single payment granting access to 10 scans per day and full scan history. No subscription. No recurring charges. Access does not expire.</p>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Recurring (€29/month)</h3>
                  <p>A monthly subscription billed automatically. You may cancel at any time via your <Link href="/account" className="text-green hover:underline">account settings</Link>. Access continues until the end of the current billing period. No partial refunds for unused periods.</p>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Agency (€99/month)</h3>
                  <p>As above. Monthly subscription, cancel any time.</p>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Refunds</h3>
                  <p>If you are not satisfied within the first 7 days of a paid plan, contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-green hover:underline">{CONTACT_EMAIL}</a> for a full refund, no questions asked. After 7 days, refunds are at our discretion.</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="t5">
              <h2 id="t5" className="text-white font-semibold text-lg mb-4">5. Acceptable use</h2>
              <p className="mb-3">You must not use the Service to:</p>
              <ul className="space-y-2 list-none">
                {[
                  'Scan websites you do not own or have permission to scan',
                  'Attempt to circumvent rate limits or access controls',
                  'Resell or redistribute scan reports as your own product without attribution',
                  'Use the Service for any unlawful purpose',
                  'Attempt to reverse-engineer, scrape, or extract our issue library or report content at scale',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-fail mt-1.5 flex-shrink-0 font-mono text-xs">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="t6">
              <h2 id="t6" className="text-white font-semibold text-lg mb-4">6. Intellectual property</h2>
              <p>The A11YO plain English issue library — including all issue titles, &ldquo;what this means&rdquo; explanations, and &ldquo;what needs to happen&rdquo; fix instructions — is our intellectual property. You may use report output for your own compliance purposes but may not republish or resell the library content itself.</p>
              <p className="mt-3">Scan reports you generate belong to you. You may share them freely.</p>
            </section>

            <section aria-labelledby="t7">
              <h2 id="t7" className="text-white font-semibold text-lg mb-4">7. Disclaimer of warranties</h2>
              <p>The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee that our scans will identify every accessibility issue on your website, or that acting on our reports will result in full legal compliance. Accessibility legislation and standards change — you are responsible for keeping up to date.</p>
            </section>

            <section aria-labelledby="t8">
              <h2 id="t8" className="text-white font-semibold text-lg mb-4">8. Limitation of liability</h2>
              <p>To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Service, including regulatory fines, legal costs, or losses arising from reliance on our reports.</p>
            </section>

            <section aria-labelledby="t9">
              <h2 id="t9" className="text-white font-semibold text-lg mb-4">9. Termination</h2>
              <p>You may delete your account at any time from <Link href="/account" className="text-green hover:underline">account settings</Link>. We may suspend or terminate accounts that violate these terms.</p>
            </section>

            <section aria-labelledby="t10">
              <h2 id="t10" className="text-white font-semibold text-lg mb-4">10. Governing law</h2>
              <p>These terms are governed by the laws of Ireland. Any disputes shall be subject to the exclusive jurisdiction of the Irish courts.</p>
            </section>

            <section aria-labelledby="t11">
              <h2 id="t11" className="text-white font-semibold text-lg mb-4">11. Changes to these terms</h2>
              <p>We may update these terms. We will notify you by email if we make material changes. Continued use of the Service after changes constitutes acceptance.</p>
            </section>

            <section aria-labelledby="t12">
              <h2 id="t12" className="text-white font-semibold text-lg mb-4">12. Contact</h2>
              <p>
                Questions? Email us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-green hover:underline">{CONTACT_EMAIL}</a>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
