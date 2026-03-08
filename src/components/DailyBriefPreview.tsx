'use client';

import { useLocalStorage } from '@/lib/useLocalStorage';

interface DailyBriefPreviewProps {
  canEdit?: boolean;
  demoMode?: boolean;
  onViewBrief?: () => void;
  onBack?: () => void;
  themeCount?: number;
  actionCount?: number;
  campaignName?: string;
}

export default function DailyBriefPreview({
  canEdit = false,
  demoMode = false,
  onViewBrief,
  onBack,
  themeCount = 0,
  actionCount = 0,
  campaignName,
}: DailyBriefPreviewProps) {
  const [leadershipMemo] = useLocalStorage<string>('fieldvoices-leadership-memo', '');

  const hasMemo = leadershipMemo && leadershipMemo.trim().length > 0;
  const hasStats = demoMode && (themeCount > 0 || actionCount > 0);

  return (
    <div className="card-surface p-4">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Daily Brief
        </button>
      )}
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
          Daily Brief
        </h4>
        {canEdit && !hasMemo && (
          <span className="text-xs text-text-muted ml-auto">
            Write one from the Daily Brief view
          </span>
        )}
        {onViewBrief && hasMemo && (
          <button
            onClick={onViewBrief}
            className="text-xs text-gold-400 hover:text-gold-300 transition-colors ml-auto"
          >
            View full brief &rarr;
          </button>
        )}
      </div>

      {/* Quick stats — shown in demo mode when data is available */}
      {hasStats && (
        <div className="flex items-center gap-3 mb-3">
          {themeCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-navy-800/40 border border-border-subtle">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              <span className="text-[11px] text-text-secondary font-medium">
                {themeCount} theme{themeCount !== 1 ? 's' : ''} surfaced
              </span>
            </div>
          )}
          {actionCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-navy-800/40 border border-border-subtle">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-sage" />
              <span className="text-[11px] text-text-secondary font-medium">
                {actionCount} action{actionCount !== 1 ? 's' : ''} queued
              </span>
            </div>
          )}
          {campaignName && (
            <span className="text-[11px] text-text-muted ml-auto truncate max-w-[160px]" title={campaignName}>
              {campaignName}
            </span>
          )}
        </div>
      )}

      {/* Memo preview */}
      {hasMemo ? (
        <div className="rounded-lg bg-navy-800/50 p-3 border-l-2 border-gold-500/30">
          <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap" style={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {leadershipMemo}
          </p>
          {onViewBrief && (
            <button
              onClick={onViewBrief}
              className="mt-2 text-xs text-gold-400 hover:text-gold-300 transition-colors"
            >
              Read full brief &rarr;
            </button>
          )}
        </div>
      ) : (
        <div className="py-3 text-center">
          <p className="text-xs text-text-muted italic">
            {demoMode
              ? 'Brief is being generated from this week\u2019s voices\u2026'
              : canEdit
              ? 'No daily brief yet. Write one from the Daily Brief view.'
              : 'No daily brief yet. Your leadership team will post one as voices arrive.'}
          </p>
          {!demoMode && !canEdit && (
            <p className="text-xs text-text-muted mt-1">
              Briefs summarize themes, actions, and shout-outs from active surveys.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
