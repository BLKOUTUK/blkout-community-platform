// BLKOUT Liberation Platform - Unified Submissions API Endpoint
// Handles both story and event submissions from Chrome extension and admin interface
// Proxy to Railway backend for content management

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
    const { type } = req.query;

    if (type === 'event') {
      return handleEventSubmission(req, res);
    } else {
      return handleStorySubmission(req, res);
    }
  } catch (error) {
    console.error('Submissions API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Submission services temporarily unavailable'
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

    // Transform data to Railway format
    const railwayPayload = {
      type: storyData.contentType || 'story',
      title: storyData.title,
      url: storyData.originalUrl,
      excerpt: storyData.excerpt || '',
      category: storyData.category || 'general',
      content: storyData.excerpt || storyData.title,
      tags: storyData.tags || [],
      submitted_by: storyData.curatorId || 'submission-api',
      source: storyData.submittedVia || 'api'
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

async function handleEventSubmission(req: VercelRequest, res: VercelResponse) {
  const eventData = req.body;

  // Validate required fields
  if (!eventData.title || !eventData.description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required for event submission'
    });
  }

  try {
    console.log('🔍 Submitting event to Railway:', eventData.title);

    // Transform data to Railway format
    const railwayPayload = {
      type: 'event',
      title: eventData.title,
      url: eventData.originalUrl || eventData.url || '#',
      excerpt: eventData.description || eventData.excerpt || '',
      category: eventData.category || 'general',
      content: eventData.description || eventData.title,
      tags: eventData.tags || [],
      submitted_by: eventData.curatorId || 'submission-api',
      source: eventData.submittedVia || 'api',
      // Event-specific fields
      event_date: eventData.date,
      event_location: eventData.location?.details || eventData.location?.address || '',
      event_type: eventData.type || 'virtual',
      organizer_name: eventData.organizer?.name || '',
      organizer_email: eventData.organizer?.email || '',
      registration_required: eventData.registration?.required || false,
      registration_url: eventData.registration?.registrationUrl || '',
      accessibility_features: Array.isArray(eventData.accessibilityFeatures)
        ? eventData.accessibilityFeatures.join(', ')
        : ''
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
      console.log('✅ Event submitted successfully:', railwayData.data?.id);

      return res.status(201).json({
        success: true,
        id: railwayData.data?.id || `event_${Date.now()}`,
        message: 'Event submitted successfully to moderation queue',
        submittedAt: new Date().toISOString(),
        source: 'railway-proxy'
      });
    } else {
      throw new Error(`Railway API error: ${railwayResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Railway event submission error:', error);
    console.error('❌ Error name:', error?.name);
    console.error('❌ Error message:', error?.message);

    // Fallback to mock response on error
    const mockId = `event_${Date.now()}`;
    return res.status(201).json({
      success: false,
      id: mockId,
      message: `Event submission failed: ${error?.message || 'Unknown error'}`,
      submittedAt: new Date().toISOString(),
      error: `Railway backend error: ${error?.message || 'Unknown error'} - please try again`
    });
  }
}