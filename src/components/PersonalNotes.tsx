'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';

export default function PersonalNotes() {
  const [notes, setNotes] = useLocalStorage<string>('fieldvoices-personal-notes', '');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card-surface overflow-hidden">
      {/* Header — always visible, acts as toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-navy-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Personal Notes
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {notes.trim() && !expanded && (
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" title="Has notes" />
          )}
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            className={`text-text-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      {expanded && (
        <div className="px-4 pb-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Quick reflections, reminders, working notes..."
            rows={5}
            className="input-navy w-full px-3 py-2 text-xs resize-none"
          />
          <p className="text-xs text-text-muted mt-2">
            Saved automatically. Private to you.
          </p>
        </div>
      )}
    </div>
  );
}
