// BLKOUT Liberation Platform - Event Moderation Queue API Endpoint
// Real-time event moderation data from Supabase database

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { liberationDB } from '../../../lib/supabase';

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
    // Get event-specific moderation queue from Supabase
    const eventQueue = await liberationDB.getModerationQueue('event');

    // Transform data for admin dashboard event moderation compatibility
    const transformedEvents = eventQueue.map(item => ({
      id: item.id,
      title: item.title,
      submittedBy: item.moderator_id || 'unknown',
      submittedAt: item.submitted_at,
      category: item.category as 'mutual-aid' | 'organizing' | 'education' | 'celebration' | 'support' | 'action',
      type: item.content_data?.event_type || 'in-person' as 'virtual' | 'in-person' | 'hybrid',
      date: item.content_data?.event_date || new Date().toISOString(),
      description: item.description,
      organizer: item.content_data?.organizer || 'Unknown Organizer',
      status: item.status as 'pending' | 'approved' | 'rejected',

      // Liberation values specific fields
      accessibilityFeatures: item.content_data?.accessibility_features || [],
      traumaInformedDesign: item.content_data?.trauma_informed || false,
      communityBenefitScore: item.content_data?.community_benefit_score || 0,
      culturalAuthenticityVerified: item.content_data?.cultural_authenticity || false,

      // Moderation metadata
      priority: item.priority || 'medium',
      assignedModerator: item.content_data?.assigned_moderator,
      reviewNotes: item.content_data?.review_notes,
      flagReason: item.content_data?.flag_reason,

      // Community engagement
      communityVotes: item.community_votes || {},
      ivorAnalysis: item.content_data?.ivor_analysis,

      // Event-specific data
      eventDetails: {
        location: item.content_data?.location,
        capacity: item.content_data?.capacity,
        registrationRequired: item.content_data?.registration_required || false,
        cost: item.content_data?.cost || 'Free',
        childcare: item.content_data?.childcare_available || false,
        accessibleVenue: item.content_data?.accessible_venue || false,
        languageSupport: item.content_data?.language_support || [],
        contentWarnings: item.content_data?.content_warnings || []
      }
    }));

    // Sort by priority and submission date
    transformedEvents.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

    const response = {
      events: transformedEvents,

      metadata: {
        total: transformedEvents.length,
        pending: transformedEvents.filter(e => e.status === 'pending').length,
        approved: transformedEvents.filter(e => e.status === 'approved').length,
        rejected: transformedEvents.filter(e => e.status === 'rejected').length,
        timestamp: new Date().toISOString(),
        source: 'real-database-supabase'
      },

      // Liberation values analytics
      liberationAnalytics: {
        traumaInformedEvents: transformedEvents.filter(e => e.traumaInformedDesign).length,
        accessibleEvents: transformedEvents.filter(e =>
          e.eventDetails.accessibleVenue || e.accessibilityFeatures.length > 0
        ).length,
        communityBenefitHighScore: transformedEvents.filter(e =>
          e.communityBenefitScore > 0.8
        ).length,
        culturallyAuthenticEvents: transformedEvents.filter(e =>
          e.culturalAuthenticityVerified
        ).length,

        // Category breakdown
        categoryBreakdown: {
          'mutual-aid': transformedEvents.filter(e => e.category === 'mutual-aid').length,
          'organizing': transformedEvents.filter(e => e.category === 'organizing').length,
          'education': transformedEvents.filter(e => e.category === 'education').length,
          'celebration': transformedEvents.filter(e => e.category === 'celebration').length,
          'support': transformedEvents.filter(e => e.category === 'support').length,
          'action': transformedEvents.filter(e => e.category === 'action').length
        }
      }
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Event moderation queue API error:', error);

    // Return fallback mock event data
    return res.status(200).json({
      events: [
        {
          id: 'event-mock-1',
          title: 'Black Queer Youth Mental Health Workshop',
          submittedBy: 'liberation_collective_001',
          submittedAt: new Date().toISOString(),
          category: 'education',
          type: 'hybrid',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Trauma-informed mental health workshop specifically designed for Black queer youth, incorporating healing justice practices and community care principles.',
          organizer: 'Liberation Mental Health Collective',
          status: 'pending',
          accessibilityFeatures: ['ASL interpretation', 'Wheelchair accessible', 'Sensory-friendly lighting'],
          traumaInformedDesign: true,
          communityBenefitScore: 0.95,
          culturalAuthenticityVerified: true,
          priority: 'high',
          eventDetails: {
            location: 'Community Center + Online',
            capacity: 30,
            registrationRequired: true,
            cost: 'Free',
            childcare: true,
            accessibleVenue: true,
            languageSupport: ['English', 'Spanish', 'ASL'],
            contentWarnings: ['Discussion of mental health challenges', 'Trauma healing work']
          }
        },
        {
          id: 'event-mock-2',
          title: 'Community Mutual Aid Resource Distribution',
          submittedBy: 'mutual_aid_coordinator',
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          category: 'mutual-aid',
          type: 'in-person',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Weekly community-organized distribution of food, clothing, and essential resources. No questions asked, all community members welcome.',
          organizer: 'BLKOUT Mutual Aid Network',
          status: 'pending',
          accessibilityFeatures: ['Wheelchair accessible', 'Multiple language support'],
          traumaInformedDesign: true,
          communityBenefitScore: 1.0,
          culturalAuthenticityVerified: true,
          priority: 'urgent',
          eventDetails: {
            location: 'Community Garden, 123 Liberation Ave',
            capacity: 100,
            registrationRequired: false,
            cost: 'Free',
            childcare: false,
            accessibleVenue: true,
            languageSupport: ['English', 'Spanish', 'Amharic'],
            contentWarnings: []
          }
        }
      ],

      metadata: {
        total: 2,
        pending: 2,
        approved: 0,
        rejected: 0,
        timestamp: new Date().toISOString(),
        source: 'fallback-mock-data',
        error: 'Database connection issue - using fallback data'
      },

      liberationAnalytics: {
        traumaInformedEvents: 2,
        accessibleEvents: 2,
        communityBenefitHighScore: 2,
        culturallyAuthenticEvents: 2,
        categoryBreakdown: {
          'mutual-aid': 1,
          'organizing': 0,
          'education': 1,
          'celebration': 0,
          'support': 0,
          'action': 0
        }
      }
    });
  }
}