// BLKOUT Governance Page - Community-Centered Decision Making
import React from 'react';
import { Vote, Users, Shield, Heart, Info, ArrowRight, HandshakeIcon, Building, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const GovernancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section - Human Centered */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              We Decide Together
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Every voice matters. Every member shapes our future.
              This is how we build liberation - hand in hand, decision by decision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Our Shared Values Guide Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl"
            >
              <Heart className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Community First
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We center the needs, dreams, and wellbeing of Black queer people in every decision.
                Your experiences guide our path forward.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-8 rounded-2xl"
            >
              <Users className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Collective Wisdom
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We believe in the power of many voices. Together, we hold knowledge
                that no single person could possess alone.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl"
            >
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Protected Spaces
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We create safe environments where everyone can speak their truth
                without fear. Your voice is protected here.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Benefit Society Structure */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Building className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Community Benefit Society
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              BLKOUT is structured as a Community Benefit Society - a legal form that ensures
              community ownership, democratic governance, and benefits for our members and society.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Membership */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg mr-4">
                  <UserPlus className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Become a Member
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                As a Community Benefit Society member, you get a real say in how BLKOUT develops.
                Members vote on key decisions, elect the board, and help shape our future together.
              </p>
              <ul className="text-gray-700 dark:text-gray-300 mb-6 space-y-2">
                <li>• Voting rights on major decisions</li>
                <li>• Elect board members</li>
                <li>• Shape platform direction</li>
                <li>• Priority access to events and resources</li>
                <li>• Annual member meetings</li>
              </ul>
              <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Apply for Membership
              </button>
            </motion.div>

            {/* Partnership */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mr-4">
                  <HandshakeIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Partner with Us
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Organizations, businesses, and institutions can partner with BLKOUT to support
                Black queer communities while aligning with our community benefit mission.
              </p>
              <ul className="text-gray-700 dark:text-gray-300 mb-6 space-y-2">
                <li>• Support community initiatives</li>
                <li>• Collaborative projects</li>
                <li>• Ethical partnership framework</li>
                <li>• Community-led priorities</li>
                <li>• Transparent impact reporting</li>
              </ul>
              <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Explore Partnership
              </button>
            </motion.div>
          </div>

          <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
            <Info className="w-6 h-6 text-blue-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
              What makes us different?
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Unlike traditional companies, we're owned by our community, not shareholders.
              Profits are reinvested to benefit Black queer communities, not extracted for private gain.
            </p>
          </div>
        </div>
      </section>

      {/* How We Make Decisions */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            How We Make Decisions Together
          </h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                  <HandshakeIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    Community Proposals
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Any member can bring ideas to the table. We listen to each other's dreams
                    and work together to make them real. Your ideas matter here.
                  </p>
                  <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold">
                    <span>Share Your Idea</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                  <Vote className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    Collective Voting
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We vote on important decisions together. Each member has equal say,
                    and we take time to understand all perspectives before choosing our path.
                  </p>
                  <button className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-semibold">
                    <span>View Active Votes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    Working Groups
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Small groups focus on specific areas, bringing their expertise and passion
                    to serve the community. Join a group that speaks to your heart.
                  </p>
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold">
                    <span>Find Your Group</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Your Voice Shapes Our Future
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join us in building a platform that truly serves our community.
            Every contribution, every vote, every conversation matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Join the Conversation
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors">
              Learn More About Our Process
            </button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">
                  Building Together Takes Time
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We're still developing our governance tools to make participation easy and meaningful.
                  For now, join our community spaces to be part of the conversation.
                  Your input shapes what we build next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GovernancePage;