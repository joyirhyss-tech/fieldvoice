'use client';

import { useState } from 'react';
import { SurveyCategory } from '@/lib/types';
import {
  SURVEY_TEMPLATES,
  QUESTION_BANK,
  CATEGORY_LABELS,
  getAllTopics,
} from '@/lib/survey-bank-data';

type BankTab = 'templates' | 'questions';

export default function SurveyBank() {
  const [activeTab, setActiveTab] = useState<BankTab>('templates');
  const [selectedCategory, setSelectedCategory] = useState<SurveyCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const categories: (SurveyCategory | 'all')[] = ['all', 'internal', 'program', 'community'];
  const topics = getAllTopics();

  const filteredTemplates = SURVEY_TEMPLATES.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredQuestions = QUESTION_BANK.filter((q) => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase()) && !q.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Best practice header */}
      <div className="rounded-lg p-4 border border-gold-500/20 bg-navy-800/30">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <h4 className="text-xs font-semibold text-gold-400">Best Practice</h4>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          Limit surveys to 5-10 questions. Allow 2-4 weeks between surveys for the same audience.
          Mix question types for richer data. Always communicate results back to participants.
        </p>
      </div>

      {/* Tab toggle */}
      <div className="flex rounded-lg border border-border-subtle overflow-hidden">
        {(['templates', 'questions'] as BankTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'bg-navy-800 text-gold-400 border-b-2 border-gold-500'
                : 'bg-navy-900 text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab === 'templates' ? 'Templates' : 'Question Bank'}
          </button>
        ))}
      </div>

      {/* Category filter + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                selectedCategory === cat
                  ? 'border-gold-500/50 bg-navy-800 text-gold-400'
                  : 'border-border-subtle text-text-muted hover:border-border-medium'
              }`}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="input-navy px-3 py-1.5 text-xs flex-1"
        />
      </div>

      {/* Templates tab */}
      {activeTab === 'templates' && (
        <div className="space-y-3">
          {filteredTemplates.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-8">No templates match your search.</p>
          ) : (
            filteredTemplates.map((template) => (
              <div key={template.id} className="card-surface overflow-hidden">
                <button
                  onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider ${
                          template.category === 'internal'
                            ? 'bg-accent-sage/10 text-accent-sage border border-accent-sage/20'
                            : template.category === 'program'
                            ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                            : 'bg-navy-700 text-text-muted border border-border-subtle'
                        }`}>
                          {template.category}
                        </span>
                        <span className="text-[10px] text-text-muted">{template.questions.length} questions</span>
                      </div>
                      <h4 className="text-sm font-medium text-text-primary">{template.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{template.description}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-text-muted flex-shrink-0 transition-transform ${expandedTemplate === template.id ? 'rotate-180' : ''}`}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {expandedTemplate === template.id && (
                  <div className="px-4 pb-4 border-t border-border-subtle pt-3 space-y-3">
                    {/* Best practice info */}
                    <div className="rounded-lg bg-navy-800/40 p-3 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-400">
                          <path d="M12 8v4l3 3" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        <p className="text-[10px] text-gold-400 font-medium">Frequency: {template.frequencyGuidance}</p>
                      </div>
                      <p className="text-[10px] text-text-muted">{template.bestPracticeNotes}</p>
                    </div>

                    {/* Questions preview */}
                    <div className="space-y-1.5">
                      {template.questions.map((q, i) => (
                        <div key={q.id} className="flex items-start gap-2 text-xs">
                          <span className="text-text-muted w-4 text-right flex-shrink-0">{i + 1}.</span>
                          <span className="text-text-secondary flex-1">{q.text}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-700 text-text-muted flex-shrink-0">{q.type}</span>
                        </div>
                      ))}
                    </div>

                    <button className="btn-gold w-full py-2 rounded-lg text-xs">
                      Use Template
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Questions tab */}
      {activeTab === 'questions' && (
        <div className="space-y-2">
          {filteredQuestions.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-8">No questions match your search.</p>
          ) : (
            filteredQuestions.map((question) => (
              <div key={question.id} className="card-surface p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-primary leading-relaxed">{question.text}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      question.category === 'internal'
                        ? 'bg-accent-sage/10 text-accent-sage'
                        : question.category === 'program'
                        ? 'bg-gold-500/10 text-gold-400'
                        : 'bg-navy-700 text-text-muted'
                    }`}>
                      {question.category}
                    </span>
                    <span className="text-[9px] text-text-muted">{question.topic}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-700 text-text-muted">{question.type}</span>
                  </div>
                </div>
                <button
                  className="btn-navy px-2.5 py-1.5 rounded text-[10px] flex-shrink-0"
                  title="Add to survey"
                >
                  + Add
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
