// Let's Go OUT OUT This Christmas - Advent Calendar Widget
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarDay {
  day: number;
  date: string;
  status: 'attended' | 'upcoming' | 'locked';
  time?: string;
  title?: string;
  organizer?: string;
  venue?: string;
  description?: string;
  image?: string;
  eventLink?: string;
  reviewLink?: string;
}

const calendarData: CalendarDay[] = [
  {
    day: 1,
    date: 'Sun Dec 1',
    status: 'attended',
    title: 'World AIDS Day Weekend',
    organizer: 'ZODIAC Remembers + We Look Back, We Live On',
    venue: 'Zodiac Bar / Royal Vauxhall Tavern',
    description: 'The range of ways people held grief and joy together - from karaoke remembrance to quiet reflection.',
    image: '/images/advent/day1-world-aids-day.jpg',
    reviewLink: '/voices/world-aids-day-2025',
    time: '8pm / 4:30pm'
  },
  {
    day: 2,
    date: 'Mon Dec 2',
    status: 'upcoming',
    time: '6pm',
    title: 'Memory In The Making Workshop',
    organizer: 'Dope Black Queers',
    venue: 'The Africa Centre',
    description: 'Workshop on collective memory-making and documentation. First time connecting with Dope Black Queers\' work - curious who\'s in the room.',
    image: '/images/placeholders/africa-centre.jpg',
    eventLink: 'https://www.eventbrite.co.uk/e/memory-in-the-making-workshop-tickets-1973803965795'
  },
  {
    day: 3,
    date: 'Tue Dec 3',
    status: 'upcoming',
    time: '6:15pm',
    title: 'Black Men-Talk Health',
    organizer: 'The U Collective',
    venue: 'University of Westminster',
    description: 'Mental health and wellness discussion specifically for African-Caribbean men. Bridging World AIDS Day\'s care themes into ongoing wellness.',
    image: '/images/placeholders/mental-health.jpg',
    eventLink: 'https://www.eventbrite.co.uk/e/black-men-talk-health-wellness-mental-health-for-african-caribbean-men-registration-634120319947'
  },
  { day: 4, date: 'Wed Dec 4', status: 'locked' },
  {
    day: 5,
    date: 'Fri Dec 5',
    status: 'upcoming',
    time: '8pm',
    title: 'Queer Edge Late: Dancing & Learning',
    organizer: 'Hackney Bridge',
    venue: 'Hackney Bridge E15',
    description: 'Friday night dancing at a creative hub. Fascinated by their model for alternative queer nightlife - how do they make it sustainable?',
    image: '/images/placeholders/hackney-bridge.jpg',
    eventLink: 'https://outsavvy.com/event/30703/queer-edge-late'
  },
  {
    day: 6,
    date: 'Sat Dec 6',
    status: 'upcoming',
    time: '11:30am',
    title: 'Soft Like Us | Black Queer Mental Wellness',
    organizer: 'Black Queers Connect',
    venue: 'Ministry of Sound',
    description: 'Daytime wellness event at Ministry of Sound. Different ways of caring for ourselves - meditation, movement, connection.',
    image: '/images/placeholders/wellness.jpg',
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
          🎄 Let's Go <span className="text-pink-600 dark:text-pink-400">OUT OUT</span> This Christmas 🎄
        </h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
          24 Days of Showing Up: An Advent Calendar Against Isolation
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Green border = upcoming events | Pink border = reviewed
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-pink-600 dark:text-pink-400">
          <a href="/events" className="underline hover:text-pink-500">🔗 Browse Events Calendar</a>
          <a href="/ivor" className="underline hover:text-pink-500">💬 Ask IVOR</a>
          <a href="/voices" className="underline hover:text-pink-500">📝 Read Reviews</a>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center items-center text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-emerald-500 rounded"></span>
          <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-pink-500 rounded"></span>
          <span>Reviewed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-gray-400 dark:border-gray-600 rounded"></span>
          <span>Coming soon</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {calendarData.map((dayData) => (
          <CalendarDay
            key={dayData.day}
            data={dayData}
            isFlipped={flippedDays.has(dayData.day)}
            onToggle={toggleDay}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-lg text-gray-900 dark:text-white font-semibold mb-4">
          🎄 Documenting Community Infrastructure This December 🎄
        </p>
        <p className="text-sm mb-4 max-w-2xl mx-auto">
          December can be lonely. This advent calendar documents 24 moments of showing up to Black queer community events across London - not as a consumer, but as documentation of the infrastructure that keeps us connected.
        </p>
        <p className="text-xs text-pink-600 dark:text-pink-400 mb-2">
          Want to submit your own event review? DM us or email hello@blkoutuk.com
        </p>
        <p className="text-xs">
          💬 Ask IVOR: "What Black queer events are happening this week?"
        </p>
      </div>
    </div>
  );
}

function CalendarDay({
  data,
  isFlipped,
  onToggle
}: {
  data: CalendarDay;
  isFlipped: boolean;
  onToggle: (day: number, status: string) => void;
}) {
  const borderColor = {
    attended: 'border-pink-500 dark:border-pink-400',
    upcoming: 'border-emerald-500 dark:border-emerald-400',
    locked: 'border-gray-300 dark:border-gray-700'
  }[data.status];

  const isLocked = data.status === 'locked';

  return (
    <motion.div
      className="h-48 cursor-pointer perspective-1000"
      onClick={() => onToggle(data.day, data.status)}
      whileHover={!isLocked ? { scale: 1.05 } : {}}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front */}
        <div
          className={`absolute w-full h-full rounded-lg ${borderColor} border-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 flex items-center justify-center ${
            isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:border-opacity-80'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${isLocked ? 'text-gray-600' : 'text-white'}`}>
              {data.day}
            </div>
            <div className={`text-xs ${isLocked ? 'text-gray-600' : data.status === 'attended' ? 'text-pink-400' : 'text-emerald-400'}`}>
              {data.date}
            </div>
            {data.time && !isLocked && (
              <div className="text-xs text-white mt-2">📍 {data.time}</div>
            )}
            {data.status === 'attended' && (
              <div className="text-xs text-white mt-2">✓ Reviewed</div>
            )}
          </div>
        </div>

        {/* Back */}
        {!isLocked && (
          <div
            className={`absolute w-full h-full rounded-lg ${borderColor} border-2 bg-black dark:bg-gray-900 p-4 overflow-y-auto text-white text-xs`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {data.image && (
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-32 object-cover rounded mb-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h3 className={`font-bold mb-2 ${data.status === 'attended' ? 'text-pink-400' : 'text-emerald-400'}`}>
              {data.title}
            </h3>
            {data.organizer && (
              <p className="mb-2">
                <strong>Organizer:</strong> {data.organizer}
              </p>
            )}
            <p className="mb-2 text-gray-300">{data.description}</p>
            {data.venue && (
              <p className="text-gray-400 text-xs mb-2">📍 {data.venue}, {data.time}</p>
            )}
            {data.eventLink && (
              <a
                href={data.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-xs mt-2 inline-block font-bold"
                onClick={(e) => e.stopPropagation()}
              >
                View event details →
              </a>
            )}
            {data.reviewLink && (
              <a
                href={data.reviewLink}
                className="text-pink-400 hover:text-pink-300 text-xs mt-2 inline-block font-bold"
                onClick={(e) => e.stopPropagation()}
              >
                Read full review →
              </a>
            )}
            <p className="text-xs text-gray-500 mt-2">💬 DM me if you want to attend together</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
