'use client';

interface GettingStartedCardProps {
  onOpenSettings: () => void;
  onEnableDemo: () => void;
}

/**
 * Connect to FieldVoices — shown on first workspace visit (non-demo).
 * Primary action: open SetupPanel to upload documents, assign roles, connect.
 * Secondary: explore the demo with sample data.
 */
export default function GettingStartedCard({ onOpenSettings, onEnableDemo }: GettingStartedCardProps) {
  return (
    <div className="card-gold p-6">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-400">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-gold-400">
          Connect to FieldVoices
        </h4>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed mb-5">
        Upload your organization&apos;s documents, policies, and strategic plans. Assign staff roles and connect your data sources to power the FieldVoices engine.
      </p>

      <div className="space-y-2">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg bg-gradient-to-r from-gold-500/20 to-gold-500/10 border border-gold-500/40 hover:border-gold-500/60 hover:from-gold-500/25 hover:to-gold-500/15 hover:shadow-[0_0_16px_var(--gold-glow)] transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/25 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-400">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gold-400">Start connecting</p>
            <p className="text-xs text-text-muted">Upload documents, assign roles, connect data</p>
          </div>
        </button>

        <button
          onClick={onEnableDemo}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-navy-800 border border-border-subtle hover:border-accent-sage/40 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-sage/10 border border-accent-sage/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-sage/20 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-sage">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-text-primary">Explore the demo</p>
            <p className="text-xs text-text-muted">See realistic data from an 18-person nonprofit pilot</p>
          </div>
        </button>
      </div>
    </div>
  );
}
