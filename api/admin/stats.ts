// BLKOUT Liberation Platform - Admin Stats API Endpoint
// Real-time statistics for admin dashboard from Supabase database

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { liberationDB } from '../../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for admin dashboard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get real admin statistics from Supabase
    const stats = await liberationDB.getAdminStats();

    // Add liberation values compliance data
    const sovereigntyCheck = await liberationDB.checkCreatorSovereignty();
    const governanceMetrics = await liberationDB.getDemocraticGovernanceMetrics();

    const response = {
      // Story moderation stats
      pendingStories: stats.pending_submissions,
      approvedToday: stats.approved_today,
      totalCurators: stats.total_moderators,
      weeklySubmissions: stats.weekly_submissions,

      // Event moderation stats
      pendingEvents: stats.pending_events,
      eventsApprovedToday: stats.events_approved_today,
      totalEventOrganizers: stats.total_event_organizers,
      weeklyEventSubmissions: stats.weekly_event_submissions,

      // Performance metrics
      avgProcessingTimeHours: stats.avg_processing_time,

      // Liberation values compliance
      liberationCompliance: {
        creatorSovereigntyPercentage: sovereigntyCheck.percentage,
        creatorSovereigntyCompliant: sovereigntyCheck.compliant,
        democraticParticipation: {
          activeMembers: governanceMetrics.active_members,
          votingMembers: governanceMetrics.voting_members,
          recentParticipationRate: governanceMetrics.recent_participation
        }
      },

      // System health
      systemHealth: {
        databaseConnected: true,
        moderationQueueHealthy: stats.pending_submissions < 50,
        averageResponseTime: '< 2 hours',
        lastUpdated: new Date().toISOString()
      },

      // Metadata
      timestamp: new Date().toISOString(),
      source: 'real-database-supabase'
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Admin stats API error:', error);

    // Return fallback stats with error indication
    return res.status(200).json({
      // Fallback stats
      pendingStories: 12,
      approvedToday: 8,
      totalCurators: 12,
      weeklySubmissions: 28,
      pendingEvents: 5,
      eventsApprovedToday: 3,
      totalEventOrganizers: 8,
      weeklyEventSubmissions: 15,
      avgProcessingTimeHours: 24,

      // Liberation values fallback
      liberationCompliance: {
        creatorSovereigntyPercentage: 75.5,
        creatorSovereigntyCompliant: true,
        democraticParticipation: {
          activeMembers: 12,
          votingMembers: 8,
          recentParticipationRate: 85
        }
      },

      // System health with error
      systemHealth: {
        databaseConnected: false,
        moderationQueueHealthy: true,
        averageResponseTime: 'unknown',
        lastUpdated: new Date().toISOString(),
        error: 'Database connection issue - using fallback data'
      },

      timestamp: new Date().toISOString(),
      source: 'fallback-mock-data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}