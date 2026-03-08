'use client';

import { BeHeardRequest, BeHeardStatusUpdate } from '@/lib/types';
import { getDocumentContentByCategory } from '@/lib/useDocumentStore';

interface VoiceStewardDashboardProps {
  demoMode: boolean;
  demoBeHeard?: BeHeardRequest[];
  demoStatuses?: BeHeardStatusUpdate[];
}

/**
 * Voice Steward Dashboard
 * ────────────────────────
 * Special view for the Voice Steward role — a trusted peer advocate
 * who handles escalated concerns, mandatory reporting protocol,
 * and serves as the confidential bridge between frontline staff and leadership.
 */
export default function VoiceStewardDashboard({
  demoMode,
  demoBeHeard = [],
  demoStatuses = [],
}: VoiceStewardDashboardProps) {
  // Filter escalated items (score >= 70 or routed to ED)
  const escalated = demoMode
    ? demoBeHeard.filter((bh) => bh.score >= 70 || bh.routedTo === 'ed')
    : [];

  const pendingEscalations = escalated.filter((e) => e.status === 'pending' || e.status === 'reviewed');
  const actionedEscalations = escalated.filter((e) => e.status === 'actioned');

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <h3 className="text-sm font-semibold text-text-primary">Voice Stewardship</h3>
        <span className="text-xs text-gold-400 ml-auto">Trusted Advocate</span>
      </div>

      {/* Role explainer */}
      <div className="rounded-lg p-4 border border-gold-500/20 bg-navy-800/50 shadow-[0_0_12px_rgba(201,168,76,0.08)]">
        <h4 className="text-xs font-semibold text-gold-400 mb-2">Your Role</h4>
        <p className="text-[11px] text-text-secondary leading-relaxed">
          As Voice Steward, you are the confidential bridge between frontline staff and leadership. You receive
          escalated concerns that require sensitive handling, ensure mandatory reporting protocols are followed,
          and advocate for staff whose voices need extra protection.
        </p>
      </div>

      {/* Escalation queue */}
      <div className="card-surface p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Escalation Queue
          </h4>
          {pendingEscalations.length > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-alert-rose-light text-alert-rose font-medium">
              {pendingEscalations.length} pending
            </span>
          )}
        </div>

        {escalated.length > 0 ? (
          <div className="space-y-3">
            {escalated.map((item) => {
              const statusUpdate = demoStatuses.find((s) => s.requestId === item.id);
              const isPending = item.status === 'pending';
              const isReviewed = item.status === 'reviewed';

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isPending
                      ? 'border-alert-rose/30 bg-alert-rose-light/50'
                      : isReviewed
                      ? 'border-gold-500/30 bg-navy-800/40'
                      : 'border-border-subtle bg-navy-800/30'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                      isPending ? 'bg-alert-rose animate-pulse' :
                      isReviewed ? 'bg-gold-500' :
                      'bg-accent-sage'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-text-primary leading-relaxed line-clamp-3">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pl-4">
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">{item.createdAt}</span>
                      <span className="text-text-muted">&middot;</span>
                      <span className="text-text-muted">Score: {item.score}</span>
                      <span className="text-text-muted">&middot;</span>
                      <span className="text-text-muted">Routed to: {item.routedTo.toUpperCase()}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      isPending ? 'bg-alert-rose/20 text-alert-rose' :
                      isReviewed ? 'bg-gold-500/20 text-gold-400' :
                      'bg-accent-sage/20 text-accent-sage'
                    }`}>
                      {isPending ? 'Needs Review' : isReviewed ? 'Under Review' : 'Actioned'}
                    </span>
                  </div>

                  {statusUpdate && (
                    <div className="mt-2 ml-4 rounded bg-navy-700/50 p-2 border-l-2 border-accent-sage/40">
                      <p className="text-xs text-text-secondary leading-relaxed">{statusUpdate.note}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-navy-800 border border-border-subtle flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="text-xs text-text-muted mb-1">No escalated concerns</p>
            <p className="text-xs text-text-muted max-w-xs mx-auto">
              High-urgency Be Heard submissions (score 70+) will appear here for your review.
            </p>
          </div>
        )}
      </div>

      {/* Mandatory reporting reminder — pulls from uploaded policy when available */}
      {(() => {
        const mandatedContent = getDocumentContentByCategory('mandated-reporting');
        const hasPolicyDoc = mandatedContent.length > 0;

        // Extract key sections from the uploaded document
        const extractSection = (heading: string): string => {
          if (!hasPolicyDoc) return '';
          const regex = new RegExp(`${heading}[\\s\\S]*?(?=\\n[A-Z]{2,}|$)`, 'i');
          const match = mandatedContent.match(regex);
          return match ? match[0].replace(new RegExp(`^${heading}\\s*`, 'i'), '').trim() : '';
        };

        const whatToReport = extractSection('WHAT MUST BE REPORTED');
        const howToReport = extractSection('HOW TO REPORT');
        const selfHarm = extractSection('SELF-HARM');

        return (
          <div className="card-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Mandatory Reporting Protocol
              </h4>
              {hasPolicyDoc && (
                <span className="text-[11px] text-accent-sage/70 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  From uploaded policy
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-alert-rose-light/30 border border-alert-rose/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-alert-rose flex-shrink-0 mt-0.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {whatToReport ? (
                    <>You must report if you have reason to believe a child has been subjected to: <strong className="text-text-primary">{whatToReport.split('\n').filter(l => l.startsWith('-')).map(l => l.replace(/^-\s*/, '')).join(', ').toLowerCase()}</strong>.</>
                  ) : (
                    <>If any submission describes <strong className="text-text-primary">child abuse, neglect, imminent danger, or self-harm</strong>, follow your agency&apos;s mandated reporting procedure immediately. Do not wait for the standard review cycle.</>
                  )}
                </p>
              </div>

              {howToReport ? (
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-navy-800/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-400 flex-shrink-0 mt-0.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <div className="text-[11px] text-text-secondary leading-relaxed space-y-1">
                    <strong className="text-text-primary block mb-1">How to report:</strong>
                    {howToReport.split('\n').filter(l => l.match(/^\d+\./)).map((step, i) => (
                      <p key={i}>{step.trim()}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-navy-800/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-400 flex-shrink-0 mt-0.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    All escalated concerns are anonymized. You see patterns and content, never individual attribution.
                    Protect this trust by never attempting to identify submitters.
                  </p>
                </div>
              )}

              {selfHarm ? (
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-alert-rose-light/20 border border-alert-rose/10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-alert-rose flex-shrink-0 mt-0.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <div className="text-[11px] text-text-secondary leading-relaxed space-y-1">
                    <strong className="text-text-primary block mb-1">Self-Harm / Imminent Danger:</strong>
                    {selfHarm.split('\n').filter(l => l.startsWith('-')).map((line, i) => (
                      <p key={i}>{line.replace(/^-\s*/, '')}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-navy-800/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-sage flex-shrink-0 mt-0.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Your role is to <strong className="text-text-primary">advocate, not investigate</strong>. Surface patterns to leadership,
                    recommend follow-up actions, and ensure staff feel safe using the system.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Quick stats */}
      {demoMode && (
        <div className="card-surface p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Stewardship Overview
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
              <p className="text-lg font-bold text-text-primary">{escalated.length}</p>
              <p className="text-xs text-text-muted">Total Escalated</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
              <p className="text-lg font-bold text-alert-rose">{pendingEscalations.length}</p>
              <p className="text-xs text-text-muted">Needs Review</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
              <p className="text-lg font-bold text-accent-sage">{actionedEscalations.length}</p>
              <p className="text-xs text-text-muted">Actioned</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
