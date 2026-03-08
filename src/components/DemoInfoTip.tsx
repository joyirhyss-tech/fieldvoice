'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DEMO_INFO_CONTENT } from '@/lib/demo-info-content';

interface DemoInfoTipProps {
  tipKey: string;
  position?: 'below' | 'left';
  className?: string;
}

export default function DemoInfoTip({ tipKey, position = 'below', className = '' }: DemoInfoTipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 256; // w-64

    if (position === 'left') {
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.left - popoverWidth - 8,
      });
    } else {
      // below — anchor right edge to trigger's right edge to avoid viewport overflow
      const left = Math.min(
        rect.left + rect.width / 2 - popoverWidth / 2,
        window.innerWidth - popoverWidth - 8
      );
      setCoords({
        top: rect.bottom + 8,
        left: Math.max(8, left),
      });
    }
  }, [position]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        popoverRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
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

  // Recalculate on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  const content = DEMO_INFO_CONTENT[tipKey];
  if (!content) return null;

  const transformStyle = position === 'left'
    ? 'translateY(-50%)'
    : undefined;

  return (
    <span className={`relative inline-flex items-center ${className}`} ref={triggerRef}>
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
      {open && coords && createPortal(
        <div
          ref={popoverRef}
          style={{ position: 'fixed', top: coords.top, left: coords.left, transform: transformStyle, zIndex: 9999 }}
          className="bg-navy-800/95 backdrop-blur-sm border border-border-gold rounded-lg shadow-xl p-3 w-64"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs font-semibold text-gold-400 mb-1">{content.title}</p>
          <p className="text-[11px] text-text-secondary leading-relaxed">{content.body}</p>
        </div>,
        document.body
      )}
    </span>
  );
}
