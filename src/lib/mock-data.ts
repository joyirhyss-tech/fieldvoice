import {
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
} from './types';

export const mockProfile: Profile = {
  id: 'p-1',
  name: 'Dana Morales',
  role: 'dop',
  department: 'Youth Services',
  email: 'dana.morales@org.example',
};

export const mockCampaigns: Campaign[] = [
  {
    id: 'c-1',
    intention: 'Understand frontline burnout signals before summer surge',
    objective: 'Identify top 3 stressors and generate actionable support plan',
    audience: ['Field Staff', 'Site Supervisors'],
    windowStart: '2026-02-15',
    windowEnd: '2026-03-01',
    status: 'completed',
    createdBy: 'p-1',
    createdAt: '2026-02-10',
    participantCount: 24,
    responseCount: 19,
  },
  {
    id: 'c-2',
    intention: 'Check in on new onboarding experience',
    objective: 'Find gaps in first-60-day support for new hires',
    audience: ['Field Staff'],
    windowStart: '2026-03-01',
    windowEnd: '2026-03-15',
    status: 'active',
    createdBy: 'p-1',
    createdAt: '2026-02-25',
    participantCount: 12,
    responseCount: 7,
  },
];

export const mockBeHeardRequests: BeHeardRequest[] = [
  {
    id: 'bh-1',
    submittedBy: 'Staff Member',
    content: 'We keep losing supplies mid-week and nobody tracks restocking.',
    score: 42,
    routedTo: 'evp',
    status: 'pending',
    createdAt: '2026-03-04',
  },
  {
    id: 'bh-2',
    submittedBy: 'Staff Member',
    content: 'Youth are reporting feeling unsafe at the bus stop after program.',
    score: 88,
    routedTo: 'ed',
    status: 'reviewed',
    createdAt: '2026-03-03',
  },
  {
    id: 'bh-3',
    submittedBy: 'Staff Member',
    content: 'The morning briefing format is really working. Can we keep it?',
    score: 15,
    routedTo: 'dop',
    status: 'actioned',
    createdAt: '2026-03-02',
  },
];

export const mockDailyBrief: DailyBrief = {
  id: 'db-1',
  campaignId: 'c-2',
  date: '2026-03-06',
  themes: [
    'Onboarding documentation is outdated',
    'Mentorship pairing requests unmet',
    'Positive feedback on weekly check-ins',
  ],
  actions: [
    {
      id: 'a-1',
      description: 'Update onboarding packet with current site contacts and schedules',
      assignedTo: 'dop',
      dueDate: '2026-03-10',
      completed: false,
    },
    {
      id: 'a-2',
      description: 'Launch mentor match round for March cohort',
      assignedTo: 'program_team',
      dueDate: '2026-03-12',
      completed: false,
    },
    {
      id: 'a-3',
      description: 'Share weekly check-in format as template across sites',
      assignedTo: 'site_supervisor',
      dueDate: '2026-03-08',
      completed: true,
    },
  ],
  regulationAlert: false,
};

export const mockThemes: ThemeAggregate[] = [
  {
    id: 't-1',
    theme: 'Outdated onboarding materials',
    frequency: 8,
    severity: 'medium',
    department: 'Youth Services',
    lastSeen: '2026-03-05',
  },
  {
    id: 't-2',
    theme: 'Mentor pairing gaps',
    frequency: 6,
    severity: 'medium',
    department: 'Youth Services',
    lastSeen: '2026-03-04',
  },
  {
    id: 't-3',
    theme: 'Positive: weekly check-in format',
    frequency: 11,
    severity: 'low',
    department: 'Youth Services',
    lastSeen: '2026-03-06',
  },
  {
    id: 't-4',
    theme: 'Supply restocking delays',
    frequency: 5,
    severity: 'high',
    department: 'Operations',
    lastSeen: '2026-03-04',
  },
];

export const mockFollowUps: FollowUpJob[] = [
  {
    id: 'fu-1',
    campaignId: 'c-1',
    type: 'risk',
    triggerDate: '2026-03-17',
    status: 'pending',
    theme: 'Burnout signals in field staff',
  },
  {
    id: 'fu-2',
    campaignId: 'c-1',
    type: 'positive',
    triggerDate: '2026-03-17',
    status: 'pending',
    theme: 'Team bonding activities well-received',
  },
];

export const mockKPIs: KPISnapshot[] = [
  { label: 'Response rate this cycle', value: '58%', trend: 'up' },
  { label: 'Open concerns', value: '4', trend: 'down' },
  { label: 'Actions completed this week', value: '7 of 9', trend: 'up' },
  { label: 'Avg. days to first action', value: '2.3', trend: 'stable' },
  { label: 'Follow-ups due soon', value: '2', trend: 'stable' },
  { label: 'Themes surfaced this month', value: '12', trend: 'up' },
];

export const mockSurveyQuestions: SurveyQuestion[] = [
  // Scale questions
  {
    id: 'sq-1',
    text: 'On a scale of 1-10, how supported do you feel in your first 60 days?',
    type: 'scale',
    source: 'ai-generated',
    included: true,
    designNote: 'Warmth-centered: asks about felt support, not satisfaction metrics',
  },
  // Open response
  {
    id: 'sq-2',
    text: 'What is one thing about your onboarding experience that could be improved?',
    type: 'open',
    source: 'ai-generated',
    included: true,
  },
  // Reflective prompt — deeper, emotionally intelligent question
  {
    id: 'sq-3',
    text: 'Think about a moment during your first weeks where you felt truly welcomed. What made that moment matter?',
    type: 'reflective',
    source: 'practice-center',
    included: true,
    designNote: 'Reflective prompts invite storytelling. They surface belonging and culture insights no checkbox can capture.',
  },
  // Multiple choice
  {
    id: 'sq-4',
    text: 'Which of the following resources did you find most useful? (Select all that apply)',
    type: 'multiple-choice',
    source: 'ai-generated',
    included: true,
  },
  // Yes / No
  {
    id: 'sq-5',
    text: 'Were you paired with a mentor during your onboarding?',
    type: 'yes-no',
    source: 'ai-generated',
    included: true,
  },
  // Pulse prompt — quick emotional check-in
  {
    id: 'sq-6',
    text: 'Right now, how are you feeling about your role here?',
    type: 'pulse',
    source: 'practice-center',
    included: true,
    designNote: 'Pulse prompts are brief emotional temperature checks. They honor the person behind the data.',
  },
  // Contextual prompt — triggered by an event
  {
    id: 'sq-7',
    text: 'After your team meeting today, did you feel your contributions were heard and valued?',
    type: 'contextual',
    source: 'practice-center',
    included: false,
    contextTrigger: 'post-meeting',
    designNote: 'Contextual questions arrive at the right moment — after a meeting, a training, or an incident — so the reflection feels natural, not interrogatory.',
  },
  // Another contextual
  {
    id: 'sq-8',
    text: 'You completed your first solo shift. What would have helped you feel more prepared?',
    type: 'contextual',
    source: 'practice-center',
    included: false,
    contextTrigger: 'first-solo-shift',
    designNote: 'Event-based nudge: sent automatically when the milestone is reached. Feels like a thoughtful check-in, not surveillance.',
  },
  // Open — leadership visibility
  {
    id: 'sq-9',
    text: 'Is there anything you would like leadership to know about your experience so far?',
    type: 'open',
    source: 'ai-generated',
    included: true,
  },
  // Scale — excluded by default
  {
    id: 'sq-10',
    text: 'Do you feel you have the tools and information needed to do your job effectively?',
    type: 'scale',
    source: 'ai-generated',
    included: false,
  },
];

/** Mock context triggers available for contextual question nudges */
export const mockContextTriggers = [
  { id: 'ctx-1', event: 'post-meeting', label: 'After a team meeting', description: 'Sent within 2 hours of a scheduled team meeting' },
  { id: 'ctx-2', event: 'first-solo-shift', label: 'After first solo shift', description: 'Triggered when staff completes their first unaccompanied shift' },
  { id: 'ctx-3', event: 'post-training', label: 'After a training session', description: 'Sent the evening after a training or professional development event' },
  { id: 'ctx-4', event: 'weekly-pulse', label: 'Weekly pulse check', description: 'Brief emotional check-in sent each Friday afternoon' },
  { id: 'ctx-5', event: 'incident-follow-up', label: 'After an incident report', description: 'Sent 24 hours after an incident to check on staff wellbeing' },
  { id: 'ctx-6', event: 'milestone-30-day', label: '30-day milestone', description: 'Reflection prompt at the 30-day mark in role' },
];

/** Mock data for live FieldVoices status across the agency */
export const mockLiveStatus = {
  activeFieldVoices: 2,
  totalParticipants: 36,
  totalResponses: 19,
  campaigns: [
    { id: 'c-2', title: 'Onboarding Experience Check-In', participants: 12, responses: 7, daysLeft: 9 },
    { id: 'c-3', title: 'Q1 Staff Wellness Pulse', participants: 24, responses: 12, daysLeft: 14 },
  ],
};

/** Mock personal participation status — survey invites for this user */
export const mockMyParticipation = {
  activeSurveys: 1,
  pendingQuestions: 3,
  lastResponseDate: '2026-03-05',
  currentSurvey: {
    id: 'c-2',
    title: 'Onboarding Experience Check-In',
    ownerNote: 'We really want to hear how your first weeks have been. Your honest thoughts will shape how we welcome future teammates.',
    ownerName: 'Dana Morales',
    ownerRole: 'Director of Programs' as const,
    questionsAnswered: 2,
    questionsTotal: 5,
    dueDate: '2026-03-15',
    windowStart: '2026-03-01',
    windowEnd: '2026-03-15',
    accepted: false,
  },
};

/** Mock leadership shout-outs — positive messages from ED, EVP, DOP only */
export const mockShoutOuts = [
  { id: 'so-1', from: 'ED', name: 'Maria Chen', message: 'Huge shout-out to Site 3 for redesigning the morning check-in — youth attendance is up 22% this month!' },
  { id: 'so-2', from: 'EVP', name: 'James Powell', message: 'The onboarding packet updates are live. Thank you to everyone who shared feedback — your voice made this happen.' },
  { id: 'so-3', from: 'DOP', name: 'Dana Morales', message: 'Mentor match round is full! Every new hire now has a mentor within their first week. This is what listening looks like.' },
  { id: 'so-4', from: 'ED', name: 'Maria Chen', message: 'We heard the supply concerns loud and clear — new restocking schedule starts Monday. You said it, we did it.' },
  { id: 'so-5', from: 'EVP', name: 'James Powell', message: 'Friday check-ins are now agency-wide! Thank you to Site Supervisors who piloted this — your teams made it better for everyone.' },
  { id: 'so-6', from: 'DOP', name: 'Dana Morales', message: 'Three staff members shared ideas that are now in our strategic plan. Your voice is literally shaping where we go next.' },
];

export const mockDepartments = [
  'Youth Services',
  'Family Support',
  'Operations',
  'Community Outreach',
  'Administration',
];

export const mockAudienceGroups = [
  'Field Staff',
  'Site Supervisors',
  'Program Team',
  'Program Managers',
  'All Departments',
];

/** You Said / We Did — functional accountability data */
export const mockYouSaidWeDid: YouSaidWeDid[] = [
  {
    id: 'yswd-1',
    youSaid: 'Onboarding docs are outdated',
    weDid: 'Packet updated with current site contacts and schedules',
    department: 'Youth Services',
    resolvedDate: '2026-03-04',
    source: 'fieldvoice',
  },
  {
    id: 'yswd-2',
    youSaid: 'Supply restocking is unreliable mid-week',
    weDid: 'New restocking schedule starts Monday — you said it, we did it',
    department: 'Operations',
    resolvedDate: '2026-03-05',
    source: 'be-heard',
  },
  {
    id: 'yswd-3',
    youSaid: 'Mentor pairing requests are going unmet',
    weDid: 'Mentor match round is full — every new hire has a mentor within their first week',
    department: 'Youth Services',
    resolvedDate: '2026-03-03',
    source: 'fieldvoice',
  },
  {
    id: 'yswd-4',
    youSaid: 'Weekly check-in format is really working',
    weDid: 'Friday check-ins are now agency-wide! Site Supervisors who piloted this made it better for everyone',
    department: 'All Departments',
    resolvedDate: '2026-03-01',
    source: 'leadership',
  },
];

/** Be Heard status tracking — feedback loop for submitters */
export const mockBeHeardStatuses: BeHeardStatusUpdate[] = [
  {
    id: 'bhs-1',
    requestId: 'bh-1',
    status: 'under-review',
    note: 'Your concern about supply restocking has been reviewed by the EVP. An action is being planned.',
    updatedAt: '2026-03-05',
    actionType: 'communicate-existing',
  },
  {
    id: 'bhs-2',
    requestId: 'bh-2',
    status: 'action-planned',
    note: 'Youth safety at the bus stop is being addressed. A meeting with transportation partners is scheduled for March 10.',
    updatedAt: '2026-03-04',
    actionType: 'new-action',
  },
  {
    id: 'bhs-3',
    requestId: 'bh-3',
    status: 'communicated',
    note: 'Great news! The morning briefing format has been shared as a template across all sites. Thank you for highlighting what works.',
    updatedAt: '2026-03-03',
    actionType: 'communicate-existing',
  },
];

/** Escalation route labels for score-based routing */
export const ESCALATION_ROUTES = {
  '0-39': { label: 'Director of Programs', role: 'dop' as const, priority: 'standard' },
  '40-69': { label: 'EVP', role: 'evp' as const, priority: 'elevated' },
  '70-89': { label: 'Executive Director', role: 'ed' as const, priority: 'high' },
  '90+': { label: 'Voice Steward + ED', role: 'voice_steward' as const, priority: 'critical' },
} as const;
