'use client';

import { DailyBrief } from '@/lib/types';
import { ROLE_LABELS } from '@/lib/roles';

interface DailyBriefNotebookProps {
  brief: DailyBrief;
}

export default function DailyBriefNotebook({ brief }: DailyBriefNotebookProps) {
  return (
    <div className="space-y-4">
      {brief.regulationAlert && (
        <div className="px-3 py-2 rounded-lg bg-alert-rose-light border border-alert-rose/20 text-xs text-alert-rose">
          Regulation-first: stress/frazzle signals elevated. Prioritize staff wellbeing action.
        </div>
      )}

      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Themes surfaced
        </h4>
        <ul className="space-y-1.5">
          {brief.themes.map((theme, i) => (
            <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-gold-500 mt-0.5">&bull;</span>
              {theme}
            </li>
          ))}
        </ul>
      </div>

      <div className="card-surface p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Actions (max 3)
        </h4>
        <div className="space-y-2">
          {brief.actions.map((action) => (
            <div
              key={action.id}
              className={`flex items-start gap-3 px-3 py-2 rounded-lg ${
                action.completed ? 'bg-accent-sage-light' : 'bg-navy-800'
              }`}
            >
              <div
                className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  action.completed
                    ? 'border-accent-sage bg-accent-sage'
                    : 'border-border-medium'
                }`}
              >
                {action.completed && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${action.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                  {action.description}
                </p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-text-muted">
                    {ROLE_LABELS[action.assignedTo] || action.assignedTo}
                  </span>
                  <span className="text-xs text-text-muted">
                    Due {action.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
