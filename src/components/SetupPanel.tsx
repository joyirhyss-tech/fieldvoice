'use client';

import { useState } from 'react';
import StaffManager from '@/components/StaffManager';

interface SetupPanelProps {
  open: boolean;
  onClose: () => void;
}

interface UploadSlot {
  key: string;
  label: string;
  description: string;
  file: string | null;
}

export default function SetupPanel({ open, onClose }: SetupPanelProps) {
  const [activeTab, setActiveTab] = useState<'documents' | 'roles' | 'connection'>('documents');
  const [uploads, setUploads] = useState<UploadSlot[]>([
    { key: 'policies', label: 'Policies & Procedures', description: 'Core organizational policies', file: null },
    { key: 'compliance', label: 'Rules & Compliance', description: 'Regulatory and compliance documents', file: null },
    { key: 'mandated', label: 'Mandated Reporting', description: 'Mandated reporting policies and protocols', file: null },
    { key: 'survey', label: 'Survey Policy', description: 'Survey frequency, consent, and distribution rules', file: null },
    { key: 'background', label: 'Background / Reference', description: 'Program guides, org charts, reference materials', file: null },
  ]);
  const [agencyName, setAgencyName] = useState('AIdedEQ');
  const [agencyContext, setAgencyContext] = useState('');

  const handleUpload = (key: string) => {
    setUploads((prev) =>
      prev.map((u) => (u.key === key ? { ...u, file: `${u.label}.pdf` } : u))
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-xl bg-navy-900 border-l border-border-subtle shadow-2xl h-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-navy-900 border-b border-border-subtle px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy-800 border border-border-gold flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-500">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-text-primary">Settings & Setup</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-800 text-text-muted hover:text-text-primary transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-border-subtle">
          {([
            { key: 'documents', label: 'Documents' },
            { key: 'roles', label: 'Users & Roles' },
            { key: 'connection', label: 'Connection' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeTab === tab.key
                  ? 'text-gold-400 border-b-2 border-gold-500'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {/* Agency context */}
              <div className="card-surface p-4 mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Agency Name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
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

          {activeTab === 'roles' && <StaffManager />}

          {activeTab === 'connection' && (
            <div className="space-y-4">
              <div className="card-surface p-4">
                <h4 className="text-sm font-medium text-text-primary mb-1">Database</h4>
                <p className="text-xs text-text-muted mb-3">Supabase</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-sage" />
                  <span className="text-xs text-accent-sage">Connected</span>
                </div>
              </div>
              <div className="card-surface p-4">
                <h4 className="text-sm font-medium text-text-primary mb-1">LLM Provider</h4>
                <p className="text-xs text-text-muted mb-3">Anthropic</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-sage" />
                  <span className="text-xs text-accent-sage">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
