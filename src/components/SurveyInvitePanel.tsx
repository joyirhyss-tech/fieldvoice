'use client';

import { useState } from 'react';
import { PushedSurvey } from '@/lib/types';

interface SurveyInvitePanelProps {
  onAccept?: (method: string, cadence: string) => void;
  demoMode?: boolean;
  pushedSurvey?: PushedSurvey | null;
}

// Cadence → nudge count for a 14-day window
const CADENCE_NUDGES: Record<string, number> = {
  daily: 14,
  'every-other': 7,
  'twice-weekly': 4,
  weekly: 2,
};

const CADENCE_LABELS: Record<string, string> = {
  daily: 'daily',
  'every-other': 'every other day',
  'twice-weekly': 'twice a week',
  weekly: 'weekly',
};

const CADENCE_DESCRIPTIONS: Record<string, (count: number, endDate: string) => string> = {
  daily: (count, endDate) => `Between now and ${endDate}, you will receive one nudge per day, for a total of ${count} nudges.`,
  'every-other': (count, endDate) => `Between now and ${endDate}, you will receive a nudge every other day, for a total of ${count} nudges.`,
  'twice-weekly': (count, endDate) => `Between now and ${endDate}, you will receive two nudges per week, for a total of ${count} nudges.`,
  weekly: (count, endDate) => `Between now and ${endDate}, you will receive one nudge per week, for a total of ${count} nudges.`,
};

const CADENCE_FIRST_NUDGE: Record<string, string> = {
  daily: 'Your first nudge will arrive within the next 24 hours.',
  'every-other': 'Your first nudge will arrive within the next two days.',
  'twice-weekly': 'Your first nudge will arrive at your next scheduled time this week.',
  weekly: 'Your first nudge will arrive within the next seven days.',
};

export default function SurveyInvitePanel({ onAccept, demoMode: demoProp = false, pushedSurvey }: SurveyInvitePanelProps) {
  const [localDemo, setLocalDemo] = useState(false);
  const demoMode = demoProp || localDemo;
  const [selectedCadence, setSelectedCadence] = useState('daily');
  const [selectedMethod, setSelectedMethod] = useState('desktop');
  const [showThankYou, setShowThankYou] = useState(false);
  const [showCreatorNotes, setShowCreatorNotes] = useState(false);
  const [nudgeTimingMode, setNudgeTimingMode] = useState<'preset' | 'moments'>('preset');
  const [selectedPresetTime, setSelectedPresetTime] = useState('morning');
  const [selectedMoment, setSelectedMoment] = useState('after-meetings');

  // Demo survey data
  const demoEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const demoEndLabel = demoEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const todayLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const nudgeCount = CADENCE_NUDGES[selectedCadence] || 10;

  // Use real pushed survey data when available, fall back to demo defaults
  const surveyTitle = pushedSurvey?.draft.intention || 'Team Pulse Check';
  const surveyOwner = pushedSurvey?.pushedBy || 'your leadership team';
  const questionCount = pushedSurvey
    ? pushedSurvey.draft.questions.filter((q) => q.included).length
    : 0;
  const windowEndLabel = pushedSurvey?.draft.windowEnd
    ? new Date(pushedSurvey.draft.windowEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : demoEndLabel;
  const windowStartLabel = pushedSurvey?.draft.windowStart
    ? new Date(pushedSurvey.draft.windowStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : todayLabel;

  // Thank You interstitial after accepting
  if (showThankYou) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <div className="card-gold p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent-sage/20 border border-accent-sage/30 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-sage">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-text-primary mb-2">
            Thank You for Participating
          </h2>

          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Your voice matters and will directly impact organizational decisions and actions.
          </p>

          <div className="rounded-lg bg-navy-800/50 p-4 border border-border-subtle text-left mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
              What happens next
            </h4>
            <p className="text-sm text-accent-sage font-medium mb-3">
              {CADENCE_FIRST_NUDGE[selectedCadence]}
            </p>
            <ul className="space-y-3 text-xs text-text-secondary">
              <li className="flex items-start gap-2.5">
                <span className="text-accent-sage mt-0.5 flex-shrink-0">&#x2022;</span>
                <span>{CADENCE_DESCRIPTIONS[selectedCadence]?.(nudgeCount, demoEndLabel)}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-sage mt-0.5 flex-shrink-0">&#x2022;</span>
                <span>Please spend <strong className="text-text-primary">no more than 5 minutes</strong> replying to each prompt question</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-sage mt-0.5 flex-shrink-0">&#x2022;</span>
                <span>Missed nudges will remain in your workspace until completed</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-sage mt-0.5 flex-shrink-0">&#x2022;</span>
                <span>Your responses are synthesized, not shared individually</span>
              </li>
            </ul>
          </div>

          {/* Need more context button */}
          <button
            onClick={() => setShowCreatorNotes(!showCreatorNotes)}
            className="text-xs text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-2 mb-4 inline-block"
          >
            {showCreatorNotes ? 'Hide creator notes' : 'Need more context?'}
          </button>

          {showCreatorNotes && (
            <div className="rounded-lg bg-navy-800/50 p-4 border-l-2 border-gold-500/30 text-left mb-4">
              <p className="text-xs text-text-muted mb-1">Notes from the survey creator:</p>
              <p className="text-xs text-text-secondary italic leading-relaxed max-w-[52ch]">
                We&apos;ve noticed some patterns in recent team conversations that we want to better understand. This survey is designed to give everyone a safe, anonymous way to share how they&apos;re really doing. Your honesty helps us make meaningful changes.
              </p>
            </div>
          )}

          <button
            onClick={() => onAccept?.(selectedMethod, selectedCadence)}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-accent-sage text-white hover:bg-accent-sage/90 transition-all shadow-[0_2px_12px_rgba(92,184,139,0.3)]"
          >
            Start Responding
          </button>
        </div>
      </div>
    );
  }

  // Empty state — no pending survey invitations
  if (!demoMode) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-navy-800 border border-border-subtle flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-2">No Survey Invitations</h3>
        <p className="text-sm text-text-muted max-w-sm mx-auto mb-6">
          When a FieldVoices survey is sent to you, it will appear here. You&apos;ll choose your preferred cadence and response method before participating.
        </p>
        <button
          onClick={() => setLocalDemo(true)}
          className="text-xs text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-2"
        >
          Preview the invite experience &rarr;
        </button>
      </div>
    );
  }

  // Demo survey invite
  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Demo banner + back link — only show back link if user manually entered preview */}
      <div className="flex items-center justify-between">
        {!demoProp ? (
          <button
            onClick={() => {
              setLocalDemo(false);
              setShowThankYou(false);
              setShowCreatorNotes(false);
            }}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            &larr; Back to empty state
          </button>
        ) : (
          <div />
        )}
        {!demoProp && (
          <span className="text-[11px] uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded">
            Preview
          </span>
        )}
      </div>

      <div className="card-gold p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-sage glow-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-sage">
            Your voice is needed
          </span>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {surveyTitle}
        </h3>

        {/* Owner info */}
        <div className="rounded-lg bg-navy-800/50 p-3 border-l-2 border-accent-sage/40 mb-4">
          <p className="text-xs text-text-muted mb-0.5">From {surveyOwner}</p>
          <p className="text-xs text-text-secondary italic leading-relaxed">
            &ldquo;Your honest feedback will directly shape our next steps. We&rsquo;re listening.&rdquo;
          </p>
        </div>

        {/* Window */}
        <div className="text-xs text-text-muted mb-4">
          Survey Window: {windowStartLabel} to {windowEndLabel}{questionCount > 0 ? ` · ${questionCount} questions` : ''}
        </div>

        {/* Cadence selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-text-secondary mb-2">
            How often would you like nudges?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'daily', label: 'Daily' },
              { value: 'every-other', label: 'Alt Days' },
              { value: 'twice-weekly', label: '2x/wk' },
              { value: 'weekly', label: 'Weekly' },
            ].map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCadence(c.value)}
                className={`px-3 py-2.5 rounded-lg text-xs border transition-all text-center ${
                  selectedCadence === c.value
                    ? 'border-accent-sage bg-accent-sage/10 text-accent-sage font-medium shadow-[0_0_8px_rgba(92,184,139,0.15)]'
                    : 'border-border-subtle text-text-muted hover:border-border-medium hover:text-text-secondary'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-2">
            {CADENCE_DESCRIPTIONS[selectedCadence]?.(nudgeCount, demoEndLabel)}
          </p>
        </div>

        {/* Cadence optimizer — when to receive nudges */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-text-secondary mb-2">
            When would you like to receive nudges?
          </label>

          {/* Mode toggle: Preset Times vs After Key Moments */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setNudgeTimingMode('preset')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs border transition-all text-center ${
                nudgeTimingMode === 'preset'
                  ? 'border-accent-sage bg-accent-sage/10 text-accent-sage font-medium shadow-[0_0_8px_rgba(92,184,139,0.15)]'
                  : 'border-border-subtle text-text-muted hover:border-border-medium hover:text-text-secondary'
              }`}
            >
              Preset Times
            </button>
            <button
              onClick={() => setNudgeTimingMode('moments')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs border transition-all text-center ${
                nudgeTimingMode === 'moments'
                  ? 'border-accent-sage bg-accent-sage/10 text-accent-sage font-medium shadow-[0_0_8px_rgba(92,184,139,0.15)]'
                  : 'border-border-subtle text-text-muted hover:border-border-medium hover:text-text-secondary'
              }`}
            >
              After Key Moments
            </button>
          </div>

          {/* Preset time windows */}
          {nudgeTimingMode === 'preset' && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'morning', label: 'Morning', desc: '8 \u2013 10 am' },
                { value: 'midday', label: 'Midday', desc: '11 am \u2013 1 pm' },
                { value: 'afternoon', label: 'Afternoon', desc: '2 \u2013 4 pm' },
                { value: 'evening', label: 'Evening', desc: '5 \u2013 7 pm' },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedPresetTime(t.value)}
                  className={`px-3 py-2.5 rounded-lg text-xs border transition-all text-left ${
                    selectedPresetTime === t.value
                      ? 'border-accent-sage bg-accent-sage/10 text-accent-sage font-medium shadow-[0_0_8px_rgba(92,184,139,0.15)]'
                      : 'border-border-subtle text-text-muted hover:border-border-medium hover:text-text-secondary'
                  }`}
                >
                  <span className="block font-medium">{t.label}</span>
                  <span className="block text-[11px] opacity-70">{t.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* After key moments */}
          {nudgeTimingMode === 'moments' && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'after-meetings', label: 'After team meetings' },
                { value: 'after-programming', label: 'After programming time' },
                { value: 'after-office-hours', label: 'After office hours' },
                { value: 'custom', label: 'Custom (let me choose)' },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedMoment(m.value)}
                  className={`px-3 py-2.5 rounded-lg text-xs border transition-all text-left ${
                    selectedMoment === m.value
                      ? 'border-accent-sage bg-accent-sage/10 text-accent-sage font-medium shadow-[0_0_8px_rgba(92,184,139,0.15)]'
                      : 'border-border-subtle text-text-muted hover:border-border-medium hover:text-text-secondary'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Method selector */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-text-secondary mb-2">
            How do you want to respond?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'desktop', label: 'Desktop', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              )},
              { value: 'text', label: 'Text', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
              )},
              { value: 'email', label: 'Email', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
              )},
              { value: 'voice', label: 'Voice', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
              )},
            ].map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMethod(m.value)}
                className={`px-3 py-2.5 rounded-lg text-xs border transition-all text-center flex flex-col items-center ${
                  selectedMethod === m.value
                    ? 'border-accent-sage bg-accent-sage/10 text-accent-sage font-medium shadow-[0_0_8px_rgba(92,184,139,0.15)]'
                    : 'border-border-subtle text-text-muted hover:border-border-medium hover:text-text-secondary'
                }`}
              >
                <span className="block mb-1">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
          {selectedMethod === 'voice' && (
            <p className="text-xs text-text-muted mt-2 italic">
              Max 5 min verbal response per prompt
            </p>
          )}
        </div>

        {/* Accept button — shows Thank You interstitial */}
        <button
          onClick={() => setShowThankYou(true)}
          className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-accent-sage text-white hover:bg-accent-sage/90 transition-all shadow-[0_2px_12px_rgba(92,184,139,0.3)]"
        >
          Accept &amp; Start Listening
        </button>
      </div>
    </div>
  );
}
