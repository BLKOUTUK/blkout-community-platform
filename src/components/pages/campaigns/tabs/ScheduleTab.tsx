/**
 * Schedule Tab Component
 * Publication timeline view grouped by date with optional FullCalendar view
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Calendar,
  CalendarDays,
  List,
  Instagram,
  Linkedin,
  Mail,
  Globe,
  Filter,
  ChevronDown,
  Circle,
  Video,
  X
} from 'lucide-react';
import {
  format,
  isSameDay,
  startOfDay,
  addDays,
  isToday,
  isBefore,
  isAfter,
  parseISO
} from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { EventInput, EventClickArg } from '@fullcalendar/core';

import { useScheduleEvents } from '../hooks/useCampaigns';
import { ContentThumbnail } from '../components/ContentThumbnail';
import type { Campaign, Platform, ScheduleEvent, ContentItem } from '../types';

interface ScheduleTabProps {
  campaigns: Campaign[];
}

// Platform color mapping
const platformColors: Record<Platform, { bg: string; text: string; border: string }> = {
  instagram: {
    bg: 'bg-pink-100 dark:bg-pink-900/20',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-300 dark:border-pink-700'
  },
  twitter: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-500 dark:text-blue-400',
    border: 'border-blue-300 dark:border-blue-700'
  },
  linkedin: {
    bg: 'bg-blue-200 dark:bg-blue-800/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-400 dark:border-blue-600'
  },
  tiktok: {
    bg: 'bg-gray-900 dark:bg-gray-800',
    text: 'text-white dark:text-gray-100',
    border: 'border-gray-700 dark:border-gray-600'
  },
  email: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-300 dark:border-purple-700'
  },
  hub: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-300 dark:border-green-700'
  },
  website: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-300 dark:border-gray-600'
  }
};

// Platform icon mapping
const PlatformIcon: React.FC<{ platform: Platform; className?: string }> = ({ platform, className = 'w-4 h-4' }) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className={className} />;
    case 'twitter':
      // Using a simple X icon for Twitter/X
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'tiktok':
      return <Video className={className} />;
    case 'email':
      return <Mail className={className} />;
    case 'hub':
    case 'website':
      return <Globe className={className} />;
    default:
      return <Circle className={className} />;
  }
};

// Get campaign name by ID
const getCampaignName = (campaigns: Campaign[], campaignId: string): string => {
  const campaign = campaigns.find(c => c.id === campaignId);
  return campaign?.name.split(':')[0] || 'Unknown';
};

// Get campaign color by ID (generates consistent colors)
const getCampaignColor = (campaignId: string): string => {
  const colors = [
    'bg-purple-500',
    'bg-indigo-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-orange-500',
    'bg-rose-500'
  ];
  const index = campaignId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

// Helper to get full content item from event
const getContentItemFromEvent = (campaigns: Campaign[], event: ScheduleEvent): ContentItem | null => {
  const campaign = campaigns.find(c => c.id === event.campaignId);
  if (!campaign) return null;
  return campaign.contentItems.find(item => item.id === event.contentItemId) || null;
};

// Platform hex colors for FullCalendar
const platformHexColors: Record<Platform, string> = {
  instagram: '#ec4899',
  twitter: '#3b82f6',
  linkedin: '#1d4ed8',
  tiktok: '#1f2937',
  email: '#9333ea',
  hub: '#16a34a',
  website: '#6b7280'
};

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ campaigns }) => {
  const events = useScheduleEvents(campaigns);

  // View mode state
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  // Filter state
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('week');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Calendar event preview modal state
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Available platforms from events
  const availablePlatforms = useMemo(() => {
    const platforms = new Set(events.map(e => e.platform));
    return Array.from(platforms) as Platform[];
  }, [events]);

  // Filter and group events
  const { todayEvents, upcomingGroups, pastGroups } = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);

    // Date range filter
    let filteredEvents = events;
    if (dateRange === 'week') {
      const weekEnd = addDays(today, 7);
      filteredEvents = events.filter(e => {
        const eventDate = e.start instanceof Date ? e.start : parseISO(e.start as unknown as string);
        return isBefore(eventDate, weekEnd) && isAfter(eventDate, addDays(today, -1));
      });
    } else if (dateRange === 'month') {
      const monthEnd = addDays(today, 30);
      filteredEvents = events.filter(e => {
        const eventDate = e.start instanceof Date ? e.start : parseISO(e.start as unknown as string);
        return isBefore(eventDate, monthEnd) && isAfter(eventDate, addDays(today, -7));
      });
    }

    // Platform filter
    if (selectedPlatforms.length > 0) {
      filteredEvents = filteredEvents.filter(e => selectedPlatforms.includes(e.platform));
    }

    // Sort by date
    filteredEvents.sort((a, b) => {
      const dateA = a.start instanceof Date ? a.start : parseISO(a.start as unknown as string);
      const dateB = b.start instanceof Date ? b.start : parseISO(b.start as unknown as string);
      return dateA.getTime() - dateB.getTime();
    });

    // Group by date
    const grouped: Record<string, ScheduleEvent[]> = {};
    filteredEvents.forEach(event => {
      const eventDate = event.start instanceof Date ? event.start : parseISO(event.start as unknown as string);
      const dateKey = format(eventDate, 'yyyy-MM-dd');
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(event);
    });

    // Separate today, upcoming, and past
    const todayKey = format(today, 'yyyy-MM-dd');
    const todayEvts = grouped[todayKey] || [];

    const upcomingGrps: { date: string; events: ScheduleEvent[] }[] = [];
    const pastGrps: { date: string; events: ScheduleEvent[] }[] = [];

    Object.entries(grouped).forEach(([dateKey, evts]) => {
      if (dateKey === todayKey) return;
      const date = parseISO(dateKey);
      if (isAfter(date, today)) {
        upcomingGrps.push({ date: dateKey, events: evts });
      } else {
        pastGrps.push({ date: dateKey, events: evts });
      }
    });

    // Sort groups
    upcomingGrps.sort((a, b) => a.date.localeCompare(b.date));
    pastGrps.sort((a, b) => b.date.localeCompare(a.date));

    return {
      todayEvents: todayEvts,
      upcomingGroups: upcomingGrps,
      pastGroups: pastGrps
    };
  }, [events, dateRange, selectedPlatforms]);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  // Convert ScheduleEvents to FullCalendar EventInput format
  const calendarEvents = useMemo((): EventInput[] => {
    let filteredEvents = events;

    // Apply platform filter
    if (selectedPlatforms.length > 0) {
      filteredEvents = filteredEvents.filter(e => selectedPlatforms.includes(e.platform));
    }

    return filteredEvents.map(event => {
      const eventDate = event.start instanceof Date ? event.start : parseISO(event.start as unknown as string);
      const campaignName = getCampaignName(campaigns, event.campaignId);

      return {
        id: event.id,
        title: `${campaignName}: ${event.title}`,
        start: eventDate,
        end: event.end instanceof Date ? event.end : undefined,
        backgroundColor: platformHexColors[event.platform],
        borderColor: platformHexColors[event.platform],
        extendedProps: {
          scheduleEvent: event,
          platform: event.platform,
          campaignName,
          status: event.status
        }
      };
    });
  }, [events, selectedPlatforms, campaigns]);

  // Handle calendar event click
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const scheduleEvent = clickInfo.event.extendedProps.scheduleEvent as ScheduleEvent;
    setSelectedEvent(scheduleEvent);
    setShowEventModal(true);
  }, []);

  // Close event modal
  const closeEventModal = useCallback(() => {
    setShowEventModal(false);
    setSelectedEvent(null);
  }, []);

  // Event card component with thumbnail
  const EventCard: React.FC<{ event: ScheduleEvent }> = ({ event }) => {
    const colors = platformColors[event.platform];
    const eventDate = event.start instanceof Date ? event.start : parseISO(event.start as unknown as string);
    const contentItem = getContentItemFromEvent(campaigns, event);

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg} transition-all hover:shadow-md`}
      >
        {/* Thumbnail */}
        {contentItem && (
          <ContentThumbnail item={contentItem} size="sm" showPreview={true} />
        )}

        {/* Time */}
        <div className="flex items-center gap-1.5 min-w-[60px]">
          <Clock className={`w-3.5 h-3.5 ${colors.text}`} />
          <span className={`text-sm font-medium ${colors.text}`}>
            {format(eventDate, 'HH:mm')}
          </span>
        </div>

        {/* Platform icon */}
        <div className={`p-1.5 rounded-md ${colors.text}`}>
          <PlatformIcon platform={event.platform} className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {event.title}
          </div>
          {/* Content preview */}
          {contentItem?.content && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {contentItem.content.slice(0, 60)}{contentItem.content.length > 60 ? '...' : ''}
            </div>
          )}
        </div>

        {/* Campaign badge */}
        <div className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getCampaignColor(event.campaignId)}`}>
          {getCampaignName(campaigns, event.campaignId)}
        </div>

        {/* Status indicator */}
        <div className={`w-2 h-2 rounded-full ${
          event.status === 'published' ? 'bg-green-500' :
          event.status === 'scheduled' ? 'bg-blue-500' :
          event.status === 'approved' ? 'bg-yellow-500' :
          'bg-gray-400'
        }`} />
      </motion.div>
    );
  };

  // Date group component
  const DateGroup: React.FC<{ dateStr: string; events: ScheduleEvent[]; isToday?: boolean }> = ({ dateStr, events, isToday: isTodayGroup }) => {
    const date = parseISO(dateStr);

    return (
      <div className="mb-6">
        {/* Date header */}
        <div className={`flex items-center gap-3 mb-3 ${isTodayGroup ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}>
          <Calendar className="w-4 h-4" />
          <h3 className={`text-sm font-semibold uppercase tracking-wide ${isTodayGroup ? 'text-purple-600 dark:text-purple-400' : ''}`}>
            {isTodayGroup ? 'Today - ' : ''}
            {format(date, 'EEEE, MMMM d, yyyy')}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
            {events.length} {events.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Events */}
        <div className="space-y-2 ml-7">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    );
  };

  // Calendar View Component
  const CalendarView: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <style>{`
        .fc {
          --fc-border-color: rgb(229 231 235);
          --fc-today-bg-color: rgba(147, 51, 234, 0.1);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: transparent;
          --fc-list-event-hover-bg-color: rgba(147, 51, 234, 0.1);
        }
        .dark .fc {
          --fc-border-color: rgb(55 65 81);
          --fc-today-bg-color: rgba(147, 51, 234, 0.2);
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: inherit;
        }
        .fc .fc-button {
          background-color: rgb(243 244 246);
          border-color: rgb(229 231 235);
          color: rgb(55 65 81);
          font-weight: 500;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }
        .dark .fc .fc-button {
          background-color: rgb(55 65 81);
          border-color: rgb(75 85 99);
          color: rgb(209 213 219);
        }
        .fc .fc-button:hover {
          background-color: rgb(229 231 235);
        }
        .dark .fc .fc-button:hover {
          background-color: rgb(75 85 99);
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          background-color: rgb(147 51 234);
          border-color: rgb(147 51 234);
          color: white;
        }
        .fc .fc-event {
          cursor: pointer;
          padding: 2px 4px;
          font-size: 0.75rem;
          border-radius: 4px;
        }
        .fc .fc-daygrid-event {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fc .fc-col-header-cell-cushion,
        .fc .fc-daygrid-day-number {
          color: rgb(107 114 128);
          font-weight: 500;
        }
        .dark .fc .fc-col-header-cell-cushion,
        .dark .fc .fc-daygrid-day-number {
          color: rgb(156 163 175);
        }
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: var(--fc-border-color);
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        height="auto"
        aspectRatio={1.8}
        nowIndicator={true}
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'List'
        }}
      />
    </div>
  );

  // Event Preview Modal
  const EventPreviewModal: React.FC = () => {
    if (!selectedEvent) return null;

    const contentItem = getContentItemFromEvent(campaigns, selectedEvent);
    const eventDate = selectedEvent.start instanceof Date
      ? selectedEvent.start
      : parseISO(selectedEvent.start as unknown as string);
    const colors = platformColors[selectedEvent.platform];

    return (
      <AnimatePresence>
        {showEventModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={closeEventModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className={`px-4 py-3 ${colors.bg} border-b ${colors.border} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={selectedEvent.platform} className={`w-5 h-5 ${colors.text}`} />
                    <span className={`font-medium capitalize ${colors.text}`}>
                      {selectedEvent.platform}
                    </span>
                  </div>
                  <button
                    onClick={closeEventModal}
                    className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedEvent.title}
                  </h3>

                  {/* Date and Time */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
                    <span className="text-gray-400 dark:text-gray-500">|</span>
                    <Clock className="w-4 h-4" />
                    <span>{format(eventDate, 'HH:mm')}</span>
                  </div>

                  {/* Campaign */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Campaign:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getCampaignColor(selectedEvent.campaignId)}`}>
                      {getCampaignName(campaigns, selectedEvent.campaignId)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedEvent.status === 'published'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : selectedEvent.status === 'scheduled'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : selectedEvent.status === 'approved'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {selectedEvent.status}
                    </span>
                  </div>

                  {/* Thumbnail and Content Preview */}
                  {contentItem && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-3">
                        <ContentThumbnail item={contentItem} size="md" showPreview={false} />
                        {contentItem.content && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                            {contentItem.content.slice(0, 150)}
                            {contentItem.content.length > 150 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Event Preview Modal */}
      <EventPreviewModal />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Publication Schedule
        </h2>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Calendar
            </button>
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters || selectedPlatforms.length > 0
                ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {selectedPlatforms.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-600 text-white rounded-full">
                {selectedPlatforms.length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              {/* Date range */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Date Range
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' },
                    { value: 'all', label: 'All Time' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setDateRange(option.value as 'week' | 'month' | 'all')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        dateRange === option.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {availablePlatforms.map(platform => {
                    const colors = platformColors[platform];
                    const isSelected = selectedPlatforms.includes(platform);

                    return (
                      <button
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? `${colors.bg} ${colors.text} ${colors.border} border`
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <PlatformIcon platform={platform} className="w-4 h-4" />
                        <span className="capitalize">{platform}</span>
                      </button>
                    );
                  })}

                  {selectedPlatforms.length > 0 && (
                    <button
                      onClick={() => setSelectedPlatforms([])}
                      className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar View */}
      {viewMode === 'calendar' && <CalendarView />}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-8">
          {/* Empty state */}
          {events.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No scheduled content
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Content items with scheduled dates will appear here.
              </p>
            </div>
          )}

          {/* Today section */}
          {todayEvents.length > 0 && (
            <div className="relative">
              {/* Today marker */}
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-purple-500 rounded-full" />
              <DateGroup dateStr={format(new Date(), 'yyyy-MM-dd')} events={todayEvents} isToday />
            </div>
          )}

          {/* Today empty state */}
          {events.length > 0 && todayEvents.length === 0 && (
            <div className="relative p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-purple-500 rounded-full" />
              <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Today - {format(new Date(), 'EEEE, MMMM d')}</span>
              </div>
              <p className="mt-2 text-sm text-purple-600 dark:text-purple-400 ml-8">
                No content scheduled for today
              </p>
            </div>
          )}

          {/* Upcoming section */}
          {upcomingGroups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Upcoming
                </h3>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              {upcomingGroups.map(group => (
                <DateGroup key={group.date} dateStr={group.date} events={group.events} />
              ))}
            </div>
          )}

          {/* Past section (collapsed by default) */}
          {pastGroups.length > 0 && (
            <div className="opacity-60">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Past
                </h3>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              {pastGroups.slice(0, 3).map(group => (
                <DateGroup key={group.date} dateStr={group.date} events={group.events} />
              ))}

              {pastGroups.length > 3 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  +{pastGroups.length - 3} more days
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ScheduleTab;
