/**
 * i18n type definitions for FieldVoices
 *
 * Adding a new language:
 * 1. Add the locale code to SupportedLocale
 * 2. Create a new file (e.g., fr.ts) that exports TranslationStrings
 * 3. Import and register it in index.ts
 */

/** Supported locale codes — add new languages here */
export type SupportedLocale = 'en' | 'es' | 'fr' | 'ht' | 'zh' | 'ar';

/** All translation keys — derived from the English file */
export type TranslationKey = string;

/** Translation dictionary — partial because non-English may have gaps (falls back to English) */
export type TranslationStrings = Record<string, string>;

/** Language metadata for the selector UI */
export interface LanguageOption {
  code: SupportedLocale;
  /** Native name (displayed in that language) */
  nativeName: string;
  /** English name (for accessibility) */
  englishName: string;
  /** Text direction */
  dir: 'ltr' | 'rtl';
  /** Whether this language has full translations or is a skeleton */
  completeness: 'full' | 'partial' | 'skeleton';
}
