/**
 * Demo Data — Hoomau Youth and Family Collective (HYFC)
 * ──────────────────────────────────────────────────────
 * Realistic 18-person pilot with 2 weeks of FieldVoices data.
 * Based on PYD Demo Folder source materials.
 *
 * This data is LOCAL ONLY — never deployed to production.
 */

import {
  StaffMember,
  UserRole,
  BeHeardRequest,
  BeHeardStatusUpdate,
  ThemeAggregate,
  KPISnapshot,
  YouSaidWeDid,
  SynthesisInput,
  AgencyDocument,
} from './types';
import { synthesizeActions } from './synthesis';

// ─── Organization Context ────────────────────────────────────

export const DEMO_ORG = {
  name: 'Hoomau Youth and Family Collective',
  shortName: 'HYFC',
  mission: 'Equip youth and families to build safety, belonging, and long-term opportunity.',
  sites: ['Kalihi', 'Waianae', 'Central'],
  budget: '$10M operating / $1M youth programs',
  location: 'Honolulu, HI',
};

// ─── Staff Roster (18 people) ────────────────────────────────

function mapPYDRole(role: string): UserRole {
  switch (role) {
    case 'ED': return 'ed';
    case 'EVP': return 'evp';
    case 'DOP': return 'dop';
    case 'Site Supervisor': return 'site_supervisor';
    case 'YDS':
    case 'Family Navigator':
    case 'Data Specialist':
    case 'Program Coordinator':
    case 'Partnership Lead':
    case 'Evaluation Lead':
    default: return 'direct_service';
  }
}

export const DEMO_STAFF: StaffMember[] = [
  { id: 'FV001', name: 'Jay Dice', role: mapPYDRole('YDS'), accessCode: '101', pin: '1234', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV002', name: 'Milly Jean', role: mapPYDRole('YDS'), accessCode: '102', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV003', name: 'Kaikoa Frank', role: mapPYDRole('YDS'), accessCode: '103', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV004', name: 'Lisa Trish', role: mapPYDRole('YDS'), accessCode: '104', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV005', name: 'Ana Keola', role: mapPYDRole('YDS'), accessCode: '105', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV006', name: 'Noelani Pomaikai', role: mapPYDRole('YDS'), accessCode: '106', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV007', name: 'Kimo Reyes', role: mapPYDRole('Family Navigator'), accessCode: '107', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV008', name: 'Lehua Akana', role: mapPYDRole('Family Navigator'), accessCode: '108', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV009', name: 'Maka Ito', role: mapPYDRole('Data Specialist'), accessCode: '109', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV010', name: 'Sera Quinn', role: mapPYDRole('Program Coordinator'), accessCode: '110', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV011', name: 'Kaleo Mendez', role: mapPYDRole('Program Coordinator'), accessCode: '111', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV012', name: 'Leilani Tree', role: mapPYDRole('DOP'), accessCode: '112', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV013', name: 'Tina Mack', role: mapPYDRole('Site Supervisor'), accessCode: '113', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV014', name: 'Sean Troy', role: mapPYDRole('Site Supervisor'), accessCode: '114', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV015', name: 'Pono Kalei', role: mapPYDRole('Partnership Lead'), accessCode: '115', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV016', name: 'Tank Jones', role: mapPYDRole('EVP'), accessCode: '116', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV017', name: 'Lauralani Reece', role: mapPYDRole('ED'), accessCode: '117', pin: '1234', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
  { id: 'FV018', name: 'Kana Uehara', role: mapPYDRole('Evaluation Lead'), accessCode: '118', documents: [], createdAt: '2025-01-15T00:00:00.000Z' },
];

// ─── Campaign Stats ──────────────────────────────────────────

export const DEMO_CAMPAIGN_STATS = {
  active: 1,
  participants: 18,
  responseRate: 83,
  campaignName: 'Staff Wellbeing & Operations Check-In',
  windowStart: '2026-02-17',
  windowEnd: '2026-03-07',
};

// ─── Synthesized Themes (Week 2 — current state) ────────────

export const DEMO_THEMES: ThemeAggregate[] = [
  {
    id: 'TH001',
    theme: 'Late change requests reducing quality',
    frequency: 6,
    severity: 'medium',
    department: 'Youth Leadership',
    lastSeen: '2026-03-05',
  },
  {
    id: 'TH002',
    theme: 'Coaching cadence instability',
    frequency: 4,
    severity: 'high',
    department: 'Youth Leadership',
    lastSeen: '2026-03-06',
  },
  {
    id: 'TH003',
    theme: 'Agenda and action log inconsistency',
    frequency: 5,
    severity: 'medium',
    department: 'Youth Leadership',
    lastSeen: '2026-03-04',
  },
  {
    id: 'TH004',
    theme: 'Duplicate reporting burden',
    frequency: 7,
    severity: 'high',
    department: 'Youth Leadership',
    lastSeen: '2026-03-07',
  },
  {
    id: 'TH005',
    theme: 'Leadership site-presence expectations',
    frequency: 3,
    severity: 'low',
    department: 'Executive',
    lastSeen: '2026-03-03',
  },
  {
    id: 'TH006',
    theme: 'Cross-site handoff friction',
    frequency: 5,
    severity: 'medium',
    department: 'Youth Leadership',
    lastSeen: '2026-03-05',
  },
];

// ─── KPI Metrics ─────────────────────────────────────────────

export const DEMO_KPIS: KPISnapshot[] = [
  { label: 'Coaching Compliance', value: '68%', trend: 'up' },
  { label: 'Agenda Completeness', value: '82%', trend: 'up' },
  { label: 'Action Log Rate', value: '77%', trend: 'up' },
  { label: 'Duplicate Reports', value: '6/wk', trend: 'down' },
  { label: 'Meeting Effectiveness', value: '3.4/5', trend: 'up' },
  { label: 'Voice Participation', value: '83%', trend: 'up' },
  { label: 'Friction Hours Saved', value: '20 hrs/mo', trend: 'down' },
];

// ─── You Said / We Did ──────────────────────────────────────

export const DEMO_YOU_SAID_WE_DID: YouSaidWeDid[] = [
  {
    id: 'yswd-1',
    youSaid: 'Late program changes reduce session quality and stress out frontline staff.',
    weDid: 'Implemented a 48-hour planning cutoff — no major session changes within two days of delivery.',
    department: 'Youth Leadership',
    resolvedDate: '2026-02-24',
    source: 'fieldvoice',
  },
  {
    id: 'yswd-2',
    youSaid: 'Coaching time keeps getting squeezed out by reporting deadlines.',
    weDid: 'Restored protected coaching blocks for both sites and locked them as recurring calendar events.',
    department: 'Youth Leadership',
    resolvedDate: '2026-02-26',
    source: 'fieldvoice',
  },
  {
    id: 'yswd-3',
    youSaid: 'Meeting structure varies too much — some have agendas, some don\'t.',
    weDid: 'Required agenda owner field and action-log template for all department and 1:1 meetings.',
    department: 'Youth Leadership',
    resolvedDate: '2026-02-25',
    source: 'fieldvoice',
  },
  {
    id: 'yswd-4',
    youSaid: 'We\'re reporting the same data in three different formats. It\'s draining our time.',
    weDid: 'Began consolidation into a single reporting standard. Final template in review this week.',
    department: 'Youth Leadership',
    resolvedDate: '2026-03-03',
    source: 'fieldvoice',
  },
];

// ─── Be Heard Submissions (realistic variety across roles) ───

export const DEMO_BE_HEARD: BeHeardRequest[] = [
  // ── From frontline YDS — operational concerns ──
  {
    id: 'bh-demo-1',
    submittedBy: 'anonymous',
    content: 'I love this work but I\'m burning out. Three of us are covering shifts that should have five staff. The youth notice when we\'re stretched thin and it affects the quality of connection we can offer. Can we get a realistic staffing conversation on the calendar?',
    score: 72,
    routedTo: 'ed',
    status: 'actioned',
    createdAt: '2026-02-18',
  },
  {
    id: 'bh-demo-2',
    submittedBy: 'anonymous',
    content: 'The new intake form is asking families for information we already collect during enrollment. Two families this week asked why they had to fill out the same thing twice. It feels disrespectful of their time and makes us look unorganized.',
    score: 45,
    routedTo: 'dop',
    status: 'reviewed',
    createdAt: '2026-02-20',
  },
  {
    id: 'bh-demo-3',
    submittedBy: 'anonymous',
    content: 'Shout out to Tina and the Kalihi team — the community garden event was beautiful. Youth were leading tours for their own families. That\'s the kind of programming we should be doing more of.',
    score: 15,
    routedTo: 'dop',
    status: 'reviewed',
    createdAt: '2026-02-22',
  },
  // ── From Family Navigators — community-facing concerns ──
  {
    id: 'bh-demo-4',
    submittedBy: 'anonymous',
    content: 'Two families on my caseload are in crisis and I don\'t have current referral contacts for DHS housing support. The partnership list in our shared drive is from 2024. When families are in urgent situations, outdated information costs real time and trust.',
    score: 68,
    routedTo: 'evp',
    status: 'actioned',
    createdAt: '2026-02-19',
  },
  {
    id: 'bh-demo-5',
    submittedBy: 'anonymous',
    content: 'I wish we had a way to share positive feedback from families with the whole team, not just supervisors. When a parent writes a thank-you note, everyone who supported that family should get to feel that.',
    score: 22,
    routedTo: 'dop',
    status: 'pending',
    createdAt: '2026-02-25',
  },
  // ── From Site Supervisor — leadership-level observation ──
  {
    id: 'bh-demo-6',
    submittedBy: 'anonymous',
    content: 'I\'ve noticed that when EVP or ED visits our site, staff morale lifts for days afterward. But visits have been inconsistent. I know leadership is busy, but even a 30-minute walk-through once a month sends a message that our site matters.',
    score: 52,
    routedTo: 'evp',
    status: 'actioned',
    createdAt: '2026-02-21',
  },
  {
    id: 'bh-demo-7',
    submittedBy: 'anonymous',
    content: 'The cross-site transfer process for youth moving between Kalihi and Waianae has no written protocol. Twice this month a young person showed up at the other site and staff didn\'t have their file. We need a documented handoff process.',
    score: 61,
    routedTo: 'evp',
    status: 'reviewed',
    createdAt: '2026-02-24',
  },
  // ── From DOP — management-level strategic concern ──
  {
    id: 'bh-demo-8',
    submittedBy: 'anonymous',
    content: 'Our coaching model is strong on paper but implementation is inconsistent. Supervisors are pulled into compliance work during scheduled coaching blocks. If we value coaching, we need to protect those blocks the same way we protect client-facing time.',
    score: 58,
    routedTo: 'evp',
    status: 'actioned',
    createdAt: '2026-02-17',
  },
  // ── From Program Coordinator — systems concern ──
  {
    id: 'bh-demo-9',
    submittedBy: 'anonymous',
    content: 'We are currently reporting youth outcomes in three different formats for three different funders. It takes me 6+ hours a week. A unified reporting template could cut that in half and improve accuracy. I\'d be happy to help design it.',
    score: 43,
    routedTo: 'dop',
    status: 'actioned',
    createdAt: '2026-02-23',
  },
  // ── From EVP — executive-level concern ──
  {
    id: 'bh-demo-10',
    submittedBy: 'anonymous',
    content: 'I\'m hearing from multiple sites that staff feel disconnected from the agency mission when they\'re buried in compliance paperwork. We need to audit our reporting requirements and eliminate anything that doesn\'t directly serve youth outcomes or funder relationships.',
    score: 78,
    routedTo: 'ed',
    status: 'reviewed',
    createdAt: '2026-02-26',
  },
  // ── Positive feedback with suggestions ──
  {
    id: 'bh-demo-11',
    submittedBy: 'anonymous',
    content: 'The FieldVoices nudge asking "what made your work easier today?" is the first time I\'ve felt like leadership actually wants to hear from me, not just collect data about me. Keep this going.',
    score: 18,
    routedTo: 'dop',
    status: 'reviewed',
    createdAt: '2026-03-01',
  },
  {
    id: 'bh-demo-12',
    submittedBy: 'anonymous',
    content: 'I want to flag something positive: the new agenda-required policy for department meetings has already made a difference. Our Wednesday meeting went from 90 minutes to 55 and actually had clear next steps. More of this please.',
    score: 12,
    routedTo: 'dop',
    status: 'pending',
    createdAt: '2026-03-04',
  },
  // ── Sensitive concern — escalation path ──
  {
    id: 'bh-demo-13',
    submittedBy: 'anonymous',
    content: 'There is a pattern at one of our sites where certain staff are consistently excluded from decision-making conversations. I don\'t think it\'s intentional but the impact is real. People feel invisible and it\'s affecting retention.',
    score: 91,
    routedTo: 'ed',
    status: 'pending',
    createdAt: '2026-03-05',
  },
];

// ─── Be Heard Status Updates ─────────────────────────────────

export const DEMO_BE_HEARD_STATUSES: BeHeardStatusUpdate[] = [
  {
    id: 'bhs-1',
    requestId: 'bh-demo-1',
    status: 'action-planned',
    note: 'Staffing review meeting scheduled for March 14. HR and program leads will present a sustainable coverage model.',
    updatedAt: '2026-02-28',
    actionType: 'new-action',
  },
  {
    id: 'bhs-2',
    requestId: 'bh-demo-4',
    status: 'resolved',
    note: 'Partnership list updated with current DHS, housing, and crisis contacts. Shared to all navigators via the partnership folder.',
    updatedAt: '2026-02-27',
    actionType: 'new-action',
  },
  {
    id: 'bhs-3',
    requestId: 'bh-demo-6',
    status: 'action-planned',
    note: 'Monthly site visit schedule published for March and April. EVP will rotate between sites; ED will join quarterly.',
    updatedAt: '2026-03-01',
    actionType: 'new-action',
  },
  {
    id: 'bhs-4',
    requestId: 'bh-demo-8',
    status: 'resolved',
    note: 'Coaching blocks now marked as protected in all supervisor calendars. Compliance tasks rescheduled to non-coaching windows.',
    updatedAt: '2026-02-25',
    actionType: 'new-action',
  },
  {
    id: 'bhs-5',
    requestId: 'bh-demo-9',
    status: 'action-planned',
    note: 'Unified reporting template in draft. Sera and Kana leading the design. Target launch: March 17.',
    updatedAt: '2026-03-02',
    actionType: 'new-action',
  },
];

// ─── Daily Brief / Leadership Memo ───────────────────────────

export const DEMO_LEADERSHIP_MEMO = `Team,

This week's voices told us something important: the changes we're making are landing.

Coaching is happening again. Agendas are working. Meetings are shorter. And people feel heard — genuinely heard — for the first time in a while.

The duplicate reporting issue is still the heaviest weight. Sera and Kana are building a unified template that we'll pilot next week. If it works the way I think it will, we're giving back 6+ hours a week to people who need that time with youth and families.

Three things I want us to carry into next week:
1. Keep the 48-hour planning cutoff. It's working. Don't bend on it.
2. Cross-site handoff huddles start Wednesday. 20 minutes, both sites.
3. If you see something worth celebrating, say it out loud. The garden event at Kalihi reminded me why we do this.

You said coaching was getting squeezed. We protected those blocks. You said meetings were unstructured. We required agendas. You said reporting was draining you. We're building the fix right now.

Your voice is not just data to us. It's direction.

With gratitude,
Lauralani`;

// ─── Agency Context Notes ────────────────────────────────────

export const DEMO_CONTEXT_NOTES = `HYFC operates three youth centers across O'ahu serving 400+ youth annually through PYD-informed programming. Current pilot: 18-person team in the Youth Leadership and Enrichment department testing FieldVoices over a 2-week window.

Key context for interpreting survey data:
• Kalihi site recently onboarded 3 new YDS staff — expect adjustment themes
• Waianae site has the longest-tenured team — high engagement, high expectations
• COA reaccreditation review is in Q3 — compliance pressure is real and valid
• Two major funders (State DHS, OYS) require separate reporting formats — this drives the duplicate reporting concern
• Partnership list maintenance has been ad-hoc; no dedicated owner until now`;

// ─── Shout-Outs (for MetricTicker) ──────────────────────────

export const DEMO_SHOUT_OUTS = [
  { id: 'so-1', from: 'FV013', name: 'Tina Mack', message: 'Coaching compliance up 10 points this week — keep it going team!' },
  { id: 'so-2', from: 'FV017', name: 'Lauralani Reece', message: 'Kalihi community garden event was youth-led and family-attended. Beautiful work.' },
  { id: 'so-3', from: 'FV018', name: 'Kana Uehara', message: '83% voice participation rate across the pilot — highest engagement we have seen.' },
  { id: 'so-4', from: 'FV012', name: 'Leilani Tree', message: 'Agenda completeness jumped from 71% to 82%. Meetings are shorter and better.' },
  { id: 'so-5', from: 'FV016', name: 'Tank Jones', message: 'First You Said / We Did updates published. The accountability loop is real.' },
  { id: 'so-6', from: 'FV010', name: 'Sera Quinn', message: '20 friction hours recovered monthly. Time back with youth and families.' },
];

// ─── Follow-Up Schedule ──────────────────────────────────────

export const DEMO_FOLLOW_UPS = [
  { label: 'Staffing review meeting', date: 'Mar 14', status: 'scheduled' as const },
  { label: 'Unified reporting template pilot', date: 'Mar 17', status: 'scheduled' as const },
  { label: 'Cross-site handoff huddle launch', date: 'Mar 12', status: 'scheduled' as const },
  { label: 'Post-pilot pulse check (2-week follow-up)', date: 'Mar 21', status: 'pending' as const },
];

// ─── Action Items for Impact Plan ────────────────────────────

export const DEMO_IMPACT_ACTIONS = [
  'Approve unified reporting template by March 17',
  'Review staffing coverage model with HR — March 14 meeting',
  'Publish site visit schedule through April',
  'Launch cross-site handoff huddle protocol — Wednesday',
  'Close the loop on intake form duplication (DOP to action)',
  'Share Kalihi garden event model with Waianae team',
  'Schedule COA readiness check-in with Kana',
  'Follow-up pulse survey at 2-week mark (March 21)',
];

// ─── Archive Data (synthesized voice summaries) ──────────────

export const DEMO_ARCHIVE_VOICES = [
  {
    id: 'av-1',
    title: 'Week 1 Voice Synthesis',
    date: '2026-02-21',
    summary: '27 responses across voice, text, and email. Top signals: late plan changes (12 mentions), coaching gaps (9), agenda inconsistency (11). Staff expressed strong desire for predictability and follow-through.',
    themes: ['Late changes', 'Coaching', 'Meeting structure'],
  },
  {
    id: 'av-2',
    title: 'Week 2 Voice Synthesis',
    date: '2026-02-28',
    summary: '29 responses with improving trends across 5 of 6 themes. Notable: staff reported feeling heard after seeing "You Said / We Did" updates. Duplicate reporting remains the most persistent concern.',
    themes: ['Reporting burden', 'Feeling heard', 'Handoff process'],
  },
];

export const DEMO_ARCHIVE_CONCERNS = [
  {
    id: 'ac-1',
    title: 'Duplicate Reporting Burden',
    severity: 'high' as const,
    date: '2026-03-07',
    summary: 'Staff spending 6+ hours/week reporting same outcomes in multiple formats for different funders. Unified template in development. Highest-impact efficiency issue in the pilot.',
    status: 'in-progress',
  },
  {
    id: 'ac-2',
    title: 'Staffing Coverage Gaps',
    severity: 'high' as const,
    date: '2026-02-28',
    summary: 'Three staff covering five positions at peak times. Youth notice reduced attention. Staffing review meeting scheduled for March 14.',
    status: 'scheduled',
  },
  {
    id: 'ac-3',
    title: 'Cross-Site Youth Handoff',
    severity: 'medium' as const,
    date: '2026-03-01',
    summary: 'No documented protocol for youth transferring between Kalihi and Waianae. Two incidents of missing files in February. Protocol being drafted.',
    status: 'in-progress',
  },
  {
    id: 'ac-4',
    title: 'Exclusion from Decision-Making',
    severity: 'critical' as const,
    date: '2026-03-05',
    summary: 'Anonymous report of a pattern where certain staff are consistently excluded from decisions. Routed to ED for follow-up with Voice Steward.',
    status: 'under-review',
  },
];

export const DEMO_ARCHIVE_SOLUTIONS = [
  {
    id: 'as-1',
    title: '48-Hour Planning Cutoff',
    date: '2026-02-24',
    summary: 'No major session changes within 48 hours of delivery. Staff report improved session quality and reduced stress. Late changes dropped from 12 to 6 signals in one week.',
    impact: 'Late change signals reduced by 50%',
  },
  {
    id: 'as-2',
    title: 'Protected Coaching Blocks',
    date: '2026-02-26',
    summary: 'Coaching sessions marked as protected calendar events. Compliance tasks rescheduled to non-coaching windows. Coaching compliance rose from 58% to 68%.',
    impact: 'Coaching compliance +10 percentage points',
  },
  {
    id: 'as-3',
    title: 'Required Meeting Agendas',
    date: '2026-02-25',
    summary: 'All department and 1:1 meetings now require an agenda link and designated note owner. Meeting time reduced by ~35 minutes per week across both sites.',
    impact: 'Agenda completeness 71% → 82%',
  },
];

// ─── Synthesis Input Bundle ──────────────────────────────────

export const DEMO_SYNTHESIS_INPUT: SynthesisInput = {
  themes: DEMO_THEMES,
  beHeardSubmissions: DEMO_BE_HEARD,
  kpis: DEMO_KPIS,
  youSaidWeDid: DEMO_YOU_SAID_WE_DID,
  role: 'ed',
  existingActions: [],
};

// ─── Agency Documents (org-wide policies & procedures) ───────

export const DEMO_AGENCY_DOCUMENTS: AgencyDocument[] = [
  {
    category: 'policies',
    label: 'Policies & Procedures',
    fileName: 'HYFC_Policies_Procedures.pdf',
    uploadedAt: '2025-12-01T00:00:00.000Z',
    content: `HYFC POLICIES & PROCEDURES MANUAL (Excerpts)

SECTION 3: STAFF CONDUCT & EXPECTATIONS
3.1 All staff are expected to model positive youth development principles in every interaction.
3.2 Professional boundaries must be maintained with youth and families at all times.
3.3 Staff must complete 20 hours of professional development annually, including trauma-informed care.
3.4 Grievance procedures: staff may submit concerns through the Voice Steward, Be Heard system, or directly to HR. Retaliation for good-faith reporting is prohibited.

SECTION 5: PROGRAM OPERATIONS
5.1 Site hours: Kalihi and Waianae centers operate M-F 8:00am-6:00pm, Saturday 9:00am-2:00pm.
5.2 Staff-to-youth ratios must not exceed 1:8 for direct service programming.
5.3 All program changes must be finalized 48 hours before delivery (48-Hour Planning Cutoff Policy).
5.4 Cross-site youth transfers require a documented handoff including case file, service plan, and receiving supervisor acknowledgment.

SECTION 7: SUPERVISION & COACHING
7.1 All direct service staff receive weekly 1:1 supervision (minimum 45 minutes).
7.2 Coaching blocks are protected time and may not be displaced by administrative tasks.
7.3 Site supervisors provide monthly written feedback using the HYFC Growth Reflection template.`,
  },
  {
    category: 'compliance',
    label: 'Rules & Compliance',
    fileName: 'HYFC_Compliance_Guide.pdf',
    uploadedAt: '2025-12-01T00:00:00.000Z',
    content: `HYFC COMPLIANCE & REGULATORY GUIDE

FUNDER REQUIREMENTS
- State DHS Contract: Quarterly outcome reports due 15th of month following quarter end. Youth demographic data, service hours, and milestone tracking required.
- OYS Grant: Semi-annual narrative reports with youth voice quotes. Separate format from DHS. Annual site visit in Q2.
- COA Accreditation: Reaccreditation review scheduled for Q3 2026. Self-study due 60 days prior. Standards require documented evidence of staff training, client satisfaction, and continuous quality improvement.

DATA & PRIVACY
- Youth records are confidential under state and federal law. Access limited to assigned staff and supervisors.
- All staff complete FERPA and HIPAA awareness training within 30 days of hire.
- Electronic records must be stored in approved systems only. No youth data on personal devices.

INCIDENT REPORTING
- Critical incidents must be documented within 24 hours using the HYFC Incident Report form.
- State-reportable incidents must be communicated to the compliance officer within 4 hours.
- All incidents involving youth safety trigger mandatory supervisor review within 48 hours.`,
  },
  {
    category: 'mandated-reporting',
    label: 'Mandated Reporting',
    fileName: 'HYFC_Mandated_Reporting_Protocol.pdf',
    uploadedAt: '2025-12-01T00:00:00.000Z',
    content: `HYFC MANDATED REPORTING PROTOCOL

WHO IS A MANDATED REPORTER
All HYFC employees are mandated reporters under Hawaii Revised Statutes Chapter 350. This includes all direct service staff, supervisors, navigators, coordinators, and administrative personnel.

WHAT MUST BE REPORTED
You must report if you have reason to believe that a child (under 18) has been subjected to:
- Physical abuse or injury not reasonably explained
- Sexual abuse or exploitation
- Neglect (failure to provide food, shelter, supervision, medical care, or education)
- Emotional abuse (pattern of behavior that impairs emotional development)
- Threatened harm (credible threat of imminent abuse or neglect)

HOW TO REPORT
1. IMMEDIATELY notify your supervisor or the Voice Steward. Do NOT delay to investigate.
2. Call the Child Welfare Services hotline: (808) 832-5300 (O'ahu) within the same working day.
3. Complete the HYFC Internal Reporting Form within 24 hours of the oral report.
4. Cooperate fully with any subsequent investigation. Do not discuss the report with the family unless directed by CWS.

PROTECTION & CONFIDENTIALITY
- Good-faith reporters are protected from liability under HRS 350-3.
- The identity of the reporter is confidential and will not be disclosed except as required by law.
- Failure to report is a petty misdemeanor under HRS 350-1.2.
- If unsure whether something is reportable, REPORT IT. It is not your job to investigate or determine if abuse occurred.

SELF-HARM & IMMINENT DANGER
- If a youth expresses suicidal ideation or self-harm, follow the HYFC Crisis Response Protocol.
- Call 988 (Suicide & Crisis Lifeline) if there is immediate risk.
- Do not leave the youth unattended. Notify your supervisor immediately.`,
  },
  {
    category: 'survey-policy',
    label: 'Survey Policy',
    fileName: 'HYFC_Survey_Policy.pdf',
    uploadedAt: '2025-12-01T00:00:00.000Z',
    content: `HYFC SURVEY & FEEDBACK POLICY

PURPOSE
Surveys are a tool for organizational listening, not compliance checking. Staff surveys must be designed to surface real experiences, not just measurable outcomes.

CADENCE RULES
- Maximum 2 active staff surveys at any time across the organization.
- Minimum 14 days between the close of one survey and the launch of the next for the same audience group.
- No surveys may be launched during the first or last week of a fiscal quarter (reporting crunch periods).
- Blackout periods: December 20 - January 5 (holiday), and any week containing a mandatory all-staff event.

CONSENT & ANONYMITY
- All survey participation is voluntary. Staff may decline without consequence.
- Responses are anonymized before any leadership review. Individual attribution is never disclosed.
- Aggregated results (themes, not individual responses) may be shared in daily briefs and impact plans.
- Surveys collecting identifiable data (e.g., role, site) must disclose this clearly in the survey introduction.

QUESTION DESIGN STANDARDS
- Questions must be trauma-informed and culturally responsive.
- Avoid leading questions, double-barreled questions, or questions that assume a negative experience.
- Include at least one open-ended or reflective question in every survey.
- Maximum 15 questions per survey to reduce fatigue.
- Pulse surveys (1-3 questions) may be sent weekly; full surveys require the 14-day gap.

RESULTS & ACCOUNTABILITY
- Survey results must be communicated back to participants within 10 business days of survey close.
- At least one concrete action must be taken or planned based on survey findings within 30 days.
- The "You Said / We Did" framework is the standard for communicating survey-driven changes.`,
  },
  {
    category: 'background',
    label: 'Background / Reference',
    fileName: 'HYFC_Program_Guide.pdf',
    uploadedAt: '2025-12-01T00:00:00.000Z',
    content: `HYFC PROGRAM GUIDE & ORGANIZATIONAL REFERENCE

MISSION
Equip youth and families to build safety, belonging, and long-term opportunity.

ORGANIZATIONAL STRUCTURE
- Executive Director: Lauralani Reece
- Executive Vice President: Tank Jones
- Director of Programs: Leilani Tree
- 3 Sites: Kalihi, Waianae, Central (admin)
- 18 staff in Youth Leadership & Enrichment department (pilot group)

PROGRAM MODEL
HYFC uses a Positive Youth Development (PYD) framework emphasizing strengths-based engagement, youth voice, and family partnership. Programming includes:
- After-school enrichment (arts, STEM, cultural education)
- Family navigation and resource connection
- Youth leadership development and peer mentoring
- Community events and service projects

ROLE EXPECTATIONS (Summary)
- Executive Director: Strategic vision, board relations, funder relationships, organizational culture. Expected to visit each site at least quarterly.
- EVP: Operational oversight, cross-site coordination, policy implementation. Monthly site visits expected.
- Director of Programs: Program quality, staff development, curriculum alignment. Weekly presence at both program sites.
- Site Supervisors: Daily operations, direct supervision of YDS and navigators, incident response, coaching.
- Youth Development Specialists (YDS): Direct service delivery, youth relationship building, program facilitation, documentation.
- Family Navigators: Family engagement, resource referral, crisis support, community partnership.
- Data/Evaluation: Outcome tracking, funder reporting, quality improvement.
- Program Coordinators: Scheduling, logistics, event planning, cross-site communication.

KEY METRICS
- Youth retention rate (target: 80%)
- Family engagement score (target: 3.5/5)
- Staff satisfaction (target: 4/5)
- Coaching compliance (target: 85%)
- Funder reporting timeliness (target: 100%)`,
  },
];

// ─── Helper: Seed demo data into localStorage ───────────────

export function seedDemoData() {
  // Staff
  localStorage.setItem('fieldvoices-staff', JSON.stringify(DEMO_STAFF));

  // Leadership memo
  localStorage.setItem('fieldvoices-leadership-memo', JSON.stringify(DEMO_LEADERSHIP_MEMO));

  // Context notes
  localStorage.setItem('fieldvoices-context-notes', JSON.stringify(DEMO_CONTEXT_NOTES));

  // Impact plan action items
  localStorage.setItem('fieldvoices-impact-items', JSON.stringify(DEMO_IMPACT_ACTIONS));

  // Impact plan notes
  localStorage.setItem('fieldvoices-impact-notes', JSON.stringify(
    'Unified reporting template is the biggest lever right now, could recover 6 hrs/wk. Need to make sure Sera and Kana have bandwidth. Also: the exclusion concern (score 91) needs a thoughtful, private follow-up path. This is a trust moment.'
  ));

  // Personal notes
  localStorage.setItem('fieldvoices-personal-notes', JSON.stringify(
    'Garden event was special. Talk to Tina about scaling that model to Waianae. Also, the voice nudge format is working better than expected. Staff prefer 2-min voice over long forms. Consider making voice the default channel suggestion.'
  ));

  // Pre-compute synthesized actions from demo data
  try {
    const synthesized = synthesizeActions(DEMO_SYNTHESIS_INPUT);
    localStorage.setItem('fieldvoices-synthesized-actions', JSON.stringify(synthesized));
  } catch {
    // Synthesis failure shouldn't block demo seeding
  }

  // Agency documents
  localStorage.setItem('fieldvoices-agency-documents', JSON.stringify(DEMO_AGENCY_DOCUMENTS));

  // Demo mode flag
  localStorage.setItem('fieldvoices-demo-mode', JSON.stringify(true));
}

export function clearDemoData() {
  const allKeys = Object.keys(localStorage);
  allKeys.forEach((key) => {
    if (key.startsWith('fieldvoices-')) {
      localStorage.removeItem(key);
    }
  });
}

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return JSON.parse(localStorage.getItem('fieldvoices-demo-mode') || 'false');
  } catch {
    return false;
  }
}
