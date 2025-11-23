// Announcements Section - Adapted for BLKOUT Community Platform
import { Megaphone, Calendar, ChevronRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Announcement } from '../../types/announcements';
import { fetchPublishedAnnouncements, mockAnnouncements } from '../../services/announcementsService';

const categoryStyles = {
  event: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  update: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  campaign: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
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
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setIsLoading(true);
    setError(null);

    // Fetch from Supabase (shared database with comms-blkout)
    const { data, error: fetchError } = await fetchPublishedAnnouncements(10);

    if (fetchError) {
      console.error('Failed to fetch announcements:', fetchError);
      setError(fetchError);
      // Fall back to mock data on error
      setAnnouncements(mockAnnouncements);
      setIsUsingMockData(true);
    } else if (data && data.length > 0) {
      setAnnouncements(data);
      setIsUsingMockData(false);
    } else {
      // No data returned, use mock data
      setAnnouncements(mockAnnouncements);
      setIsUsingMockData(true);
    }

    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
          <Megaphone className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
            Community Announcements
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stay connected with our latest news and events
          </p>
        </div>
        {isUsingMockData && (
          <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
            Demo Mode
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading announcements...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Unable to load announcements
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                We're having trouble connecting to the database. Showing sample announcements instead.
              </p>
              <button
                onClick={loadAnnouncements}
                className="text-sm text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100 font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
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
              className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-700"
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
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <Megaphone className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No announcements yet
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check back soon for community updates and events!
          </p>
        </div>
      )}

      {/* View All Link */}
      {!isLoading && announcements.length > 0 && (
        <div className="text-center pt-4">
          <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-sm flex items-center gap-2 mx-auto group">
            View all announcements
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
