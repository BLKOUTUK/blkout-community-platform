import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Validate environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables:', {
        supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing',
        supabaseKey: supabaseKey ? '✅ Set' : '❌ Missing'
      });

      res.status(500).json({
        error: 'Database configuration error',
        fallback: true,
        message: 'Environment variables not properly configured'
      });
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { events } = req.body;

    if (!events || !Array.isArray(events)) {
      res.status(400).json({ error: 'Invalid events data' });
      return;
    }

    console.log(`🔄 Processing bulk submission of ${events.length} events`);

    // Transform events data for database insertion
    const eventsToInsert = events.map(event => ({
      title: event.title,
      description: event.description,
      date: event.date,
      start_time: event.startTime,
      end_time: event.endTime,
      location: event.location,
      virtual_link: event.virtualLink,
      organizer: event.organizer,
      cost: event.cost || 'Free',
      registration_required: event.registrationRequired || false,
      capacity: event.capacity,
      accessibility_features: event.accessibilityFeatures || [],
      mutual_aid_requested: event.mutualAidRequested || false,
      status: 'pending',
      source: 'Bulk Admin Upload',
      tags: event.tags || [],
      url: event.url,
      priority: event.priority || 'medium'
    }));

    // Insert events into database
    const { data, error } = await supabase
      .from('events')
      .insert(eventsToInsert)
      .select();

    if (error) {
      console.error('❌ Database insertion error:', error);
      res.status(500).json({
        error: 'Database insertion failed',
        details: error.message
      });
      return;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} events`);

    res.status(200).json({
      success: true,
      message: `Successfully submitted ${data?.length || 0} events`,
      events: data
    });

  } catch (error) {
    console.error('❌ Bulk events submission error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}