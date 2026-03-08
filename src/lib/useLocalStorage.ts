'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Custom event name for cross-instance sync on the same page
const SYNC_EVENT = 'fieldvoices-storage-sync';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Always initialize with initialValue to match server render (avoids hydration mismatch)
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const hydrated = useRef(false);

  // After hydration, read the real value from localStorage
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item) as T;
        setStoredValue(parsed);
      }
    } catch {
      // localStorage unavailable or parse error — keep initialValue
    }
  }, [key, initialValue]);

  // Wrapped setter that also dispatches a sync event
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const newValue = value instanceof Function ? value(prev) : value;
      // Write to localStorage immediately
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch {
        // localStorage full or unavailable
      }
      // Dispatch custom event so other hook instances on the same page sync
      // Use queueMicrotask to avoid setState-during-render when multiple components share a key
      queueMicrotask(() => {
        window.dispatchEvent(
          new CustomEvent(SYNC_EVENT, { detail: { key } })
        );
      });
      return newValue;
    });
  }, [key]);

  // Listen for sync events from other hook instances on the same page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.key === key) {
        try {
          const item = window.localStorage.getItem(key);
          if (item !== null) {
            setStoredValue(JSON.parse(item) as T);
          }
        } catch {
          // ignore parse errors
        }
      }
    };

    // Also listen for storage events from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // ignore parse errors
        }
      }
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, [key]);

  return [storedValue, setValue];
}
