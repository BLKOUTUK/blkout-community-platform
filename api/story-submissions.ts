// BLKOUT Liberation Platform - Story Submissions API Endpoint
// Handles bulk story submissions from admin interface
// Proxy to Railway backend for story management

import { VercelRequest, VercelResponse } from '@vercel/node';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    switch (req.method) {
      case 'POST':
        return handleStorySubmission(req, res);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: 'This endpoint supports POST method only'
        });
    }
  } catch (error) {
    console.error('Story submissions API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Story submission services temporarily unavailable'
    });
  }
}

async function handleStorySubmission(req: VercelRequest, res: VercelResponse) {
  const storyData = req.body;

  // Validate required fields
  if (!storyData.title || !storyData.originalUrl) {
    return res.status(400).json({
      success: false,
      message: 'Title and originalUrl are required for story submission'
    });
  }

  try {
    console.log('🔍 Submitting story to Railway:', storyData.title);

    // Transform data to Railway format (same as /api/content)
    const railwayPayload = {
      type: storyData.contentType || 'story',
      title: storyData.title,
      url: storyData.originalUrl,
      excerpt: storyData.excerpt || '',
      category: storyData.category || 'general',
      content: storyData.excerpt || storyData.title,
      tags: storyData.tags || [],
      submitted_by: storyData.curatorId || 'bulk-submission',
      source: 'bulk-submission'
    };

    // Proxy request to Railway backend
    const railwayResponse = await fetch('https://blkout-api-railway-production.up.railway.app/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(railwayPayload)
    });

    console.log('📡 Railway response status:', railwayResponse.status);

    if (railwayResponse.ok) {
      const railwayData = await railwayResponse.json();
      console.log('✅ Story submitted successfully:', railwayData.data?.id);

      return res.status(201).json({
        success: true,
        id: railwayData.data?.id || `story_${Date.now()}`,
        message: 'Story submitted successfully to moderation queue',
        submittedAt: new Date().toISOString(),
        source: 'railway-proxy'
      });
    } else {
      throw new Error(`Railway API error: ${railwayResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Railway story submission error:', error);
    console.error('❌ Error name:', error?.name);
    console.error('❌ Error message:', error?.message);

    // Fallback to mock response on error
    const mockId = `story_${Date.now()}`;
    return res.status(201).json({
      success: false,
      id: mockId,
      message: `Story submission failed: ${error?.message || 'Unknown error'}`,
      submittedAt: new Date().toISOString(),
      error: `Railway backend error: ${error?.message || 'Unknown error'} - please try again`
    });
  }
}