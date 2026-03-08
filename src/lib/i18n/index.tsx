'use client';

/**
 * FieldVoices i18n Framework
 *
 * Equity-forward multilingual support. This framework was designed with
 * frontline workers in mind, many of whom speak languages other than
 * English as their primary language.
 *
 * Architecture:
 * - LanguageProvider wraps the app and holds the current locale
 * - useTranslation() hook returns a t() function for string lookup
 * - Missing translations fall back to English automatically
 * - Interpolation: t('key', { name: 'Dana' }) replaces {name} → Dana
 * - RTL support built in for Arabic and future RTL languages
 *
 * Adding a new language:
 * 1. Create a new file in this folder (e.g., fr.ts)
 * 2. Export a Partial<TranslationStrings> with translated keys
 * 3. Import and add it to the `translations` map below
 * 4. Add a LanguageOption entry to LANGUAGES
 * 5. Keys not translated will automatically fall back to English
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { SupportedLocale, LanguageOption, TranslationStrings } from './types';
import en from './en';
import es from './es';

// ── Translation Registry ────────────────────────────────────
// Add new languages here after creating their translation file
const translations: Record<SupportedLocale, Partial<TranslationStrings>> = {
  en,
  es,
  // Skeleton entries: create the files when community translators contribute
  fr: {},
  ht: {},
  zh: {},
  ar: {},
};

// ── Language Metadata ───────────────────────────────────────
// Used by the language selector UI
export const LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', completeness: 'full' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', dir: 'ltr', completeness: 'partial' },
  { code: 'fr', nativeName: 'Français', englishName: 'French', dir: 'ltr', completeness: 'skeleton' },
  { code: 'ht', nativeName: 'Kreyòl Ayisyen', englishName: 'Haitian Creole', dir: 'ltr', completeness: 'skeleton' },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese', dir: 'ltr', completeness: 'skeleton' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', dir: 'rtl', completeness: 'skeleton' },
];

// ── Translation Function ────────────────────────────────────

/**
 * Look up a translation key with optional interpolation.
 *
 * @param locale - Current locale
 * @param key - Translation key (e.g., 'nav.beHeard')
 * @param params - Optional interpolation params (e.g., { count: 5 })
 * @returns Translated string, or English fallback, or the key itself if missing entirely
 *
 * @example
 * translate('es', 'live.totalLive', { count: 3 })
 * // → "3 Total en Vivo"
 */
function translate(
  locale: SupportedLocale,
  key: string,
  params?: Record<string, string | number>
): string {
  // Try current locale first, fall back to English
  let str = translations[locale]?.[key] ?? translations.en[key] ?? key;

  // Interpolate {param} placeholders
  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
    });
  }

  return str;
}

// ── React Context ───────────────────────────────────────────

interface LanguageContextType {
  /** Current locale code */
  locale: SupportedLocale;
  /** Switch to a different locale */
  setLocale: (locale: SupportedLocale) => void;
  /** Translation function: use this in components */
  t: (key: string, params?: Record<string, string | number>) => string;
  /** Text direction for current locale */
  dir: 'ltr' | 'rtl';
  /** All available languages */
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// ── Provider Component ──────────────────────────────────────

interface LanguageProviderProps {
  children: ReactNode;
  /** Optional initial locale (defaults to browser detection → 'en') */
  defaultLocale?: SupportedLocale;
}

/**
 * Wrap your app with LanguageProvider to enable translations.
 *
 * @example
 * <LanguageProvider>
 *   <App />
 * </LanguageProvider>
 */
export function LanguageProvider({ children, defaultLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale || 'en');

  // On mount, try to detect from localStorage or browser
  useEffect(() => {
    if (defaultLocale) return;

    // Check localStorage first (user's previous choice)
    const saved = localStorage.getItem('fieldvoices-locale') as SupportedLocale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
      return;
    }

    // Try browser language detection
    const browserLang = navigator.language?.split('-')[0] as SupportedLocale;
    if (browserLang && translations[browserLang]) {
      setLocaleState(browserLang);
    }
  }, [defaultLocale]);

  // Persist locale choice
  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('fieldvoices-locale', newLocale);

    // Update document direction for RTL languages
    const langMeta = LANGUAGES.find((l) => l.code === newLocale);
    if (langMeta) {
      document.documentElement.dir = langMeta.dir;
      document.documentElement.lang = newLocale;
    }
  }, []);

  // Memoized translation function bound to current locale
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale]
  );

  const dir = LANGUAGES.find((l) => l.code === locale)?.dir || 'ltr';

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Access translations in any component.
 *
 * @example
 * const { t, locale, setLocale } = useTranslation();
 * return <h1>{t('workspace.welcome')}</h1>;
 *
 * @example with interpolation
 * const { t } = useTranslation();
 * return <p>{t('live.totalLive', { count: 3 })}</p>;
 * // → "3 Total Live" (en) or "3 Total en Vivo" (es)
 */
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

// ── Standalone t() for non-component code ───────────────────

/**
 * For use outside React components (e.g., utility functions, mock data).
 * Defaults to English. For component code, always use useTranslation().
 */
export function tStatic(key: string, params?: Record<string, string | number>): string {
  return translate('en', key, params);
}

export type { SupportedLocale, LanguageOption, TranslationStrings };
