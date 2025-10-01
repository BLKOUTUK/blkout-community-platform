import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only supports POST requests'
    });
  }

  try {
    const {
      title,
      date,
      time,
      location,
      description,
      url,
      tags = [],
      organizer,
      capacity,
      cost,
      registrationRequired = false,
      virtualLink,
      submittedBy = 'anonymous'
    } = req.body;

    // Validation
    if (!title || !date) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Title and date are required fields'
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      });
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
        message: 'Database connection not configured'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Submit event to events table with pending/draft status
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title,
          date,
          time,
          location: location || 'TBD',
          description: description || '',
          url: url || null,
          tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
          organizer: organizer || 'Community Member',
          capacity: capacity ? parseInt(capacity) : null,
          cost: cost || 'Free',
          registration_required: registrationRequired,
          virtual_link: virtualLink || null,
          status: 'pending', // Events start as pending, require approval
          submitted_by: submittedBy,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database error',
        message: 'Failed to submit event to database',
        details: error.message
      });
    }

    console.log('✅ Event submitted successfully:', {
      id: data.id,
      title: data.title,
      status: data.status
    });

    return res.status(201).json({
      success: true,
      message: 'Event submitted successfully and is pending approval',
      data: {
        id: data.id,
        title: data.title,
        date: data.date,
        status: data.status
      }
    });

  } catch (error: any) {
    console.error('Event submission error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    });
  }
}
