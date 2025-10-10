import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) + '-' + Date.now().toString(36);
}

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
    const { name, email, title, category, content, excerpt } = req.body;

    // Validate required fields
    if (!name || !email || !title || !category || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide name, email, title, category, and content',
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

    // Generate excerpt if not provided (first 200 chars of content)
    const articleExcerpt = excerpt || content.substring(0, 200) + '...';

    // Generate unique slug from title
    const slug = generateSlug(title);

    // Insert article directly into voices_articles table as published
    const { data, error } = await supabase
      .from('voices_articles')
      .insert([
        {
          title,
          content,
          excerpt: articleExcerpt,
          author: name,
          category,
          slug,
          published: true,
          published_at: new Date().toISOString(),
          featured: false,
          tags: [],
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to publish your article. Please try again.',
        details: error.message,
      });
    }

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Your article has been published successfully!',
      data: data?.[0],
    });
  } catch (error) {
    console.error('Error submitting article:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again.',
    });
  }
}
