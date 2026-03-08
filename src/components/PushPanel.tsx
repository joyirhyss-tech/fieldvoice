'use client';

import { useState } from 'react';
import { CampaignDraft, PushedSurvey } from '@/lib/types';
import { generateShareCode, buildShareUrl } from '@/lib/share';
import { readDocumentsFromStorage } from '@/lib/useDocumentStore';

interface PushPanelProps {
  draft: CampaignDraft;
  pushed: boolean;
  onPush: (pushedSurvey: PushedSurvey) => void;
  onBack: () => void;
}

/** Parse cadence guardrails from the survey-policy document */
function parseCadenceGuardrails() {
  const docs = readDocumentsFromStorage();
  const surveyPolicy = docs.find((d) => d.category === 'survey-policy');
  if (!surveyPolicy || !surveyPolicy.content) {
    return { maxActiveSurveys: Infinity, minDaysBetween: 0, maxQuestions: Infinity, hasPolicy: false };
  }
  const content = surveyPolicy.content;
  const maxMatch = content.match(/maximum\s+(\d+)\s+active/i);
  const minMatch = content.match(/minimum\s+(\d+)\s+days?\s+between/i);
  const qMatch = content.match(/maximum\s+(\d+)\s+questions?\s+per\s+survey/i);
  return {
    maxActiveSurveys: maxMatch ? parseInt(maxMatch[1], 10) : Infinity,
    minDaysBetween: minMatch ? parseInt(minMatch[1], 10) : 0,
    maxQuestions: qMatch ? parseInt(qMatch[1], 10) : Infinity,
    hasPolicy: true,
  };
}

function getActiveSurveyCount(): number {
  try {
    const raw = localStorage.getItem('fieldvoices-pushed-surveys');
    if (!raw) return 0;
    return (JSON.parse(raw) as PushedSurvey[]).filter((s) => s.status === 'active').length;
  } catch { return 0; }
}

function getLastSurveyEndDate(): string | null {
  try {
    const raw = localStorage.getItem('fieldvoices-pushed-surveys');
    if (!raw) return null;
    const surveys = (JSON.parse(raw) as PushedSurvey[])
      .filter((s) => s.status === 'active' || s.status === 'completed')
      .sort((a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime());
    return surveys.length > 0 ? surveys[0].draft.windowEnd : null;
  } catch { return null; }
}

export default function PushPanel({ draft, pushed, onPush, onBack }: PushPanelProps) {
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);

  const includedQuestions = draft.questions.filter((q) => q.included).length;

  // Cadence guardrails from survey-policy document
  const guardrails = parseCadenceGuardrails();
  const cadenceWarnings: string[] = [];

  if (guardrails.hasPolicy) {
    const activeSurveyCount = getActiveSurveyCount();
    if (activeSurveyCount >= guardrails.maxActiveSurveys) {
      cadenceWarnings.push(`Survey policy limits active surveys to ${guardrails.maxActiveSurveys}. Currently ${activeSurveyCount} active.`);
    }
    const lastEndDate = getLastSurveyEndDate();
    if (lastEndDate && guardrails.minDaysBetween > 0 && draft.windowStart) {
      const daysBetween = Math.floor((new Date(draft.windowStart).getTime() - new Date(lastEndDate).getTime()) / (1000 * 60 * 60 * 24));
      if (daysBetween < guardrails.minDaysBetween) {
        cadenceWarnings.push(`Survey policy requires ${guardrails.minDaysBetween}-day gap between surveys. Only ${daysBetween} days since last survey.`);
      }
    }
    if (includedQuestions > guardrails.maxQuestions) {
      cadenceWarnings.push(`Survey policy limits surveys to ${guardrails.maxQuestions} questions. This survey has ${includedQuestions}.`);
    }
  }

  const valid =
    draft.intention.trim().length > 0 &&
    draft.objective.trim().length > 0 &&
    draft.audience.length > 0 &&
    draft.windowStart &&
    draft.windowEnd &&
    includedQuestions > 0;

  const handlePush = () => {
    const code = generateShareCode();
    const url = buildShareUrl(code);
    setShareCode(code);
    setShareUrl(url);

    const pushedSurvey: PushedSurvey = {
      id: `ps-${Date.now()}`,
      draft,
      shareCode: code,
      shareUrl: url,
      pushedAt: new Date().toISOString(),
      pushedBy: 'current-user',
      status: 'active',
    };

    onPush(pushedSurvey);
  };

  const handleCopy = async (text: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  if (pushed) {
    return (
      <div className="space-y-6 py-6">
        {/* Success header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent-sage-light border border-accent-sage/20 flex items-center justify-center glow-pulse" style={{ '--gold-glow': 'rgba(92, 184, 139, 0.25)' } as React.CSSProperties}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-sage">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            Survey pushed
          </h2>
          <p className="text-sm text-text-secondary max-w-sm mx-auto">
            Your campaign is now live. Daily briefs will begin generating once responses arrive.
            Follow-up jobs have been scheduled for day 30.
          </p>
        </div>

        {/* Distribution card */}
        {shareCode && shareUrl && (
          <div className="card-surface p-5 max-w-md mx-auto">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4 text-center">
              Share This Survey
            </h3>

            {/* Share URL */}
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Survey Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-navy-800 border border-border-subtle text-xs text-text-primary font-mono truncate">
                  {shareUrl}
                </div>
                <button
                  onClick={() => handleCopy(shareUrl, 'link')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                    copied === 'link'
                      ? 'bg-accent-sage/20 text-accent-sage border border-accent-sage/30'
                      : 'btn-gold'
                  }`}
                >
                  {copied === 'link' ? (
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      Copied
                    </span>
                  ) : (
                    'Copy Link'
                  )}
                </button>
              </div>
            </div>

            {/* Share Code */}
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Share Code
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-lg bg-navy-800 border border-gold-500/30 text-center text-lg font-mono font-bold text-gold-400 tracking-[0.3em]">
                  {shareCode}
                </div>
                <button
                  onClick={() => handleCopy(shareCode, 'code')}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                    copied === 'code'
                      ? 'bg-accent-sage/20 text-accent-sage border border-accent-sage/30'
                      : 'border border-border-subtle bg-navy-800 text-text-muted hover:text-gold-400 hover:border-gold-500/40'
                  }`}
                >
                  {copied === 'code' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Distribution guidance */}
            <div className="rounded-lg p-3 bg-navy-700/30 border border-border-subtle">
              <p className="text-xs text-text-muted leading-relaxed max-w-[52ch]">
                <strong className="text-text-secondary">How to distribute:</strong> Share the link via email, text, or Slack. Participants can also enter the code at the FieldVoices homepage. All responses are anonymized.
              </p>
            </div>
          </div>
        )}

        {/* Survey details summary */}
        <div className="card-surface p-4 max-w-md mx-auto">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Survey Details</h4>
          <dl className="space-y-2.5 text-xs">
            <div className="flex gap-2">
              <dt className="text-text-muted w-16 flex-shrink-0">Intention</dt>
              <dd className="text-text-secondary truncate">{draft.intention}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-text-muted w-16 flex-shrink-0">Audience</dt>
              <dd className="text-text-secondary">{draft.audience.join(', ')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-text-muted w-16 flex-shrink-0">Window</dt>
              <dd className="text-text-secondary">{draft.windowStart} to {draft.windowEnd}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-text-muted w-16 flex-shrink-0">Questions</dt>
              <dd className="text-text-secondary">{includedQuestions} included</dd>
            </div>
          </dl>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="card-surface p-5">
        <h3 className="text-sm font-medium text-text-primary mb-3">Survey Summary</h3>
        <dl className="space-y-2.5 text-sm">
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Intention</dt>
            <dd className="text-text-primary">{draft.intention}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Objective</dt>
            <dd className="text-text-primary">{draft.objective}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Audience</dt>
            <dd className="text-text-primary">{draft.audience.join(', ') || '\u2014'}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Window</dt>
            <dd className="text-text-primary">{draft.windowStart} to {draft.windowEnd}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-text-muted w-20 flex-shrink-0">Questions</dt>
            <dd className="text-text-primary">{includedQuestions} included</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg p-4 border-l-2 border-accent-sage bg-accent-sage-light">
        <p className="text-xs text-text-secondary">
          On push, FieldVoices will create the campaign, distribute questions randomly to surveyees,
          schedule daily briefs, generate 30-day follow-up jobs, and provide a shareable link and code for distribution.
        </p>
      </div>

      {/* Cadence guardrails from survey policy */}
      {cadenceWarnings.length > 0 && (
        <div className="rounded-lg p-4 border border-gold-500/30 bg-gold-500/5">
          <div className="flex items-start gap-2.5 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-400 flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <h4 className="text-xs font-semibold text-gold-400">Survey Policy Guardrails</h4>
          </div>
          <div className="space-y-1.5 pl-6">
            {cadenceWarnings.map((warning, i) => (
              <p key={i} className="text-xs text-text-secondary leading-relaxed">{warning}</p>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-2 pl-6 italic">
            You can still push, but these guidelines come from your uploaded survey policy.
          </p>
        </div>
      )}

      {guardrails.hasPolicy && cadenceWarnings.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-accent-sage px-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l5 5L20 7" />
          </svg>
          Survey policy compliance verified
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium rounded-lg text-text-muted hover:bg-navy-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePush}
          disabled={!valid}
          className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-accent-sage text-white hover:bg-accent-sage/90 shadow-[0_2px_8px_rgba(92,184,139,0.25)]"
        >
          Push survey
        </button>
      </div>
    </div>
  );
}
