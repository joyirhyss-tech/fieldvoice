'use client';

import { useState } from 'react';
import { WorkspaceView, UserRole } from '@/lib/types';
import { getRoleConfig } from '@/lib/roles';
import PeopleClusterIcon from '@/components/PeopleClusterIcon';

interface MobileNavProps {
  activeView: WorkspaceView | null;
  onSelectView: (view: WorkspaceView) => void;
  currentRole: UserRole;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  onOpenAgencyPanel?: () => void;
}

export default function MobileNav({
  activeView,
  onSelectView,
  currentRole,
  onLogout,
  onOpenSettings,
  onOpenAgencyPanel,
}: MobileNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const roleConfig = getRoleConfig(currentRole);

  const isActive = (views: string[]) => views.includes(activeView || '');

  const handleNav = (view: WorkspaceView) => {
    if (view === 'request-fieldvoice') {
      onSelectView('intention' as WorkspaceView);
    } else {
      onSelectView(view);
    }
    setMoreOpen(false);
  };

  // Role-aware primary tabs
  const tabs = roleConfig.canRequest
    ? [
        { key: 'home', label: 'Home', views: ['home'], icon: 'home' },
        { key: 'request-fieldvoice', label: 'Survey', views: ['request-fieldvoice', 'intention', 'audience', 'review', 'push'], icon: 'survey' },
        { key: 'be-heard', label: 'Be Heard', views: ['be-heard'], icon: 'beheard' },
        { key: 'daily-brief', label: 'Brief', views: ['daily-brief'], icon: 'brief' },
        { key: 'more', label: 'More', views: [], icon: 'more' },
      ]
    : [
        { key: 'home', label: 'Home', views: ['home'], icon: 'home' },
        { key: 'be-heard', label: 'Be Heard', views: ['be-heard'], icon: 'beheard' },
        { key: 'survey-invite', label: 'Voice', views: ['survey-invite', 'survey-response'], icon: 'voice' },
        { key: 'daily-brief', label: 'Brief', views: ['daily-brief'], icon: 'brief' },
        { key: 'more', label: 'More', views: [], icon: 'more' },
      ];

  const renderIcon = (icon: string, active: boolean) => {
    const cls = `w-5 h-5 ${active ? 'text-gold-400' : 'text-text-muted'}`;
    switch (icon) {
      case 'home':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
        );
      case 'survey':
        return <PeopleClusterIcon size={20} className={cls} />;
      case 'beheard':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      case 'voice':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        );
      case 'brief':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );
      case 'more':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* More menu overlay */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMoreOpen(false)} role="dialog" aria-modal="true" aria-label="More options">
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          <div
            className="absolute bottom-16 left-0 right-0 bg-navy-900 border-t border-border-subtle rounded-t-2xl p-4 space-y-1 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted px-3 mb-2">Navigation</p>

            {/* Items not in the primary nav */}
            {!roleConfig.canRequest && (
              <button
                onClick={() => handleNav('survey-invite')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-navy-800 transition-colors text-left"
              >
                {renderIcon('voice', false)}
                Your Voice Is Needed
              </button>
            )}

            <button
              onClick={() => handleNav('archive')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-navy-800 transition-colors text-left"
            >
              <svg className="w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              Archive
            </button>

            {roleConfig.canRequest && (
              <button
                onClick={() => handleNav('survey-bank')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-navy-800 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                Survey Bank
              </button>
            )}

            {onOpenAgencyPanel && (
              <button
                onClick={() => { onOpenAgencyPanel(); setMoreOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-navy-800 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Agency-Wide
              </button>
            )}

            <div className="border-t border-border-subtle my-2" />

            {onOpenSettings && (
              <button
                onClick={() => { onOpenSettings(); setMoreOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-navy-800 transition-colors text-left"
              >
                <svg className="w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                Settings
              </button>
            )}

            {onLogout && (
              <button
                onClick={() => { onLogout(); setMoreOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-alert-rose hover:bg-navy-800 transition-colors text-left"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-navy-900 border-t border-border-subtle safe-area-bottom" role="navigation" aria-label="Mobile navigation">
        <div className="flex items-center justify-around px-1 py-1">
          {tabs.map((tab) => {
            const active = tab.key === 'more' ? moreOpen : isActive(tab.views);
            return (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.key === 'more') {
                    setMoreOpen(!moreOpen);
                  } else {
                    handleNav(tab.key as WorkspaceView);
                  }
                }}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
                  active ? 'text-gold-400' : 'text-text-muted'
                }`}
                aria-current={active && tab.key !== 'more' ? 'page' : undefined}
                aria-label={tab.label}
              >
                {renderIcon(tab.icon, active)}
                <span className="text-[11px] font-medium truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
