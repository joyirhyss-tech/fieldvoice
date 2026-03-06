'use client';

import { useState } from 'react';
import { WorkspaceView, ArchiveView, CampaignDraft, ChecklistItem, UserRole } from '@/lib/types';
import { mockCampaigns, mockDailyBrief, mockThemes, mockFollowUps, mockKPIs, mockSurveyQuestions, mockLiveStatus, mockMyParticipation, mockShoutOuts, mockYouSaidWeDid } from '@/lib/mock-data';
import { getRoleConfig } from '@/lib/roles';
import StartConnectCard from '@/components/StartConnectCard';
import SetupPanel from '@/components/SetupPanel';
import ActionRail from '@/components/ActionRail';
import IntentionPanel from '@/components/IntentionPanel';
import AudiencePanel from '@/components/AudiencePanel';
import ReviewPanel from '@/components/ReviewPanel';
import PushPanel from '@/components/PushPanel';
import BeHeardPanel from '@/components/BeHeardPanel';
import DailyBriefNotebook from '@/components/DailyBriefNotebook';
import ContextDrawer from '@/components/ContextDrawer';
import ArchiveSwitcher from '@/components/ArchiveSwitcher';
import ArchiveCardGrid from '@/components/ArchiveCardGrid';
import WorkPlanCard from '@/components/WorkPlanCard';
import MetricTicker from '@/components/MetricTicker';
import ProgressChecklist from '@/components/ProgressChecklist';
import SurveyResponsePanel from '@/components/SurveyResponsePanel';

const emptyDraft: CampaignDraft = {
  intention: '',
  objective: '',
  audience: [],
  windowStart: '',
  windowEnd: '',
  statementOfNeed: '',
  questions: [...mockSurveyQuestions],
};

const SURVEY_STEPS = [
  { key: 'intention', label: 'Intention', number: 1 },
  { key: 'audience', label: 'Audience', number: 2 },
  { key: 'review', label: 'Questions', number: 3 },
  { key: 'push', label: 'Push', number: 4 },
];

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [activeView, setActiveView] = useState<WorkspaceView | null>('home');
  const [archiveView, setArchiveView] = useState<ArchiveView>('voices');
  const [draft, setDraft] = useState<CampaignDraft>({ ...emptyDraft });
  const [pushed, setPushed] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('dop');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [surveyAccepted, setSurveyAccepted] = useState(false);
  const [surveyMethod, setSurveyMethod] = useState('desktop');

  const roleConfig = getRoleConfig(currentRole);

  const checklist: ChecklistItem[] = [
    { key: 'intention', label: 'Intention set', done: draft.intention.trim().length > 0 },
    { key: 'audience', label: 'Audience selected', done: draft.audience.length > 0 },
    { key: 'review', label: 'Questions ready', done: draft.questions.filter((q) => q.included).length > 0 },
    { key: 'pushed', label: 'Pushed', done: pushed },
  ];

  const updateDraft = (updates: Partial<CampaignDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const handlePush = () => {
    setPushed(true);
  };

  // Build participation object with accepted state
  const participationWithState = {
    ...mockMyParticipation,
    currentSurvey: mockMyParticipation.currentSurvey
      ? { ...mockMyParticipation.currentSurvey, accepted: surveyAccepted }
      : null,
  };

  const activeCampaign = mockCampaigns.find((c) => c.status === 'active') || null;

  // Determine the active survey step for the stepper
  const surveyStepKey = ['intention', 'audience', 'review', 'push'].includes(activeView || '')
    ? activeView
    : null;

  const isSurveyFlow = activeView === 'request-fieldvoice' || surveyStepKey !== null;

  if (!connected) {
    return <StartConnectCard onConnect={() => setConnected(true)} />;
  }

  // Determine workspace title and content
  const getWorkspaceTitle = () => {
    switch (activeView) {
      case 'request-fieldvoice':
      case 'intention':
      case 'audience':
      case 'review':
      case 'push':
        return 'Request FieldVoices';
      case 'be-heard':
        return 'Be Heard';
      case 'survey-response':
        return 'Respond';
      case 'daily-brief':
        return 'Daily Brief';
      case 'archive':
        return 'Archive';
      case 'workplan':
        return 'Work Plan';
      default:
        return 'Workspace';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-deep">
      {/* Skip to main content — accessibility */}
      <a href="#main-workspace" className="skip-to-main">
        Skip to main content
      </a>

      {/* Header — clean, no live status (moved to left panel) */}
      <header className="flex items-center justify-between px-5 py-2.5 border-b border-border-subtle bg-navy-900" role="banner">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-navy-800 border border-border-gold flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-500">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-sm font-bold text-text-primary">FieldVoices</h1>
          <span className="text-xs text-text-muted hidden sm:inline">&middot; {roleConfig.label}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted hidden sm:inline">AIdedEQ</span>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-gold bg-navy-800 hover:bg-navy-700 text-gold-400 hover:text-gold-300 transition-all text-xs font-medium hover:shadow-[0_0_10px_var(--gold-glow)]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            Connect FieldVoices
          </button>
        </div>
      </header>

      {/* Main 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Your Attention Please */}
        <aside className={`panel-collapse flex-shrink-0 ${leftCollapsed ? 'w-12' : 'w-60'}`} aria-label="Your attention - navigation and surveys">
          <ActionRail
            activeView={activeView}
            onSelectView={(view) => {
              if (view === 'request-fieldvoice') {
                setActiveView('intention');
              } else {
                setActiveView(view);
              }
            }}
            currentRole={currentRole}
            onRoleChange={(role) => {
              setCurrentRole(role);
              const newRoleConfig = getRoleConfig(role);
              if (!newRoleConfig.canRequest && (activeView === 'intention' || activeView === 'audience' || activeView === 'review' || activeView === 'push' || activeView === 'request-fieldvoice')) {
                setActiveView('home');
              }
            }}
            collapsed={leftCollapsed}
            onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
            myParticipation={participationWithState}
            liveStatus={mockLiveStatus}
            onAcceptSurvey={(method?: string) => {
              setSurveyAccepted(true);
              if (method) setSurveyMethod(method);
              setActiveView('survey-response');
            }}
          />
        </aside>

        {/* Middle panel: Active Work — workspace + work plan */}
        <main id="main-workspace" className="flex-1 overflow-y-auto bg-navy-950/50" role="main" aria-label="Main workspace">
          <div className="max-w-3xl mx-auto p-6">
            {/* Workspace header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">{getWorkspaceTitle()}</h2>
              {activeView === 'daily-brief' && (
                <span className="text-xs text-text-muted">{mockDailyBrief.date}</span>
              )}
            </div>

            {/* Survey step indicator - inside workspace */}
            {isSurveyFlow && !pushed && (
              <div className="mb-6">
                <div className="flex items-center gap-1">
                  {SURVEY_STEPS.map((step, i) => {
                    const isActive = activeView === step.key;
                    const isPast = ['intention', 'audience', 'review', 'push'].indexOf(activeView || '') > i;
                    return (
                      <div key={step.key} className="flex items-center flex-1">
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                            isActive
                              ? 'bg-gold-500 text-navy-950 shadow-[0_0_12px_var(--gold-glow)]'
                              : isPast
                              ? 'bg-accent-sage text-white'
                              : 'bg-navy-700 text-text-muted'
                          }`}>
                            {isPast ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M5 12l5 5L20 7" />
                              </svg>
                            ) : (
                              step.number
                            )}
                          </div>
                          <span className={`text-xs hidden sm:inline ${isActive ? 'text-gold-400 font-medium' : 'text-text-muted'}`}>
                            {step.label}
                          </span>
                        </div>
                        {i < SURVEY_STEPS.length - 1 && (
                          <div className={`h-px flex-1 mx-2 ${isPast ? 'bg-accent-sage' : 'bg-border-subtle'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Workspace content */}
            {activeView === 'intention' && (
              <IntentionPanel
                draft={draft}
                onUpdate={updateDraft}
                onNext={() => setActiveView('audience')}
              />
            )}

            {activeView === 'audience' && (
              <AudiencePanel
                draft={draft}
                onUpdate={updateDraft}
                onNext={() => setActiveView('review')}
                onBack={() => setActiveView('intention')}
              />
            )}

            {activeView === 'review' && (
              <ReviewPanel
                draft={draft}
                onUpdate={updateDraft}
                onNext={() => setActiveView('push')}
                onBack={() => setActiveView('audience')}
              />
            )}

            {activeView === 'push' && (
              <PushPanel
                draft={draft}
                pushed={pushed}
                onPush={handlePush}
                onBack={() => setActiveView('review')}
              />
            )}

            {activeView === 'be-heard' && (
              <BeHeardPanel />
            )}

            {activeView === 'survey-response' && (
              <SurveyResponsePanel
                surveyTitle={mockMyParticipation.currentSurvey?.title || 'Survey'}
                ownerName={mockMyParticipation.currentSurvey?.ownerName || ''}
                questions={mockSurveyQuestions}
                answeredCount={mockMyParticipation.currentSurvey?.questionsAnswered || 0}
                method={surveyMethod}
              />
            )}

            {activeView === 'daily-brief' && (
              <DailyBriefNotebook brief={mockDailyBrief} />
            )}

            {activeView === 'archive' && (
              <div className="space-y-4">
                <ArchiveSwitcher active={archiveView} onSwitch={setArchiveView} />
                <ArchiveCardGrid view={archiveView} />
              </div>
            )}

            {/* Work Plan — now in middle workspace */}
            {activeView === 'workplan' && (
              <div className="space-y-5">
                <div className="rounded-lg p-3 border border-border-subtle bg-navy-800/30">
                  <p className="text-xs text-text-muted leading-relaxed">
                    Action items derived from your FieldVoices surveys. These can be exported to your department workplan, calendar, or meeting agenda.
                  </p>
                </div>
                <WorkPlanCard
                  actions={mockDailyBrief.actions}
                  followUps={mockFollowUps}
                />
              </div>
            )}

            {activeView === 'home' && (
              <div className="space-y-8">
                <div className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-navy-800 border border-border-gold flex items-center justify-center gold-shimmer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-text-primary mb-2">
                    Welcome to your workspace
                  </h2>
                  <p className="text-sm text-text-secondary max-w-md mx-auto mb-8">
                    Select an action from the left panel. {roleConfig.canRequest ? 'Request a FieldVoices survey or submit a Be Heard.' : 'Submit a Be Heard to share your voice.'}
                  </p>

                  {/* Quick action cards on home */}
                  <div className="flex gap-4 justify-center max-w-md mx-auto">
                    {roleConfig.canRequest && (
                      <button
                        onClick={() => setActiveView('intention')}
                        className="card-gold flex-1 p-5 text-left hover:shadow-[0_4px_20px_var(--gold-glow)] transition-all"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500 mb-2">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                          <path d="M8 12l2 2 4-4" />
                        </svg>
                        <h3 className="text-sm font-semibold text-text-primary">Request FieldVoices</h3>
                        <p className="text-xs text-text-muted mt-1">Create a survey</p>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveView('be-heard')}
                      className="card-gold flex-1 p-5 text-left hover:shadow-[0_4px_20px_var(--gold-glow)] transition-all"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500 mb-2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <h3 className="text-sm font-semibold text-text-primary">Be Heard</h3>
                      <p className="text-xs text-text-muted mt-1">Share your voice</p>
                    </button>
                  </div>
                </div>

                {/* Home also shows compact work plan preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Recent Work Plan Items</h3>
                    <button
                      onClick={() => setActiveView('workplan')}
                      className="text-[10px] text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="card-surface p-3">
                    <div className="space-y-2">
                      {mockDailyBrief.actions.slice(0, 2).map((action) => (
                        <div key={action.id} className="flex items-center gap-2 text-xs">
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            action.completed ? 'bg-accent-sage' : 'bg-navy-700 border border-border-medium'
                          }`} />
                          <span className={action.completed ? 'text-text-muted line-through' : 'text-text-primary'}>
                            {action.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress checklist - compact, below survey actions */}
            {isSurveyFlow && !pushed && (
              <div className="mt-4">
                <ProgressChecklist items={checklist} compact />
              </div>
            )}

            {/* Context notes - shown in workspace below main content */}
            {(activeView === 'daily-brief' || activeView === 'home') && (
              <div className="mt-6">
                <ContextDrawer />
              </div>
            )}
          </div>
        </main>

        {/* Right panel: Agency-Wide — shared results, follow-ups, you said/we did */}
        <aside className={`panel-collapse flex-shrink-0 ${rightCollapsed ? 'w-12' : 'w-72'}`}>
          {rightCollapsed ? (
            <div className="flex flex-col items-center py-4 w-12 bg-navy-900 border-l border-border-subtle h-full">
              <button
                onClick={() => setRightCollapsed(false)}
                className="p-2 rounded-lg hover:bg-navy-800 text-text-muted hover:text-gold-400 transition-colors"
                title="Expand panel"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="h-full bg-navy-900 border-l border-border-subtle overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-500">Agency-Wide</h3>
                <button
                  onClick={() => setRightCollapsed(true)}
                  className="p-1 rounded hover:bg-navy-800 text-text-muted hover:text-text-primary transition-colors"
                  title="Collapse panel"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              {/* Shared results — top concerns */}
              <div className="p-4 space-y-3 border-b border-border-subtle">
                <h4 className="text-xs font-medium text-text-secondary">Top Repeated Concerns</h4>
                <div className="space-y-1.5">
                  {mockThemes.slice(0, 4).map((t) => (
                    <div key={t.id} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        t.severity === 'high' || t.severity === 'critical'
                          ? 'bg-alert-rose'
                          : t.severity === 'medium'
                          ? 'bg-gold-500'
                          : 'bg-accent-sage'
                      }`} />
                      <span className="text-xs text-text-primary truncate">{t.theme}</span>
                      <span className="text-xs text-text-muted ml-auto flex-shrink-0">{t.frequency}x</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-ups */}
              {mockFollowUps.length > 0 && (
                <div className="p-4 space-y-3 border-b border-border-subtle">
                  <h4 className="text-xs font-medium text-text-secondary">Scheduled Follow-Ups</h4>
                  <div className="space-y-1.5">
                    {mockFollowUps.map((fu) => (
                      <div key={fu.id} className="flex items-center gap-2 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          fu.type === 'risk' ? 'bg-alert-rose' : 'bg-accent-sage'
                        }`} />
                        <span className="text-text-primary truncate">{fu.theme}</span>
                        <span className="text-text-muted ml-auto flex-shrink-0">{fu.triggerDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* You Said / We Did — functional accountability loop */}
              <div className="p-4" role="region" aria-label="You Said We Did accountability tracker">
                <div className="rounded-lg p-3 border border-gold-500/30 bg-navy-800 shadow-[0_0_16px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(201,168,76,0.08)]">
                  <h4 className="text-xs font-semibold text-gold-400 mb-2">You Said / We Did</h4>
                  <div className="space-y-2.5">
                    {mockYouSaidWeDid.slice(0, 3).map((item) => (
                      <div key={item.id} className="text-xs">
                        <p className="text-text-muted">
                          &ldquo;{item.youSaid}&rdquo;
                        </p>
                        <p className="text-text-primary mt-0.5">
                          &rarr; {item.weDid}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shared metrics */}
              <div className="p-4 border-t border-border-subtle">
                <h4 className="text-xs font-medium text-text-secondary mb-2">Agency Metrics</h4>
                <div className="space-y-2">
                  {mockKPIs.slice(0, 4).map((kpi) => (
                    <div key={kpi.label} className="flex items-center justify-between text-xs">
                      <span className="text-text-muted truncate">{kpi.label}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-text-primary font-medium">{kpi.value}</span>
                        <span className={`text-[10px] ${
                          kpi.trend === 'up' ? 'text-accent-sage' : kpi.trend === 'down' ? 'text-alert-rose' : 'text-text-muted'
                        }`}>
                          {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Bottom ticker — shout-outs from leadership */}
      <MetricTicker shoutOuts={mockShoutOuts} />

      {/* Settings panel overlay */}
      <SetupPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
