/**
 * BLKOUT Community Platform - Enhanced Discover Page
 * Integrated with comms-blkout components for unified content discovery
 *
 * Integration Points:
 * - Shared Supabase database with comms-blkout admin system
 * - Published content created by AI agents (Griot, Listener, Weaver, Strategist)
 * - Announcements managed through comms-blkout admin
 */

import { motion } from 'framer-motion';

// Integrated components from comms-blkout
import { HeroSection } from '../discover/HeroSection';
import { BlkoutHubWidget } from '../discover/BlkoutHubWidget';
import { YouTubeEmbed } from '../discover/YouTubeEmbed';
import { AdventCalendarWidget } from '../discover/AdventCalendarWidget';
import { SocialMediaEmbeds } from '../discover/SocialMediaEmbeds';

interface DiscoverPageProps {
  onNavigate?: (tab: string) => void;
}

export default function DiscoverPage({ onNavigate }: DiscoverPageProps) {
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

        {/* Advent Calendar Section - December Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mb-16 p-8 bg-gradient-to-br from-red-50 via-green-50 to-white dark:from-red-900/20 dark:via-green-900/20 dark:to-gray-900 rounded-2xl"
        >
          <AdventCalendarWidget />
        </motion.div>

        {/* YouTube Embed - Full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-16"
        >
          <YouTubeEmbed />
        </motion.div>

        {/* Social Media Embeds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-16 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        >
          <SocialMediaEmbeds />
        </motion.div>

        {/* Discreet Admin Link */}
        <div className="text-center py-4">
          <a
            href="https://comms-blkout.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  );
}
