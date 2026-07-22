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
import { SocialMediaEmbeds } from '../discover/SocialMediaEmbeds';

interface DiscoverPageProps {
  onNavigate?: (tab: string) => void;
}

export default function DiscoverPage({ onNavigate }: DiscoverPageProps) {
  return (
    <div className="min-h-screen bg-liberation-black-power">
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

        {/* Heroes Video - Theory of Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mb-16"
        >
          <div
            onClick={() => onNavigate?.('movement')}
            className="bg-gradient-to-br from-liberation-pride-purple-deep to-liberation-black-power text-white p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-liberation-gold-divine transition-colors">
                Our Heroes, Our Story
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Discover how we're building liberation together
              </p>
              <div className="relative rounded-xl overflow-hidden mb-6 max-w-5xl mx-auto shadow-2xl" style={{ aspectRatio: '16/9' }}>
                <video
                  src="/videos/Heroes2.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <button className="bg-liberation-gold-divine text-liberation-black-power px-8 py-3 rounded-lg font-bold hover:bg-liberation-gold-divine/90 transition-all transform hover:scale-105">
                Explore Our Theory of Change →
              </button>
            </div>
          </div>
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
          className="mb-16 p-8 bg-white/5 backdrop-blur-sm border border-liberation-gold-divine/20 rounded-2xl shadow-lg"
        >
          <SocialMediaEmbeds />
        </motion.div>

        {/* Discreet Admin Link */}
        <div className="text-center py-4">
          <a
            href="https://blkoutuk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  );
}
