// BLKOUT Liberation Platform - Events Moderation Queue Endpoint
// Receives event submissions from Chrome extension and stores in Supabase
// Standalone module for events calendar integration

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// CORS headers for extension integration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'POST') {
    return handleEventSubmission(req, res);
  } else if (req.method === 'GET') {
    return handleGetQueue(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * Handle event submission from Chrome extension
 */
async function handleEventSubmission(req: VercelRequest, res: VercelResponse) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey
      });
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Database connection not configured'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const eventData = req.body;

    // Validate required fields
    if (!eventData.edited?.title || !eventData.edited?.date) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['edited.title', 'edited.date']
      });
    }

    // Extract event data from extension format
    const {
      original = {},
      edited = {}
    } = eventData;

    // Create event record in events table
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert([{
        title: edited.title,
        description: edited.description || original.description || '',
        date: edited.date,
        start_time: edited.startTime || null,
        end_time: edited.endTime || null,
        location: edited.location || original.location || null,
        virtual_link: edited.virtualUrl || original.virtualUrl || null,
        organizer: edited.organizer || original.organizer || 'Unknown',
        cost: edited.cost || original.cost || 'Free',
        registration_required: edited.registrationRequired || false,
        capacity: edited.capacity ? parseInt(edited.capacity) : null,
        accessibility_features: edited.accessibility || original.accessibility || [],
        tags: edited.tags || original.tags || [],
        url: original.url || edited.sourceUrl || null,
        status: 'pending',
        source: 'chrome_extension',
        priority: 'medium'
      }])
      .select()
      .single();

    if (eventError) {
      console.error('Failed to insert event:', eventError);
      return res.status(500).json({
        error: 'Database error',
        message: eventError.message
      });
    }

    // Also add to moderation_queue for unified admin view
    const { error: queueError } = await supabase
      .from('moderation_queue')
      .insert([{
        title: edited.title,
        url: original.url || edited.sourceUrl || null,
        excerpt: edited.description || original.description || '',
        category: 'events',
        status: 'pending_review',
        type: 'event',
        submitted_by: 'events_curator_extension',
        content_data: {
          original,
          edited,
          event_id: event.id
        },
        priority: 'medium'
      }]);

    if (queueError) {
      console.warn('Failed to add to moderation queue:', queueError);
      // Don't fail the request - event was saved successfully
    }

    return res.status(200).json({
      success: true,
      message: 'Event submitted to moderation queue successfully',
      event: {
        id: event.id,
        title: event.title,
        status: event.status,
        date: event.date
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Event submission error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get pending events from moderation queue
 */
async function handleGetQueue(req: VercelRequest, res: VercelResponse) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { status = 'pending' } = req.query;

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', status as string)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      queue: events || [],
      metadata: {
        total: events?.length || 0,
        status: status as string,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Queue fetch error:', error);
    return res.status(500).json({
      error: 'Failed to fetch moderation queue',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
