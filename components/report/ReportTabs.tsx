'use client';

/**
 * ReportTabs — tab switcher and context provider for Owner / Developer views.
 *
 * Wrap the report issue list with this component. Child components (IssueCard)
 * consume ReportTabsContext via useReportTab() to know which view is active.
 *
 * Usage:
 *   <ReportTabs>
 *     {issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
 *   </ReportTabs>
 */

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ReportTab } from '@/types/report';

interface ReportTabsContextValue {
  activeTab: ReportTab;
  setActiveTab: (tab: ReportTab) => void;
}

export const ReportTabsContext = createContext<ReportTabsContextValue>({
  activeTab: 'owner',
  setActiveTab: () => {},
});

export function useReportTab(): ReportTabsContextValue {
  return useContext(ReportTabsContext);
}

interface ReportTabsProps {
  children: ReactNode;
  defaultTab?: ReportTab;
}

const TABS: { id: ReportTab; label: string; description: string }[] = [
  {
    id: 'owner',
    label: 'Owner View',
    description: 'Plain English — what this means for your business',
  },
  {
    id: 'developer',
    label: 'Developer View',
    description: 'Technical fix instructions, WCAG references, and effort estimates',
  },
];

export default function ReportTabs({ children, defaultTab = 'owner' }: ReportTabsProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>(defaultTab);
  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <ReportTabsContext.Provider value={{ activeTab, setActiveTab }}>
      {/* Tab bar */}
      <div className="corner-mark border border-border bg-surface px-4 py-3 flex items-center justify-between gap-4 flex-wrap mb-4">
        <p className="font-mono text-[10px] text-secondary leading-relaxed hidden sm:block">
          {active.description}
        </p>
        <div
          role="tablist"
          aria-label="Report view"
          className="flex items-center gap-1 bg-black border border-border p-0.5"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-green text-black'
                  : 'text-secondary hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {children}
    </ReportTabsContext.Provider>
  );
}
