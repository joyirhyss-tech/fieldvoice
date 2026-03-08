'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useStaffStore } from '@/lib/useStaffStore';
import { LoggedInUser, StaffMember } from '@/lib/types';
import { getRoleConfig } from '@/lib/roles';

interface StartConnectCardProps {
  onConnect: (user: LoggedInUser) => void;
  demoMode?: boolean;
  liveAdmin?: boolean;
}

type Step = 'landing' | 'name-entry' | 'pin-setup' | 'pin-entry';

export default function StartConnectCard({ onConnect, demoMode, liveAdmin }: StartConnectCardProps) {
  const prefill = demoMode || liveAdmin;
  const [step, setStep] = useState<Step>(prefill ? 'name-entry' : 'landing');
  const { staff, setPin, findByName } = useStaffStore();

  // Name entry state — pre-filled in demo/liveAdmin mode
  const [firstName, setFirstName] = useState(demoMode ? 'Lauralani' : liveAdmin ? 'Admin' : '');
  const [lastName, setLastName] = useState(demoMode ? 'Reece' : liveAdmin ? 'User' : '');
  const [nameError, setNameError] = useState('');
  const [matchedMember, setMatchedMember] = useState<StaffMember | null>(null);

  // PIN state
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [confirmDigits, setConfirmDigits] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState('');

  // Refs for PIN auto-advance
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const confirmRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Handle name submission
  const handleNameSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setNameError('Please enter both first and last name.');
      return;
    }
    // Live admin bypass — no staff lookup needed, go straight to workspace
    if (liveAdmin) {
      onConnect({
        staffId: 'admin',
        name: `${firstName.trim()} ${lastName.trim()}`,
        role: 'ed',
        sessionCreatedAt: new Date().toISOString(),
      });
      return;
    }
    const member = findByName(firstName, lastName);
    if (!member) {
      setNameError('Name not found. Check spelling or contact your administrator.');
      return;
    }
    setMatchedMember(member);
    setNameError('');
    setPinDigits(['', '', '', '']);
    setConfirmDigits(['', '', '', '']);
    setPinError('');

    if (member.pin) {
      if (demoMode) setPinDigits(['1', '2', '3', '4']);
      setStep('pin-entry');
    } else {
      setStep('pin-setup');
    }
  };

  // Handle PIN digit input with auto-advance
  const handlePinDigit = (index: number, value: string, digits: string[], setDigits: (d: string[]) => void, refs: React.RefObject<HTMLInputElement | null>[]) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setPinError('');

    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  // Handle backspace in PIN fields
  const handlePinKeyDown = (index: number, e: React.KeyboardEvent, digits: string[], setDigits: (d: string[]) => void, refs: React.RefObject<HTMLInputElement | null>[]) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
    }
  };

  // Auto-focus first PIN input when entering PIN screens
  useEffect(() => {
    if (step === 'pin-setup' || step === 'pin-entry') {
      setTimeout(() => pinRefs[0].current?.focus(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Handle PIN setup completion — save PIN, then redirect to pin-entry to confirm
  const handlePinSetup = () => {
    if (!matchedMember) return;
    const pin = pinDigits.join('');
    const confirm = confirmDigits.join('');

    if (pin.length < 4) {
      setPinError('Please enter all 4 digits.');
      return;
    }
    if (pin !== confirm) {
      setPinError('PINs do not match. Please try again.');
      setConfirmDigits(['', '', '', '']);
      confirmRefs[0].current?.focus();
      return;
    }

    // Save PIN to staff record
    setPin(matchedMember.id, pin);

    // Update local matchedMember so pin-entry screen can verify
    setMatchedMember({ ...matchedMember, pin });

    // Reset PIN digits and go to pin-entry for first sign-in
    setPinDigits(['', '', '', '']);
    setPinError('');
    setStep('pin-entry');
  };

  // Handle PIN entry (returning user)
  const handlePinEntry = () => {
    if (!matchedMember) return;
    const pin = pinDigits.join('');

    if (pin.length < 4) {
      setPinError('Please enter all 4 digits.');
      return;
    }
    if (pin !== matchedMember.pin) {
      setPinError('Incorrect PIN. Please try again.');
      setPinDigits(['', '', '', '']);
      pinRefs[0].current?.focus();
      return;
    }

    onConnect({
      staffId: matchedMember.id,
      name: matchedMember.name,
      role: matchedMember.role,
      sessionCreatedAt: new Date().toISOString(),
    });
  };

  // Shared PIN input row renderer
  const renderPinInputs = (digits: string[], setDigits: (d: string[]) => void, refs: React.RefObject<HTMLInputElement | null>[], label: string) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
        {label}
      </label>
      <div className="flex gap-2 justify-center">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handlePinDigit(i, e.target.value, digits, setDigits, refs)}
            onKeyDown={(e) => handlePinKeyDown(i, e, digits, setDigits, refs)}
            className="input-navy w-12 h-14 text-center text-xl font-mono font-bold tracking-wider"
            aria-label={`${label} digit ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );

  // ── Step 1: Landing ───────────────────────────────────────
  if (step === 'landing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="mb-10 flex justify-center">
            <div className="logo-glow inline-block">
              <Image
                src="/fieldvoices-logo.png"
                alt="FieldVoices"
                width={465}
                height={187}
                className="mx-auto"
                priority
                unoptimized
              />
            </div>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-10 max-w-xs mx-auto">
            Turns feedback into themes, themes into shared action, and shared action into trust.
          </p>
          <button
            onClick={() => setStep('name-entry')}
            className="btn-gold w-full max-w-xs mx-auto py-3.5 px-8 rounded-lg text-sm block"
          >
            Sign In
          </button>
          <p className="mt-6 text-center text-xs text-text-muted">
            Mission2Impact Library
          </p>
        </div>
      </div>
    );
  }

  // ── Step 2: Name Entry ────────────────────────────────────
  if (step === 'name-entry') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep p-4">
        <div className="card-surface max-w-md w-full overflow-hidden">
          <div className="px-6 py-5 border-b border-border-subtle text-center">
            <h1 className="text-lg font-bold text-text-primary mb-1">Welcome to FieldVoices</h1>
            <p className="text-xs text-text-muted">Enter your name to sign in</p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="first-name" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setNameError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('last-name')?.focus(); }}
                placeholder="Your first name"
                className="input-navy w-full px-4 py-3 text-sm"
                autoFocus
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor="last-name" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setNameError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleNameSubmit(); }}
                placeholder="Your last name"
                className="input-navy w-full px-4 py-3 text-sm"
                autoComplete="family-name"
              />
            </div>

            {nameError && (
              <div className="rounded-lg bg-alert-rose/10 border border-alert-rose/20 p-3">
                <p className="text-xs text-alert-rose">{nameError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setStep('landing'); setFirstName(''); setLastName(''); setNameError(''); }}
                className="px-4 py-2.5 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                &larr; Back
              </button>
              <button
                onClick={handleNameSubmit}
                disabled={!firstName.trim() || !lastName.trim()}
                className="btn-gold flex-1 py-2.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>

          {staff.length === 0 && (
            <div className="px-6 pb-4">
              <p className="text-xs text-text-muted text-center">
                No team members configured yet. Add staff in Settings first.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Step 3: PIN Setup (first-time user) ───────────────────
  if (step === 'pin-setup' && matchedMember) {
    const pinComplete = pinDigits.every((d) => d !== '');
    const confirmComplete = confirmDigits.every((d) => d !== '');
    const role = getRoleConfig(matchedMember.role);

    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep p-4">
        <div className="card-surface max-w-md w-full overflow-hidden">
          <div className="px-6 py-5 border-b border-border-subtle text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-navy-800 border-2 border-border-gold flex items-center justify-center">
              <span className="text-base font-bold text-gold-500">
                {matchedMember.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <h1 className="text-lg font-bold text-text-primary">
              Welcome, {matchedMember.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-gold-400">{role.label}</p>
            <p className="text-xs text-text-muted mt-1">Set up your PIN for quick sign-in</p>
          </div>

          <div className="p-6 space-y-5">
            {renderPinInputs(pinDigits, setPinDigits, pinRefs, 'Create your 4-digit PIN')}
            {renderPinInputs(confirmDigits, setConfirmDigits, confirmRefs, 'Confirm PIN')}

            {pinError && (
              <p className="text-xs text-alert-rose text-center">{pinError}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setStep('name-entry'); setMatchedMember(null); }}
                className="px-4 py-2.5 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                &larr; Back
              </button>
              <button
                onClick={handlePinSetup}
                disabled={!pinComplete || !confirmComplete}
                className="btn-gold flex-1 py-2.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Set PIN
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 4: PIN Entry (returning user) ────────────────────
  if (step === 'pin-entry' && matchedMember) {
    const pinComplete = pinDigits.every((d) => d !== '');
    const role = getRoleConfig(matchedMember.role);

    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep p-4">
        <div className="card-surface max-w-md w-full overflow-hidden">
          <div className="px-6 py-5 border-b border-border-subtle text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-navy-800 border-2 border-border-gold flex items-center justify-center">
              <span className="text-base font-bold text-gold-500">
                {matchedMember.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <h1 className="text-lg font-bold text-text-primary">
              Welcome back, {matchedMember.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-gold-400">{role.label}</p>
          </div>

          <div className="p-6 space-y-4">
            {renderPinInputs(pinDigits, setPinDigits, pinRefs, 'Enter your PIN')}

            {pinError && (
              <p className="text-xs text-alert-rose text-center">{pinError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setStep('name-entry'); setMatchedMember(null); setPinDigits(['', '', '', '']); setPinError(''); }}
                className="px-4 py-2.5 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                &larr; Back
              </button>
              <button
                onClick={handlePinEntry}
                disabled={!pinComplete}
                className="btn-gold flex-1 py-2.5 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Sign In
              </button>
            </div>

            <p className="text-xs text-text-muted text-center">
              Forgot your PIN? Contact your administrator to reset it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback — should not reach here
  return null;
}
