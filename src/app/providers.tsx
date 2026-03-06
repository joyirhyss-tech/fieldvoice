'use client';

import { LanguageProvider } from '@/lib/i18n';

/**
 * Client-side providers wrapper.
 * Add future providers (auth, theme, etc.) here.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
