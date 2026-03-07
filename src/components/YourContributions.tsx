'use client';

interface YourContributionsProps {
  userName: string;
}

export default function YourContributions({ userName }: YourContributionsProps) {
  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-sage">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h3 className="text-sm font-semibold text-text-primary">Your Contributions</h3>
      </div>

      <div className="rounded-lg p-3 border border-border-subtle bg-navy-800/30">
        <p className="text-xs text-text-muted leading-relaxed">
          See how your voice has contributed to the organization. Your participation in surveys shapes decisions and drives positive change.
        </p>
      </div>

      {/* Participation summary */}
      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Survey Participation
        </h4>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
            <p className="text-lg font-bold text-text-primary">0</p>
            <p className="text-[10px] text-text-muted">Surveys Completed</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
            <p className="text-lg font-bold text-text-primary">0</p>
            <p className="text-[10px] text-text-muted">Questions Answered</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
            <p className="text-lg font-bold text-text-primary">0</p>
            <p className="text-[10px] text-text-muted">Active Surveys</p>
          </div>
        </div>
      </div>

      {/* How your voice contributed */}
      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          How Your Voice Contributed
        </h4>
        <div className="py-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-navy-800 border border-border-subtle flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-xs text-text-muted mb-1">No contributions yet</p>
          <p className="text-[10px] text-text-muted max-w-xs mx-auto">
            Once you participate in surveys, themes and actions generated from your responses will appear here.
          </p>
        </div>
      </div>

      {/* You Said / We Did — feedback loop for tier-2 */}
      <div className="rounded-lg p-4 border border-gold-500/30 bg-navy-800 shadow-[0_0_16px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(201,168,76,0.08)]">
        <h4 className="text-xs font-semibold text-gold-400 mb-2">You Said / We Did</h4>
        <p className="text-[11px] text-text-muted leading-relaxed">
          No entries yet &mdash; this section will show how leadership responded to your feedback, creating a transparent accountability loop.
        </p>
      </div>

      {/* Encouraging message */}
      <div className="text-center py-4">
        <p className="text-xs text-accent-sage font-medium">
          Your voice matters. Every response contributes to meaningful change.
        </p>
      </div>
    </div>
  );
}
