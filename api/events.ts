// BLKOUT Liberation Platform - Events API Endpoint
// Fetches approved events for Events Calendar page
// Returns migrated event data

import { VercelRequest, VercelResponse } from '@vercel/node';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Migrated events data
const MIGRATED_EVENTS = [
  {
    id: 'event_migrated_001',
    title: 'Black Queer Joy Celebration & Community Gathering',
    description: 'Monthly celebration of Black queer joy featuring performances, workshops, and community connection.',
    category: 'celebration',
    type: 'hybrid',
    date: '2025-01-15T18:00:00Z',
    endDate: '2025-01-15T22:00:00Z',
    location: {
      type: 'hybrid',
      details: 'Brixton Community Center & Virtual',
      address: 'Brixton Community Center, London SW2',
      virtualLink: 'https://meet.blkout.org/joy-celebration'
    },
    organizer: {
      name: 'BLKOUT Joy Collective',
      email: 'joy@blkout.org',
      organization: 'BLKOUT Community'
    },
    registration: {
      required: true,
      capacity: 150,
      registrationUrl: 'https://blkout.org/events/joy-celebration',
      deadline: '2025-01-14T23:59:59Z',
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
    status: 'published',
    featured: true
  },
  {
    id: 'event_migrated_002',
    title: 'Digital Organizing Workshop: Building Community Power Online',
    description: 'Learn digital organizing strategies for community mobilization and platform sovereignty.',
    category: 'education',
    type: 'virtual',
    date: '2025-01-08T19:00:00Z',
    endDate: '2025-01-08T21:00:00Z',
    location: {
      type: 'virtual',
      virtualLink: 'https://meet.blkout.org/digital-organizing'
    },
    organizer: {
      name: 'Digital Liberation Collective',
      organization: 'BLKOUT Education'
    },
    registration: {
      required: true,
      capacity: 100,
      registrationUrl: 'https://blkout.org/events/digital-organizing',
      deadline: '2025-01-07T12:00:00Z',
      cost: 'Free'
    },
    accessibilityFeatures: [
      'closed-captions',
      'transcript-provided',
      'recording-available',
      'multiple-language-support'
    ],
    tags: ['education', 'organizing', 'digital-rights', 'workshop'],
    status: 'published'
  },
  {
    id: 'event_migrated_003',
    title: 'Mutual Aid Distribution & Resource Share',
    description: 'Weekly community mutual aid distribution providing food, supplies, and resources.',
    category: 'mutual-aid',
    type: 'in-person',
    date: '2025-01-10T14:00:00Z',
    endDate: '2025-01-10T18:00:00Z',
    location: {
      type: 'in-person',
      details: 'Peckham Community Hub',
      address: '123 Rye Lane, Peckham, London SE15'
    },
    organizer: {
      name: 'South London Mutual Aid',
      organization: 'BLKOUT Mutual Aid Network'
    },
    registration: {
      required: false,
      cost: 'Free - No registration needed'
    },
    accessibilityFeatures: [
      'wheelchair-accessible',
      'assistance-available',
      'child-friendly',
      'pet-friendly'
    ],
    tags: ['mutual-aid', 'community-support', 'resources', 'food-distribution'],
    status: 'published'
  },
  {
    id: 'event_migrated_004',
    title: 'Black Trans Healing Circle',
    description: 'Monthly healing circle providing safe space for Black trans community members to connect and heal together.',
    category: 'support',
    type: 'in-person',
    date: '2025-01-20T17:00:00Z',
    endDate: '2025-01-20T19:00:00Z',
    location: {
      type: 'in-person',
      details: 'Confidential - Register for location',
      address: 'Location provided upon registration'
    },
    organizer: {
      name: 'Black Trans Wellness',
      organization: 'BLKOUT Health Collective'
    },
    registration: {
      required: true,
      capacity: 20,
      registrationUrl: 'https://blkout.org/events/healing-circle',
      deadline: '2025-01-19T17:00:00Z',
      cost: 'Free'
    },
    accessibilityFeatures: [
      'trauma-informed',
      'confidential-location',
      'comfortable-seating',
      'refreshments-provided'
    ],
    tags: ['healing', 'support', 'Black-trans', 'wellness', 'community-care'],
    status: 'published'
  },
  {
    id: 'event_migrated_005',
    title: 'Liberation Film Screening: Revolutionary Stories',
    description: 'Screening of documentaries highlighting Black queer liberation movements followed by community discussion.',
    category: 'education',
    type: 'hybrid',
    date: '2025-01-25T19:00:00Z',
    endDate: '2025-01-25T22:00:00Z',
    location: {
      type: 'hybrid',
      details: 'Hackney Picturehouse & Online',
      address: '270 Mare St, London E8 1HE',
      virtualLink: 'https://watch.blkout.org/film-screening'
    },
    organizer: {
      name: 'BLKOUT Film Collective',
      email: 'films@blkout.org'
    },
    registration: {
      required: true,
      capacity: 80,
      registrationUrl: 'https://blkout.org/events/film-screening',
      cost: '£5 suggested donation'
    },
    accessibilityFeatures: [
      'wheelchair-accessible',
      'audio-description',
      'subtitles',
      'quiet-space-available'
    ],
    tags: ['film', 'education', 'history', 'liberation', 'documentary'],
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
      type,
      upcoming = 'true',
      limit = '20',
      offset = '0'
    } = req.query;

    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    // Filter events
    let filteredEvents = [...MIGRATED_EVENTS];

    // Filter by category
    if (category && category !== 'all') {
      filteredEvents = filteredEvents.filter(e =>
        e.category === (category as string)
      );
    }

    // Filter by type
    if (type && type !== 'all') {
      filteredEvents = filteredEvents.filter(e =>
        e.type === (type as string)
      );
    }

    // Filter upcoming events
    if (upcoming === 'true') {
      const now = new Date();
      filteredEvents = filteredEvents.filter(e =>
        new Date(e.date) >= now
      );
    }

    // Sort by date
    filteredEvents.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Apply pagination
    const paginatedEvents = filteredEvents.slice(offsetNum, offsetNum + limitNum);

    return res.status(200).json({
      success: true,
      data: {
        events: paginatedEvents,
        pagination: {
          total: filteredEvents.length,
          limit: limitNum,
          offset: offsetNum,
          hasMore: offsetNum + limitNum < filteredEvents.length,
          page: Math.floor(offsetNum / limitNum) + 1,
          totalPages: Math.ceil(filteredEvents.length / limitNum)
        },
        categories: ['mutual-aid', 'organizing', 'education', 'celebration', 'support', 'action'],
        featured: filteredEvents.find(e => e.featured) || null
      }
    });

  } catch (error) {
    console.error('Events API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch events'
    });
  }
}