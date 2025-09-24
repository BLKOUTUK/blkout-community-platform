import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase client with anon key for proper data governance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// CORS headers for Chrome extension
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  // Add CORS headers to all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const { method, url } = req;
  const urlPath = url?.split('?')[0];

  try {
    switch (method) {
      case 'GET':
        if (urlPath === '/api/moderation-queue') {
          // Get all submissions (for admin) - using moderation_log table
          const { data: submissions, error } = await supabase
            .from('moderation_log')
            .select('*')
            .order('timestamp', { ascending: false });

          if (error) {
            console.error('❌ Database error:', error);
            return res.status(500).json({ success: false, error: error.message });
          }

          // Calculate stats based on actions
          const stats = {
            totalSubmissions: submissions?.length || 0,
            pendingCount: submissions?.filter(s => !s.action || s.action === 'pending').length || 0,
            approvedCount: submissions?.filter(s => s.action === 'approved').length || 0,
            rejectedCount: submissions?.filter(s => s.action === 'rejected').length || 0
          };

          return res.status(200).json({
            success: true,
            data: submissions || [],
            stats
          });
        }

        if (urlPath === '/api/moderation-queue/size') {
          // Get queue size - count items without approval/rejection
          const { count, error } = await supabase
            .from('moderation_log')
            .select('id', { count: 'exact' })
            .not('action', 'in', '(approved,rejected)');

          if (error) {
            console.error('❌ Database error:', error);
            return res.status(500).json({ success: false, error: error.message });
          }

          return res.status(200).json({
            success: true,
            queueSize: count || 0
          });
        }

        return res.status(404).json({ success: false, error: 'Endpoint not found' });

      case 'POST':
        if (urlPath === '/api/moderation-queue') {
          // Submit new content to moderation_log
          const { type, data, moderatorId } = req.body;

          if (!data || !type) {
            return res.status(400).json({
              success: false,
              error: 'Missing required fields: type and data'
            });
          }

          // Generate a content_id for the submission
          const contentId = randomUUID();

          const submission = {
            content_id: contentId,
            content_table: type, // event, news, story, etc.
            action: 'submitted', // Initial submission status
            moderator_id: moderatorId || null,
            reason: `Content submitted via Chrome extension: ${data.title || 'Untitled'}`,
            metadata: {
              ...data,
              url: data.metadata?.url || data.url || '',
              title: data.edited?.title || data.original?.title || '',
              summary: data.edited?.summary || data.original?.summary || '',
              extractedBy: 'chrome-extension',
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
            return res.status(500).json({ success: false, error: error.message });
          }

          console.log(`📝 New submission added to moderation log:`, {
            id: insertedData?.id,
            content_table: insertedData?.content_table,
            content_id: insertedData?.content_id
          });

          return res.status(201).json({
            success: true,
            message: 'Content submitted to moderation log',
            submissionId: insertedData?.id,
            data: insertedData
          });
        }

        return res.status(404).json({ success: false, error: 'Endpoint not found' });

      case 'PUT':
        if (urlPath?.startsWith('/api/moderation-queue/')) {
          // Update submission action (approve/reject) in moderation_log
          const submissionId = urlPath.split('/').pop();
          const { action, reason, reviewerId } = req.body;

          if (!submissionId) {
            return res.status(400).json({
              success: false,
              error: 'Submission ID is required'
            });
          }

          if (!action || !['approved', 'rejected', 'edited', 'archived'].includes(action)) {
            return res.status(400).json({
              success: false,
              error: 'Valid action is required (approved, rejected, edited, archived)'
            });
          }

          // First check if submission exists
          const { data: existingSubmission, error: fetchError } = await supabase
            .from('moderation_log')
            .select('*')
            .eq('id', submissionId)
            .single();

          if (fetchError || !existingSubmission) {
            console.error('❌ Submission not found:', fetchError);
            return res.status(404).json({
              success: false,
              error: 'Submission not found'
            });
          }

          // Update submission with new action and review information
          const updateData = {
            action,
            reason: reason || `Action: ${action}`,
            moderator_id: reviewerId || existingSubmission.moderator_id,
            timestamp: new Date().toISOString()
          };

          const { data: updatedSubmission, error: updateError } = await supabase
            .from('moderation_log')
            .update(updateData)
            .eq('id', submissionId)
            .select()
            .single();

          if (updateError) {
            console.error('❌ Database update error:', updateError);
            return res.status(500).json({
              success: false,
              error: updateError.message
            });
          }

          console.log(`📋 Submission ${submissionId} action updated: ${existingSubmission.action} → ${action}`);

          return res.status(200).json({
            success: true,
            message: `Submission ${action}`,
            data: updatedSubmission
          });
        }

        return res.status(404).json({ success: false, error: 'Endpoint not found' });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`
        });
    }
  } catch (error) {
    console.error('❌ Moderation queue API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}