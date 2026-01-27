// BLKOUT Liberation Platform - Community Activity Feed Widget
// Layer 1: Community Frontend Presentation Layer
// LIBERATION VALUES: Community connection and real-time engagement
// ACCESSIBILITY: Full WCAG 3.0 Bronze compliance

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Users,
  TrendingUp,
  Heart,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/liberation-utils';

interface CommunityActivity {
  id: string;
  type: 'discussion' | 'event' | 'resource' | 'announcement';
  title: string;
  excerpt: string;
  author: string;
  timestamp: string;
  replies?: number;
  reactions?: number;
  url: string;
  tags?: string[];
}

interface CommunityActivityFeedProps {
  limit?: number;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

const CommunityActivityFeed: React.FC<CommunityActivityFeedProps> = ({
  limit = 5,
  showHeader = true,
  compact = false,
  className
}) => {
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch community activity from BLKOUTHUB via Heartbeat.chat API
  const fetchActivity = async () => {
    setLoading(true);
    setError(null);

    try {
      const HEARTBEAT_API = 'https://api.heartbeat.chat/v1';
      const HEARTBEAT_TOKEN = import.meta.env.VITE_HEARTBEAT_API_TOKEN ||
                              (typeof process !== 'undefined' && process.env?.HEARTBEAT_API_TOKEN);

      if (!HEARTBEAT_TOKEN) {
        throw new Error('Heartbeat API token not configured');
      }

      // Fetch recent posts from Heartbeat.chat
      const postsResponse = await fetch(`${HEARTBEAT_API}/posts?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${HEARTBEAT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!postsResponse.ok) {
        throw new Error(`Heartbeat API error: ${postsResponse.status}`);
      }

      const postsData = await postsResponse.json();

      // Transform Heartbeat posts to our activity format
      const transformedActivities: CommunityActivity[] = (postsData.posts || postsData || [])
        .slice(0, limit)
        .map((post: any, index: number) => ({
          id: post.id || `post-${index}`,
          type: post.type === 'event' ? 'event' :
                post.type === 'announcement' ? 'announcement' :
                post.type === 'resource' ? 'resource' : 'discussion',
          title: post.title || post.content?.substring(0, 60) || 'Community Post',
          excerpt: post.content?.substring(0, 150) || post.excerpt || '',
          author: post.author?.name || post.userName || 'Community Member',
          timestamp: post.createdAt || post.created_at || new Date().toISOString(),
          replies: post.replyCount || post.commentsCount || 0,
          reactions: post.reactionCount || post.likesCount || 0,
          url: post.url || `https://blkouthub.com/posts/${post.id}`,
          tags: post.tags || []
        }));

      setActivities(transformedActivities);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('BLKOUTHUB activity fetch error:', err);
      // Fallback to showing invitation to join
      setActivities([{
        id: 'join-invite',
        type: 'announcement',
        title: 'Join BLKOUTHUB - Our Private Community Space',
        excerpt: 'Connect with other Black queer men in our secure community platform. Share experiences, find support, and build together.',
        author: 'BLKOUT Team',
        timestamp: new Date().toISOString(),
        replies: 0,
        reactions: 0,
        url: 'https://blkouthub.com/invitation?code=BE862C',
        tags: ['community', 'join', 'welcome']
      }]);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [limit]);

  const getActivityIcon = (type: CommunityActivity['type']) => {
    switch (type) {
      case 'discussion':
        return <MessageCircle className="h-5 w-5" />;
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'resource':
        return <Sparkles className="h-5 w-5" />;
      case 'announcement':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: CommunityActivity['type']) => {
    switch (type) {
      case 'discussion':
        return 'text-liberation-purple-spirit bg-liberation-purple-spirit';
      case 'event':
        return 'text-liberation-gold-divine bg-liberation-gold-divine';
      case 'resource':
        return 'text-liberation-green-africa bg-liberation-green-africa';
      case 'announcement':
        return 'text-liberation-red-liberation bg-liberation-red-liberation';
      default:
        return 'text-liberation-silver bg-liberation-silver';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg', className)}>
        {showHeader && (
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-purple-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              BLKOUTHUB Activity
            </h3>
          </div>
        )}
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg', className)}>
        {showHeader && (
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-purple-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              BLKOUTHUB Activity
            </h3>
          </div>
        )}
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchActivity}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg', className)}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-purple-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              BLKOUTHUB Activity
            </h3>
          </div>
          <button
            onClick={fetchActivity}
            className="text-purple-600 hover:text-purple-700 transition-colors"
            title="Refresh activity"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <motion.a
              key={activity.id}
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'block p-4 rounded-lg border border-gray-200 dark:border-gray-700',
                'hover:border-purple-300 dark:hover:border-purple-600 transition-all',
                'hover:shadow-md group'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Activity Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-2 flex-1">
                  <div className={cn(
                    'p-2 rounded-lg bg-opacity-10 mt-1',
                    getActivityColor(activity.type)
                  )}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {activity.title}
                    </h4>
                    {!compact && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {activity.excerpt}
                      </p>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 ml-2" />
              </div>

              {/* Activity Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(activity.timestamp)}
                  </span>
                  {activity.replies !== undefined && (
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {activity.replies}
                    </span>
                  )}
                  {activity.reactions !== undefined && (
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {activity.reactions}
                    </span>
                  )}
                </div>
                <span className="capitalize text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {activity.type}
                </span>
              </div>

              {/* Tags */}
              {activity.tags && activity.tags.length > 0 && !compact && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {activity.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {/* View All Link */}
      <div className="mt-6 text-center">
        <a
          href="https://blkouthub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-colors"
        >
          <span>Visit BLKOUTHUB Community</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-600">
        Last updated: {lastRefresh.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default CommunityActivityFeed;
