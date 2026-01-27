/**
 * Recurring Event Expansion Utility
 * Expands a recurring event definition into individual event occurrences
 */

interface RecurringEventInput {
  title: string;
  description: string;
  excerpt?: string;
  category: string;
  type: string;
  startDate: string;
  endDate?: string | null;
  recurrencePattern?: string;
  recurrenceInterval?: number;
  daysOfWeek?: string;
  organizer?: {
    name?: string;
    email?: string;
    communityMember?: boolean;
  };
}

interface ExpandedEvent {
  title: string;
  description: string;
  excerpt?: string;
  category: string;
  type: string;
  date: string;
  organizer?: {
    name?: string;
    email?: string;
    communityMember?: boolean;
  };
  location: { type: string };
  registration: { required: boolean };
  accessibilityFeatures: string[];
  tags: string[];
}

/**
 * Expands a recurring event into individual occurrences
 * @param eventData - The event with recurrence information
 * @returns Array of individual event occurrences
 */
export function expandRecurringEvent(eventData: RecurringEventInput): ExpandedEvent[] {
  const { recurrencePattern, startDate, endDate, recurrenceInterval = 1 } = eventData;

  // Single occurrence event (no recurrence)
  if (!recurrencePattern || recurrencePattern === 'none' || !endDate) {
    return [{
      title: eventData.title,
      description: eventData.description,
      excerpt: eventData.excerpt,
      category: eventData.category,
      type: eventData.type,
      date: eventData.startDate,
      organizer: eventData.organizer,
      location: { type: eventData.type },
      registration: { required: false },
      accessibilityFeatures: [],
      tags: []
    }];
  }

  const events: ExpandedEvent[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let currentDate = new Date(start);

  // Generate recurring events
  while (currentDate <= end) {
    events.push({
      title: eventData.title,
      description: eventData.description,
      excerpt: eventData.excerpt,
      category: eventData.category,
      type: eventData.type,
      date: currentDate.toISOString(),
      organizer: eventData.organizer,
      location: { type: eventData.type },
      registration: { required: false },
      accessibilityFeatures: [],
      tags: [`recurring-${recurrencePattern}`]
    });

    // Calculate next occurrence
    switch (recurrencePattern.toLowerCase()) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + recurrenceInterval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * recurrenceInterval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + recurrenceInterval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + recurrenceInterval);
        break;
      default:
        // Unknown pattern, break to avoid infinite loop
        currentDate = new Date(end.getTime() + 1); // Force exit
        break;
    }

    // Safety check to prevent infinite loops
    if (events.length > 100) {
      console.warn('Stopping event generation at 100 occurrences to prevent infinite loop');
      break;
    }
  }

  return events;
}

export default expandRecurringEvent;
