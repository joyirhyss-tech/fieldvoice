'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';

interface MyImpactPlanProps {
  userName: string;
}

const PUSH_BUTTONS = [
  { key: 'calendar', label: 'Calendar', icon: '📅' },
  { key: 'email', label: 'Email', icon: '📧' },
  { key: 'agenda', label: 'Agenda', icon: '📋' },
  { key: 'program', label: 'Program Folder', icon: '📁' },
  { key: 'ticket', label: 'Ticket System', icon: '🎫' },
  { key: 'future', label: 'Future Planning', icon: '🔮' },
];

export default function MyImpactPlan({ userName }: MyImpactPlanProps) {
  const [notes, setNotes] = useLocalStorage<string>('fieldvoices-impact-notes', '');
  const [additionalItems, setAdditionalItems] = useLocalStorage<string[]>('fieldvoices-impact-items', []);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setAdditionalItems((prev) => [...prev, newItem.trim()]);
    setNewItem('');
  };

  const handleRemoveItem = (index: number) => {
    setAdditionalItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 14l2 2 4-4" />
        </svg>
        <h3 className="text-sm font-semibold text-text-primary">My Impact Plan</h3>
      </div>

      <div className="rounded-lg p-3 border border-border-subtle bg-navy-800/30">
        <p className="text-xs text-text-muted leading-relaxed">
          Action items derived from your FieldVoices surveys. Add personal notes and push items to your calendar, email, or other tools.
        </p>
      </div>

      {/* Survey-derived action items — empty state for now */}
      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Survey Action Items
        </h4>
        <p className="text-xs text-text-muted text-center py-4 italic">
          Action items will populate here once surveys generate themes and recommended actions.
        </p>
      </div>

      {/* Additional items — user can add manually */}
      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          My Action Items
        </h4>

        {additionalItems.length > 0 && (
          <div className="space-y-2 mb-3">
            {additionalItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2 group">
                <div className="w-4 h-4 mt-0.5 rounded border border-border-subtle bg-navy-800 flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-accent-sage transition-colors"
                  onClick={() => handleRemoveItem(i)}
                  title="Remove item"
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddItem();
            }}
            placeholder="Add an action item..."
            className="input-navy flex-1 px-3 py-1.5 text-xs"
          />
          <button
            onClick={handleAddItem}
            disabled={!newItem.trim()}
            className="btn-navy px-3 py-1.5 rounded-lg text-xs disabled:opacity-30"
          >
            Add
          </button>
        </div>
      </div>

      {/* Notes section */}
      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Notes
        </h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes, reflections, or follow-up thoughts..."
          rows={4}
          className="input-navy w-full px-3 py-2 text-xs resize-none"
        />
      </div>

      {/* Push buttons row */}
      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          Push To
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {PUSH_BUTTONS.map((btn) => (
            <button
              key={btn.key}
              className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg border border-border-subtle bg-navy-800/40 hover:bg-navy-800 hover:border-gold-500/30 transition-all text-center"
            >
              <span className="text-lg">{btn.icon}</span>
              <span className="text-[10px] text-text-muted">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* You Said / We Did — gold card */}
      <div className="rounded-lg p-4 border border-gold-500/30 bg-navy-800 shadow-[0_0_16px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(201,168,76,0.08)]">
        <h4 className="text-xs font-semibold text-gold-400 mb-2">You Said / We Did</h4>
        <p className="text-[11px] text-text-muted leading-relaxed">
          No entries yet &mdash; this section will show concrete actions taken in response to staff feedback, creating a visible accountability loop.
        </p>
      </div>
    </div>
  );
}
