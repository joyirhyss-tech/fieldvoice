'use client';

import { useState } from 'react';
import { BeHeardRequest, BeHeardStatusUpdate } from '@/lib/types';
import { useVoiceRecording } from '@/lib/useVoiceRecording';
import { scoreSubmission } from '@/lib/scoring';

const ROUTE_INFO = [
  { range: '0–39', label: 'Director of Programs', color: 'text-text-secondary' },
  { range: '40–69', label: 'EVP', color: 'text-gold-400' },
  { range: '70–89', label: 'Executive Director', color: 'text-gold-400' },
  { range: '90+', label: 'Voice Steward + ED', color: 'text-alert-rose' },
];

interface BeHeardPanelProps {
  demoMode?: boolean;
  demoSubmissions?: BeHeardRequest[];
  demoStatuses?: BeHeardStatusUpdate[];
}

export default function BeHeardPanel({ demoMode, demoSubmissions, demoStatuses }: BeHeardPanelProps) {
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showTracker, setShowTracker] = useState(demoMode || false);
  const [submissions, setSubmissions] = useState<BeHeardRequest[]>(demoMode ? (demoSubmissions || []) : []);
  const statuses: BeHeardStatusUpdate[] = demoMode ? (demoStatuses || []) : [];
  const voice = useVoiceRecording();

  const handleSubmit = () => {
    if (!content.trim()) return;
    const { score, routedTo } = scoreSubmission(content.trim());
    const newSubmission: BeHeardRequest = {
      id: `bh-${Date.now()}`,
      submittedBy: 'anonymous',
      content: content.trim(),
      score,
      routedTo,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent-sage-light border border-accent-sage/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-sage" aria-hidden="true">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          You&apos;ve been heard
        </h2>
        <p className="text-sm text-text-secondary max-w-sm mx-auto mb-2">
          Your concern has been received and scored. It will be routed to the appropriate person based on urgency and policy alignment.
        </p>
        <p className="text-xs text-text-muted max-w-sm mx-auto mb-6">
          You can track the status of your submissions below. When action is taken, you&apos;ll see it in &ldquo;You Said / We Did.&rdquo;
        </p>

        {/* Routing transparency */}
        <div className="max-w-sm mx-auto mb-6">
          <div className="card-surface p-4 text-left">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">How routing works</h3>
            <div className="space-y-2">
              {ROUTE_INFO.map((route) => (
                <div key={route.range} className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Score {route.range}</span>
                  <span className={route.color}>{route.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setSubmitted(false); setContent(''); }}
            className="btn-navy px-5 py-2 rounded-lg text-sm"
          >
            Submit another
          </button>
          <button
            onClick={() => { setSubmitted(false); setShowTracker(true); }}
            className="px-5 py-2 rounded-lg text-sm border border-gold-500/30 text-gold-400 hover:bg-navy-800 transition-colors"
          >
            Track my submissions
          </button>
        </div>
      </div>
    );
  }

  if (showTracker) {
    return (
      <div className="space-y-5" role="region" aria-label="Submission tracker">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Your Submissions</h3>
          <button
            onClick={() => setShowTracker(false)}
            className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
          >
            &larr; Back to Be Heard
          </button>
        </div>
        <p className="text-xs text-text-muted">
          Track what happened with your voice. All submissions are anonymous. Only you can see your own history here.
        </p>

        {submissions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-text-muted">No submissions yet. Share your voice above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((request) => {
              const statusUpdate = statuses.find((s) => s.requestId === request.id);
              const statusColors: Record<string, string> = {
                'pending': 'bg-navy-600',
                'received': 'bg-navy-500',
                'under-review': 'bg-gold-500',
                'action-planned': 'bg-gold-400',
                'resolved': 'bg-accent-sage',
                'communicated': 'bg-accent-sage',
                'reviewed': 'bg-gold-500',
                'actioned': 'bg-accent-sage',
                'escalated': 'bg-alert-rose',
              };
              const statusLabels: Record<string, string> = {
                'pending': 'Received',
                'reviewed': 'Under Review',
                'actioned': 'Action Taken',
                'escalated': 'Escalated',
              };

              // Escalation timer — show aging indicator for unresolved submissions
              const daysPending = Math.floor(
                (Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60 * 24)
              );
              const isResolved = request.status === 'actioned' || request.status === 'escalated';
              const escalationLevel = isResolved ? 'resolved' : daysPending >= 7 ? 'critical' : daysPending >= 3 ? 'warning' : 'normal';

              return (
                <div key={request.id} className="card-surface p-4" role="article">
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${statusColors[request.status] || 'bg-navy-600'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary leading-relaxed">{request.content}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[11px] text-text-muted">{request.createdAt}</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-navy-700 text-text-secondary font-medium">
                          {statusLabels[request.status] || request.status}
                        </span>
                        {escalationLevel === 'warning' && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-gold-500/20 text-gold-400 font-medium">
                            {daysPending}d pending
                          </span>
                        )}
                        {escalationLevel === 'critical' && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-alert-rose/20 text-alert-rose font-medium animate-pulse">
                            {daysPending}d, needs attention
                          </span>
                        )}
                      </div>
                      {statusUpdate && (
                        <div className="mt-2 rounded bg-navy-700/50 p-3 border-l-2 border-accent-sage/40">
                          <p className="text-[11px] text-text-secondary leading-relaxed">{statusUpdate.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="be-heard-input" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          What do you need to share?
        </label>
        <p className="text-sm text-text-secondary mb-3">
          This is your space. Share a concern, observation, or positive feedback. Everything is confidential and routed by priority.
        </p>
        <div className="relative">
          <textarea
            id="be-heard-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type what's on your mind, or use the mic..."
            rows={6}
            className="input-navy w-full px-3 py-2.5 text-sm resize-none pr-12"
            aria-describedby="be-heard-help"
          />
          <button
            onClick={() => voice.isRecording ? voice.stopRecording() : voice.startRecording()}
            className={`absolute right-3 top-3 p-1.5 rounded-lg border transition-colors ${
              voice.isRecording
                ? 'bg-alert-rose/20 border-alert-rose/40 text-alert-rose glow-pulse'
                : 'bg-navy-700 border-border-subtle text-text-muted hover:text-gold-400 hover:border-gold-500/40'
            }`}
            aria-label={voice.isRecording ? 'Stop voice recording' : 'Start voice recording'}
          >
            {voice.isRecording ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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
            <span className="text-xs text-alert-rose font-medium">Recording {voice.formatDuration(voice.duration)}</span>
          </div>
        )}
        {voice.audioUrl && !voice.isRecording && (
          <div className="flex items-center gap-2 mt-1.5">
            <audio src={voice.audioUrl} controls className="h-8 flex-1" />
            <button onClick={voice.clearRecording} className="text-xs text-text-muted hover:text-alert-rose transition-colors">Clear</button>
          </div>
        )}
        {voice.error && <p className="text-xs text-alert-rose mt-1">{voice.error}</p>}
        <p id="be-heard-help" className="text-[11px] text-text-muted mt-1.5 max-w-[52ch]">
          Your submission is anonymous and scored automatically. Higher urgency items are routed to senior leadership. You can track the status of your submissions after submitting.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowTracker(true)}
          className="text-xs text-text-muted hover:text-gold-400 transition-colors"
        >
          Track my submissions
        </button>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="btn-gold px-6 py-2.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
