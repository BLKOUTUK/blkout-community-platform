// BLKOUT Liberation Platform - Admin Story Approval Endpoint
// Handles story approval from admin moderation interface

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
    const { action } = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'Missing story ID',
        message: 'Story ID is required for approval'
      });
    }

    console.log(`🔍 Approving story ${id} with action:`, action);

    // Proxy request to Railway backend using general update endpoint
    const railwayResponse = await fetch(`https://blkout-api-railway-production.up.railway.app/api/admin/moderation-queue/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'approved',
        action: action || 'approve_to_newsroom',
        moderator_id: 'admin_interface',
        reviewed_at: new Date().toISOString()
      })
    });

    console.log('📡 Railway approval response status:', railwayResponse.status);

    if (railwayResponse.ok) {
      const railwayData = await railwayResponse.json();
      console.log('✅ Story approved successfully:', id);

      return res.status(200).json({
        success: true,
        message: 'Story approved successfully',
        storyId: id,
        action: action || 'approve_to_newsroom',
        approvedAt: new Date().toISOString(),
        source: 'railway-proxy'
      });
    } else {
      const errorText = await railwayResponse.text();
      throw new Error(`Railway approval error: ${railwayResponse.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Story approval error:', error);
    console.error('❌ Error details:', {
      name: error?.name,
      message: error?.message
    });

    return res.status(500).json({
      success: false,
      error: 'Story approval failed',
      message: error?.message || 'Unknown error occurred during story approval',
      storyId: req.query.id
    });
  }
}