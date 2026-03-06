'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

/**
 * Compact language selector for the Action Rail.
 *
 * Displays current language code and opens a dropdown with all
 * available languages. Shows native name + completeness indicator.
 *
 * Equity note: Language access is not a feature — it's a right.
 * Workers should never have to navigate a tool in a language
 * they don't fully understand.
 */
export default function LanguageSelector() {
  const { locale, setLocale, t, languages } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-navy-800 transition-colors"
        aria-label={`${t('language.label')}: ${currentLang?.nativeName}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="uppercase font-medium">{locale}</span>
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 mb-1 w-52 bg-navy-800 border border-border-medium rounded-lg shadow-xl overflow-hidden z-30"
          role="listbox"
          aria-label={t('language.label')}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={locale === lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between ${
                locale === lang.code
                  ? 'bg-navy-700 text-gold-400'
                  : 'text-text-secondary hover:bg-navy-700 hover:text-text-primary'
              }`}
            >
              <div>
                <span className="font-medium">{lang.nativeName}</span>
                {lang.nativeName !== lang.englishName && (
                  <span className="text-text-muted text-xs ml-1.5">({lang.englishName})</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {lang.dir === 'rtl' && (
                  <span className="text-[9px] text-text-muted uppercase tracking-wider">RTL</span>
                )}
                {lang.completeness === 'full' && (
                  <span className="w-2 h-2 rounded-full bg-accent-sage flex-shrink-0" title="Fully translated" />
                )}
                {lang.completeness === 'partial' && (
                  <span className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0" title="Partially translated" />
                )}
                {lang.completeness === 'skeleton' && (
                  <span className="w-2 h-2 rounded-full bg-navy-500 flex-shrink-0" title="Coming soon" />
                )}
              </div>
            </button>
          ))}

          {/* Translation contribution note */}
          <div className="px-3 py-2 border-t border-border-subtle bg-navy-800/80">
            <p className="text-[9px] text-text-muted leading-relaxed">
              <span className="text-gold-400">●</span> Partial &nbsp;
              <span className="text-accent-sage">●</span> Full &nbsp;
              <span className="text-navy-500">●</span> Coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
