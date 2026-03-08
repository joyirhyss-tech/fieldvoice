'use client';

interface PeopleClusterIconProps {
  size?: number;
  className?: string;
}

export default function PeopleClusterIcon({ size = 24, className = '' }: PeopleClusterIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Center person — slightly larger, foreground */}
      <circle cx="12" cy="8" r="3" />
      {/* Left person — overlapping, behind */}
      <circle cx="6.5" cy="10" r="2.5" />
      {/* Right person — overlapping, behind */}
      <circle cx="17.5" cy="10" r="2.5" />
      {/* Community arc — connecting togetherness */}
      <path d="M3 20c0-3.5 2.5-6 6-6h6c3.5 0 6 2.5 6 6" />
    </svg>
  );
}
