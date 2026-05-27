// BLKOUT Liberation Platform - Stories API Endpoint
// Returns a unified feed of BLKOUT-authored writing across:
//   - public.archived_articles  (migrated blkoutuk.com archive, 2016-2024)
//   - public.voices_articles    (current BLKOUT editorial essays)
//   - public.public_newsletter_archive (newsletters cleared for public view)
//
// Merged in JS by published_at desc, then paginated. Slug/search filters
// apply per-table; newsletter slugs follow the synthetic `newsletter-<n>` form.

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
      slug,
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
      slug: slug as string,
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

// Common Story shape used by the client.
function fromArchived(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    category: 'Archive',
    author: 'BLKOUT Collective',
    publishedAt: row.published_at || row.created_at,
    readTime: estimateReadTime(row.content || ''),
    tags: [],
    imageUrl: row.featured_image,
    originalUrl: row.source_url,
    contentType: 'article',
    blkoutTheme: 'CONNECT',
    interestScore: row.liberation_score || 85,
    totalVotes: 0,
    status: row.status || 'published',
    source: 'archive',
    _sortKey: row.published_at || row.created_at || ''
  };
}

function fromVoices(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    category: row.category || 'Voices',
    author: row.author || 'BLKOUT Collective',
    publishedAt: row.published_at || row.created_at,
    readTime: estimateReadTime(row.content || ''),
    tags: row.tags || [],
    imageUrl: row.hero_image,
    originalUrl: undefined,
    contentType: 'article',
    blkoutTheme: 'CONNECT',
    interestScore: row.featured ? 95 : 85,
    totalVotes: 0,
    status: row.published ? 'published' : 'draft',
    source: 'voices',
    _sortKey: row.published_at || row.created_at || ''
  };
}

function fromNewsletter(row: any) {
  const dateForSort = row.public_publish_at || row.published_to_discover_at || row.sent_at || row.created_at || '';
  return {
    id: row.id,
    slug: `newsletter-${row.edition_number}`,
    title: row.title,
    excerpt: row.summary || '',
    content: row.html_content || '',
    category: 'Newsletter',
    author: 'BLKOUT Collective',
    publishedAt: dateForSort,
    readTime: estimateReadTime(row.html_content || ''),
    tags: [row.edition_type].filter(Boolean),
    imageUrl: undefined,
    originalUrl: undefined,
    contentType: 'article',
    blkoutTheme: 'CONNECT',
    interestScore: 90,
    totalVotes: 0,
    status: 'published',
    source: 'newsletter',
    _sortKey: dateForSort
  };
}

async function fetchFromSupabase(_req: VercelRequest, res: VercelResponse, supabaseUrl: string, supabaseServiceKey: string, params: any) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Each source is queried independently with its own filter shape. We
    // overshoot by fetching offset+limit per source (capped) so the JS merge
    // window always has enough rows to pick from.
    const cap = Math.min(params.offset + params.limit, 500);
    const range: [number, number] = [0, Math.max(0, cap - 1)];

    // archived_articles
    let archivedQ = supabase.from('archived_articles').select('*', { count: 'exact' });
    if (params.status === 'published') archivedQ = archivedQ.eq('status', 'published');
    if (params.slug) archivedQ = archivedQ.eq('slug', params.slug);
    if (params.search) {
      const t = `%${params.search}%`;
      archivedQ = archivedQ.or(`title.ilike.${t},excerpt.ilike.${t},content.ilike.${t}`);
    }
    archivedQ = archivedQ.order('published_at', { ascending: false, nullsFirst: false }).range(...range);

    // voices_articles (uses bool `published` rather than status string)
    let voicesQ = supabase.from('voices_articles').select('*', { count: 'exact' });
    if (params.status === 'published') voicesQ = voicesQ.eq('published', true);
    if (params.slug) voicesQ = voicesQ.eq('slug', params.slug);
    if (params.search) {
      const t = `%${params.search}%`;
      voicesQ = voicesQ.or(`title.ilike.${t},excerpt.ilike.${t},content.ilike.${t}`);
    }
    voicesQ = voicesQ.order('published_at', { ascending: false, nullsFirst: false }).range(...range);

    // public_newsletter_archive — filter to anything cleared for the public
    // surface (published_to_discover_at IS NOT NULL).
    let newsletterQ = supabase.from('public_newsletter_archive').select('*', { count: 'exact' })
      .not('published_to_discover_at', 'is', null);
    if (params.slug) {
      const m = String(params.slug).match(/^newsletter-(\d+)$/);
      if (m) newsletterQ = newsletterQ.eq('edition_number', parseInt(m[1], 10));
      else newsletterQ = newsletterQ.eq('id', '00000000-0000-0000-0000-000000000000'); // force empty
    }
    if (params.search) {
      const t = `%${params.search}%`;
      newsletterQ = newsletterQ.or(`title.ilike.${t},summary.ilike.${t},html_content.ilike.${t}`);
    }
    newsletterQ = newsletterQ.order('published_to_discover_at', { ascending: false, nullsFirst: false }).range(...range);

    const [archivedRes, voicesRes, newsletterRes] = await Promise.all([archivedQ, voicesQ, newsletterQ]);

    for (const [name, r] of [['archived_articles', archivedRes], ['voices_articles', voicesRes], ['public_newsletter_archive', newsletterRes]] as const) {
      if (r.error) {
        console.error(`${name} query error:`, r.error);
        throw r.error;
      }
    }

    const merged = [
      ...(archivedRes.data || []).map(fromArchived),
      ...(voicesRes.data || []).map(fromVoices),
      ...(newsletterRes.data || []).map(fromNewsletter)
    ];

    if (params.sortBy === 'title') {
      merged.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      merged.sort((a, b) => {
        if (!a._sortKey && !b._sortKey) return 0;
        if (!a._sortKey) return 1;
        if (!b._sortKey) return -1;
        return b._sortKey.localeCompare(a._sortKey);
      });
    }

    const total = (archivedRes.count || 0) + (voicesRes.count || 0) + (newsletterRes.count || 0);
    const windowed = merged.slice(params.offset, params.offset + params.limit);
    const stories = windowed.map(({ _sortKey, ...rest }) => rest);

    console.log(`📚 union: archived=${archivedRes.count} + voices=${voicesRes.count} + newsletter=${newsletterRes.count} = ${total}; serving ${stories.length} at offset ${params.offset}`);

    return res.status(200).json({
      success: true,
      data: {
        stories,
        pagination: {
          total,
          limit: params.limit,
          offset: params.offset,
          hasMore: params.offset + params.limit < total,
          page: Math.floor(params.offset / params.limit) + 1,
          totalPages: Math.ceil(total / params.limit)
        },
        categories: ['General'],
        stats: {
          totalPublished: total,
          averageInterestScore: 85
        },
        source: 'supabase-union',
        breakdown: {
          archived: archivedRes.count || 0,
          voices: voicesRes.count || 0,
          newsletter: newsletterRes.count || 0
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching from Supabase:', error);
    return res.status(502).json({
      success: false,
      error: 'Supabase fetch failed',
      message: error?.message || 'Could not load stories.'
    });
  }
}