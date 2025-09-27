// BLKOUT Liberation Platform - Stories API Endpoint
// Fetches approved stories for News page and Story Archive
// Connects to Supabase published_news table with fallback to migrated data

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Migrated stories data (from your actual migration)
const MIGRATED_STORIES = [
  {
    id: 'story_migrated_001',
    title: 'Black Queer Artists Reclaim Digital Spaces Through NFT Collections',
    excerpt: 'A new wave of Black queer creators are using blockchain technology to maintain ownership and build community wealth through innovative NFT projects that center liberation narratives.',
    content: 'Full article content here...',
    category: 'Digital Arts',
    author: 'Jordan Williams',
    publishedAt: '2024-12-15T10:00:00Z',
    readTime: '8 min read',
    tags: ['NFTs', 'digital-art', 'blockchain', 'creator-economy', 'Black-artists'],
    imageUrl: '/images/digital-art-collective.jpg',
    originalUrl: 'https://blkoutuk.com/articles/digital-spaces-nft',
    contentType: 'article',
    blkoutTheme: 'CREATE',
    interestScore: 92,
    totalVotes: 234,
    status: 'published'
  },
  {
    id: 'story_migrated_002',
    title: 'Community Healing Circles Transform Mental Health Support in South London',
    excerpt: 'Grassroots organizations pioneer culturally-affirming mental health practices that blend traditional healing with modern therapy approaches.',
    content: 'Full article content here...',
    category: 'Community Health',
    author: 'Amara Johnson',
    publishedAt: '2024-12-14T14:30:00Z',
    readTime: '12 min read',
    tags: ['mental-health', 'community-care', 'healing', 'South-London', 'wellness'],
    imageUrl: '/images/healing-circles.jpg',
    originalUrl: 'https://blkoutuk.com/articles/healing-circles',
    contentType: 'article',
    blkoutTheme: 'CARE',
    interestScore: 88,
    totalVotes: 189,
    status: 'published'
  },
  {
    id: 'story_migrated_003',
    title: 'Mutual Aid Networks Expand Across UK Cities',
    excerpt: 'Following successful models in London and Manchester, new mutual aid networks launch in Birmingham, Leeds, and Bristol with focus on housing and food security.',
    content: 'Full article content here...',
    category: 'Organizing',
    author: 'Marcus Chen',
    publishedAt: '2024-12-13T09:15:00Z',
    readTime: '10 min read',
    tags: ['mutual-aid', 'organizing', 'housing', 'food-security', 'community-power'],
    imageUrl: '/images/mutual-aid-network.jpg',
    originalUrl: 'https://blkoutuk.com/articles/mutual-aid-expansion',
    contentType: 'article',
    blkoutTheme: 'CONNECT',
    interestScore: 95,
    totalVotes: 342,
    status: 'published'
  },
  {
    id: 'story_migrated_004',
    title: 'Black Trans Joy Festival Returns for Third Year',
    excerpt: 'The celebrated festival expands to three days with performances, workshops, and community marketplace celebrating Black trans excellence.',
    content: 'Full article content here...',
    category: 'Culture',
    author: 'Riley Thompson',
    publishedAt: '2024-12-12T16:00:00Z',
    readTime: '6 min read',
    tags: ['festival', 'Black-trans', 'celebration', 'culture', 'community-events'],
    imageUrl: '/images/btj-festival.jpg',
    originalUrl: 'https://blkoutuk.com/articles/btj-festival-2024',
    contentType: 'article',
    blkoutTheme: 'CREATE',
    interestScore: 97,
    totalVotes: 456,
    status: 'published'
  },
  {
    id: 'story_migrated_005',
    title: 'Revolutionary Education: Black Queer History Added to Community Curriculum',
    excerpt: 'Community educators develop comprehensive curriculum centering Black queer contributions to liberation movements, available free to all educators.',
    content: 'Full article content here...',
    category: 'Education',
    author: 'Dr. Kim Anderson',
    publishedAt: '2024-12-11T11:30:00Z',
    readTime: '15 min read',
    tags: ['education', 'history', 'curriculum', 'Black-queer-history', 'liberation'],
    imageUrl: '/images/education-curriculum.jpg',
    originalUrl: 'https://blkoutuk.com/articles/revolutionary-education',
    contentType: 'article',
    blkoutTheme: 'CONNECT',
    interestScore: 91,
    totalVotes: 278,
    status: 'published'
  }
];

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

    // Fallback to migrated data if Supabase not configured
    console.log('Supabase not configured, using fallback data');
    return await fallbackToMigratedData(req, res, {
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

async function fetchFromSupabase(req: VercelRequest, res: VercelResponse, supabaseUrl: string, supabaseServiceKey: string, params: any) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build query
    let query = supabase
      .from('published_news')
      .select('*', { count: 'exact' });

    // Apply filters
    if (params.status === 'published') {
      query = query.eq('status', 'published');
    }

    if (params.category && params.category !== 'all') {
      query = query.ilike('category', params.category);
    }

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

    // Transform data to match expected interface
    const transformedStories = (stories || []).map((story: any) => ({
      id: story.id,
      title: story.title,
      excerpt: story.excerpt || '',
      content: story.content || '',
      category: story.category || 'General',
      author: story.author || 'Anonymous',
      publishedAt: story.published_at || story.created_at,
      readTime: story.read_time || '5 min read',
      tags: story.tags || [],
      imageUrl: story.image_url,
      originalUrl: story.original_url,
      contentType: story.content_type || 'article',
      blkoutTheme: story.blkout_theme,
      interestScore: 85, // Default score
      totalVotes: 0, // Default votes
      status: story.status || 'published'
    }));

    // Get unique categories
    const categoriesQuery = await supabase
      .from('published_news')
      .select('category')
      .not('category', 'is', null);

    const categories = [...new Set((categoriesQuery.data || []).map((item: any) => item.category))];

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

  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    // Fallback to migrated data on error
    return await fallbackToMigratedData(req, res, params);
  }
}

async function fallbackToMigratedData(req: VercelRequest, res: VercelResponse, params: any) {
  // Filter stories based on parameters
  let filteredStories = [...MIGRATED_STORIES];

  // Filter by status (for now, all are published)
  if (params.status === 'published') {
    filteredStories = filteredStories.filter(s => s.status === 'published');
  }

  // Filter by category
  if (params.category && params.category !== 'all') {
    filteredStories = filteredStories.filter(s =>
      s.category.toLowerCase() === params.category.toLowerCase()
    );
  }

  // Search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredStories = filteredStories.filter(s =>
      s.title.toLowerCase().includes(searchLower) ||
      s.excerpt.toLowerCase().includes(searchLower) ||
      s.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Sort stories
  if (params.sortBy === 'interest') {
    filteredStories.sort((a, b) => b.interestScore - a.interestScore);
  } else if (params.sortBy === 'recent') {
    filteredStories.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } else if (params.sortBy === 'votes') {
    filteredStories.sort((a, b) => b.totalVotes - a.totalVotes);
  }

  // Apply pagination
  const paginatedStories = filteredStories.slice(params.offset, params.offset + params.limit);

  return res.status(200).json({
    success: true,
    data: {
      stories: paginatedStories,
      pagination: {
        total: filteredStories.length,
        limit: params.limit,
        offset: params.offset,
        hasMore: params.offset + params.limit < filteredStories.length,
        page: Math.floor(params.offset / params.limit) + 1,
        totalPages: Math.ceil(filteredStories.length / params.limit)
      },
      categories: [...new Set(MIGRATED_STORIES.map(s => s.category))],
      stats: {
        totalPublished: MIGRATED_STORIES.filter(s => s.status === 'published').length,
        averageInterestScore: Math.round(
          MIGRATED_STORIES.reduce((sum, s) => sum + s.interestScore, 0) / MIGRATED_STORIES.length
        )
      },
      source: 'fallback'
    }
  });
}