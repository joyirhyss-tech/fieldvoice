'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSettings } from '@/lib/useSettings';
import { useStaffStore } from '@/lib/useStaffStore';
import { LoggedInUser, StaffMember } from '@/lib/types';
import { getRoleConfig } from '@/lib/roles';
import StaffManager from '@/components/StaffManager';
import ProfileCard from '@/components/ProfileCard';

interface StartConnectCardProps {
  onConnect: (user: LoggedInUser) => void;
}

type Step = 'landing' | 'settings' | 'welcome' | 'login' | 'profile';
type SettingsTab = 'documents' | 'roles' | 'connection';

interface UploadSlot {
  key: string;
  label: string;
  description: string;
  file: string | null;
}

export default function StartConnectCard({ onConnect }: StartConnectCardProps) {
  const [step, setStep] = useState<Step>('landing');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('documents');
  const { settings, updateSettings } = useSettings();
  const { staff } = useStaffStore();

  // Connection fields
  const [databaseType, setDatabaseType] = useState<'supabase' | 'custom' | ''>(settings.databaseType);
  const [databaseUrl, setDatabaseUrl] = useState(settings.databaseUrl);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(settings.supabaseAnonKey);
  const [llmProvider, setLlmProvider] = useState<'anthropic' | 'openai' | ''>(settings.llmProvider);
  const [llmApiKey, setLlmApiKey] = useState(settings.llmApiKey);

  // Documents fields
  const [agencyName, setAgencyName] = useState(settings.agencyName);
  const [agencyContext, setAgencyContext] = useState(settings.agencyContext);
  const [uploads, setUploads] = useState<UploadSlot[]>([
    { key: 'policies', label: 'Policies & Procedures', description: 'Core organizational policies', file: null },
    { key: 'compliance', label: 'Rules & Compliance', description: 'Regulatory and compliance documents', file: null },
    { key: 'mandated', label: 'Mandated Reporting', description: 'Mandated reporting policies and protocols', file: null },
    { key: 'survey', label: 'Survey Policy', description: 'Survey frequency, consent, and distribution rules', file: null },
    { key: 'background', label: 'Background / Reference', description: 'Program guides, org charts, reference materials', file: null },
  ]);

  // Login state
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  useEffect(() => {
    setDatabaseType(settings.databaseType);
    setDatabaseUrl(settings.databaseUrl);
    setSupabaseAnonKey(settings.supabaseAnonKey);
    setLlmProvider(settings.llmProvider);
    setLlmApiKey(settings.llmApiKey);
    setAgencyName(settings.agencyName);
    setAgencyContext(settings.agencyContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = (key: string) => {
    setUploads((prev) =>
      prev.map((u) => (u.key === key ? { ...u, file: `${u.label}.pdf` } : u))
    );
  };

  const saveSettings = () => {
    updateSettings({
      databaseType, databaseUrl, supabaseAnonKey,
      llmProvider, llmApiKey, agencyName, agencyContext,
    });
    setStep('welcome');
  };

  const handleSelectMember = (member: StaffMember) => {
    setSelectedMember(member);
    setAccessCodeInput('');
    setCodeError(false);
  };

  const handleCodeSubmit = () => {
    if (!selectedMember) return;
    // Bypass for now — accept any 3-digit code
    if (accessCodeInput.length === 3) {
      setStep('profile');
    } else {
      setCodeError(true);
    }
  };

  const handleEnterApp = () => {
    if (!selectedMember) return;
    onConnect({
      staffId: selectedMember.id,
      name: selectedMember.name,
      role: selectedMember.role,
    });
  };

  // ── Step 1: Landing ───────────────────────────────────────
  if (step === 'landing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="mb-10">
            <Image
              src="/fieldvoices-logo.png"
              alt="FieldVoices"
              width={465}
              height={187}
              className="mx-auto"
              priority
              unoptimized
            />
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-10 max-w-xs mx-auto">
            Smart listening, synthesis, and implementation for mission-driven organizations
          </p>
          <button
            onClick={() => setStep('settings')}
            className="btn-gold w-full max-w-xs mx-auto py-3.5 px-8 rounded-lg text-sm block"
          >
            Connect FieldVoices
          </button>
          <p className="mt-6 text-center text-xs text-text-muted">
            Mission2Impact Library
          </p>
        </div>
      </div>
    );
  }

  // ── Step 3: Welcome — "Come on in!" ───────────────────────
  if (step === 'welcome') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep">
        <div className="card-gold max-w-md w-full mx-4 p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-navy-800 border border-border-gold flex items-center justify-center glow-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Come on in!
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            FieldVoices is ready. Your setup is saved and accessible anytime in Settings.
          </p>
          <button
            onClick={() => {
              if (staff.length > 0) {
                setStep('login');
              } else {
                // No staff added yet — enter as a generic admin
                onConnect({ staffId: 'admin', name: 'Admin', role: 'ed' });
              }
            }}
            className="btn-gold w-full py-3.5 px-6 rounded-lg text-sm"
          >
            Enter FieldVoices
          </button>
          {staff.length === 0 && (
            <p className="mt-4 text-[10px] text-text-muted">
              No staff added yet — you&apos;ll enter as Admin. Add staff in Settings to enable personal logins.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Step 4: Login — "Who's logging in?" ───────────────────
  if (step === 'login') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep p-4">
        <div className="card-surface max-w-lg w-full overflow-hidden">
          <div className="px-6 py-5 border-b border-border-subtle text-center">
            <h1 className="text-lg font-bold text-text-primary mb-1">Who&apos;s logging in?</h1>
            <p className="text-xs text-text-muted">Select your name to access your personal workspace</p>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {selectedMember ? (
              /* Access code entry */
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-800 border-2 border-border-gold flex items-center justify-center">
                  <span className="text-lg font-bold text-gold-500">
                    {selectedMember.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-text-primary mb-1">{selectedMember.name}</h2>
                <p className="text-xs text-gold-400 mb-6">{getRoleConfig(selectedMember.role).label}</p>

                <div className="max-w-[180px] mx-auto">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Enter 3-digit code
                  </label>
                  <input
                    type="text"
                    value={accessCodeInput}
                    onChange={(e) => {
                      setAccessCodeInput(e.target.value.replace(/\D/g, '').slice(0, 3));
                      setCodeError(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCodeSubmit();
                    }}
                    maxLength={3}
                    className="input-navy w-full px-4 py-3 text-center text-lg font-mono tracking-[0.5em] font-semibold"
                    placeholder="•••"
                    autoFocus
                  />
                  {codeError && (
                    <p className="text-xs text-alert-rose mt-2">Enter a 3-digit code</p>
                  )}
                </div>

                <div className="mt-6 flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSelectedMember(null);
                      setAccessCodeInput('');
                    }}
                    className="px-4 py-2 text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={handleCodeSubmit}
                    disabled={accessCodeInput.length < 3}
                    className="btn-gold px-6 py-2 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              /* Staff list */
              <div className="space-y-2">
                {staff.map((member) => {
                  const role = getRoleConfig(member.role);
                  return (
                    <button
                      key={member.id}
                      onClick={() => handleSelectMember(member)}
                      className="w-full flex items-center gap-3 rounded-lg bg-navy-800/40 hover:bg-navy-800 border border-border-subtle hover:border-gold-500/30 px-4 py-3 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-navy-700 border border-border-subtle flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-text-primary">
                          {member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{member.name}</p>
                        <p className="text-xs text-text-muted">{role.label}</p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted flex-shrink-0">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 5: Profile Card ──────────────────────────────────
  if (step === 'profile' && selectedMember) {
    return <ProfileCard member={selectedMember} onEnter={handleEnterApp} />;
  }

  // ── Step 2: Full Settings ─────────────────────────────────
  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'documents',
      label: 'Documents',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      key: 'roles',
      label: 'Users & Roles',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      key: 'connection',
      label: 'Connection',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-deep p-4">
      <div className="card-surface max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <button
            onClick={() => setStep('landing')}
            className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-xs transition-colors"
            aria-label="Back to landing"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-text-primary">Settings & Setup</h1>
            <p className="text-xs text-text-muted">Configure your FieldVoices connection</p>
          </div>
          <button
            onClick={() => {
              updateSettings({
                databaseType, databaseUrl, supabaseAnonKey,
                llmProvider, llmApiKey, agencyName, agencyContext,
              });
              setStep('welcome');
            }}
            className="text-xs text-text-muted hover:text-gold-400 transition-colors underline underline-offset-2"
          >
            Skip for now &rarr;
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-border-subtle">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSettingsTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                settingsTab === tab.key
                  ? 'text-gold-400 border-b-2 border-gold-500 bg-navy-800/30'
                  : 'text-text-muted hover:text-text-secondary hover:bg-navy-800/20'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Documents Tab */}
          {settingsTab === 'documents' && (
            <div className="space-y-4">
              <div className="card-surface p-4 mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Agency Name</label>
                <input type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Your organization name" className="input-navy w-full px-3 py-2 text-sm mb-3" />
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Agency Context</label>
                <textarea value={agencyContext} onChange={(e) => setAgencyContext(e.target.value)} placeholder="Describe your organization's mission, population served, and key context..." rows={3} className="input-navy w-full px-3 py-2 text-sm resize-none" />
              </div>
              {uploads.map((slot) => (
                <div key={slot.key} className="card-surface p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-text-primary">{slot.label}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{slot.description}</p>
                    </div>
                    <button onClick={() => handleUpload(slot.key)} className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${slot.file ? 'bg-accent-sage-light text-accent-sage border border-accent-sage/20' : 'btn-navy'}`}>
                      {slot.file ? 'Uploaded' : 'Upload'}
                    </button>
                  </div>
                  {slot.file && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-sage">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {slot.file}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Users & Roles Tab — Staff CRUD */}
          {settingsTab === 'roles' && <StaffManager />}

          {/* Connection Tab */}
          {settingsTab === 'connection' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Database</label>
                <div className="flex gap-2 mb-3">
                  {(['supabase', 'custom'] as const).map((type) => (
                    <button key={type} onClick={() => setDatabaseType(type)} className={`flex-1 px-3 py-2.5 rounded-lg text-sm border transition-all ${databaseType === type ? 'border-gold-500 bg-navy-800 text-gold-400 shadow-[0_0_12px_var(--gold-glow)]' : 'border-border-subtle bg-navy-900 text-text-muted hover:border-navy-400'}`}>
                      {type === 'supabase' ? 'Supabase' : 'Custom DB'}
                    </button>
                  ))}
                </div>
                {databaseType && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">{databaseType === 'supabase' ? 'Project URL' : 'Connection String'}</label>
                      <input type="text" value={databaseUrl} onChange={(e) => setDatabaseUrl(e.target.value)} placeholder={databaseType === 'supabase' ? 'https://your-project.supabase.co' : 'postgresql://...'} className="input-navy w-full px-3 py-2 text-sm" />
                    </div>
                    {databaseType === 'supabase' && (
                      <div>
                        <label className="block text-xs text-text-muted mb-1">Anon Key</label>
                        <input type="password" value={supabaseAnonKey} onChange={(e) => setSupabaseAnonKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className="input-navy w-full px-3 py-2 text-sm" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">LLM Synthesis Engine</label>
                <div className="flex gap-2 mb-3">
                  {(['anthropic', 'openai'] as const).map((provider) => (
                    <button key={provider} onClick={() => setLlmProvider(provider)} className={`flex-1 px-3 py-2.5 rounded-lg text-sm border transition-all ${llmProvider === provider ? 'border-gold-500 bg-navy-800 text-gold-400 shadow-[0_0_12px_var(--gold-glow)]' : 'border-border-subtle bg-navy-900 text-text-muted hover:border-navy-400'}`}>
                      {provider === 'anthropic' ? 'Anthropic' : 'OpenAI'}
                    </button>
                  ))}
                </div>
                {llmProvider && (
                  <div>
                    <label className="block text-xs text-text-muted mb-1">API Key</label>
                    <input type="password" value={llmApiKey} onChange={(e) => setLlmApiKey(e.target.value)} placeholder={`${llmProvider === 'anthropic' ? 'sk-ant-' : 'sk-'}...`} className="input-navy w-full px-3 py-2 text-sm" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-subtle bg-navy-900/50">
          <button onClick={saveSettings} className="btn-gold w-full py-3 px-6 rounded-lg text-sm">
            Save & Continue
          </button>
          <p className="mt-3 text-center text-xs text-text-muted">
            You can update these settings anytime from the header
          </p>
        </div>
      </div>
    </div>
  );
}
