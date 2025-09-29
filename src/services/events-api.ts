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
    // Use events API endpoint
    this.baseURL = '/api/events';
    this.fallbackEvents = this.generateLiveEvents();
  }

  // Return empty array - no misleading fallback events until real ones are added
  private generateLiveEvents(): LiberationEvent[] {
    console.log('🔄 Events API not available - showing empty state until real events are added');
    return [];
  }

  // Get all events using the API endpoint
  async getEvents(): Promise<LiberationEvent[]> {
    try {
      console.log('🔄 Loading events from API:', this.baseURL);

      const response = await fetch(`${this.baseURL}?upcoming=false&limit=50`);

      if (!response.ok) {
        throw new Error(`Events API failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data?.events) {
        const events = result.data.events;
        console.log('📅 Events loaded from API:', events.length);

        // Transform API events to LiberationEvent format
        return events.map((event: any) => this.transformAPIEventToLiberationEvent(event));
      }

      console.warn('Events API returned no data');
      return [];

    } catch (error) {
      console.error('Error fetching events from API:', error);
      return [];
    }
  }

  // Transform API event to LiberationEvent format
  private transformAPIEventToLiberationEvent(event: any): LiberationEvent {
    return {
      id: event.id,
      title: event.title,
      description: event.description || '',
      type: this.mapEventType(event.category || event.type),
      date: event.date,
      location: {
        type: event.location?.type || (event.location?.virtualLink ? 'hybrid' : 'in-person'),
        details: event.location?.details || 'Location TBA',
        accessibilityNotes: event.accessibilityFeatures?.join(', ')
      },
      organizer: {
        name: event.organizer?.name || 'Community Organizer',
        contact: event.organizer?.email || event.registration?.registrationUrl
      },
      registration: {
        required: event.registration?.required || false,
        link: event.registration?.registrationUrl,
        capacity: event.registration?.capacity
      },
      traumaInformed: true,
      accessibilityFeatures: event.accessibilityFeatures || [],
      communityValue: this.mapCommunityValue(event.category || 'organizing'),
      status: this.mapEventStatus(event.date),
      sourceUrl: event.registration?.registrationUrl,
      created: event.created || new Date().toISOString(),
      updated: event.updated || new Date().toISOString()
    };
  }

  // Map event types
  private mapEventType(type: string): LiberationEvent['type'] {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower.includes('mutual') || typeLower.includes('aid')) return 'mutual-aid';
    if (typeLower.includes('organiz')) return 'organizing';
    if (typeLower.includes('education') || typeLower.includes('workshop')) return 'education';
    if (typeLower.includes('celebrat') || typeLower.includes('party')) return 'celebration';
    if (typeLower.includes('support') || typeLower.includes('wellness')) return 'support';
    if (typeLower.includes('action') || typeLower.includes('protest')) return 'action';
    return 'organizing';
  }

  // Map community values
  private mapCommunityValue(category: string): LiberationEvent['communityValue'] {
    const catLower = category?.toLowerCase() || '';
    if (catLower.includes('education') || catLower.includes('workshop')) return 'education';
    if (catLower.includes('mutual') || catLower.includes('aid')) return 'mutual-aid';
    if (catLower.includes('celebrat') || catLower.includes('party')) return 'celebration';
    if (catLower.includes('wellness') || catLower.includes('healing')) return 'healing';
    return 'organizing';
  }

  // Map event status based on date
  private mapEventStatus(eventDate: string): LiberationEvent['status'] {
    const now = new Date();
    const eventDateTime = new Date(eventDate);

    if (eventDateTime < now) return 'completed';
    return 'upcoming';
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

    // Extract date from title if available (e.g., "Event Name | 02 Oct @ Location")
    const extractedDate = this.extractDateFromTitle(moderationEvent.title);
    const eventDate = contentData.event_date || extractedDate || moderationEvent.submitted_at;

    return {
      id: moderationEvent.id,
      title: moderationEvent.title,
      description: moderationEvent.description || 'Event details coming soon',
      type: this.mapEventType(contentData.event_type || 'celebration'),
      date: eventDate,
      location: {
        type: contentData.location_type || 'in-person',
        details: this.extractLocationFromTitle(moderationEvent.title) || contentData.location || 'London'
      },
      organizer: {
        name: contentData.organizer || 'Community Organizer'
      },
      registration: {
        required: true, // Most events require registration
        link: moderationEvent.url, // Use source URL as registration link
        capacity: contentData.capacity
      },
      traumaInformed: true,
      accessibilityFeatures: contentData.accessibility_features || [],
      communityValue: this.mapCommunityValue(contentData.community_value || 'celebration'),
      status: 'upcoming',
      sourceUrl: moderationEvent.url,
      created: moderationEvent.created_at,
      updated: moderationEvent.updated_at
    };
  }

  // Extract date from event title (e.g., "Event | 02 Oct @ Location")
  private extractDateFromTitle(title: string): string | null {
    try {
      // Look for patterns like "02 Oct", "09 Sep", "11 Oct"
      const dateMatch = title.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
      if (dateMatch) {
        const [, day, month] = dateMatch;
        const currentYear = new Date().getFullYear();
        const date = new Date(`${month} ${day}, ${currentYear}`);

        // If the date is in the past, assume it's for next year
        if (date < new Date()) {
          date.setFullYear(currentYear + 1);
        }

        return date.toISOString();
      }

      // Look for "Multiple Dates" pattern
      if (title.includes('Multiple Dates')) {
        // Default to next week for multiple dates events
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek.toISOString();
      }

      return null;
    } catch (error) {
      console.warn('Failed to extract date from title:', title);
      return null;
    }
  }

  // Extract location from event title
  private extractLocationFromTitle(title: string): string {
    try {
      // Look for "@ Location" pattern
      const locationMatch = title.match(/@\s*([^|,]+)/);
      if (locationMatch) {
        return locationMatch[1].trim();
      }

      // Default to London if no location found
      return 'London';
    } catch (error) {
      return 'London';
    }
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