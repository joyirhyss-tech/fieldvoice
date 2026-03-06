'use client';

import { BriefAction, FollowUpJob } from '@/lib/types';
import { ROLE_LABELS } from '@/lib/roles';

interface WorkPlanCardProps {
  actions: BriefAction[];
  followUps: FollowUpJob[];
}

export default function WorkPlanCard({ actions, followUps }: WorkPlanCardProps) {
  const completed = actions.filter((a) => a.completed).length;

  return (
    <div className="p-4 space-y-4">
      <div className="card-surface p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-text-secondary">Actions</h4>
          <span className="text-xs text-text-muted">{completed}/{actions.length} done</span>
        </div>
        <div className="space-y-2">
          {actions.map((action) => (
            <div key={action.id} className="flex items-start gap-2">
              <div
                className={`w-3.5 h-3.5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  action.completed
                    ? 'border-accent-sage bg-accent-sage'
                    : 'border-border-medium'
                }`}
              >
                {action.completed && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-xs ${action.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                  {action.description}
                </p>
                <p className="text-xs text-text-muted">
                  {ROLE_LABELS[action.assignedTo] || action.assignedTo} &middot; {action.dueDate}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Export / Push actions */}
        <div className="mt-3 pt-2 border-t border-border-subtle flex flex-wrap gap-1.5">
          <button className="px-2 py-1 rounded text-[10px] font-medium bg-navy-700 border border-border-subtle text-text-muted hover:text-gold-400 hover:border-gold-500/30 transition-colors">
            Export to calendar
          </button>
          <button className="px-2 py-1 rounded text-[10px] font-medium bg-navy-700 border border-border-subtle text-text-muted hover:text-gold-400 hover:border-gold-500/30 transition-colors">
            Push to workplan
          </button>
          <button className="px-2 py-1 rounded text-[10px] font-medium bg-navy-700 border border-border-subtle text-text-muted hover:text-gold-400 hover:border-gold-500/30 transition-colors">
            Agenda items
          </button>
        </div>
      </div>

      {followUps.length > 0 && (
        <div className="card-surface p-3">
          <h4 className="text-xs font-medium text-text-secondary mb-2">Follow-ups</h4>
          <div className="space-y-1.5">
            {followUps.map((fu) => (
              <div key={fu.id} className="flex items-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  fu.type === 'risk' ? 'bg-alert-rose' : 'bg-accent-sage'
                }`} />
                <span className="text-text-primary truncate">{fu.theme}</span>
                <span className="text-text-muted ml-auto flex-shrink-0">{fu.triggerDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* You Said / We Did — gold glow standout */}
      <div className="rounded-lg p-3 border border-gold-500/30 bg-navy-800 shadow-[0_0_16px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(201,168,76,0.08)]">
        <h4 className="text-xs font-semibold text-gold-400 mb-1.5">You Said / We Did</h4>
        <p className="text-xs text-text-primary">
          &ldquo;Onboarding docs outdated&rdquo; &rarr; Packet updated with current contacts
        </p>
      </div>
    </div>
  );
}
