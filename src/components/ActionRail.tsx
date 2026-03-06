'use client';

import { useState } from 'react';
import { WorkspaceView, UserRole } from '@/lib/types';
import { ROLES, getRoleConfig } from '@/lib/roles';
import LanguageSelector from '@/components/LanguageSelector';

interface LiveCampaign {
  id: string;
  title: string;
  participants: number;
  responses: number;
  daysLeft: number;
}

interface LiveStatus {
  activeFieldVoices: number;
  totalParticipants: number;
  totalResponses: number;
  campaigns: LiveCampaign[];
}

interface CurrentSurvey {
  id: string;
  title: string;
  ownerNote: string;
  ownerName: string;
  ownerRole: string;
  questionsAnswered: number;
  questionsTotal: number;
  dueDate: string;
  windowStart: string;
  windowEnd: string;
  accepted: boolean;
}

interface MyParticipation {
  activeSurveys: number;
  pendingQuestions: number;
  lastResponseDate: string;
  currentSurvey: CurrentSurvey | null;
}

interface ActionRailProps {
  activeView: WorkspaceView | null;
  onSelectView: (view: WorkspaceView) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  myParticipation?: MyParticipation;
  liveStatus?: LiveStatus;
  onAcceptSurvey?: (method?: string) => void;
}

export default function ActionRail({
  activeView,
  onSelectView,
  currentRole,
  onRoleChange,
  collapsed,
  onToggleCollapse,
  myParticipation,
  liveStatus,
  onAcceptSurvey,
}: ActionRailProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [liveExpanded, setLiveExpanded] = useState(false);
  const [surveyExpanded, setSurveyExpanded] = useState(false);
  const [selectedCadence, setSelectedCadence] = useState('daily');
  const [selectedMethod, setSelectedMethod] = useState('desktop');
  const roleConfig = getRoleConfig(currentRole);

  const totalLive = liveStatus?.activeFieldVoices || 0;

  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-4 w-12 bg-navy-900 border-r border-border-subtle h-full">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-navy-800 text-text-muted hover:text-gold-400 transition-colors mb-4"
          title="Expand panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        {/* Collapsed live count */}
        {totalLive > 0 && (
          <div className="w-8 h-8 rounded-lg bg-navy-800 border border-gold-500/30 flex items-center justify-center mb-2 cursor-pointer hover:border-gold-500/50 transition-colors" title={`${totalLive} live FieldVoices`}>
            <span className="text-[10px] font-bold text-gold-400">{totalLive}</span>
          </div>
        )}
        {/* Collapsed participation dot */}
        {myParticipation && myParticipation.activeSurveys > 0 && (
          <div className="w-8 h-8 rounded-lg bg-navy-800 border border-accent-sage/40 flex items-center justify-center mb-2 cursor-pointer hover:border-accent-sage transition-colors" title={`${myParticipation.pendingQuestions} questions waiting`}>
            <div className="w-2.5 h-2.5 rounded-full bg-accent-sage glow-pulse" />
          </div>
        )}
        <div className="w-8 h-8 rounded-lg bg-navy-800 border border-border-gold flex items-center justify-center mb-4" title="Your Attention Please">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-500">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-navy-900 border-r border-border-subtle overflow-y-auto">
      {/* Collapse control */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border-subtle">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-500">
          Your Attention Please
        </h2>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-navy-800 text-text-muted hover:text-text-primary transition-colors"
          title="Collapse panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Total Live FieldVoices — clickable to expand */}
      <div className="px-3 py-2.5 border-b border-border-subtle">
        <button
          onClick={() => setLiveExpanded(!liveExpanded)}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-navy-800 border border-gold-500/20 hover:border-gold-500/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${totalLive > 0 ? 'bg-accent-sage glow-pulse' : 'bg-navy-600'}`} />
            <span className="text-xs font-medium text-text-primary">
              {totalLive} Total Live
            </span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-text-muted transition-transform ${liveExpanded ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {liveExpanded && liveStatus && (
          <div className="mt-2 space-y-1.5">
            {liveStatus.campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-lg bg-navy-800/60 p-2 border border-border-subtle">
                <p className="text-[10px] text-text-primary font-medium truncate">{campaign.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-navy-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold-500/80 transition-all"
                      style={{ width: `${Math.round((campaign.responses / campaign.participants) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text-muted">{campaign.responses}/{campaign.participants}</span>
                </div>
                <p className="text-[9px] text-text-muted mt-0.5">{campaign.daysLeft}d left</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your Voice is Needed — survey invite card */}
      {myParticipation && myParticipation.activeSurveys > 0 && myParticipation.currentSurvey && (
        <div className="px-3 py-3 border-b border-border-subtle">
          <div className="rounded-lg bg-navy-800 border border-accent-sage/30 p-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-accent-sage glow-pulse flex-shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-sage">Your voice is needed</span>
            </div>

            {/* Survey name — clickable to expand */}
            <button
              onClick={() => setSurveyExpanded(!surveyExpanded)}
              className="w-full text-left"
            >
              <p className="text-xs text-text-primary leading-relaxed font-medium">
                {myParticipation.currentSurvey.title}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">
                {surveyExpanded ? '▾ Hide details' : '▸ View invite details'}
              </p>
            </button>

            {/* Expanded: Owner note, cadence, method, accept */}
            {surveyExpanded && (
              <div className="mt-2.5 space-y-2.5">
                {/* Owner note */}
                <div className="rounded bg-navy-700/50 p-2 border-l-2 border-accent-sage/40">
                  <p className="text-[10px] text-text-muted mb-0.5">
                    From {myParticipation.currentSurvey.ownerName} · {myParticipation.currentSurvey.ownerRole}
                  </p>
                  <p className="text-[10px] text-text-secondary italic leading-relaxed">
                    &ldquo;{myParticipation.currentSurvey.ownerNote}&rdquo;
                  </p>
                </div>

                {/* Window */}
                <div className="text-[10px] text-text-muted">
                  Window: {myParticipation.currentSurvey.windowStart} — {myParticipation.currentSurvey.windowEnd}
                </div>

                {/* Cadence choice */}
                <div>
                  <label className="block text-[10px] text-text-muted mb-1">How often would you like nudges?</label>
                  <div className="flex gap-1">
                    {['daily', 'every-other', 'twice-weekly', 'weekly'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCadence(c)}
                        className={`px-1.5 py-1 rounded text-[9px] border transition-colors ${
                          selectedCadence === c
                            ? 'border-accent-sage bg-accent-sage/10 text-accent-sage font-medium'
                            : 'border-border-subtle text-text-muted hover:border-border-medium'
                        }`}
                      >
                        {c === 'daily' ? 'Daily' : c === 'every-other' ? 'Alt Days' : c === 'twice-weekly' ? '2x/wk' : 'Weekly'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method choice */}
                <div>
                  <label className="block text-[10px] text-text-muted mb-1">How do you want to respond?</label>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { value: 'desktop', label: 'Desktop', icon: '💻' },
                      { value: 'text', label: 'Text', icon: '📱' },
                      { value: 'email', label: 'Email', icon: '📧' },
                      { value: 'voice', label: 'Voice', icon: '🎙️' },
                    ].map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setSelectedMethod(m.value)}
                        className={`px-1.5 py-1 rounded text-[9px] border transition-colors flex items-center gap-1 ${
                          selectedMethod === m.value
                            ? 'border-accent-sage bg-accent-sage/10 text-accent-sage font-medium'
                            : 'border-border-subtle text-text-muted hover:border-border-medium'
                        }`}
                      >
                        <span>{m.icon}</span> {m.label}
                      </button>
                    ))}
                  </div>
                  {selectedMethod === 'voice' && (
                    <p className="text-[9px] text-text-muted mt-1 italic">Max 5 min verbal response per prompt</p>
                  )}
                </div>

                {/* Accept button */}
                <button
                  onClick={() => {
                    if (onAcceptSurvey) onAcceptSurvey(selectedMethod);
                    setSurveyExpanded(false);
                  }}
                  className="w-full px-2 py-2 rounded-lg text-xs font-medium bg-accent-sage text-white hover:bg-accent-sage/90 transition-colors shadow-[0_2px_8px_rgba(92,184,139,0.25)]"
                >
                  Accept & Start Listening
                </button>
              </div>
            )}

            {/* If already accepted — show progress */}
            {!surveyExpanded && myParticipation.currentSurvey.accepted && (
              <>
                <div className="flex items-center gap-2 mt-2 mb-2">
                  <div className="flex-1 h-1 rounded-full bg-navy-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-sage transition-all"
                      style={{ width: `${Math.round((myParticipation.currentSurvey.questionsAnswered / myParticipation.currentSurvey.questionsTotal) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-text-muted flex-shrink-0">
                    {myParticipation.currentSurvey.questionsAnswered}/{myParticipation.currentSurvey.questionsTotal}
                  </span>
                </div>
                <button
                  onClick={() => onSelectView('survey-response')}
                  className="w-full px-2 py-1.5 rounded text-[10px] font-medium bg-accent-sage/10 border border-accent-sage/20 text-accent-sage hover:bg-accent-sage/20 transition-colors"
                >
                  Continue responding →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Role selector */}
      <div className="px-3 py-3 border-b border-border-subtle">
        <label className="block text-xs text-text-muted mb-1.5">Your role</label>
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-navy-800 border border-border-subtle text-sm text-text-primary hover:border-gold-500/40 transition-colors"
          >
            <span>{roleConfig.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-text-muted transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {roleDropdownOpen && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-navy-800 border border-border-medium rounded-lg shadow-xl overflow-hidden">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  onClick={() => {
                    onRoleChange(role.value);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                    currentRole === role.value
                      ? 'bg-navy-700 text-gold-400'
                      : 'text-text-secondary hover:bg-navy-700 hover:text-text-primary'
                  }`}
                >
                  <div className="font-medium">{role.label}</div>
                  <div className="text-xs text-text-muted mt-0.5">{role.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main action buttons */}
      <div className="px-3 py-4 space-y-2">
        {roleConfig.canRequest && (
          <button
            onClick={() => onSelectView('request-fieldvoice')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${
              activeView === 'request-fieldvoice' || activeView === 'intention' || activeView === 'audience' || activeView === 'review' || activeView === 'push'
                ? 'btn-gold'
                : 'btn-navy'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            Request FieldVoices
          </button>
        )}

        <button
          onClick={() => onSelectView('be-heard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${
            activeView === 'be-heard' || activeView === 'survey-response'
              ? 'btn-gold'
              : 'btn-navy'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Be Heard
        </button>
      </div>

      {/* Divider */}
      <div className="px-3">
        <div className="border-t border-border-subtle" />
      </div>

      {/* Secondary nav */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        <button
          onClick={() => onSelectView('workplan')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
            activeView === 'workplan'
              ? 'bg-navy-700 text-gold-400'
              : 'text-text-muted hover:bg-navy-800 hover:text-text-primary'
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
          </svg>
          Work Plan
        </button>
        <button
          onClick={() => onSelectView('daily-brief')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
            activeView === 'daily-brief'
              ? 'bg-navy-700 text-gold-400'
              : 'text-text-muted hover:bg-navy-800 hover:text-text-primary'
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Daily Brief
        </button>
        <button
          onClick={() => onSelectView('archive')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
            activeView === 'archive'
              ? 'bg-navy-700 text-gold-400'
              : 'text-text-muted hover:bg-navy-800 hover:text-text-primary'
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
          Archive
        </button>
      </nav>

      {/* Language selector — equity: language access is a right */}
      <div className="px-3 py-2 border-t border-border-subtle mt-auto">
        <LanguageSelector />
      </div>
    </div>
  );
}
