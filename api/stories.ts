// BLKOUT Liberation Platform - Story Archive API Endpoint
// Layer 2: API Gateway for Story Archive
// STRICT SEPARATION: API layer only - NO business logic

import { VercelRequest, VercelResponse } from '@vercel/node';

// Story data structure matching migrated content
interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  imageUrl?: string;
  originalUrl?: string;
  contentType: 'article' | 'audio' | 'video' | 'gallery' | 'multimedia';
  blkoutTheme?: 'CONNECT' | 'CREATE' | 'CARE';
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

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
      message: 'Story archive endpoint only supports GET requests'
    });
  }

  try {
    const { q = '', category = 'all', page = '1', limit = '12' } = req.query;
    const storyId = req.url?.match(/\/stories\/([^?]+)/)?.[1];

    // Handle categories request
    if (req.url?.includes('/categories')) {
      return res.status(200).json([
        'Community Organizing',
        'Arts & Culture',
        'Economic Justice',
        'Health & Wellness',
        'Education & Resources',
        'Liberation Theory',
        'Mutual Aid',
        'Black Joy',
        'Queer Liberation'
      ]);
    }

    // Handle single story request
    if (storyId) {
      // In production, fetch from database
      // For now, return a sample migrated story
      const story: Story = {
        id: storyId,
        title: 'Building Community Resilience Through Mutual Aid',
        excerpt: 'How grassroots organizing and community care create lasting change in Black queer communities.',
        content: `
          <p>In the heart of our communities, mutual aid networks have become lifelines of liberation. This isn't charity - it's solidarity in action.</p>

          <h2>The Power of Collective Care</h2>
          <p>When we talk about mutual aid, we're talking about communities taking care of themselves without waiting for permission or validation from systems that were never designed to serve us. It's about recognizing that our survival is interconnected, and our liberation is collective.</p>

          <p>Across the UK, Black queer communities have been practicing this for generations. From informal lending circles to organized food distribution networks, we've always found ways to ensure no one gets left behind.</p>

          <h2>Beyond Emergency Response</h2>
          <p>While mutual aid often emerges in response to crisis, what we're building goes deeper. We're creating sustainable systems of care that challenge the very foundations of capitalism and individualism. When we share resources based on need rather than profit, we're practicing a different kind of economics - one rooted in abundance rather than scarcity.</p>

          <p>The BLKOUT community has seen this in action through our emergency fund, which has supported over 200 community members in the past year alone. But more than financial support, we've built networks of emotional and practical solidarity.</p>

          <h2>Digital Tools for Liberation</h2>
          <p>Technology has amplified our ability to organize. Platforms like this one aren't just websites - they're digital gathering spaces where we can coordinate resources, share knowledge, and build power together. Every story shared, every event organized, every connection made strengthens the web of our collective liberation.</p>

          <h2>The Future We're Building</h2>
          <p>As we look forward, mutual aid isn't just about surviving the present - it's about prefiguring the future we want to live in. A future where care is abundant, where no one goes without, where our differences are celebrated, and where Black queer joy is revolutionary.</p>

          <p>This is the work. This is the vision. This is liberation in practice.</p>
        `,
        category: 'Community Organizing',
        author: 'Jordan Williams',
        publishedAt: '2025-09-20T14:30:00Z',
        readTime: '8 min read',
        tags: ['mutual-aid', 'community-care', 'organizing', 'resilience', 'liberation'],
        imageUrl: '/images/community-resilience.jpg',
        originalUrl: 'https://blkoutuk.com/articles/mutual-aid-resilience',
        contentType: 'article',
        blkoutTheme: 'CARE'
      };

      return res.status(200).json(story);
    }

    // Handle stories list with search and filtering
    const searchQuery = (q as string).toLowerCase();
    const categoryFilter = category as string;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // In production, this would query the actual database of migrated stories
    // For now, return sample data representing the 270+ migrated articles
    const allStories: Story[] = [
      {
        id: 'story_001',
        title: 'Building Community Resilience Through Mutual Aid',
        excerpt: 'How grassroots organizing and community care create lasting change in Black queer communities.',
        content: '',
        category: 'Community Organizing',
        author: 'Jordan Williams',
        publishedAt: '2025-09-20T14:30:00Z',
        readTime: '8 min read',
        tags: ['mutual-aid', 'community-care', 'organizing'],
        contentType: 'article',
        blkoutTheme: 'CARE'
      },
      {
        id: 'story_002',
        title: 'The Art of Liberation: Creative Resistance in Digital Spaces',
        excerpt: 'Exploring how Black queer artists use technology to challenge systems and celebrate joy.',
        content: '',
        category: 'Arts & Culture',
        author: 'Alex Chen',
        publishedAt: '2025-09-18T10:15:00Z',
        readTime: '12 min read',
        tags: ['digital-art', 'resistance', 'creativity'],
        contentType: 'multimedia',
        blkoutTheme: 'CREATE'
      },
      {
        id: 'story_003',
        title: 'Economic Justice in the Creator Economy',
        excerpt: 'Examining fair compensation models and platform sovereignty for Black creators.',
        content: '',
        category: 'Economic Justice',
        author: 'Sam Johnson',
        publishedAt: '2025-09-15T16:45:00Z',
        readTime: '10 min read',
        tags: ['creator-economy', 'economic-justice', 'platform-sovereignty'],
        contentType: 'article',
        blkoutTheme: 'CONNECT'
      },
      // ... Additional stories would be loaded from database
    ];

    // Apply search filter
    let filteredStories = allStories;
    if (searchQuery) {
      filteredStories = filteredStories.filter(story =>
        story.title.toLowerCase().includes(searchQuery) ||
        story.excerpt.toLowerCase().includes(searchQuery) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredStories = filteredStories.filter(story =>
        story.category === categoryFilter
      );
    }

    // Calculate pagination
    const total = filteredStories.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedStories = filteredStories.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      stories: paginatedStories,
      total,
      page: pageNum,
      totalPages,
      success: true
    });

  } catch (error) {
    console.error('Story archive API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Story archive temporarily unavailable'
    });
  }
}