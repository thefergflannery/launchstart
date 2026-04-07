'use client';

/**
 * IssueLock — blur + upgrade overlay shown inside a locked IssueCard.
 *
 * Renders a blurred content preview so the user can tell there is substance
 * behind the lock, then overlays a clear upgrade CTA.
 */
export default function IssueLock() {
  return (
    <div className="relative px-5 pb-5 border-t border-border pt-4">
      {/* Blurred content preview — aria-hidden so screen readers skip it */}
      <div
        className="space-y-4 select-none"
        style={{ filter: 'blur(5px)', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">Who is affected</p>
          <p className="text-secondary text-sm">People using assistive technology will be directly affected by this issue and unable to access parts of your site.</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">Why it matters</p>
          <p className="text-secondary text-sm">This issue carries legal risk under the European Accessibility Act and affects a significant portion of your visitors.</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1.5">Fix instruction</p>
          <p className="text-secondary text-sm font-mono text-xs">Add the required attribute to each element. Your developer can fix this in under an hour with the step-by-step instructions below.</p>
        </div>
      </div>

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
        <p className="font-mono text-xs text-white text-center">
          Unlock plain English fix instructions
        </p>
        <a
          href="/pricing"
          className="font-mono text-xs uppercase tracking-wider bg-green text-black px-5 py-2 hover:bg-green-mid transition-colors"
        >
          Upgrade — from €10 →
        </a>
      </div>
    </div>
  );
}
