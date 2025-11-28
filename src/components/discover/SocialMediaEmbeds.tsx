// Social Media Embeds - BLKOUT Community Platform
// Placeholder components for social media integrations
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Music2, ExternalLink } from 'lucide-react';

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  handle: string;
  url: string;
  color: string;
  bgGradient: string;
  description: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: 'Instagram',
    icon: <Instagram className="w-8 h-8" />,
    handle: '@blaborator',
    url: 'https://instagram.com/blaborator',
    color: 'text-pink-600',
    bgGradient: 'from-pink-500 via-purple-500 to-orange-400',
    description: 'Photos, stories & community moments'
  },
  {
    name: 'X (Twitter)',
    icon: <Twitter className="w-8 h-8" />,
    handle: '@blkoutuk',
    url: 'https://twitter.com/blkoutuk',
    color: 'text-gray-900 dark:text-white',
    bgGradient: 'from-gray-800 to-gray-600',
    description: 'Updates, threads & conversations'
  },
  {
    name: 'TikTok',
    icon: <Music2 className="w-8 h-8" />,
    handle: '@blkoutuk',
    url: 'https://tiktok.com/@blkoutuk',
    color: 'text-black dark:text-white',
    bgGradient: 'from-black via-pink-500 to-cyan-400',
    description: 'Short-form content & trends'
  },
  {
    name: 'Facebook',
    icon: <Facebook className="w-8 h-8" />,
    handle: 'BLKOUT UK',
    url: 'https://facebook.com/blkoutuk',
    color: 'text-blue-600',
    bgGradient: 'from-blue-600 to-blue-400',
    description: 'Events, groups & community'
  }
];

export function SocialMediaEmbeds() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Follow Us Everywhere
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Stay connected with the BLKOUT community across all platforms
        </p>
      </div>

      {/* Social Platform Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {socialPlatforms.map((platform, index) => (
          <SocialPlatformCard key={platform.name} platform={platform} index={index} />
        ))}
      </div>

      {/* Linktree / All Links */}
      <div className="text-center pt-4">
        <a
          href="https://linktr.ee/blkoutuk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg"
        >
          View All Links
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

function SocialPlatformCard({ platform, index }: { platform: SocialPlatform; index: number }) {
  return (
    <motion.a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="block"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
        {/* Gradient Header */}
        <div className={`h-3 bg-gradient-to-r ${platform.bgGradient}`} />

        {/* Content */}
        <div className="p-4 text-center">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 mb-3 ${platform.color}`}>
            {platform.icon}
          </div>

          {/* Platform Info */}
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
            {platform.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {platform.handle}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-500 line-clamp-2">
            {platform.description}
          </p>
        </div>
      </div>
    </motion.a>
  );
}
