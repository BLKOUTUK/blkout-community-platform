import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, ArrowRight, Award, Star, Clock } from 'lucide-react';

interface CompetitionLandingProps {
  competition: any;
  onEnterCompetition: () => void;
  onViewGallery: () => void;
  onViewResults: () => void;
}

export const CompetitionLanding: React.FC<CompetitionLandingProps> = ({
  competition,
  onEnterCompetition,
  onViewGallery,
  onViewResults
}) => {
  return (
    <div className="p-6 md:p-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-[300px] md:h-[400px]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero/Photo Comp Oct25 (Video).mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              PHOTO OF THE YEAR 2025
            </h1>
            <p className="text-lg text-white/90 mb-6 max-w-2xl">
              Enter the competition today
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={onEnterCompetition}
                className="bg-liberation-pride-purple text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trophy className="w-5 h-5" />
                <span>Enter Competition</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <button
                onClick={onViewGallery}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all"
              >
                View Gallery
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Competition Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Theme Card */}
        <motion.div
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">October Themes</h3>
          </div>

          <div className="space-y-2">
            {competition.themes.map((theme: string) => (
              <div key={theme} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-gray-100">{theme}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {theme === 'Black' ? 'Power & Heritage' :
                   theme === 'Out' ? 'Queer Joy & Pride' :
                   'Future & Innovation'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Prize Card */}
        <motion.div
          className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Prizes & Recognition</h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Winner</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{competition.prizes.winner}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Featured</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{competition.prizes.featured}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Shortlisted</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{competition.prizes.shortlisted}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Community Impact</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {competition.stats.totalSubmissions}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Submissions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {competition.stats.communityVotes}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Votes Cast</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {competition.stats.activeCurators}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Curators</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                75%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Creator Share</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Competition Timeline */}
      <motion.div
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Competition Timeline</h3>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />

          <div className="space-y-4">
            <div className="relative flex items-center">
              <div className="absolute left-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="ml-12">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Submission Phase</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Now - October 31, 2025</p>
              </div>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="ml-12">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Curator Review</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">November 1-7, 2025</p>
              </div>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="ml-12">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Community Voting</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">November 8-14, 2025</p>
              </div>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="ml-12">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Winners Announced</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">November 15, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};