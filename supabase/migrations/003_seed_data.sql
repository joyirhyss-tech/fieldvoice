-- =============================================
-- FieldVoices Seed Data
-- =============================================
-- Demo data matching our mock-data.ts for initial deployment.
-- This creates a demo organization and populates all tables.
--
-- NOTE: profiles.id has a FK to auth.users(id). Since demo profiles
-- don't have real auth accounts, we temporarily drop and re-add the
-- constraint with NOT VALID (skip checking existing seed rows).
-- =============================================

-- ── Step 1: Drop auth.users FK for demo data ─────────────────
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- ── Demo Organization ───────────────────────────────────────

INSERT INTO organizations (id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Youth Services Agency', 'demo-agency')
ON CONFLICT (id) DO NOTHING;


-- ── Demo Profiles ───────────────────────────────────────────
-- Note: In production, profiles are created via auth.users trigger.
-- For seed data, we insert directly (these won't have auth accounts).

INSERT INTO profiles (id, org_id, name, role, department, email) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Maria Chen', 'ed', 'Executive Office', 'maria.chen@demo.org'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'James Powell', 'evp', 'Executive Office', 'james.powell@demo.org'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Dana Morales', 'dop', 'Youth Services', 'dana.morales@demo.org'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Alex Rivera', 'site_supervisor', 'Youth Services', 'alex.rivera@demo.org'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'Jordan Kim', 'direct_service', 'Youth Services', 'jordan.kim@demo.org'),
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', 'Sam Washington', 'program_team', 'Administration', 'sam.washington@demo.org'),
  ('00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000001', 'Keisha Brooks', 'voice_steward', 'Youth Services', 'keisha.brooks@demo.org');


-- ── Campaigns ───────────────────────────────────────────────

INSERT INTO campaigns (id, org_id, intention, objective, audience, window_start, window_end, status, created_by, participant_count, response_count, created_at) VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    'Understand frontline burnout signals before summer surge',
    'Identify top 3 stressors and generate actionable support plan',
    ARRAY['Field Staff', 'Site Supervisors'],
    '2026-02-15',
    '2026-03-01',
    'completed',
    '00000000-0000-0000-0000-000000000103',
    24, 19,
    '2026-02-10'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000001',
    'Check in on new onboarding experience',
    'Find gaps in first-60-day support for new hires',
    ARRAY['Field Staff'],
    '2026-03-01',
    '2026-03-15',
    'active',
    '00000000-0000-0000-0000-000000000103',
    12, 7,
    '2026-02-25'
  );


-- ── Survey Questions (for onboarding campaign) ──────────────

INSERT INTO survey_questions (id, campaign_id, text, type, source, included, sort_order, context_trigger, design_note) VALUES
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000202', 'On a scale of 1-10, how supported do you feel in your first 60 days?', 'scale', 'ai-generated', true, 1, NULL, 'Warmth-centered: asks about felt support, not satisfaction metrics'),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000202', 'What is one thing about your onboarding experience that could be improved?', 'open', 'ai-generated', true, 2, NULL, NULL),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000202', 'Think about a moment during your first weeks where you felt truly welcomed. What made that moment matter?', 'reflective', 'practice-center', true, 3, NULL, 'Reflective prompts invite storytelling. They surface belonging and culture insights no checkbox can capture.'),
  ('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000202', 'Which of the following resources did you find most useful? (Select all that apply)', 'multiple-choice', 'ai-generated', true, 4, NULL, NULL),
  ('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000202', 'Were you paired with a mentor during your onboarding?', 'yes-no', 'ai-generated', true, 5, NULL, NULL),
  ('00000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000202', 'Right now, how are you feeling about your role here?', 'pulse', 'practice-center', true, 6, NULL, 'Pulse prompts are brief emotional temperature checks. They honor the person behind the data.'),
  ('00000000-0000-0000-0000-000000000307', '00000000-0000-0000-0000-000000000202', 'After your team meeting today, did you feel your contributions were heard and valued?', 'contextual', 'practice-center', false, 7, 'post-meeting', 'Contextual questions arrive at the right moment.'),
  ('00000000-0000-0000-0000-000000000308', '00000000-0000-0000-0000-000000000202', 'You completed your first solo shift. What would have helped you feel more prepared?', 'contextual', 'practice-center', false, 8, 'first-solo-shift', 'Event-based nudge: sent automatically when the milestone is reached.'),
  ('00000000-0000-0000-0000-000000000309', '00000000-0000-0000-0000-000000000202', 'Is there anything you would like leadership to know about your experience so far?', 'open', 'ai-generated', true, 9, NULL, NULL),
  ('00000000-0000-0000-0000-000000000310', '00000000-0000-0000-0000-000000000202', 'Do you feel you have the tools and information needed to do your job effectively?', 'scale', 'ai-generated', false, 10, NULL, NULL);


-- ── Be Heard Requests ───────────────────────────────────────
-- Note: score triggers auto-routing via the route_be_heard() trigger

INSERT INTO be_heard_requests (id, org_id, submitted_by, content, score, routed_to, status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000105', 'We keep losing supplies mid-week and nobody tracks restocking.', 42, 'evp', 'pending', '2026-03-04'),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000105', 'Youth are reporting feeling unsafe at the bus stop after program.', 88, 'ed', 'reviewed', '2026-03-03'),
  ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000105', 'The morning briefing format is really working. Can we keep it?', 15, 'dop', 'actioned', '2026-03-02');


-- ── Be Heard Status Updates ─────────────────────────────────

INSERT INTO be_heard_status_updates (id, request_id, status, note, action_type, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000401', 'under-review', 'Your concern about supply restocking has been reviewed by the EVP. An action is being planned.', 'communicate-existing', '2026-03-05'),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000402', 'action-planned', 'Youth safety at the bus stop is being addressed. A meeting with transportation partners is scheduled for March 10.', 'new-action', '2026-03-04'),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000403', 'communicated', 'Great news! The morning briefing format has been shared as a template across all sites. Thank you for highlighting what works.', 'communicate-existing', '2026-03-03');


-- ── Daily Brief ─────────────────────────────────────────────

INSERT INTO daily_briefs (id, campaign_id, org_id, date, themes, regulation_alert) VALUES
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', '2026-03-06',
   ARRAY['Onboarding documentation is outdated', 'Mentorship pairing requests unmet', 'Positive feedback on weekly check-ins'],
   false);


-- ── Brief Actions ───────────────────────────────────────────

INSERT INTO brief_actions (id, brief_id, campaign_id, description, assigned_to, due_date, completed) VALUES
  ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000202', 'Update onboarding packet with current site contacts and schedules', 'dop', '2026-03-10', false),
  ('00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000202', 'Launch mentor match round for March cohort', 'program_team', '2026-03-12', false),
  ('00000000-0000-0000-0000-000000000703', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000202', 'Share weekly check-in format as template across sites', 'site_supervisor', '2026-03-08', true);


-- ── Theme Aggregates ────────────────────────────────────────

INSERT INTO theme_aggregates (id, org_id, theme, frequency, severity, department, last_seen) VALUES
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000001', 'Outdated onboarding materials', 8, 'medium', 'Youth Services', '2026-03-05'),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000001', 'Mentor pairing gaps', 6, 'medium', 'Youth Services', '2026-03-04'),
  ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000001', 'Positive: weekly check-in format', 11, 'low', 'Youth Services', '2026-03-06'),
  ('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000001', 'Supply restocking delays', 5, 'high', 'Operations', '2026-03-04');


-- ── Follow-Up Jobs ──────────────────────────────────────────
-- Note: These would normally be auto-created by the trigger,
-- but we insert manually to match our mock data exactly.

INSERT INTO follow_up_jobs (id, campaign_id, org_id, type, trigger_date, status, theme) VALUES
  ('00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'risk', '2026-03-17', 'pending', 'Burnout signals in field staff'),
  ('00000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'positive', '2026-03-17', 'pending', 'Team bonding activities well-received');


-- ── You Said / We Did ───────────────────────────────────────

INSERT INTO you_said_we_did (id, org_id, you_said, we_did, department, resolved_date, source) VALUES
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000001', 'Onboarding docs are outdated', 'Packet updated with current site contacts and schedules', 'Youth Services', '2026-03-04', 'fieldvoice'),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000001', 'Supply restocking is unreliable mid-week', 'New restocking schedule starts Monday — you said it, we did it', 'Operations', '2026-03-05', 'be-heard'),
  ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000001', 'Mentor pairing requests are going unmet', 'Mentor match round is full — every new hire has a mentor within their first week', 'Youth Services', '2026-03-03', 'fieldvoice'),
  ('00000000-0000-0000-0000-000000001004', '00000000-0000-0000-0000-000000000001', 'Weekly check-in format is really working', 'Friday check-ins are now agency-wide! Site Supervisors who piloted this made it better for everyone', 'All Departments', '2026-03-01', 'leadership');


-- ── Shout-Outs ──────────────────────────────────────────────

INSERT INTO shout_outs (id, org_id, from_role, from_name, message, created_by) VALUES
  ('00000000-0000-0000-0000-000000001101', '00000000-0000-0000-0000-000000000001', 'ed', 'Maria Chen', 'Huge shout-out to Site 3 for redesigning the morning check-in — youth attendance is up 22% this month!', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000001102', '00000000-0000-0000-0000-000000000001', 'evp', 'James Powell', 'The onboarding packet updates are live. Thank you to everyone who shared feedback — your voice made this happen.', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000001103', '00000000-0000-0000-0000-000000000001', 'dop', 'Dana Morales', 'Mentor match round is full! Every new hire now has a mentor within their first week. This is what listening looks like.', '00000000-0000-0000-0000-000000000103'),
  ('00000000-0000-0000-0000-000000001104', '00000000-0000-0000-0000-000000000001', 'ed', 'Maria Chen', 'We heard the supply concerns loud and clear — new restocking schedule starts Monday. You said it, we did it.', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000001105', '00000000-0000-0000-0000-000000000001', 'evp', 'James Powell', 'Friday check-ins are now agency-wide! Thank you to Site Supervisors who piloted this — your teams made it better for everyone.', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000001106', '00000000-0000-0000-0000-000000000001', 'dop', 'Dana Morales', 'Three staff members shared ideas that are now in our strategic plan. Your voice is literally shaping where we go next.', '00000000-0000-0000-0000-000000000103');


-- ── KPI Snapshots ───────────────────────────────────────────

INSERT INTO kpi_snapshots (org_id, label, value, trend, snapshot_date) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Response rate this cycle', '58%', 'up', '2026-03-06'),
  ('00000000-0000-0000-0000-000000000001', 'Open concerns', '4', 'down', '2026-03-06'),
  ('00000000-0000-0000-0000-000000000001', 'Actions completed this week', '7 of 9', 'up', '2026-03-06'),
  ('00000000-0000-0000-0000-000000000001', 'Avg. days to first action', '2.3', 'stable', '2026-03-06'),
  ('00000000-0000-0000-0000-000000000001', 'Follow-ups due soon', '2', 'stable', '2026-03-06'),
  ('00000000-0000-0000-0000-000000000001', 'Themes surfaced this month', '12', 'up', '2026-03-06');


-- ── Context Triggers ────────────────────────────────────────

INSERT INTO context_triggers (org_id, event, label, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'post-meeting', 'After a team meeting', 'Sent within 2 hours of a scheduled team meeting'),
  ('00000000-0000-0000-0000-000000000001', 'first-solo-shift', 'After first solo shift', 'Triggered when staff completes their first unaccompanied shift'),
  ('00000000-0000-0000-0000-000000000001', 'post-training', 'After a training session', 'Sent the evening after a training or professional development event'),
  ('00000000-0000-0000-0000-000000000001', 'weekly-pulse', 'Weekly pulse check', 'Brief emotional check-in sent each Friday afternoon'),
  ('00000000-0000-0000-0000-000000000001', 'incident-follow-up', 'After an incident report', 'Sent 24 hours after an incident to check on staff wellbeing'),
  ('00000000-0000-0000-0000-000000000001', 'milestone-30-day', '30-day milestone', 'Reflection prompt at the 30-day mark in role');


-- ── Step 2: Re-enable FK constraint ──────────────────────────
-- NOT VALID means PostgreSQL won't verify existing rows against the constraint,
-- but new inserts/updates will be checked. This is correct for seed data.
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
