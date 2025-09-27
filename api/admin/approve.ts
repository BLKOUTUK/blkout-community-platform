// BLKOUT Liberation Platform - Content Approval Endpoint
// Handles approval of stories and events from moderation queue
// Moves content to published tables and updates status

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  // Only support POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint supports POST method only'
    });
  }

  try {
    const { contentId, contentType, action } = req.body;

    if (!contentId || !contentType || !action) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'contentId, contentType, and action are required'
      });
    }

    if (!['story', 'event', 'article'].includes(contentType)) {
      return res.status(400).json({
        error: 'Invalid content type',
        message: 'contentType must be "story", "event", or "article"'
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'action must be "approve" or "reject"'
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Database connection not configured'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'approve') {
      return await handleApproval(supabase, contentId, contentType, res);
    } else {
      return await handleRejection(supabase, contentId, contentType, res);
    }

  } catch (error) {
    console.error('Content approval error:', error);
    return res.status(500).json({
      success: false,
      error: 'Content approval failed',
      message: error?.message || 'Unknown error occurred'
    });
  }
}

async function handleApproval(supabase: any, contentId: string, contentType: string, res: VercelResponse) {
  try {
    // Get content from moderation queue
    const { data: queueItem, error: fetchError } = await supabase
      .from('moderation_queue')
      .select('*')
      .eq('id', contentId)
      .single();

    if (fetchError || !queueItem) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
        message: 'Content not found in moderation queue'
      });
    }

    // Determine target table and prepare data
    let targetTable: string;
    let publishedData: any;

    if (contentType === 'story' || contentType === 'article') {
      targetTable = 'published_news';
      publishedData = {
        title: queueItem.title,
        content: queueItem.content || queueItem.excerpt || '',
        excerpt: queueItem.excerpt || '',
        author: queueItem.submitted_by || 'Community Curator',
        category: queueItem.category || 'General',
        tags: queueItem.tags || [],
        image_url: queueItem.image_url,
        original_url: queueItem.url,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source: 'moderation_approval',
        status: 'published',
        content_type: 'article',
        read_time: estimateReadTime(queueItem.content || queueItem.excerpt || ''),
        metadata: {
          submitted_at: queueItem.submitted_at,
          approved_from_queue: true,
          original_submission_id: contentId
        }
      };
    } else if (contentType === 'event') {
      targetTable = 'published_events';
      publishedData = {
        title: queueItem.title,
        description: queueItem.content || queueItem.excerpt || '',
        category: queueItem.category || 'community',
        author: queueItem.submitted_by || 'Community Organizer',
        tags: queueItem.tags || [],
        image_url: queueItem.image_url,
        original_url: queueItem.url,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source: 'moderation_approval',
        status: 'published',
        event_date: queueItem.event_date || new Date().toISOString(),
        location: queueItem.location || 'TBD',
        organizer: queueItem.submitted_by || 'Community Organizer',
        metadata: {
          submitted_at: queueItem.submitted_at,
          approved_from_queue: true,
          original_submission_id: contentId
        }
      };
    }

    // Insert into published table
    const { data: publishedContent, error: publishError } = await supabase
      .from(targetTable)
      .insert(publishedData)
      .select()
      .single();

    if (publishError) {
      console.error('Error publishing content:', publishError);
      return res.status(500).json({
        success: false,
        error: 'Publishing failed',
        message: `Failed to publish content: ${publishError.message}`
      });
    }

    // Update moderation queue status
    const { error: updateError } = await supabase
      .from('moderation_queue')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin' // TODO: Add actual user authentication
      })
      .eq('id', contentId);

    if (updateError) {
      console.error('Error updating queue status:', updateError);
      // Content is published but queue status not updated - log but don't fail
    }

    // Log the approval
    await supabase
      .from('moderation_log')
      .insert({
        content_id: contentId,
        content_table: 'moderation_queue',
        action: 'approved',
        timestamp: new Date().toISOString(),
        reviewed_by: 'admin',
        metadata: {
          published_id: publishedContent.id,
          published_table: targetTable,
          content_type: contentType
        }
      });

    return res.status(200).json({
      success: true,
      message: `${contentType} approved and published successfully`,
      publishedId: publishedContent.id,
      originalId: contentId,
      publishedAt: new Date().toISOString(),
      targetTable: targetTable
    });

  } catch (error) {
    console.error('Approval process error:', error);
    return res.status(500).json({
      success: false,
      error: 'Approval failed',
      message: error?.message || 'Unknown error during approval'
    });
  }
}

function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

async function handleRejection(supabase: any, contentId: string, contentType: string, res: VercelResponse) {
  try {
    // Verify content exists in moderation queue
    const { data: queueItem, error: fetchError } = await supabase
      .from('moderation_queue')
      .select('*')
      .eq('id', contentId)
      .single();

    if (fetchError || !queueItem) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
        message: 'Content not found in moderation queue'
      });
    }

    // Update moderation queue status to rejected
    const { error: updateError } = await supabase
      .from('moderation_queue')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin' // TODO: Add actual user authentication
      })
      .eq('id', contentId);

    if (updateError) {
      console.error('Error rejecting content:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Rejection failed',
        message: `Failed to update content status: ${updateError.message}`
      });
    }

    // Log the rejection
    await supabase
      .from('moderation_log')
      .insert({
        content_id: contentId,
        content_table: 'moderation_queue',
        action: 'rejected',
        timestamp: new Date().toISOString(),
        reviewed_by: 'admin',
        metadata: {
          content_type: contentType,
          original_title: queueItem.title
        }
      });

    return res.status(200).json({
      success: true,
      message: `${contentType} rejected successfully`,
      contentId: contentId,
      rejectedAt: new Date().toISOString(),
      title: queueItem.title
    });

  } catch (error) {
    console.error('Rejection process error:', error);
    return res.status(500).json({
      success: false,
      error: 'Rejection failed',
      message: error?.message || 'Unknown error during rejection'
    });
  }
}