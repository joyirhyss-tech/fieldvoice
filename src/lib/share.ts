/**
 * Survey distribution utilities
 *
 * Generates shareable codes and URLs for pushed surveys.
 * In the current localStorage-based demo, these URLs are illustrative.
 * When connected to a backend (Supabase), they will resolve to
 * actual survey response pages.
 */

/** Characters used for share codes — no ambiguous chars (0/O, 1/I/l) */
const SHARE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Generate a 6-character alphanumeric share code.
 * Uses crypto.getRandomValues for better randomness than Math.random.
 */
export function generateShareCode(): string {
  const array = new Uint8Array(6);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < 6; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array)
    .map((byte) => SHARE_CHARS[byte % SHARE_CHARS.length])
    .join('');
}

/**
 * Build a shareable survey URL from a share code.
 * In production, this would point to the actual survey response page.
 */
export function buildShareUrl(code: string): string {
  // Use window.location.origin in browser, fallback for SSR
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fieldvoices.app';
  return `${origin}/s/${code}`;
}
