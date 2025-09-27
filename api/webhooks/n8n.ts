import type { VercelRequest, VercelResponse } from '@vercel/node';

// N8N Authentication - Liberation Values: Secure but transparent
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;
const IVOR_API_URL = process.env.IVOR_API_URL || 'https://ivor-api.blkout.org';
const IVOR_API_KEY = process.env.IVOR_API_KEY;

// CORS headers for N8N integration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-N8N-Signature, X-Liberation-Source',
};

// Content classification interface for IVOR AI
interface IVORAnalysis {
  content_relevance: number; // 0-1 score
  community_alignment: number; // liberation values score
  safety_assessment: {
    trauma_informed: boolean;
    community_safe: boolean;
    cultural_appropriate: boolean;
    anti_oppression: boolean;
    flags: string[];
  };
  suggested_tags: string[];
  category_recommendation: string;
  sentiment_analysis: {
    overall_sentiment: string;
    liberation_aligned: boolean;
    community_empowering: boolean;
  };
  quality_score: number;
  duplicate_check: {
    is_duplicate: boolean;
    similarity_score: number;
    similar_content_ids: string[];
  };
}

// N8N webhook payload interfaces
interface N8NContentWebhook {
  content_type: 'event' | 'news' | 'story' | 'resource';
  source_url: string;
  extracted_data: {
    title: string;
    description: string;
    content: string;
    date?: string;
    location?: string;
    tags?: string[];
    author?: string;
    image_url?: string;
  };
  classification: {
    category: string;
    confidence: number;
    tags: string[];
  };
  automation_source: string;
  timestamp: string;
  workflow_id?: string;
}

interface N8NResearchWebhook {
  search_query: string;
  results: Array<{
    title: string;
    url: string;
    description: string;
    relevance_score: number;
    source: string;
  }>;
  timestamp: string;
  source: string;
}

// Liberation Values: Rate limiting to prevent abuse while maintaining accessibility
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // Max 30 requests per minute per IP

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

// IVOR AI Integration for content analysis
async function analyzeWithIVOR(content: any): Promise<IVORAnalysis> {
  if (!IVOR_API_KEY || !IVOR_API_URL) {
    console.warn('⚠️  IVOR AI integration not configured, using fallback analysis');
    return {
      content_relevance: 0.7,
      community_alignment: 0.8,
      safety_assessment: {
        trauma_informed: true,
        community_safe: true,
        cultural_appropriate: true,
        anti_oppression: true,
        flags: []
      },
      suggested_tags: ['automated-submission'],
      category_recommendation: content.content_type || 'general',
      sentiment_analysis: {
        overall_sentiment: 'neutral',
        liberation_aligned: true,
        community_empowering: true
      },
      quality_score: 0.7,
      duplicate_check: {
        is_duplicate: false,
        similarity_score: 0,
        similar_content_ids: []
      }
    };
  }

  try {
    const response = await fetch(`${IVOR_API_URL}/analyze/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${IVOR_API_KEY}`,
        'X-Liberation-Source': 'n8n-automation'
      },
      body: JSON.stringify({
        title: content.extracted_data?.title,
        content: content.extracted_data?.content || content.extracted_data?.description,
        url: content.source_url,
        content_type: content.content_type,
        source: content.automation_source
      })
    });

    if (!response.ok) {
      throw new Error(`IVOR API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ IVOR AI analysis failed:', error);
    // Liberation Values: Fail gracefully rather than blocking content
    return {
      content_relevance: 0.5,
      community_alignment: 0.6,
      safety_assessment: {
        trauma_informed: false,
        community_safe: false,
        cultural_appropriate: false,
        anti_oppression: false,
        flags: ['analysis-failed']
      },
      suggested_tags: ['needs-manual-review'],
      category_recommendation: 'unclassified',
      sentiment_analysis: {
        overall_sentiment: 'unknown',
        liberation_aligned: false,
        community_empowering: false
      },
      quality_score: 0.3,
      duplicate_check: {
        is_duplicate: false,
        similarity_score: 0,
        similar_content_ids: []
      }
    };
  }
}

// Deduplication check against existing content
async function checkForDuplicates(content: N8NContentWebhook): Promise<{ isDuplicate: boolean; similarContent: any[] }> {
  try {
    // Check for exact URL matches first
    const { data: urlMatches, error: urlError } = await supabase
      .from('moderation_log')
      .select('*')
      .eq('metadata->>url', content.source_url)
      .limit(5);

    if (urlError) {
      console.error('❌ URL duplicate check failed:', urlError);
      return { isDuplicate: false, similarContent: [] };
    }

    if (urlMatches && urlMatches.length > 0) {
      return { isDuplicate: true, similarContent: urlMatches };
    }

    // Check for title similarity (basic text matching)
    if (content.extracted_data?.title) {
      const { data: titleMatches, error: titleError } = await supabase
        .from('moderation_log')
        .select('*')
        .ilike('metadata->>title', `%${content.extracted_data.title.substring(0, 20)}%`)
        .limit(5);

      if (titleError) {
        console.error('❌ Title duplicate check failed:', titleError);
        return { isDuplicate: false, similarContent: [] };
      }

      if (titleMatches && titleMatches.length > 0) {
        return { isDuplicate: true, similarContent: titleMatches };
      }
    }

    return { isDuplicate: false, similarContent: [] };
  } catch (error) {
    console.error('❌ Duplicate check failed:', error);
    return { isDuplicate: false, similarContent: [] };
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

  // Liberation Values: Rate limiting for security while maintaining accessibility
  const clientIP = req.headers['x-forwarded-for']?.toString() || req.headers['x-real-ip']?.toString() || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Liberation values require fair access - please try again in a minute.',
      liberation_message: 'Rate limiting protects our community resources while ensuring fair access for all.'
    });
  }

  // Webhook authentication check
  const signature = req.headers['x-n8n-signature'];
  const liberationSource = req.headers['x-liberation-source'];

  if (N8N_WEBHOOK_SECRET && signature !== N8N_WEBHOOK_SECRET) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized webhook request',
      liberation_message: 'Authentication protects community data sovereignty.'
    });
  }

  const { method, url } = req;
  const urlPath = url?.split('?')[0];

  try {
    switch (method) {
      case 'POST':
        if (urlPath === '/api/webhooks/n8n' || urlPath === '/api/webhooks/n8n/content') {
          // N8N Content Discovery Webhook
          const webhookData: N8NContentWebhook = req.body;

          if (!webhookData.content_type || !webhookData.source_url || !webhookData.extracted_data) {
            return res.status(400).json({
              success: false,
              error: 'Missing required fields: content_type, source_url, extracted_data'
            });
          }

          console.log(`🔄 N8N webhook received: ${webhookData.content_type} from ${webhookData.automation_source}`);

          // Check for duplicates first
          const { isDuplicate, similarContent } = await checkForDuplicates(webhookData);

          if (isDuplicate) {
            console.log(`♻️  Duplicate content detected for URL: ${webhookData.source_url}`);
            return res.status(200).json({
              success: true,
              message: 'Duplicate content detected - not processed',
              duplicate: true,
              similar_content: similarContent.map(c => ({ id: c.id, url: c.metadata?.url, title: c.metadata?.title }))
            });
          }

          // Analyze content with IVOR AI
          const analysis = await analyzeWithIVOR(webhookData);

          // Determine if content should be auto-approved based on liberation values
          const autoApprove = analysis.community_alignment > 0.8 &&
                             analysis.content_relevance > 0.7 &&
                             analysis.safety_assessment.trauma_informed &&
                             analysis.safety_assessment.anti_oppression &&
                             !analysis.duplicate_check.is_duplicate;

          // Proxy to Railway backend
          const railwayResponse = await fetch('https://blkout-api-railway-production.up.railway.app/api/webhooks/n8n', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-N8N-Signature': req.headers['x-n8n-signature'] as string || '',
              'X-Liberation-Source': req.headers['x-liberation-source'] as string || ''
            },
            body: JSON.stringify({
              ...webhookData,
              analysis,
              autoApprove,
              processed_at: new Date().toISOString()
            })
          });

          if (!railwayResponse.ok) {
            throw new Error(`Railway API error: ${railwayResponse.status}`);
          }

          const railwayData = await railwayResponse.json();

          console.log(`✅ N8N content processed via Railway: ${autoApprove ? 'auto-approved' : 'queued for review'}`, {
            content_type: webhookData.content_type,
            quality_score: analysis.quality_score,
            auto_approved: autoApprove
          });

          return res.status(201).json({
            success: true,
            message: autoApprove ? 'Content auto-approved and published' : 'Content submitted for community review',
            submissionId: railwayData.id || railwayData.submissionId,
            auto_approved: autoApprove,
            analysis: {
              quality_score: analysis.quality_score,
              community_alignment: analysis.community_alignment,
              suggested_tags: analysis.suggested_tags,
              category: analysis.category_recommendation,
              liberation_compliant: analysis.safety_assessment.anti_oppression && analysis.safety_assessment.trauma_informed
            },
            source: 'railway-proxy',
            liberation_message: autoApprove
              ? 'Content meets liberation values criteria and community standards'
              : 'Content submitted for democratic community review process'
          });
        }

        if (urlPath === '/api/webhooks/n8n/research') {
          // N8N Research Update Webhook
          const researchData: N8NResearchWebhook = req.body;

          if (!researchData.search_query || !researchData.results) {
            return res.status(400).json({
              success: false,
              error: 'Missing required fields: search_query, results'
            });
          }

          console.log(`🔍 N8N research webhook received: "${researchData.search_query}" (${researchData.results.length} results)`);

          // Process research results and submit relevant content
          let processedCount = 0;
          let duplicateCount = 0;
          const processedResults = [];

          for (const result of researchData.results.slice(0, 10)) { // Limit to 10 results
            if (result.relevance_score < 0.6) continue; // Skip low relevance

            // Create content webhook format for processing
            const contentWebhook: N8NContentWebhook = {
              content_type: 'news',
              source_url: result.url,
              extracted_data: {
                title: result.title,
                description: result.description,
                content: result.description,
                tags: ['automated-research', researchData.search_query.replace(/\s+/g, '-').toLowerCase()]
              },
              classification: {
                category: 'research-discovery',
                confidence: result.relevance_score,
                tags: ['n8n-research', 'automated']
              },
              automation_source: `research:${researchData.source}`,
              timestamp: researchData.timestamp
            };

            // Check for duplicates
            const { isDuplicate } = await checkForDuplicates(contentWebhook);

            if (isDuplicate) {
              duplicateCount++;
              continue;
            }

            // Analyze and submit
            const analysis = await analyzeWithIVOR(contentWebhook);

            if (analysis.content_relevance > 0.6 && analysis.community_alignment > 0.5) {
              const contentId = randomUUID();
              const submission = {
                content_id: contentId,
                content_table: 'news',
                action: 'research-discovery',
                moderator_id: 'n8n-research',
                reason: `Research discovery via N8N: "${researchData.search_query}"`,
                metadata: {
                  ...contentWebhook.extracted_data,
                  url: result.url,
                  automation_source: contentWebhook.automation_source,
                  search_query: researchData.search_query,
                  relevance_score: result.relevance_score,
                  ivor_analysis: analysis,
                  submissionTime: new Date().toISOString()
                }
              };

              const { data: insertedData } = await supabase
                .from('moderation_log')
                .insert([submission])
                .select()
                .single();

              if (insertedData) {
                processedResults.push({
                  id: insertedData.id,
                  title: result.title,
                  relevance: result.relevance_score,
                  quality: analysis.quality_score
                });
                processedCount++;
              }
            }
          }

          console.log(`📊 N8N research processed: ${processedCount} submitted, ${duplicateCount} duplicates filtered`);

          return res.status(200).json({
            success: true,
            message: `Research processed: ${processedCount} items submitted for review`,
            processed_count: processedCount,
            duplicate_count: duplicateCount,
            total_results: researchData.results.length,
            search_query: researchData.search_query,
            processed_items: processedResults,
            liberation_message: 'Research automation serves community knowledge and empowerment'
          });
        }

        return res.status(404).json({ success: false, error: 'N8N webhook endpoint not found' });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
          liberation_message: 'Only POST requests supported for webhook automation'
        });
    }
  } catch (error) {
    console.error('❌ N8N webhook error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      liberation_message: 'Technical difficulties - community tech collective will address'
    });
  }
}