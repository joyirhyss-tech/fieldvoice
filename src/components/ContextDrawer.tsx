'use client';

import { useState } from 'react';

export default function ContextDrawer() {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<{ text: string; time: string }[]>([
    { text: 'Summer schedule changes may affect response rates — check with HR on contract windows before next push.', time: '2026-03-05' },
    { text: 'Site 4 had a leadership change last month. Factor into theme analysis.', time: '2026-03-02' },
  ]);

  const addNote = () => {
    if (!note.trim()) return;
    setSavedNotes([{ text: note.trim(), time: new Date().toISOString().split('T')[0] }, ...savedNotes]);
    setNote('');
  };

  return (
    <div className="card-surface p-4 space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Context Notes</h4>
      <div className="flex gap-2">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          placeholder="Add a context note..."
          className="input-navy flex-1 px-3 py-1.5 text-sm"
        />
        <button
          onClick={addNote}
          disabled={!note.trim()}
          className="btn-navy px-3 py-1.5 rounded-lg text-sm disabled:opacity-40"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {savedNotes.map((n, i) => (
          <div key={i} className="px-3 py-2 rounded-lg bg-navy-800">
            <p className="text-sm text-text-secondary">{n.text}</p>
            <p className="text-xs text-text-muted mt-1">{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
