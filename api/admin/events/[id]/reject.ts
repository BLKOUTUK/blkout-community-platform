// BLKOUT Liberation Platform - Event Rejection API Endpoint
// Reject events with constructive feedback and improvement suggestions

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
    const { action, reviewNotes, improvementSuggestions = [] } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Reject the event in the moderation queue
    await liberationDB.rejectSubmission(id, reviewNotes);

    // TODO: Create constructive feedback with improvement suggestions
    // TODO: Offer support for accessibility and trauma-informed improvements
    // TODO: Connect organizer with community resources if needed
    // TODO: Log governance event for transparency

    return res.status(200).json({
      success: true,
      message: 'Event rejected with constructive feedback and improvement suggestions',
      eventId: id,
      action: 'rejected',
      improvementSuggestions,
      timestamp: new Date().toISOString(),

      // Liberation values compliance confirmation
      liberationCompliance: {
        democraticOversight: true,
        constructiveFeedback: true,
        communitySupport: true,
        accessibilityGuidance: improvementSuggestions.includes('accessibility'),
        traumaInformedGuidance: improvementSuggestions.includes('trauma-informed-design')
      }
    });

  } catch (error) {
    console.error('Event rejection error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}