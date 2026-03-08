'use client';

import { DailyBrief } from '@/lib/types';
import { ROLE_LABELS } from '@/lib/roles';
import { useLocalStorage } from '@/lib/useLocalStorage';

interface DailyBriefNotebookProps {
  brief: DailyBrief;
  canEdit?: boolean;
  userName?: string;
  currentUserId?: string;
  briefOwnerId?: string;
  onBack?: () => void;
}

export default function DailyBriefNotebook({ brief, canEdit = false, userName = '', currentUserId, briefOwnerId, onBack }: DailyBriefNotebookProps) {
  const [leadershipMemo, setLeadershipMemo] = useLocalStorage<string>('fieldvoices-leadership-memo', '');

  // Edit permission: canEdit (role-based) AND either owner matches current user or brief is new (no owner)
  const isOwnerOrNew = briefOwnerId === undefined || briefOwnerId === currentUserId;
  const effectiveCanEdit = canEdit && isOwnerOrNew;

  return (
    <div className="space-y-4">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Daily Brief
        </button>
      )}

      {brief.regulationAlert && (
        <div className="px-3 py-2 rounded-lg bg-alert-rose-light border border-alert-rose/20 text-xs text-alert-rose">
          Regulation-first: stress/frazzle signals elevated. Prioritize staff wellbeing action.
        </div>
      )}

      {/* Leadership Notes — visible to all, editable by tier-1 */}
      <div className="card-surface p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            Leadership Notes
          </h4>
        </div>

        {/* Memo */}
        {effectiveCanEdit ? (
          <textarea
            value={leadershipMemo}
            onChange={(e) => setLeadershipMemo(e.target.value)}
            placeholder="Add notes, context, or a message to the team about current survey topics..."
            rows={3}
            className="input-navy w-full px-3 py-2 text-xs resize-none mb-3"
          />
        ) : (
          leadershipMemo ? (
            <div className="rounded-lg bg-navy-800/50 p-3 border-l-2 border-gold-500/30 mb-3">
              <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{leadershipMemo}</p>
            </div>
          ) : (
            <p className="text-xs text-text-muted italic mb-3">No leadership notes yet.</p>
          )
        )}

        {/* Voice / Video placeholders — tier-1 only */}
        {effectiveCanEdit && (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-subtle bg-navy-800/40 text-xs text-text-muted hover:text-text-primary hover:border-border-medium transition-colors"
              title="Record voicenote"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              </svg>
              Voicenote
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-subtle bg-navy-800/40 text-xs text-text-muted hover:text-text-primary hover:border-border-medium transition-colors"
              title="Record short video"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Video
            </button>
          </div>
        )}
      </div>

      {brief.themes.length > 0 && (
        <div className="card-surface p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Themes surfaced
          </h4>
          <ul className="space-y-2.5">
            {brief.themes.map((theme, i) => (
              <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">&bull;</span>
                {theme}
              </li>
            ))}
          </ul>
        </div>
      )}

      {brief.actions.length > 0 && (
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
      )}
    </div>
  );
}
