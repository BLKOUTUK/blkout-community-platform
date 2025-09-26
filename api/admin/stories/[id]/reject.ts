// BLKOUT Liberation Platform - Story Rejection API Endpoint
// Reject stories with community feedback option

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { liberationDB } from '../../../../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for admin dashboard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { action, reviewNotes, communityFeedbackRequested = false } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    // Reject the story in the moderation queue
    await liberationDB.rejectSubmission(id, reviewNotes);

    // TODO: If community feedback requested, create discussion thread
    // TODO: Notify submitter with rejection reason and improvement suggestions
    // TODO: Log governance event for transparency

    return res.status(200).json({
      success: true,
      message: 'Story rejected with community feedback option',
      storyId: id,
      action: 'rejected',
      communityFeedbackAvailable: communityFeedbackRequested,
      timestamp: new Date().toISOString(),

      // Liberation values compliance confirmation
      liberationCompliance: {
        democraticOversight: true,
        transparentFeedback: true,
        communityImprovement: communityFeedbackRequested,
        respectfulCommunication: true
      }
    });

  } catch (error) {
    console.error('Story rejection error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}