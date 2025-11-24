// Enhanced Hero Section - Adapted for BLKOUT Community Platform
import { Sparkles, Heart, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient matching liberation theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center py-16"
      >
        {/* BLKOUT Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/Branding and logos/blkoutlogo_wht_transparent.png"
            alt="BLKOUT"
            className="h-24 md:h-32 lg:h-40 w-auto mx-auto filter drop-shadow-2xl"
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">
          Community Platform
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-4">
          Your home for <span className="text-purple-600 dark:text-purple-400 font-semibold">Black queer liberation</span> technology
        </p>

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-balance mb-8">
          Built by and for our communities with sovereignty, safety, and collective power at the core.
        </p>

        {/* Values badges with liberation theme colors */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center text-sm mb-8"
        >
          <span className="px-5 py-2.5 bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-700 dark:text-amber-400 rounded-full font-semibold border border-amber-500/20 flex items-center gap-2">
            <Heart size={16} />
            Creator Sovereignty
          </span>
          <span className="px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 text-emerald-700 dark:text-emerald-400 rounded-full font-semibold border border-emerald-500/20 flex items-center gap-2">
            <Users size={16} />
            Community Power
          </span>
          <span className="px-5 py-2.5 bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 text-indigo-700 dark:text-indigo-400 rounded-full font-semibold border border-indigo-500/20 flex items-center gap-2">
            <Sparkles size={16} />
            Democratic Governance
          </span>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12"
        >
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">32K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Community Members</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <Heart className="h-8 w-8 mx-auto mb-2 text-pink-600 dark:text-pink-400" />
            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">Liberation</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Through Love & Justice</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">Community</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ownership & Power</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
