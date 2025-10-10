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
    console.log('[submit-article] Received request:', {
      method: req.method,
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : []
    });

    const {
      name,
      email,
      title,
      category,
      content,
      excerpt,
      tags = [],
      featured = false,
      published = true,
      hero_image,
      hero_image_alt,
      thumbnail_image,
      thumbnail_alt
    } = req.body;

    console.log('[submit-article] Parsed data:', {
      name, email, title, category,
      contentLength: content?.length,
      excerptLength: excerpt?.length,
      tags, featured, published
    });

    // Validate required fields
    if (!name || !email || !title || !category || !content) {
      console.error('[submit-article] Validation failed:', { name: !!name, email: !!email, title: !!title, category: !!category, content: !!content });
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide name, email, title, category, and content',
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('[submit-article] Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
      urlPreview: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing'
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[submit-article] Supabase credentials not configured');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Database connection not available',
        debug: {
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey
        }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate excerpt if not provided (first 200 chars of content)
    const articleExcerpt = excerpt || content.substring(0, 200) + '...';

    // Generate unique slug from title
    const slug = generateSlug(title);
    console.log('[submit-article] Generated slug:', slug);

    const articleData = {
      title,
      content,
      excerpt: articleExcerpt,
      author: name,
      category,
      slug,
      published,
      published_at: published ? new Date().toISOString() : null,
      featured,
      tags,
      hero_image,
      hero_image_alt,
      thumbnail_image,
      thumbnail_alt,
    };

    console.log('[submit-article] Article data prepared:', {
      ...articleData,
      content: `${content.substring(0, 50)}...`,
      excerpt: `${articleExcerpt.substring(0, 50)}...`
    });

    // Insert article directly into voices_articles table
    const { data, error } = await supabase
      .from('voices_articles')
      .insert([articleData])
      .select();

    if (error) {
      console.error('[submit-article] Supabase insert error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to publish your article. Please try again.',
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }

    console.log('[submit-article] Article created successfully:', data?.[0]?.id);

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
