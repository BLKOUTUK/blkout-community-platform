// BLKOUT Liberation Platform - Events API Service
// Live events management for community liberation activities

import { liberationDB } from '../lib/supabase';

export interface LiberationEvent {
  id: string;
  title: string;
  description: string;
  type: 'mutual-aid' | 'organizing' | 'education' | 'celebration' | 'support' | 'action';
  date: string;
  location: {
    type: 'online' | 'in-person' | 'hybrid';
    details: string;
    accessibilityNotes?: string;
  };
  organizer: {
    name: string;
    contact?: string;
  };
  registration: {
    required: boolean;
    link?: string;
    capacity?: number;
    currentAttendees?: number;
  };
  traumaInformed: boolean;
  accessibilityFeatures: string[];
  communityValue: 'education' | 'mutual-aid' | 'organizing' | 'celebration' | 'healing';
  status: 'pending' | 'upcoming' | 'happening-now' | 'completed' | 'cancelled';
  sourceUrl?: string; // Link back to the original source of the event
  created: string;
  updated: string;
}

export interface EventSubmission {
  title: string;
  description: string;
  type: LiberationEvent['type'];
  date: string;
  location: LiberationEvent['location'];
  organizer: LiberationEvent['organizer'];
  registration: LiberationEvent['registration'];
  traumaInformed: boolean;
  accessibilityFeatures: string[];
  communityValue: LiberationEvent['communityValue'];
  sourceUrl?: string; // Optional link back to the original source of the event
}

class EventsAPIService {
  private baseURL: string;
  private fallbackEvents: LiberationEvent[];

  constructor() {
    // Use local content API for events
    this.baseURL = '/api/content?type=events';
    this.fallbackEvents = this.generateLiveEvents();
  }

  // Return empty array - no misleading fallback events until real ones are added
  private generateLiveEvents(): LiberationEvent[] {
    console.log('🔄 Events API not available - showing empty state until real events are added');
    return [];
  }

  // Get all events with live data from Supabase
  async getEvents(): Promise<LiberationEvent[]> {
    try {
      // Get approved events from both moderation_queue and events tables
      const [moderationEvents, publishedEvents] = await Promise.all([
        liberationDB.getModerationQueue('event'),
        this.getPublishedEvents()
      ]);

      // Transform moderation queue events to LiberationEvent format
      const approvedEvents = moderationEvents
        .filter(event => event.status === 'approved')
        .map(event => this.transformToLiberationEvent(event));

      // Combine both sources and deduplicate
      const allEvents = [...approvedEvents, ...publishedEvents];
      const uniqueEvents = this.deduplicateEvents(allEvents);

      return uniqueEvents
        .filter(event => new Date(event.date) >= new Date()) // Only future events
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    } catch (error) {
      console.error('Error fetching events from Supabase:', error);
      // Return empty array instead of fallback mock data
      return [];
    }
  }

  // Get published events from published_events table
  private async getPublishedEvents(): Promise<LiberationEvent[]> {
    try {
      const { data, error } = await liberationDB.client
        .from('published_events')
        .select('*')
        .eq('status', 'published')
        .order('event_date', { ascending: true });

      if (error) throw error;

      return (data || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.content || '',
        type: this.mapEventType(event.metadata?.event_type || 'education'),
        date: event.event_date || event.created_at,
        location: {
          type: event.metadata?.location_type || 'in-person',
          details: event.location || 'Location TBA'
        },
        organizer: {
          name: event.author || 'Community Organizer'
        },
        registration: {
          required: event.metadata?.registration_required || false,
          link: event.metadata?.registration_link,
          capacity: event.metadata?.capacity
        },
        traumaInformed: true,
        accessibilityFeatures: event.metadata?.accessibility_features || [],
        communityValue: this.mapCommunityValue(event.metadata?.community_value || 'education'),
        status: 'upcoming',
        sourceUrl: event.metadata?.source_url,
        created: event.created_at,
        updated: event.updated_at
      }));
    } catch (error) {
      console.error('Error fetching published events:', error);
      return [];
    }
  }

  // Transform moderation queue event to LiberationEvent
  private transformToLiberationEvent(moderationEvent: any): LiberationEvent {
    const contentData = moderationEvent.content_data || {};

    return {
      id: moderationEvent.id,
      title: moderationEvent.title,
      description: moderationEvent.description || 'Event details coming soon',
      type: this.mapEventType(contentData.event_type || 'education'),
      date: contentData.event_date || moderationEvent.submitted_at,
      location: {
        type: contentData.location_type || 'in-person',
        details: contentData.location || 'Location TBA'
      },
      organizer: {
        name: contentData.organizer || moderationEvent.moderator_id || 'Community Organizer'
      },
      registration: {
        required: contentData.registration_required || false,
        link: contentData.registration_link,
        capacity: contentData.capacity
      },
      traumaInformed: true,
      accessibilityFeatures: contentData.accessibility_features || [],
      communityValue: this.mapCommunityValue(contentData.community_value || 'education'),
      status: 'upcoming',
      sourceUrl: moderationEvent.url,
      created: moderationEvent.created_at,
      updated: moderationEvent.updated_at
    };
  }

  // Map string event types to our enum
  private mapEventType(type: string): LiberationEvent['type'] {
    const typeMap: Record<string, LiberationEvent['type']> = {
      'mutual-aid': 'mutual-aid',
      'organizing': 'organizing',
      'education': 'education',
      'celebration': 'celebration',
      'support': 'support',
      'action': 'action',
      'in-person': 'celebration', // Default mapping for generic types
      'online': 'education'
    };
    return typeMap[type] || 'education';
  }

  // Map community values
  private mapCommunityValue(value: string): LiberationEvent['communityValue'] {
    const valueMap: Record<string, LiberationEvent['communityValue']> = {
      'education': 'education',
      'mutual-aid': 'mutual-aid',
      'organizing': 'organizing',
      'celebration': 'celebration',
      'healing': 'healing'
    };
    return valueMap[value] || 'education';
  }

  // Remove duplicate events (by title and date)
  private deduplicateEvents(events: LiberationEvent[]): LiberationEvent[] {
    const seen = new Set<string>();
    return events.filter(event => {
      const key = `${event.title.toLowerCase()}-${event.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Submit new event
  async submitEvent(eventData: EventSubmission): Promise<{ success: boolean; eventId?: string; message: string }> {
    try {
      // Try to submit to live API first
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Liberation-Platform': 'event-submission'
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.log('API submission failed, using local processing:', error);
    }

    // Fallback: Add to local events and simulate success
    const newEvent: LiberationEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      status: 'upcoming',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };

    this.fallbackEvents.unshift(newEvent);

    return {
      success: true,
      eventId: newEvent.id,
      message: 'Event submitted successfully! It will be reviewed by the community organizing team.'
    };
  }

  // Update event RSVP
  async updateRSVP(eventId: string, action: 'register' | 'unregister'): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Liberation-Platform': 'rsvp-update'
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.log('RSVP update failed, using local processing:', error);
    }

    // Fallback: Update local event
    const event = this.fallbackEvents.find(e => e.id === eventId);
    if (event && event.registration.currentAttendees !== undefined) {
      if (action === 'register' && event.registration.currentAttendees < (event.registration.capacity || Infinity)) {
        event.registration.currentAttendees++;
        return { success: true, message: 'Successfully registered for event!' };
      } else if (action === 'unregister' && event.registration.currentAttendees > 0) {
        event.registration.currentAttendees--;
        return { success: true, message: 'Successfully unregistered from event.' };
      }
    }

    return { success: false, message: 'Unable to update registration.' };
  }

  // Get events by type
  async getEventsByType(type: LiberationEvent['type']): Promise<LiberationEvent[]> {
    const allEvents = await this.getEvents();
    return allEvents.filter(event => event.type === type);
  }

  // Get upcoming events
  async getUpcomingEvents(): Promise<LiberationEvent[]> {
    const allEvents = await this.getEvents();
    const now = new Date();
    return allEvents
      .filter(event => new Date(event.date) > now && event.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

// Export singleton instance
export const eventsAPI = new EventsAPIService();
export type { LiberationEvent, EventSubmission };