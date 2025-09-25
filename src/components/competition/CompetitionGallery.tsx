import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Award, Filter, Grid, List, Plus, ArrowLeft } from 'lucide-react';

interface CompetitionGalleryProps {
  competition: any;
  onVote: () => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const CompetitionGallery: React.FC<CompetitionGalleryProps> = ({
  competition,
  onVote,
  onSubmit,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterTheme, setFilterTheme] = useState<string>('all');

  // Photos will be loaded from competition data
  const photos = competition?.photos || [];

  const filteredPhotos = filterTheme === 'all'
    ? photos
    : photos.filter(p => p.theme === filterTheme);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Competition Gallery</h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={onSubmit}
            className="flex items-center space-x-2 px-4 py-2 bg-liberation-pride-purple text-white rounded-lg font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span>Submit Photo</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filter by theme:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterTheme('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterTheme === 'all'
                  ? 'bg-liberation-pride-purple text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Themes
            </button>
            {competition.themes.map((theme: string) => (
              <button
                key={theme}
                onClick={() => setFilterTheme(theme)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterTheme === theme
                    ? 'bg-liberation-pride-purple text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
        {filteredPhotos.length > 0 ? (
          filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Photo Image */}
              <div className="relative aspect-[4/3] bg-gray-200">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                {photo.isFeatured && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
                    <Award className="w-3 h-3 inline mr-1" />
                    Featured
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs font-semibold rounded backdrop-blur-sm">
                  {photo.theme}
                </div>
              </div>

              {/* Photo Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">{photo.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  by {photo.artist}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{photo.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{photo.comments}</span>
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-gray-900 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No photos have been submitted yet. Be the first to share your vision!</p>
          </div>
        )}
      </div>

      {/* Voting CTA */}
      <motion.div
        className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Ready to Vote?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Help choose this month's winners! Your vote matters in celebrating our community's creative vision.
        </p>
        <motion.button
          onClick={onVote}
          className="px-8 py-3 bg-liberation-pride-purple text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Voting
        </motion.button>
      </motion.div>
    </div>
  );
};