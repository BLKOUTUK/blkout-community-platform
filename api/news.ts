// BLKOUT Liberation Platform - News API Endpoint
// Fetches current community-curated news from published_news table
// Separate from archive which shows historical BLKOUT articles

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// No more fallback data - we show the truth: empty until content is approved

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

  // Handle POST requests (news submission from Chrome extension)
  if (req.method === 'POST') {
    return await handleNewsSubmission(req, res);
  }

  // Handle GET requests (fetch news)
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint supports GET and POST methods only'
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

    // Try to fetch from Supabase published_news table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase credentials not configured');
      return res.status(503).json({
        success: false,
        error: 'Service unavailable',
        message: 'Database connection not configured. Please contact platform administrators.',
        debug: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseServiceKey
        }
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
    console.error('News API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch news'
    });
  }
}

async function fetchFromSupabase(req: VercelRequest, res: VercelResponse, supabaseUrl: string, supabaseServiceKey: string, params: any) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build query for moderation_queue table (approved articles for Phase 1)
    let query = supabase
      .from('moderation_queue')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .eq('type', 'article');

    // Apply category filter if provided
    if (params.category && params.category !== 'all') {
      query = query.contains('tags', [params.category]);
    }

    // Apply search filter
    if (params.search) {
      const searchTerm = `%${params.search}%`;
      query = query.or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`);
    }

    // Apply sorting
    if (params.sortBy === 'recent') {
      query = query.order('approved_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(params.offset, params.offset + params.limit - 1);

    const { data: articles, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database query failed',
        message: 'Failed to fetch news from database. Please try again later.',
        debug: {
          error: error.message,
          code: error.code
        }
      });
    }

    // If no community news, return empty state (no fake data)
    if (!articles || articles.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          articles: [],
          pagination: {
            total: 0,
            limit: params.limit,
            offset: params.offset,
            hasMore: false,
            page: 1,
            totalPages: 0
          },
          categories: ['Community News', 'Liberation Updates', 'Resource Sharing'],
          stats: {
            totalPublished: 0,
            averageInterestScore: 0,
            storyOfWeek: null
          },
          source: 'database',
          message: 'No approved articles yet. Submit content through our curation system to see articles here.'
        }
      });
    }

    // Get article IDs for voting data
    const articleIds = articles.map(a => a.id);

    // Fetch voting data from content_ratings
    const { data: ratings } = await supabase
      .from('content_ratings')
      .select('content_id, rating_type, rating_value')
      .eq('content_type', 'news')
      .in('content_id', articleIds);

    // Get Story of the Week from weekly_highlights
    const { data: storyOfWeek } = await supabase
      .from('weekly_highlights')
      .select('content_id, week_number, featured_at')
      .eq('content_type', 'news')
      .order('week_number', { ascending: false })
      .limit(1)
      .single();

    // Calculate interest scores and transform data
    const transformedNews = articles.map((article: any) => {
      // Get ratings for this article
      const articleRatings = ratings?.filter(r => r.content_id === article.id) || [];

      // Calculate interest score (0-100 scale)
      let interestScore = 0;
      let totalVotes = articleRatings.length;

      if (totalVotes > 0) {
        const sum = articleRatings.reduce((acc, r) => acc + (r.rating_value || 0), 0);
        // Convert 0-5 scale to 0-100 percentage
        interestScore = Math.round((sum / (totalVotes * 5)) * 100);
      }

      // Check if this is Story of the Week
      const isStoryOfWeek = storyOfWeek?.content_id === article.id;

      return {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || article.content?.substring(0, 200) + '...' || '',
        content: article.content || '',
        category: article.tags?.[0] || 'Community News',
        author: article.author || article.submitted_by || 'Community Curator',
        publishedAt: article.approved_at || article.created_at,
        readTime: estimateReadTime(article.content || ''),

        // Phase 1: Story Aggregation fields
        originalUrl: article.url || '#',
        sourceName: article.source || 'Community Submission',
        curatorId: article.submitted_by,
        submittedAt: article.created_at,

        // Community engagement
        interestScore,
        totalVotes,

        // IVOR learning data
        topics: article.tags || [],
        sentiment: 'neutral', // TODO: Add sentiment analysis
        relevanceScore: interestScore / 100, // 0-1 scale for ML

        // Featured content
        isStoryOfWeek,
        weeklyRank: isStoryOfWeek ? 1 : undefined,

        status: 'published'
      };
    });

    // Apply interest-based sorting if requested
    if (params.sortBy === 'interest') {
      transformedNews.sort((a, b) => b.interestScore - a.interestScore);
    } else if (params.sortBy === 'weekly') {
      transformedNews.sort((a, b) => {
        if (a.isStoryOfWeek) return -1;
        if (b.isStoryOfWeek) return 1;
        return b.interestScore - a.interestScore;
      });
    }

    // Calculate stats
    const totalPublished = count || 0;
    const averageInterestScore = transformedNews.length > 0
      ? Math.round(transformedNews.reduce((sum, a) => sum + a.interestScore, 0) / transformedNews.length)
      : 0;

    // Get unique categories from articles
    const categories = Array.from(new Set(transformedNews.map(a => a.category)));

    return res.status(200).json({
      success: true,
      data: {
        articles: transformedNews,
        pagination: {
          total: totalPublished,
          limit: params.limit,
          offset: params.offset,
          hasMore: params.offset + params.limit < totalPublished,
          page: Math.floor(params.offset / params.limit) + 1,
          totalPages: Math.ceil(totalPublished / params.limit)
        },
        categories: categories.length > 0 ? categories : ['Community News', 'Liberation Updates', 'Resource Sharing'],
        stats: {
          totalPublished,
          averageInterestScore,
          storyOfWeek: storyOfWeek ? {
            id: storyOfWeek.content_id,
            weekNumber: storyOfWeek.week_number,
            featuredAt: storyOfWeek.featured_at
          } : null
        },
        source: 'moderation-queue-approved'
      }
    });

  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return res.status(500).json({
      success: false,
      error: 'Database error',
      message: 'Failed to retrieve news articles. Please try again later.',
      debug: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}

// Handle POST requests for news submission from Chrome extension
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
    return res.status(200).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
