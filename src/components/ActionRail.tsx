'use client';

import { useState } from 'react';
import { WorkspaceView, UserRole } from '@/lib/types';
import { getRoleConfig } from '@/lib/roles';
import LanguageSelector from '@/components/LanguageSelector';
import PeopleClusterIcon from '@/components/PeopleClusterIcon';

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
  userName: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  myParticipation?: MyParticipation;
  liveStatus?: LiveStatus;
  onAcceptSurvey?: (method?: string) => void;
  onLogout?: () => void;
}

export default function ActionRail({
  activeView,
  onSelectView,
  currentRole,
  userName,
  collapsed,
  onToggleCollapse,
  myParticipation,
  liveStatus,
  onAcceptSurvey,
  onLogout,
}: ActionRailProps) {
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
          aria-expanded="false"
          aria-label="Expand navigation panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        {/* Collapsed live count */}
        {totalLive > 0 && (
          <div className="w-8 h-8 rounded-lg bg-navy-800 border border-gold-500/30 flex items-center justify-center mb-2 cursor-pointer hover:border-gold-500/50 transition-colors" title={`${totalLive} live FieldVoices`}>
            <span className="text-[11px] font-bold text-gold-400">{totalLive}</span>
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

  const pendingQuestions = myParticipation?.pendingQuestions || 0;

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
          aria-expanded="true"
          aria-label="Collapse navigation panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* 1. Logged-in user badge */}
      <div className="px-3 py-3 border-b border-border-subtle">
        <button
          onClick={() => onSelectView('home')}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors cursor-pointer"
          title="Go to Home"
        >
          <div className="w-8 h-8 rounded-full bg-navy-700 border border-border-gold flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-gold-400">
              {userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-medium text-text-primary truncate">{userName}</p>
            <p className="text-xs text-gold-400">{roleConfig.label}</p>
          </div>
        </button>
      </div>

      {/* 2-3. Primary action buttons */}
      <div className="px-3 py-4 space-y-2">
        {/* My Impact Plan — hero button for Tier 1 leaders */}
        {roleConfig.canRequest && (
          <button
            onClick={() => {
              onSelectView('home');
              setTimeout(() => {
                document.getElementById('impact-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-left text-sm font-semibold transition-all bg-gradient-to-r from-gold-500/20 to-gold-500/10 border border-gold-500/40 text-gold-400 hover:border-gold-500/60 hover:from-gold-500/25 hover:to-gold-500/15 hover:shadow-[0_0_16px_var(--gold-glow)] group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-400 group-hover:scale-110 transition-transform">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            My Impact Plan
          </button>
        )}

        {roleConfig.canRequest && (
          <button
            onClick={() => onSelectView('request-fieldvoice')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${
              activeView === 'request-fieldvoice' || activeView === 'intention' || activeView === 'audience' || activeView === 'review' || activeView === 'push'
                ? 'btn-gold'
                : 'btn-navy'
            }`}
          >
            <PeopleClusterIcon size={18} />
            Create Survey
          </button>
        )}

        <button
          onClick={() => onSelectView('be-heard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${
            activeView === 'be-heard'
              ? 'btn-gold'
              : 'btn-navy'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Be Heard
        </button>

        {/* 4. Your Voice Is Needed — compact button with badge */}
        <button
          onClick={() => onSelectView('survey-invite')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${
            activeView === 'survey-invite' || activeView === 'survey-response'
              ? 'btn-gold'
              : 'btn-navy'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span className="flex-1">Your Voice Is Needed</span>
          {pendingQuestions > 0 && (
            <span className="w-5 h-5 rounded-full bg-accent-sage text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 glow-pulse">
              {pendingQuestions}
            </span>
          )}
        </button>
      </div>

      {/* 5. Total Live FieldVoices */}
      <div className="px-3 pb-3">
        <button
          onClick={() => setLiveExpanded(!liveExpanded)}
          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-navy-800 border border-gold-500/20 hover:border-gold-500/40 transition-colors"
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

        {liveExpanded && liveStatus && liveStatus.campaigns.length > 0 && (
          <div className="mt-2 space-y-2.5">
            {liveStatus.campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-lg bg-navy-800/60 p-2 border border-border-subtle">
                <p className="text-xs text-text-primary font-medium truncate">{campaign.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-navy-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold-500/80 transition-all"
                      style={{ width: `${Math.round((campaign.responses / campaign.participants) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-text-muted">{campaign.responses}/{campaign.participants}</span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">{campaign.daysLeft}d left</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Divider */}
      <div className="px-3">
        <div className="border-t border-border-subtle" />
      </div>

      {/* 7-8. Secondary nav */}
      <nav className="flex-1 px-3 py-3 space-y-2">
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
        {roleConfig.canRequest && (
          <button
            onClick={() => onSelectView('survey-bank')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
              activeView === 'survey-bank'
                ? 'bg-navy-700 text-gold-400'
                : 'text-text-muted hover:bg-navy-800 hover:text-text-primary'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Survey Bank
          </button>
        )}
      </nav>

      {/* 9. Language selector — equity: language access is a right */}
      <div className="px-3 py-2 border-t border-border-subtle mt-auto">
        <LanguageSelector />
      </div>
    </div>
  );
}
