'use client';

import { useLocalStorage } from './useLocalStorage';
import { Nudge } from './types';

const STORAGE_KEY = 'fieldvoices-nudges';

export function useNudgeStore() {
  const [nudges, setNudges] = useLocalStorage<Nudge[]>(STORAGE_KEY, []);

  const addNudge = (nudge: Omit<Nudge, 'id'>) => {
    const newNudge: Nudge = {
      id: `nudge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...nudge,
    };
    setNudges((prev) => [...prev, newNudge]);
    return newNudge;
  };

  const completeNudge = (id: string) => {
    setNudges((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, completedAt: new Date().toISOString() } : n
      )
    );
  };

  const dismissNudge = (id: string) => {
    setNudges((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, dismissed: true } : n
      )
    );
  };

  const getPendingNudges = (): Nudge[] =>
    nudges.filter((n) => !n.completedAt && !n.dismissed);

  const getNudgesForSurvey = (surveyId: string): Nudge[] =>
    nudges.filter((n) => n.surveyId === surveyId);

  return {
    nudges,
    addNudge,
    completeNudge,
    dismissNudge,
    getPendingNudges,
    getNudgesForSurvey,
  };
}
