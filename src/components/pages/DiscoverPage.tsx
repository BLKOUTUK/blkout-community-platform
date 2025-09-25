// BLKOUT Discovery Page - What's New & How to Get Involved
import React from 'react';
import { Sparkles, Calendar, MessageCircle, Trophy, Heart, Users, TrendingUp, BookOpen, Camera, Mic, ArrowRight, Star, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const DiscoverPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Sparkles className="w-16 h-16 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Discover What's Happening
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              New features, community highlights, and ways to connect.
              Your guide to everything BLKOUT.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's New Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center">
            <Star className="w-8 h-8 text-yellow-500 mr-3" />
            What's New This Month
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-2xl"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-purple-600 font-semibold">LAUNCHING NOW</span>
                  <h3 className="text-xl font-bold mt-1 mb-2 text-gray-900 dark:text-gray-100">
                    Photo of the Year 2025 Competition
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Share your vision of Black queer joy. Win £500 and be featured
                    in our community gallery. Submissions open until October 31st!
                  </p>
                  <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold">
                    <span>Enter Competition</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 p-6 rounded-2xl"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-yellow-600 font-semibold">COMMUNITY UPDATE</span>
                  <h3 className="text-xl font-bold mt-1 mb-2 text-gray-900 dark:text-gray-100">
                    New Governance Tools
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Your voice matters more than ever. Check out our new voting system
                    and submit your ideas for platform improvements.
                  </p>
                  <button className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-semibold">
                    <span>Join Discussion</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BLKOUTHUB Activity */}
      <section className="py-12 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center">
            <MessageCircle className="w-8 h-8 text-blue-500 mr-3" />
            Active in BLKOUTHUB
          </h2>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl mb-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">23</div>
                <p className="text-gray-700 dark:text-gray-300">Active Discussions</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-600 mb-2">156</div>
                <p className="text-gray-700 dark:text-gray-300">Members Online</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                <p className="text-gray-700 dark:text-gray-300">Events This Week</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mic className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Weekly Community Call</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Every Thursday 7pm GMT</p>
                </div>
              </div>
              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                Happening Now
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Book Club: "Pleasure Activism"</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discussion thread open</p>
                </div>
              </div>
              <span className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Join →
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Camera className="w-5 h-5 text-pink-500" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Photo Competition Tips</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Community sharing session</p>
                </div>
              </div>
              <span className="text-pink-600 hover:text-pink-700 font-semibold text-sm">
                View →
              </span>
            </div>
          </div>

          <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Join BLKOUTHUB Community
          </button>
        </div>
      </section>

      {/* Things You Might Have Missed */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center">
            <Gift className="w-8 h-8 text-purple-500 mr-3" />
            Things You Might Have Missed
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <Calendar className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                Community Events Calendar
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Never miss another gathering. Sync our events directly to your calendar.
              </p>
              <button className="text-green-600 hover:text-green-700 font-semibold text-sm">
                Explore Events →
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <Heart className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                IVOR Support Sessions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our AI companion is here for you 24/7. Start a confidential chat anytime.
              </p>
              <button className="text-red-600 hover:text-red-700 font-semibold text-sm">
                Meet IVOR →
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                Your Impact Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                See how your participation is helping build our community.
              </p>
              <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                View Impact →
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Dive Deeper?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Choose your own adventure. Every action makes our community stronger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Start Contributing
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors">
              Take a Tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;