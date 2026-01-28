/**
 * Campaign Loader Service
 * Loads and parses campaign configuration files
 */

import type {
  Campaign,
  ContentItem,
  AgentTask,
  RawCampaignConfig,
  ContentStatus,
  CampaignStatus
} from '../types';

// Campaign config file paths (relative to comms-blkout)
const CAMPAIGN_CONFIGS = [
  {
    path: '/apps/comms-blkout/campaign-content-board-recruitment-2026.json',
    id: 'board-recruitment-2026'
  },
  {
    path: '/apps/comms-blkout/campaign-content-10th-anniversary-2026.json',
    id: '10th-anniversary-2026'
  }
];

/**
 * Load campaign config from JSON file
 */
async function loadCampaignConfig(path: string): Promise<RawCampaignConfig | null> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.error(`Failed to load campaign config: ${path}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading campaign config: ${path}`, error);
    return null;
  }
}

/**
 * Determine campaign status based on dates
 */
function determineCampaignStatus(launchDate: Date, endDate: Date): CampaignStatus {
  const now = new Date();

  if (now < launchDate) {
    return 'draft';
  }
  if (now >= launchDate && now <= endDate) {
    return 'active';
  }
  return 'completed';
}

/**
 * Parse timing string to Date
 * Handles formats like "January 28th, 11:00 AM GMT" or "February 6th, 9:00 AM GMT"
 */
function parseTimingToDate(timing: string, year: number = 2026): Date | undefined {
  if (!timing) return undefined;

  try {
    // Extract month and day
    const monthMatch = timing.match(/(January|February|March|April|May|June|July|August|September|October|November|December)/i);
    const dayMatch = timing.match(/(\d{1,2})(st|nd|rd|th)/);
    const timeMatch = timing.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

    if (!monthMatch || !dayMatch) return undefined;

    const months: Record<string, number> = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };

    const month = months[monthMatch[1].toLowerCase()];
    const day = parseInt(dayMatch[1]);
    let hours = timeMatch ? parseInt(timeMatch[1]) : 9;
    const minutes = timeMatch ? parseInt(timeMatch[2]) : 0;
    const isPM = timeMatch && timeMatch[3].toUpperCase() === 'PM';

    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return new Date(year, month, day, hours, minutes);
  } catch {
    return undefined;
  }
}

/**
 * Determine content status based on available data
 */
function determineContentStatus(hasContent: boolean, hasAsset: boolean, scheduledFor?: Date): ContentStatus {
  if (scheduledFor && scheduledFor < new Date()) {
    return 'published';
  }
  if (scheduledFor) {
    return 'scheduled';
  }
  if (hasAsset) {
    return 'designed';
  }
  if (hasContent) {
    return 'drafted';
  }
  return 'idea';
}

/**
 * Extract content items from campaign config
 */
function extractContentItems(config: RawCampaignConfig, campaignId: string): ContentItem[] {
  const items: ContentItem[] = [];

  // Extract Instagram content
  if (config.social_media_content?.instagram?.post_1_announcement) {
    const post = config.social_media_content.instagram.post_1_announcement;
    const scheduledFor = parseTimingToDate(post.timing);
    items.push({
      id: `${campaignId}-instagram-carousel`,
      campaignId,
      type: 'social',
      platform: 'instagram',
      title: `Instagram Carousel (${post.slides} slides)`,
      status: determineContentStatus(!!post.caption, false, scheduledFor),
      scheduledFor,
      content: post.caption,
      timing: post.timing
    });
  }

  // Extract Instagram stories
  if (config.social_media_content?.instagram?.stories) {
    Object.entries(config.social_media_content.instagram.stories).forEach(([day, content]) => {
      items.push({
        id: `${campaignId}-instagram-story-${day}`,
        campaignId,
        type: 'story',
        platform: 'instagram',
        title: `Instagram Stories - ${day.replace('_', ' ')}`,
        status: 'drafted',
        content: Array.isArray(content) ? content.join('\n') : String(content)
      });
    });
  }

  // Extract Twitter content
  if (config.social_media_content?.twitter?.thread) {
    const thread = config.social_media_content.twitter.thread;
    const scheduledFor = parseTimingToDate(thread.timing);
    items.push({
      id: `${campaignId}-twitter-thread`,
      campaignId,
      type: 'social',
      platform: 'twitter',
      title: `Twitter Thread (${thread.tweets.length} tweets)`,
      status: determineContentStatus(!!thread.tweets.length, false, scheduledFor),
      scheduledFor,
      content: thread.tweets.join('\n\n---\n\n'),
      timing: thread.timing
    });
  }

  // Extract Twitter single posts
  if (config.social_media_content?.twitter?.single_posts) {
    config.social_media_content.twitter.single_posts.forEach((post, idx) => {
      const scheduledFor = parseTimingToDate(post.timing);
      items.push({
        id: `${campaignId}-twitter-post-${idx}`,
        campaignId,
        type: 'social',
        platform: 'twitter',
        title: `Twitter Post - ${post.timing.split(',')[0]}`,
        status: determineContentStatus(!!post.text, false, scheduledFor),
        scheduledFor,
        content: post.text,
        timing: post.timing
      });
    });
  }

  // Extract LinkedIn content
  if (config.social_media_content?.linkedin?.post) {
    const post = config.social_media_content.linkedin.post;
    const scheduledFor = parseTimingToDate(post.timing);
    items.push({
      id: `${campaignId}-linkedin-post`,
      campaignId,
      type: 'social',
      platform: 'linkedin',
      title: 'LinkedIn Post',
      status: determineContentStatus(!!post.content, false, scheduledFor),
      scheduledFor,
      content: post.content,
      timing: post.timing
    });
  }

  // Extract Newsletter content
  if (config.newsletter_content) {
    const newsletter = config.newsletter_content;
    items.push({
      id: `${campaignId}-newsletter`,
      campaignId,
      type: 'newsletter',
      platform: 'email',
      title: newsletter.subject_line || 'Campaign Newsletter',
      status: determineContentStatus(!!newsletter.body || !!newsletter.body_sections, false),
      content: newsletter.body ? JSON.stringify(newsletter.body) : undefined
    });
  }

  // Extract cross-platform strategy content (10th anniversary style)
  if (config.cross_platform_strategy) {
    const strategy = config.cross_platform_strategy;

    if (strategy.instagram?.post_1_carousel) {
      const carousel = strategy.instagram.post_1_carousel;
      const scheduledFor = parseTimingToDate(carousel.timing);
      items.push({
        id: `${campaignId}-strategy-instagram-carousel`,
        campaignId,
        type: 'social',
        platform: 'instagram',
        title: `Anniversary Carousel (${carousel.slides} slides)`,
        status: determineContentStatus(!!carousel.content?.length, false, scheduledFor),
        scheduledFor,
        content: carousel.content?.join('\n'),
        timing: carousel.timing
      });
    }

    if (strategy.instagram?.post_2_reel) {
      const reel = strategy.instagram.post_2_reel;
      const scheduledFor = parseTimingToDate(reel.timing);
      items.push({
        id: `${campaignId}-strategy-instagram-reel`,
        campaignId,
        type: 'video',
        platform: 'instagram',
        title: `Anniversary Reel (${reel.duration}s)`,
        status: determineContentStatus(!!reel.concept, false, scheduledFor),
        scheduledFor,
        content: reel.concept,
        timing: reel.timing
      });
    }

    if (strategy.twitter?.thread) {
      const thread = strategy.twitter.thread;
      const scheduledFor = parseTimingToDate(thread.timing);
      items.push({
        id: `${campaignId}-strategy-twitter-thread`,
        campaignId,
        type: 'social',
        platform: 'twitter',
        title: `Anniversary Thread (${thread.tweet_count} tweets)`,
        status: 'drafted',
        scheduledFor,
        content: thread.concept,
        timing: thread.timing
      });
    }

    if (strategy.email_newsletter) {
      const email = strategy.email_newsletter;
      const scheduledFor = parseTimingToDate(email.timing);
      items.push({
        id: `${campaignId}-strategy-email`,
        campaignId,
        type: 'newsletter',
        platform: 'email',
        title: 'Anniversary Newsletter',
        status: 'drafted',
        scheduledFor,
        timing: email.timing
      });
    }
  }

  // Add visual assets needed as graphic items
  if (config.visual_assets_needed) {
    config.visual_assets_needed.forEach((asset, idx) => {
      items.push({
        id: `${campaignId}-visual-${idx}`,
        campaignId,
        type: 'graphic',
        platform: 'website',
        title: asset,
        status: 'idea'
      });
    });
  }

  return items;
}

/**
 * Extract agent tasks from campaign config
 */
function extractAgentTasks(config: RawCampaignConfig): AgentTask[] {
  if (!config.agent_tasks) return [];

  return Object.entries(config.agent_tasks).map(([agentId, task]) => ({
    agentId,
    taskId: task.task_id || `${agentId}-task`,
    description: task.prompt || task.tasks?.join('; ') || '',
    status: 'pending' as const,
    priority: (task.priority as 'high' | 'medium' | 'low') || 'medium'
  }));
}

/**
 * Transform raw config to Campaign model
 */
function transformToCampaign(config: RawCampaignConfig, id: string): Campaign {
  const launchDate = new Date(config.campaign.launch_date);
  const endDate = new Date(config.campaign.end_date);

  return {
    id,
    name: config.campaign.name,
    slug: config.campaign.slug,
    tagline: config.campaign.tagline,
    launchDate,
    endDate,
    status: determineCampaignStatus(launchDate, endDate),
    voice: config.campaign.voice,
    contentItems: extractContentItems(config, id),
    agentTasks: extractAgentTasks(config),
    metrics: {
      targetReach: config.success_metrics?.reach?.social_media_impressions
        ? parseInt(config.success_metrics.reach.social_media_impressions.replace(/[^0-9]/g, ''))
        : undefined,
      applications: config.success_metrics?.applications
        ? {
            target: config.success_metrics.applications.target_total,
            current: 0
          }
        : undefined
    }
  };
}

/**
 * Load all campaigns
 */
export async function loadAllCampaigns(): Promise<Campaign[]> {
  const campaigns: Campaign[] = [];

  for (const configInfo of CAMPAIGN_CONFIGS) {
    const config = await loadCampaignConfig(configInfo.path);
    if (config) {
      campaigns.push(transformToCampaign(config, configInfo.id));
    }
  }

  // Sort by launch date (most recent first for active, soonest first for upcoming)
  return campaigns.sort((a, b) => b.launchDate.getTime() - a.launchDate.getTime());
}

/**
 * Load single campaign by ID
 */
export async function loadCampaignById(campaignId: string): Promise<Campaign | null> {
  const configInfo = CAMPAIGN_CONFIGS.find(c => c.id === campaignId);
  if (!configInfo) return null;

  const config = await loadCampaignConfig(configInfo.path);
  if (!config) return null;

  return transformToCampaign(config, campaignId);
}

/**
 * Get campaign summary statistics
 */
export function getCampaignSummary(campaign: Campaign) {
  const contentByStatus = campaign.contentItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const contentByPlatform = campaign.contentItems.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalItems = campaign.contentItems.length;
  const completedItems = (contentByStatus.published || 0) + (contentByStatus.scheduled || 0);
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    totalItems,
    completedItems,
    completionPercentage,
    contentByStatus,
    contentByPlatform,
    daysRemaining: Math.max(0, Math.ceil((campaign.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
    isActive: campaign.status === 'active'
  };
}

// Export for static loading (development/build time)
export { CAMPAIGN_CONFIGS };
