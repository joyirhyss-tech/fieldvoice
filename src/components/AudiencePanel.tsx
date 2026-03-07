'use client';

import { useState } from 'react';
import { CampaignDraft } from '@/lib/types';

const DEFAULT_AUDIENCE_GROUPS = [
  'Field Staff',
  'Site Supervisors',
  'Program Team',
  'Program Managers',
  'All Departments',
];

interface AudiencePanelProps {
  draft: CampaignDraft;
  onUpdate: (updates: Partial<CampaignDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AudiencePanel({ draft, onUpdate, onNext, onBack }: AudiencePanelProps) {
  const [customGroups, setCustomGroups] = useState<string[]>([]);
  const [newGroup, setNewGroup] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);

  const allGroups = [...DEFAULT_AUDIENCE_GROUPS, ...customGroups];

  const toggleGroup = (group: string) => {
    const current = draft.audience;
    if (current.includes(group)) {
      onUpdate({ audience: current.filter((g) => g !== group) });
    } else {
      onUpdate({ audience: [...current, group] });
    }
  };

  const addCustomGroup = () => {
    const trimmed = newGroup.trim();
    if (!trimmed || allGroups.includes(trimmed)) return;
    setCustomGroups((prev) => [...prev, trimmed]);
    onUpdate({ audience: [...draft.audience, trimmed] });
    setNewGroup('');
    setShowAddGroup(false);
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
          {allGroups.map((group) => {
            const selected = draft.audience.includes(group);
            const isCustom = customGroups.includes(group);
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
                {isCustom && <span className="ml-1 text-[10px] opacity-60">*</span>}
              </button>
            );
          })}

          {/* Add group button */}
          {showAddGroup ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomGroup()}
                placeholder="Group name..."
                className="input-navy px-2.5 py-1 text-sm rounded-full w-36"
                autoFocus
              />
              <button
                onClick={addCustomGroup}
                disabled={!newGroup.trim()}
                className="px-2 py-1 rounded-full text-xs text-gold-400 hover:text-gold-300 disabled:opacity-30 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => { setShowAddGroup(false); setNewGroup(''); }}
                className="px-1.5 py-1 rounded-full text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddGroup(true)}
              className="px-3 py-1.5 rounded-full text-sm border border-dashed border-border-medium text-text-muted hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              + Add group
            </button>
          )}
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
