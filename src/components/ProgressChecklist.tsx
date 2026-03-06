'use client';

import { ChecklistItem } from '@/lib/types';

interface ProgressChecklistProps {
  items: ChecklistItem[];
  compact?: boolean;
}

export default function ProgressChecklist({ items, compact = false }: ProgressChecklistProps) {
  const completed = items.filter((i) => i.done).length;
  const pct = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  if (compact) {
    return (
      <div className="rounded-lg bg-navy-800/50 border border-border-subtle px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="w-full h-1 rounded-full bg-navy-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--gold-500), var(--gold-400))' }}
              />
            </div>
          </div>
          <span className="text-[10px] font-medium text-gold-400 flex-shrink-0">
            {completed}/{items.length}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {items.map((item) => (
              <div
                key={item.key}
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                  item.done ? 'bg-accent-sage' : 'bg-navy-700 border border-border-medium'
                }`}
                title={item.label}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Progress
        </h3>
        <span className="text-xs font-medium text-gold-400">
          {completed}/{items.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-navy-700 overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--gold-500), var(--gold-400))' }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2.5">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                item.done
                  ? 'border-accent-sage bg-accent-sage'
                  : 'border-border-medium bg-transparent'
              }`}
            >
              {item.done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </div>
            <span
              className={`text-sm ${
                item.done ? 'text-text-muted line-through' : 'text-text-secondary'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
