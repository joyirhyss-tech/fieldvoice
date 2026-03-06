/**
 * Supabase Query Layer
 *
 * Maps database rows (snake_case) → app types (camelCase).
 * Each function returns the same shape as mock-data.ts exports,
 * so components can swap imports with zero refactoring.
 *
 * Usage:
 *   import { fetchCampaigns } from '@/lib/supabase/queries';
 *   const campaigns = await fetchCampaigns(supabase);
 *
 * NOTE: These queries require an authenticated Supabase client
 * (user must be signed in) because RLS policies scope data to
 * the user's org_id. With an anon-only client, all queries
 * return empty arrays.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import type {
  Campaign,
  BeHeardRequest,
  DailyBrief,
  ThemeAggregate,
  KPISnapshot,
  Profile,
  FollowUpJob,
  SurveyQuestion,
  YouSaidWeDid,
  BeHeardStatusUpdate,
} from '../types';

type Client = SupabaseClient<Database>;

// Row type helpers
type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type ViewRow<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

// ── Profiles ────────────────────────────────────────────────

export async function fetchProfile(client: Client): Promise<Profile | null> {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;
  const row = data as unknown as Row<'profiles'>;

  return {
    id: row.id,
    name: row.name,
    role: row.role,
    department: row.department,
    email: row.email,
  };
}

// ── Campaigns ───────────────────────────────────────────────

export async function fetchCampaigns(client: Client): Promise<Campaign[]> {
  const { data } = await client
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (!data) return [];
  const rows = data as unknown as Row<'campaigns'>[];

  return rows.map((row) => ({
    id: row.id,
    intention: row.intention,
    objective: row.objective,
    audience: row.audience,
    windowStart: row.window_start,
    windowEnd: row.window_end,
    status: row.status,
    createdBy: row.created_by ?? '',
    createdAt: row.created_at,
    participantCount: row.participant_count,
    responseCount: row.response_count,
  }));
}

// ── Survey Questions ────────────────────────────────────────

export async function fetchSurveyQuestions(
  client: Client,
  campaignId: string
): Promise<SurveyQuestion[]> {
  const { data } = await client
    .from('survey_questions')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('sort_order', { ascending: true });

  if (!data) return [];
  const rows = data as unknown as Row<'survey_questions'>[];

  return rows.map((row) => ({
    id: row.id,
    text: row.text,
    type: row.type,
    source: row.source,
    included: row.included,
    contextTrigger: row.context_trigger ?? undefined,
    designNote: row.design_note ?? undefined,
  }));
}

// ── Be Heard Requests ───────────────────────────────────────

export async function fetchBeHeardRequests(client: Client): Promise<BeHeardRequest[]> {
  const { data } = await client
    .from('be_heard_anonymous')
    .select('*')
    .order('created_at', { ascending: false });

  if (!data) return [];
  const rows = data as unknown as ViewRow<'be_heard_anonymous'>[];

  return rows.map((row) => ({
    id: row.id,
    submittedBy: '', // Anonymized — never exposed to leadership
    content: row.content,
    score: row.score,
    routedTo: row.routed_to,
    status: row.status,
    createdAt: row.created_at,
  }));
}

// ── Be Heard Status Updates ─────────────────────────────────

export async function fetchBeHeardStatuses(
  client: Client,
  requestId: string
): Promise<BeHeardStatusUpdate[]> {
  const { data } = await client
    .from('be_heard_status_updates')
    .select('*')
    .eq('request_id', requestId)
    .order('updated_at', { ascending: true });

  if (!data) return [];
  const rows = data as unknown as Row<'be_heard_status_updates'>[];

  return rows.map((row) => ({
    id: row.id,
    requestId: row.request_id,
    status: row.status,
    note: row.note,
    updatedAt: row.updated_at,
    actionType: row.action_type ?? undefined,
  }));
}

// ── Daily Brief ─────────────────────────────────────────────

export async function fetchLatestBrief(
  client: Client,
  campaignId: string
): Promise<DailyBrief | null> {
  const { data, error } = await client
    .from('daily_briefs')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  const brief = data as unknown as Row<'daily_briefs'>;

  // Fetch associated actions
  const { data: actionsData } = await client
    .from('brief_actions')
    .select('*')
    .eq('brief_id', brief.id)
    .order('due_date', { ascending: true });

  const actions = (actionsData ?? []) as unknown as Row<'brief_actions'>[];

  return {
    id: brief.id,
    campaignId: brief.campaign_id,
    date: brief.date,
    themes: brief.themes,
    regulationAlert: brief.regulation_alert,
    actions: actions.map((a) => ({
      id: a.id,
      description: a.description,
      assignedTo: a.assigned_to,
      dueDate: a.due_date,
      completed: a.completed,
    })),
  };
}

// ── Themes ──────────────────────────────────────────────────

export async function fetchThemes(client: Client): Promise<ThemeAggregate[]> {
  const { data } = await client
    .from('theme_aggregates')
    .select('*')
    .order('frequency', { ascending: false });

  if (!data) return [];
  const rows = data as unknown as Row<'theme_aggregates'>[];

  return rows.map((row) => ({
    id: row.id,
    theme: row.theme,
    frequency: row.frequency,
    severity: row.severity,
    department: row.department,
    lastSeen: row.last_seen,
  }));
}

// ── Follow-Up Jobs ──────────────────────────────────────────

export async function fetchFollowUps(client: Client): Promise<FollowUpJob[]> {
  const { data } = await client
    .from('follow_up_jobs')
    .select('*')
    .order('trigger_date', { ascending: true });

  if (!data) return [];
  const rows = data as unknown as Row<'follow_up_jobs'>[];

  return rows.map((row) => ({
    id: row.id,
    campaignId: row.campaign_id,
    type: row.type,
    triggerDate: row.trigger_date,
    status: row.status,
    theme: row.theme,
  }));
}

// ── KPI Snapshots ───────────────────────────────────────────

export async function fetchKPIs(client: Client): Promise<KPISnapshot[]> {
  const { data } = await client
    .from('kpi_snapshots')
    .select('*')
    .order('snapshot_date', { ascending: false })
    .limit(10);

  if (!data) return [];
  const rows = data as unknown as Row<'kpi_snapshots'>[];

  return rows.map((row) => ({
    label: row.label,
    value: row.value,
    trend: row.trend,
  }));
}

// ── You Said / We Did ───────────────────────────────────────

export async function fetchYouSaidWeDid(client: Client): Promise<YouSaidWeDid[]> {
  const { data } = await client
    .from('you_said_we_did')
    .select('*')
    .order('resolved_date', { ascending: false });

  if (!data) return [];
  const rows = data as unknown as Row<'you_said_we_did'>[];

  return rows.map((row) => ({
    id: row.id,
    youSaid: row.you_said,
    weDid: row.we_did,
    department: row.department,
    resolvedDate: row.resolved_date,
    source: row.source,
  }));
}

// ── Shout-Outs ──────────────────────────────────────────────

export interface ShoutOut {
  id: string;
  fromRole: string;
  fromName: string;
  message: string;
}

export async function fetchShoutOuts(client: Client): Promise<ShoutOut[]> {
  const { data } = await client
    .from('shout_outs')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (!data) return [];
  const rows = data as unknown as Row<'shout_outs'>[];

  return rows.map((row) => ({
    id: row.id,
    fromRole: row.from_role,
    fromName: row.from_name,
    message: row.message,
  }));
}

// ── Context Triggers ────────────────────────────────────────

export interface ContextTrigger {
  id: string;
  event: string;
  label: string;
  description: string;
  active: boolean;
}

export async function fetchContextTriggers(client: Client): Promise<ContextTrigger[]> {
  const { data } = await client
    .from('context_triggers')
    .select('*')
    .eq('active', true)
    .order('label', { ascending: true });

  if (!data) return [];
  const rows = data as unknown as Row<'context_triggers'>[];

  return rows.map((row) => ({
    id: row.id,
    event: row.event,
    label: row.label,
    description: row.description ?? '',
    active: row.active,
  }));
}
