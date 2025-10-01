import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { name, email, title, category, pitch, wordCount, deadline } = req.body;

    // Validate required fields
    if (!name || !email || !title || !category || !pitch) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide name, email, title, category, and pitch',
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not configured');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Database connection not available',
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert pitch into database
    const { data, error } = await supabase
      .from('article_pitches')
      .insert([
        {
          name,
          email,
          title,
          category,
          pitch,
          word_count: wordCount || null,
          deadline: deadline || null,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to save your pitch. Please try again.',
      });
    }

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Your pitch has been submitted successfully!',
      data: data?.[0],
    });
  } catch (error) {
    console.error('Error submitting pitch:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again.',
    });
  }
}
