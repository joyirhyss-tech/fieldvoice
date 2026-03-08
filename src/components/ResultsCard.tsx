'use client';

import { ThemeAggregate, Campaign } from '@/lib/types';

interface ResultsCardProps {
  themes: ThemeAggregate[];
  activeCampaign: Campaign | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function ResultsCard({ themes, activeCampaign, collapsed, onToggleCollapse }: ResultsCardProps) {
  const topThemes = themes.slice(0, 4);
  const responseRate = activeCampaign
    ? Math.round((activeCampaign.responseCount / activeCampaign.participantCount) * 100)
    : 0;

  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-4 w-12 bg-navy-900 border-l border-border-subtle h-full">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-navy-800 text-text-muted hover:text-gold-400 transition-colors"
          title="Expand panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-navy-900 border-l border-border-subtle overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-500">Results</h3>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-navy-800 text-text-muted hover:text-text-primary transition-colors"
          title="Collapse panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeCampaign ? (
          <>
            <div className="card-surface p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-secondary">Participation</span>
                <span className="text-xs font-medium text-gold-400">{responseRate}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-navy-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${responseRate}%`, background: 'linear-gradient(90deg, var(--gold-500), var(--gold-400))' }}
                />
              </div>
              <p className="text-xs text-text-muted mt-1">
                {activeCampaign.responseCount} of {activeCampaign.participantCount} heard
              </p>
            </div>

            <div className="card-surface p-4">
              <h4 className="text-xs font-medium text-text-secondary mb-2">Top repeated concerns</h4>
              <div className="space-y-2.5">
                {topThemes.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      t.severity === 'high' || t.severity === 'critical'
                        ? 'bg-alert-rose'
                        : t.severity === 'medium'
                        ? 'bg-gold-500'
                        : 'bg-accent-sage'
                    }`} />
                    <span className="text-xs text-text-primary truncate">{t.theme}</span>
                    <span className="text-xs text-text-muted ml-auto flex-shrink-0">{t.frequency}x</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border-subtle">
              <p className="text-xs text-text-muted">
                {activeCampaign.status === 'active' ? 'Campaign active' : 'Campaign complete'} &middot; {activeCampaign.audience.join(', ')}
              </p>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-text-muted">
              No active campaign.<br />Push a request to see results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
