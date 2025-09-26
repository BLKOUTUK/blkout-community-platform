import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase client with proper data governance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Social Media Automation Configuration
const SOCIAL_WEBHOOK_SECRET = process.env.SOCIAL_WEBHOOK_SECRET;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Social-Source, X-Platform-Type',
};

// Social media platform interfaces
interface SocialMediaPost {
  platform: 'twitter' | 'instagram' | 'mastodon' | 'tiktok' | 'facebook';
  post_id: string;
  content: {
    text?: string;
    image_urls?: string[];
    video_urls?: string[];
    hashtags?: string[];
    mentions?: string[];
  };
  metadata: {
    author: {
      username: string;
      display_name?: string;
      follower_count?: number;
      verified?: boolean;
    };
    engagement: {
      likes?: number;
      shares?: number;
      comments?: number;
      views?: number;
    };
    posted_at: string;
    url: string;
    language?: string;
  };
  extraction_method: 'api' | 'webhook' | 'scraping';
  relevance_score?: number;
}

interface CommunityHashtagMonitoring {
  hashtags: string[];
  keywords: string[];
  accounts_to_monitor: string[];
  platforms: string[];
  filters: {
    min_engagement?: number;
    verified_only?: boolean;
    language?: string[];
    exclude_nsfw?: boolean;
  };
}

interface SocialMediaAnalysis {
  community_relevance: number; // 0-1 score
  liberation_alignment: number; // 0-1 score
  engagement_potential: number; // 0-1 score
  content_safety: {
    safe_for_community: boolean;
    trauma_informed: boolean;
    age_appropriate: boolean;
    flags: string[];
  };
  recommended_action: 'amplify' | 'moderate' | 'ignore' | 'flag';
  suggested_response?: string;
  cross_platform_potential: boolean;
}

// Liberation Values: Rate limiting for community protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 50; // Higher limit for social media due to volume

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const existing = rateLimitMap.get(ip);

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }

  existing.count++;
  return true;
}

// Community content analysis for social media posts
function analyzeSocialContent(post: SocialMediaPost): SocialMediaAnalysis {
  const content = post.content.text || '';
  const hashtags = post.content.hashtags || [];

  // Liberation keywords and themes
  const liberationKeywords = [
    'justice', 'equality', 'liberation', 'community', 'solidarity', 'mutual aid',
    'organizing', 'blacklivesmatter', 'lgbtq', 'queer', 'trans', 'indigenous',
    'disability rights', 'workers rights', 'climate justice', 'housing justice'
  ];

  const problematicContent = [
    'hate speech', 'discrimination', 'violence', 'harassment', 'misinformation',
    'conspiracy', 'extremist', 'racist', 'homophobic', 'transphobic'
  ];

  let liberationScore = 0;
  let safetyFlags: string[] = [];

  // Check for liberation themes
  const contentLower = content.toLowerCase();
  liberationKeywords.forEach(keyword => {
    if (contentLower.includes(keyword) || hashtags.some(tag => tag.toLowerCase().includes(keyword))) {
      liberationScore += 0.1;
    }
  });

  // Check for problematic content
  problematicContent.forEach(problem => {
    if (contentLower.includes(problem)) {
      safetyFlags.push(problem);
      liberationScore -= 0.2;
    }
  });

  // Engagement scoring
  const engagement = post.metadata.engagement;
  const engagementScore = Math.min(
    ((engagement.likes || 0) + (engagement.shares || 0) * 2 + (engagement.comments || 0) * 1.5) / 1000,
    1
  );

  // Community relevance based on content and engagement
  const relevanceScore = Math.min(
    (liberationScore + engagementScore + (post.relevance_score || 0)) / 3,
    1
  );

  // Determine recommended action
  let recommendedAction: 'amplify' | 'moderate' | 'ignore' | 'flag' = 'ignore';

  if (safetyFlags.length > 0) {
    recommendedAction = 'flag';
  } else if (liberationScore > 0.6 && engagementScore > 0.3) {
    recommendedAction = 'amplify';
  } else if (liberationScore > 0.3 || engagementScore > 0.5) {
    recommendedAction = 'moderate';
  }

  return {
    community_relevance: Math.max(0, Math.min(1, relevanceScore)),
    liberation_alignment: Math.max(0, Math.min(1, liberationScore)),
    engagement_potential: engagementScore,
    content_safety: {
      safe_for_community: safetyFlags.length === 0,
      trauma_informed: !contentLower.includes('violence') && !contentLower.includes('trauma'),
      age_appropriate: !contentLower.includes('nsfw') && !contentLower.includes('explicit'),
      flags: safetyFlags
    },
    recommended_action: recommendedAction,
    cross_platform_potential: liberationScore > 0.5 && engagementScore > 0.4
  };
}

// Check for duplicate social media posts
async function checkSocialDuplicates(post: SocialMediaPost): Promise<{ isDuplicate: boolean; similarPosts: any[] }> {
  try {
    // Check for exact post ID matches
    const { data: idMatches, error: idError } = await supabase
      .from('moderation_log')
      .select('*')
      .eq('metadata->>post_id', post.post_id)
      .eq('metadata->>platform', post.platform)
      .limit(3);

    if (idError) {
      console.error('❌ Social media duplicate check failed:', idError);
      return { isDuplicate: false, similarPosts: [] };
    }

    if (idMatches && idMatches.length > 0) {
      return { isDuplicate: true, similarPosts: idMatches };
    }

    // Check for similar content (first 50 characters)
    if (post.content.text && post.content.text.length > 20) {
      const textSnippet = post.content.text.substring(0, 50);

      const { data: contentMatches, error: contentError } = await supabase
        .from('moderation_log')
        .select('*')
        .ilike('metadata->>text', `%${textSnippet}%`)
        .eq('content_table', 'social_media')
        .limit(3);

      if (contentError) {
        console.error('❌ Content duplicate check failed:', contentError);
        return { isDuplicate: false, similarPosts: [] };
      }

      if (contentMatches && contentMatches.length > 0) {
        return { isDuplicate: true, similarPosts: contentMatches };
      }
    }

    return { isDuplicate: false, similarPosts: [] };
  } catch (error) {
    console.error('❌ Social media duplicate check error:', error);
    return { isDuplicate: false, similarPosts: [] };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).json({ message: 'OK' });
  }

  // Add CORS headers to all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Liberation Values: Rate limiting for community protection
  const clientIP = req.headers['x-forwarded-for']?.toString() || req.headers['x-real-ip']?.toString() || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded for social media automation',
      liberation_message: 'Rate limiting protects community resources while ensuring fair access'
    });
  }

  // Webhook authentication
  const signature = req.headers['x-social-signature'] || req.headers.authorization;
  const socialSource = req.headers['x-social-source'];

  if (SOCIAL_WEBHOOK_SECRET && signature !== `Bearer ${SOCIAL_WEBHOOK_SECRET}`) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized social media webhook request',
      liberation_message: 'Authentication protects community data and prevents spam'
    });
  }

  const { method, url } = req;
  const urlPath = url?.split('?')[0];

  try {
    switch (method) {
      case 'POST':
        if (urlPath === '/api/webhooks/social-media' || urlPath === '/api/webhooks/social-media/ingest') {
          // Social Media Content Ingestion
          const postData: SocialMediaPost = req.body;

          if (!postData.platform || !postData.post_id || !postData.content) {
            return res.status(400).json({
              success: false,
              error: 'Missing required fields: platform, post_id, content'
            });
          }

          console.log(`📱 Social media webhook: ${postData.platform} post ${postData.post_id}`);

          // Check for duplicates
          const { isDuplicate, similarPosts } = await checkSocialDuplicates(postData);

          if (isDuplicate) {
            console.log(`♻️  Duplicate social media post: ${postData.platform}/${postData.post_id}`);
            return res.status(200).json({
              success: true,
              message: 'Duplicate social media post detected - not processed',
              duplicate: true,
              similar_posts: similarPosts.map(p => ({
                id: p.id,
                platform: p.metadata?.platform,
                post_id: p.metadata?.post_id
              }))
            });
          }

          // Analyze content for community relevance
          const analysis = analyzeSocialContent(postData);

          // Determine if content should be processed based on liberation values
          const shouldProcess = analysis.community_relevance > 0.3 &&
                               analysis.content_safety.safe_for_community &&
                               analysis.recommended_action !== 'ignore';

          if (!shouldProcess) {
            console.log(`⏭️  Social media post filtered out: low relevance or safety concerns`);
            return res.status(200).json({
              success: true,
              message: 'Social media post filtered - does not meet community standards',
              filtered: true,
              reason: analysis.recommended_action === 'flag' ? 'safety_concerns' : 'low_relevance',
              analysis: {
                community_relevance: analysis.community_relevance,
                recommended_action: analysis.recommended_action,
                safety_flags: analysis.content_safety.flags
              }
            });
          }

          // Create moderation log entry
          const contentId = randomUUID();
          const submission = {
            content_id: contentId,
            content_table: 'social_media',
            action: analysis.recommended_action === 'amplify' ? 'social-amplify' : 'social-moderate',
            moderator_id: 'social-automation',
            reason: `${postData.platform} post: ${analysis.recommended_action} (relevance: ${analysis.community_relevance.toFixed(2)})`,
            metadata: {
              ...postData.content,
              post_id: postData.post_id,
              platform: postData.platform,
              original_url: postData.metadata.url,
              author: postData.metadata.author,
              engagement: postData.metadata.engagement,
              posted_at: postData.metadata.posted_at,
              social_analysis: analysis,
              extraction_method: postData.extraction_method,
              liberation_compliance: {
                community_aligned: analysis.liberation_alignment > 0.5,
                trauma_informed: analysis.content_safety.trauma_informed,
                safe_for_community: analysis.content_safety.safe_for_community,
                engagement_worthy: analysis.engagement_potential > 0.3
              },
              submissionTime: new Date().toISOString(),
              social_source: socialSource || 'unknown'
            }
          };

          const { data: insertedData, error } = await supabase
            .from('moderation_log')
            .insert([submission])
            .select()
            .single();

          if (error) {
            console.error('❌ Social media database error:', error);
            return res.status(500).json({ success: false, error: error.message });
          }

          console.log(`✅ Social media content processed: ${analysis.recommended_action}`, {
            id: insertedData?.id,
            platform: postData.platform,
            relevance: analysis.community_relevance,
            action: analysis.recommended_action
          });

          return res.status(201).json({
            success: true,
            message: `Social media content ${analysis.recommended_action}`,
            submissionId: insertedData?.id,
            platform: postData.platform,
            recommended_action: analysis.recommended_action,
            analysis: {
              community_relevance: analysis.community_relevance,
              liberation_alignment: analysis.liberation_alignment,
              engagement_potential: analysis.engagement_potential,
              cross_platform_potential: analysis.cross_platform_potential
            },
            liberation_message: analysis.recommended_action === 'amplify'
              ? 'Content amplifies liberation values and community engagement'
              : 'Content submitted for community review and potential amplification'
          });
        }

        if (urlPath === '/api/webhooks/social-media/hashtag-monitor') {
          // Hashtag and keyword monitoring configuration
          const monitoringConfig: CommunityHashtagMonitoring = req.body;

          if (!monitoringConfig.hashtags || !monitoringConfig.platforms) {
            return res.status(400).json({
              success: false,
              error: 'Missing required fields: hashtags, platforms'
            });
          }

          console.log(`👀 Social media monitoring configured: ${monitoringConfig.hashtags.length} hashtags, ${monitoringConfig.platforms.length} platforms`);

          // Store monitoring configuration
          const configId = randomUUID();
          const monitoringEntry = {
            content_id: configId,
            content_table: 'social_monitoring',
            action: 'monitoring-active',
            moderator_id: 'social-automation',
            reason: `Social media monitoring: ${monitoringConfig.hashtags.join(', ')}`,
            metadata: {
              ...monitoringConfig,
              configured_at: new Date().toISOString(),
              status: 'active'
            }
          };

          const { data: insertedConfig, error } = await supabase
            .from('moderation_log')
            .insert([monitoringEntry])
            .select()
            .single();

          if (error) {
            console.error('❌ Social monitoring config error:', error);
            return res.status(500).json({ success: false, error: error.message });
          }

          return res.status(201).json({
            success: true,
            message: 'Social media monitoring configured',
            config_id: insertedConfig?.id,
            monitoring: {
              hashtags: monitoringConfig.hashtags,
              platforms: monitoringConfig.platforms,
              accounts: monitoringConfig.accounts_to_monitor?.length || 0,
              keywords: monitoringConfig.keywords?.length || 0
            },
            liberation_message: 'Social media monitoring serves community awareness and engagement'
          });
        }

        return res.status(404).json({ success: false, error: 'Social media webhook endpoint not found' });

      case 'GET':
        if (urlPath === '/api/webhooks/social-media/health') {
          // Health check with social media integration status
          return res.status(200).json({
            success: true,
            service: 'Social Media Automation',
            status: 'operational',
            integrations: {
              twitter: TWITTER_BEARER_TOKEN ? 'configured' : 'missing',
              instagram: INSTAGRAM_ACCESS_TOKEN ? 'configured' : 'missing',
              mastodon: MASTODON_ACCESS_TOKEN ? 'configured' : 'missing'
            },
            database: supabaseUrl ? 'connected' : 'disconnected',
            liberation_message: 'Social media automation operational - amplifying community voices'
          });
        }

        if (urlPath === '/api/webhooks/social-media/stats') {
          // Social media automation statistics
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - 7); // Last 7 days

          const { data: socialPosts, error } = await supabase
            .from('moderation_log')
            .select('*')
            .eq('content_table', 'social_media')
            .gte('timestamp', cutoffDate.toISOString());

          if (error) {
            return res.status(500).json({ success: false, error: error.message });
          }

          const stats = {
            total_posts: socialPosts?.length || 0,
            amplified: socialPosts?.filter(p => p.action === 'social-amplify').length || 0,
            moderated: socialPosts?.filter(p => p.action === 'social-moderate').length || 0,
            flagged: socialPosts?.filter(p => p.metadata?.social_analysis?.recommended_action === 'flag').length || 0,
            platforms: {} as Record<string, number>
          };

          socialPosts?.forEach(post => {
            const platform = post.metadata?.platform || 'unknown';
            stats.platforms[platform] = (stats.platforms[platform] || 0) + 1;
          });

          return res.status(200).json({
            success: true,
            timeframe: '7 days',
            stats,
            liberation_message: 'Social media statistics enable community oversight of automation'
          });
        }

        return res.status(404).json({ success: false, error: 'Endpoint not found' });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
          liberation_message: 'Only POST and GET requests supported for social media automation'
        });
    }
  } catch (error) {
    console.error('❌ Social media webhook error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      liberation_message: 'Technical difficulties with social media automation - community will address'
    });
  }
}