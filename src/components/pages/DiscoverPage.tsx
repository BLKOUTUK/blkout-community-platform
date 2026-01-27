// BLKOUT Discovery Page - What's New & How to Get Involved
import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MessageCircle, Heart, Users, TrendingUp, ArrowRight, Gift, BookOpen, Instagram, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { AdventCalendarWidget } from '../discover/AdventCalendarWidget';
import CommunityActivityFeed from '../discover/CommunityActivityFeed';

interface DiscoverPageProps {
  onNavigate?: (tab: string) => void;
}

interface FeaturedStory {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ onNavigate }) => {
  const [featuredStory, setFeaturedStory] = useState<FeaturedStory | null>(null);
  const [isLoadingStory, setIsLoadingStory] = useState(true);

  // Fetch featured story from legacy_articles archive - rotates weekly
  useEffect(() => {
    const fetchFeaturedStory = async () => {
      try {
        // Get current week number to rotate featured story weekly
        const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));

        const { data, error } = await supabase
          .from('legacy_articles')
          .select('id, title, excerpt, content, published_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (data && data.length > 0) {
          // Select story based on week number for weekly rotation
          const selectedStory = data[weekNumber % data.length];
          setFeaturedStory(selectedStory);
        }
      } catch (error) {
        console.error('Error fetching featured story:', error);
      } finally {
        setIsLoadingStory(false);
      }
    };

    fetchFeaturedStory();
  }, []);

  // BLKOUT Community YouTube Playlist Videos - from PLQIvk5RMvEWxx_xt-vvwKS8k-D7eRRnDh
  const playlistVideos = [
    { id: "rxouLM4Xaeg", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" },
    { id: "7PLD773p1Uw", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" },
    { id: "7fUP1Zbjvxw", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" },
    { id: "luAr9lZ09yM", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" },
    { id: "P-UOd-pvE04", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" },
    { id: "Xl9NCrOpBYI", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" },
    { id: "8pC54GafaFU", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" },
    { id: "IEnqgfICyEE", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" },
    { id: "shuAroJcM3Y", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" },
    { id: "UIxs6AbI44k", title: "Community Stories & Liberation", description: "Discover powerful stories, insights, and conversations from the BLKOUT community" }
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
              <img
                src="/Branding and logos/blkoutlogo_wht_transparent.png"
                alt="BLKOUT"
                className="h-24 md:h-32 lg:h-40 w-auto mx-auto filter drop-shadow-2xl"
              />
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

      {/* Advent Calendar Section - December Feature */}
      <section className="py-12 px-6 bg-gradient-to-br from-red-50 via-green-50 to-white dark:from-red-900/20 dark:via-green-900/20 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <AdventCalendarWidget />
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

              {isLoadingStory ? (
                <div className="mb-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                </div>
              ) : featuredStory ? (
                <>
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded text-xs font-semibold mb-3">
                      From Our Archive
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {featuredStory.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {featuredStory.excerpt || featuredStory.content?.substring(0, 200)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      BLKOUT Archive
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(featuredStory.published_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <a
                    href={`/archive/${featuredStory.id}`}
                    className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm text-center"
                  >
                    Read in Archive
                  </a>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No featured story available
                  </p>
                </div>
              )}
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

      {/* Social Media Feeds Section */}
      <section className="py-12 px-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
            Follow Us Everywhere
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Newsletter Signup */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Newsletter
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                Get the latest updates, events, and community news delivered to your inbox.
              </p>
              <a
                href="https://crm.blkoutuk.cloud/join"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm"
              >
                <span>Subscribe Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Twitter/X Feed */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-black dark:text-white mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  X (Twitter)
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                Join the conversation and stay updated in real-time.
              </p>
              <a
                href="https://twitter.com/blaboratoryuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all text-sm"
              >
                <span>Follow @blaboratoryuk</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* TikTok */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  TikTok
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                Short-form content, community moments, and more.
              </p>
              <a
                href="https://tiktok.com/@blkoutuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all text-sm"
              >
                <span>Follow on TikTok</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Facebook */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-blue-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Facebook
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                Community events, discussions, and updates.
              </p>
              <a
                href="https://facebook.com/blaboratoryuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm"
              >
                <span>Like Our Page</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* YouTube */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-red-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  YouTube
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                Community stories, interviews, and liberation content.
              </p>
              <a
                href="https://youtube.com/@blkoutuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-sm"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Threads */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-black dark:text-white mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.781 3.632 2.695 6.54 2.717 1.986-.013 3.758-.38 5.272-1.088v-5.09H12.04V13.6h7.54v8.072c-.022.015-2.058 1.106-4.516 1.724-1.474.37-2.898.56-4.243.6-.213.003-.43.004-.635.004z"/>
                </svg>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Threads
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                Conversations, thoughts, and community threads.
              </p>
              <a
                href="https://threads.net/@blkoutuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all text-sm"
              >
                <span>Follow on Threads</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video */}
      <section className="py-12 px-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
            Watch: Community Stories
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
                      href="https://www.youtube.com/@blkoutuk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span>Subscribe</span>
                    </a>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm transition-all"
                    >
                      🎲 Random Video
                    </button>
                  </div>
                  <a
                    href="https://www.youtube.com/playlist?list=PLQIvk5RMvEWxx_xt-vvwKS8k-D7eRRnDh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 justify-center"
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

          {/* Community Activity Feed - NEW */}
          <div className="mb-8">
            <CommunityActivityFeed limit={5} showHeader={true} />
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
              <BookOpen className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                Interactive Storytelling Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Journey through BLKOUT's vision with our immersive scrollytelling introduction.
              </p>
              <a
                href="https://blkoutuk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Experience Story →
              </a>
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

      {/* Discreet Admin Link */}
      <div className="py-4 text-center">
        <a
          href="https://blkoutuk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
        >
          Admin
        </a>
      </div>
    </div>
  );
};

export default DiscoverPage;