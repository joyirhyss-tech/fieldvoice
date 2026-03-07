'use client';

import { useState } from 'react';
import { SurveyQuestion } from '@/lib/types';
import { useVoiceRecording } from '@/lib/useVoiceRecording';

interface SurveyResponsePanelProps {
  surveyTitle: string;
  ownerName: string;
  questions: SurveyQuestion[];
  answeredCount: number;
  method: string;
}

type ResponsePhase = 'question' | 'follow-up' | 'anything-else' | 'complete';

const MAX_VOICE_SECONDS = 300; // 5 minutes

export default function SurveyResponsePanel({
  surveyTitle,
  ownerName,
  questions,
  answeredCount,
  method,
}: SurveyResponsePanelProps) {
  const includedQuestions = questions.filter((q) => q.included);
  const totalQuestions = includedQuestions.length;
  const [currentIndex, setCurrentIndex] = useState(answeredCount);
  const [phase, setPhase] = useState<ResponsePhase>('question');
  const [response, setResponse] = useState('');
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [anythingElse, setAnythingElse] = useState('');
  const [allDone, setAllDone] = useState(false);
  const voice = useVoiceRecording();

  const currentQuestion = includedQuestions[currentIndex] || null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmitResponse = () => {
    setPhase('follow-up');
    setResponse('');
    voice.clearRecording();
  };

  const handleSubmitFollowUp = () => {
    setPhase('anything-else');
    setFollowUpResponse('');
    voice.clearRecording();
  };

  const handleSkipFollowUp = () => {
    setPhase('anything-else');
  };

  const handleSubmitAnythingElse = () => {
    moveToNext();
  };

  const handleSkipAnythingElse = () => {
    moveToNext();
  };

  const moveToNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalQuestions) {
      setAllDone(true);
      setPhase('complete');
    } else {
      setCurrentIndex(nextIndex);
      setPhase('question');
      setResponse('');
      setFollowUpResponse('');
      setAnythingElse('');
      voice.clearRecording();
    }
  };

  const toggleRecording = () => {
    if (voice.isRecording) {
      voice.stopRecording();
    } else {
      voice.clearRecording();
      voice.startRecording();
    }
  };

  const progressPercent = Math.round(((currentIndex) / totalQuestions) * 100);

  // Generate a contextual follow-up based on the current question
  const getFollowUpQuestion = () => {
    if (!currentQuestion) return 'Can you tell me more about that?';
    switch (currentQuestion.type) {
      case 'scale':
        return 'What would need to change for that number to be higher?';
      case 'reflective':
        return 'Is there anything about that moment you wish had gone differently?';
      case 'pulse':
        return 'What would help you feel more supported right now?';
      case 'open':
        return 'Is there a specific example you can share?';
      case 'yes-no':
        return 'Can you share more about why?';
      case 'contextual':
        return 'How did that experience compare to what you expected?';
      default:
        return 'Can you tell me more about that?';
    }
  };

  // Completed all questions
  if (allDone || phase === 'complete') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-sage/20 border border-accent-sage/30 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-sage">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Thank you for sharing your voice
        </h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto mb-2">
          Your responses to <span className="text-text-primary font-medium">{surveyTitle}</span> have been received.
        </p>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          {ownerName} and your leadership team will review these insights to drive real change. You&apos;ll see outcomes in the &ldquo;You Said / We Did&rdquo; section.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800 border border-border-gold text-xs text-gold-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12l5 5L20 7" />
          </svg>
          {totalQuestions} of {totalQuestions} questions answered
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  // Question type badge colors
  const typeBadge = {
    open: { label: 'Open Response', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    scale: { label: 'Scale', color: 'text-gold-400 bg-gold-400/10 border-gold-400/20' },
    'multiple-choice': { label: 'Multiple Choice', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
    'yes-no': { label: 'Yes / No', color: 'text-teal-400 bg-teal-400/10 border-teal-400/20' },
    pulse: { label: 'Pulse Check', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
    reflective: { label: 'Reflective', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    contextual: { label: 'Contextual', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  }[currentQuestion.type] || { label: 'Question', color: 'text-text-muted bg-navy-700 border-border-subtle' };

  return (
    <div className="space-y-6">
      {/* Survey header with progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-500">{surveyTitle}</h3>
          <span className="text-xs text-text-muted">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-navy-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-sage transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase: Main Question */}
      {phase === 'question' && (
        <div className="space-y-5">
          {/* Question card */}
          <div className="card-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${typeBadge.color}`}>
                {typeBadge.label}
              </span>
              {currentQuestion.source === 'practice-center' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold-500/20 text-gold-400 bg-gold-400/5">
                  Practice Center
                </span>
              )}
            </div>
            <p className="text-base text-text-primary leading-relaxed font-medium">
              {currentQuestion.text}
            </p>
            {currentQuestion.designNote && (
              <p className="text-[10px] text-text-muted mt-2 italic">
                {currentQuestion.designNote}
              </p>
            )}
          </div>

          {/* Response area */}
          <div>
            {/* Scale response */}
            {currentQuestion.type === 'scale' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted">1</span>
                  <span className="text-xs text-text-muted">10</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setResponse(String(n))}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        response === String(n)
                          ? 'border-gold-500 bg-gold-500/20 text-gold-400 shadow-[0_0_8px_var(--gold-glow)]'
                          : 'border-border-subtle bg-navy-800 text-text-muted hover:border-navy-400'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Yes/No response */}
            {currentQuestion.type === 'yes-no' && (
              <div className="flex gap-3 mb-4">
                {['Yes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setResponse(opt)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-all ${
                      response === opt
                        ? 'border-gold-500 bg-gold-500/20 text-gold-400 shadow-[0_0_8px_var(--gold-glow)]'
                        : 'border-border-subtle bg-navy-800 text-text-muted hover:border-navy-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Pulse response — emoji scale */}
            {currentQuestion.type === 'pulse' && (
              <div className="mb-4">
                <div className="flex gap-2 justify-center">
                  {[
                    { emoji: '😔', label: 'Struggling', value: 'struggling' },
                    { emoji: '😐', label: 'Getting by', value: 'getting-by' },
                    { emoji: '🙂', label: 'Okay', value: 'okay' },
                    { emoji: '😊', label: 'Good', value: 'good' },
                    { emoji: '🌟', label: 'Thriving', value: 'thriving' },
                  ].map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setResponse(mood.value)}
                      className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all ${
                        response === mood.value
                          ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_12px_var(--gold-glow)]'
                          : 'border-border-subtle bg-navy-800 hover:border-navy-400'
                      }`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-[9px] text-text-muted">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Text/voice response for open, reflective, contextual, and supplemental for scale/yes-no */}
            <div className="relative">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={
                  currentQuestion.type === 'scale'
                    ? 'Add any thoughts to go with your rating...'
                    : currentQuestion.type === 'yes-no'
                    ? 'Want to explain your answer? (optional)'
                    : currentQuestion.type === 'pulse'
                    ? 'Want to share more about how you\u2019re feeling?'
                    : 'Share your thoughts here, or use the mic...'
                }
                rows={currentQuestion.type === 'open' || currentQuestion.type === 'reflective' ? 5 : 3}
                className="input-navy w-full px-3 py-2.5 text-sm resize-none pr-14"
              />

              {/* Voice input button */}
              {method === 'voice' || method === 'desktop' ? (
                <button
                  onClick={toggleRecording}
                  className={`absolute right-3 top-3 p-2 rounded-lg border transition-all ${
                    voice.isRecording
                      ? 'bg-alert-rose/20 border-alert-rose/50 text-alert-rose glow-pulse'
                      : 'bg-navy-700 border-border-subtle text-text-muted hover:text-gold-400 hover:border-gold-500/40'
                  }`}
                  title={voice.isRecording ? 'Stop recording' : 'Start voice recording'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {voice.isRecording ? (
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    ) : (
                      <>
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </>
                    )}
                  </svg>
                </button>
              ) : null}
            </div>

            {/* Recording indicator */}
            {voice.isRecording && (
              <div className="flex items-center gap-3 mt-2 px-3 py-2 rounded-lg bg-alert-rose/10 border border-alert-rose/20">
                <div className="w-2 h-2 rounded-full bg-alert-rose glow-pulse flex-shrink-0" />
                <span className="text-xs text-alert-rose font-medium">Recording</span>
                <span className="text-xs text-text-muted ml-auto">
                  {formatTime(voice.duration)} / {formatTime(MAX_VOICE_SECONDS)}
                </span>
                <div className="w-24 h-1 rounded-full bg-navy-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-alert-rose transition-all"
                    style={{ width: `${(voice.duration / MAX_VOICE_SECONDS) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {method === 'voice' && !voice.isRecording && (
              <p className="text-[10px] text-text-muted mt-1.5 italic">
                Max 5 min verbal response. Tap the mic to start.
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmitResponse}
              disabled={!response.trim()}
              className="btn-gold px-6 py-2.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Phase: Follow-up Question */}
      {phase === 'follow-up' && (
        <div className="space-y-5">
          <div className="card-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold-500/20 text-gold-400 bg-gold-400/5 font-medium">
                Follow-up
              </span>
            </div>
            <p className="text-base text-text-primary leading-relaxed font-medium">
              {getFollowUpQuestion()}
            </p>
            <p className="text-[10px] text-text-muted mt-2 italic">
              This is a follow-up to help us understand your perspective more deeply. You can skip if you prefer.
            </p>
          </div>

          <div className="relative">
            <textarea
              value={followUpResponse}
              onChange={(e) => setFollowUpResponse(e.target.value)}
              placeholder="Share more if you'd like..."
              rows={4}
              className="input-navy w-full px-3 py-2.5 text-sm resize-none pr-14"
            />
            {(method === 'voice' || method === 'desktop') && (
              <button
                onClick={toggleRecording}
                className={`absolute right-3 top-3 p-2 rounded-lg border transition-all ${
                  voice.isRecording
                    ? 'bg-alert-rose/20 border-alert-rose/50 text-alert-rose glow-pulse'
                    : 'bg-navy-700 border-border-subtle text-text-muted hover:text-gold-400 hover:border-gold-500/40'
                }`}
                title={voice.isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {voice.isRecording ? (
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  ) : (
                    <>
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </>
                  )}
                </svg>
              </button>
            )}
          </div>

          {voice.isRecording && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-alert-rose/10 border border-alert-rose/20">
              <div className="w-2 h-2 rounded-full bg-alert-rose glow-pulse flex-shrink-0" />
              <span className="text-xs text-alert-rose font-medium">Recording</span>
              <span className="text-xs text-text-muted ml-auto">
                {formatTime(voice.duration)} / {formatTime(MAX_VOICE_SECONDS)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={handleSkipFollowUp}
              className="px-4 py-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleSubmitFollowUp}
              disabled={!followUpResponse.trim()}
              className="btn-gold px-6 py-2.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Phase: Anything Else */}
      {phase === 'anything-else' && (
        <div className="space-y-5">
          <div className="card-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-accent-sage/20 text-accent-sage bg-accent-sage/5 font-medium">
                Open Floor
              </span>
            </div>
            <p className="text-base text-text-primary leading-relaxed font-medium">
              Is there anything else you want to add?
            </p>
            <p className="text-[10px] text-text-muted mt-2 italic">
              This is your space. Anything on your mind — about this topic or anything else — is welcome here.
            </p>
          </div>

          <div className="relative">
            <textarea
              value={anythingElse}
              onChange={(e) => setAnythingElse(e.target.value)}
              placeholder="Anything at all — we're listening..."
              rows={4}
              className="input-navy w-full px-3 py-2.5 text-sm resize-none pr-14"
            />
            {(method === 'voice' || method === 'desktop') && (
              <button
                onClick={toggleRecording}
                className={`absolute right-3 top-3 p-2 rounded-lg border transition-all ${
                  voice.isRecording
                    ? 'bg-alert-rose/20 border-alert-rose/50 text-alert-rose glow-pulse'
                    : 'bg-navy-700 border-border-subtle text-text-muted hover:text-gold-400 hover:border-gold-500/40'
                }`}
                title={voice.isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {voice.isRecording ? (
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  ) : (
                    <>
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </>
                  )}
                </svg>
              </button>
            )}
          </div>

          {voice.isRecording && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-alert-rose/10 border border-alert-rose/20">
              <div className="w-2 h-2 rounded-full bg-alert-rose glow-pulse flex-shrink-0" />
              <span className="text-xs text-alert-rose font-medium">Recording</span>
              <span className="text-xs text-text-muted ml-auto">
                {formatTime(voice.duration)} / {formatTime(MAX_VOICE_SECONDS)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={handleSkipAnythingElse}
              className="px-4 py-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              Nothing more — submit
            </button>
            <button
              onClick={handleSubmitAnythingElse}
              disabled={!anythingElse.trim()}
              className="btn-gold px-6 py-2.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Submit & continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
