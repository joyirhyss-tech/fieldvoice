'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';

interface ViewTransitionProps {
  children: ReactNode;
  /** Key used to detect view changes and trigger animation */
  viewKey: string;
}

/**
 * Lightweight fade-in transition wrapper for workspace view changes.
 * Triggers a CSS fade-in animation each time the viewKey changes.
 */
export default function ViewTransition({ children, viewKey }: ViewTransitionProps) {
  const [animate, setAnimate] = useState(false);
  const prevKey = useRef(viewKey);

  useEffect(() => {
    if (prevKey.current !== viewKey) {
      prevKey.current = viewKey;
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [viewKey]);

  return (
    <div
      className={animate ? 'animate-fade-in' : ''}
      style={{ willChange: animate ? 'opacity, transform' : 'auto' }}
    >
      {children}
    </div>
  );
}
