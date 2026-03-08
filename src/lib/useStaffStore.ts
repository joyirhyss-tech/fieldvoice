'use client';

import { useLocalStorage } from './useLocalStorage';
import { StaffMember, StaffDocument, UserRole, SurveyCadence } from './types';

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

  /** Find a staff member by first + last name (case-insensitive) */
  const findByName = (firstName: string, lastName: string): StaffMember | undefined => {
    const fn = firstName.trim().toLowerCase();
    const ln = lastName.trim().toLowerCase();
    return staff.find((m) => {
      const parts = m.name.toLowerCase().split(/\s+/);
      return parts[0] === fn && parts[parts.length - 1] === ln;
    });
  };

  /** Set a staff member's 4-digit PIN */
  const setPin = (staffId: string, pin: string) => {
    updateStaff(staffId, { pin });
  };

  /** Set a staff member's survey cadence preference */
  const setCadence = (staffId: string, cadence: SurveyCadence) => {
    updateStaff(staffId, { surveyCadence: cadence });
  };

  return {
    staff,
    addStaff,
    updateStaff,
    removeStaff,
    getStaffByRole,
    getStaffById,
    findByName,
    setPin,
    setCadence,
  };
}
