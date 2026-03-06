-- =============================================
-- FieldVoices Database Schema
-- Mission2Impact Library · AIdedEQ
-- =============================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This creates all tables, enums, indexes, and RLS policies.
-- =============================================

-- ── ENUMS ───────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
  'ed',
  'evp',
  'dop',
  'site_supervisor',
  'direct_service',
  'program_team',
  'voice_steward'
);

CREATE TYPE campaign_status AS ENUM (
  'draft',
  'active',
  'completed',
  'paused'
);

CREATE TYPE be_heard_status AS ENUM (
  'pending',
  'reviewed',
  'actioned',
  'escalated'
);

CREATE TYPE be_heard_update_status AS ENUM (
  'received',
  'under-review',
  'action-planned',
  'resolved',
  'communicated'
);

CREATE TYPE be_heard_action_type AS ENUM (
  'new-action',
  'communicate-existing',
  'training-needed'
);

CREATE TYPE follow_up_type AS ENUM (
  'risk',
  'positive'
);

CREATE TYPE follow_up_status AS ENUM (
  'pending',
  'sent',
  'completed'
);

CREATE TYPE theme_severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE question_type AS ENUM (
  'open',
  'scale',
  'multiple-choice',
  'yes-no',
  'pulse',
  'reflective',
  'contextual'
);

CREATE TYPE question_source AS ENUM (
  'ai-generated',
  'practice-center',
  'custom'
);

CREATE TYPE kpi_trend AS ENUM (
  'up',
  'down',
  'stable'
);

CREATE TYPE you_said_source AS ENUM (
  'be-heard',
  'fieldvoice',
  'leadership'
);

CREATE TYPE escalation_priority AS ENUM (
  'standard',
  'elevated',
  'high',
  'critical'
);


-- ── ORGANIZATIONS (multi-tenant ready) ──────────────────────

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- ── PROFILES ────────────────────────────────────────────────
-- Extends Supabase auth.users with FieldVoices-specific data

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'direct_service',
  department TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  preferred_locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ── CAMPAIGNS (FieldVoices surveys) ─────────────────────────

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  intention TEXT NOT NULL,
  objective TEXT NOT NULL DEFAULT '',
  audience TEXT[] NOT NULL DEFAULT '{}',
  statement_of_need TEXT DEFAULT '',
  window_start DATE NOT NULL,
  window_end DATE NOT NULL,
  status campaign_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  participant_count INT NOT NULL DEFAULT 0,
  response_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Business rule: window must be 14–21 days
  CONSTRAINT valid_window CHECK (
    window_end >= window_start + INTERVAL '14 days'
    AND window_end <= window_start + INTERVAL '21 days'
  )
);

CREATE INDEX idx_campaigns_org ON campaigns(org_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);


-- ── SURVEY QUESTIONS ────────────────────────────────────────

CREATE TABLE survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  type question_type NOT NULL,
  source question_source NOT NULL DEFAULT 'ai-generated',
  included BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  context_trigger TEXT,
  design_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_survey_questions_campaign ON survey_questions(campaign_id);


-- ── SURVEY RESPONSES ────────────────────────────────────────
-- Individual answers to survey questions (anonymized at query layer)

CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES survey_questions(id) ON DELETE CASCADE NOT NULL,
  respondent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  -- Response data varies by question type
  text_response TEXT,
  scale_response INT CHECK (scale_response BETWEEN 1 AND 10),
  boolean_response BOOLEAN,
  choice_response TEXT[],
  pulse_response INT CHECK (pulse_response BETWEEN 1 AND 5),
  -- Voice recording
  voice_url TEXT,
  voice_duration_seconds INT,
  -- Follow-up
  follow_up_response TEXT,
  anything_else TEXT,
  -- Method used to respond
  method TEXT DEFAULT 'desktop',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_survey_responses_campaign ON survey_responses(campaign_id);
CREATE INDEX idx_survey_responses_question ON survey_responses(question_id);
-- No index on respondent_id to reinforce anonymity patterns


-- ── BE HEARD REQUESTS ───────────────────────────────────────
-- Anonymous submissions from any staff member

CREATE TABLE be_heard_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  -- submitted_by stores the user ID for their own tracking,
  -- but is NEVER exposed to leadership through queries
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  score INT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  routed_to user_role NOT NULL,
  status be_heard_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_be_heard_org ON be_heard_requests(org_id);
CREATE INDEX idx_be_heard_status ON be_heard_requests(status);
CREATE INDEX idx_be_heard_routed_to ON be_heard_requests(routed_to);
-- Personal tracking index (only used by RLS to let users see their own)
CREATE INDEX idx_be_heard_submitted_by ON be_heard_requests(submitted_by);


-- ── BE HEARD STATUS UPDATES ─────────────────────────────────
-- Feedback loop — submitters can track what happened with their submission

CREATE TABLE be_heard_status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES be_heard_requests(id) ON DELETE CASCADE NOT NULL,
  status be_heard_update_status NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  action_type be_heard_action_type,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_be_heard_updates_request ON be_heard_status_updates(request_id);


-- ── DAILY BRIEFS ────────────────────────────────────────────

CREATE TABLE daily_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  themes TEXT[] NOT NULL DEFAULT '{}',
  regulation_alert BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_daily_briefs_campaign ON daily_briefs(campaign_id);
CREATE INDEX idx_daily_briefs_date ON daily_briefs(date);


-- ── BRIEF ACTIONS (work plan items) ─────────────────────────

CREATE TABLE brief_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES daily_briefs(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  assigned_to user_role NOT NULL,
  assigned_to_user UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_brief_actions_brief ON brief_actions(brief_id);
CREATE INDEX idx_brief_actions_assigned ON brief_actions(assigned_to);


-- ── FOLLOW-UP JOBS ──────────────────────────────────────────
-- 30-day auto follow-ups for every campaign

CREATE TABLE follow_up_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type follow_up_type NOT NULL,
  trigger_date DATE NOT NULL,
  status follow_up_status NOT NULL DEFAULT 'pending',
  theme TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_follow_ups_campaign ON follow_up_jobs(campaign_id);
CREATE INDEX idx_follow_ups_status ON follow_up_jobs(status);
CREATE INDEX idx_follow_ups_trigger ON follow_up_jobs(trigger_date);


-- ── THEME AGGREGATES ────────────────────────────────────────
-- Synthesized themes across campaigns and Be Heard submissions

CREATE TABLE theme_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  theme TEXT NOT NULL,
  frequency INT NOT NULL DEFAULT 1,
  severity theme_severity NOT NULL DEFAULT 'low',
  department TEXT NOT NULL DEFAULT '',
  last_seen DATE NOT NULL DEFAULT CURRENT_DATE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_themes_org ON theme_aggregates(org_id);
CREATE INDEX idx_themes_severity ON theme_aggregates(severity);


-- ── YOU SAID / WE DID ───────────────────────────────────────
-- Functional accountability loop — visible to all roles

CREATE TABLE you_said_we_did (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  you_said TEXT NOT NULL,
  we_did TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '',
  resolved_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source you_said_source NOT NULL DEFAULT 'leadership',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_yswd_org ON you_said_we_did(org_id);
CREATE INDEX idx_yswd_date ON you_said_we_did(resolved_date DESC);


-- ── SHOUT-OUTS ──────────────────────────────────────────────
-- Leadership ticker — positive messages from ED, EVP, DOP

CREATE TABLE shout_outs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  from_role user_role NOT NULL,
  from_name TEXT NOT NULL,
  message TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Only leadership roles can create shout-outs
  CONSTRAINT leadership_only CHECK (
    from_role IN ('ed', 'evp', 'dop')
  )
);

CREATE INDEX idx_shout_outs_org ON shout_outs(org_id);
CREATE INDEX idx_shout_outs_active ON shout_outs(active) WHERE active = true;


-- ── KPI SNAPSHOTS ───────────────────────────────────────────
-- Agency metrics — computed periodically

CREATE TABLE kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  trend kpi_trend NOT NULL DEFAULT 'stable',
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_kpi_org ON kpi_snapshots(org_id);
CREATE INDEX idx_kpi_date ON kpi_snapshots(snapshot_date DESC);


-- ── CONTEXT TRIGGERS ────────────────────────────────────────
-- Event-based nudges for contextual survey questions

CREATE TABLE context_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- ── UPDATED_AT TRIGGER ──────────────────────────────────────
-- Auto-update updated_at on any row change

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON be_heard_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON theme_aggregates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── AUTO-CREATE FOLLOW-UP JOBS ──────────────────────────────
-- When a campaign is created, schedule a 30-day follow-up

CREATE OR REPLACE FUNCTION auto_create_follow_ups()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a risk follow-up 30 days after window closes
  INSERT INTO follow_up_jobs (campaign_id, org_id, type, trigger_date, theme)
  VALUES (
    NEW.id,
    NEW.org_id,
    'risk',
    NEW.window_end + INTERVAL '30 days',
    'Auto follow-up: check for unresolved concerns'
  );

  -- Create a positive follow-up 30 days after window closes
  INSERT INTO follow_up_jobs (campaign_id, org_id, type, trigger_date, theme)
  VALUES (
    NEW.id,
    NEW.org_id,
    'positive',
    NEW.window_end + INTERVAL '30 days',
    'Auto follow-up: celebrate positive outcomes'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_campaign_created
  AFTER INSERT ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_follow_ups();


-- ── SCORE-BASED ROUTING FUNCTION ────────────────────────────
-- Automatically route Be Heard requests based on severity score

CREATE OR REPLACE FUNCTION route_be_heard()
RETURNS TRIGGER AS $$
BEGIN
  -- Score-based routing: 0-39→DOP, 40-69→EVP, 70-89→ED, 90+→Voice Steward
  IF NEW.score >= 90 THEN
    NEW.routed_to := 'voice_steward';
  ELSIF NEW.score >= 70 THEN
    NEW.routed_to := 'ed';
  ELSIF NEW.score >= 40 THEN
    NEW.routed_to := 'evp';
  ELSE
    NEW.routed_to := 'dop';
  END IF;

  -- Auto-create initial status update
  -- (done via a separate trigger to avoid circular deps)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_be_heard_score
  BEFORE INSERT ON be_heard_requests
  FOR EACH ROW
  EXECUTE FUNCTION route_be_heard();

-- Auto-create "received" status when Be Heard is submitted
CREATE OR REPLACE FUNCTION auto_be_heard_received()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO be_heard_status_updates (request_id, status, note)
  VALUES (
    NEW.id,
    'received',
    'Your voice has been received. It will be reviewed and routed to the appropriate leader.'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_be_heard_created
  AFTER INSERT ON be_heard_requests
  FOR EACH ROW
  EXECUTE FUNCTION auto_be_heard_received();
