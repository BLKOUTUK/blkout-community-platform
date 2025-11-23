/**
 * BLKOUT Community Platform - Enhanced Discover Page
 * Integrated with comms-blkout components for unified content discovery
 *
 * Integration Points:
 * - Shared Supabase database with comms-blkout admin system
 * - Published content created by AI agents (Griot, Listener, Weaver, Strategist)
 * - Announcements managed through comms-blkout admin
 */

import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PlatformType } from '../../types/content';

// Integrated components from comms-blkout
import { HeroSection } from '../discover/HeroSection';
import { BlkoutHubWidget } from '../discover/BlkoutHubWidget';
import { AnnouncementsSection } from '../discover/AnnouncementsSection';
import { YouTubeEmbed } from '../discover/YouTubeEmbed';
import { ContentCard } from '../shared/ContentCard';
import { usePublishedContent } from '../../hooks/usePublishedContent';

interface DiscoverPageProps {
  onNavigate?: (tab: string) => void;
}

export default function DiscoverPage({ onNavigate }: DiscoverPageProps) {
  const { content, isLoading } = usePublishedContent();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter content by platform and search query
  const filteredContent = (content || []).filter((item) => {
    if (!item) return false;
    const matchesPlatform =
      selectedPlatform === 'all' || (item.platforms || []).includes(selectedPlatform);
    const matchesSearch =
      searchQuery === '' ||
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.body || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="mb-16">
        <HeroSection />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* BLKOUT HUB Widget - Prominent placement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-16"
        >
          <BlkoutHubWidget />
        </motion.div>

        {/* Two-column layout for Announcements and YouTube */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AnnouncementsSection />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <YouTubeEmbed />
          </motion.div>
        </div>

        {/* Content Section Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-3">
              Community Stories & Action
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Authentic voices, collective power. Explore our latest content rooted in Black feminist thought and community organizing.
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
              Powered by our AI storytelling agents
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600 dark:text-gray-400" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as PlatformType | 'all')}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all min-w-[150px]"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading content...</p>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No content found</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              {searchQuery || selectedPlatform !== 'all'
                ? 'Try adjusting your filters'
                : 'Check back soon for new content'}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <ContentCard content={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Admin Link (subtle, for authorized users) */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
            Content powered by BLKOUT Communications System
          </p>
          <a
            href="/admin"
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            Admin Access →
          </a>
        </div>
      </div>
    </div>
  );
}
