/**
 * Supabase browser client — for use in Client Components ('use client')
 *
 * This creates a singleton client instance for the browser.
 * It uses the anon key, which is safe to expose in the browser
 * because RLS policies protect the data.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
