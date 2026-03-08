'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import BreathingExercise from '@/components/BreathingExercise';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { synthesizeActions, getActionsForRole, generateForwardPlan } from '@/lib/synthesis';
import {
  getMeetingTypesForRole,
  generateAgenda,
  formatAgendaAsText,
  type AgendaData,
} from '@/lib/agenda-templates';
import {
  DEMO_THEMES,
  DEMO_BE_HEARD,
  DEMO_KPIS,
  DEMO_YOU_SAID_WE_DID,
  isDemoMode,
} from '@/lib/demo-data';
import type {
  SynthesizedAction,
  UserRole,
  MeetingType,
  MeetingAgenda,
} from '@/lib/types';

interface MyImpactPlanProps {
  userName: string;
  role: UserRole;
  demoMode: boolean;
  onBreathingStart?: () => void;
  breathingActive?: boolean;
  onBreathingComplete?: () => void;
}

type ToastType = 'success' | 'info';

/** Where an action was pushed to */
type PushDestination = 'calendar' | 'email' | 'agenda' | 'ticket' | 'folder' | 'deferred';

const PUSH_DESTINATION_LABELS: Record<PushDestination, string> = {
  calendar: 'Calendar',
  email: 'Email',
  agenda: 'Agenda',
  ticket: 'Ticket',
  folder: 'Folder',
  deferred: 'Next Week',
};

/** Tracking which actions have been pushed and where */
interface PushedAction {
  actionId: string;
  destination: PushDestination;
  pushedAt: string;
}

// ─── Priority color map ───────────────────────────────────

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-alert-rose text-white',
  high: 'bg-gold-500 text-navy-950',
  medium: 'bg-gold-400/60 text-navy-950',
  low: 'bg-navy-600 text-text-muted',
};

const CATEGORY_COLORS: Record<string, string> = {
  operations: 'border-blue-400/40 text-blue-300',
  culture: 'border-accent-sage/40 text-accent-sage',
  staffing: 'border-alert-rose/40 text-alert-rose',
  compliance: 'border-gold-500/40 text-gold-400',
  communication: 'border-purple-400/40 text-purple-300',
};

// ─── Per-item Action Menu Options ─────────────────────────

const ACTION_MENU_ITEMS: { key: PushDestination; label: string; emoji: string }[] = [
  { key: 'calendar', label: 'Add to Calendar', emoji: '\u{1F4C5}' },
  { key: 'email', label: 'Email to Team', emoji: '\u{1F4E7}' },
  { key: 'agenda', label: 'Add to Agenda', emoji: '\u{1F4CB}' },
  { key: 'ticket', label: 'Create Ticket', emoji: '\u{1F3AB}' },
  { key: 'folder', label: 'Save to Folder', emoji: '\u{1F4C1}' },
  { key: 'deferred', label: 'Defer to Next Week', emoji: '\u{23ED}\u{FE0F}' },
];

// ─── Component ────────────────────────────────────────────

export default function MyImpactPlan({ userName, role, demoMode, onBreathingStart, breathingActive, onBreathingComplete }: MyImpactPlanProps) {
  const [additionalItems, setAdditionalItems] = useLocalStorage<string[]>('fieldvoices-impact-items', []);
  const [pushedActions, setPushedActions] = useLocalStorage<PushedAction[]>('fieldvoices-pushed-actions', []);
  const [newItem, setNewItem] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const [additionalNotesOpen, setAdditionalNotesOpen] = useState(false);
  const [weAskedOpen, setWeAskedOpen] = useState(false);
  const [expandedLanes, setExpandedLanes] = useState<Record<string, boolean>>({ immediate: true });
  const menuRef = useRef<HTMLDivElement>(null);

  // Agenda state
  const [agendaPickerOpen, setAgendaPickerOpen] = useState(false);
  const [agendaActionId, setAgendaActionId] = useState<string | null>(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | null>(null);
  const [generatedAgenda, setGeneratedAgenda] = useState<MeetingAgenda | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // ─── Synthesized Actions ──────────────────────────────

  const synthesizedActions = useMemo<SynthesizedAction[]>(() => {
    if (!demoMode) return [];

    try {
      const actions = synthesizeActions({
        themes: DEMO_THEMES,
        beHeardSubmissions: DEMO_BE_HEARD,
        kpis: DEMO_KPIS,
        youSaidWeDid: DEMO_YOU_SAID_WE_DID,
        role,
        existingActions: [],
      });
      return getActionsForRole(actions, role);
    } catch {
      return [];
    }
  }, [demoMode, role]);

  // Available meeting types for this role
  const meetingTypes = useMemo(() => getMeetingTypesForRole(role), [role]);

  // Split actions into active vs pushed
  const pushedActionIds = useMemo(
    () => new Set(pushedActions.map(p => p.actionId)),
    [pushedActions]
  );

  const activeActions = useMemo(
    () => synthesizedActions.filter(a => !pushedActionIds.has(a.id)),
    [synthesizedActions, pushedActionIds]
  );

  const completedActions = useMemo(
    () => synthesizedActions.filter(a => pushedActionIds.has(a.id)),
    [synthesizedActions, pushedActionIds]
  );

  // Helper: get push destination for a completed action
  const getPushDestination = (actionId: string): PushDestination | null => {
    const pushed = pushedActions.find(p => p.actionId === actionId);
    return pushed ? pushed.destination : null;
  };

  // ─── Content Check (for disable logic) ────────────────

  const hasContent = activeActions.length > 0 || additionalItems.length > 0;

  // ─── Handlers ─────────────────────────────────────────

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setAdditionalItems((prev) => [...prev, newItem.trim()]);
    setNewItem('');
  };

  const handleRemoveItem = (index: number) => {
    setAdditionalItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Mark an action as pushed to a destination
  const markAsPushed = (actionId: string, destination: PushDestination) => {
    setPushedActions(prev => {
      // Don't double-push to the same destination
      if (prev.some(p => p.actionId === actionId && p.destination === destination)) return prev;
      return [...prev, { actionId, destination, pushedAt: new Date().toISOString() }];
    });
  };

  // Get content for a single action item
  const getSingleActionContent = (action: SynthesizedAction): string => {
    const lines: string[] = [
      'FIELDVOICES — ACTION ITEM',
      `Prepared by: ${userName}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      `Priority: ${action.priority.toUpperCase()}`,
      `Category: ${action.category}`,
      `Timeline: ${action.suggestedTimeline}`,
      '',
      `Action: ${action.description}`,
      '',
      `Rationale: ${action.rationale}`,
      '',
      '---',
      'Generated by FieldVoices Impact Plan',
    ];
    return lines.join('\n');
  };

  // ─── Per-Item Push Handlers ──────────────────────────

  const handleItemCalendar = (action: SynthesizedAction) => {
    const content = getSingleActionContent(action);
    const now = new Date();
    const reviewDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const formatICSDate = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const endDate = new Date(reviewDate.getTime() + 60 * 60 * 1000);

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FieldVoices//Impact Plan//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(reviewDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:FieldVoices: ${action.description.slice(0, 60)}`,
      `DESCRIPTION:${content.replace(/\n/g, '\\n')}`,
      `UID:fieldvoices-${action.id}-${Date.now()}@fieldvoices.app`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fieldvoices-action-${action.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    markAsPushed(action.id, 'calendar');
    setToast({ message: `Calendar event downloaded`, type: 'success' });
  };

  const handleItemEmail = (action: SynthesizedAction) => {
    const content = getSingleActionContent(action);
    const subject = encodeURIComponent(`FieldVoices Action: ${action.description.slice(0, 50)}`);
    const body = encodeURIComponent(content);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');

    markAsPushed(action.id, 'email');
    setToast({ message: `Opening email client`, type: 'success' });
  };

  const handleItemAgenda = (action: SynthesizedAction) => {
    setAgendaPickerOpen(true);
    setAgendaActionId(action.id);
    setSelectedMeetingType(null);
    setGeneratedAgenda(null);
  };

  const handleItemTicket = async (action: SynthesizedAction) => {
    const ticket = [
      'FIELDVOICES — TICKET EXPORT',
      `Exported by: ${userName}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      `Title: ${action.description}`,
      `Priority: ${action.priority.toUpperCase()}`,
      `Category: ${action.category}`,
      `Due: ${action.suggestedTimeline}`,
      `Status: Open`,
      '',
      `Rationale: ${action.rationale}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(ticket);
    } catch {
      // Clipboard may not be available — still mark as pushed
    }
    markAsPushed(action.id, 'ticket');
    setToast({ message: `Ticket copied — paste into your ticket system`, type: 'success' });
  };

  const handleItemFolder = (action: SynthesizedAction) => {
    const content = getSingleActionContent(action);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fieldvoices-action-${action.id}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    markAsPushed(action.id, 'folder');
    setToast({ message: `Action saved to file`, type: 'success' });
  };

  const handleItemDefer = (action: SynthesizedAction) => {
    markAsPushed(action.id, 'deferred');
    setToast({ message: `Deferred to next week`, type: 'success' });
  };

  // Per-item push dispatch
  const handleItemPush = (action: SynthesizedAction, key: PushDestination) => {
    setOpenMenuId(null);

    switch (key) {
      case 'calendar':
        handleItemCalendar(action);
        break;
      case 'email':
        handleItemEmail(action);
        break;
      case 'agenda':
        handleItemAgenda(action);
        break;
      case 'ticket':
        handleItemTicket(action);
        break;
      case 'folder':
        handleItemFolder(action);
        break;
      case 'deferred':
        handleItemDefer(action);
        break;
    }
  };

  // Agenda generation (reused for per-item agenda push)
  const handleSelectMeetingType = (type: MeetingType) => {
    setSelectedMeetingType(type);

    // If pushing a single action to agenda, scope to that action
    const scopedActions = agendaActionId
      ? synthesizedActions.filter(a => a.id === agendaActionId)
      : synthesizedActions;

    const agendaData: AgendaData = {
      actions: scopedActions,
      themes: demoMode ? DEMO_THEMES : [],
      kpis: demoMode ? DEMO_KPIS : [],
      youSaidWeDid: demoMode ? DEMO_YOU_SAID_WE_DID : [],
      userName,
    };

    const agenda = generateAgenda(type, agendaData);
    setGeneratedAgenda(agenda);
  };

  const handleCopyAgenda = async () => {
    if (!generatedAgenda) return;
    const text = formatAgendaAsText(generatedAgenda);
    try {
      await navigator.clipboard.writeText(text);
      if (agendaActionId) {
        markAsPushed(agendaActionId, 'agenda');
      }
      setToast({ message: 'Agenda copied to clipboard', type: 'success' });
    } catch {
      setToast({ message: 'Could not copy — try again', type: 'info' });
    }
  };

  const handleDownloadAgenda = () => {
    if (!generatedAgenda) return;
    const text = formatAgendaAsText(generatedAgenda);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fieldvoices-agenda-${generatedAgenda.meetingType}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (agendaActionId) {
      markAsPushed(agendaActionId, 'agenda');
    }
    setToast({ message: 'Agenda downloaded', type: 'success' });
  };

  // ─── Render ───────────────────────────────────────────

  return (
    <div className="space-y-5 relative">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 14l2 2 4-4" />
        </svg>
        <h3 className="text-sm font-semibold text-text-primary">My Impact Plan</h3>
      </div>

      {/* Description */}
      <div className="rounded-lg p-3 border border-border-subtle bg-navy-800/30">
        <p className="text-xs text-text-muted leading-relaxed">
          {activeActions.length > 0
            ? `${activeActions.length} prioritized action${activeActions.length !== 1 ? 's' : ''} synthesized from survey themes, Be Heard submissions, and KPIs. Push each item to your tools when ready.`
            : 'Action items derived from your FieldVoices surveys. Add personal notes and push items to your calendar, email, or other tools.'}
        </p>
      </div>

      {/* ─── Survey Action Items — grouped by ED priority ──── */}
      {(() => {
        // Group actions by nonprofit ED priority logic
        const lanes: { key: string; label: string; description: string; accent: string; border: string; items: SynthesizedAction[] }[] = [
          {
            key: 'immediate',
            label: 'Immediate Action',
            description: 'Compliance, safety, or staff retention issues requiring response this week',
            accent: 'text-alert-rose',
            border: 'border-alert-rose/30',
            items: activeActions.filter(a => a.priority === 'urgent'),
          },
          {
            key: 'people',
            label: 'Staff & Culture',
            description: 'Team wellbeing, coaching, and morale',
            accent: 'text-accent-sage',
            border: 'border-accent-sage/30',
            items: activeActions.filter(a => a.priority !== 'urgent' && ['culture', 'staffing'].includes(a.category)),
          },
          {
            key: 'operations',
            label: 'Operations & Systems',
            description: 'Process improvements, reporting, and workflow fixes',
            accent: 'text-blue-300',
            border: 'border-blue-400/30',
            items: activeActions.filter(a => a.priority !== 'urgent' && ['operations', 'compliance'].includes(a.category)),
          },
          {
            key: 'strategic',
            label: 'Strategic',
            description: 'Communication, leadership development, and long-term planning',
            accent: 'text-gold-400',
            border: 'border-gold-500/30',
            items: activeActions.filter(a => a.priority !== 'urgent' && ['communication'].includes(a.category)),
          },
        ].filter(lane => lane.items.length > 0);

        if (activeActions.length === 0) {
          return (
            <div className="card-surface p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Survey Action Items
              </h4>
              <p className="text-xs text-text-muted text-center py-4 italic">
                {synthesizedActions.length > 0 && completedActions.length > 0
                  ? 'All action items have been pushed. Nice work!'
                  : demoMode
                    ? 'Generating action items from survey data...'
                    : 'Action items will populate here once surveys generate themes and recommended actions.'}
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {lanes.map((lane) => {
              const isImmediate = lane.key === 'immediate';
              const handleLaneClick = () => {
                if (isImmediate && onBreathingStart) {
                  onBreathingStart();
                } else {
                  setExpandedLanes(prev => ({ ...prev, [lane.key]: !prev[lane.key] }));
                }
              };

              return (
              <div key={lane.key} className={`rounded-xl border ${lane.border} bg-navy-800/30 overflow-hidden ${isImmediate ? 'relative' : ''}`}>
                {/* Lane header — clickable to expand/collapse (immediate lane triggers breathing) */}
                <button
                  onClick={handleLaneClick}
                  className="w-full px-4 py-3 text-left hover:bg-navy-800/40 transition-colors"
                  title={isImmediate && onBreathingStart ? 'Take a breath' : undefined}
                  aria-expanded={isImmediate ? undefined : expandedLanes[lane.key]}
                  aria-label={isImmediate && onBreathingStart ? `${lane.label} — Take a breath` : `${lane.label} — ${expandedLanes[lane.key] ? 'collapse' : 'expand'}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-semibold uppercase tracking-wider ${lane.accent}`}>
                      {lane.label}
                      <span className="ml-2 text-text-muted font-normal">({lane.items.length})</span>
                    </h4>
                    {isImmediate && onBreathingStart ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-400 chevron-heartbeat">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-text-muted transition-transform ${expandedLanes[lane.key] ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                  </div>
                  {!expandedLanes[lane.key] && !isImmediate && (
                    <p className="text-[11px] text-text-muted mt-0.5">{lane.description}</p>
                  )}
                </button>

                {/* Action rows — visible when expanded */}
                {expandedLanes[lane.key] ? (
                  <div className="divide-y divide-border-subtle/20 border-t border-border-subtle/30">
                  {lane.items.map((action) => (
                    <div key={action.id} className="px-4 py-3 hover:bg-navy-800/40 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${PRIORITY_COLORS[action.priority]}`}>
                              {action.priority}
                            </span>
                            <span className={`px-2 py-0.5 rounded border text-[11px] ${CATEGORY_COLORS[action.category] || 'border-border-subtle text-text-muted'}`}>
                              {action.category}
                            </span>
                            <span className="text-[11px] text-text-muted">{action.suggestedTimeline}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-text-secondary">{action.description}</p>

                          {/* Expandable rationale */}
                          <button
                            onClick={() => setExpandedRationale(expandedRationale === action.id ? null : action.id)}
                            className="text-xs text-gold-400/70 hover:text-gold-400 mt-1.5 transition-colors"
                          >
                            {expandedRationale === action.id ? 'Hide why' : 'Show why'}
                          </button>
                          {expandedRationale === action.id && (
                            <p className="text-xs text-text-muted mt-1 pl-2 border-l-2 border-gold-500/20 leading-relaxed max-w-[52ch]">
                              {action.rationale}
                            </p>
                          )}
                        </div>

                        {/* Push menu */}
                        <div className="relative flex-shrink-0" ref={openMenuId === action.id ? menuRef : undefined}>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === action.id ? null : action.id)}
                            className="w-8 h-8 mt-0.5 rounded-lg border border-border-subtle bg-navy-800 hover:bg-navy-700 hover:border-gold-500/30 flex items-center justify-center transition-all"
                            aria-label="Push action"
                            title="Push this action"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </button>
                          {openMenuId === action.id && (
                            <div className="absolute right-0 top-10 z-40 w-52 rounded-lg border border-border-subtle bg-navy-800 shadow-lg shadow-black/30 overflow-hidden">
                              {ACTION_MENU_ITEMS.map((item) => (
                                <button
                                  key={item.key}
                                  onClick={() => handleItemPush(action, item.key)}
                                  className="w-full text-left px-3 py-2 text-xs text-text-secondary hover:bg-navy-700 hover:text-text-primary transition-colors flex items-center gap-2"
                                >
                                  <span className="text-sm">{item.emoji}</span>
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                ) : null}

                {/* Firefly breathing exercise — overlays the immediate lane */}
                {isImmediate && breathingActive && onBreathingComplete && (
                  <BreathingExercise onComplete={onBreathingComplete} />
                )}
              </div>
              );
            })}
          </div>
        );
      })()}

      {/* ─── Completed (Pushed) Actions ───────────────────── */}
      {completedActions.length > 0 && (
        <div className="card-surface p-4">
          <button
            onClick={() => setCompletedExpanded(!completedExpanded)}
            className="w-full flex items-center justify-between"
            aria-expanded={completedExpanded}
            aria-label={`Completed actions — ${completedExpanded ? 'collapse' : 'expand'}`}
          >
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Completed Actions
              <span className="ml-2 text-accent-sage">({completedActions.length})</span>
            </h4>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-text-muted transition-transform ${completedExpanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {completedExpanded && (
            <div className="space-y-2 mt-3">
              {completedActions.map((action) => {
                const destination = getPushDestination(action.id);
                return (
                  <div
                    key={action.id}
                    className="rounded-lg border border-border-subtle bg-navy-800/20 opacity-70"
                  >
                    <div className="flex items-start gap-3 p-3">
                      {/* Check icon */}
                      <div className="w-5 h-5 mt-0.5 rounded bg-accent-sage/20 border border-accent-sage/40 flex items-center justify-center flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-sage">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${PRIORITY_COLORS[action.priority]}`}>
                            {action.priority}
                          </span>

                          {/* Pushed-to badge */}
                          {destination && (
                            <span className="px-2 py-0.5 rounded bg-accent-sage/10 border border-accent-sage/20 text-[11px] text-accent-sage">
                              Pushed to {PUSH_DESTINATION_LABELS[destination]}
                            </span>
                          )}
                        </div>

                        <p className="text-xs leading-relaxed text-text-muted">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Additional Notes (collapsible) ──────────────── */}
      <div className="rounded-xl border border-border-subtle bg-navy-800/50 overflow-hidden">
        <button
          onClick={() => setAdditionalNotesOpen(!additionalNotesOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-navy-800 transition-colors"
          aria-expanded={additionalNotesOpen}
          aria-label={`Additional notes — ${additionalNotesOpen ? 'collapse' : 'expand'}`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            Additional Notes
            {additionalItems.length > 0 && (
              <span className="ml-2 text-text-muted">({additionalItems.length})</span>
            )}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-text-muted transition-transform ${additionalNotesOpen ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {additionalNotesOpen && (
          <div className="px-5 pb-4">
            {additionalItems.length > 0 && (
              <div className="space-y-2 mb-3">
                {additionalItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 group">
                    <div
                      className="w-4 h-4 mt-0.5 rounded border border-border-subtle bg-navy-800 flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-accent-sage transition-colors"
                      onClick={() => handleRemoveItem(i)}
                      title="Remove item"
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddItem();
                }}
                placeholder="Add a note or action item..."
                className="input-navy flex-1 px-3 py-1.5 text-xs"
              />
              <button
                onClick={handleAddItem}
                disabled={!newItem.trim()}
                className="btn-navy px-3 py-1.5 rounded-lg text-xs disabled:opacity-30"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Meeting Agenda Generator ─────────────────────── */}
      {agendaPickerOpen && (
        <div className="card-surface p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Generate Meeting Agenda
            </h4>
            <button
              onClick={() => {
                setAgendaPickerOpen(false);
                setAgendaActionId(null);
                setSelectedMeetingType(null);
                setGeneratedAgenda(null);
              }}
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close agenda picker"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Meeting type grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {meetingTypes.map(mt => (
              <button
                key={mt.type}
                onClick={() => handleSelectMeetingType(mt.type)}
                className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                  selectedMeetingType === mt.type
                    ? 'border-gold-500/50 bg-navy-800 shadow-[0_0_8px_rgba(201,168,76,0.1)]'
                    : 'border-border-subtle bg-navy-800/40 hover:bg-navy-800 hover:border-border-medium'
                }`}
              >
                <p className={`text-[11px] font-medium ${selectedMeetingType === mt.type ? 'text-gold-400' : 'text-text-secondary'}`}>
                  {mt.label}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed max-w-[52ch]">
                  {mt.description.length > 80 ? mt.description.slice(0, 80) + '...' : mt.description}
                </p>
              </button>
            ))}
          </div>

          {/* Generated agenda preview */}
          {generatedAgenda && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border-subtle bg-navy-900/50 p-3 max-h-64 overflow-y-auto">
                <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">
                  {generatedAgenda.title}
                </p>
                {generatedAgenda.sections.map((section, i) => (
                  <div key={i} className="mb-2.5">
                    <p className="text-xs font-medium text-text-secondary">
                      {i + 1}. {section.title}
                      <span className="text-text-muted ml-1">({section.durationMinutes} min)</span>
                    </p>
                    <ul className="mt-0.5">
                      {section.items.filter(item => item.trim()).slice(0, 4).map((item, j) => (
                        <li key={j} className="text-[11px] text-text-muted leading-relaxed pl-3">
                          {item.startsWith('\u2713') || item.startsWith('\u26A0') ? item : `\u2022 ${item}`}
                        </li>
                      ))}
                      {section.items.filter(item => item.trim()).length > 4 && (
                        <li className="text-[11px] text-text-muted/50 pl-3 italic">
                          +{section.items.filter(item => item.trim()).length - 4} more...
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopyAgenda}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gold-500/30 bg-navy-800 hover:bg-navy-700 text-gold-400 text-xs transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy to Clipboard
                </button>
                <button
                  onClick={handleDownloadAgenda}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border-subtle bg-navy-800/40 hover:bg-navy-800 text-text-secondary text-xs transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── We Asked / How the Agency Responded (collapsible) ── */}
      <div className="rounded-xl border border-gold-500/30 bg-navy-800 overflow-hidden shadow-[0_0_16px_rgba(201,168,76,0.12),inset_0_1px_0_rgba(201,168,76,0.08)]">
        <button
          onClick={() => setWeAskedOpen(!weAskedOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-navy-700/50 transition-colors"
          aria-expanded={weAskedOpen}
          aria-label={`We asked, how the agency responded — ${weAskedOpen ? 'collapse' : 'expand'}`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">We Asked / How the Agency Responded</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gold-400/60 transition-transform ${weAskedOpen ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {weAskedOpen && (
          <div className="px-5 pb-4">
            {demoMode && DEMO_YOU_SAID_WE_DID.length > 0 ? (
              <>
                {/* Column headers */}
                <div className="grid grid-cols-2 gap-4 mb-3 pb-2 border-b border-border-subtle">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">We Asked</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">How the Agency Responded</p>
                </div>
                {/* Rows */}
                <div className="space-y-3">
                  {DEMO_YOU_SAID_WE_DID.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-2 gap-4 py-2 border-b border-border-subtle/30 last:border-0">
                      <p className="text-[11px] text-text-secondary italic leading-relaxed">&ldquo;{entry.youSaid}&rdquo;</p>
                      <p className="text-[11px] text-accent-sage leading-relaxed">{entry.weDid}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[11px] text-text-muted leading-relaxed max-w-[52ch]">
                No entries yet. This section will show concrete actions taken in response to staff feedback, creating a visible accountability loop.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ─── Toast ────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-accent-sage text-white shadow-[0_4px_16px_rgba(92,184,139,0.3)]'
              : 'bg-navy-800 text-gold-400 border border-gold-500/30 shadow-[0_4px_16px_rgba(201,168,76,0.15)]'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
