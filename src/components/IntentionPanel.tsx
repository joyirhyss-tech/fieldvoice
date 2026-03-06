'use client';

import { CampaignDraft } from '@/lib/types';

interface IntentionPanelProps {
  draft: CampaignDraft;
  onUpdate: (updates: Partial<CampaignDraft>) => void;
  onNext: () => void;
}

export default function IntentionPanel({ draft, onUpdate, onNext }: IntentionPanelProps) {
  const canProceed = draft.intention.trim().length > 0 && draft.objective.trim().length > 0;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          What is this survey for? What&apos;s your intention?
        </label>
        <div className="relative">
          <textarea
            value={draft.intention}
            onChange={(e) => onUpdate({ intention: e.target.value })}
            placeholder="What do you want to understand from the field? Braindump here or use the mic..."
            rows={4}
            className="input-navy w-full px-3 py-2.5 text-sm resize-none pr-12"
          />
          <button
            className="absolute right-3 top-3 p-1.5 rounded-lg bg-navy-700 border border-border-subtle text-text-muted hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            title="Voice input"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          What do you need? What outcome will this produce?
        </label>
        <textarea
          value={draft.objective}
          onChange={(e) => onUpdate({ objective: e.target.value })}
          placeholder="Be specific about the outcome you need..."
          rows={3}
          className="input-navy w-full px-3 py-2.5 text-sm resize-none"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="btn-gold px-5 py-2 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Next: Who should be heard?
        </button>
      </div>
    </div>
  );
}
