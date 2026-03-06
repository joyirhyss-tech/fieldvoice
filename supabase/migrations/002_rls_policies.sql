-- =============================================
-- FieldVoices Row Level Security Policies
-- =============================================
-- These policies enforce role-based access at the database level.
-- Even if the app has a bug, the data stays protected.
-- =============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE be_heard_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE be_heard_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE brief_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE you_said_we_did ENABLE ROW LEVEL SECURITY;
ALTER TABLE shout_outs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_triggers ENABLE ROW LEVEL SECURITY;


-- ── Helper: get current user's role ─────────────────────────

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_leadership()
RETURNS BOOLEAN AS $$
  SELECT role IN ('ed', 'evp', 'dop') FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ── ORGANIZATIONS ───────────────────────────────────────────

CREATE POLICY "Users can view their own org"
  ON organizations FOR SELECT
  USING (id = get_user_org_id());


-- ── PROFILES ────────────────────────────────────────────────

-- Everyone can read profiles in their org (for display names, roles)
CREATE POLICY "Users can view profiles in their org"
  ON profiles FOR SELECT
  USING (org_id = get_user_org_id());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow insert for the trigger (new user signup)
CREATE POLICY "Allow profile creation on signup"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());


-- ── CAMPAIGNS ───────────────────────────────────────────────

-- All org members can view campaigns (transparency)
CREATE POLICY "Org members can view campaigns"
  ON campaigns FOR SELECT
  USING (org_id = get_user_org_id());

-- Only leadership (ED, EVP, DOP) can create campaigns
CREATE POLICY "Leadership can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (
    org_id = get_user_org_id()
    AND is_leadership()
  );

-- Only the creator or leadership can update campaigns
CREATE POLICY "Leadership can update campaigns"
  ON campaigns FOR UPDATE
  USING (
    org_id = get_user_org_id()
    AND is_leadership()
  );


-- ── SURVEY QUESTIONS ────────────────────────────────────────

-- All org members can view questions (for responding)
CREATE POLICY "Org members can view survey questions"
  ON survey_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = survey_questions.campaign_id
      AND campaigns.org_id = get_user_org_id()
    )
  );

-- Leadership can manage questions
CREATE POLICY "Leadership can manage survey questions"
  ON survey_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = survey_questions.campaign_id
      AND campaigns.org_id = get_user_org_id()
    )
    AND is_leadership()
  );

CREATE POLICY "Leadership can update survey questions"
  ON survey_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = survey_questions.campaign_id
      AND campaigns.org_id = get_user_org_id()
    )
    AND is_leadership()
  );


-- ── SURVEY RESPONSES ────────────────────────────────────────
-- Critical: responses are anonymized. Leadership can see response
-- data but NOT who submitted it.

-- Users can insert their own responses
CREATE POLICY "Users can submit responses"
  ON survey_responses FOR INSERT
  WITH CHECK (respondent_id = auth.uid());

-- Users can view only their own responses
CREATE POLICY "Users can view own responses"
  ON survey_responses FOR SELECT
  USING (respondent_id = auth.uid());

-- Leadership can view response data WITHOUT respondent_id
-- This is handled at the query layer — we create a view for this
-- (see below for the anonymized view)


-- ── BE HEARD REQUESTS ───────────────────────────────────────
-- Users can submit and track their own. Leadership sees content but NOT identity.

-- Anyone can submit
CREATE POLICY "Anyone can submit Be Heard"
  ON be_heard_requests FOR INSERT
  WITH CHECK (
    submitted_by = auth.uid()
    AND org_id = get_user_org_id()
  );

-- Users can see their own submissions (for tracking)
CREATE POLICY "Users can view own Be Heard submissions"
  ON be_heard_requests FOR SELECT
  USING (submitted_by = auth.uid());

-- Leadership can see Be Heard content routed to them (but NOT submitted_by)
-- This requires a view — see anonymized view below

-- Leadership can update status
CREATE POLICY "Leadership can update Be Heard status"
  ON be_heard_requests FOR UPDATE
  USING (
    org_id = get_user_org_id()
    AND is_leadership()
  );


-- ── BE HEARD STATUS UPDATES ─────────────────────────────────

-- Users can view status updates for their own submissions
CREATE POLICY "Users can view own status updates"
  ON be_heard_status_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM be_heard_requests
      WHERE be_heard_requests.id = be_heard_status_updates.request_id
      AND be_heard_requests.submitted_by = auth.uid()
    )
  );

-- Leadership can create status updates
CREATE POLICY "Leadership can create status updates"
  ON be_heard_status_updates FOR INSERT
  WITH CHECK (is_leadership());


-- ── DAILY BRIEFS ────────────────────────────────────────────

-- All org members can view briefs (equity: transparency)
CREATE POLICY "Org members can view daily briefs"
  ON daily_briefs FOR SELECT
  USING (org_id = get_user_org_id());

-- System/leadership can create briefs
CREATE POLICY "Leadership can create daily briefs"
  ON daily_briefs FOR INSERT
  WITH CHECK (
    org_id = get_user_org_id()
    AND is_leadership()
  );


-- ── BRIEF ACTIONS ───────────────────────────────────────────

-- All org members can view actions (transparency)
CREATE POLICY "Org members can view brief actions"
  ON brief_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM daily_briefs
      WHERE daily_briefs.id = brief_actions.brief_id
      AND daily_briefs.org_id = get_user_org_id()
    )
  );

-- Leadership can create and update actions
CREATE POLICY "Leadership can manage actions"
  ON brief_actions FOR INSERT
  WITH CHECK (is_leadership());

CREATE POLICY "Leadership can update actions"
  ON brief_actions FOR UPDATE
  USING (is_leadership());


-- ── FOLLOW-UP JOBS ──────────────────────────────────────────

CREATE POLICY "Org members can view follow-ups"
  ON follow_up_jobs FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "System can manage follow-ups"
  ON follow_up_jobs FOR ALL
  USING (org_id = get_user_org_id() AND is_leadership());


-- ── THEME AGGREGATES ────────────────────────────────────────
-- Equity: ALL roles can view anonymized themes

CREATE POLICY "All org members can view themes"
  ON theme_aggregates FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Leadership can manage themes"
  ON theme_aggregates FOR INSERT
  WITH CHECK (org_id = get_user_org_id() AND is_leadership());

CREATE POLICY "Leadership can update themes"
  ON theme_aggregates FOR UPDATE
  USING (org_id = get_user_org_id() AND is_leadership());


-- ── YOU SAID / WE DID ───────────────────────────────────────
-- Visible to ALL roles — this is the accountability loop

CREATE POLICY "All org members can view You Said We Did"
  ON you_said_we_did FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Leadership can create You Said We Did"
  ON you_said_we_did FOR INSERT
  WITH CHECK (org_id = get_user_org_id() AND is_leadership());


-- ── SHOUT-OUTS ──────────────────────────────────────────────
-- Visible to all, created by leadership only

CREATE POLICY "All org members can view shout-outs"
  ON shout_outs FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Leadership can create shout-outs"
  ON shout_outs FOR INSERT
  WITH CHECK (org_id = get_user_org_id() AND is_leadership());

CREATE POLICY "Leadership can update shout-outs"
  ON shout_outs FOR UPDATE
  USING (org_id = get_user_org_id() AND is_leadership());


-- ── KPI SNAPSHOTS ───────────────────────────────────────────

CREATE POLICY "All org members can view KPIs"
  ON kpi_snapshots FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Leadership can manage KPIs"
  ON kpi_snapshots FOR INSERT
  WITH CHECK (org_id = get_user_org_id() AND is_leadership());


-- ── CONTEXT TRIGGERS ────────────────────────────────────────

CREATE POLICY "All org members can view triggers"
  ON context_triggers FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Leadership can manage triggers"
  ON context_triggers FOR INSERT
  WITH CHECK (org_id = get_user_org_id() AND is_leadership());


-- ── ANONYMIZED VIEWS ────────────────────────────────────────
-- These views strip identity from sensitive data so leadership
-- can see patterns without seeing people.

-- Leadership view of Be Heard — content only, NO identity
CREATE VIEW be_heard_anonymous AS
SELECT
  id,
  org_id,
  content,
  score,
  routed_to,
  status,
  created_at,
  updated_at
FROM be_heard_requests;

-- Leadership view of survey responses — data only, NO respondent
CREATE VIEW survey_responses_anonymous AS
SELECT
  id,
  campaign_id,
  question_id,
  text_response,
  scale_response,
  boolean_response,
  choice_response,
  pulse_response,
  follow_up_response,
  anything_else,
  method,
  created_at
FROM survey_responses;
