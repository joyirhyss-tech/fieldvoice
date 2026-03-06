'use client';

import { CampaignDraft } from '@/lib/types';

interface PushPanelProps {
  draft: CampaignDraft;
  pushed: boolean;
  onPush: () => void;
  onBack: () => void;
}

export default function PushPanel({ draft, pushed, onPush, onBack }: PushPanelProps) {
  const includedQuestions = draft.questions.filter((q) => q.included).length;
  const valid =
    draft.intention.trim().length > 0 &&
    draft.objective.trim().length > 0 &&
    draft.audience.length > 0 &&
    draft.windowStart &&
    draft.windowEnd &&
    includedQuestions > 0;

  if (pushed) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent-sage-light border border-accent-sage/20 flex items-center justify-center glow-pulse" style={{ '--gold-glow': 'rgba(92, 184, 139, 0.25)' } as React.CSSProperties}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-sage">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Survey pushed
        </h2>
        <p className="text-sm text-text-secondary max-w-sm mx-auto">
          Your campaign is now live. Daily briefs will begin generating once responses arrive.
          Follow-up jobs have been scheduled for day 30.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="card-surface p-5">
        <h3 className="text-sm font-medium text-text-primary mb-3">Survey Summary</h3>
        <dl className="space-y-2.5 text-sm">
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Intention</dt>
            <dd className="text-text-primary">{draft.intention}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Objective</dt>
            <dd className="text-text-primary">{draft.objective}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Audience</dt>
            <dd className="text-text-primary">{draft.audience.join(', ') || '\u2014'}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Window</dt>
            <dd className="text-text-primary">{draft.windowStart} to {draft.windowEnd}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Questions</dt>
            <dd className="text-text-primary">{includedQuestions} included</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg p-4 border-l-2 border-accent-sage bg-accent-sage-light">
        <p className="text-xs text-text-secondary">
          On push, FieldVoices will create the campaign, distribute questions randomly to surveyees,
          schedule daily briefs, generate 30-day follow-up jobs, and track progress.
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium rounded-lg text-text-muted hover:bg-navy-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onPush}
          disabled={!valid}
          className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-accent-sage text-white hover:bg-accent-sage/90 shadow-[0_2px_8px_rgba(92,184,139,0.25)]"
        >
          Push survey
        </button>
      </div>
    </div>
  );
}
