'use client';

import { useState } from 'react';
import Image from 'next/image';

interface StartConnectCardProps {
  onConnect: () => void;
}

type Step = 'landing' | 'settings' | 'welcome';
type SettingsTab = 'connection' | 'documents' | 'roles';

interface ConnectionData {
  databaseType: 'supabase' | 'custom' | '';
  databaseUrl: string;
  supabaseAnonKey: string;
  llmProvider: 'anthropic' | 'openai' | '';
  llmApiKey: string;
}

interface UploadSlot {
  key: string;
  label: string;
  description: string;
  file: string | null;
}

export default function StartConnectCard({ onConnect }: StartConnectCardProps) {
  const [step, setStep] = useState<Step>('landing');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('connection');

  // Connection state
  const [connection, setConnection] = useState<ConnectionData>({
    databaseType: '',
    databaseUrl: '',
    supabaseAnonKey: '',
    llmProvider: '',
    llmApiKey: '',
  });

  // Documents state
  const [agencyName, setAgencyName] = useState('');
  const [agencyContext, setAgencyContext] = useState('');
  const [uploads, setUploads] = useState<UploadSlot[]>([
    { key: 'policies', label: 'Policies & Procedures', description: 'Core organizational policies', file: null },
    { key: 'compliance', label: 'Rules & Compliance', description: 'Regulatory and compliance documents', file: null },
    { key: 'mandated', label: 'Mandated Reporting', description: 'Mandated reporting policies and protocols', file: null },
    { key: 'survey', label: 'Survey Policy', description: 'Survey frequency, consent, and distribution rules', file: null },
    { key: 'background', label: 'Background / Reference', description: 'Program guides, org charts, reference materials', file: null },
  ]);

  const handleUpload = (key: string) => {
    setUploads((prev) =>
      prev.map((u) => (u.key === key ? { ...u, file: `${u.label}.pdf` } : u))
    );
  };

  // ── Step 1: Landing — Logo + Connect button ───────────────
  if (step === 'landing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="mb-10">
            <Image
              src="/fieldvoices-logo.png"
              alt="FieldVoices"
              width={424}
              height={139}
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
            onClick={onConnect}
            className="btn-gold w-full py-3.5 px-6 rounded-lg text-sm"
          >
            Enter FieldVoices
          </button>
        </div>
      </div>
    );
  }

  // ── Step 2: Full Settings ─────────────────────────────────
  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
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
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-deep p-4">
      <div className="card-surface max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
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
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold text-text-primary">Settings & Setup</h1>
            <p className="text-xs text-text-muted">Configure your FieldVoices connection</p>
          </div>
          {/* Bypass / Skip button */}
          <button
            onClick={() => setStep('welcome')}
            className="text-xs text-text-muted hover:text-gold-400 transition-colors underline underline-offset-2"
          >
            Skip for now →
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
          {/* ── Connection Tab ─────────────────────────────── */}
          {settingsTab === 'connection' && (
            <div className="space-y-6">
              {/* Database section */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Database
                </label>
                <div className="flex gap-2 mb-3">
                  {(['supabase', 'custom'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setConnection((s) => ({ ...s, databaseType: type }))}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm border transition-all ${
                        connection.databaseType === type
                          ? 'border-gold-500 bg-navy-800 text-gold-400 shadow-[0_0_12px_var(--gold-glow)]'
                          : 'border-border-subtle bg-navy-900 text-text-muted hover:border-navy-400'
                      }`}
                    >
                      {type === 'supabase' ? 'Supabase' : 'Custom DB'}
                    </button>
                  ))}
                </div>
                {connection.databaseType && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">
                        {connection.databaseType === 'supabase' ? 'Project URL' : 'Connection String'}
                      </label>
                      <input
                        type="text"
                        value={connection.databaseUrl}
                        onChange={(e) => setConnection((s) => ({ ...s, databaseUrl: e.target.value }))}
                        placeholder={connection.databaseType === 'supabase' ? 'https://your-project.supabase.co' : 'postgresql://...'}
                        className="input-navy w-full px-3 py-2 text-sm"
                      />
                    </div>
                    {connection.databaseType === 'supabase' && (
                      <div>
                        <label className="block text-xs text-text-muted mb-1">Anon Key</label>
                        <input
                          type="password"
                          value={connection.supabaseAnonKey}
                          onChange={(e) => setConnection((s) => ({ ...s, supabaseAnonKey: e.target.value }))}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="input-navy w-full px-3 py-2 text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* LLM provider section */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  LLM Synthesis Engine
                </label>
                <div className="flex gap-2 mb-3">
                  {(['anthropic', 'openai'] as const).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setConnection((s) => ({ ...s, llmProvider: provider }))}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm border transition-all ${
                        connection.llmProvider === provider
                          ? 'border-gold-500 bg-navy-800 text-gold-400 shadow-[0_0_12px_var(--gold-glow)]'
                          : 'border-border-subtle bg-navy-900 text-text-muted hover:border-navy-400'
                      }`}
                    >
                      {provider === 'anthropic' ? 'Anthropic' : 'OpenAI'}
                    </button>
                  ))}
                </div>
                {connection.llmProvider && (
                  <div>
                    <label className="block text-xs text-text-muted mb-1">API Key</label>
                    <input
                      type="password"
                      value={connection.llmApiKey}
                      onChange={(e) => setConnection((s) => ({ ...s, llmApiKey: e.target.value }))}
                      placeholder={`${connection.llmProvider === 'anthropic' ? 'sk-ant-' : 'sk-'}...`}
                      className="input-navy w-full px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Documents Tab ──────────────────────────────── */}
          {settingsTab === 'documents' && (
            <div className="space-y-4">
              {/* Agency context */}
              <div className="card-surface p-4 mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Agency Name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Your organization name"
                  className="input-navy w-full px-3 py-2 text-sm mb-3"
                />
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Agency Context
                </label>
                <textarea
                  value={agencyContext}
                  onChange={(e) => setAgencyContext(e.target.value)}
                  placeholder="Describe your organization's mission, population served, and key context..."
                  rows={3}
                  className="input-navy w-full px-3 py-2 text-sm resize-none"
                />
              </div>

              {/* Document upload slots */}
              {uploads.map((slot) => (
                <div key={slot.key} className="card-surface p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-text-primary">{slot.label}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{slot.description}</p>
                    </div>
                    <button
                      onClick={() => handleUpload(slot.key)}
                      className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                        slot.file
                          ? 'bg-accent-sage-light text-accent-sage border border-accent-sage/20'
                          : 'btn-navy'
                      }`}
                    >
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

          {/* ── Users & Roles Tab ──────────────────────────── */}
          {settingsTab === 'roles' && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary mb-2">
                Configure team members and their roles. Role assignment controls visibility, workflow access, and action routing.
              </p>
              {[
                { role: 'Executive Director', description: 'Full visibility, approvals, strategic oversight', count: 1 },
                { role: 'EVP', description: 'Operational oversight, cross-department view', count: 1 },
                { role: 'Director of Programs', description: 'Request surveys, review synthesis, manage follow-ups', count: 2 },
                { role: 'Site Supervisor', description: 'Site-level surveys, team feedback access', count: 4 },
                { role: 'Direct Service', description: 'Respond to surveys, Be Heard submissions', count: 12 },
                { role: 'Program Team', description: 'Collaborative input, workplan visibility', count: 3 },
              ].map((r) => (
                <div key={r.role} className="card-surface p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{r.role}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{r.description}</p>
                      <p className="text-xs text-text-muted mt-1">{r.count} member{r.count !== 1 ? 's' : ''}</p>
                    </div>
                    <button className="btn-navy px-3 py-1.5 rounded-lg text-xs flex-shrink-0">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — Save & Continue + Bypass */}
        <div className="px-6 py-4 border-t border-border-subtle bg-navy-900/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep('welcome')}
              className="btn-gold flex-1 py-3 px-6 rounded-lg text-sm"
            >
              Save & Continue
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-text-muted">
            You can update these settings anytime from the header
          </p>
        </div>
      </div>
    </div>
  );
}
