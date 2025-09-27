// BLKOUT Liberation Platform - Admin Story Moderation Endpoint
// Handles both approval and rejection from admin moderation interface

import { VercelRequest, VercelResponse } from '@vercel/node';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Only support POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint supports POST method only'
    });
  }

  try {
    const { id } = req.query;
    const { action, reason } = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'Missing story ID',
        message: 'Story ID is required for moderation'
      });
    }

    if (!action || !['approve', 'approve_to_newsroom', 'reject'].includes(action)) {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'Action must be "approve", "approve_to_newsroom", or "reject"'
      });
    }

    console.log(`🔍 ${action === 'reject' ? 'Rejecting' : 'Approving'} story ${id} with action:`, action);

    // TODO: Implement actual Railway moderation when backend supports individual updates
    // For now, return success to enable UI functionality
    console.log('✅ Story moderation simulated - Railway backend integration pending');

    if (action === 'reject') {
      return res.status(200).json({
        success: true,
        message: 'Story rejected successfully (UI enabled - backend integration pending)',
        storyId: id,
        action: action,
        reason: reason || 'Rejected by moderator',
        rejectedAt: new Date().toISOString(),
        source: 'ui-simulation',
        note: 'Story remains in moderation queue until Railway backend implements rejection endpoints'
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Story approved successfully (UI enabled - backend integration pending)',
        storyId: id,
        action: action,
        approvedAt: new Date().toISOString(),
        source: 'ui-simulation',
        note: 'Story remains in moderation queue until Railway backend implements approval endpoints'
      });
    }

  } catch (error) {
    console.error('❌ Story moderation error:', error);
    console.error('❌ Error details:', {
      name: error?.name,
      message: error?.message
    });

    return res.status(500).json({
      success: false,
      error: 'Story moderation failed',
      message: error?.message || 'Unknown error occurred during story moderation',
      storyId: req.query.id
    });
  }
}