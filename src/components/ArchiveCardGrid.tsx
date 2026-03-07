'use client';

import { ArchiveView, Campaign, BeHeardRequest, ThemeAggregate } from '@/lib/types';

interface ArchiveCardGridProps {
  view: ArchiveView;
  campaigns?: Campaign[];
  concerns?: BeHeardRequest[];
  themes?: ThemeAggregate[];
}

function VoiceCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          campaign.status === 'active'
            ? 'bg-accent-sage-light text-accent-sage'
            : campaign.status === 'completed'
            ? 'bg-navy-700 text-text-muted'
            : 'bg-navy-700 border border-gold-500/30 text-gold-400'
        }`}>
          {campaign.status}
        </span>
        <span className="text-xs text-text-muted">{campaign.createdAt}</span>
      </div>
      <h4 className="text-sm font-medium text-text-primary mb-1">{campaign.intention}</h4>
      <p className="text-xs text-text-secondary mb-3">{campaign.objective}</p>
      <div className="flex gap-4 text-xs text-text-muted">
        <span>{campaign.participantCount} participants</span>
        <span>{campaign.responseCount} responses</span>
      </div>
    </div>
  );
}

function ConcernCard({ request }: { request: BeHeardRequest }) {
  const scoreColor =
    request.score >= 90
      ? 'text-alert-rose'
      : request.score >= 70
      ? 'text-gold-400'
      : 'text-text-secondary';

  return (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold ${scoreColor}`}>
          Score: {request.score}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          request.status === 'actioned'
            ? 'bg-accent-sage-light text-accent-sage'
            : request.status === 'reviewed'
            ? 'bg-navy-700 border border-gold-500/30 text-gold-400'
            : 'bg-navy-700 text-text-muted'
        }`}>
          {request.status}
        </span>
      </div>
      <p className="text-sm text-text-primary mb-2">{request.content}</p>
      <div className="flex gap-4 text-xs text-text-muted">
        <span>Routed to {request.routedTo.toUpperCase()}</span>
        <span>{request.createdAt}</span>
      </div>
    </div>
  );
}

function SolutionCard({ theme }: { theme: ThemeAggregate }) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          theme.severity === 'critical'
            ? 'bg-alert-rose-light text-alert-rose'
            : theme.severity === 'high'
            ? 'bg-navy-700 border border-gold-500/30 text-gold-400'
            : 'bg-navy-700 text-text-muted'
        }`}>
          {theme.severity}
        </span>
        <span className="text-xs text-text-muted">{theme.department}</span>
      </div>
      <h4 className="text-sm font-medium text-text-primary mb-1">{theme.theme}</h4>
      <div className="flex gap-4 text-xs text-text-muted">
        <span>Frequency: {theme.frequency}</span>
        <span>Last seen: {theme.lastSeen}</span>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-12 text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-navy-800 border border-border-subtle flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <p className="text-sm text-text-muted">No {label} yet</p>
      <p className="text-xs text-text-muted mt-1">
        Data will appear here once you create your first FieldVoices survey.
      </p>
    </div>
  );
}

export default function ArchiveCardGrid({ view, campaigns = [], concerns = [], themes = [] }: ArchiveCardGridProps) {
  if (view === 'voices' && campaigns.length === 0) return <EmptyState label="archived surveys" />;
  if (view === 'concerns' && concerns.length === 0) return <EmptyState label="concerns" />;
  if (view === 'solutions' && themes.length === 0) return <EmptyState label="solutions" />;

  return (
    <div className="grid grid-cols-1 gap-3">
      {view === 'voices' &&
        campaigns.map((c) => <VoiceCard key={c.id} campaign={c} />)}
      {view === 'concerns' &&
        concerns.map((r) => <ConcernCard key={r.id} request={r} />)}
      {view === 'solutions' &&
        themes.map((t) => <SolutionCard key={t.id} theme={t} />)}
    </div>
  );
}
