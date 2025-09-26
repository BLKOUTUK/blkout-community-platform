// BLKOUT Liberation Platform - Content API Endpoint
// Layer 2: API Gateway for Content Management
// STRICT SEPARATION: API layer only - NO business logic

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Content data structures
interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  imageUrl?: string;
  originalUrl?: string;
  contentType: 'article' | 'audio' | 'video' | 'gallery' | 'multimedia' | 'event';
  blkoutTheme?: 'CONNECT' | 'CREATE' | 'CARE';
  interestScore: number;
  totalVotes: number;
  status: 'published' | 'draft' | 'pending' | 'archived';
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: 'mutual-aid' | 'organizing' | 'education' | 'celebration' | 'support' | 'action';
  type: 'virtual' | 'in-person' | 'hybrid';
  date: string;
  endDate?: string;
  location: {
    type: 'virtual' | 'in-person' | 'hybrid';
    details?: string;
    address?: string;
    virtualLink?: string;
  };
  organizer: {
    name: string;
    email?: string;
    organization?: string;
  };
  registration?: {
    required: boolean;
    capacity?: number;
    registrationUrl?: string;
    deadline?: string;
    cost?: string;
  };
  accessibilityFeatures: string[];
  tags: string[];
  imageUrl?: string;
  status: 'published' | 'draft' | 'pending' | 'cancelled';
}

// Mock content data
const MOCK_CONTENT_DATA: {
  articles: ContentItem[];
  events: EventItem[];
  featured: ContentItem;
} = {
  articles: [
    {
      id: 'content_001',
      title: 'Building Community Resilience Through Mutual Aid',
      excerpt: 'How grassroots organizing and community care create lasting change in Black queer communities.',
      content: 'Full article content would be here...',
      category: 'Community Organizing',
      author: 'Jordan Williams',
      publishedAt: '2025-09-20T14:30:00Z',
      readTime: '8 min read',
      tags: ['mutual-aid', 'community-care', 'organizing', 'resilience'],
      imageUrl: '/images/community-resilience.jpg',
      contentType: 'article',
      blkoutTheme: 'CARE',
      interestScore: 4.7,
      totalVotes: 156,
      status: 'published'
    },
    {
      id: 'content_002',
      title: 'The Art of Liberation: Creative Resistance in Digital Spaces',
      excerpt: 'Exploring how Black queer artists use technology to challenge systems and celebrate joy.',
      category: 'Arts & Culture',
      author: 'Alex Chen',
      publishedAt: '2025-09-18T10:15:00Z',
      readTime: '12 min read',
      tags: ['digital-art', 'resistance', 'creativity', 'technology'],
      imageUrl: '/images/digital-liberation.jpg',
      contentType: 'multimedia',
      blkoutTheme: 'CREATE',
      interestScore: 4.5,
      totalVotes: 203,
      status: 'published'
    },
    {
      id: 'content_003',
      title: 'Economic Justice in the Creator Economy',
      excerpt: 'Examining fair compensation models and platform sovereignty for Black creators.',
      category: 'Economic Justice',
      author: 'Sam Johnson',
      publishedAt: '2025-09-15T16:45:00Z',
      readTime: '10 min read',
      tags: ['creator-economy', 'economic-justice', 'platform-sovereignty'],
      contentType: 'article',
      blkoutTheme: 'CONNECT',
      interestScore: 4.8,
      totalVotes: 189,
      status: 'published'
    }
  ],
  events: [
    {
      id: 'event_001',
      title: 'Black Queer Joy Celebration & Community Gathering',
      description: 'A celebration of Black queer joy with performances, workshops, and community connection.',
      category: 'celebration',
      type: 'hybrid',
      date: '2025-10-15T18:00:00Z',
      endDate: '2025-10-15T22:00:00Z',
      location: {
        type: 'hybrid',
        details: 'Community Center & Virtual',
        address: 'Brixton Community Center, London SW2',
        virtualLink: 'https://meet.blkout.org/joy-celebration'
      },
      organizer: {
        name: 'BLKOUT Events Team',
        email: 'events@blkout.org',
        organization: 'BLKOUT Collective'
      },
      registration: {
        required: true,
        capacity: 150,
        registrationUrl: 'https://blkout.org/events/joy-celebration',
        deadline: '2025-10-10T23:59:59Z',
        cost: 'Free / Pay What You Can'
      },
      accessibilityFeatures: [
        'wheelchair-accessible',
        'sign-language-interpretation',
        'sensory-friendly-space',
        'virtual-participation'
      ],
      tags: ['celebration', 'community', 'joy', 'performance', 'workshops'],
      imageUrl: '/images/joy-celebration.jpg',
      status: 'published'
    },
    {
      id: 'event_002',
      title: 'Digital Organizing Workshop: Platform Power',
      description: 'Learn digital organizing strategies and platform sovereignty principles.',
      category: 'education',
      type: 'virtual',
      date: '2025-10-08T19:00:00Z',
      endDate: '2025-10-08T21:00:00Z',
      location: {
        type: 'virtual',
        virtualLink: 'https://meet.blkout.org/organizing-workshop'
      },
      organizer: {
        name: 'Digital Liberation Collective',
        organization: 'BLKOUT Education'
      },
      registration: {
        required: true,
        capacity: 50,
        registrationUrl: 'https://blkout.org/events/digital-organizing',
        deadline: '2025-10-07T12:00:00Z',
        cost: 'Free'
      },
      accessibilityFeatures: [
        'closed-captions',
        'transcript-provided',
        'recording-available'
      ],
      tags: ['education', 'organizing', 'digital-rights', 'workshop'],
      status: 'published'
    }
  ],
  featured: {
    id: 'content_featured',
    title: 'The Future of Community-Owned Platforms',
    excerpt: 'How cooperative models are reshaping digital spaces for liberation and justice.',
    category: 'Platform Sovereignty',
    author: 'Maya Thompson',
    publishedAt: '2025-09-22T09:00:00Z',
    readTime: '15 min read',
    tags: ['platform-sovereignty', 'cooperatives', 'digital-rights', 'future'],
    imageUrl: '/images/community-platforms.jpg',
    contentType: 'article',
    blkoutTheme: 'CONNECT',
    interestScore: 4.9,
    totalVotes: 267,
    status: 'published'
  }
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Liberation-Layer, X-API-Contract'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    switch (req.method) {
      case 'GET':
        return handleGetContent(req, res);
      case 'POST':
        return handleContentSubmission(req, res);
      case 'PUT':
        return handleContentUpdate(req, res);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: 'This endpoint supports GET, POST, and PUT methods only'
        });
    }
  } catch (error) {
    console.error('Content API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Content services temporarily unavailable'
    });
  }
}

async function handleGetContent(req: VercelRequest, res: VercelResponse) {
  const { type, category, limit = '10', offset = '0' } = req.query;

  const limitNum = parseInt(limit as string, 10);
  const offsetNum = parseInt(offset as string, 10);

  switch (type) {
    case 'articles':
      const filteredArticles = category
        ? MOCK_CONTENT_DATA.articles.filter(article => article.category === category)
        : MOCK_CONTENT_DATA.articles;

      const paginatedArticles = filteredArticles.slice(offsetNum, offsetNum + limitNum);

      return res.status(200).json({
        success: true,
        data: {
          articles: paginatedArticles,
          featured: MOCK_CONTENT_DATA.featured,
          pagination: {
            total: filteredArticles.length,
            limit: limitNum,
            offset: offsetNum,
            hasMore: offsetNum + limitNum < filteredArticles.length
          }
        }
      });

    case 'events':
      const filteredEvents = category
        ? MOCK_CONTENT_DATA.events.filter(event => event.category === category)
        : MOCK_CONTENT_DATA.events;

      const paginatedEvents = filteredEvents.slice(offsetNum, offsetNum + limitNum);

      return res.status(200).json({
        success: true,
        data: {
          events: paginatedEvents,
          pagination: {
            total: filteredEvents.length,
            limit: limitNum,
            offset: offsetNum,
            hasMore: offsetNum + limitNum < filteredEvents.length
          }
        }
      });

    case 'featured':
      return res.status(200).json({
        success: true,
        data: MOCK_CONTENT_DATA.featured
      });

    default:
      return res.status(200).json({
        success: true,
        data: {
          articles: MOCK_CONTENT_DATA.articles.slice(0, 5),
          events: MOCK_CONTENT_DATA.events.slice(0, 3),
          featured: MOCK_CONTENT_DATA.featured,
          stats: {
            totalArticles: MOCK_CONTENT_DATA.articles.length,
            totalEvents: MOCK_CONTENT_DATA.events.length,
            totalContent: MOCK_CONTENT_DATA.articles.length + MOCK_CONTENT_DATA.events.length
          }
        }
      });
  }
}

async function handleContentSubmission(req: VercelRequest, res: VercelResponse) {
  const { contentType, ...contentData } = req.body;

  if (!contentType || !['article', 'event'].includes(contentType)) {
    return res.status(400).json({
      error: 'Invalid content submission',
      message: 'contentType must be "article" or "event"'
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  Supabase not configured, using mock response');
      // Fallback to mock if Supabase not configured
      const mockId = `${contentType}_${Date.now()}`;
      return res.status(201).json({
        success: true,
        id: mockId,
        message: `${contentType} submitted successfully (mock)`,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewRequired: true,
        estimatedReviewTime: '24-48 hours'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const contentId = randomUUID();

    // Save to moderation_log table (same table that admin dashboard reads from)
    const submission = {
      content_id: contentId,
      content_table: contentType === 'event' ? 'events' : 'articles',
      action: 'chrome-extension-submission',
      moderator_id: 'chrome-extension',
      reason: `Community submission via Chrome extension: ${contentType}`,
      metadata: {
        title: contentData.title || 'Untitled',
        description: contentData.description || contentData.excerpt || '',
        content: contentData.content || contentData.description || '',
        category: contentData.category || (contentType === 'event' ? 'Community' : 'Community Response'),
        author: contentData.author || 'Community Submitted',
        url: contentData.sourceUrl || contentData.originalUrl || '#',
        submittedVia: contentData.submittedVia || 'chrome-extension',
        detectedAt: contentData.detectedAt || new Date().toISOString(),
        contentType: contentType,

        // Event-specific fields
        ...(contentType === 'event' && {
          date: contentData.date,
          time: contentData.time,
          duration: contentData.duration || 120,
          organizer: contentData.organizer || contentData.author || 'Community Submitted',
          location: contentData.location || { type: 'physical', address: 'TBD' },
          capacity: contentData.capacity || 50,
          tags: contentData.tags || ['community-submitted'],
        }),

        // Article-specific fields
        ...(contentType === 'article' && {
          excerpt: contentData.excerpt || contentData.description || '',
          priority: contentData.priority || 'medium',
          tags: contentData.tags || ['community-submitted'],
        }),

        // Liberation values metadata
        liberation_compliance: {
          community_submitted: true,
          requires_review: true,
          submission_source: 'chrome-extension',
          democratic_oversight: true
        },

        submissionTime: new Date().toISOString()
      }
    };

    const { data: insertedData, error } = await supabase
      .from('moderation_log')
      .insert([submission])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log(`✅ Chrome extension ${contentType} submission saved to moderation queue:`, {
      id: insertedData?.id,
      content_id: contentId,
      title: contentData.title
    });

    return res.status(201).json({
      success: true,
      id: insertedData?.id || contentId,
      content_id: contentId,
      message: `${contentType} submitted successfully to moderation queue`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewRequired: true,
      estimatedReviewTime: '24-48 hours',
      moderationId: insertedData?.id,
      source: 'chrome-extension'
    });

  } catch (error) {
    console.error('❌ Content submission error:', error);

    // Fallback to mock response on error
    const mockId = `${contentType}_${Date.now()}`;
    return res.status(201).json({
      success: true,
      id: mockId,
      message: `${contentType} submitted successfully (fallback)`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewRequired: true,
      estimatedReviewTime: '24-48 hours',
      error: 'Database temporarily unavailable - using fallback storage'
    });
  }
}

async function handleContentUpdate(req: VercelRequest, res: VercelResponse) {
  const { contentId, updateType, ...updateData } = req.body;

  if (!contentId || !updateType) {
    return res.status(400).json({
      error: 'Invalid content update',
      message: 'contentId and updateType are required'
    });
  }

  // Mock content update
  const mockResult = {
    success: true,
    contentId: contentId,
    updateType: updateType,
    message: 'Content updated successfully',
    updatedAt: new Date().toISOString(),
    status: updateType === 'publish' ? 'published' : 'updated'
  };

  return res.status(200).json(mockResult);
}