'use client';

import { useEffect } from 'react';
import { ThemeAggregate, KPISnapshot, YouSaidWeDid } from '@/lib/types';

interface MobileAgencySheetProps {
  open: boolean;
  onClose: () => void;
  demoMode: boolean;
  campaignStats?: { active: number; participants: number; responseRate: number; campaignName: string };
  themes?: ThemeAggregate[];
  kpis?: KPISnapshot[];
  youSaidWeDid?: YouSaidWeDid[];
  followUps?: { label: string; date: string; status: string }[];
}

export default function MobileAgencySheet({
  open,
  onClose,
  demoMode,
  campaignStats,
  themes = [],
  kpis = [],
  youSaidWeDid = [],
  followUps = [],
}: MobileAgencySheetProps) {
  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" onClick={onClose} role="dialog" aria-modal="true" aria-label="Agency-wide panel">
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div
        className="absolute inset-y-0 right-0 w-[85vw] max-w-sm bg-navy-900 border-l border-border-subtle overflow-y-auto animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle sticky top-0 bg-navy-900 z-10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-500">Agency-Wide</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-navy-800 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close panel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Campaign stats */}
        <div className="p-4 space-y-3 border-b border-border-subtle">
          <h4 className="text-xs font-medium text-gold-400">Current FieldVoices</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2.5 rounded-lg bg-navy-800/40 border border-border-subtle">
              <p className="text-sm font-bold text-text-primary">{demoMode && campaignStats ? campaignStats.active : 0}</p>
              <p className="text-[11px] text-text-muted">Active</p>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-navy-800/40 border border-border-subtle">
              <p className="text-sm font-bold text-text-primary">{demoMode && campaignStats ? campaignStats.participants : 0}</p>
              <p className="text-[11px] text-text-muted">Participants</p>
            </div>
            <div className="text-center p-2.5 rounded-lg bg-navy-800/40 border border-border-subtle">
              <p className="text-sm font-bold text-text-primary">{demoMode && campaignStats ? `${campaignStats.responseRate}%` : '0%'}</p>
              <p className="text-[11px] text-text-muted">Response</p>
            </div>
          </div>
        </div>

        {/* Top Concerns */}
        <div className="p-4 space-y-3 border-b border-border-subtle">
          <h4 className="text-xs font-medium text-text-secondary">Top Repeated Concerns</h4>
          {demoMode && themes.length > 0 ? (
            <div className="space-y-2">
              {themes.map((theme) => (
                <div key={theme.id} className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                    theme.severity === 'critical' ? 'bg-alert-rose' :
                    theme.severity === 'high' ? 'bg-gold-500' :
                    theme.severity === 'medium' ? 'bg-gold-400/60' :
                    'bg-text-muted'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary leading-relaxed">{theme.theme}</p>
                    <p className="text-[11px] text-text-muted">{theme.frequency} signals &middot; {theme.department}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-2">No data yet. Concerns surface once surveys are active.</p>
          )}
        </div>

        {/* Follow-ups */}
        <div className="p-4 space-y-3 border-b border-border-subtle">
          <h4 className="text-xs font-medium text-text-secondary">Scheduled Follow-Ups</h4>
          {demoMode && followUps.length > 0 ? (
            <div className="space-y-2">
              {followUps.map((fu, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{fu.label}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    fu.status === 'scheduled' ? 'bg-accent-sage/10 text-accent-sage' : 'bg-navy-700 text-text-muted'
                  }`}>{fu.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-2">No follow-ups scheduled yet.</p>
          )}
        </div>

        {/* You Said / We Did */}
        <div className="p-4 border-b border-border-subtle">
          <div className="rounded-lg p-4 border border-gold-500/30 bg-navy-800 shadow-[0_0_16px_rgba(201,168,76,0.12)]">
            <h4 className="text-xs font-semibold text-gold-400 mb-2">You Said / We Did</h4>
            {demoMode && youSaidWeDid.length > 0 ? (
              <div className="space-y-3">
                {youSaidWeDid.map((entry) => (
                  <div key={entry.id} className="space-y-1">
                    <p className="text-xs text-text-muted italic">&ldquo;{entry.youSaid}&rdquo;</p>
                    <p className="text-xs text-accent-sage">&rarr; {entry.weDid}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">No entries yet. Actions taken in response to feedback will appear here.</p>
            )}
          </div>
        </div>

        {/* Agency Metrics */}
        <div className="p-4">
          <h4 className="text-xs font-medium text-text-secondary mb-2">Agency Metrics</h4>
          {demoMode && kpis.length > 0 ? (
            <div className="space-y-2">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{kpi.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-text-primary">{kpi.value}</span>
                    <span className={`text-[11px] ${
                      kpi.trend === 'up' ? 'text-accent-sage' :
                      kpi.trend === 'down' ? (kpi.label.includes('Duplicate') || kpi.label.includes('Friction') ? 'text-accent-sage' : 'text-alert-rose') :
                      'text-text-muted'
                    }`}>
                      {kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-2">Metrics populate as surveys complete.</p>
          )}
        </div>
      </div>
    </div>
  );
}
