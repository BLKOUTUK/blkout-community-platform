// BLKOUT Liberation Platform - Admin Stats API Endpoint
// Proxy to Railway backend for real-time statistics

import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    // Proxy request to Railway backend
    const railwayResponse = await fetch('https://blkout-api-railway-production.up.railway.app/api/admin/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (railwayResponse.ok) {
      const railwayData = await railwayResponse.json();
      return res.status(200).json(railwayData);
    } else {
      throw new Error(`Railway API error: ${railwayResponse.status}`);
    }

  } catch (error) {
    console.error('Railway proxy error:', error);

    // Return fallback stats when Railway is unavailable
    return res.status(200).json({
      // Fallback stats showing Railway connection issue
      pendingStories: 11, // We know there are 11 submissions
      approvedToday: 0,
      totalCurators: 8,
      weeklySubmissions: 15,
      pendingEvents: 2,
      eventsApprovedToday: 0,
      totalEventOrganizers: 5,
      weeklyEventSubmissions: 3,
      avgProcessingTimeHours: 24,

      // Liberation values fallback
      liberationCompliance: {
        creatorSovereigntyPercentage: 75.0,
        creatorSovereigntyCompliant: true,
        democraticParticipation: {
          activeMembers: 8,
          votingMembers: 5,
          recentParticipationRate: 85
        }
      },

      // System health with Railway proxy status
      systemHealth: {
        databaseConnected: false,
        moderationQueueHealthy: true,
        averageResponseTime: 'Railway API unavailable',
        lastUpdated: new Date().toISOString(),
        error: 'Railway backend connection failed - using fallback data'
      },

      timestamp: new Date().toISOString(),
      source: 'vercel-fallback-railway-proxy',
      error: error instanceof Error ? error.message : 'Railway connection error'
    });
  }
}