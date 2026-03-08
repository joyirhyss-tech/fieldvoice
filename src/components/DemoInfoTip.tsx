'use client';

import { useState, useRef, useEffect } from 'react';
import { DEMO_INFO_CONTENT } from '@/lib/demo-info-content';

interface DemoInfoTipProps {
  tipKey: string;
  position?: 'below' | 'left';
  className?: string;
}

export default function DemoInfoTip({ tipKey, position = 'below', className = '' }: DemoInfoTipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const content = DEMO_INFO_CONTENT[tipKey];
  if (!content) return null;

  const positionClasses = position === 'left'
    ? 'right-full top-1/2 -translate-y-1/2 mr-2'
    : 'top-full left-1/2 -translate-x-1/2 mt-2';

  return (
    <span className={`relative inline-flex items-center ${className}`} ref={ref}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setOpen(!open);
          }
        }}
        className="text-gold-400/60 hover:text-gold-400 transition-colors cursor-pointer p-0.5"
        aria-label={`Info: ${content.title}`}
        role="button"
        tabIndex={0}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </span>
      {open && (
        <div
          className={`absolute ${positionClasses} bg-navy-800/95 backdrop-blur-sm border border-border-gold rounded-lg shadow-xl p-3 w-64 z-50`}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs font-semibold text-gold-400 mb-1">{content.title}</p>
          <p className="text-[11px] text-text-secondary leading-relaxed">{content.body}</p>
        </div>
      )}
    </span>
  );
}
