'use client';

import { useState, useEffect, useCallback } from 'react';

// Custom event name for cross-instance sync on the same page
const SYNC_EVENT = 'fieldvoices-storage-sync';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize from localStorage (only on client)
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

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
      window.dispatchEvent(
        new CustomEvent(SYNC_EVENT, { detail: { key } })
      );
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
