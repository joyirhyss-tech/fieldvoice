'use client';

interface ShoutOut {
  id: string;
  from: string;
  name: string;
  message: string;
}

interface MetricTickerProps {
  shoutOuts: ShoutOut[];
}

export default function MetricTicker({ shoutOuts }: MetricTickerProps) {
  // Hide ticker when no shout-outs
  if (shoutOuts.length === 0) return null;

  // Double for seamless loop
  const doubled = [...shoutOuts, ...shoutOuts];

  return (
    <div
      className="w-full bg-navy-900 border-t border-border-subtle overflow-hidden h-10 flex items-center"
      role="marquee"
      aria-label="Leadership shout-outs and positive updates"
      aria-live="off"
    >
      <div className="ticker-scroll-slow flex items-center gap-12 whitespace-nowrap px-4">
        {doubled.map((s, i) => (
          <span key={`${s.id}-${i}`} className="text-xs inline-flex items-center gap-2">
            <span className="text-gold-400" aria-hidden="true">✦</span>
            <span className="text-gold-400 font-semibold">{s.from}</span>
            <span className="text-text-muted" aria-hidden="true">·</span>
            <span className="text-text-secondary">{s.name}:</span>
            <span className="text-text-primary">{s.message}</span>
          </span>
        ))}
      </div>
      {/* Screen reader accessible version */}
      <div className="sr-only">
        Leadership shout-outs: {shoutOuts.map(s => `${s.from} ${s.name} says: ${s.message}`).join('. ')}
      </div>
    </div>
  );
}
