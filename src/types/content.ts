/**
 * BLKOUT Community Platform - Content Type Definitions
 * Integrated from comms-blkout module for published content display
 */

export type PlatformType = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'tiktok' | 'youtube';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type AgentType = 'griot' | 'listener' | 'weaver' | 'strategist';

export interface EngagementMetrics {
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  views?: number;
  reach?: number;
  impressions?: number;
  engagementRate?: number;
  conversationDepth?: number; // BLKOUT-specific: quality of community interaction
  relationshipScore?: number; // BLKOUT-specific: trust-building metric
}

export interface Content {
  id: string;
  title: string;
  body: string;
  contentType: 'post' | 'story' | 'video' | 'article' | 'thread';
  status: ContentStatus;
  platforms: PlatformType[];
  scheduledFor?: Date | string;
  publishedAt?: Date | string;
  agentId?: string;
  agentType?: AgentType;
  mediaUrls?: string[];
  hashtags?: string[];
  mentions?: string[];
  engagementMetrics?: EngagementMetrics;
  metadata?: Record<string, unknown>;
  createdAt: Date | string;
  updatedAt: Date | string;
}
