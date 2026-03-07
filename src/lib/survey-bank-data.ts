import { SurveyTemplate, QuestionBankItem, SurveyCategory } from './types';

// ─── Survey Templates ─────────────────────────────────────────

export const SURVEY_TEMPLATES: SurveyTemplate[] = [
  // Internal
  {
    id: 'tpl-staff-wellbeing',
    name: 'Staff Wellbeing Check-In',
    description: 'Assess overall staff morale, stress levels, and support needs. Best used quarterly.',
    category: 'internal',
    recommendedAudience: ['direct_service', 'program_team', 'site_supervisor'],
    frequencyGuidance: 'Quarterly — avoid survey fatigue while capturing seasonal patterns',
    bestPracticeNotes: 'Keep under 8 questions. Include at least one open-ended question. Share results within 2 weeks.',
    questions: [
      { id: 'sw-1', text: 'On a scale of 1-10, how supported do you feel in your current role?', type: 'scale', source: 'practice-center', included: true },
      { id: 'sw-2', text: 'What is one thing leadership could do to better support your work?', type: 'open', source: 'practice-center', included: true },
      { id: 'sw-3', text: 'Do you feel you have the resources you need to do your job effectively?', type: 'yes-no', source: 'practice-center', included: true },
      { id: 'sw-4', text: 'How would you rate your current stress level?', type: 'scale', source: 'practice-center', included: true },
      { id: 'sw-5', text: 'What would make your workday better?', type: 'open', source: 'practice-center', included: true },
    ],
  },
  {
    id: 'tpl-team-culture',
    name: 'Team Culture & Communication',
    description: 'Evaluate team dynamics, communication effectiveness, and psychological safety.',
    category: 'internal',
    recommendedAudience: ['direct_service', 'program_team', 'site_supervisor'],
    frequencyGuidance: 'Bi-annually — allows time for changes to take effect between surveys',
    bestPracticeNotes: 'Anonymous responses encourage honesty. Follow up with team discussions.',
    questions: [
      { id: 'tc-1', text: 'I feel comfortable sharing my honest opinions with my team.', type: 'scale', source: 'practice-center', included: true },
      { id: 'tc-2', text: 'How effectively does your team communicate about priorities and changes?', type: 'scale', source: 'practice-center', included: true },
      { id: 'tc-3', text: 'What is one thing that would improve communication in your team?', type: 'open', source: 'practice-center', included: true },
      { id: 'tc-4', text: 'Do you feel included in decisions that affect your work?', type: 'yes-no', source: 'practice-center', included: true },
    ],
  },
  {
    id: 'tpl-onboarding',
    name: 'New Hire Onboarding Feedback',
    description: 'Gather feedback from recent hires on their onboarding experience.',
    category: 'internal',
    recommendedAudience: ['direct_service', 'program_team'],
    frequencyGuidance: 'At 30, 60, and 90 days after start date',
    bestPracticeNotes: 'Send within the first week of each milestone. Keep it brief — 5 questions max.',
    questions: [
      { id: 'ob-1', text: 'How prepared do you feel to succeed in your role?', type: 'scale', source: 'practice-center', included: true },
      { id: 'ob-2', text: 'What information or support has been most helpful so far?', type: 'open', source: 'practice-center', included: true },
      { id: 'ob-3', text: 'Is there anything you wish you had known earlier?', type: 'open', source: 'practice-center', included: true },
    ],
  },

  // Program
  {
    id: 'tpl-program-satisfaction',
    name: 'Program Participant Satisfaction',
    description: 'Measure participant satisfaction with program services and identify improvement areas.',
    category: 'program',
    recommendedAudience: ['direct_service', 'site_supervisor'],
    frequencyGuidance: 'At program milestones (intake, midpoint, exit)',
    bestPracticeNotes: 'Use accessible language. Provide translation. Consider literacy levels. Offer voice response option.',
    questions: [
      { id: 'ps-1', text: 'Overall, how satisfied are you with the services you received?', type: 'scale', source: 'practice-center', included: true },
      { id: 'ps-2', text: 'Did the program meet your expectations?', type: 'yes-no', source: 'practice-center', included: true },
      { id: 'ps-3', text: 'What was most helpful about the program?', type: 'open', source: 'practice-center', included: true },
      { id: 'ps-4', text: 'What could we improve?', type: 'open', source: 'practice-center', included: true },
      { id: 'ps-5', text: 'Would you recommend this program to others?', type: 'yes-no', source: 'practice-center', included: true },
    ],
  },
  {
    id: 'tpl-program-outcomes',
    name: 'Program Outcomes Assessment',
    description: 'Track program outcomes and impact on participants over time.',
    category: 'program',
    recommendedAudience: ['site_supervisor', 'program_team'],
    frequencyGuidance: 'At intake and exit, with optional midpoint check-in',
    bestPracticeNotes: 'Pair with quantitative data. Ensure confidentiality is clearly communicated.',
    questions: [
      { id: 'po-1', text: 'How has your situation changed since starting the program?', type: 'open', source: 'practice-center', included: true },
      { id: 'po-2', text: 'Rate your confidence in managing [target area] independently.', type: 'scale', source: 'practice-center', included: true },
      { id: 'po-3', text: 'What skills or knowledge have you gained?', type: 'open', source: 'practice-center', included: true },
    ],
  },

  // Community
  {
    id: 'tpl-community-needs',
    name: 'Community Needs Assessment',
    description: 'Identify community needs, priorities, and gaps in services.',
    category: 'community',
    recommendedAudience: ['site_supervisor', 'program_team', 'direct_service'],
    frequencyGuidance: 'Annually — align with planning cycles and grant reporting',
    bestPracticeNotes: 'Co-design with community members. Use multiple languages. Offer in-person and digital options.',
    questions: [
      { id: 'cn-1', text: 'What are the most pressing needs in your community right now?', type: 'open', source: 'practice-center', included: true },
      { id: 'cn-2', text: 'How well are current services meeting community needs?', type: 'scale', source: 'practice-center', included: true },
      { id: 'cn-3', text: 'What services or programs are missing in your area?', type: 'open', source: 'practice-center', included: true },
      { id: 'cn-4', text: 'How do you prefer to receive information about available services?', type: 'multiple-choice', source: 'practice-center', included: true },
    ],
  },
  {
    id: 'tpl-stakeholder-feedback',
    name: 'Stakeholder Feedback',
    description: 'Gather feedback from partners, funders, and community stakeholders.',
    category: 'community',
    recommendedAudience: ['dop', 'evp', 'ed'],
    frequencyGuidance: 'Bi-annually or after major milestones',
    bestPracticeNotes: 'Keep concise for busy stakeholders. Share a summary of findings with respondents.',
    questions: [
      { id: 'sf-1', text: 'How would you rate our organization\'s communication with you?', type: 'scale', source: 'practice-center', included: true },
      { id: 'sf-2', text: 'What could we do to strengthen our partnership?', type: 'open', source: 'practice-center', included: true },
      { id: 'sf-3', text: 'How well does our work align with community needs?', type: 'scale', source: 'practice-center', included: true },
    ],
  },
];

// ─── Question Bank ─────────────────────────────────────────────

export const QUESTION_BANK: QuestionBankItem[] = [
  // Internal — Wellbeing
  { id: 'qb-1', text: 'On a scale of 1-10, how supported do you feel in your current role?', type: 'scale', topic: 'Wellbeing', category: 'internal', source: 'practice-center' },
  { id: 'qb-2', text: 'What is one thing leadership could do to better support your work?', type: 'open', topic: 'Wellbeing', category: 'internal', source: 'practice-center' },
  { id: 'qb-3', text: 'How would you rate your current stress level?', type: 'scale', topic: 'Wellbeing', category: 'internal', source: 'practice-center' },
  { id: 'qb-4', text: 'Do you have the resources you need to do your job effectively?', type: 'yes-no', topic: 'Resources', category: 'internal', source: 'practice-center' },
  { id: 'qb-5', text: 'What would make your workday better?', type: 'open', topic: 'Wellbeing', category: 'internal', source: 'practice-center' },

  // Internal — Culture
  { id: 'qb-6', text: 'I feel comfortable sharing my honest opinions with my team.', type: 'scale', topic: 'Culture', category: 'internal', source: 'practice-center' },
  { id: 'qb-7', text: 'How effectively does your team communicate about priorities?', type: 'scale', topic: 'Communication', category: 'internal', source: 'practice-center' },
  { id: 'qb-8', text: 'Do you feel included in decisions that affect your work?', type: 'yes-no', topic: 'Inclusion', category: 'internal', source: 'practice-center' },
  { id: 'qb-9', text: 'What is one thing that would improve communication in your team?', type: 'open', topic: 'Communication', category: 'internal', source: 'practice-center' },
  { id: 'qb-10', text: 'How valued do you feel as a team member?', type: 'scale', topic: 'Culture', category: 'internal', source: 'practice-center' },

  // Internal — Leadership
  { id: 'qb-11', text: 'My supervisor provides clear expectations for my work.', type: 'scale', topic: 'Leadership', category: 'internal', source: 'practice-center' },
  { id: 'qb-12', text: 'How often do you receive meaningful feedback?', type: 'multiple-choice', topic: 'Leadership', category: 'internal', source: 'practice-center' },
  { id: 'qb-13', text: 'What kind of professional development would help you most?', type: 'open', topic: 'Growth', category: 'internal', source: 'practice-center' },

  // Program
  { id: 'qb-14', text: 'Overall, how satisfied are you with the services you received?', type: 'scale', topic: 'Satisfaction', category: 'program', source: 'practice-center' },
  { id: 'qb-15', text: 'Did the program meet your expectations?', type: 'yes-no', topic: 'Satisfaction', category: 'program', source: 'practice-center' },
  { id: 'qb-16', text: 'What was most helpful about the program?', type: 'open', topic: 'Impact', category: 'program', source: 'practice-center' },
  { id: 'qb-17', text: 'What could we improve?', type: 'open', topic: 'Improvement', category: 'program', source: 'practice-center' },
  { id: 'qb-18', text: 'Would you recommend this program to others?', type: 'yes-no', topic: 'Satisfaction', category: 'program', source: 'practice-center' },
  { id: 'qb-19', text: 'How has your situation changed since starting the program?', type: 'open', topic: 'Outcomes', category: 'program', source: 'practice-center' },
  { id: 'qb-20', text: 'Rate your confidence in managing this area independently.', type: 'scale', topic: 'Outcomes', category: 'program', source: 'practice-center' },

  // Community
  { id: 'qb-21', text: 'What are the most pressing needs in your community right now?', type: 'open', topic: 'Needs', category: 'community', source: 'practice-center' },
  { id: 'qb-22', text: 'How well are current services meeting community needs?', type: 'scale', topic: 'Services', category: 'community', source: 'practice-center' },
  { id: 'qb-23', text: 'What services or programs are missing in your area?', type: 'open', topic: 'Gaps', category: 'community', source: 'practice-center' },
  { id: 'qb-24', text: 'How do you prefer to receive information about available services?', type: 'multiple-choice', topic: 'Communication', category: 'community', source: 'practice-center' },
  { id: 'qb-25', text: 'How safe do you feel in your community?', type: 'scale', topic: 'Safety', category: 'community', source: 'practice-center' },
  { id: 'qb-26', text: 'What barriers prevent you from accessing needed services?', type: 'open', topic: 'Access', category: 'community', source: 'practice-center' },
];

// ─── Helpers ──────────────────────────────────────────────────

export function getTemplatesByCategory(category: SurveyCategory): SurveyTemplate[] {
  return SURVEY_TEMPLATES.filter((t) => t.category === category);
}

export function getQuestionsByCategory(category: SurveyCategory): QuestionBankItem[] {
  return QUESTION_BANK.filter((q) => q.category === category);
}

export function getQuestionsByTopic(topic: string): QuestionBankItem[] {
  return QUESTION_BANK.filter((q) => q.topic.toLowerCase() === topic.toLowerCase());
}

export function getAllTopics(): string[] {
  return [...new Set(QUESTION_BANK.map((q) => q.topic))].sort();
}

export const CATEGORY_LABELS: Record<SurveyCategory, string> = {
  internal: 'Internal (Staff)',
  program: 'Program (Participants)',
  community: 'Community (Stakeholders)',
};
