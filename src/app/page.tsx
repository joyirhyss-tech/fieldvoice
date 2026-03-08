'use client';

import { useState, useEffect, useCallback } from 'react';
import { WorkspaceView, ArchiveView, CampaignDraft, ChecklistItem, LoggedInUser, PushedSurvey } from '@/lib/types';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { getRoleConfig } from '@/lib/roles';
import { getRotatingQuote } from '@/lib/quotes';
import { useTranslation } from '@/lib/i18n';
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
import MetricTicker from '@/components/MetricTicker';
import ProgressChecklist from '@/components/ProgressChecklist';
import SurveyResponsePanel from '@/components/SurveyResponsePanel';
import SurveyInvitePanel from '@/components/SurveyInvitePanel';
import MyImpactPlan from '@/components/MyImpactPlan';
import YourContributions from '@/components/YourContributions';
import SurveyBank from '@/components/SurveyBank';
import PersonalNotes from '@/components/PersonalNotes';
import DailyBriefPreview from '@/components/DailyBriefPreview';
import MobileNav from '@/components/MobileNav';
import MobileAgencySheet from '@/components/MobileAgencySheet';
import ErrorBoundary from '@/components/ErrorBoundary';
import ViewTransition from '@/components/ViewTransition';
import VoiceStewardDashboard from '@/components/VoiceStewardDashboard';
import GettingStartedCard from '@/components/GettingStartedCard';
import PeopleClusterIcon from '@/components/PeopleClusterIcon';
import {
  isDemoMode,
  seedDemoData,
  clearDemoData,
  DEMO_CAMPAIGN_STATS,
  DEMO_THEMES,
  DEMO_KPIS,
  DEMO_YOU_SAID_WE_DID,
  DEMO_FOLLOW_UPS,
  DEMO_SHOUT_OUTS,
  DEMO_BE_HEARD,
  DEMO_BE_HEARD_STATUSES,
  DEMO_ARCHIVE_VOICES,
  DEMO_ARCHIVE_CONCERNS,
  DEMO_ARCHIVE_SOLUTIONS,
} from '@/lib/demo-data';

const emptyDraft: CampaignDraft = {
  intention: '',
  objective: '',
  audience: [],
  windowStart: '',
  windowEnd: '',
  statementOfNeed: '',
  questions: [],
};

const SURVEY_STEPS = [
  { key: 'intention', label: 'Intention', number: 1 },
  { key: 'audience', label: 'Audience', number: 2 },
  { key: 'review', label: 'Questions', number: 3 },
  { key: 'push', label: 'Push', number: 4 },
];

// Empty defaults for dashboard sections
const emptyDailyBrief = {
  id: '',
  campaignId: '',
  date: new Date().toISOString().split('T')[0],
  themes: [],
  actions: [],
  regulationAlert: false,
};

const emptyLiveStatus = {
  activeFieldVoices: 0,
  totalParticipants: 0,
  totalResponses: 0,
  campaigns: [],
};

const emptyParticipation = {
  activeSurveys: 0,
  pendingQuestions: 0,
  lastResponseDate: '',
  currentSurvey: null,
};

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useLocalStorage<LoggedInUser | null>('fieldvoices-session', null);
  const [activeView, setActiveView] = useState<WorkspaceView | null>('home');
  const [archiveView, setArchiveView] = useState<ArchiveView>('voices');
  const [draft, setDraft] = useLocalStorage<CampaignDraft>('fieldvoices-draft', emptyDraft);
  const [pushed, setPushed] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [surveyAccepted, setSurveyAccepted] = useState(false);
  const [surveyMethod, setSurveyMethod] = useState('desktop');
  const [demoMode, setDemoMode] = useState(() => isDemoMode());
  const [activePushedSurvey, setActivePushedSurvey] = useState<PushedSurvey | null>(null);

  const { t } = useTranslation();
  const [mobileAgencyOpen, setMobileAgencyOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Home workspace accordion states (collapsed by default)
  const [contributionsOpen, setContributionsOpen] = useState(false);
  const [personalNotesOpen, setPersonalNotesOpen] = useState(false);
  const [quoteFade, setQuoteFade] = useState<'visible' | 'fading' | 'gone'>('visible');

  // Wait for useLocalStorage to hydrate from localStorage before rendering
  useEffect(() => { setHydrated(true); }, []);

  // Quote fade: start fading at 5s, fully gone at 10s
  useEffect(() => {
    const fadeTimer = setTimeout(() => setQuoteFade('fading'), 5000);
    const goneTimer = setTimeout(() => setQuoteFade('gone'), 10000);
    return () => { clearTimeout(fadeTimer); clearTimeout(goneTimer); };
  }, []);

  // Hydrate active pushed survey from localStorage (demo continuity across reloads)
  useEffect(() => {
    if (!demoMode) return;
    try {
      const raw = localStorage.getItem('fieldvoices-pushed-surveys');
      if (raw) {
        const surveys: PushedSurvey[] = JSON.parse(raw);
        const active = surveys.find((s) => s.status === 'active');
        if (active) { setActivePushedSurvey(active); setPushed(true); }
      }
    } catch { /* non-critical */ }
  }, [demoMode]);

  const currentRole = loggedInUser?.role || 'ed';
  const roleConfig = getRoleConfig(currentRole);

  // Logout handler — clears session and returns to landing
  const handleLogout = useCallback(() => {
    setLoggedInUser(null);
  }, [setLoggedInUser]);

  // Validate session: check that staffId still exists in staff roster
  useEffect(() => {
    if (loggedInUser) {
      try {
        const staffRaw = localStorage.getItem('fieldvoices-staff');
        if (staffRaw) {
          const staffList = JSON.parse(staffRaw);
          const exists = staffList.some((s: { id: string }) => s.id === loggedInUser.staffId);
          if (!exists) setLoggedInUser(null);
        }
      } catch {
        // If parse fails, leave session intact
      }
    }
  }, [loggedInUser, setLoggedInUser]);

  const checklist: ChecklistItem[] = [
    { key: 'intention', label: 'Intention set', done: draft.intention.trim().length > 0 },
    { key: 'audience', label: 'Audience selected', done: draft.audience.length > 0 },
    { key: 'review', label: 'Questions ready', done: draft.questions.filter((q) => q.included).length > 0 },
    { key: 'pushed', label: 'Pushed', done: pushed },
  ];

  const updateDraft = (updates: Partial<CampaignDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const handlePush = (pushedSurvey?: PushedSurvey) => {
    setPushed(true);
    if (pushedSurvey) {
      pushedSurvey.pushedBy = loggedInUser?.name || 'current-user';
      // Store pushed survey for later reference
      try {
        const existing = JSON.parse(localStorage.getItem('fieldvoices-pushed-surveys') || '[]');
        existing.push(pushedSurvey);
        localStorage.setItem('fieldvoices-pushed-surveys', JSON.stringify(existing));
      } catch {
        // Non-critical — don't block push
      }
      setActivePushedSurvey(pushedSurvey);
    }
  };

  // Build participation object from active pushed survey
  const activeSurveyQuestions = activePushedSurvey
    ? activePushedSurvey.draft.questions.filter((q) => q.included)
    : [];

  const participationWithState = activePushedSurvey && !surveyAccepted
    ? { activeSurveys: 1, pendingQuestions: activeSurveyQuestions.length, lastResponseDate: '', currentSurvey: null }
    : { ...emptyParticipation, currentSurvey: null as null };

  // Determine the active survey step for the stepper
  const surveyStepKey = ['intention', 'audience', 'review', 'push'].includes(activeView || '')
    ? activeView
    : null;

  const isSurveyFlow = activeView === 'request-fieldvoice' || surveyStepKey !== null;

  // Show minimal loading state during hydration to prevent flash
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Sign-in gate only applies in demo mode — real tool bypasses to workspace
  if (!loggedInUser) {
    if (demoMode) {
      return <StartConnectCard onConnect={(user) => setLoggedInUser(user)} />;
    }
    // Real tool: auto-connect as admin
    const defaultUser: LoggedInUser = {
      staffId: 'admin',
      name: 'Administrator',
      role: 'ed',
      sessionCreatedAt: new Date().toISOString(),
    };
    setLoggedInUser(defaultUser);
    return null;
  }

  // Determine workspace title and content — i18n-aware
  const getWorkspaceTitle = () => {
    switch (activeView) {
      case 'request-fieldvoice':
      case 'intention':
      case 'audience':
      case 'review':
      case 'push':
        return t('workspace.requestFieldVoices');
      case 'be-heard':
        return t('beHeard.title');
      case 'survey-response':
        return t('response.title');
      case 'survey-invite':
        return t('survey.voiceNeeded');
      case 'daily-brief':
        return t('dailyBrief.title');
      case 'archive':
        return t('archive.title');
      case 'survey-bank':
        return 'Survey Bank';
      default:
        return t('workspace.title');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-deep">
      {/* Skip to main content — accessibility */}
      <a href="#main-workspace" className="skip-to-main">
        {t('app.skipToMain')}
      </a>

      {/* Header — responsive: simplified on mobile */}
      <header className="flex items-center justify-between px-3 md:px-5 py-2.5 border-b border-border-subtle bg-navy-900" role="banner">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 md:gap-3 group"
            title="Return to workspace"
          >
            <div className="w-7 h-7 rounded-full bg-navy-800 border border-border-gold flex items-center justify-center">
              <PeopleClusterIcon size={14} className="text-gold-500" />
            </div>
            <h1 className="text-sm font-bold text-text-primary">{t('app.name')}</h1>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-xs text-text-muted hidden sm:inline">{t('app.brand')}</span>

          {/* Settings — ED/Admin only */}
          {roleConfig.canRequest && (
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-gold bg-navy-800 hover:bg-navy-700 text-gold-400 hover:text-gold-300 transition-all text-xs font-medium hover:shadow-[0_0_10px_var(--gold-glow)]"
              title="Settings"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="hidden sm:inline">Connect FieldVoices</span>
            </button>
          )}

          {/* Demo toggle */}
          <button
            onClick={() => {
              if (demoMode) {
                clearDemoData();
                setDemoMode(false);
                window.location.reload();
              } else {
                seedDemoData();
                setDemoMode(true);
                window.location.reload();
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              demoMode
                ? 'border-gold-500/50 bg-gold-500/15 text-gold-400 hover:bg-gold-500/25'
                : 'border-border-subtle/50 bg-navy-800 text-text-muted hover:text-text-primary hover:border-border-subtle'
            }`}
            title={demoMode ? 'Turn off demo mode' : 'Turn on demo mode'}
          >
            {demoMode ? 'Demo On' : 'Demo'}
          </button>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-subtle bg-navy-800 hover:bg-navy-700 text-text-muted hover:text-alert-rose transition-all text-xs"
            title="Sign out"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main 3-panel layout — side panels hidden on mobile */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Your Attention Please — desktop only */}
        <aside className={`hidden md:block panel-collapse flex-shrink-0 ${leftCollapsed ? 'w-12' : 'w-60'}`} aria-label="Your attention - navigation and surveys">
          <ActionRail
            activeView={activeView}
            onSelectView={(view) => {
              if (view === 'request-fieldvoice') {
                setDraft(emptyDraft);
                setActiveView('intention');
              } else {
                setActiveView(view);
              }
            }}
            currentRole={currentRole}
            userName={loggedInUser.name}
            collapsed={leftCollapsed}
            onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
            myParticipation={participationWithState}
            liveStatus={demoMode ? { activeFieldVoices: DEMO_CAMPAIGN_STATS.active, totalParticipants: DEMO_CAMPAIGN_STATS.participants, totalResponses: 0, campaigns: [] } : emptyLiveStatus}
            onAcceptSurvey={(method?: string) => {
              setSurveyAccepted(true);
              if (method) setSurveyMethod(method);
              setActiveView('survey-response');
            }}
            onLogout={handleLogout}
          />
        </aside>

        {/* Middle panel: Active Work — workspace + work plan */}
        <main id="main-workspace" className="flex-1 overflow-y-auto bg-gradient-to-b from-navy-950/60 via-navy-950/40 to-navy-950/60 pb-20 md:pb-0" role="main" aria-label="Main workspace">
          <div className="max-w-3xl mx-auto p-4 md:p-6">
            {/* Workspace header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-border-subtle">
              <h2 className="text-lg font-semibold text-text-primary">{getWorkspaceTitle()}</h2>
              {activeView === 'daily-brief' && (
                <span className="text-xs text-text-muted">{emptyDailyBrief.date}</span>
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

            {/* Workspace content — wrapped in error boundary + view transitions */}
            <ErrorBoundary><ViewTransition viewKey={activeView || 'home'}>
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
              <BeHeardPanel demoMode={demoMode} demoSubmissions={DEMO_BE_HEARD} demoStatuses={DEMO_BE_HEARD_STATUSES} />
            )}

            {activeView === 'survey-response' && (
              <SurveyResponsePanel
                surveyTitle={activePushedSurvey?.draft.intention || 'Survey'}
                ownerName={activePushedSurvey?.pushedBy || ''}
                questions={activePushedSurvey?.draft.questions || []}
                answeredCount={0}
                method={surveyMethod}
              />
            )}

            {activeView === 'survey-invite' && (
              <SurveyInvitePanel
                demoMode={demoMode}
                pushedSurvey={activePushedSurvey}
                onAccept={(method, cadence) => {
                  setSurveyAccepted(true);
                  setSurveyMethod(method);
                  setActiveView('survey-response');
                }}
              />
            )}

            {activeView === 'daily-brief' && (() => {
              const todayStr = new Date().toISOString().split('T')[0];
              // Check if someone already created today's brief (stored in localStorage)
              let storedBriefOwnerId: string | undefined;
              try {
                const storedBrief = localStorage.getItem('fieldvoices-daily-brief-owner');
                if (storedBrief) {
                  const parsed = JSON.parse(storedBrief);
                  if (parsed.date === todayStr) {
                    storedBriefOwnerId = parsed.ownerId;
                  }
                }
              } catch {
                // ignore parse errors
              }
              const userCreatedTodaysBrief = storedBriefOwnerId === loggedInUser.staffId;
              const noBriefExistsToday = !storedBriefOwnerId;

              return (
                <div className="space-y-6">
                  {/* Always show today's brief in read-only mode first */}
                  <DailyBriefNotebook
                    brief={emptyDailyBrief}
                    canEdit={userCreatedTodaysBrief ? roleConfig.canRequest : false}
                    userName={loggedInUser.name}
                    currentUserId={loggedInUser.staffId}
                    briefOwnerId={storedBriefOwnerId}
                    onBack={() => setActiveView('home')}
                  />

                  {/* If user has edit permission and no brief exists today, show create button */}
                  {roleConfig.canRequest && noBriefExistsToday && (
                    <div className="text-center py-4">
                      <button
                        onClick={() => {
                          try {
                            localStorage.setItem('fieldvoices-daily-brief-owner', JSON.stringify({
                              date: todayStr,
                              ownerId: loggedInUser.staffId,
                            }));
                          } catch {
                            // non-critical
                          }
                          // Force re-render by toggling view
                          setActiveView('home');
                          setTimeout(() => setActiveView('daily-brief'), 0);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 text-navy-950 text-sm font-semibold hover:bg-gold-400 transition-colors shadow-[0_0_12px_var(--gold-glow)]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Create Today&apos;s Brief
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {activeView === 'survey-bank' && (
              <SurveyBank
                onUseTemplate={(template) => {
                  updateDraft({
                    intention: template.description,
                    audience: template.recommendedAudience,
                    questions: template.questions,
                  });
                  setActiveView('review');
                }}
              />
            )}

            {activeView === 'archive' && (
              <div className="space-y-4">
                <ArchiveSwitcher active={archiveView} onSwitch={setArchiveView} />
                <ArchiveCardGrid
                  view={archiveView}
                  campaigns={demoMode ? [
                    {
                      id: 'camp-demo-1',
                      intention: 'Staff Wellbeing & Operations Check-In',
                      objective: 'Understand frontline staff experience, identify operational friction, and surface actionable next steps for the Youth Leadership department.',
                      audience: ['direct_service', 'site_supervisor', 'program_team'],
                      windowStart: '2026-02-17',
                      windowEnd: '2026-03-07',
                      status: 'active',
                      createdBy: 'Lauralani Reece',
                      createdAt: '2026-02-15',
                      participantCount: 18,
                      responseCount: 56,
                    },
                  ] : []}
                  concerns={demoMode ? DEMO_BE_HEARD : []}
                  themes={demoMode ? DEMO_THEMES : []}
                />
              </div>
            )}

            {activeView === 'home' && (() => {
              const quote = getRotatingQuote();
              return (
                <div className="space-y-8">
                  {/* Personalized greeting */}
                  <div className="pt-4 text-center">
                    <h2 className="text-xl font-semibold text-text-primary mb-6">
                      Welcome back, {loggedInUser.name.split(' ')[0]}
                    </h2>

                    {/* Floating quote — fades out 5-10s, then collapses */}
                    {quoteFade !== 'gone' && (
                      <div
                        className="max-w-lg mx-auto px-6 mb-4 overflow-hidden transition-all duration-[5000ms] ease-in-out"
                        style={{
                          opacity: quoteFade === 'fading' ? 0 : 1,
                          maxHeight: quoteFade === 'fading' ? '0px' : '200px',
                          marginBottom: quoteFade === 'fading' ? '0px' : undefined,
                        }}
                        onTransitionEnd={(e) => { if (e.propertyName === 'opacity' && quoteFade === 'fading') setQuoteFade('gone'); }}
                      >
                        <p className="text-base text-text-secondary italic leading-relaxed font-light tracking-wide mb-3">
                          &ldquo;{quote.text}&rdquo;
                        </p>
                        <p className="text-xs text-gold-400 font-medium flex items-center gap-1.5 justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-500/60">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          </svg>
                          {quote.attribution}{quote.tradition ? ` (${quote.tradition})` : ''}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Getting started CTA — shown when no demo data */}
                  {!demoMode && (
                    <GettingStartedCard
                      onOpenSettings={() => setSettingsOpen(true)}
                      onEnableDemo={() => {
                        seedDemoData();
                        setDemoMode(true);
                        window.location.reload();
                      }}
                    />
                  )}

                  {/* My Impact Plan — prominent, always visible */}
                  {roleConfig.canRequest && (
                    <div id="impact-plan">
                      <MyImpactPlan userName={loggedInUser.name} role={currentRole} demoMode={demoMode} />
                    </div>
                  )}

                  {/* Your Contributions — collapsible */}
                  <div className="rounded-xl border border-border-subtle bg-navy-800/50 overflow-hidden">
                    <button
                      onClick={() => setContributionsOpen(!contributionsOpen)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-navy-800 transition-colors"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">Your Contributions</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-text-muted transition-transform ${contributionsOpen ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {contributionsOpen && (
                      <div className="px-1 pb-4">
                        {!roleConfig.canRequest && currentRole === 'voice_steward' && (
                          <VoiceStewardDashboard
                            demoMode={demoMode}
                            demoBeHeard={DEMO_BE_HEARD}
                            demoStatuses={DEMO_BE_HEARD_STATUSES}
                          />
                        )}
                        <YourContributions
                          userName={loggedInUser.name}
                          role={currentRole}
                          demoMode={demoMode}
                          onSelectView={setActiveView}
                          demoThemes={DEMO_THEMES}
                          demoBeHeard={DEMO_BE_HEARD}
                          demoBeHeardStatuses={DEMO_BE_HEARD_STATUSES}
                          demoYouSaidWeDid={DEMO_YOU_SAID_WE_DID}
                        />
                      </div>
                    )}
                  </div>

                  {/* Personal Notes — collapsible */}
                  <div className="rounded-xl border border-border-subtle bg-navy-800/50 overflow-hidden">
                    <button
                      onClick={() => setPersonalNotesOpen(!personalNotesOpen)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-navy-800 transition-colors"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">Personal Notes</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-text-muted transition-transform ${personalNotesOpen ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {personalNotesOpen && (
                      <div className="px-1 pb-4">
                        <PersonalNotes />
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Progress checklist - compact, below survey actions */}
            {isSurveyFlow && !pushed && (
              <div className="mt-4">
                <ProgressChecklist items={checklist} compact />
              </div>
            )}

            {/* Context notes - shown below Daily Brief view */}
            {activeView === 'daily-brief' && (
              <div className="mt-6">
                <ContextDrawer canEdit={roleConfig.canRequest} />
              </div>
            )}
            </ViewTransition>
            </ErrorBoundary>
          </div>
        </main>

        {/* Right panel: Agency-Wide — desktop only, mobile uses sheet overlay */}
        <aside className={`hidden md:block panel-collapse flex-shrink-0 ${rightCollapsed ? 'w-12' : 'w-72'}`} aria-label="Agency-wide panel">
          {rightCollapsed ? (
            <div className="flex flex-col items-center py-4 w-12 bg-navy-900 border-l border-border-subtle h-full">
              <button
                onClick={() => setRightCollapsed(false)}
                className="p-2 rounded-lg hover:bg-navy-800 text-text-muted hover:text-gold-400 transition-colors"
                title="Expand panel"
                aria-expanded="false"
                aria-label="Expand agency panel"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
                  aria-expanded="true"
                  aria-label="Collapse agency panel"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              {/* Current Request for FieldVoices — stats */}
              <div className="p-4 space-y-3 border-b border-border-subtle">
                <h4 className="text-xs font-medium text-gold-400">Current Request for FieldVoices</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-navy-800/40 border border-border-subtle">
                    <p className="text-sm font-bold text-text-primary">{demoMode ? DEMO_CAMPAIGN_STATS.active : 0}</p>
                    <p className="text-[11px] text-text-muted">Active</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-navy-800/40 border border-border-subtle">
                    <p className="text-sm font-bold text-text-primary">{demoMode ? DEMO_CAMPAIGN_STATS.participants : 0}</p>
                    <p className="text-[11px] text-text-muted">Participants</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-navy-800/40 border border-border-subtle">
                    <p className="text-sm font-bold text-text-primary">{demoMode ? `${DEMO_CAMPAIGN_STATS.responseRate}%` : '0%'}</p>
                    <p className="text-[11px] text-text-muted">Response</p>
                  </div>
                </div>
                <p className="text-xs text-text-muted">
                  {demoMode ? DEMO_CAMPAIGN_STATS.campaignName : 'Stats update in real-time as surveys are active and responses flow in.'}
                </p>
              </div>

              {/* Shared results — top concerns */}
              <div className="p-4 space-y-3 border-b border-border-subtle">
                <h4 className="text-xs font-medium text-text-secondary">Top Repeated Concerns</h4>
                {demoMode ? (
                  <div className="space-y-2">
                    {DEMO_THEMES.map((theme) => (
                      <div key={theme.id} className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                          theme.severity === 'critical' ? 'bg-alert-rose' :
                          theme.severity === 'high' ? 'bg-gold-500' :
                          theme.severity === 'medium' ? 'bg-gold-400/60' :
                          'bg-text-muted'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-text-primary leading-relaxed">{theme.theme}</p>
                          <p className="text-[11px] text-text-muted">{theme.frequency} signals &middot; {theme.department}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted py-2">
                    No data yet. Concerns will surface once surveys are active.
                  </p>
                )}
              </div>

              {/* Follow-ups */}
              <div className="p-4 space-y-3 border-b border-border-subtle">
                <h4 className="text-xs font-medium text-text-secondary">Scheduled Follow-Ups</h4>
                {demoMode ? (
                  <div className="space-y-2">
                    {DEMO_FOLLOW_UPS.map((fu, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-text-secondary">{fu.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          fu.status === 'scheduled'
                            ? 'bg-accent-sage/10 text-accent-sage'
                            : 'bg-navy-700 text-text-muted'
                        }`}>{fu.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted py-2">
                    No follow-ups scheduled yet.
                  </p>
                )}
              </div>

              {/* You Said / We Did — functional accountability loop */}
              <div className="p-4" role="region" aria-label="You Said We Did accountability tracker">
                <div className="rounded-lg p-3 border border-gold-500/30 bg-navy-800 shadow-[0_0_16px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(201,168,76,0.08)]">
                  <h4 className="text-xs font-semibold text-gold-400 mb-2">You Said / We Did</h4>
                  {demoMode ? (
                    <div className="space-y-3">
                      {DEMO_YOU_SAID_WE_DID.map((entry) => (
                        <div key={entry.id} className="space-y-2">
                          <p className="text-xs text-text-muted italic">&ldquo;{entry.youSaid}&rdquo;</p>
                          <p className="text-xs text-accent-sage">&rarr; {entry.weDid}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">
                      No entries yet. This section will show actions taken in response to your feedback.
                    </p>
                  )}
                </div>
              </div>

              {/* Agency Metrics */}
              <div className="p-4 border-t border-border-subtle">
                <h4 className="text-xs font-medium text-text-secondary mb-2">Agency Metrics</h4>
                {demoMode ? (
                  <div className="space-y-2">
                    {DEMO_KPIS.map((kpi) => (
                      <div key={kpi.label} className="flex items-center justify-between text-[11px]">
                        <span className="text-text-secondary">{kpi.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-text-primary">{kpi.value}</span>
                          <span className={`text-[11px] ${
                            kpi.trend === 'up' ? 'text-accent-sage' :
                            kpi.trend === 'down' ? (kpi.label.includes('Duplicate') || kpi.label.includes('Friction') ? 'text-accent-sage' : 'text-alert-rose') :
                            'text-text-muted'
                          }`}>
                            {kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '—'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted py-2">
                    Metrics will populate as surveys complete and data flows in.
                  </p>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Bottom ticker — desktop only, hidden on mobile (bottom nav takes that space) */}
      <div className="hidden md:block">
        <MetricTicker shoutOuts={demoMode ? DEMO_SHOUT_OUTS : []} />
      </div>

      {/* Mobile bottom nav */}
      <MobileNav
        activeView={activeView}
        onSelectView={(view) => {
          if (view === 'request-fieldvoice') {
            setDraft(emptyDraft);
            setActiveView('intention');
          } else {
            setActiveView(view);
          }
        }}
        currentRole={currentRole}
        onLogout={handleLogout}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAgencyPanel={() => setMobileAgencyOpen(true)}
      />

      {/* Mobile agency-wide panel (slide-over sheet) */}
      <MobileAgencySheet
        open={mobileAgencyOpen}
        onClose={() => setMobileAgencyOpen(false)}
        demoMode={demoMode}
        campaignStats={DEMO_CAMPAIGN_STATS}
        themes={DEMO_THEMES}
        kpis={DEMO_KPIS}
        youSaidWeDid={DEMO_YOU_SAID_WE_DID}
        followUps={DEMO_FOLLOW_UPS}
      />

      {/* Settings panel overlay */}
      <SetupPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

    </div>
  );
}
