'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';

interface MyImpactPlanProps {
  userName: string;
}

type ToastType = 'success' | 'info';

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
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setAdditionalItems((prev) => [...prev, newItem.trim()]);
    setNewItem('');
  };

  const handleRemoveItem = (index: number) => {
    setAdditionalItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Gather all pushable content as a formatted text block
  const getPushContent = (): string => {
    const lines: string[] = ['FieldVoices — My Impact Plan', `Prepared by: ${userName}`, `Date: ${new Date().toLocaleDateString()}`, ''];

    if (additionalItems.length > 0) {
      lines.push('ACTION ITEMS:');
      additionalItems.forEach((item, i) => lines.push(`  ${i + 1}. ${item}`));
      lines.push('');
    }

    if (notes.trim()) {
      lines.push('NOTES:');
      lines.push(notes.trim());
      lines.push('');
    }

    if (additionalItems.length === 0 && !notes.trim()) {
      lines.push('No action items or notes yet.');
    }

    return lines.join('\n');
  };

  // Generate and download .ics calendar file
  const handleCalendar = () => {
    const content = getPushContent();
    const now = new Date();
    const reviewDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const formatICSDate = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const endDate = new Date(reviewDate.getTime() + 60 * 60 * 1000); // 1 hour event

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FieldVoices//Impact Plan//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(reviewDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      'SUMMARY:FieldVoices: Review Impact Plan',
      `DESCRIPTION:${content.replace(/\n/g, '\\n')}`,
      `UID:fieldvoices-${Date.now()}@fieldvoices.app`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fieldvoices-impact-plan.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToast({ message: '✓ Calendar event downloaded', type: 'success' });
  };

  // Open mailto: with push content
  const handleEmail = () => {
    const content = getPushContent();
    const subject = encodeURIComponent('FieldVoices — My Impact Plan');
    const body = encodeURIComponent(content);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
    setToast({ message: '✓ Opening email client', type: 'success' });
  };

  // Copy to clipboard
  const handleAgenda = async () => {
    const content = getPushContent();
    try {
      await navigator.clipboard.writeText(content);
      setToast({ message: '✓ Copied — paste into your agenda', type: 'success' });
    } catch {
      setToast({ message: 'Could not copy — try again', type: 'info' });
    }
  };

  // Coming soon handlers
  const handleComingSoon = (label: string) => {
    setToast({ message: `Coming soon — will integrate with ${label}`, type: 'info' });
  };

  const handlePush = (key: string, label: string) => {
    switch (key) {
      case 'calendar':
        handleCalendar();
        break;
      case 'email':
        handleEmail();
        break;
      case 'agenda':
        handleAgenda();
        break;
      default:
        handleComingSoon(label);
    }
  };

  return (
    <div className="space-y-5 relative">
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
              onClick={() => handlePush(btn.key, btn.label)}
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

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-accent-sage text-white shadow-[0_4px_16px_rgba(92,184,139,0.3)]'
              : 'bg-navy-800 text-gold-400 border border-gold-500/30 shadow-[0_4px_16px_rgba(201,168,76,0.15)]'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
