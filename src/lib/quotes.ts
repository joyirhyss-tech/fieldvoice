/**
 * Thin re-export wrapper — all quotes now live in quote-bank.ts.
 * This file preserves the original import path (`@/lib/quotes`) so
 * existing consumers (page.tsx, etc.) continue working unchanged.
 */

export { type QuoteEntry, getRandomQuote as getRotatingQuote } from './quote-bank';
