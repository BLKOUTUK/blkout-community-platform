// Let's Go OUT OUT This Christmas - Advent Calendar Widget (Clean Version)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface CalendarDay {
  day: number;
  date: string;
  status: 'attended' | 'upcoming' | 'locked';
  time?: string;
  title?: string;
  eventLink?: string;
  reviewLink?: string;
}

const calendarData: CalendarDay[] = [
  {
    day: 1,
    date: 'Sun Dec 1',
    status: 'attended',
    title: 'World AIDS Day Weekend',
    reviewLink: '/voices/world-aids-day-2025',
    time: '8pm'
  },
  {
    day: 2,
    date: 'Mon Dec 2',
    status: 'upcoming',
    time: '6pm',
    title: 'Memory In The Making Workshop',
    eventLink: 'https://www.eventbrite.co.uk/e/memory-in-the-making-workshop-tickets-1973803965795'
  },
  {
    day: 3,
    date: 'Tue Dec 3',
    status: 'upcoming',
    time: '6:15pm',
    title: 'Black Men-Talk Health',
    eventLink: 'https://www.eventbrite.co.uk/e/black-men-talk-health-wellness-mental-health-for-african-caribbean-men-registration-634120319947'
  },
  { day: 4, date: 'Wed Dec 4', status: 'locked' },
  {
    day: 5,
    date: 'Fri Dec 5',
    status: 'upcoming',
    time: '8pm',
    title: 'Queer Edge Late',
    eventLink: 'https://outsavvy.com/event/30703/queer-edge-late'
  },
  {
    day: 6,
    date: 'Sat Dec 6',
    status: 'upcoming',
    time: '11:30am',
    title: 'Soft Like Us | Black Queer Wellness',
    eventLink: 'https://www.eventbrite.co.uk/e/soft-like-us-black-queer-mental-wellness-event-tickets-1949225137859'
  },
  ...Array.from({ length: 18 }, (_, i) => ({
    day: i + 7,
    date: `Dec ${i + 7}`,
    status: 'locked' as const
  }))
];

export function AdventCalendarWidget() {
  const [flippedDays, setFlippedDays] = useState<Set<number>>(new Set());

  const toggleDay = (day: number, status: string) => {
    if (status === 'locked') return;

    setFlippedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Let's Go <span className="text-pink-600 dark:text-pink-400">OUT OUT</span> This Christmas
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Tap a day to reveal event details
        </p>
      </div>

      {/* Compact Legend */}
      <div className="flex gap-4 justify-center items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-emerald-500 rounded"></span>
          <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-pink-500 rounded"></span>
          <span>Reviewed</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded"></span>
          <span>Soon</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
        {calendarData.map((dayData) => (
          <CalendarDayClean
            key={dayData.day}
            data={dayData}
            isFlipped={flippedDays.has(dayData.day)}
            onToggle={toggleDay}
          />
        ))}
      </div>

      {/* Compact Footer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <a href="https://blkoutuk.com/events" className="text-pink-600 hover:text-pink-500 mr-4">Browse All Events</a>
        <a href="https://blkoutuk.com/voices" className="text-pink-600 hover:text-pink-500">Read Reviews</a>
      </div>
    </div>
  );
}

// Clean, compact calendar day component
function CalendarDayClean({
  data,
  isFlipped,
  onToggle
}: {
  data: CalendarDay;
  isFlipped: boolean;
  onToggle: (day: number, status: string) => void;
}) {
  const bgColor = {
    attended: 'bg-pink-500',
    upcoming: 'bg-emerald-500',
    locked: 'bg-gray-300 dark:bg-gray-700'
  }[data.status];

  const isLocked = data.status === 'locked';
  const hasEvent = data.title;

  return (
    <motion.div
      className="aspect-square cursor-pointer"
      onClick={() => onToggle(data.day, data.status)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Front - Just the day number */}
        <div
          className={`absolute w-full h-full rounded-lg ${bgColor} flex items-center justify-center shadow-md`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-white font-bold text-lg">{data.day}</span>
          {data.status === 'attended' && (
            <CheckCircle className="absolute top-1 right-1 w-3 h-3 text-white" />
          )}
        </div>

        {/* Back - Title + Link only */}
        <div
          className={`absolute w-full h-full rounded-lg bg-gray-900 overflow-hidden flex flex-col items-center justify-center p-2`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {isLocked || !hasEvent ? (
            <span className="text-gray-400 text-xs text-center">Coming soon</span>
          ) : (
            <div className="text-center space-y-1">
              <p className="text-white text-xs font-medium line-clamp-2">{data.title}</p>
              {data.eventLink && (
                <a
                  href={data.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center justify-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {data.reviewLink && (
                <a
                  href={data.reviewLink}
                  className="text-pink-400 hover:text-pink-300 text-xs flex items-center justify-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CheckCircle className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
