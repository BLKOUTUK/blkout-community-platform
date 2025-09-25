import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Award, Info } from 'lucide-react';

interface VotingInterfaceProps {
  competition: any;
  onBack: () => void;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  competition,
  onBack
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);

  // Voting photos will be loaded from competition data
  const votingPhotos = competition?.votingPhotos || [];

  const currentPhoto = votingPhotos[currentIndex];

  const handleVote = (photoId: string, rating: number) => {
    setVotes(prev => ({ ...prev, [photoId]: rating }));
  };

  const handleNext = () => {
    if (currentIndex < votingPhotos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitVotes = () => {
    console.log('Submitting votes:', votes);
    setHasVoted(true);
  };

  if (hasVoted) {
    return (
      <div className="p-6 md:p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Thank You for Voting!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your voice matters in celebrating our community's creative vision.
            Winners will be announced on November 15, 2025.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-liberation-pride-purple text-white rounded-lg font-semibold"
          >
            Back to Gallery
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Community Voting</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Photo {currentIndex + 1} of {votingPhotos.length}
        </div>
      </div>

      {/* Voting Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Democratic Voting System
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              Community votes count for 30% of final scores. Board judges provide 70%.
              Every vote helps celebrate authentic creative expression.
            </p>
          </div>
        </div>
      </div>

      {/* Photo Display */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Photo */}
        <div className="relative">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden"
          >
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm font-semibold rounded backdrop-blur-sm">
              {currentPhoto.theme}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-2">
              {votingPhotos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-liberation-pride-purple'
                      : votes[votingPhotos[index].id]
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === votingPhotos.length - 1}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Photo Info & Rating */}
        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{currentPhoto.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            by {currentPhoto.artist}
          </p>

          {currentPhoto.artistStatement && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Artist Statement</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {currentPhoto.artistStatement}
              </p>
            </div>
          )}

          {/* Star Rating */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Your Rating</h4>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  onClick={() => handleVote(currentPhoto.id, rating)}
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      (votes[currentPhoto.id] || 0) >= rating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            {votes[currentPhoto.id] && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                You rated this photo {votes[currentPhoto.id]} stars
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-900 dark:text-gray-100">Voting Progress</span>
              <span className="text-gray-900 dark:text-gray-100">{Object.keys(votes).length} / {votingPhotos.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-full bg-liberation-pride-purple rounded-full transition-all"
                style={{ width: `${(Object.keys(votes).length / votingPhotos.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {currentIndex === votingPhotos.length - 1 && Object.keys(votes).length === votingPhotos.length && (
            <motion.button
              onClick={handleSubmitVotes}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit All Votes
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};