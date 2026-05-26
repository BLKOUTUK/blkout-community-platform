// BLKOUT Liberation Platform - Stories API Endpoint
// Fetches approved stories for News page and Story Archive from
// Supabase public.archived_articles (the migrated blkoutuk.com archive).

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Helper function to estimate read time
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

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

  // Only support GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint supports GET method only'
    });
  }

  try {
    const {
      category,
      status = 'published',
      limit = '20',
      offset = '0',
      search,
      sortBy = 'recent'
    } = req.query;

    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    // Try to fetch from Supabase first
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        success: false,
        error: 'Supabase credentials missing',
        message: 'VITE_SUPABASE_URL and an anon/service key must be set on the server.'
      });
    }

    return await fetchFromSupabase(req, res, supabaseUrl, supabaseServiceKey, {
      category: category as string,
      status: status as string,
      limit: limitNum,
      offset: offsetNum,
      search: search as string,
      sortBy: sortBy as string
    });

  } catch (error) {
    console.error('Stories API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch stories'
    });
  }
}

async function fetchFromSupabase(_req: VercelRequest, res: VercelResponse, supabaseUrl: string, supabaseServiceKey: string, params: any) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Migrated blkoutuk.com archive — public.archived_articles (278 rows).
    let query = supabase
      .from('archived_articles')
      .select('*', { count: 'exact' });

    if (params.status === 'published') {
      query = query.eq('status', 'published');
    }

    // archived_articles uses category_id (FK to categories). Joining is a
    // follow-up; category strings remain default for now.

    if (params.search) {
      const searchTerm = `%${params.search}%`;
      query = query.or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`);
    }

    // Apply sorting
    if (params.sortBy === 'recent') {
      query = query.order('published_at', { ascending: false });
    } else if (params.sortBy === 'title') {
      query = query.order('title', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(params.offset, params.offset + params.limit - 1);

    const { data: stories, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log(`📚 Supabase query returned ${stories?.length || 0} stories, total count: ${count}`);

    // Transform data to match expected interface
    const transformedStories = (stories || []).map((story: any) => ({
      id: story.id,
      title: story.title,
      excerpt: story.excerpt || '',
      content: story.content || '',
      category: 'Community', // Default category for now
      author: 'BLKOUT Community', // Default author for now
      publishedAt: story.published_at || story.created_at,
      readTime: estimateReadTime(story.content || ''),
      tags: [],
      imageUrl: story.featured_image,
      originalUrl: story.source_url,
      contentType: 'article',
      blkoutTheme: 'CONNECT', // Default theme
      interestScore: story.liberation_score || 85,
      totalVotes: 0,
      status: story.status || 'published'
    }));

    // Get categories from categories table
    const categoriesQuery = await supabase
      .from('categories')
      .select('name');

    const categories = (categoriesQuery.data || []).map((item: any) => item.name);

    return res.status(200).json({
      success: true,
      data: {
        stories: transformedStories,
        pagination: {
          total: count || 0,
          limit: params.limit,
          offset: params.offset,
          hasMore: params.offset + params.limit < (count || 0),
          page: Math.floor(params.offset / params.limit) + 1,
          totalPages: Math.ceil((count || 0) / params.limit)
        },
        categories: categories.length > 0 ? categories : ['General'],
        stats: {
          totalPublished: count || 0,
          averageInterestScore: 85
        },
        source: 'supabase'
      }
    });

  } catch (error: any) {
    console.error('Error fetching from Supabase:', error);
    return res.status(502).json({
      success: false,
      error: 'Supabase fetch failed',
      message: error?.message || 'Could not load stories from archive.'
    });
  }
}