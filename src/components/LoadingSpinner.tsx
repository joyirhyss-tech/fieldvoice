'use client';

interface LoadingSpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional label below spinner */
  label?: string;
  /** Full-height centering (for workspace panels) */
  fullHeight?: boolean;
}

export default function LoadingSpinner({ size = 'md', label, fullHeight = false }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const strokeMap = {
    sm: 2.5,
    md: 2,
    lg: 1.5,
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${fullHeight ? 'py-20' : 'py-8'}`}
      role="status"
      aria-label={label || 'Loading'}
    >
      <svg
        className={`${sizeMap[size]} animate-spin text-gold-500`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={strokeMap[size]}
          strokeLinecap="round"
          className="opacity-20"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth={strokeMap[size]}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <p className="mt-3 text-xs text-text-muted animate-pulse">{label}</p>
      )}
    </div>
  );
}
