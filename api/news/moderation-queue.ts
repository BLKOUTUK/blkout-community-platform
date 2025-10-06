// BLKOUT Liberation Platform - News Moderation Queue Endpoint
// Receives news article submissions from Chrome extension and stores in Supabase
// Standalone module for newsroom integration

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
    return handleNewsSubmission(req, res);
  } else if (req.method === 'GET') {
    return handleGetQueue(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * Handle news article submission from Chrome extension
 */
async function handleNewsSubmission(req: VercelRequest, res: VercelResponse) {
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

    const articleData = req.body;

    // Validate required fields
    if (!articleData.edited?.title || !articleData.edited?.content) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['edited.title', 'edited.content']
      });
    }

    // Extract article data from extension format
    const {
      original = {},
      edited = {}
    } = articleData;

    // Generate slug from title
    const slug = (edited.title || original.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create news article record
    const { data: article, error: articleError } = await supabase
      .from('news_articles')
      .insert([{
        title: edited.title,
        slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
        excerpt: edited.excerpt || edited.description || original.description || '',
        content: edited.content || original.content || '',
        category: edited.category || 'community',
        tags: edited.tags || original.tags || [],
        author: edited.author || original.author || 'Community Curator',
        source_url: original.url || edited.sourceUrl || null,
        source_name: original.site_name || edited.sourceName || null,
        featured_image: edited.imageUrl || original.image || null,
        image_alt: edited.imageAlt || original.imageAlt || null,
        hero_image: edited.heroImage || original.hero_image || null,
        hero_image_alt: edited.heroImageAlt || null,
        status: 'draft',
        published: false,
        interest_score: 0,
        total_votes: 0,
        view_count: 0,
        is_featured: false,
        is_story_of_week: false
      }])
      .select()
      .single();

    if (articleError) {
      console.error('Failed to insert news article:', articleError);
      return res.status(500).json({
        error: 'Database error',
        message: articleError.message
      });
    }

    // Also add to moderation_queue for unified admin view
    const { error: queueError } = await supabase
      .from('moderation_queue')
      .insert([{
        title: edited.title,
        url: original.url || edited.sourceUrl || null,
        excerpt: edited.excerpt || edited.description || original.description || '',
        category: edited.category || 'community',
        status: 'pending_review',
        type: 'news',
        submitted_by: 'news_curator_extension',
        content: edited.content || original.content || '',
        content_data: {
          original,
          edited,
          article_id: article.id
        },
        priority: 'medium'
      }]);

    if (queueError) {
      console.warn('Failed to add to moderation queue:', queueError);
      // Don't fail the request - article was saved successfully
    }

    return res.status(200).json({
      success: true,
      message: 'News article submitted to moderation queue successfully',
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        category: article.category
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('News submission error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get pending news articles from moderation queue
 */
async function handleGetQueue(req: VercelRequest, res: VercelResponse) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { status = 'draft' } = req.query;

    const { data: articles, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('status', status as string)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      queue: articles || [],
      metadata: {
        total: articles?.length || 0,
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
