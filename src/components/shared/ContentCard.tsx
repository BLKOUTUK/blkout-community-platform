// Content Card Component - Adapted for BLKOUT Community Platform
import { Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Content, PlatformType } from '../../types/content';

interface ContentCardProps {
  content: Content;
  showActions?: boolean;
}

const platformColors: Record<PlatformType, string> = {
  instagram: 'bg-pink-900/30 text-pink-400',
  linkedin: 'bg-blue-900/30 text-blue-400',
  twitter: 'bg-sky-900/30 text-sky-400',
  facebook: 'bg-indigo-900/30 text-indigo-400',
  tiktok: 'bg-gray-800 text-gray-300',
  youtube: 'bg-red-900/30 text-red-400',
};

export function ContentCard({ content, showActions = false }: ContentCardProps) {
  const displayDate = content.publishedAt || content.scheduledFor || content.createdAt;
  const dateObj = typeof displayDate === 'string' ? new Date(displayDate) : displayDate;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-xl transition-all border border-liberation-gold-divine/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{content.title}</h3>
          <div className="flex flex-wrap gap-2">
            {content.platforms.map((platform) => (
              <span key={platform} className={`px-2 py-1 rounded-md text-xs font-semibold ${platformColors[platform]}`}>
                {platform}
              </span>
            ))}
          </div>
        </div>
        {content.status === 'published' && (
          <ExternalLink size={18} className="text-gray-400 hover:text-liberation-gold-divine cursor-pointer" />
        )}
      </div>

      {/* Body */}
      <p className="text-sm text-gray-300 mb-4 line-clamp-3">{content.body}</p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            {content.status === 'published' && 'Published '}
            {content.status === 'scheduled' && 'Scheduled for '}
            {dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        {content.agentType && (
          <span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded-md capitalize">
            {content.agentType}
          </span>
        )}
      </div>

      {/* Engagement Metrics */}
      {content.engagementMetrics && content.status === 'published' && (
        <div className="pt-4 border-t border-liberation-gold-divine/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            {content.engagementMetrics.likes !== undefined && (
              <div>
                <div className="text-lg font-semibold text-white">
                  {content.engagementMetrics.likes}
                </div>
                <div className="text-xs text-gray-400">Likes</div>
              </div>
            )}
            {content.engagementMetrics.comments !== undefined && (
              <div>
                <div className="text-lg font-semibold text-white">
                  {content.engagementMetrics.comments}
                </div>
                <div className="text-xs text-gray-400">Comments</div>
              </div>
            )}
            {content.engagementMetrics.shares !== undefined && (
              <div>
                <div className="text-lg font-semibold text-white">
                  {content.engagementMetrics.shares}
                </div>
                <div className="text-xs text-gray-400">Shares</div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
