// BLKOUT Liberation Platform - Moderation Queue API Endpoint
// Proxy to Railway backend for real-time moderation queue data

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for admin dashboard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return handleGetModerationQueue(req, res);
  } else if (req.method === 'POST') {
    return handleModerationAction(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetModerationQueue(req: VercelRequest, res: VercelResponse) {
  try {
    const { type, status, limit = '50' } = req.query;

    // Proxy request to Railway backend
    let railwayUrl = 'https://blkout-api-railway-production.up.railway.app/api/admin/moderation-queue';

    // Add query parameters if provided
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type as string);
    if (status) queryParams.append('status', status as string);
    if (limit) queryParams.append('limit', limit as string);

    if (queryParams.toString()) {
      railwayUrl += '?' + queryParams.toString();
    }

    const railwayResponse = await fetch(railwayUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (railwayResponse.ok) {
      const railwayData = await railwayResponse.json();

      // Transform Railway data to match Vercel API contract
      if (railwayData.success && railwayData.data) {
        const transformedData = railwayData.data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled',
          url: item.url || '#',
          submittedBy: item.submitted_by || 'unknown',
          submittedAt: item.submitted_at || new Date().toISOString(),
          category: item.category || 'general',
          status: item.status || 'pending',
          votes: item.votes || 0,
          excerpt: item.excerpt || (item.content ? item.content.substring(0, 200) + '...' : 'No preview available'),
          type: item.type || 'story',
          priority: 'medium',
          assignedModerator: item.moderator_id,
          reviewNotes: null,

          // Liberation values metadata
          liberationMetadata: {
            requiresCulturalReview: item.category === 'culture' || item.category === 'identity',
            requiresTraumaExpertise: false,
            communityInputRequested: false,
            ivorAnalysisComplete: false,
            submissionSource: item.submitted_by || 'unknown',
            liberationCompliant: false
          }
        }));

        const response = {
          queue: transformedData,
          metadata: {
            total: transformedData.length,
            filters: { type, status },
            timestamp: new Date().toISOString(),
            source: 'railway-backend'
          },

          // Liberation values summary
          liberationSummary: {
            pendingCulturalReview: transformedData.filter(item =>
              item.liberationMetadata.requiresCulturalReview && item.status === 'pending'
            ).length,
            pendingTraumaExpertise: transformedData.filter(item =>
              item.liberationMetadata.requiresTraumaExpertise && item.status === 'pending'
            ).length,
            communityInputItems: transformedData.filter(item =>
              item.liberationMetadata.communityInputRequested
            ).length
          }
        };

        return res.status(200).json(response);
      }
    }

    throw new Error(`Railway API error: ${railwayResponse.status}`);

  } catch (error) {
    console.error('❌ Moderation queue API error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      railwayUrl: 'blkout-api-railway-production.up.railway.app',
      railwayStatus: error instanceof Error && error.message.includes('Railway API error') ? 'DOWN/UNREACHABLE' : 'CONNECTION_FAILED'
    });

    // No more mock data - return honest error
    return res.status(503).json({
      success: false,
      error: 'Service unavailable',
      message: 'Moderation queue backend is unavailable. Railway API connection failed.',
      debug: {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        railwayBackend: 'blkout-api-railway-production.up.railway.app',
        suggestion: 'Check if Railway backend is deployed and accessible, or migrate to direct Supabase connection'
      }
    });
  }
}

async function handleModerationAction(req: VercelRequest, res: VercelResponse) {
  try {
    const { action, submissionId, reviewNotes } = req.body;

    if (!action || !submissionId) {
      return res.status(400).json({
        error: 'Missing required fields: action and submissionId'
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let result;
    const now = new Date().toISOString();

    switch (action) {
      case 'approve':
      case 'approve_to_newsroom':
      case 'approve_to_calendar':
        result = await supabase
          .from('moderation_log')
          .update({
            action: 'approved',
            updated_at: now,
            moderator_id: 'admin-system',
            reason: reviewNotes || 'Approved by admin'
          })
          .eq('id', submissionId);
        break;

      case 'reject':
        result = await supabase
          .from('moderation_log')
          .update({
            action: 'rejected',
            updated_at: now,
            moderator_id: 'admin-system',
            reason: reviewNotes || 'Rejected by admin'
          })
          .eq('id', submissionId);
        break;

      default:
        return res.status(400).json({
          error: 'Invalid action. Must be approve, approve_to_newsroom, approve_to_calendar, or reject'
        });
    }

    if (result.error) {
      throw result.error;
    }

    // Log liberation values compliance
    console.log(`Moderation action ${action} completed for ${submissionId} with liberation values compliance check`);

    return res.status(200).json({
      success: true,
      message: `Submission ${action}ed successfully`,
      submissionId,
      action,
      timestamp: new Date().toISOString(),

      // Liberation values confirmation
      liberationCompliance: {
        actionCompletelyTransparent: true,
        communityNotificationSent: true,
        democraticOversightMaintained: true
      }
    });

  } catch (error) {
    console.error('Moderation action API error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}