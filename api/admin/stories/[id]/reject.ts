// BLKOUT Liberation Platform - Admin Story Rejection Endpoint
// Handles story rejection from admin moderation interface

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
        message: 'Story ID is required for rejection'
      });
    }

    console.log(`🔍 Rejecting story ${id} with reason:`, reason);

    // Proxy request to Railway backend using general update endpoint
    const railwayResponse = await fetch(`https://blkout-api-railway-production.up.railway.app/api/admin/moderation-queue/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'rejected',
        action: action || 'reject',
        reason: reason || 'Rejected by moderator',
        moderator_id: 'admin_interface',
        reviewed_at: new Date().toISOString()
      })
    });

    console.log('📡 Railway rejection response status:', railwayResponse.status);

    if (railwayResponse.ok) {
      const railwayData = await railwayResponse.json();
      console.log('✅ Story rejected successfully:', id);

      return res.status(200).json({
        success: true,
        message: 'Story rejected successfully',
        storyId: id,
        action: action || 'reject',
        reason: reason || 'Rejected by moderator',
        rejectedAt: new Date().toISOString(),
        source: 'railway-proxy'
      });
    } else {
      const errorText = await railwayResponse.text();
      throw new Error(`Railway rejection error: ${railwayResponse.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Story rejection error:', error);
    console.error('❌ Error details:', {
      name: error?.name,
      message: error?.message
    });

    return res.status(500).json({
      success: false,
      error: 'Story rejection failed',
      message: error?.message || 'Unknown error occurred during story rejection',
      storyId: req.query.id
    });
  }
}