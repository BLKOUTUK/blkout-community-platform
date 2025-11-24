// Community Announcements Section - BLKOUT Community Platform
import { Megaphone, Calendar, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Announcement } from '../../types/announcements';
import { fetchPublishedAnnouncements } from '../../services/announcementsService';

const categoryStyles = {
  event: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  update: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  campaign: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
};

const categoryLabels = {
  event: 'Event',
  update: 'Update',
  campaign: 'Campaign',
  urgent: 'Urgent'
};

export function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await fetchPublishedAnnouncements(10);

    if (fetchError) {
      console.error('Failed to fetch announcements:', fetchError);
      setError(fetchError);
      setAnnouncements([]);
    } else if (data) {
      setAnnouncements(data);
    } else {
      setAnnouncements([]);
    }

    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
          <Megaphone className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Community Announcements
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stay connected with our latest news and events
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 space-y-3"
        >
          <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading announcements...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-1">
                Unable to load announcements
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                We're having trouble connecting to the database. Please try again later.
              </p>
              <button
                onClick={loadAnnouncements}
                className="text-sm text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Announcements List */}
      {!isLoading && announcements.length > 0 && (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[announcement.category]}`}>
                      {categoryLabels[announcement.category]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar size={14} />
                      {new Date(announcement.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {announcement.excerpt}
                  </p>
                  {announcement.authorName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      By {announcement.authorName}
                    </p>
                  )}
                </div>
                <ChevronRight
                  className="text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0"
                  size={20}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && announcements.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-100 dark:border-gray-700"
        >
          <Megaphone className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            No announcements yet
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check back soon for community updates and events!
          </p>
        </motion.div>
      )}
    </div>
  );
}
