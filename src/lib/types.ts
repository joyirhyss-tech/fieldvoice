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
