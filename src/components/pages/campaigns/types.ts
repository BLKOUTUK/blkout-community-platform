/**
 * Campaign Dashboard Type Definitions
 */

export type CampaignTab = 'overview' | 'content' | 'schedule' | 'pipeline' | 'automation';

export type CampaignStatus = 'draft' | 'active' | 'completed' | 'archived';

export type ContentStatus = 'idea' | 'drafted' | 'designed' | 'approved' | 'scheduled' | 'published';

export type ContentType = 'social' | 'newsletter' | 'video' | 'graphic' | 'article' | 'story';

export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'email' | 'hub' | 'website';

export type PipelineCheckStatus = 'passing' | 'warning' | 'failing' | 'unknown';

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  launchDate: Date;
  endDate: Date;
  status: CampaignStatus;
  contentItems: ContentItem[];
  metrics: CampaignMetrics;
  agentTasks: AgentTask[];
  voice?: string;
}

export interface ContentItem {
  id: string;
  campaignId: string;
  type: ContentType;
  platform: Platform;
  title: string;
  status: ContentStatus;
  scheduledFor?: Date;
  publishedAt?: Date;
  assetUrl?: string;
  content?: string;
  timing?: string;
}

export interface CampaignMetrics {
  targetReach?: number;
  targetEngagement?: string;
  applications?: {
    target: number;
    current?: number;
  };
  registrations?: {
    target: number;
    current?: number;
  };
}

export interface AgentTask {
  agentId: string;
  taskId: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export interface PipelineCheck {
  id: string;
  name: string;
  description: string;
  status: PipelineCheckStatus;
  lastChecked: Date;
  details?: string;
  campaignId?: string;
}

export interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  handler: () => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

export interface CampaignDashboardState {
  activeTab: CampaignTab;
  isLoading: boolean;
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  pipelineChecks: PipelineCheck[];
  lastCheck: Date | null;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  platform: Platform;
  campaignId: string;
  contentItemId: string;
  status: ContentStatus;
  allDay?: boolean;
}

// Raw campaign config types (matching JSON structure)
export interface RawCampaignConfig {
  campaign: {
    name: string;
    slug: string;
    launch_date: string;
    end_date: string;
    tagline: string;
    mission?: string;
    voice?: string;
    signature_phrases?: string[];
  };
  social_media_content?: {
    instagram?: {
      post_1_announcement?: {
        type: string;
        slides: number;
        timing: string;
        content: Array<{ slide: number; text: string }>;
        caption: string;
        hashtags: string[];
      };
      stories?: Record<string, string[]>;
    };
    twitter?: {
      thread?: {
        timing: string;
        tweets: string[];
      };
      single_posts?: Array<{
        timing: string;
        text: string;
      }>;
    };
    linkedin?: {
      post?: {
        timing: string;
        content: string;
      };
    };
  };
  cross_platform_strategy?: {
    campaign_phases?: Record<string, {
      dates: string;
      theme: string;
      content: string[];
    }>;
    email_newsletter?: {
      timing: string;
      segment?: string;
    };
    instagram?: {
      post_1_carousel?: {
        type: string;
        timing: string;
        slides: number;
        content: string[];
      };
      post_2_reel?: {
        type: string;
        timing: string;
        duration: number;
        concept: string;
      };
    };
    twitter?: {
      thread?: {
        timing: string;
        tweet_count: number;
        concept: string;
      };
    };
  };
  newsletter_content?: {
    subject_line: string;
    preheader?: string;
    body?: Record<string, string>;
    opening?: Record<string, string>;
    body_sections?: Array<{
      section: string;
      content: string;
    }>;
  };
  agent_tasks?: Record<string, {
    task_id?: string;
    prompt?: string;
    tasks?: string[];
    target_platform?: string;
    priority?: string;
  }>;
  success_metrics?: {
    applications?: {
      target_total: number;
      target_per_position?: number;
    };
    reach?: {
      social_media_impressions?: string;
    };
    email_newsletter?: {
      target_open_rate?: string;
    };
    social_media?: {
      instagram_reach?: string;
    };
    event?: {
      total_reach?: string;
    };
    platform_adoption?: {
      critical_frequency_beta_signups?: string;
    };
  };
  visual_assets_needed?: string[];
  timeline?: Record<string, {
    dates: string;
    focus: string;
    activities: string[];
  }>;
}
