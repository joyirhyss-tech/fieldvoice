export type UserRole =
  | 'ed'
  | 'evp'
  | 'dop'
  | 'site_supervisor'
  | 'direct_service'
  | 'program_team'
  | 'voice_steward';

export interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  canRequest: boolean;
  canBeHeard: boolean;
  canViewAggregate: boolean;
}

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  email: string;
}

export interface Campaign {
  id: string;
  intention: string;
  objective: string;
  audience: string[];
  windowStart: string;
  windowEnd: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  createdBy: string;
  createdAt: string;
  participantCount: number;
  responseCount: number;
}

export interface BeHeardRequest {
  id: string;
  submittedBy: string;
  content: string;
  score: number;
  routedTo: UserRole;
  status: 'pending' | 'reviewed' | 'actioned' | 'escalated';
  createdAt: string;
}

export interface DailyBrief {
  id: string;
  campaignId: string;
  date: string;
  themes: string[];
  actions: BriefAction[];
  regulationAlert: boolean;
}

export interface BriefAction {
  id: string;
  description: string;
  assignedTo: UserRole;
  dueDate: string;
  completed: boolean;
}

export interface FollowUpJob {
  id: string;
  campaignId: string;
  type: 'risk' | 'positive';
  triggerDate: string;
  status: 'pending' | 'sent' | 'completed';
  theme: string;
}

export interface ThemeAggregate {
  id: string;
  theme: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  department: string;
  lastSeen: string;
}

export interface KPISnapshot {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

export type QuestionType =
  | 'open'
  | 'scale'
  | 'multiple-choice'
  | 'yes-no'
  | 'pulse'
  | 'reflective'
  | 'contextual';

export interface SurveyQuestion {
  id: string;
  text: string;
  type: QuestionType;
  source: 'ai-generated' | 'practice-center' | 'custom';
  included: boolean;
  /** For contextual questions — the event or condition that triggers this prompt */
  contextTrigger?: string;
  /** Guidance note for the question designer */
  designNote?: string;
}

export interface CampaignDraft {
  intention: string;
  objective: string;
  audience: string[];
  windowStart: string;
  windowEnd: string;
  statementOfNeed: string;
  questions: SurveyQuestion[];
}

export type WorkspaceView =
  | 'home'
  | 'request-fieldvoice'
  | 'be-heard'
  | 'survey-response'
  | 'survey-invite'
  | 'my-impact-plan'
  | 'your-contributions'
  | 'survey-bank'
  | 'intention'
  | 'audience'
  | 'review'
  | 'push'
  | 'daily-brief'
  | 'archive'
  | 'workplan';

export type ArchiveView = 'voices' | 'concerns' | 'solutions';

export interface ChecklistItem {
  key: string;
  label: string;
  done: boolean;
}

/** You Said / We Did — functional accountability loop */
export interface YouSaidWeDid {
  id: string;
  youSaid: string;
  weDid: string;
  department: string;
  resolvedDate: string;
  source: 'be-heard' | 'fieldvoice' | 'leadership';
}

/** Be Heard status tracking — visible to submitters for feedback loop */
export interface BeHeardStatusUpdate {
  id: string;
  requestId: string;
  status: 'received' | 'under-review' | 'action-planned' | 'resolved' | 'communicated';
  note: string;
  updatedAt: string;
  /** When an issue was already resolved but not communicated */
  actionType?: 'new-action' | 'communicate-existing' | 'training-needed';
}

/** Staff document (JD, resume, etc.) */
export interface StaffDocument {
  label: string;
  fileName: string;
}

/** Agency-level document category — maps to SetupPanel upload slots */
export type AgencyDocCategory =
  | 'policies'
  | 'compliance'
  | 'mandated-reporting'
  | 'survey-policy'
  | 'background';

/** Agency-level document (org-wide policies, procedures, etc.) */
export interface AgencyDocument {
  category: AgencyDocCategory;
  label: string;
  fileName: string;
  content: string;
  uploadedAt: string;
}

/** Survey cadence preference — how often a user wants nudge prompts */
export type SurveyCadence = 'daily' | 'alt-days' | 'twice-weekly' | 'weekly';

/** Staff member — real person in the organization */
export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  accessCode: string;
  pin?: string;                  // 4-digit PIN (replaces accessCode for auth)
  surveyCadence?: SurveyCadence; // preferred nudge frequency
  photoUrl?: string;
  documents: StaffDocument[];
  createdAt: string;
}

/** Logged-in user session */
export interface LoggedInUser {
  staffId: string;
  name: string;
  role: UserRole;
  sessionCreatedAt: string;      // ISO timestamp for session freshness
}

/** Leadership note (memo, voicenote, video) */
export interface LeadershipNote {
  id: string;
  memo: string;
  voiceUrl?: string;
  videoUrl?: string;
  createdBy: string;
  createdAt: string;
}

/** Survey template for the Survey Bank */
export type SurveyCategory = 'internal' | 'program' | 'community';

export interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  category: SurveyCategory;
  recommendedAudience: string[];
  frequencyGuidance: string;
  bestPracticeNotes: string;
  questions: SurveyQuestion[];
}

/** Individual question in the Question Bank */
export interface QuestionBankItem {
  id: string;
  text: string;
  type: QuestionType;
  topic: string;
  category: SurveyCategory;
  source: 'practice-center' | 'custom';
}

/** Nudge — a scheduled prompt delivered to survey participants */
export interface Nudge {
  id: string;
  surveyId: string;
  questionId: string;
  deliveredAt: string;
  completedAt: string | null;
  dismissed: boolean;
}

// ─── Synthesis Engine Types ───────────────────────────────

/** Priority levels for synthesized action items */
export type ActionPriority = 'urgent' | 'high' | 'medium' | 'low';

/** Category buckets for organizing actions */
export type ActionCategory = 'operations' | 'culture' | 'staffing' | 'compliance' | 'communication';

/** A synthesized action item generated from survey data */
export interface SynthesizedAction {
  id: string;
  description: string;
  priority: ActionPriority;
  category: ActionCategory;
  suggestedTimeline: string;
  sourceThemeIds: string[];
  sourceBeHeardIds: string[];
  rationale: string;
  completed: boolean;
  completedAt: string | null;
}

/** Input bundle for the synthesis engine */
export interface SynthesisInput {
  themes: ThemeAggregate[];
  beHeardSubmissions: BeHeardRequest[];
  kpis: KPISnapshot[];
  youSaidWeDid: YouSaidWeDid[];
  role: UserRole;
  existingActions: string[];
}

// ─── Agenda System Types ──────────────────────────────────

/** The four meeting types available in the agenda system */
export type MeetingType = 'all-staff' | 'team' | 'one-on-one' | 'org-wide';

/** A section within a meeting agenda */
export interface AgendaSection {
  title: string;
  durationMinutes: number;
  items: string[];
  type: 'discussion' | 'action-review' | 'accountability' | 'check-in' | 'strategic';
}

/** A fully rendered meeting agenda */
export interface MeetingAgenda {
  meetingType: MeetingType;
  title: string;
  generatedAt: string;
  preparedBy: string;
  sections: AgendaSection[];
}

/** Configuration for a meeting type including role access */
export interface MeetingTypeConfig {
  type: MeetingType;
  label: string;
  description: string;
  allowedRoles: UserRole[];
}

// ─── Survey Distribution Types ──────────────────────────

/** A survey that has been pushed and is available for distribution */
export interface PushedSurvey {
  id: string;
  draft: CampaignDraft;
  shareCode: string;             // 6-char alphanumeric code
  shareUrl: string;              // constructed share URL
  pushedAt: string;
  pushedBy: string;
  status: 'active' | 'completed' | 'paused';
}
