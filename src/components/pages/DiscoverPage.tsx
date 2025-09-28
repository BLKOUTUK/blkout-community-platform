// BLKOUT Discovery Page - What's New & How to Get Involved
import React from 'react';
import { Sparkles, Calendar, MessageCircle, Trophy, Heart, Users, TrendingUp, ArrowRight, Star, Gift, BookOpen, Instagram } from 'lucide-react';
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
                  <span className="text-sm text-yellow-600 font-semibold">NEW ON BLKOUTUK.COM</span>
                  <h3 className="text-xl font-bold mt-1 mb-2 text-gray-900 dark:text-gray-100">
                    Fresh Stories & Community Voices
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Discover authentic narratives from our community archive - real stories
                    of joy, resilience, and liberation from Black queer voices across the UK and diaspora.
                  </p>
                  <button
                    onClick={() => window.open('https://blkoutuk.com', '_blank')}
                    className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-semibold"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-12 px-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center">
            <Instagram className="w-8 h-8 text-pink-500 mr-3" />
            Follow Our Journey on Instagram
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Stay connected with our community through daily stories, event highlights, and moments of Black queer joy.
              </p>
              <a
                href="https://instagram.com/blkoutuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <Instagram className="w-5 h-5" />
                <span>Follow @blkoutuk</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Instagram Embed */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink="https://www.instagram.com/blkoutuk/?utm_source=ig_embed&amp;utm_campaign=loading"
                  data-instgrm-version="14"
                  style={{
                    background: '#FFF',
                    border: '0',
                    borderRadius: '3px',
                    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                    margin: '1px',
                    maxWidth: '540px',
                    minWidth: '326px',
                    padding: '0',
                    width: '99.375%'
                  }}
                >
                  <div style={{ padding: '16px' }}>
                    <a
                      href="https://www.instagram.com/blkoutuk/?utm_source=ig_embed&amp;utm_campaign=loading"
                      style={{
                        background: '#FFFFFF',
                        lineHeight: '0',
                        padding: '0 0',
                        textAlign: 'center',
                        textDecoration: 'none',
                        width: '100%'
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          backgroundColor: '#F4F4F4',
                          borderRadius: '50%',
                          flexGrow: '0',
                          height: '40px',
                          marginRight: '14px',
                          width: '40px'
                        }}></div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: '1',
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            borderRadius: '4px',
                            flexGrow: '0',
                            height: '14px',
                            marginBottom: '6px',
                            width: '100px'
                          }}></div>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            borderRadius: '4px',
                            flexGrow: '0',
                            height: '14px',
                            width: '60px'
                          }}></div>
                        </div>
                      </div>
                      <div style={{ padding: '19% 0' }}></div>
                      <div style={{
                        display: 'block',
                        height: '50px',
                        margin: '0 auto 12px',
                        width: '50px'
                      }}>
                        <Instagram className="w-12 h-12 text-pink-500" />
                      </div>
                      <div style={{ paddingTop: '8px' }}>
                        <div style={{
                          color: '#3897f0',
                          fontFamily: 'Arial,sans-serif',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: '550',
                          lineHeight: '18px'
                        }}>
                          View this profile on Instagram
                        </div>
                      </div>
                      <div style={{ padding: '12.5% 0' }}></div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: '14px',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            borderRadius: '50%',
                            height: '12.5px',
                            width: '12.5px',
                            transform: 'translateX(0px) translateY(7px)'
                          }}></div>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            height: '12.5px',
                            transform: 'rotate(-45deg) translateX(3px) translateY(1px)',
                            width: '12.5px',
                            flexGrow: '0',
                            marginRight: '14px',
                            marginLeft: '2px'
                          }}></div>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            borderRadius: '50%',
                            height: '12.5px',
                            width: '12.5px',
                            transform: 'translateX(9px) translateY(-18px)'
                          }}></div>
                        </div>
                        <div style={{ marginLeft: '8px' }}>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            borderRadius: '50%',
                            flexGrow: '0',
                            height: '20px',
                            width: '20px'
                          }}></div>
                          <div style={{
                            width: '0',
                            height: '0',
                            borderTop: '2px solid transparent',
                            borderLeft: '6px solid #f4f4f4',
                            borderBottom: '2px solid transparent',
                            transform: 'translateX(16px) translateY(-4px) rotate(30deg)'
                          }}></div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                          <div style={{
                            width: '0px',
                            borderTop: '8px solid #F4F4F4',
                            borderRight: '8px solid transparent',
                            transform: 'translateY(16px)'
                          }}></div>
                          <div style={{
                            backgroundColor: '#F4F4F4',
                            flexGrow: '0',
                            height: '12px',
                            width: '16px',
                            transform: 'translateY(-4px)'
                          }}></div>
                          <div style={{
                            width: '0',
                            height: '0',
                            borderTop: '8px solid #F4F4F4',
                            borderLeft: '8px solid transparent',
                            transform: 'translateY(-4px) translateX(8px)'
                          }}></div>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: '1',
                        justifyContent: 'center',
                        marginBottom: '24px'
                      }}>
                        <div style={{
                          backgroundColor: '#F4F4F4',
                          borderRadius: '4px',
                          flexGrow: '0',
                          height: '14px',
                          marginBottom: '6px',
                          width: '224px'
                        }}></div>
                        <div style={{
                          backgroundColor: '#F4F4F4',
                          borderRadius: '4px',
                          flexGrow: '0',
                          height: '14px',
                          width: '144px'
                        }}></div>
                      </div>
                    </a>
                    <p style={{
                      color: '#c9c8cd',
                      fontFamily: 'Arial,sans-serif',
                      fontSize: '14px',
                      lineHeight: '17px',
                      marginBottom: '0',
                      marginTop: '8px',
                      overflow: 'hidden',
                      padding: '8px 0 7px',
                      textAlign: 'center',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <a
                        href="https://www.instagram.com/blkoutuk/?utm_source=ig_embed&amp;utm_campaign=loading"
                        style={{
                          color: '#c9c8cd',
                          fontFamily: 'Arial,sans-serif',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          lineHeight: '17px',
                          textDecoration: 'none'
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        A profile shared by BLKOUT (@blkoutuk)
                      </a>
                    </p>
                  </div>
                </blockquote>
              </div>
            </div>

            {/* Alternative: Simple Instagram grid preview */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Latest from our Instagram stories and community highlights
              </p>
              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                <div className="aspect-square bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
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
                  src="https://www.youtube.com/embed/7PLD773p1Uw?si=z3Z2ptVoZTdFNmS2"
                  title="BLKOUT Community Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Experience BLKOUT Community
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  See how our community comes together to celebrate, support, and create change.
                  This is what Black queer liberation looks like in practice.
                </p>
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
                    onClick={() => window.open('https://blkoutuk.com', '_blank')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="px-6 py-3 bg-transparent border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
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
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center">
            <MessageCircle className="w-8 h-8 text-blue-500 mr-3" />
            Active in BLKOUTHUB
          </h2>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl mb-8">
            <div className="text-center">
              <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-2">Community-Powered Platform</p>
              <p className="text-gray-700 dark:text-gray-300">
                BLKOUTHUB is where real connections happen. Share stories, find support, celebrate wins, and organize for change.
                Built by us, for us - with democratic governance and community ownership at its heart.
              </p>
              <button
                onClick={() => window.open('https://blkouthub.com', '_blank')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <img
                  src="/Branding and logos/blkouthub_logo.png"
                  alt="BLKOUTHUB Logo"
                  className="w-5 h-5"
                />
                Visit BLKOUTHUB →
              </button>
            </div>
          </div>


          <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-3">
            <img
              src="/Branding and logos/blkouthub_logo.png"
              alt="BLKOUTHUB Logo"
              className="w-6 h-6"
            />
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