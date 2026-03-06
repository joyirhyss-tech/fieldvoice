'use client';

import { CampaignDraft } from '@/lib/types';
import { mockAudienceGroups } from '@/lib/mock-data';

interface AudiencePanelProps {
  draft: CampaignDraft;
  onUpdate: (updates: Partial<CampaignDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AudiencePanel({ draft, onUpdate, onNext, onBack }: AudiencePanelProps) {
  const toggleGroup = (group: string) => {
    const current = draft.audience;
    if (current.includes(group)) {
      onUpdate({ audience: current.filter((g) => g !== group) });
    } else {
      onUpdate({ audience: [...current, group] });
    }
  };

  const minDays = 14;
  const maxDays = 21;

  const windowDays = (() => {
    if (!draft.windowStart || !draft.windowEnd) return 0;
    const start = new Date(draft.windowStart);
    const end = new Date(draft.windowEnd);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  })();

  const windowValid = windowDays >= minDays && windowDays <= maxDays;
  const canProceed = draft.audience.length > 0 && draft.windowStart && draft.windowEnd && windowValid;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Who should be heard?
        </label>
        <div className="flex flex-wrap gap-2">
          {mockAudienceGroups.map((group) => {
            const selected = draft.audience.includes(group);
            return (
              <button
                key={group}
                onClick={() => toggleGroup(group)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  selected
                    ? 'border-gold-500 bg-navy-700 text-gold-400 font-medium shadow-[0_0_8px_var(--gold-glow)]'
                    : 'border-border-subtle text-text-muted hover:border-navy-400 hover:text-text-secondary'
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            Window start
          </label>
          <input
            type="date"
            value={draft.windowStart}
            onChange={(e) => onUpdate({ windowStart: e.target.value })}
            className="input-navy w-full px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            Window end
          </label>
          <input
            type="date"
            value={draft.windowEnd}
            onChange={(e) => onUpdate({ windowEnd: e.target.value })}
            className="input-navy w-full px-3 py-2 text-sm"
          />
        </div>
      </div>

      {draft.windowStart && draft.windowEnd && (
        <p className={`text-xs ${windowValid ? 'text-accent-sage' : 'text-alert-rose'}`}>
          {windowDays} day window {windowValid ? '(valid)' : `\u2014 must be ${minDays}\u2013${maxDays} days`}
        </p>
      )}

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium rounded-lg text-text-muted hover:bg-navy-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="btn-gold px-5 py-2 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Next: Review
        </button>
      </div>
    </div>
  );
}
