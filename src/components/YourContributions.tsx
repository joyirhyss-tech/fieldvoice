'use client';

import { useState } from 'react';
import { WorkspaceView, UserRole, SurveyCadence, BeHeardRequest, ThemeAggregate, YouSaidWeDid, BeHeardStatusUpdate } from '@/lib/types';
import { getRoleConfig } from '@/lib/roles';
import { useStaffStore } from '@/lib/useStaffStore';

// ─── Demo Data (inline for Tier 2 — mirrors MyImpactPlan pattern) ───

const DEMO_PARTICIPATION = {
  surveysCompleted: 2,
  questionsAnswered: 14,
  activeSurveys: 1,
};

const CADENCE_OPTIONS: { value: SurveyCadence; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'One nudge per day' },
  { value: 'alt-days', label: 'Every Other Day', description: 'Nudges every 2 days' },
  { value: 'twice-weekly', label: '2x / Week', description: 'Two nudges per week' },
  { value: 'weekly', label: 'Weekly', description: 'One nudge per week' },
];

interface YourContributionsProps {
  userName: string;
  role: UserRole;
  demoMode: boolean;
  onSelectView?: (view: WorkspaceView) => void;
  demoThemes?: ThemeAggregate[];
  demoBeHeard?: BeHeardRequest[];
  demoBeHeardStatuses?: BeHeardStatusUpdate[];
  demoYouSaidWeDid?: YouSaidWeDid[];
}

export default function YourContributions({
  userName,
  role,
  demoMode,
  onSelectView,
  demoThemes = [],
  demoBeHeard = [],
  demoBeHeardStatuses = [],
  demoYouSaidWeDid = [],
}: YourContributionsProps) {
  const roleConfig = getRoleConfig(role);
  const { staff, setCadence: storeCadence } = useStaffStore();
  const firstName = userName.split(' ')[0];

  // Find this user's staff record for cadence
  const staffMember = staff.find((s) => s.name === userName);
  const currentCadence = staffMember?.surveyCadence || 'daily';
  const [cadence, setCadenceLocal] = useState<SurveyCadence>(currentCadence);
  const [cadenceEditing, setCadenceEditing] = useState(false);

  const handleCadenceSave = () => {
    if (staffMember) {
      storeCadence(staffMember.id, cadence);
    }
    setCadenceEditing(false);
  };

  // Demo data
  const participation = demoMode ? DEMO_PARTICIPATION : { surveysCompleted: 0, questionsAnswered: 0, activeSurveys: 0 };
  const themes = demoMode ? demoThemes.slice(0, 4) : [];
  const recentBeHeard = demoMode ? demoBeHeard.slice(0, 3) : [];
  const youSaidWeDid = demoMode ? demoYouSaidWeDid : [];

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-sage">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h3 className="text-sm font-semibold text-text-primary">Your Contributions</h3>
        <span className="text-xs text-gold-400 ml-auto">{roleConfig.label}</span>
      </div>

      {/* 1. Survey Participation Stats */}
      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Survey Participation
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
            <p className="text-lg font-bold text-text-primary">{participation.surveysCompleted}</p>
            <p className="text-xs text-text-muted">Surveys Completed</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
            <p className="text-lg font-bold text-text-primary">{participation.questionsAnswered}</p>
            <p className="text-xs text-text-muted">Questions Answered</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
            <p className="text-lg font-bold text-text-primary">{participation.activeSurveys}</p>
            <p className="text-xs text-text-muted">Active Surveys</p>
          </div>
        </div>
        {!demoMode && participation.surveysCompleted === 0 && (
          <p className="text-xs text-text-muted text-center mt-3 max-w-[52ch] mx-auto">
            Your participation stats will appear here once you respond to surveys.
          </p>
        )}
      </div>

      {/* 2. Your Nudge Cadence */}
      <div className="card-surface p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Your Nudge Cadence
          </h4>
          {!cadenceEditing ? (
            <button
              onClick={() => setCadenceEditing(true)}
              className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
            >
              Change
            </button>
          ) : (
            <button
              onClick={handleCadenceSave}
              className="text-xs text-accent-sage hover:text-accent-sage/80 transition-colors font-medium"
            >
              Save
            </button>
          )}
        </div>

        {cadenceEditing ? (
          <div className="grid grid-cols-2 gap-2">
            {CADENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCadenceLocal(opt.value)}
                className={`px-3 py-2.5 rounded-lg text-xs border transition-all text-left ${
                  cadence === opt.value
                    ? 'border-gold-500 bg-navy-800 text-gold-400 shadow-[0_0_12px_var(--gold-glow)]'
                    : 'border-border-subtle bg-navy-900 text-text-muted hover:border-navy-400'
                }`}
              >
                <span className="font-medium block">{opt.label}</span>
                <span className="text-xs text-text-muted block mt-0.5">{opt.description}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-navy-800/40 border border-border-subtle">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-sage flex-shrink-0" />
            <div>
              <p className="text-xs text-text-primary font-medium">
                {CADENCE_OPTIONS.find((o) => o.value === currentCadence)?.label || 'Daily'}
              </p>
              <p className="text-xs text-text-muted">
                {CADENCE_OPTIONS.find((o) => o.value === currentCadence)?.description || 'One nudge per day'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. How Your Voice Contributed — themes surfaced from surveys */}
      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          How Your Voice Contributed
        </h4>

        {themes.length > 0 ? (
          <>
            <p className="text-[11px] text-text-secondary mb-3">
              Your responses helped surface these themes across the organization:
            </p>
            <div className="space-y-2">
              {themes.map((theme) => (
                <div key={theme.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-navy-800/30">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                    theme.severity === 'critical' ? 'bg-alert-rose' :
                    theme.severity === 'high' ? 'bg-gold-500' :
                    theme.severity === 'medium' ? 'bg-gold-400/60' :
                    'bg-text-muted'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary leading-relaxed">{theme.theme}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-text-muted">{theme.frequency} signals</span>
                      <span className="text-[11px] text-text-muted">&middot;</span>
                      <span className="text-[11px] text-text-muted">{theme.department}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-navy-800 border border-border-subtle flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-xs text-text-muted mb-1">No contributions yet</p>
            <p className="text-xs text-text-muted max-w-[52ch] mx-auto">
              Once you participate in surveys, themes generated from your responses will appear here.
            </p>
          </div>
        )}
      </div>

      {/* 4. Be Heard Summary — recent anonymous submissions */}
      <div className="card-surface p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Be Heard Summary
          </h4>
          {recentBeHeard.length > 0 && onSelectView && (
            <button
              onClick={() => onSelectView('be-heard')}
              className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
            >
              View all &rarr;
            </button>
          )}
        </div>

        {recentBeHeard.length > 0 ? (
          <div className="space-y-2">
            {recentBeHeard.map((submission) => {
              const statusColors: Record<string, string> = {
                'pending': 'bg-navy-600',
                'reviewed': 'bg-gold-500',
                'actioned': 'bg-accent-sage',
                'escalated': 'bg-alert-rose',
              };
              const statusLabels: Record<string, string> = {
                'pending': 'Received',
                'reviewed': 'Under Review',
                'actioned': 'Action Taken',
                'escalated': 'Escalated',
              };
              const statusUpdate = demoBeHeardStatuses.find((s) => s.requestId === submission.id);

              return (
                <div key={submission.id} className="p-2.5 rounded-lg bg-navy-800/30 border border-border-subtle">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${statusColors[submission.status] || 'bg-navy-600'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-text-primary leading-relaxed line-clamp-2">
                        {submission.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-text-muted">{submission.createdAt}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-navy-700 text-text-secondary font-medium">
                          {statusLabels[submission.status] || submission.status}
                        </span>
                      </div>
                      {statusUpdate && (
                        <div className="mt-1.5 rounded bg-navy-700/50 p-1.5 border-l-2 border-accent-sage/40">
                          <p className="text-xs text-text-secondary leading-relaxed max-w-[52ch]">{statusUpdate.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-[11px] text-text-muted mb-2">No submissions yet</p>
            {onSelectView && (
              <button
                onClick={() => onSelectView('be-heard')}
                className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
              >
                Share your voice in Be Heard &rarr;
              </button>
            )}
          </div>
        )}
      </div>

      {/* 5. You Said / We Did — accountability loop for Tier 2 */}
      <div className="rounded-lg p-4 border border-gold-500/30 bg-navy-800 shadow-[0_0_16px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(201,168,76,0.08)]">
        <h4 className="text-xs font-semibold text-gold-400 mb-3">You Said / We Did</h4>

        {youSaidWeDid.length > 0 ? (
          <div className="space-y-3">
            {youSaidWeDid.map((entry) => (
              <div key={entry.id} className="space-y-2.5 pb-3 border-b border-gold-500/10 last:border-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted flex-shrink-0 mt-0.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p className="text-[11px] text-text-muted italic leading-relaxed">&ldquo;{entry.youSaid}&rdquo;</p>
                </div>
                <div className="flex items-start gap-2 ml-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-sage flex-shrink-0 mt-0.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  <p className="text-[11px] text-accent-sage leading-relaxed">{entry.weDid}</p>
                </div>
                <p className="text-[11px] text-text-muted ml-4">{entry.department} &middot; {entry.resolvedDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-text-muted leading-relaxed max-w-[52ch]">
            No entries yet. This section will show how leadership responded to your feedback, creating a transparent accountability loop.
          </p>
        )}
      </div>

      {/* 6. Encouraging message */}
      <div className="text-center py-4">
        <p className="text-xs text-accent-sage font-medium">
          Your voice matters, {firstName}. Every response contributes to meaningful change.
        </p>
        <p className="text-xs text-text-muted mt-1 max-w-[52ch] mx-auto">
          All your responses are anonymized. Leadership sees themes and patterns, never individual attribution.
        </p>
      </div>
    </div>
  );
}
