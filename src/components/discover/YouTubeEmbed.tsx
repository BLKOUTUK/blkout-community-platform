// YouTube Embed Component - BLKOUT Community Platform
import { Youtube, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface YouTubeEmbedProps {
  channelId?: string;
  playlistId?: string;
  className?: string;
}

export function YouTubeEmbed({
  channelId = '@blkoutuk',
  playlistId = 'PLQIvk5RMvEWxx_xt-vvwKS8k-D7eRRnDh',
  className = ''
}: YouTubeEmbedProps) {
  // Use playlist for liberation content showcase
  const embedUrl = playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
    : `https://www.youtube.com/embed?listType=user_uploads&list=${channelId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center">
            <Youtube className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
              BLKOUT UK Channel
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Watch our latest videos and community conversations
            </p>
          </div>
        </div>
        <a
          href="https://www.youtube.com/@blkoutuk"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shrink-0"
        >
          <Play size={18} />
          Subscribe
        </a>
      </div>

      {/* YouTube Embed */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title="BLKOUT UK YouTube Channel"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <a
          href="https://www.youtube.com/@blkoutuk/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
        >
          All Videos
        </a>
        <a
          href="https://www.youtube.com/@blkoutuk/playlists"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
        >
          Playlists
        </a>
      </div>
    </motion.div>
  );
}
