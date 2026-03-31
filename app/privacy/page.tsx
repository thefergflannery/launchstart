import { Metadata } from 'next';
import Link from 'next/link';
import Nav, { PAGE_NAV_LINKS } from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy — A11YO',
  description: 'How A11YO collects, uses, and protects your personal data.',
};

const LAST_UPDATED = '31 March 2026';
const CONTACT_EMAIL = 'hello@a11yo.com';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav links={PAGE_NAV_LINKS} />

      <main id="main-content" className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="mb-12">
            <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Legal</span>
            <h1 className="text-4xl font-display font-extrabold text-white tracking-tight mb-3">Privacy Policy</h1>
            <p className="font-mono text-xs text-secondary">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="space-y-10 text-secondary leading-relaxed">

            <section aria-labelledby="s1">
              <h2 id="s1" className="text-white font-semibold text-lg mb-4">1. Who we are</h2>
              <p>
                A11YO is operated by Ferg Flannery (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We provide website accessibility scanning and reporting services at <strong className="text-white">a11yo.com</strong>.
              </p>
              <p className="mt-3">
                For any privacy-related queries, contact us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-green hover:underline">{CONTACT_EMAIL}</a>.
              </p>
            </section>

            <section aria-labelledby="s2">
              <h2 id="s2" className="text-white font-semibold text-lg mb-4">2. What data we collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Account data</h3>
                  <p>When you create an account: your email address and a hashed password. We do not store your password in plain text.</p>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Scan data</h3>
                  <p>URLs you submit for scanning, scan results (accessibility issues found, compliance score), and scan timestamps. This data is associated with your account and used to provide scan history and trend charts.</p>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Payment data</h3>
                  <p>If you purchase a paid plan, payment is processed by Stripe. We store your Stripe customer ID and subscription status only — we never see or store your card details.</p>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Usage data</h3>
                  <p>We log a hashed (SHA-256) version of your IP address for rate limiting purposes. This hash cannot be reversed to your original IP address. We do not use it for tracking or profiling.</p>
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">Chrome extension</h3>
                  <p>If you use the A11YO Chrome extension, your JWT token is stored locally in <code className="font-mono text-xs bg-surface px-1 py-0.5">chrome.storage.local</code> on your device. We do not have access to your browser storage.</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="s3">
              <h2 id="s3" className="text-white font-semibold text-lg mb-4">3. How we use your data</h2>
              <ul className="space-y-2 list-none">
                {[
                  'To provide the scanning and reporting service',
                  'To maintain your scan history and compliance trends',
                  'To process payments and manage your subscription via Stripe',
                  'To send transactional emails (welcome, subscription confirmation, password reset) via Resend',
                  'To enforce fair-use rate limits',
                  'To improve the product based on aggregated, anonymised usage patterns',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green mt-1.5 flex-shrink-0 font-mono text-xs">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">We do not sell your data. We do not use your data for advertising.</p>
            </section>

            <section aria-labelledby="s4">
              <h2 id="s4" className="text-white font-semibold text-lg mb-4">4. Third-party services</h2>
              <div className="space-y-3">
                {[
                  { name: 'Supabase', role: 'Authentication and database (hosted in EU)', url: 'https://supabase.com/privacy' },
                  { name: 'Stripe', role: 'Payment processing', url: 'https://stripe.com/privacy' },
                  { name: 'Vercel', role: 'Hosting and serverless functions', url: 'https://vercel.com/legal/privacy-policy' },
                  { name: 'Resend', role: 'Transactional email delivery', url: 'https://resend.com/legal/privacy-policy' },
                  { name: 'Anthropic Claude', role: 'AI-generated alt text suggestions (tool only, not stored)', url: 'https://www.anthropic.com/privacy' },
                ].map(({ name, role, url }) => (
                  <div key={name} className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0">
                    <span className="text-white text-sm font-semibold w-32 flex-shrink-0">{name}</span>
                    <span className="text-sm flex-1">{role}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-green hover:underline flex-shrink-0">Policy →</a>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="s5">
              <h2 id="s5" className="text-white font-semibold text-lg mb-4">5. Data retention</h2>
              <p>We retain your account data and scan history for as long as your account is active. If you delete your account, all associated data (profile, scan history, reports) is permanently deleted. Stripe retains transaction records as required by financial regulations — contact Stripe directly to exercise rights over payment records.</p>
            </section>

            <section aria-labelledby="s6">
              <h2 id="s6" className="text-white font-semibold text-lg mb-4">6. Your rights (GDPR)</h2>
              <p className="mb-4">If you are based in the EU or EEA, you have the following rights under GDPR:</p>
              <ul className="space-y-2 list-none">
                {[
                  'Right of access — request a copy of the data we hold about you',
                  'Right to rectification — ask us to correct inaccurate data',
                  'Right to erasure — request deletion of your account and all associated data',
                  'Right to data portability — receive your data in a machine-readable format',
                  'Right to object — object to processing of your data',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green mt-1.5 flex-shrink-0 font-mono text-xs">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                To exercise any of these rights, email us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-green hover:underline">{CONTACT_EMAIL}</a>.
                You can also delete your account directly from your{' '}
                <Link href="/account" className="text-green hover:underline">account settings</Link>.
                We will respond within 30 days.
              </p>
            </section>

            <section aria-labelledby="s7">
              <h2 id="s7" className="text-white font-semibold text-lg mb-4">7. Cookies</h2>
              <p>We use a single session cookie set by Supabase to keep you logged in. We do not use advertising cookies, analytics cookies, or third-party tracking cookies.</p>
            </section>

            <section aria-labelledby="s8">
              <h2 id="s8" className="text-white font-semibold text-lg mb-4">8. Changes to this policy</h2>
              <p>We may update this policy from time to time. We will notify you by email if we make material changes. The date at the top of this page reflects the most recent update.</p>
            </section>

            <section aria-labelledby="s9">
              <h2 id="s9" className="text-white font-semibold text-lg mb-4">9. Contact</h2>
              <p>
                Questions about this policy? Email us at{' '}
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
