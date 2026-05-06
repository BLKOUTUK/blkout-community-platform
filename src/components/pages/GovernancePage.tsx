// BLKOUT Governance Page - Community Governance & CBS Information
import React from 'react';
import { Vote, Users, Shield, Heart, HandshakeIcon, Building, UserPlus, Mail, ArrowRight, UsersRound } from 'lucide-react';
import { motion } from 'framer-motion';

const GovernancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero - Governance Overview */}
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
              Community Benefit Society
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white uppercase tracking-tight">
              GOVERNANCE
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              BLKOUT is democratically governed, member-owned, and built on 10 years
              of Black queer men loving and leading together.
            </p>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto font-semibold">
              Cooperative ownership. Collective power.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meet the Board — prominent CTA above the structure */}
      <section className="py-12 px-6 bg-black border-t-4 border-[#d4af37]">
        <div className="max-w-4xl mx-auto">
          <motion.a
            href="/our-board/"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="block bg-[#1a1a2e] border-4 border-[#d4af37] p-8 md:p-10 hover:bg-[#d4af37]/5 transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <UsersRound className="w-16 h-16 text-[#d4af37] flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#d4af37] transition-colors">
                  Meet the Board
                </h2>
                <p className="text-gray-300 text-lg">
                  Six directors, paired for accountability. See who's leading BLKOUT into year eleven.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 font-black uppercase tracking-wide group-hover:bg-[#e5c349] transition-colors">
                Meet the Board
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>
        </div>
      </section>

      {/* Board Structure — Leadership Pairs */}
      <section id="board-structure" className="py-16 px-6 bg-[#1a1a2e]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3 text-center">
              How the Board Works
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto text-center mb-10">
              Cooperative governance through <span className="text-[#d4af37] font-bold">leadership pairs</span> &mdash;
              one role, two people, mutual accountability. Each pair builds a working group to widen
              member engagement beyond the board itself.
            </p>

            {/* Leadership row */}
            <h3 className="text-xs font-black text-[#d4af37] uppercase tracking-[0.3em] mb-4 text-center">Leadership</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {[
                { title: 'Chair', desc: 'Leads board meetings, represents BLKOUT publicly, holds the strategic line.' },
                { title: 'Vice-Chair / Secretary', desc: 'Records, communications, compliance. The organisational memory.' },
                { title: 'Managing Editor', desc: 'Editorial direction across news, comms, and platform voice.' },
              ].map((position, index) => (
                <motion.div
                  key={position.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#252547] p-6 border-l-4 border-[#d4af37]"
                >
                  <h4 className="text-lg font-black text-[#d4af37] uppercase tracking-tight mb-2">
                    {position.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{position.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Functional pairs row */}
            <h3 className="text-xs font-black text-[#d4af37] uppercase tracking-[0.3em] mb-4 text-center">Functional Pairs</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Community',
                  desc: 'Champions member needs, partnerships, engagement. Rooted in the lived experiences of Black queer men across the UK.',
                  vacant: false,
                },
                {
                  title: 'Digital',
                  desc: 'Guides platform development, data sovereignty, technology strategy. Technical background valued, not required.',
                  vacant: false,
                },
                {
                  title: 'Finance / Fundraising',
                  desc: 'Stewards financial health, budgeting, reporting. Ensures our 75% creator revenue share is honoured.',
                  vacant: true,
                },
              ].map((pair, index) => (
                <motion.div
                  key={pair.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 border-l-4 ${
                    pair.vacant
                      ? 'bg-[#3a2a1a] border-[#e5c349]'
                      : 'bg-[#252547] border-[#d4af37]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-black text-[#d4af37] uppercase tracking-tight">
                      {pair.title}
                    </h4>
                    {pair.vacant && (
                      <span className="text-[10px] font-black text-[#1a1a2e] bg-[#e5c349] px-2 py-0.5 uppercase tracking-wider">
                        Recruiting
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{pair.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Still Recruiting */}
      <section id="board-eoi" className="py-16 px-6 bg-black border-t border-[#d4af37]/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#1a1a2e] border-2 border-[#d4af37] p-8 md:p-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <UserPlus className="w-10 h-10 text-[#d4af37]" />
                <span className="text-[10px] font-black text-[#1a1a2e] bg-[#e5c349] px-3 py-1 uppercase tracking-[0.2em]">
                  Open Now
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 text-center">
                We're Still Recruiting
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto text-center mb-4">
                The Finance / Fundraising pair has an open seat &mdash; we're actively looking for a
                <span className="text-[#d4af37] font-bold"> co-treasurer</span> to steward BLKOUT's
                liberation economics alongside their pair-partner.
              </p>
              <p className="text-gray-300 max-w-2xl mx-auto text-center mb-6">
                Other pairs welcome conversations from members ready to step up &mdash; the board
                is meant to grow with us. If you've thought about contributing, this is the
                invitation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="mailto:governance@blkoutuk.com?subject=Board%20interest"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-[#1a1a2e] font-black uppercase tracking-wide hover:bg-[#e5c349] transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Express Interest
                </a>
                <a
                  href="/our-board/"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#d4af37] text-[#d4af37] font-bold uppercase tracking-wide hover:bg-[#d4af37]/10 transition-colors"
                >
                  Meet the Board
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About BLKOUT - Context */}
      <section id="about-blkout" className="py-16 px-6 bg-black border-t border-[#d4af37]/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4 text-white uppercase tracking-tight">
            About BLKOUT
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Community-owned liberation technology
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
            href="mailto:governance@blkoutuk.com"
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#d4af37] text-[#1a1a2e] font-black uppercase tracking-wide text-lg hover:bg-[#e5c349] transition-colors"
          >
            <Mail className="w-5 h-5" />
            Get in Touch
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
