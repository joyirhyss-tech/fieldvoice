'use client';

interface SkeletonCardProps {
  /** Number of text lines to simulate */
  lines?: number;
  /** Show a header bar */
  header?: boolean;
  /** Show stat boxes */
  stats?: number;
}

function SkeletonLine({ width = '100%' }: { width?: string }) {
  return (
    <div
      className="h-2.5 rounded bg-navy-700/60 animate-pulse"
      style={{ width }}
    />
  );
}

export default function SkeletonCard({ lines = 3, header = true, stats = 0 }: SkeletonCardProps) {
  return (
    <div className="card-surface p-4 space-y-3" aria-hidden="true">
      {header && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-navy-700/60 animate-pulse" />
          <div className="h-2.5 w-24 rounded bg-navy-700/60 animate-pulse" />
        </div>
      )}

      {stats > 0 && (
        <div className={`grid grid-cols-${stats} gap-2`}>
          {Array.from({ length: stats }).map((_, i) => (
            <div key={i} className="text-center p-3 rounded-lg bg-navy-800/40 border border-border-subtle">
              <div className="h-5 w-8 mx-auto rounded bg-navy-700/60 animate-pulse mb-1" />
              <div className="h-2 w-12 mx-auto rounded bg-navy-700/40 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine key={i} width={i === lines - 1 ? '65%' : '100%'} />
        ))}
      </div>
    </div>
  );
}
