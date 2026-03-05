'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PassIcon, CopyIcon } from '@/components/Icons';

type ConformanceLevel = 'fully' | 'partially' | 'non';
type Standard = 'wcag22aa' | 'wcag22a' | 'wcag22aaa' | 'en301549' | 'ada' | 'section508' | 'eaa' | 'aoda' | 'aca';

interface FormData {
  orgName: string;
  websiteUrl: string;
  statementDate: string;
  contactEmail: string;
  contactName: string;
  conformanceLevel: ConformanceLevel;
  standards: Standard[];
  knownIssues: string;
  feedbackUrl: string;
  enforcementBody: string;
}

const STANDARDS: { id: Standard; label: string; region: string }[] = [
  { id: 'wcag22aa',   label: 'WCAG 2.2 Level AA',       region: 'Global'    },
  { id: 'wcag22a',    label: 'WCAG 2.2 Level A',         region: 'Global'    },
  { id: 'wcag22aaa',  label: 'WCAG 2.2 Level AAA',       region: 'Global'    },
  { id: 'en301549',   label: 'EN 301 549',                region: 'EU'        },
  { id: 'eaa',        label: 'European Accessibility Act (EAA 2025)', region: 'EU' },
  { id: 'ada',        label: 'ADA Title III',             region: 'US'        },
  { id: 'section508', label: 'Section 508',               region: 'US'        },
  { id: 'aoda',       label: 'AODA (WCAG 2.0 AA)',        region: 'Canada/ON' },
  { id: 'aca',        label: 'Accessible Canada Act (ACA)', region: 'Canada'  },
];

const CONFORMANCE_LABELS: Record<ConformanceLevel, string> = {
  fully:     'Fully conformant',
  partially: 'Partially conformant',
  non:       'Non-conformant',
};

function generateStatement(f: FormData): string {
  const date = f.statementDate
    ? new Date(f.statementDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const selectedStandards = STANDARDS.filter((s) => f.standards.includes(s.id));
  const standardList = selectedStandards.map((s) => s.label).join(', ');
  const hasEAA = f.standards.includes('eaa') || f.standards.includes('en301549');
  const hasACA = f.standards.includes('aca');
  const hasUSLaw = f.standards.includes('ada') || f.standards.includes('section508');
  const hasCA = f.standards.includes('aoda') || f.standards.includes('aca');

  const conformanceStatement =
    f.conformanceLevel === 'fully'
      ? `${f.orgName || '[Organisation name]'} is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.`
      : f.conformanceLevel === 'partially'
      ? `${f.orgName || '[Organisation name]'} is committed to ensuring digital accessibility for people with disabilities. We are actively working to increase the accessibility of our website and aim to adhere to the applicable standards.`
      : `${f.orgName || '[Organisation name]'} recognises the importance of web accessibility. We are currently in the process of reviewing and improving our website to meet applicable accessibility standards.`;

  const knownIssuesSection = f.knownIssues?.trim()
    ? `\n\nKnown limitations\n${'-'.repeat(40)}\nDespite our best efforts, some content may not yet be fully accessible. The following known limitations exist:\n\n${f.knownIssues.trim()}\n\nWe are actively working to address these issues.`
    : '';

  const eaaSection = hasEAA
    ? `\n\nEuropean Accessibility Act (EAA) — Directive (EU) 2019/882\n${'-'.repeat(40)}\nThis website aims to comply with the European Accessibility Act 2025 and the EN 301 549 standard. The EAA entered into force on 28 June 2025 and applies to products and services provided within the European Union.\n\nIf you are not satisfied with our response, you may contact your national supervisory authority${f.enforcementBody ? `: ${f.enforcementBody}` : '.'}`
    : '';

  const acaSection = hasACA
    ? `\n\nAccessible Canada Act (ACA) — S.C. 2019, c. 10\n${'-'.repeat(40)}\nThis website aims to comply with the Accessible Canada Act, which requires federally regulated organisations to identify, remove, and prevent barriers for people with disabilities. Our accessibility plan is available upon request.`
    : '';

  const usSection = hasUSLaw
    ? `\n\nUS Federal Compliance\n${'-'.repeat(40)}\nThis website is designed to comply with${f.standards.includes('ada') ? ' the Americans with Disabilities Act (ADA) Title III' : ''}${f.standards.includes('ada') && f.standards.includes('section508') ? ' and' : ''}${f.standards.includes('section508') ? ' Section 508 of the Rehabilitation Act' : ''}, using WCAG 2.2 Level AA as the technical standard.`
    : '';

  const caSection = hasCA && !hasACA
    ? `\n\nCanadian Compliance\n${'-'.repeat(40)}\nThis website aims to comply with the Accessibility for Ontarians with Disabilities Act (AODA) Information and Communications Standard, which requires WCAG 2.0 Level AA compliance.`
    : '';

  return `Accessibility Statement
${'='.repeat(40)}

${f.orgName || '[Organisation name]'}
${f.websiteUrl || '[website URL]'}

Statement date: ${date}

1. Commitment
${'-'.repeat(40)}
${conformanceStatement}

2. Conformance status
${'-'.repeat(40)}
Conformance level: ${CONFORMANCE_LABELS[f.conformanceLevel]}

This website is ${CONFORMANCE_LABELS[f.conformanceLevel].toLowerCase()} with the following standards:
${selectedStandards.length > 0 ? selectedStandards.map((s) => `  • ${s.label} (${s.region})`).join('\n') : '  • [No standards selected]'}

The standards referenced define requirements for designers and developers to improve accessibility for people with disabilities.${knownIssuesSection}

3. Technical specification
${'-'.repeat(40)}
Accessibility of this website relies on the following technologies:
  • HTML5
  • CSS3 / ARIA
  • JavaScript

These technologies are relied upon for conformance with the accessibility standards listed above.

4. Feedback and contact
${'-'.repeat(40)}
We welcome your feedback on the accessibility of ${f.websiteUrl || 'this website'}. If you experience accessibility barriers or have suggestions, please contact us:

  Email: ${f.contactEmail || '[contact email]'}
  Contact: ${f.contactName || '[contact name or team]'}
${f.feedbackUrl ? `  Accessibility feedback form: ${f.feedbackUrl}` : ''}

We aim to respond to accessibility feedback within 5 working days.${eaaSection}${acaSection}${usSection}${caSection}

5. Enforcement and escalation
${'-'.repeat(40)}
If you are not satisfied with our response to your accessibility feedback, you have the right to escalate your complaint to the relevant authority in your jurisdiction.
${hasEAA && f.enforcementBody ? `\n  EU supervisory body: ${f.enforcementBody}` : ''}
${hasUSLaw ? '\n  US: File a complaint with the US Department of Justice (ADA) or relevant federal agency (Section 508).' : ''}
${hasCA ? '\n  Canada: Contact the Accessibility Standards Canada or the relevant provincial authority.' : ''}

This statement was prepared on ${date}.
`;
}

export default function AccessibilityStatementTool() {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<FormData>({
    orgName: '',
    websiteUrl: '',
    statementDate: today,
    contactEmail: '',
    contactName: '',
    conformanceLevel: 'partially',
    standards: ['wcag22aa', 'en301549', 'eaa'],
    knownIssues: '',
    feedbackUrl: '',
    enforcementBody: '',
  });

  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'form' | 'result'>('form');

  const toggleStandard = (id: Standard) => {
    setForm((f) => ({
      ...f,
      standards: f.standards.includes(id)
        ? f.standards.filter((s) => s !== id)
        : [...f.standards, id],
    }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerated(generateStatement(form));
    setStep('result');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generated).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* Nav */}
      <header className="border-b border-border bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-widest uppercase text-white font-semibold hover:text-green transition-colors">
            A11YO
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/tools" className="font-mono text-xs tracking-wider uppercase text-secondary hover:text-white transition-colors">
              ← All tools
            </Link>
            <Link href="/" className="font-mono text-xs tracking-wider uppercase bg-white text-black px-4 py-2 hover:bg-green transition-colors">
              Full audit →
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <Link href="/tools" className="font-mono text-xs text-secondary hover:text-green transition-colors uppercase tracking-wider block mb-6">
              ← Tools
            </Link>
            <span className="font-mono text-xs tracking-widest uppercase text-green block mb-3">Free Tool</span>
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
              Accessibility Statement<br /><span className="text-green">Generator</span>
            </h1>
            <p className="text-secondary leading-relaxed max-w-xl">
              Generate a compliant accessibility statement for EAA 2025, Accessible Canada Act, ADA, Section 508, WCAG 2.2 AA, and more — in under 2 minutes.
            </p>
          </div>

          {/* Standards badges */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['EAA 2025', 'ACA', 'WCAG 2.2 AA', 'EN 301 549', 'ADA', 'Section 508', 'AODA'].map((s) => (
              <span key={s} className="font-mono text-[10px] uppercase tracking-wider text-secondary border border-border px-2 py-1">
                {s}
              </span>
            ))}
          </div>

          {step === 'form' ? (
            <form onSubmit={handleGenerate} className="space-y-8" aria-label="Accessibility statement generator form">

              {/* Section: Organisation */}
              <fieldset className="border border-border p-6 space-y-5">
                <legend className="font-mono text-xs tracking-widest uppercase text-green px-2">Organisation details</legend>

                <div>
                  <label htmlFor="orgName" className="font-mono text-xs tracking-wider uppercase text-secondary block mb-2">
                    Organisation name <span aria-hidden="true" className="text-fail">*</span>
                  </label>
                  <input
                    id="orgName"
                    type="text"
                    required
                    value={form.orgName}
                    onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                    placeholder="Acme Ltd."
                    className="w-full px-4 py-3 bg-surface border border-border text-white placeholder-secondary focus:outline-none focus:border-green font-mono text-sm transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="websiteUrl" className="font-mono text-xs tracking-wider uppercase text-secondary block mb-2">
                    Website URL <span aria-hidden="true" className="text-fail">*</span>
                  </label>
                  <input
                    id="websiteUrl"
                    type="url"
                    required
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-surface border border-border text-white placeholder-secondary focus:outline-none focus:border-green font-mono text-sm transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contactEmail" className="font-mono text-xs tracking-wider uppercase text-secondary block mb-2">
                      Contact email <span aria-hidden="true" className="text-fail">*</span>
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      required
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      placeholder="accessibility@example.com"
                      className="w-full px-4 py-3 bg-surface border border-border text-white placeholder-secondary focus:outline-none focus:border-green font-mono text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contactName" className="font-mono text-xs tracking-wider uppercase text-secondary block mb-2">
                      Contact name / team
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      placeholder="Accessibility team"
                      className="w-full px-4 py-3 bg-surface border border-border text-white placeholder-secondary focus:outline-none focus:border-green font-mono text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="statementDate" className="font-mono text-xs tracking-wider uppercase text-secondary block mb-2">
                      Statement date
                    </label>
                    <input
                      id="statementDate"
                      type="date"
                      value={form.statementDate}
                      onChange={(e) => setForm({ ...form, statementDate: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border text-white focus:outline-none focus:border-green font-mono text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="feedbackUrl" className="font-mono text-xs tracking-wider uppercase text-secondary block mb-2">
                      Feedback form URL (optional)
                    </label>
                    <input
                      id="feedbackUrl"
                      type="url"
                      value={form.feedbackUrl}
                      onChange={(e) => setForm({ ...form, feedbackUrl: e.target.value })}
                      placeholder="https://example.com/feedback"
                      className="w-full px-4 py-3 bg-surface border border-border text-white placeholder-secondary focus:outline-none focus:border-green font-mono text-sm transition-colors"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Section: Conformance */}
              <fieldset className="border border-border p-6">
                <legend className="font-mono text-xs tracking-widest uppercase text-green px-2">Conformance status</legend>
                <p className="text-secondary text-sm mb-5 mt-2">How well does your site currently meet the standards you select below?</p>
                <div className="space-y-3">
                  {(Object.entries(CONFORMANCE_LABELS) as [ConformanceLevel, string][]).map(([level, label]) => (
                    <label key={level} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="conformance"
                        value={level}
                        checked={form.conformanceLevel === level}
                        onChange={() => setForm({ ...form, conformanceLevel: level })}
                        className="mt-0.5 accent-green flex-shrink-0"
                      />
                      <div>
                        <span className="text-white text-sm font-medium group-hover:text-green transition-colors">{label}</span>
                        <p className="text-secondary text-xs mt-0.5">
                          {level === 'fully' && 'All pages meet the standard with no known failures.'}
                          {level === 'partially' && 'Most pages meet the standard; some known issues remain.'}
                          {level === 'non' && 'The site does not yet meet the standard — work is underway.'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Section: Standards */}
              <fieldset className="border border-border p-6">
                <legend className="font-mono text-xs tracking-widest uppercase text-green px-2">Standards to reference</legend>
                <p className="text-secondary text-sm mb-5 mt-2">Select every standard that applies to your organisation or target market.</p>
                <div className="space-y-2">
                  {STANDARDS.map((std) => (
                    <label key={std.id} className="flex items-center gap-3 cursor-pointer group py-2 border-b border-border/40 last:border-0">
                      <input
                        type="checkbox"
                        checked={form.standards.includes(std.id)}
                        onChange={() => toggleStandard(std.id)}
                        className="accent-green flex-shrink-0"
                      />
                      <span className="text-white text-sm flex-1 group-hover:text-green transition-colors">{std.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-secondary border border-border px-2 py-0.5 flex-shrink-0">
                        {std.region}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Section: Known issues */}
              <fieldset className="border border-border p-6">
                <legend className="font-mono text-xs tracking-widest uppercase text-green px-2">Known limitations (optional)</legend>
                <p className="text-secondary text-sm mb-4 mt-2">
                  List any known accessibility issues that remain unresolved. Be specific — this section is required by EAA and ACA.
                </p>
                <textarea
                  id="knownIssues"
                  value={form.knownIssues}
                  onChange={(e) => setForm({ ...form, knownIssues: e.target.value })}
                  placeholder="e.g. Some older PDF documents may not be fully accessible. We are reviewing these and expect to have them updated by Q3 2025."
                  rows={4}
                  className="w-full px-4 py-3 bg-surface border border-border text-white placeholder-secondary focus:outline-none focus:border-green font-mono text-sm transition-colors resize-y"
                />
              </fieldset>

              {/* Section: EU enforcement body */}
              {(form.standards.includes('eaa') || form.standards.includes('en301549')) && (
                <fieldset className="border border-green/20 p-6 bg-green/5">
                  <legend className="font-mono text-xs tracking-widest uppercase text-green px-2">EAA — Supervisory body</legend>
                  <p className="text-secondary text-sm mb-4 mt-2">
                    Required for EAA compliance. Name the national supervisory/enforcement authority in your EU member state.
                  </p>
                  <input
                    id="enforcementBody"
                    type="text"
                    value={form.enforcementBody}
                    onChange={(e) => setForm({ ...form, enforcementBody: e.target.value })}
                    placeholder="e.g. Commission nationale de l'informatique et des libertés (CNIL), France"
                    className="w-full px-4 py-3 bg-black border border-border text-white placeholder-secondary focus:outline-none focus:border-green font-mono text-sm transition-colors"
                  />
                </fieldset>
              )}

              <button
                type="submit"
                className="w-full font-mono text-sm tracking-wider uppercase bg-green text-black py-4 hover:bg-green/80 transition-colors font-semibold"
              >
                Generate statement →
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Success header */}
              <div className="flex items-center gap-3 border border-green/30 bg-green/5 px-5 py-4">
                <PassIcon size={16} className="text-green flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">Statement generated</p>
                  <p className="text-secondary text-xs font-mono mt-0.5">Copy the text below and publish it on your website — typically at /accessibility-statement</p>
                </div>
              </div>

              {/* Copy bar */}
              <div className="flex items-center justify-between border border-border bg-surface px-5 py-3">
                <span className="font-mono text-xs tracking-wider uppercase text-secondary">Plain text · Ready to publish</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-white border border-border px-4 py-2 hover:border-green hover:text-green transition-colors"
                >
                  {copied ? <PassIcon size={12} className="text-green" /> : <CopyIcon size={12} />}
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
              </div>

              {/* Statement output */}
              <pre className="border border-border bg-surface p-6 text-sm text-secondary font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {generated}
              </pre>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 font-mono text-xs tracking-wider uppercase border border-border px-6 py-3.5 text-white hover:border-white transition-colors text-center"
                >
                  ← Edit details
                </button>
                <button
                  onClick={handleCopy}
                  className="flex-1 font-mono text-xs tracking-wider uppercase bg-green text-black px-6 py-3.5 hover:bg-green/80 transition-colors font-semibold"
                >
                  {copied ? '✓ Copied' : 'Copy statement →'}
                </button>
              </div>

              {/* Guidance */}
              <div className="border border-border bg-surface p-6 space-y-4">
                <h2 className="text-white font-semibold text-sm">What to do next</h2>
                <ol className="space-y-3 list-none">
                  {[
                    'Publish this statement at a permanent URL such as /accessibility-statement.',
                    'Link to it from your site footer on every page.',
                    'Review and update it at least annually, or whenever you make significant changes to the site.',
                    'EAA requires the statement to be in the language of the country you operate in — translate if needed.',
                    'Run a full A11YO audit to identify and fix the issues listed in your Known Limitations section.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-mono text-xs text-green flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-secondary text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="pt-2 border-t border-border">
                  <Link href="/" className="inline-block font-mono text-xs tracking-wider uppercase bg-green text-black px-5 py-3 hover:bg-green/80 transition-colors font-semibold">
                    Run full site audit →
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="border-t border-border px-6 py-5 mt-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-secondary">A11YO — Free accessibility tools</span>
          <Link href="/accessibility" className="font-mono text-xs text-secondary hover:text-white transition-colors">
            Accessibility statement
          </Link>
        </div>
      </footer>

    </div>
  );
}
