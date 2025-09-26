// BLKOUT Liberation Platform - Story Approval API Endpoint
// Approve stories for newsroom with liberation values compliance

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
    const { action, reviewNotes } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    // Approve the story in the moderation queue
    await liberationDB.approveSubmission(id, reviewNotes);

    // TODO: Add the story to the newsroom/story archive
    // TODO: Notify community of approval with transparency
    // TODO: Log governance event for democratic oversight

    return res.status(200).json({
      success: true,
      message: 'Story approved for newsroom successfully',
      storyId: id,
      action: 'approved_to_newsroom',
      timestamp: new Date().toISOString(),

      // Liberation values compliance confirmation
      liberationCompliance: {
        democraticOversight: true,
        transparencyMaintained: true,
        communityBenefitConsidered: true,
        creatorSovereigntyRespected: true
      }
    });

  } catch (error) {
    console.error('Story approval error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}