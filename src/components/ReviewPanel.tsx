'use client';

import { useState } from 'react';
import { CampaignDraft, SurveyQuestion, QuestionType } from '@/lib/types';
import { useSettings } from '@/lib/useSettings';

interface ReviewPanelProps {
  draft: CampaignDraft;
  onUpdate: (updates: Partial<CampaignDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DEFAULT_CONTEXT_TRIGGERS = [
  { id: 'post-meeting', event: 'post-meeting', label: 'After Team Meeting', description: 'Delivered 2 hours after a scheduled team meeting' },
  { id: 'first-solo-shift', event: 'first-solo-shift', label: 'First Solo Shift', description: 'After first unaccompanied shift' },
  { id: 'post-training', event: 'post-training', label: 'After Training', description: 'Following a training session' },
  { id: 'weekly-pulse', event: 'weekly-pulse', label: 'Weekly Check-In', description: 'Friday afternoon pulse check' },
  { id: 'incident-follow-up', event: 'incident-follow-up', label: 'Incident Follow-Up', description: '24 hours after a critical incident' },
  { id: 'milestone-30-day', event: 'milestone-30-day', label: '30-Day Milestone', description: '30-day mark reflection' },
];

const QUESTION_TYPE_META: Record<QuestionType, { label: string; color: string; icon: string }> = {
  'open': { label: 'Open Response', color: 'text-blue-400 border-blue-400/20 bg-blue-400/5', icon: '💬' },
  'scale': { label: 'Scaled', color: 'text-gold-400 border-gold-500/20 bg-gold-500/5', icon: '📊' },
  'multiple-choice': { label: 'Multiple Choice', color: 'text-purple-400 border-purple-400/20 bg-purple-400/5', icon: '☑️' },
  'yes-no': { label: 'Yes / No', color: 'text-teal-400 border-teal-400/20 bg-teal-400/5', icon: '✓✗' },
  'pulse': { label: 'Pulse', color: 'text-pink-400 border-pink-400/20 bg-pink-400/5', icon: '💓' },
  'reflective': { label: 'Reflective', color: 'text-amber-300 border-amber-300/20 bg-amber-300/5', icon: '🪞' },
  'contextual': { label: 'Contextual', color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5', icon: '🎯' },
};

export default function ReviewPanel({ draft, onUpdate, onNext, onBack }: ReviewPanelProps) {
  const { settings, hasApiKey } = useSettings();
  const [addingCustom, setAddingCustom] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customType, setCustomType] = useState<QuestionType>('open');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showDesignGuide, setShowDesignGuide] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const includedCount = draft.questions.filter((q) => q.included).length;
  const contextualQuestions = draft.questions.filter((q) => q.type === 'contextual');

  const generateQuestions = async () => {
    if (!hasApiKey) return;
    setGenerating(true);
    setGenerateError('');
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intention: draft.intention,
          objective: draft.objective,
          agencyContext: settings.agencyContext || undefined,
          llmProvider: settings.llmProvider,
          llmApiKey: settings.llmApiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate questions');
      onUpdate({ questions: [...draft.questions, ...data.questions] });
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const toggleQuestion = (id: string) => {
    onUpdate({
      questions: draft.questions.map((q) =>
        q.id === id ? { ...q, included: !q.included } : q
      ),
    });
  };

  const deleteQuestion = (id: string) => {
    onUpdate({ questions: draft.questions.filter((q) => q.id !== id) });
  };

  const addCustomQuestion = () => {
    if (!customText.trim()) return;
    const newQ: SurveyQuestion = {
      id: `sq-custom-${Date.now()}`,
      text: customText.trim(),
      type: customType,
      source: 'custom',
      included: true,
    };
    onUpdate({ questions: [...draft.questions, newQ] });
    setCustomText('');
    setCustomType('open');
    setAddingCustom(false);
  };

  const startEdit = (q: SurveyQuestion) => {
    setEditingId(q.id);
    setEditText(q.text);
  };

  const saveEdit = (id: string) => {
    if (!editText.trim()) return;
    onUpdate({
      questions: draft.questions.map((q) =>
        q.id === id ? { ...q, text: editText.trim() } : q
      ),
    });
    setEditingId(null);
    setEditText('');
  };

  const getSourceBadge = (q: SurveyQuestion) => {
    if (q.source === 'practice-center') {
      return { label: 'Practice Center', className: 'bg-navy-700 text-amber-300 border border-amber-300/20' };
    }
    if (q.source === 'ai-generated') {
      return { label: 'AI', className: 'bg-navy-700 text-gold-400 border border-gold-500/20' };
    }
    return { label: 'Custom', className: 'bg-navy-700 text-accent-sage border border-accent-sage/20' };
  };

  // ── Empty State ──────────────────────────────────────────
  if (draft.questions.length === 0 && !addingCustom) {
    return (
      <div className="space-y-5">
        {/* Practice Center guidance */}
        <div className="rounded-lg p-3.5 border border-amber-300/20 bg-amber-300/5">
          <div className="flex items-start gap-2.5">
            <span className="text-lg flex-shrink-0">✦</span>
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-amber-300 mb-1">Practice Center · AIdedEQ</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Questions are guided by the heart and soul of the Practice Center — designed to be
                humane, emotionally intelligent, and rooted in lived experience.
              </p>
            </div>
          </div>
        </div>

        {/* Statement of Need */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
            Statement of Need
          </label>
          <textarea
            value={draft.statementOfNeed}
            onChange={(e) => onUpdate({ statementOfNeed: e.target.value })}
            rows={3}
            className="input-navy w-full px-3 py-2.5 text-sm resize-none"
            placeholder="Describe why this survey matters and what it will accomplish..."
          />
        </div>

        {/* Empty state — generate or add manually */}
        <div className="py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-800 border border-border-gold flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">No questions yet</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto mb-6">
            Generate questions with AI based on your intention and objective, or add them manually.
          </p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            {/* AI Generate button */}
            <button
              onClick={generateQuestions}
              disabled={generating || !hasApiKey}
              className="btn-gold py-3 px-6 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Generate with AI
                </>
              )}
            </button>

            {!hasApiKey && (
              <p className="text-[10px] text-text-muted">
                Set up your API key in Settings (Connection tab) to enable AI generation.
              </p>
            )}

            {generateError && (
              <p className="text-xs text-alert-rose">{generateError}</p>
            )}

            <button
              onClick={() => setAddingCustom(true)}
              className="px-6 py-2.5 rounded-lg text-sm border border-border-medium text-text-muted hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              + Add question manually
            </button>
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium rounded-lg text-text-muted hover:bg-navy-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={true}
            className="btn-gold px-5 py-2 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next: Push survey
          </button>
        </div>
      </div>
    );
  }

  // ── Questions Exist ─────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Practice Center guidance banner */}
      <div className="rounded-lg p-3.5 border border-amber-300/20 bg-amber-300/5">
        <div className="flex items-start gap-2.5">
          <span className="text-lg flex-shrink-0">✦</span>
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-amber-300 mb-1">Practice Center · AIdedEQ</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Questions below are guided by the heart and soul of the Practice Center. They are designed to be
              humane, emotionally intelligent, and rooted in the lived experience of the people being asked.
              Not sterile. Not corporate. These are questions that say: <em className="text-text-primary">we see you.</em>
            </p>
            <button
              onClick={() => setShowDesignGuide(!showDesignGuide)}
              className="mt-2 text-[10px] font-medium text-amber-300 hover:text-amber-200 transition-colors"
            >
              {showDesignGuide ? '▾ Hide design principles' : '▸ View design principles'}
            </button>
            {showDesignGuide && (
              <div className="mt-2 pt-2 border-t border-amber-300/10 space-y-1.5">
                <p className="text-[10px] text-text-muted leading-relaxed">
                  <strong className="text-text-secondary">Warmth over sterility</strong> — Questions should feel like a thoughtful check-in from someone who cares, not a compliance form.
                </p>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  <strong className="text-text-secondary">Invite storytelling</strong> — Reflective and open prompts let people share what matters in their own words.
                </p>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  <strong className="text-text-secondary">Right moment, right question</strong> — Contextual prompts arrive when the experience is fresh, not weeks later.
                </p>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  <strong className="text-text-secondary">Honor the person behind the data</strong> — Pulse checks acknowledge that people have feelings, not just opinions.
                </p>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  <strong className="text-text-secondary">Mix is intentional</strong> — Combine scaled data with reflective depth. Neither alone tells the whole story.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Synthesized Statement of Need */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
          Statement of Need
        </label>
        <p className="text-xs text-text-muted mb-2">
          Synthesized from your intention and objective. Edit as needed.
        </p>
        <textarea
          value={draft.statementOfNeed}
          onChange={(e) => onUpdate({ statementOfNeed: e.target.value })}
          rows={4}
          className="input-navy w-full px-3 py-2.5 text-sm resize-none"
          placeholder="Describe why this survey matters and what it will accomplish..."
        />
      </div>

      {/* Question type legend */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            Survey Questions
          </label>
          <span className="text-xs text-text-muted">
            {includedCount} of {draft.questions.length} included
          </span>
        </div>

        {/* Type pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(Object.entries(QUESTION_TYPE_META) as [QuestionType, { label: string; color: string; icon: string }][]).map(([key, meta]) => {
            const count = draft.questions.filter((q) => q.type === key).length;
            if (count === 0) return null;
            return (
              <span key={key} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${meta.color}`}>
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
                <span className="opacity-60">({count})</span>
              </span>
            );
          })}
        </div>

        <p className="text-xs text-text-muted mb-3">
          Toggle to include/exclude, edit, or delete. Questions are randomly distributed to surveyees to reduce fatigue and increase honesty.
        </p>

        <div className="space-y-2">
          {draft.questions.map((q) => {
            const typeMeta = QUESTION_TYPE_META[q.type];
            const sourceBadge = getSourceBadge(q);
            return (
              <div
                key={q.id}
                className={`card-surface p-3 transition-all ${
                  !q.included ? 'opacity-50' : ''
                }`}
              >
                {editingId === q.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="input-navy w-full px-3 py-2 text-sm resize-none"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-xs text-text-muted hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(q.id)}
                        className="btn-gold px-3 py-1 rounded-lg text-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    {/* Include toggle */}
                    <button
                      onClick={() => toggleQuestion(q.id)}
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        q.included
                          ? 'border-accent-sage bg-accent-sage'
                          : 'border-border-medium bg-transparent'
                      }`}
                    >
                      {q.included && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{q.text}</p>

                      {/* Design note */}
                      {q.designNote && (
                        <p className="text-[10px] text-amber-300/70 italic mt-1 leading-relaxed">
                          {q.designNote}
                        </p>
                      )}

                      {/* Context trigger badge */}
                      {q.contextTrigger && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span className="text-[10px] text-emerald-400">
                            Trigger: {DEFAULT_CONTEXT_TRIGGERS.find((t) => t.event === q.contextTrigger)?.label || q.contextTrigger}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${sourceBadge.className}`}>
                          {sourceBadge.label}
                        </span>
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] border ${typeMeta.color}`}>
                          <span>{typeMeta.icon}</span> {typeMeta.label}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEdit(q)}
                        className="p-1 rounded hover:bg-navy-700 text-text-muted hover:text-gold-400 transition-colors"
                        title="Edit"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="p-1 rounded hover:bg-navy-700 text-text-muted hover:text-alert-rose transition-colors"
                        title="Delete"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons — Generate more + Add custom */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={generateQuestions}
            disabled={generating || !hasApiKey}
            className="flex-1 px-3 py-2 rounded-lg border border-dashed border-gold-500/40 text-xs text-gold-400 hover:bg-navy-800 hover:border-gold-500/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Generate more with AI
              </>
            )}
          </button>
          {!addingCustom && (
            <button
              onClick={() => setAddingCustom(true)}
              className="flex-1 px-3 py-2 rounded-lg border border-dashed border-border-medium text-xs text-text-muted hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              + Add custom question
            </button>
          )}
        </div>

        {generateError && (
          <p className="mt-2 text-xs text-alert-rose">{generateError}</p>
        )}

        {/* Add custom question form */}
        {addingCustom && (
          <div className="mt-3 card-surface p-3 space-y-2">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={2}
              className="input-navy w-full px-3 py-2 text-sm resize-none"
              placeholder="Write a question that honors the person answering..."
              autoFocus
            />
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-text-muted">Type:</label>
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value as QuestionType)}
                className="px-2 py-1 rounded text-[10px] bg-navy-700 border border-border-subtle text-text-primary"
              >
                <option value="open">Open Response</option>
                <option value="scale">Scaled</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="yes-no">Yes / No</option>
                <option value="pulse">Pulse</option>
                <option value="reflective">Reflective</option>
                <option value="contextual">Contextual</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setAddingCustom(false); setCustomText(''); }}
                className="px-3 py-1 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addCustomQuestion}
                disabled={!customText.trim()}
                className="btn-gold px-3 py-1 rounded-lg text-xs disabled:opacity-30"
              >
                Add question
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Context-aware nudges section */}
      <div className="rounded-lg p-3.5 border border-emerald-400/20 bg-emerald-400/5">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h4 className="text-xs font-semibold text-emerald-400">Context-Aware Nudges</h4>
        </div>
        <p className="text-xs text-text-muted leading-relaxed mb-2.5">
          These questions are delivered at the right moment — after a meeting, a milestone, or an event — so the reflection feels natural, not like an assignment.
        </p>
        <div className="space-y-1.5">
          {contextualQuestions.length > 0 ? (
            contextualQuestions.map((q) => (
              <div key={q.id} className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${q.included ? 'bg-emerald-400' : 'bg-navy-600'}`} />
                <span className="text-text-primary truncate flex-1">{q.text}</span>
                <span className="text-[10px] text-emerald-400/60 flex-shrink-0">
                  {DEFAULT_CONTEXT_TRIGGERS.find((t) => t.event === q.contextTrigger)?.label || '—'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-text-muted italic">No contextual questions added yet. Add one above with type &ldquo;Contextual.&rdquo;</p>
          )}
        </div>
        {/* Available triggers */}
        <details className="mt-2.5">
          <summary className="text-[10px] text-emerald-400/70 cursor-pointer hover:text-emerald-400 transition-colors">
            Available event triggers ({DEFAULT_CONTEXT_TRIGGERS.length})
          </summary>
          <div className="mt-1.5 space-y-1">
            {DEFAULT_CONTEXT_TRIGGERS.map((trigger) => (
              <div key={trigger.id} className="text-[10px] text-text-muted pl-2 border-l border-emerald-400/20">
                <span className="text-text-secondary">{trigger.label}</span> — {trigger.description}
              </div>
            ))}
          </div>
        </details>
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium rounded-lg text-text-muted hover:bg-navy-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={includedCount === 0}
          className="btn-gold px-5 py-2 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next: Push survey
        </button>
      </div>
    </div>
  );
}
