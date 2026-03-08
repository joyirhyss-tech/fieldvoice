'use client';

import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
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
import { synthesizeActions, getActionsForRole } from '@/lib/synthesis';
import { getDocumentContentByCategory } from '@/lib/useDocumentStore';
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
  const [concernsExpanded, setConcernsExpanded] = useState(false);
  const [metricsRevealed, setMetricsRevealed] = useState(false);
  const [surveyAccepted, setSurveyAccepted] = useState(false);
  const [surveyMethod, setSurveyMethod] = useState('desktop');
  const [demoMode, setDemoMode] = useState(() => isDemoMode());
  const [activePushedSurvey, setActivePushedSurvey] = useState<PushedSurvey | null>(null);
  const [tickerPosts, setTickerPosts] = useLocalStorage<Array<{ id: string; from: string; name: string; message: string }>>('fieldvoices-ticker-posts', []);
  const [tickerDraft, setTickerDraft] = useState('');
  const [breathingActive, setBreathingActive] = useState(false);

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

  // Exit breathing exercise when navigating away
  useEffect(() => {
    setBreathingActive(false);
  }, [activeView]);

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

  // Read pushed actions from Impact Plan to build follow-ups
  const [pushedActions] = useLocalStorage<{ actionId: string; destination: string; pushedAt: string }[]>('fieldvoices-pushed-actions', []);

  const followUps = useMemo(() => {
    if (!demoMode) return [];

    // Build action lookup from synthesis
    const actions = (() => {
      try {
        const all = synthesizeActions({
          themes: DEMO_THEMES,
          beHeardSubmissions: DEMO_BE_HEARD,
          kpis: DEMO_KPIS,
          youSaidWeDid: DEMO_YOU_SAID_WE_DID,
          role: loggedInUser?.role || 'ed',
          existingActions: [],
        });
        return getActionsForRole(all, loggedInUser?.role || 'ed');
      } catch { return []; }
    })();

    const actionMap = new Map(actions.map(a => [a.id, a]));
    const destLabels: Record<string, string> = { calendar: 'Calendar', email: 'Email', agenda: 'Agenda', ticket: 'Ticket', folder: 'Folder', deferred: 'Next Week' };

    // Pushed actions become follow-ups
    const fromPushed = pushedActions.map(p => {
      const action = actionMap.get(p.actionId);
      const label = action ? action.description.slice(0, 45) + (action.description.length > 45 ? '...' : '') : p.actionId;
      const date = new Date(p.pushedAt);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { label: `${label}`, date: `${destLabels[p.destination] || p.destination} ${dateStr}`, status: 'scheduled' as const };
    });

    // Merge: pushed actions first, then fill with demo defaults (skip if we have pushed items)
    if (fromPushed.length > 0) return fromPushed;
    return DEMO_FOLLOW_UPS;
  }, [demoMode, pushedActions, loggedInUser?.role]);

  // Compute live metrics from uploaded docs + real data
  const liveMetrics = useMemo(() => {
    // Parse targets from uploaded background doc
    const bgContent = getDocumentContentByCategory('background');
    const parseTarget = (pattern: RegExp): string | null => {
      const match = bgContent.match(pattern);
      return match ? match[1] : null;
    };

    const youthRetentionTarget = parseTarget(/youth retention.*?target:\s*([\d.]+%?)/i);
    const familyEngagementTarget = parseTarget(/family engagement.*?target:\s*([\d./]+)/i);
    const staffSatisfactionTarget = parseTarget(/staff satisfaction.*?target:\s*([\d./]+)/i);

    const hasDocTargets = !!(youthRetentionTarget || familyEngagementTarget || staffSatisfactionTarget);

    // Real actions closed count from pushed actions
    const actionsClosedCount = pushedActions.length;

    return { youthRetentionTarget, familyEngagementTarget, staffSatisfactionTarget, hasDocTargets, actionsClosedCount };
  }, [pushedActions]);

  const currentRole = loggedInUser?.role || 'ed';
  const roleConfig = getRoleConfig(currentRole);

  // Logout handler — clears session and returns to landing
  const handleLogout = useCallback(() => {
    setLoggedInUser(null);
  }, [setLoggedInUser]);

  // Validate session: check that staffId still exists in staff roster (skip admin)
  useEffect(() => {
    if (loggedInUser && loggedInUser.staffId !== 'admin') {
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

  // Sign-in gate — demo mode pre-fills fields so you just click through
  if (!loggedInUser) {
    if (demoMode) {
      return <StartConnectCard onConnect={(user) => setLoggedInUser(user)} demoMode />;
    }
    // Live mode: show login with Admin pre-filled for click-through
    return <StartConnectCard onConnect={(user) => setLoggedInUser(user)} liveAdmin />;
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
        return `${loggedInUser.name.split(' ')[0]}'s Workspace`;
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

                  {/* Ticker post compose — Tier 1 roles */}
                  {roleConfig.canRequest && (
                    <div className="card-surface p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                          Post to Ticker
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-muted mb-3">
                        Share a success, celebrate someone, or make an announcement. This scrolls across everyone&apos;s footer.
                      </p>
                      <div className="space-y-2">
                        <textarea
                          value={tickerDraft}
                          onChange={(e) => {
                            const words = e.target.value.trim().split(/\s+/);
                            if (words.length <= 20 || e.target.value.length < tickerDraft.length) {
                              setTickerDraft(e.target.value);
                            }
                          }}
                          placeholder="e.g. Voice participation hit 83% this week — highest ever. Keep it going team!"
                          className="w-full bg-navy-800/50 border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted/50 resize-none focus:outline-none focus:border-gold-500/40 transition-colors"
                          rows={2}
                        />
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] ${
                            tickerDraft.trim().split(/\s+/).filter(Boolean).length > 18
                              ? 'text-alert-rose'
                              : 'text-text-muted'
                          }`}>
                            {tickerDraft.trim() ? tickerDraft.trim().split(/\s+/).length : 0}/20 words
                          </span>
                          <button
                            onClick={() => {
                              if (!tickerDraft.trim()) return;
                              const post = {
                                id: `tp-${Date.now()}`,
                                from: loggedInUser.staffId,
                                name: loggedInUser.name,
                                message: tickerDraft.trim(),
                              };
                              setTickerPosts((prev) => [post, ...prev]);
                              setTickerDraft('');
                            }}
                            disabled={!tickerDraft.trim()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 text-navy-950 text-xs font-semibold hover:bg-gold-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                            Post
                          </button>
                        </div>
                      </div>

                      {/* Recent posts from this user */}
                      {tickerPosts.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border-subtle">
                          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Recent posts</p>
                          <div className="space-y-1.5">
                            {tickerPosts.slice(0, 3).map((post) => (
                              <div key={post.id} className="flex items-start justify-between gap-2">
                                <p className="text-[11px] text-text-secondary leading-snug">
                                  <span className="text-gold-400">✦</span> {post.message}
                                </p>
                                <button
                                  onClick={() => setTickerPosts((prev) => prev.filter((p) => p.id !== post.id))}
                                  className="text-text-muted hover:text-alert-rose transition-colors shrink-0 mt-0.5"
                                  title="Remove post"
                                >
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                  {/* Floating quote — fades out 5-10s, then collapses */}
                  <div className="pt-4 text-center">
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
                      <MyImpactPlan userName={loggedInUser.name} role={currentRole} demoMode={demoMode} onBreathingStart={() => setBreathingActive(true)} breathingActive={breathingActive} onBreathingComplete={() => setBreathingActive(false)} />
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
                  <>
                    <button
                      onClick={() => setConcernsExpanded(!concernsExpanded)}
                      className="w-full flex items-center justify-between py-1"
                    >
                      <span className="text-sm font-medium text-text-primary">{DEMO_THEMES.length} Concerns Tracked</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-text-muted transition-transform ${concernsExpanded ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    {concernsExpanded && (
                      <div className="space-y-2 pt-1">
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
                    )}
                  </>
                ) : (
                  <p className="text-xs text-text-muted py-2">
                    No data yet. Concerns will surface once surveys are active.
                  </p>
                )}
              </div>

              {/* Follow-ups */}
              <div className="p-4 space-y-3 border-b border-border-subtle">
                <h4 className="text-xs font-medium text-text-secondary">Scheduled Follow-Ups</h4>
                {followUps.length > 0 ? (
                  <div className="space-y-2">
                    {followUps.map((fu, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] gap-2">
                        <span className="text-text-secondary flex-1 min-w-0 truncate">{fu.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] flex-shrink-0 ${
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

              {/* Shared Impact — reveal button + grouped metrics */}
              <div className="p-4 border-t border-border-subtle">
                <button
                  onClick={() => setMetricsRevealed(!metricsRevealed)}
                  className="w-full group"
                >
                  <div className={`relative overflow-hidden rounded-lg border transition-all duration-500 ${
                    metricsRevealed
                      ? 'border-gold-500/30 bg-navy-800'
                      : 'border-gold-500/40 bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent hover:border-gold-500/60 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]'
                  }`}>
                    <div className={`flex items-center justify-between px-3 py-2.5 transition-all duration-500 ${metricsRevealed ? '' : ''}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                          metricsRevealed ? 'bg-gold-500/20' : 'bg-gold-500/30'
                        }`}>
                          <svg
                            width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            className={`text-gold-400 transition-transform duration-500 ${metricsRevealed ? 'rotate-[360deg]' : 'rotate-0'}`}
                          >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-gold-400">Shared Impact</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!metricsRevealed && demoMode && (
                          <div className="flex gap-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-sage" />
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          </div>
                        )}
                        <svg
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          className={`text-gold-400/60 transition-transform duration-500 ${metricsRevealed ? 'rotate-180' : ''}`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>

                    {/* Reveal content */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      metricsRevealed ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-3 pb-3 space-y-3 text-left">
                        {demoMode ? (
                          <>
                            {/* Mission Alignment */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                                <h4 className="text-[10px] font-semibold text-gold-400 uppercase tracking-wider">Mission</h4>
                                {liveMetrics.hasDocTargets && (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gold-500/10 text-gold-400/60 ml-auto">docs</span>
                                )}
                              </div>
                              <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 gap-y-1 items-center">
                                {DEMO_KPIS.filter(k => k.group === 'mission').map((kpi) => {
                                  const liveTarget =
                                    kpi.label === 'Youth Retention' ? liveMetrics.youthRetentionTarget :
                                    kpi.label === 'Family Engagement' ? liveMetrics.familyEngagementTarget :
                                    kpi.label === 'Staff Satisfaction' ? liveMetrics.staffSatisfactionTarget :
                                    null;
                                  const target = liveTarget || kpi.target;
                                  const hitTarget = target ? parseFloat(kpi.value) >= parseFloat(target) : false;
                                  return (
                                    <Fragment key={kpi.label}>
                                      <span className="text-[11px] text-text-secondary truncate">{kpi.label}</span>
                                      <span className="text-[11px] font-semibold text-text-primary text-right tabular-nums">{kpi.value}</span>
                                      <span className={`text-[9px] w-8 text-center rounded py-0.5 ${
                                        hitTarget
                                          ? 'bg-accent-sage/15 text-accent-sage'
                                          : 'bg-gold-500/15 text-gold-400'
                                      }`}>
                                        {hitTarget ? '✓' : `→${target}`}
                                      </span>
                                    </Fragment>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Voice Health */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-sage" />
                                <h4 className="text-[10px] font-semibold text-accent-sage uppercase tracking-wider">Voice Health</h4>
                                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-accent-sage/10 text-accent-sage/60 ml-auto">live</span>
                              </div>
                              <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 gap-y-1 items-center">
                                {DEMO_KPIS.filter(k => k.group === 'voice').map((kpi) => (
                                  <Fragment key={kpi.label}>
                                    <span className="text-[11px] text-text-secondary truncate">{kpi.label}</span>
                                    <span className="text-[11px] font-semibold text-text-primary text-right tabular-nums">{kpi.value}</span>
                                    <span className={`text-[9px] w-8 text-center rounded py-0.5 ${
                                      kpi.trend === 'up' ? 'bg-accent-sage/15 text-accent-sage' : 'bg-gold-500/15 text-gold-400'
                                    }`}>
                                      {kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '—'}
                                    </span>
                                  </Fragment>
                                ))}
                              </div>
                            </div>

                            {/* Time Reclaimed */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                                <h4 className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider whitespace-nowrap">Time Saved</h4>
                                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-sky-400/10 text-sky-400/60 ml-auto">live</span>
                              </div>
                              <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 gap-y-1 items-center">
                                {DEMO_KPIS.filter(k => k.group === 'time').map((kpi) => {
                                  const displayValue = kpi.label === 'Actions Closed'
                                    ? `${liveMetrics.actionsClosedCount}/mo`
                                    : kpi.value;
                                  return (
                                    <Fragment key={kpi.label}>
                                      <span className="text-[11px] text-text-secondary truncate">{kpi.label}</span>
                                      <span className="text-[11px] font-semibold text-text-primary text-right tabular-nums">{displayValue}</span>
                                      <span className={`text-[9px] w-8 text-center rounded py-0.5 ${
                                        kpi.trend === 'up' ? 'bg-sky-400/15 text-sky-400' : 'bg-gold-500/15 text-gold-400'
                                      }`}>
                                        {kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '—'}
                                      </span>
                                    </Fragment>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-text-muted py-2">
                            Metrics will populate as surveys complete and data flows in.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Bottom ticker — desktop only, hidden on mobile (bottom nav takes that space) */}
      <div className="hidden md:block">
        <MetricTicker shoutOuts={[...tickerPosts, ...(demoMode ? DEMO_SHOUT_OUTS : [])]} />
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
