'use client';

import { useLocalStorage } from './useLocalStorage';

export interface FieldVoicesSettings {
  // Connection
  databaseType: 'supabase' | 'custom' | '';
  databaseUrl: string;
  supabaseAnonKey: string;
  llmProvider: 'anthropic' | 'openai' | '';
  llmApiKey: string;

  // Agency
  agencyName: string;
  agencyContext: string;
}

const DEFAULT_SETTINGS: FieldVoicesSettings = {
  databaseType: '',
  databaseUrl: '',
  supabaseAnonKey: '',
  llmProvider: '',
  llmApiKey: '',
  agencyName: '',
  agencyContext: '',
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<FieldVoicesSettings>(
    'fieldvoices-settings',
    DEFAULT_SETTINGS,
  );

  const updateSettings = (updates: Partial<FieldVoicesSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const hasApiKey = settings.llmProvider !== '' && settings.llmApiKey.trim().length > 4;

  return { settings, updateSettings, hasApiKey };
}
