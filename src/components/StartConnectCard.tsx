'use client';

import { useState } from 'react';
import Image from 'next/image';

interface StartConnectCardProps {
  onConnect: () => void;
}

type Step = 'landing' | 'config' | 'welcome';

interface SetupData {
  databaseUrl: string;
  databaseType: 'supabase' | 'custom' | '';
  llmProvider: 'anthropic' | 'openai' | '';
  apiKey: string;
}

export default function StartConnectCard({ onConnect }: StartConnectCardProps) {
  const [step, setStep] = useState<Step>('landing');
  const [setup, setSetup] = useState<SetupData>({
    databaseUrl: '',
    databaseType: '',
    llmProvider: '',
    apiKey: '',
  });

  const canFinish =
    setup.databaseType !== '' &&
    setup.llmProvider !== '' &&
    setup.apiKey.trim().length > 4;

  // ── Step 1: Landing — Logo + Connect button ───────────────
  if (step === 'landing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep">
        <div className="max-w-md w-full mx-4 text-center">
          {/* Logo — invert for dark background */}
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

          {/* Tagline */}
          <p className="text-text-secondary text-sm leading-relaxed mb-10 max-w-xs mx-auto">
            Smart listening, synthesis, and implementation for mission-driven organizations
          </p>

          {/* Single Connect button */}
          <button
            onClick={() => setStep('config')}
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
            FieldVoices is connected and ready. Your setup is saved and accessible anytime in Settings.
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

  // ── Step 2: Config — Database + LLM setup ─────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-deep">
      <div className="card-surface max-w-lg w-full mx-4 p-8">
        {/* Back button */}
        <button
          onClick={() => setStep('landing')}
          className="flex items-center gap-1.5 text-text-muted hover:text-text-primary text-xs mb-6 transition-colors"
          aria-label="Back to landing"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-text-primary mb-1">
            Configure Connection
          </h1>
          <p className="text-text-muted text-sm">
            Set up your database and LLM synthesis engine
          </p>
        </div>

        <div className="space-y-5">
          {/* Database config */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Database
            </label>
            <div className="flex gap-2 mb-3">
              {(['supabase', 'custom'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSetup((s) => ({ ...s, databaseType: type }))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm border transition-all ${
                    setup.databaseType === type
                      ? 'border-gold-500 bg-navy-800 text-gold-400 shadow-[0_0_12px_var(--gold-glow)]'
                      : 'border-border-subtle bg-navy-900 text-text-muted hover:border-navy-400'
                  }`}
                >
                  {type === 'supabase' ? 'Supabase' : 'Custom DB'}
                </button>
              ))}
            </div>
            {setup.databaseType && (
              <input
                type="text"
                value={setup.databaseUrl}
                onChange={(e) => setSetup((s) => ({ ...s, databaseUrl: e.target.value }))}
                placeholder={setup.databaseType === 'supabase' ? 'https://your-project.supabase.co' : 'postgresql://...'}
                className="input-navy w-full px-3 py-2 text-sm"
              />
            )}
          </div>

          {/* LLM provider */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              LLM Synthesis Engine
            </label>
            <div className="flex gap-2 mb-3">
              {(['anthropic', 'openai'] as const).map((provider) => (
                <button
                  key={provider}
                  onClick={() => setSetup((s) => ({ ...s, llmProvider: provider }))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm border transition-all ${
                    setup.llmProvider === provider
                      ? 'border-gold-500 bg-navy-800 text-gold-400 shadow-[0_0_12px_var(--gold-glow)]'
                      : 'border-border-subtle bg-navy-900 text-text-muted hover:border-navy-400'
                  }`}
                >
                  {provider === 'anthropic' ? 'Anthropic' : 'OpenAI'}
                </button>
              ))}
            </div>
            {setup.llmProvider && (
              <input
                type="password"
                value={setup.apiKey}
                onChange={(e) => setSetup((s) => ({ ...s, apiKey: e.target.value }))}
                placeholder={`${setup.llmProvider === 'anthropic' ? 'sk-ant-' : 'sk-'}...`}
                className="input-navy w-full px-3 py-2 text-sm"
              />
            )}
          </div>
        </div>

        <button
          onClick={() => setStep('welcome')}
          disabled={!canFinish}
          className="btn-gold w-full mt-8 py-3 px-6 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Connect
        </button>

        <p className="mt-4 text-center text-xs text-text-muted">
          Mission2Impact Library
        </p>
      </div>
    </div>
  );
}
