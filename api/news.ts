// BLKOUT Liberation Platform - News API Endpoint
// Fetches current community-curated news from published_news table
// Separate from archive which shows historical BLKOUT articles

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Fallback news data for when moderation queue is empty
const FALLBACK_NEWS = [
  {
    id: 'news_fallback_001',
    title: 'Community News Coming Soon',
    excerpt: 'Community-curated news articles will appear here as they are approved through our moderation queue.',
    content: 'This is where community-curated news articles will appear once they have been reviewed and approved through our moderation system. Submit news articles through our submission form to contribute to the community news feed.',
    category: 'Community Updates',
    author: 'BLKOUT Editorial',
    publishedAt: new Date().toISOString(),
    readTime: '2 min read',
    tags: ['community', 'news', 'updates'],
    originalUrl: '#',
    sourceName: 'BLKOUT Community',
    curatorId: 'editorial',
    submittedAt: new Date().toISOString(),
    interestScore: 95,
    totalVotes: 0,
    topics: ['community', 'moderation'],
    sentiment: 'positive',
    relevanceScore: 100,
    status: 'published'
  },
  {
    id: 'news_fallback_002',
    title: 'How to Submit News Articles',
    excerpt: 'Learn how to submit relevant news articles to the BLKOUT community for review and publication.',
    content: 'Community members can submit news articles relevant to Black queer liberation through our submission form. All submissions go through a community moderation process before being published to ensure quality and relevance.',
    category: 'How To',
    author: 'BLKOUT Editorial',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    readTime: '3 min read',
    tags: ['how-to', 'submission', 'moderation'],
    originalUrl: '#',
    sourceName: 'BLKOUT Community',
    curatorId: 'editorial',
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    interestScore: 88,
    totalVotes: 0,
    topics: ['submission', 'community'],
    sentiment: 'informative',
    relevanceScore: 95,
    status: 'published'
  }
];

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

    // Try to fetch from Supabase published_news table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      return await fetchFromSupabase(req, res, supabaseUrl, supabaseServiceKey, {
        category: category as string,
        status: status as string,
        limit: limitNum,
        offset: offsetNum,
        search: search as string,
        sortBy: sortBy as string
      });
    }

    // Fallback to placeholder data if Supabase not configured
    console.log('Supabase not configured, using fallback news data');
    return await fallbackToFallbackData(req, res, {
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
      throw error;
    }

    // If no community news, return fallback data
    if (!articles || articles.length === 0) {
      return await fallbackToFallbackData(req, res, params);
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
    const categories = [...new Set(transformedNews.map(a => a.category))];

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
    // Fallback to placeholder data on error
    return await fallbackToFallbackData(req, res, params);
  }
}

async function fallbackToFallbackData(req: VercelRequest, res: VercelResponse, params: any) {
  // Filter news based on parameters
  let filteredNews = [...FALLBACK_NEWS];

  // Filter by status (for now, all are published)
  if (params.status === 'published') {
    filteredNews = filteredNews.filter(n => n.status === 'published');
  }

  // Filter by category
  if (params.category && params.category !== 'all') {
    filteredNews = filteredNews.filter(n =>
      n.category.toLowerCase() === params.category.toLowerCase()
    );
  }

  // Search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredNews = filteredNews.filter(n =>
      n.title.toLowerCase().includes(searchLower) ||
      n.excerpt.toLowerCase().includes(searchLower) ||
      n.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Sort news
  if (params.sortBy === 'interest') {
    filteredNews.sort((a, b) => b.interestScore - a.interestScore);
  } else if (params.sortBy === 'recent') {
    filteredNews.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  // Apply pagination
  const paginatedNews = filteredNews.slice(params.offset, params.offset + params.limit);

  return res.status(200).json({
    success: true,
    data: {
      articles: paginatedNews,
      pagination: {
        total: filteredNews.length,
        limit: params.limit,
        offset: params.offset,
        hasMore: params.offset + params.limit < filteredNews.length,
        page: Math.floor(params.offset / params.limit) + 1,
        totalPages: Math.ceil(filteredNews.length / params.limit)
      },
      categories: [...new Set(FALLBACK_NEWS.map(n => n.category))],
      stats: {
        totalPublished: FALLBACK_NEWS.filter(n => n.status === 'published').length,
        averageInterestScore: Math.round(
          FALLBACK_NEWS.reduce((sum, n) => sum + n.interestScore, 0) / FALLBACK_NEWS.length
        )
      },
      source: 'fallback-news'
    }
  });
}