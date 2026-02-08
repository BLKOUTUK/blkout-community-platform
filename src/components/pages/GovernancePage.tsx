// BLKOUT Governance Page - Board Recruitment & Community Governance
import React, { useState } from 'react';
import { Vote, Users, Shield, Heart, HandshakeIcon, Building, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BoardEOIForm from '../governance/board/BoardEOIForm';

const GovernancePage: React.FC = () => {
  const [showEOIForm, setShowEOIForm] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero - Board Recruitment Welcome */}
      <section className="relative py-24 px-6 bg-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <img
                src="/Branding and logos/blkout_logo_roundel_colour.png"
                alt="BLKOUT"
                className="h-24 md:h-32 lg:h-40 w-auto mx-auto filter drop-shadow-2xl"
              />
            </div>

            <p className="text-[#d4af37] text-sm md:text-base uppercase tracking-[0.3em] font-semibold mb-4">
              10 Years of Liberation &mdash; Now We Need You
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white uppercase tracking-tight">
              LEAD THE NEXT DECADE
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              BLKOUT is a Community Benefit Society &mdash; democratically governed, member-owned,
              built on 10 years of Black queer men loving and leading together.
            </p>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto mb-8 font-semibold">
              We're recruiting <span className="text-[#d4af37]">5 board members</span> to guide our future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#board-eoi"
                className="px-8 py-4 bg-[#d4af37] text-[#1a1a2e] font-black uppercase tracking-wide hover:bg-[#e5c349] transition-colors"
              >
                Apply for the Board
              </a>
              <a
                href="#about-blkout"
                className="px-8 py-4 border-2 border-[#d4af37] text-[#d4af37] font-bold uppercase tracking-wide hover:bg-[#d4af37]/10 transition-colors"
              >
                Learn More First
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Board Positions */}
      <section id="board-eoi" className="py-16 px-6 bg-[#1a1a2e] border-t-4 border-[#d4af37]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-white uppercase tracking-tight">
                5 Positions. 5 Ways to Lead.
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Each role shapes how BLKOUT serves our community.
                You don't need a fancy CV &mdash; you need heart for the work.
              </p>
            </motion.div>
          </div>

          {/* Position Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Chair', desc: 'Lead board meetings, represent BLKOUT publicly, ensure governance excellence. The voice of our collective vision.' },
              { title: 'Treasurer', desc: 'Oversee financial health, budgeting, reporting. Ensure our 75% creator revenue share is honoured. Liberation economics.' },
              { title: 'Secretary', desc: 'Maintain records, coordinate communications, ensure compliance. The organisational memory of our movement.' },
              { title: 'Technology Director', desc: 'Guide platform development, data sovereignty, digital strategy. Technical background valued but not required.' },
              { title: 'Community Director', desc: 'Champion member needs, partnerships, engagement. Stay rooted in the lived experiences of Black queer men across the UK.' },
            ].map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#252547] p-6 border-l-4 border-[#d4af37]"
              >
                <h3 className="text-xl font-black text-[#d4af37] uppercase tracking-tight mb-3">
                  {position.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{position.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Who We're Looking For */}
          <div className="bg-[#252547] p-8 mb-12 border-t-4 border-[#d4af37]">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6 text-center">
              Who We're Looking For
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-[#d4af37] mb-3 italic">You, Beloved</h4>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Black queer men who care deeply about our community</li>
                  <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Bring lived experience (that's enough)</li>
                  <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Can commit 4-6 hours monthly</li>
                  <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Want to learn and grow with us</li>
                </ul>
                <p className="mt-4 text-sm text-gray-400 italic">
                  Formal qualifications? Optional. Heart for the work? Essential.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#d4af37] mb-3 italic">What You'll Do</h4>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Monthly board meetings (2 hours)</li>
                  <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Strategic planning sessions</li>
                  <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Connect us with your networks</li>
                  <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Hold us accountable to our values</li>
                  <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Democratic decision-making</li>
                </ul>
                <p className="mt-4 text-sm text-gray-400 italic">
                  This is cooperative governance. Your voice genuinely matters here.
                </p>
              </div>
            </div>
          </div>

          {/* Especially Welcome */}
          <div className="bg-[#252547] border-l-4 border-[#d4af37] p-6 mb-12">
            <p className="text-gray-300">
              <strong className="text-[#d4af37]">Especially welcome:</strong> First-time board
              members, people outside London, those with lived experience in health, housing,
              immigration, or other community challenges. Governance training will be provided.
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-[#4a1942] text-white p-8 mb-12 border-t-4 border-[#d4af37]">
            <h3 className="text-2xl font-black mb-6 text-center uppercase tracking-tight">Timeline</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-black text-[#d4af37]">Feb 21</div>
                <div className="text-purple-200 mt-1">EOI Deadline</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#d4af37]">Feb 22-23</div>
                <div className="text-purple-200 mt-1">Info Session on BLKOUTHUB</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#d4af37]">TBA</div>
                <div className="text-purple-200 mt-1">Board Elections at AGM</div>
              </div>
            </div>
          </div>

          {/* EOI Form Toggle */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowEOIForm(!showEOIForm)}
              className="px-8 py-4 bg-[#d4af37] text-[#1a1a2e] font-black uppercase tracking-wide hover:bg-[#e5c349] transition-colors inline-flex items-center gap-2 text-lg"
            >
              {showEOIForm ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  Hide Application Form
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  Apply Now &mdash; Submit Your EOI
                </>
              )}
            </button>
            <p className="text-gray-400 mt-3 italic">
              The revolution needs governance, beloved. And governance needs you.
            </p>
          </div>

          {/* EOI Form */}
          <AnimatePresence>
            {showEOIForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BoardEOIForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* About BLKOUT - Context for Board Candidates */}
      <section id="about-blkout" className="py-16 px-6 bg-black border-t border-[#d4af37]/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4 text-white uppercase tracking-tight">
            About BLKOUT
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Understanding what you'd be leading
          </p>

          {/* CBS Structure + History */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#252547] p-8 border-l-4 border-[#d4af37]">
              <Building className="w-10 h-10 text-[#d4af37] mb-4" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                Community Benefit Society
              </h3>
              <p className="text-gray-300 mb-4">
                BLKOUT is structured as a CBS &mdash; a legal form ensuring community ownership,
                democratic governance, and benefits for our members and society. Unlike traditional
                companies, we're owned by our community, not shareholders.
              </p>
              <p className="text-gray-300">
                Profits are reinvested to benefit Black queer communities, not extracted for private gain.
                75% of revenue goes directly to creators and community &mdash; hardcoded, not aspirational.
              </p>
            </div>

            <div className="bg-[#252547] p-8 border-l-4 border-[#d4af37]">
              <Users className="w-10 h-10 text-[#d4af37] mb-4" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                10 Years. 10,000 Brothers.
              </h3>
              <p className="text-gray-300 mb-4">
                Founded in 2016 as gatherings in London &mdash; just brothers finding each other.
                Grew to Manchester, Birmingham, Bristol. Survived a pandemic by becoming lifelines
                for each other online.
              </p>
              <p className="text-gray-300">
                In 2025 we launched a full liberation technology platform: AIvor voice assistant,
                Events Calendar, News Platform, Communications Hub. Now we need governance to match
                our ambition.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#252547] p-6 border-t-2 border-[#d4af37]">
              <Heart className="w-8 h-8 text-[#d4af37] mb-3" />
              <h3 className="text-lg font-bold mb-2 text-white">Community First</h3>
              <p className="text-gray-400 text-sm">
                We centre the needs, dreams, and wellbeing of Black queer people in every decision.
              </p>
            </div>
            <div className="bg-[#252547] p-6 border-t-2 border-[#d4af37]">
              <Users className="w-8 h-8 text-[#d4af37] mb-3" />
              <h3 className="text-lg font-bold mb-2 text-white">Collective Wisdom</h3>
              <p className="text-gray-400 text-sm">
                We believe in the power of many voices. Together, we hold knowledge
                no single person could possess alone.
              </p>
            </div>
            <div className="bg-[#252547] p-6 border-t-2 border-[#d4af37]">
              <Shield className="w-8 h-8 text-[#d4af37] mb-3" />
              <h3 className="text-lg font-bold mb-2 text-white">Protected Spaces</h3>
              <p className="text-gray-400 text-sm">
                We create safe environments where everyone can speak their truth without fear.
              </p>
            </div>
          </div>

          {/* Values Image */}
          <div className="flex justify-center mb-12">
            <img
              src="/Branding and logos/blkoutvalues.png"
              alt="BLKOUT Values"
              className="max-w-full h-auto max-w-md shadow-lg border-2 border-[#d4af37]/30"
            />
          </div>
        </div>
      </section>

      {/* How We Make Decisions */}
      <section className="py-16 px-6 bg-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12 text-white uppercase tracking-tight">
            How We Make Decisions Together
          </h2>

          <div className="space-y-6">
            <div className="bg-[#252547] p-8 border-l-4 border-[#d4af37]">
              <div className="flex items-start space-x-4">
                <HandshakeIcon className="w-8 h-8 text-[#d4af37] flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Community Proposals</h3>
                  <p className="text-gray-300">
                    Any member can bring ideas to the table. We listen to each other's dreams
                    and work together to make them real.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#252547] p-8 border-l-4 border-[#d4af37]">
              <div className="flex items-start space-x-4">
                <Vote className="w-8 h-8 text-[#d4af37] flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Collective Voting</h3>
                  <p className="text-gray-300">
                    We vote on important decisions together. Each member has equal say,
                    and we take time to understand all perspectives before choosing our path.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#252547] p-8 border-l-4 border-[#d4af37]">
              <div className="flex items-start space-x-4">
                <Users className="w-8 h-8 text-[#d4af37] flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white">Working Groups</h3>
                  <p className="text-gray-300">
                    Small groups focus on specific areas, bringing their expertise and passion
                    to serve the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story-Powered Platform Video */}
      <section className="py-16 px-6 bg-black border-t border-[#d4af37]/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4 text-white uppercase tracking-tight">
            Our Story-Powered Platform
          </h2>
          <p className="text-lg text-center text-gray-400 mb-8 max-w-3xl mx-auto">
            BLKOUT is built on the power of our stories. See how we're creating technology
            that centres Black queer voices.
          </p>
          <div className="max-w-4xl mx-auto">
            <video
              controls
              className="w-full shadow-2xl border-2 border-[#d4af37]/30"
              poster="/videos/onboarding/story-powered-poster.jpg"
            >
              <source src="/videos/onboarding/story powered full width (Video).mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Development Roadmap */}
      <section className="py-16 px-6 bg-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4 text-white uppercase tracking-tight">
            Where We're Headed
          </h2>
          <p className="text-lg text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            We're building BLKOUT in phases, guided by community needs and our commitment to
            liberatory technology.
          </p>

          <div className="flex justify-center mb-12">
            <img
              src="/Branding and logos/REALNESS UNLEASHED Infographic Graph.png"
              alt="BLKOUT Realness Unleashed Development Roadmap"
              className="max-w-full h-auto shadow-2xl border-2 border-[#d4af37]/30"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#252547] p-8 border-l-4 border-[#d4af37]">
              <span className="text-[#d4af37] font-black text-2xl">1</span>
              <h3 className="text-xl font-bold mb-4 text-white mt-2">Foundation (Current)</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Community news curation platform</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Events calendar for Black queer spaces</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Chrome extensions for content submission</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Basic moderation workflows</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Member profiles and authentication</li>
              </ul>
            </div>

            <div className="bg-[#252547] p-8 border-l-4 border-[#d4af37]">
              <span className="text-[#d4af37] font-black text-2xl">2</span>
              <h3 className="text-xl font-bold mb-4 text-white mt-2">Community Tools</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Community proposal system</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Democratic voting on decisions</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Working group coordination</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Member directory and networking</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Transparent governance dashboard</li>
              </ul>
            </div>

            <div className="bg-[#252547] p-8 border-l-4 border-[#d4af37]">
              <span className="text-[#d4af37] font-black text-2xl">3</span>
              <h3 className="text-xl font-bold mb-4 text-white mt-2">Liberation Features</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Mutual aid coordination</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Resource sharing marketplace</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Community storytelling archive</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Skill sharing and mentorship</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Wellness and healing resources</li>
              </ul>
            </div>

            <div className="bg-[#252547] p-8 border-l-4 border-[#d4af37]">
              <span className="text-[#d4af37] font-black text-2xl">4</span>
              <h3 className="text-xl font-bold mb-4 text-white mt-2">Full Liberation Platform</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Decentralised infrastructure</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Community-owned data sovereignty</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Economic cooperation tools</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>International solidarity networks</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Full community autonomy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Membership & Partnership */}
      <section className="py-16 px-6 bg-black border-t border-[#d4af37]/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#252547] p-8 border-t-4 border-[#d4af37]">
              <UserPlus className="w-10 h-10 text-[#d4af37] mb-4" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                Become a Member
              </h3>
              <p className="text-gray-300 mb-6">
                As a CBS member, you get a real say in how BLKOUT develops.
                Members vote on key decisions, elect the board, and shape our future.
              </p>
              <ul className="text-gray-300 mb-6 space-y-2 text-sm">
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Voting rights on major decisions</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Elect board members</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Shape platform direction</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Priority access to events and resources</li>
              </ul>
              <button className="w-full px-6 py-3 bg-[#d4af37] text-[#1a1a2e] font-bold uppercase tracking-wide hover:bg-[#e5c349] transition-colors">
                Apply for Membership
              </button>
            </div>

            <div className="bg-[#252547] p-8 border-t-4 border-[#d4af37]">
              <HandshakeIcon className="w-10 h-10 text-[#d4af37] mb-4" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                Partner with Us
              </h3>
              <p className="text-gray-300 mb-6">
                Organisations can partner with BLKOUT to support Black queer communities
                while aligning with our community benefit mission.
              </p>
              <ul className="text-gray-300 mb-6 space-y-2 text-sm">
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Support community initiatives</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Collaborative projects</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Ethical partnership framework</li>
                <li className="flex items-start"><span className="text-[#d4af37] mr-3">&mdash;</span>Transparent impact reporting</li>
              </ul>
              <button className="w-full px-6 py-3 border-2 border-[#d4af37] text-[#d4af37] font-bold uppercase tracking-wide hover:bg-[#d4af37]/10 transition-colors">
                Explore Partnership
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#4a1942] to-[#1a1a2e] border-t-4 border-[#d4af37]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
            Your Voice Shapes Our Future
          </h2>
          <p className="text-xl text-gray-300 mb-8 italic">
            The revolution needs governance, beloved. And governance needs you.
          </p>
          <a
            href="#board-eoi"
            className="inline-block px-10 py-5 bg-[#d4af37] text-[#1a1a2e] font-black uppercase tracking-wide text-lg hover:bg-[#e5c349] transition-colors"
          >
            Apply for the Board
          </a>
        </div>
      </section>

      {/* Legal & Policies */}
      <section className="py-12 px-6 bg-[#0f0f1a] border-t border-[#d4af37]/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg font-bold mb-4 text-gray-400 uppercase tracking-wide">
            Legal & Policies
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            Transparency is core to our values.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/terms"
              className="px-6 py-3 bg-[#252547] text-gray-300 hover:text-[#d4af37] transition-colors font-medium text-sm"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="px-6 py-3 bg-[#252547] text-gray-300 hover:text-[#d4af37] transition-colors font-medium text-sm"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GovernancePage;
