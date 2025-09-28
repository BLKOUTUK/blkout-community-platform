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

    // Build query for published_news table (current community news)
    let query = supabase
      .from('published_news')
      .select('*', { count: 'exact' });

    // Apply filters
    if (params.status === 'published') {
      query = query.eq('status', 'published');
    }

    if (params.search) {
      const searchTerm = `%${params.search}%`;
      query = query.or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`);
    }

    // Apply sorting
    if (params.sortBy === 'recent') {
      query = query.order('published_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(params.offset, params.offset + params.limit - 1);

    const { data: news, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // If no community news, return fallback data
    if (!news || news.length === 0) {
      return await fallbackToFallbackData(req, res, params);
    }

    // Transform data to match expected interface
    const transformedNews = news.map((article: any) => ({
      id: article.id,
      title: article.title,
      excerpt: article.content?.substring(0, 200) + '...' || '',
      content: article.content || '',
      category: article.metadata?.category || 'Community News',
      author: article.author || 'BLKOUT Community',
      publishedAt: article.published_at || article.created_at,
      readTime: estimateReadTime(article.content || ''),
      originalUrl: article.metadata?.original_url || '#',
      sourceName: article.metadata?.source_name || 'Community Submission',
      curatorId: article.metadata?.curator_id || 'community',
      submittedAt: article.created_at,
      interestScore: article.metadata?.interest_score || 85,
      totalVotes: article.metadata?.total_votes || 0,
      topics: article.metadata?.topics || [],
      sentiment: article.metadata?.sentiment || 'neutral',
      relevanceScore: article.metadata?.relevance_score || 85,
      status: article.status || 'published'
    }));

    return res.status(200).json({
      success: true,
      data: {
        articles: transformedNews,
        pagination: {
          total: count || 0,
          limit: params.limit,
          offset: params.offset,
          hasMore: params.offset + params.limit < (count || 0),
          page: Math.floor(params.offset / params.limit) + 1,
          totalPages: Math.ceil((count || 0) / params.limit)
        },
        categories: ['Community News', 'Liberation Updates', 'Resource Sharing'],
        stats: {
          totalPublished: count || 0,
          averageInterestScore: 85
        },
        source: 'supabase-news'
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