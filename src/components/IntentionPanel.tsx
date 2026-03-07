'use client';

import { CampaignDraft } from '@/lib/types';
import { useVoiceRecording } from '@/lib/useVoiceRecording';

interface IntentionPanelProps {
  draft: CampaignDraft;
  onUpdate: (updates: Partial<CampaignDraft>) => void;
  onNext: () => void;
}

export default function IntentionPanel({ draft, onUpdate, onNext }: IntentionPanelProps) {
  const canProceed = draft.intention.trim().length > 0 && draft.objective.trim().length > 0;
  const voice = useVoiceRecording();

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          What is this survey for? What&apos;s your intention?
        </label>
        <div className="relative">
          <textarea
            value={draft.intention}
            onChange={(e) => onUpdate({ intention: e.target.value })}
            placeholder="What do you want to understand from the field? Braindump here or use the mic..."
            rows={4}
            className="input-navy w-full px-3 py-2.5 text-sm resize-none pr-12"
          />
          <button
            onClick={() => voice.isRecording ? voice.stopRecording() : voice.startRecording()}
            className={`absolute right-3 top-3 p-1.5 rounded-lg border transition-colors ${
              voice.isRecording
                ? 'bg-alert-rose/20 border-alert-rose/40 text-alert-rose glow-pulse'
                : 'bg-navy-700 border-border-subtle text-text-muted hover:text-gold-400 hover:border-gold-500/40'
            }`}
            title={voice.isRecording ? 'Stop recording' : 'Voice input'}
          >
            {voice.isRecording ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>
        </div>
        {voice.isRecording && (
          <div className="flex items-center gap-2 mt-1.5 px-2 py-1 rounded bg-alert-rose/10 border border-alert-rose/20">
            <div className="w-2 h-2 rounded-full bg-alert-rose glow-pulse" />
            <span className="text-[10px] text-alert-rose font-medium">Recording {voice.formatDuration(voice.duration)}</span>
          </div>
        )}
        {voice.audioUrl && !voice.isRecording && (
          <div className="flex items-center gap-2 mt-1.5">
            <audio src={voice.audioUrl} controls className="h-8 flex-1" />
            <button onClick={voice.clearRecording} className="text-[10px] text-text-muted hover:text-alert-rose transition-colors">Clear</button>
          </div>
        )}
        {voice.error && <p className="text-[10px] text-alert-rose mt-1">{voice.error}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          What do you need? What outcome will this produce?
        </label>
        <textarea
          value={draft.objective}
          onChange={(e) => onUpdate({ objective: e.target.value })}
          placeholder="Be specific about the outcome you need..."
          rows={3}
          className="input-navy w-full px-3 py-2.5 text-sm resize-none"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="btn-gold px-5 py-2 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Next: Who should be heard?
        </button>
      </div>
    </div>
  );
}
