/**
 * FieldVoices Database Types
 *
 * These types map 1:1 to the Supabase schema defined in
 * supabase/migrations/001_schema.sql
 *
 * In production, regenerate with:
 *   npx supabase gen types typescript --project-id icuhkqhivbrnrhujbnrk > src/lib/supabase/types.ts
 */

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };

      profiles: {
        Row: {
          id: string;
          org_id: string | null;
          name: string;
          role: UserRole;
          department: string;
          email: string;
          preferred_locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          org_id?: string | null;
          name: string;
          role?: UserRole;
          department?: string;
          email: string;
          preferred_locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string | null;
          name?: string;
          role?: UserRole;
          department?: string;
          email?: string;
          preferred_locale?: string;
          updated_at?: string;
        };
      };

      campaigns: {
        Row: {
          id: string;
          org_id: string | null;
          intention: string;
          objective: string;
          audience: string[];
          statement_of_need: string;
          window_start: string;
          window_end: string;
          status: CampaignStatus;
          created_by: string | null;
          participant_count: number;
          response_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          intention: string;
          objective?: string;
          audience?: string[];
          statement_of_need?: string;
          window_start: string;
          window_end: string;
          status?: CampaignStatus;
          created_by?: string | null;
          participant_count?: number;
          response_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          intention?: string;
          objective?: string;
          audience?: string[];
          statement_of_need?: string;
          window_start?: string;
          window_end?: string;
          status?: CampaignStatus;
          participant_count?: number;
          response_count?: number;
          updated_at?: string;
        };
      };

      survey_questions: {
        Row: {
          id: string;
          campaign_id: string;
          text: string;
          type: QuestionType;
          source: QuestionSource;
          included: boolean;
          sort_order: number;
          context_trigger: string | null;
          design_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          text: string;
          type: QuestionType;
          source?: QuestionSource;
          included?: boolean;
          sort_order?: number;
          context_trigger?: string | null;
          design_note?: string | null;
          created_at?: string;
        };
        Update: {
          text?: string;
          type?: QuestionType;
          source?: QuestionSource;
          included?: boolean;
          sort_order?: number;
          context_trigger?: string | null;
          design_note?: string | null;
        };
      };

      survey_responses: {
        Row: {
          id: string;
          campaign_id: string;
          question_id: string;
          respondent_id: string | null;
          text_response: string | null;
          scale_response: number | null;
          boolean_response: boolean | null;
          choice_response: string[] | null;
          pulse_response: number | null;
          voice_url: string | null;
          voice_duration_seconds: number | null;
          follow_up_response: string | null;
          anything_else: string | null;
          method: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          question_id: string;
          respondent_id?: string | null;
          text_response?: string | null;
          scale_response?: number | null;
          boolean_response?: boolean | null;
          choice_response?: string[] | null;
          pulse_response?: number | null;
          voice_url?: string | null;
          voice_duration_seconds?: number | null;
          follow_up_response?: string | null;
          anything_else?: string | null;
          method?: string;
          created_at?: string;
        };
        Update: {
          text_response?: string | null;
          scale_response?: number | null;
          boolean_response?: boolean | null;
          choice_response?: string[] | null;
          pulse_response?: number | null;
          voice_url?: string | null;
          voice_duration_seconds?: number | null;
          follow_up_response?: string | null;
          anything_else?: string | null;
        };
      };

      be_heard_requests: {
        Row: {
          id: string;
          org_id: string | null;
          submitted_by: string | null;
          content: string;
          score: number;
          routed_to: UserRole;
          status: BeHeardStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          submitted_by?: string | null;
          content: string;
          score: number;
          routed_to?: UserRole;
          status?: BeHeardStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          score?: number;
          routed_to?: UserRole;
          status?: BeHeardStatus;
          updated_at?: string;
        };
      };

      be_heard_status_updates: {
        Row: {
          id: string;
          request_id: string;
          status: BeHeardUpdateStatus;
          note: string;
          action_type: BeHeardActionType | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          status: BeHeardUpdateStatus;
          note?: string;
          action_type?: BeHeardActionType | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          status?: BeHeardUpdateStatus;
          note?: string;
          action_type?: BeHeardActionType | null;
        };
      };

      daily_briefs: {
        Row: {
          id: string;
          campaign_id: string;
          org_id: string | null;
          date: string;
          themes: string[];
          regulation_alert: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          org_id?: string | null;
          date?: string;
          themes?: string[];
          regulation_alert?: boolean;
          created_at?: string;
        };
        Update: {
          themes?: string[];
          regulation_alert?: boolean;
        };
      };

      brief_actions: {
        Row: {
          id: string;
          brief_id: string;
          campaign_id: string | null;
          description: string;
          assigned_to: UserRole;
          assigned_to_user: string | null;
          due_date: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          brief_id: string;
          campaign_id?: string | null;
          description: string;
          assigned_to: UserRole;
          assigned_to_user?: string | null;
          due_date: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          description?: string;
          assigned_to?: UserRole;
          assigned_to_user?: string | null;
          due_date?: string;
          completed?: boolean;
          completed_at?: string | null;
        };
      };

      follow_up_jobs: {
        Row: {
          id: string;
          campaign_id: string;
          org_id: string | null;
          type: FollowUpType;
          trigger_date: string;
          status: FollowUpStatus;
          theme: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          org_id?: string | null;
          type: FollowUpType;
          trigger_date: string;
          status?: FollowUpStatus;
          theme?: string;
          created_at?: string;
        };
        Update: {
          type?: FollowUpType;
          trigger_date?: string;
          status?: FollowUpStatus;
          theme?: string;
        };
      };

      theme_aggregates: {
        Row: {
          id: string;
          org_id: string | null;
          theme: string;
          frequency: number;
          severity: ThemeSeverity;
          department: string;
          last_seen: string;
          campaign_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          theme: string;
          frequency?: number;
          severity?: ThemeSeverity;
          department?: string;
          last_seen?: string;
          campaign_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          theme?: string;
          frequency?: number;
          severity?: ThemeSeverity;
          department?: string;
          last_seen?: string;
          campaign_id?: string | null;
          updated_at?: string;
        };
      };

      you_said_we_did: {
        Row: {
          id: string;
          org_id: string | null;
          you_said: string;
          we_did: string;
          department: string;
          resolved_date: string;
          source: YouSaidSource;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          you_said: string;
          we_did: string;
          department?: string;
          resolved_date?: string;
          source?: YouSaidSource;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          you_said?: string;
          we_did?: string;
          department?: string;
          resolved_date?: string;
          source?: YouSaidSource;
        };
      };

      shout_outs: {
        Row: {
          id: string;
          org_id: string | null;
          from_role: UserRole;
          from_name: string;
          message: string;
          active: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          from_role: UserRole;
          from_name: string;
          message: string;
          active?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          from_role?: UserRole;
          from_name?: string;
          message?: string;
          active?: boolean;
        };
      };

      kpi_snapshots: {
        Row: {
          id: string;
          org_id: string | null;
          label: string;
          value: string;
          trend: KpiTrend;
          snapshot_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          label: string;
          value: string;
          trend?: KpiTrend;
          snapshot_date?: string;
          created_at?: string;
        };
        Update: {
          label?: string;
          value?: string;
          trend?: KpiTrend;
          snapshot_date?: string;
        };
      };

      context_triggers: {
        Row: {
          id: string;
          org_id: string | null;
          event: string;
          label: string;
          description: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          event: string;
          label: string;
          description?: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          event?: string;
          label?: string;
          description?: string;
          active?: boolean;
        };
      };
    };

    Views: {
      be_heard_anonymous: {
        Row: {
          id: string;
          org_id: string | null;
          content: string;
          score: number;
          routed_to: UserRole;
          status: BeHeardStatus;
          created_at: string;
          updated_at: string;
        };
      };
      survey_responses_anonymous: {
        Row: {
          id: string;
          campaign_id: string;
          question_id: string;
          text_response: string | null;
          scale_response: number | null;
          boolean_response: boolean | null;
          choice_response: string[] | null;
          pulse_response: number | null;
          follow_up_response: string | null;
          anything_else: string | null;
          method: string;
          created_at: string;
        };
      };
    };

    Enums: {
      user_role: UserRole;
      campaign_status: CampaignStatus;
      be_heard_status: BeHeardStatus;
      be_heard_update_status: BeHeardUpdateStatus;
      be_heard_action_type: BeHeardActionType;
      follow_up_type: FollowUpType;
      follow_up_status: FollowUpStatus;
      theme_severity: ThemeSeverity;
      question_type: QuestionType;
      question_source: QuestionSource;
      kpi_trend: KpiTrend;
      you_said_source: YouSaidSource;
    };
  };
};

// ── Enum Types ────────────────────────────────────────────────

export type UserRole = 'ed' | 'evp' | 'dop' | 'site_supervisor' | 'direct_service' | 'program_team' | 'voice_steward';
export type CampaignStatus = 'draft' | 'active' | 'completed' | 'paused';
export type BeHeardStatus = 'pending' | 'reviewed' | 'actioned' | 'escalated';
export type BeHeardUpdateStatus = 'received' | 'under-review' | 'action-planned' | 'resolved' | 'communicated';
export type BeHeardActionType = 'new-action' | 'communicate-existing' | 'training-needed';
export type FollowUpType = 'risk' | 'positive';
export type FollowUpStatus = 'pending' | 'sent' | 'completed';
export type ThemeSeverity = 'low' | 'medium' | 'high' | 'critical';
export type QuestionType = 'open' | 'scale' | 'multiple-choice' | 'yes-no' | 'pulse' | 'reflective' | 'contextual';
export type QuestionSource = 'ai-generated' | 'practice-center' | 'custom';
export type KpiTrend = 'up' | 'down' | 'stable';
export type YouSaidSource = 'be-heard' | 'fieldvoice' | 'leadership';

// ── Convenience Row Types ───────────────────────────────────

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type SurveyQuestion = Database['public']['Tables']['survey_questions']['Row'];
export type SurveyResponse = Database['public']['Tables']['survey_responses']['Row'];
export type BeHeardRequest = Database['public']['Tables']['be_heard_requests']['Row'];
export type BeHeardStatusUpdate = Database['public']['Tables']['be_heard_status_updates']['Row'];
export type DailyBrief = Database['public']['Tables']['daily_briefs']['Row'];
export type BriefAction = Database['public']['Tables']['brief_actions']['Row'];
export type FollowUpJob = Database['public']['Tables']['follow_up_jobs']['Row'];
export type ThemeAggregate = Database['public']['Tables']['theme_aggregates']['Row'];
export type YouSaidWeDid = Database['public']['Tables']['you_said_we_did']['Row'];
export type ShoutOut = Database['public']['Tables']['shout_outs']['Row'];
export type KpiSnapshot = Database['public']['Tables']['kpi_snapshots']['Row'];
