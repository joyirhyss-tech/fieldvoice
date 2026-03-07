'use client';

import { useLocalStorage } from './useLocalStorage';
import { StaffMember, StaffDocument, UserRole } from './types';

const STORAGE_KEY = 'fieldvoices-staff';

export function useStaffStore() {
  const [staff, setStaff] = useLocalStorage<StaffMember[]>(STORAGE_KEY, []);

  const addStaff = (member: {
    name: string;
    role: UserRole;
    accessCode: string;
    photoUrl?: string;
    documents?: StaffDocument[];
  }): StaffMember => {
    const newMember: StaffMember = {
      id: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: member.name,
      role: member.role,
      accessCode: member.accessCode,
      photoUrl: member.photoUrl,
      documents: member.documents || [],
      createdAt: new Date().toISOString(),
    };
    setStaff((prev) => [...prev, newMember]);
    return newMember;
  };

  const updateStaff = (id: string, updates: Partial<Omit<StaffMember, 'id' | 'createdAt'>>) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const removeStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const getStaffByRole = (role: UserRole): StaffMember[] =>
    staff.filter((s) => s.role === role);

  const getStaffById = (id: string): StaffMember | undefined =>
    staff.find((s) => s.id === id);

  return {
    staff,
    addStaff,
    updateStaff,
    removeStaff,
    getStaffByRole,
    getStaffById,
  };
}
