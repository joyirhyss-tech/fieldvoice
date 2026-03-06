'use client';

import { ArchiveView, Campaign, BeHeardRequest, ThemeAggregate } from '@/lib/types';
import { mockCampaigns, mockBeHeardRequests, mockThemes } from '@/lib/mock-data';

interface ArchiveCardGridProps {
  view: ArchiveView;
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

export default function ArchiveCardGrid({ view }: ArchiveCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {view === 'voices' &&
        mockCampaigns.map((c) => <VoiceCard key={c.id} campaign={c} />)}
      {view === 'concerns' &&
        mockBeHeardRequests.map((r) => <ConcernCard key={r.id} request={r} />)}
      {view === 'solutions' &&
        mockThemes.map((t) => <SolutionCard key={t.id} theme={t} />)}
    </div>
  );
}
