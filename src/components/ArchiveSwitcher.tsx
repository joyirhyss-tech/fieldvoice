'use client';

import { ArchiveView } from '@/lib/types';

interface ArchiveSwitcherProps {
  active: ArchiveView;
  onSwitch: (view: ArchiveView) => void;
}

const tabs: { view: ArchiveView; label: string }[] = [
  { view: 'voices', label: 'Past Field Voices' },
  { view: 'concerns', label: 'Past Concerns' },
  { view: 'solutions', label: 'Past Solutions' },
];

export default function ArchiveSwitcher({ active, onSwitch }: ArchiveSwitcherProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-navy-800 rounded-lg">
      {tabs.map(({ view, label }) => (
        <button
          key={view}
          onClick={() => onSwitch(view)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            active === view
              ? 'bg-navy-600 text-gold-400 shadow-[0_0_8px_var(--gold-glow)]'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
