// Let's Go OUT OUT This Christmas - Advent Calendar Widget
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare } from 'lucide-react';

interface CalendarDay {
  day: number;
  date: string;
  status: 'attended' | 'upcoming' | 'locked';
  time?: string;
  title?: string;
}

const calendarData: CalendarDay[] = [
  { day: 1, date: 'Sun Dec 1', status: 'attended', title: 'World AIDS Day Weekend', time: '8pm' },
  { day: 2, date: 'Mon Dec 2', status: 'upcoming', time: '6pm', title: 'Memory In The Making Workshop' },
  { day: 3, date: 'Tue Dec 3', status: 'upcoming', time: '6:15pm', title: 'Black Men-Talk Health' },
  { day: 4, date: 'Wed Dec 4', status: 'locked' },
  { day: 5, date: 'Fri Dec 5', status: 'upcoming', time: '8pm', title: 'Queer Edge Late' },
  { day: 6, date: 'Sat Dec 6', status: 'upcoming', time: '11:30am', title: 'Soft Like Us' },
  ...Array.from({ length: 18 }, (_, i) => ({
    day: i + 7,
    date: `Dec ${i + 7}`,
    status: 'locked' as const
  }))
];

export function AdventCalendarWidget() {
  const [flippedDays, setFlippedDays] = useState<Set<number>>(new Set());

  const toggleDay = (day: number) => {
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
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Let's Go <span className="text-pink-600 dark:text-pink-400">OUT OUT</span> This Christmas
        </h2>
      </div>

      {/* Calendar Grid - 4x6 layout */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
        {calendarData.map((dayData) => (
          <CalendarDayCard
            key={dayData.day}
            data={dayData}
            isFlipped={flippedDays.has(dayData.day)}
            onToggle={toggleDay}
          />
        ))}
      </div>

      {/* Footer Links */}
      <div className="flex justify-center gap-6 pt-2">
        <a
          href="https://events-blkout.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-500 font-medium"
        >
          Browse Events
        </a>
        <a
          href="https://voices-blkout.up.railway.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-500 font-medium"
        >
          Read Reviews
        </a>
      </div>
    </div>
  );
}

function CalendarDayCard({
  data,
  isFlipped,
  onToggle
}: {
  data: CalendarDay;
  isFlipped: boolean;
  onToggle: (day: number) => void;
}) {
  const bgColor = {
    attended: 'bg-pink-500',
    upcoming: 'bg-emerald-500',
    locked: 'bg-gray-400 dark:bg-gray-600'
  }[data.status];

  const hasEvent = !!data.title;

  return (
    <motion.div
      className="aspect-square cursor-pointer"
      onClick={() => onToggle(data.day)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Front - Day number */}
        <div
          className={`absolute w-full h-full rounded-xl ${bgColor} flex items-center justify-center shadow-lg`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-white font-bold text-2xl md:text-3xl">{data.day}</span>
        </div>

        {/* Back - Event info or Christmas logo */}
        <div
          className="absolute w-full h-full rounded-xl bg-gray-900 overflow-hidden flex flex-col items-center justify-center p-1"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {hasEvent ? (
            // Event content
            <div className="text-center flex flex-col items-center justify-center h-full w-full gap-1">
              <p className="text-white text-xs md:text-sm font-semibold line-clamp-2 px-1">{data.title}</p>
              <div className="flex gap-2 mt-1">
                <a
                  href="https://events-blkout.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300"
                  onClick={(e) => e.stopPropagation()}
                  title="View Event"
                >
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                </a>
                <a
                  href="https://voices-blkout.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300"
                  onClick={(e) => e.stopPropagation()}
                  title="Write Review"
                >
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              </div>
            </div>
          ) : (
            // No event - show Christmas logo
            <div className="flex flex-col items-center justify-center h-full w-full">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain rounded-lg"
              >
                <source src="/Branding and logos/Blkoutchristmas.mp4" type="video/mp4" />
              </video>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
