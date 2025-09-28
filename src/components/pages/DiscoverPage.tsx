// BLKOUT Discovery Page - What's New & How to Get Involved
import React from 'react';
import { Sparkles, Calendar, MessageCircle, Trophy, Heart, Users, TrendingUp, ArrowRight, Star, Gift, BookOpen, Instagram, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface DiscoverPageProps {
  onNavigate?: (tab: string) => void;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ onNavigate }) => {
  // BLKOUT Community YouTube Playlist Videos - from PLQIvk5RMvEWxx_xt-vvwKS8k-D7eRRnDh
  const playlistVideos = [
    {
      id: "rxouLM4Xaeg",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    },
    {
      id: "7PLD773p1Uw",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    },
    {
      id: "7fUP1Zbjvxw",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    },
    {
      id: "luAr9lZ09yM",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    },
    {
      id: "P-UOd-pvE04",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    },
    {
      id: "Xl9NCrOpBYI",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    },
    {
      id: "8pC54GafaFU",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    },
    {
      id: "IEnqgfICyEE",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    },
    {
      id: "shuAroJcM3Y",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    },
    {
      id: "UIxs6AbI44k",
      title: "Community Stories & Liberation",
      description: "Discover powerful stories, insights, and conversations from the BLKOUT community"
    }
  ];

  // Randomly select a video
  const randomVideo = React.useMemo(() => {
    return playlistVideos[Math.floor(Math.random() * playlistVideos.length)];
  }, []);
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
                  <span className="text-sm text-yellow-600 font-semibold">NEW ON BLKOUTUK.COM</span>
                  <h3 className="text-xl font-bold mt-1 mb-2 text-gray-900 dark:text-gray-100">
                    Fresh Stories & Community Voices
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Discover authentic narratives from our community archive - real stories
                    of joy, resilience, and liberation from Black queer voices across the UK and diaspora.
                  </p>
                  <button
                    onClick={() => onNavigate?.('stories')}
                    className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-semibold"
                  >
                    <span>Read in Archive</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram & Archive Story Section */}
      <section className="py-12 px-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
            Stay Connected
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Instagram Feed - Left Half */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Instagram className="w-6 h-6 text-pink-500 mr-2" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Live From Our Instagram
                </h3>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                Real-time updates from our community. Fresh content daily!
              </p>

              <a
                href="https://instagram.com/blkoutuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm mb-4"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow @blkoutuk</span>
                <ArrowRight className="w-3 h-3" />
              </a>

              {/* Instagram Embed - Shows actual feed */}
              <div className="instagram-embed-container" style={{ maxHeight: '400px', overflow: 'hidden' }}>
                <iframe
                  src="https://www.instagram.com/blkoutuk/embed"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="rounded-lg"
                  title="BLKOUT Instagram Feed"
                />
              </div>
            </div>

            {/* Featured Archive Story - Right Half */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  From The Archive
                </h3>
              </div>

              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded text-xs font-semibold mb-3">
                  Featured Story
                </span>
                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  Community Healing Circles Transform Mental Health Support
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  Grassroots organizations pioneer culturally-affirming mental health practices that blend traditional healing with modern therapy approaches in South London.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Amara Johnson
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  12 min read
                </span>
              </div>

              <button
                onClick={() => onNavigate?.('stories')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
              >
                Read in Archive
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LinkedIn Professional Network Section */}
      <section className="py-12 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-blue-700">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Connect with BLKOUT Professionals
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Join our professional network on LinkedIn where Black queer professionals share career opportunities,
                industry insights, and build meaningful professional relationships. From entrepreneurship to corporate leadership,
                our community is making moves across every sector.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Career Growth</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                  <Users className="w-4 h-4" />
                  <span>Networking Events</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                  <Trophy className="w-4 h-4" />
                  <span>Success Stories</span>
                </div>
              </div>

              <a
                href="https://linkedin.com/company/blkoutuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>Follow BLKOUT on LinkedIn</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video */}
      <section className="py-12 px-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
            Watch: Our Community in Action
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${randomVideo.id}?si=z3Z2ptVoZTdFNmS2`}
                  title={randomVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {randomVideo.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {randomVideo.description}
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <a
                      href={`https://www.youtube.com/@blkoutuk`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span>Subscribe to Our Channel</span>
                    </a>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm transition-all"
                    >
                      🎲 Random Video
                    </button>
                  </div>
                  <a
                    href={`https://www.youtube.com/playlist?list=PLQIvk5RMvEWxx_xt-vvwKS8k-D7eRRnDh`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-2 justify-center"
                  >
                    <span>📺 Watch Full Liberation Playlist</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Archive Highlight */}
      <section className="py-12 px-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center">
            <BookOpen className="w-8 h-8 text-green-600 mr-3" />
            From The Archive
          </h2>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <div className="flex items-start space-x-6">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-xl">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-green-600 font-semibold">ARCHIVE HIGHLIGHT</span>
                <h3 className="text-2xl font-bold mt-2 mb-4 text-gray-900 dark:text-gray-100">
                  Long Read: Counted As Warriors
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  A profound exploration of Black queer masculinity, resilience, and recognition. This featured piece
                  examines how we've been counted as warriors throughout history - not just in battle, but in love,
                  creativity, and community building. Real stories of triumph over adversity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => onNavigate?.('stories')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate?.('stories')}
                    className="px-6 py-3 bg-transparent border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    Browse Archive
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BLKOUTHUB Activity */}
      <section className="py-12 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl mb-8">
            <div className="text-center">
              {/* Large BLKOUTHUB Logo */}
              <div className="flex justify-center mb-6">
                <img
                  src="/Branding and logos/blkouthub_logo.png"
                  alt="BLKOUTHUB"
                  className="h-32 w-auto object-contain"
                />
              </div>

              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Welcome to BLKOUTHUB
              </h2>

              <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-2">Community-Powered Platform</p>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                BLKOUTHUB is where real connections happen. Share stories, find support, celebrate wins, and organize for change.
                Built by us, for us - with democratic governance and community ownership at its heart.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.open('https://blkouthub.com', '_blank')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <span>Visit BLKOUTHUB</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => window.open('https://blkouthub.com/register', '_blank')}
                  className="px-8 py-3 bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
              <MessageCircle className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Connect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Join conversations with community members worldwide</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
              <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Organize</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Build movements and coordinate collective action</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
              <Heart className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find and offer mutual aid within our network</p>
            </div>
          </div>
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