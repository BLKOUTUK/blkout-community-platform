import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, ArrowLeft, Download, Share2 } from 'lucide-react';

interface CompetitionResultsProps {
  competition: any;
  onBack: () => void;
}

export const CompetitionResults: React.FC<CompetitionResultsProps> = ({
  competition,
  onBack
}) => {
  // Results will be loaded from competition data
  const results = competition?.results || {
    winner: null,
    featured: [],
    shortlisted: []
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Competition Results</h2>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Winner Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Competition Winner</h3>
          <p className="text-gray-600 dark:text-gray-400">
            October 2025 Photo Competition
          </p>
        </div>

        {results.winner ? (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src={results.winner.imageUrl}
                  alt={results.winner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded">
                  Winner
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{results.winner.title}</h4>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  by {results.winner.artist}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{results.winner.theme}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Community Votes</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{results.winner.votes}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Judge Score</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{results.winner.judgeScore}/10</span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <p className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Prize</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{results.winner.prize}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Results will be announced on November 15, 2025</p>
          </div>
        )}
      </motion.div>

      {/* Featured Photos */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-gray-100">
          <Award className="w-6 h-6 text-purple-600 mr-2" />
          Featured Photos
        </h3>

        {results.featured.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {results.featured.map((photo, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">
                    Featured
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold mb-1 text-gray-900 dark:text-gray-100">{photo.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    by {photo.artist} • Theme: {photo.theme}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{photo.votes} votes</span>
                    <span>Judge: {photo.judgeScore}/10</span>
                  </div>
                  <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-sm font-semibold text-center text-gray-700 dark:text-gray-300">
                    {photo.prize}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Featured photos will be displayed after judging</p>
          </div>
        )}
      </motion.div>

      {/* Shortlisted */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-gray-100">
          <Star className="w-6 h-6 text-blue-600 mr-2" />
          Shortlisted Entries
        </h3>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          {results.shortlisted.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-4">
                {results.shortlisted.map((entry, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white dark:bg-gray-700 rounded-lg"
                  >
                    <h5 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{entry.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {entry.artist}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs rounded text-gray-700 dark:text-gray-300">
                      {entry.theme}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                All shortlisted entries receive Digital Certificates & Community Recognition
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Shortlisted entries will be announced after curation</p>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
};