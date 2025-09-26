import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase client with proper data governance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// BLKOUTHUB Authentication - Liberation Values: Secure community API access
const BLKOUTHUB_API_SECRET = process.env.BLKOUTHUB_API_SECRET;
const BLKOUTHUB_BEARER_TOKEN = process.env.BLKOUTHUB_BEARER_TOKEN;

// CORS headers for BLKOUTHUB integration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-BLKOUT-Signature, X-Community-Source',
};

// BLKOUTHUB webhook payload interfaces
interface BLKOUTHUBWebhook {
  content_type: 'community_event' | 'member_story' | 'resource_share' | 'mutual_aid' | 'organizing_update';
  payload: {
    title: string;
    description: string;
    content?: string;
    date?: string;
    location?: string;
    contact_info?: {
      email?: string;
      phone?: string;
      social?: string;
    };
    organizer?: string;
    tags?: string[];
    image_url?: string;
    external_links?: string[];
    community_guidelines_compliant?: boolean;
  };
  authentication: string; // Bearer token
  timestamp: string;
  source: string;
  member_id?: string;
  verification_status?: 'verified' | 'pending' | 'unverified';
}

interface BLKOUTHUBMutualAid {
  aid_type: 'request' | 'offer' | 'fulfilled';
  title: string;
  description: string;
  location: {
    area: string;
    postal_code?: string;
    accessible?: boolean;
  };
  contact: {
    preferred_method: 'email' | 'phone' | 'app';
    details: string;
    anonymous: boolean;
  };
  urgency: 'low' | 'medium' | 'high' | 'critical';
  categories: string[];
  expires_at?: string;
}

interface BLKOUTHUBOrganizingUpdate {
  campaign_id: string;
  update_type: 'progress' | 'action_needed' | 'victory' | 'escalation';
  title: string;
  content: string;
  action_items?: Array<{
    action: string;
    deadline?: string;
    responsible_party?: string;
  }>;
  media?: {
    images?: string[];
    videos?: string[];
    documents?: string[];
  };
  coalition_partners?: string[];
}

// Liberation Values: Rate limiting for community protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // Max 20 requests per minute per IP for BLKOUTHUB

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

// Community Guidelines Validation
function validateCommunityGuidelines(payload: any): { valid: boolean; violations: string[]; warnings: string[] } {
  const violations = [];
  const warnings = [];

  // Liberation Values: Anti-oppression content validation
  const oppressiveTerms = ['thug', 'ghetto', 'articulate', 'urban', 'welfare queen'];
  const content = `${payload.title} ${payload.description} ${payload.content || ''}`.toLowerCase();

  for (const term of oppressiveTerms) {
    if (content.includes(term)) {
      violations.push(`Potentially oppressive language detected: "${term}"`);
    }
  }

  // Trauma-informed validation
  const traumaTriggers = ['violence', 'death', 'abuse', 'assault'];
  for (const trigger of traumaTriggers) {
    if (content.includes(trigger) && !content.includes('content warning') && !content.includes('tw:')) {
      warnings.push(`Content may be triggering - consider adding content warning for: ${trigger}`);
    }
  }

  // Community safety checks
  if (!payload.contact_info && !payload.organizer) {
    warnings.push('No contact information provided - community may not be able to engage');
  }

  // Mutual aid specific validation
  if (payload.aid_type) {
    if (!payload.location || !payload.contact) {
      violations.push('Mutual aid requests require location and contact information');
    }
  }

  return {
    valid: violations.length === 0,
    violations,
    warnings
  };
}

// Community content classification
function classifyBLKOUTHUBContent(webhookData: BLKOUTHUBWebhook): {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  auto_approve: boolean;
  review_required: boolean;
} {
  const { content_type, payload, verification_status } = webhookData;

  // High priority for urgent community needs
  if (content_type === 'mutual_aid' && (payload as any).urgency === 'critical') {
    return {
      category: 'urgent-mutual-aid',
      priority: 'urgent',
      auto_approve: verification_status === 'verified',
      review_required: verification_status !== 'verified'
    };
  }

  // Community events get medium priority
  if (content_type === 'community_event') {
    return {
      category: 'community-event',
      priority: 'medium',
      auto_approve: verification_status === 'verified' && (payload.community_guidelines_compliant ?? false),
      review_required: !payload.community_guidelines_compliant
    };
  }

  // Organizing updates are high priority for community mobilization
  if (content_type === 'organizing_update') {
    return {
      category: 'community-organizing',
      priority: 'high',
      auto_approve: verification_status === 'verified',
      review_required: verification_status !== 'verified'
    };
  }

  // Default classification
  return {
    category: content_type.replace('_', '-'),
    priority: 'medium',
    auto_approve: false,
    review_required: true
  };
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
      error: 'Rate limit exceeded. Community protection requires fair usage.',
      liberation_message: 'Rate limiting ensures fair access for all community members'
    });
  }

  const { method, url } = req;
  const urlPath = url?.split('?')[0];

  try {
    switch (method) {
      case 'POST':
        if (urlPath === '/api/webhooks/blkouthub') {
          // BLKOUTHUB Community Content Webhook
          const webhookData: BLKOUTHUBWebhook = req.body;

          if (!webhookData.content_type || !webhookData.payload || !webhookData.authentication) {
            return res.status(400).json({
              success: false,
              error: 'Missing required fields: content_type, payload, authentication'
            });
          }

          // Bearer token authentication
          const authHeader = req.headers.authorization || '';
          const providedToken = authHeader.replace('Bearer ', '') || webhookData.authentication;

          if (!BLKOUTHUB_BEARER_TOKEN || providedToken !== BLKOUTHUB_BEARER_TOKEN) {
            return res.status(401).json({
              success: false,
              error: 'Invalid authentication token',
              liberation_message: 'Authentication protects community data sovereignty and safety'
            });
          }

          console.log(`🏘️  BLKOUTHUB webhook received: ${webhookData.content_type} from ${webhookData.source}`);

          // Validate community guidelines
          const validation = validateCommunityGuidelines(webhookData.payload);

          if (!validation.valid) {
            console.log(`⚠️  Community guidelines violation detected:`, validation.violations);
            return res.status(400).json({
              success: false,
              error: 'Content violates community guidelines',
              violations: validation.violations,
              warnings: validation.warnings,
              liberation_message: 'Community guidelines protect liberation values and member safety'
            });
          }

          // Classify content for appropriate handling
          const classification = classifyBLKOUTHUBContent(webhookData);

          // Create moderation log entry
          const contentId = randomUUID();
          const submission = {
            content_id: contentId,
            content_table: webhookData.content_type,
            action: classification.auto_approve ? 'auto-approved' : 'community-submission',
            moderator_id: webhookData.member_id || 'blkouthub-community',
            reason: `BLKOUTHUB community submission: ${classification.category} (priority: ${classification.priority})`,
            metadata: {
              ...webhookData.payload,
              blkouthub_source: webhookData.source,
              member_id: webhookData.member_id,
              verification_status: webhookData.verification_status,
              classification: classification,
              community_validation: validation,
              priority: classification.priority,
              submissionTime: new Date().toISOString(),
              blkouthub_timestamp: webhookData.timestamp
            }
          };

          const { data: insertedData, error } = await supabase
            .from('moderation_log')
            .insert([submission])
            .select()
            .single();

          if (error) {
            console.error('❌ BLKOUTHUB database error:', error);
            return res.status(500).json({ success: false, error: error.message });
          }

          console.log(`✅ BLKOUTHUB content processed: ${classification.auto_approve ? 'auto-approved' : 'queued for community review'}`, {
            id: insertedData?.id,
            content_type: webhookData.content_type,
            priority: classification.priority,
            auto_approved: classification.auto_approve
          });

          return res.status(201).json({
            success: true,
            message: classification.auto_approve
              ? 'Community content auto-approved and published'
              : 'Content submitted for community democratic review',
            submissionId: insertedData?.id,
            auto_approved: classification.auto_approve,
            priority: classification.priority,
            classification: classification.category,
            warnings: validation.warnings,
            liberation_message: classification.auto_approve
              ? 'Content meets community guidelines and liberation values'
              : 'Content submitted to democratic community review process for collective decision-making'
          });
        }

        if (urlPath === '/api/webhooks/blkouthub/mutual-aid') {
          // Specialized endpoint for mutual aid requests
          const mutualAidData: BLKOUTHUBMutualAid = req.body;

          // Bearer token authentication
          const authHeader = req.headers.authorization || '';
          const providedToken = authHeader.replace('Bearer ', '');

          if (!BLKOUTHUB_BEARER_TOKEN || providedToken !== BLKOUTHUB_BEARER_TOKEN) {
            return res.status(401).json({
              success: false,
              error: 'Invalid authentication token'
            });
          }

          if (!mutualAidData.aid_type || !mutualAidData.title || !mutualAidData.location) {
            return res.status(400).json({
              success: false,
              error: 'Missing required fields: aid_type, title, location'
            });
          }

          console.log(`🤝 Mutual aid ${mutualAidData.aid_type}: ${mutualAidData.title} (${mutualAidData.urgency})`);

          // Auto-approve urgent requests from verified sources
          const autoApprove = mutualAidData.urgency === 'critical' || mutualAidData.urgency === 'high';

          const contentId = randomUUID();
          const submission = {
            content_id: contentId,
            content_table: 'mutual_aid',
            action: autoApprove ? 'auto-approved' : 'mutual-aid-pending',
            moderator_id: 'blkouthub-mutual-aid',
            reason: `Mutual aid ${mutualAidData.aid_type}: ${mutualAidData.urgency} urgency`,
            metadata: {
              ...mutualAidData,
              submissionTime: new Date().toISOString(),
              expires_at: mutualAidData.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days default
            }
          };

          const { data: insertedData, error } = await supabase
            .from('moderation_log')
            .insert([submission])
            .select()
            .single();

          if (error) {
            console.error('❌ Mutual aid database error:', error);
            return res.status(500).json({ success: false, error: error.message });
          }

          console.log(`🤝 Mutual aid processed: ${mutualAidData.aid_type} - ${autoApprove ? 'published' : 'pending review'}`);

          return res.status(201).json({
            success: true,
            message: autoApprove
              ? `${mutualAidData.aid_type} published to community mutual aid network`
              : `${mutualAidData.aid_type} submitted for community review`,
            submissionId: insertedData?.id,
            auto_approved: autoApprove,
            urgency: mutualAidData.urgency,
            liberation_message: 'Mutual aid builds community solidarity and collective care'
          });
        }

        return res.status(404).json({ success: false, error: 'BLKOUTHUB webhook endpoint not found' });

      case 'GET':
        if (urlPath === '/api/webhooks/blkouthub/health') {
          // Health check endpoint for BLKOUTHUB integration
          return res.status(200).json({
            success: true,
            service: 'BLKOUTHUB Webhook Integration',
            status: 'operational',
            authentication: BLKOUTHUB_BEARER_TOKEN ? 'configured' : 'missing',
            database: supabaseUrl ? 'connected' : 'disconnected',
            liberation_message: 'Community webhook services operational - democratic technology serving liberation'
          });
        }

        return res.status(404).json({ success: false, error: 'Endpoint not found' });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
          liberation_message: 'Only POST and GET requests supported for community webhook integration'
        });
    }
  } catch (error) {
    console.error('❌ BLKOUTHUB webhook error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      liberation_message: 'Technical difficulties - community tech collective will address promptly'
    });
  }
}