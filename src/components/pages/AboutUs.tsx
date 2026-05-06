// BLKOUT Liberation Platform - About Us Page
// Comprehensive transparency, policies, and technical information

import React, { useState } from 'react';
import { Shield, Heart, Users, MapPin, Mail, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import VideoHero from '@/components/ui/VideoHero';
import FoundationLayer from '@/components/foundation/FoundationLayer';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ title, children, defaultOpen = false }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-gray-800 hover:bg-gray-750 transition-colors text-left"
      >
        <h3 className="text-xl font-black text-liberation-sovereignty-gold">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-liberation-sovereignty-gold" />
        ) : (
          <ChevronDown className="w-5 h-5 text-liberation-sovereignty-gold" />
        )}
      </button>
      {isOpen && (
        <div className="p-6 bg-gray-900 border-t border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

interface AboutUsProps {
  onNavigate?: (tab: 'compliance' | string) => void;
}

export default function AboutUs({ onNavigate }: AboutUsProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Video Background */}
      <VideoHero
        title="ABOUT"
        subtitle="For and By Black Queer Men"
        description="&quot;Without community, there is no liberation&quot;"
        videos={[
          '/videos/hero/PLATFORM HERO 1.mp4',
          '/videos/hero/PLATFORM HERO 2.mp4',
          '/videos/hero/PLATFORM HERO 3.mp4'
        ]}
        height="lg"
        textColor="light"
        overlayOpacity={0.8}
        className="mb-8"
        logoSrc="/Branding and logos/blkoutlogo_wht_transparent.png"
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-liberation-healing-sage" />
              <span className="text-liberation-healing-sage font-bold">Community Benefit Society</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-liberation-pride-pink" />
              <span className="text-liberation-pride-pink font-bold">Liberation-First</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-liberation-sovereignty-gold" />
              <span className="text-liberation-sovereignty-gold font-bold">Community-Owned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Theory of Change CTA - Featured Introduction (foundation: joy — welcome / invitation) */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <a
          href="/movement"
          className="relative block overflow-hidden bg-liberation-black-power border-4 border-liberation-gold-divine rounded-sharp p-8 hover:bg-liberation-gold-divine/5 transition-all duration-300 group"
        >
          <FoundationLayer category="joy" seed="aboutus-toc" opacity={0.18} />
          <div className="relative z-10 text-center">
            <h2 className="font-signature text-3xl md:text-4xl font-black text-white uppercase mb-4 group-hover:text-liberation-gold-divine transition-colors [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)]">
              Our Theory of Change
            </h2>
            <p className="text-white text-lg mb-6 [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)]">
              New to BLKOUT? Start with our story - an immersive journey through isolation to liberation.
            </p>
            <div className="inline-flex items-center gap-2 bg-liberation-gold-divine text-black px-6 py-3 rounded-lg font-bold uppercase">
              Experience Our Story
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </a>
      </div>

      {/* Board CTA */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <a
          href="/our-board/"
          className="block bg-liberation-black-power border-2 border-liberation-gold-divine/40 rounded-sharp p-8 hover:border-liberation-gold-divine transition-all duration-300 group"
        >
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-liberation-gold-divine/10 border-2 border-liberation-gold-divine/40 flex items-center justify-center group-hover:bg-liberation-gold-divine/20 transition-colors">
              <Users className="w-8 h-8 text-liberation-gold-divine" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                Meet the Board
              </h2>
              <p className="text-gray-300 text-base mb-3">
                BLKOUT is a Community Benefit Society. Our board is Black queer men who volunteer their time to govern this cooperative — in paired leadership, with community advisory groups.
              </p>
              <div className="inline-flex items-center gap-2 text-liberation-gold-divine font-bold uppercase text-sm group-hover:gap-3 transition-all">
                See Who We Are
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">

          {/* Mission & Values */}
          <CollapsibleSection title="Our Liberation Mission" defaultOpen={true}>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-liberation-pride-pink mb-3">Core Mission</h4>
                <p className="text-gray-300 leading-relaxed">
                  BLKOUT Liberation Platform exists to create technical infrastructure that prioritizes Black queer liberation
                  through economic sovereignty, democratic governance, and trauma-informed community protection. We reject
                  extractive technology models in favor of cooperative ownership and genuine community empowerment.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-liberation-pride-pink">
                  <h5 className="text-liberation-pride-pink font-bold mb-2">Fair Creator Compensation</h5>
                  <p className="text-sm text-gray-300">
                    As a Community Benefit Society with asset lock, any profits are reinvested in the community.
                    Creators receive fair compensation at rates agreed through democratic governance. Creators
                    have a say in where 75% of profits are reinvested: mutual aid, diaspora support, and creative enterprise.
                  </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-liberation-pride-purple">
                  <h5 className="text-liberation-pride-purple font-bold mb-2">Democratic Governance</h5>
                  <p className="text-sm text-gray-300">
                    One-member-one-vote community governance with transparent decision-making processes.
                    No corporate board overrides - community decisions are technically binding.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Leadership & Transparency */}
          <CollapsibleSection title="Leadership & Transparency" defaultOpen={true}>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-liberation-sovereignty-gold mb-3">Transparent Leadership</h4>
                <p className="text-gray-300 leading-relaxed mb-6">
                  True to our values of transparency and accountability, we believe you should know who's behind BLKOUT
                  and what drives our work. Leadership isn't about hierarchy—it's about responsibility to the community.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-liberation-sovereignty-gold">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src="/Branding and logos/Robwebsite.png"
                      alt="Dr Rob Berkeley - Site Editor & Creator"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <h5 className="text-xl font-bold text-liberation-sovereignty-gold mb-1">Dr Rob Berkeley</h5>
                      <p className="text-liberation-pride-pink font-semibold mb-3">Site Editor & Creator</p>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Award-winning busybody and recovering academic, Dr Rob Berkeley leads the development of BLKOUT Media.
                      He was director of the racial justice think-tank, Runnymede Trust (2009-14), before a stint advising
                      the BBC on audience accountability. He serves on the boards of Stanley Arts (SE25), the Black Boy Joy
                      Club CIC, and is a Chair of Doc Society, and the Black Researcher Consortium. Rob was awarded an MBE
                      in 2015 for services to equality.
                    </p>
                    <div className="text-sm text-gray-400">
                      <p className="mb-2"><strong>Why we share this:</strong> Transparency builds trust. You have a right to know who makes decisions
                      that affect your community experience.</p>
                      <p><strong>Accountability:</strong> Questions, feedback, or concerns can be directed to the community governance
                      processes or through our democratic decision-making channels.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-bold text-liberation-healing-sage mb-2">🌟 Our Transparency Commitments</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Open-source platform development</li>
                    <li>• Public financial reporting for Community Benefit Society</li>
                    <li>• Democratic governance processes with community oversight</li>
                    <li>• Regular community feedback sessions and accountability check-ins</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-bold text-liberation-pride-purple mb-2">⚖️ Accountability Mechanisms</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Community governance board with elected representatives</li>
                    <li>• Annual general meetings open to all community members</li>
                    <li>• Transparent decision-making processes and community voting</li>
                    <li>• Clear channels for community concerns and feedback</li>
                  </ul>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Story Powered Full Width Video */}
          <div className="my-8 -mx-6 md:-mx-0">
            <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/onboarding/story powered full width (Video).mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Trauma-Informed Practices */}
          <CollapsibleSection title="Trauma-Informed Practices Explained">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-liberation-healing-sage mb-3">What "Trauma-Informed" Actually Means</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our trauma-informed approach is based on evidence-based practices, not just buzzwords.
                  We implement specific technical and community features designed around trauma recovery principles.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-bold text-liberation-healing-sage mb-2">🛡️ Safety First</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Content warnings and trigger alerts before potentially harmful content</li>
                    <li>• Granular privacy controls - users control what they share and with whom</li>
                    <li>• Anonymous participation options for sensitive discussions</li>
                    <li>• No location tracking without explicit consent</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-bold text-liberation-healing-sage mb-2">🤝 Trustworthiness & Transparency</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Open-source platform architecture - no hidden algorithms</li>
                    <li>• Financial transparency - all revenue sharing publicly auditable</li>
                    <li>• Clear community guidelines co-created by members</li>
                    <li>• Predictable moderation processes with community oversight</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-bold text-liberation-healing-sage mb-2">✊ Choice & Collaboration</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Democratic governance - community members shape platform policies</li>
                    <li>• Multiple engagement options - no forced participation</li>
                    <li>• Peer support networks with trained community facilitators</li>
                    <li>• Restorative justice approaches to conflict resolution</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-bold text-liberation-healing-sage mb-2">🌟 Empowerment & Cultural Responsiveness</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Black queer joy celebration integrated into platform design</li>
                    <li>• Economic empowerment through fair creator compensation and community ownership</li>
                    <li>• Cultural authenticity prioritized over growth metrics</li>
                    <li>• Community healing circles and mutual aid coordination</li>
                  </ul>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Safer Spaces Policy */}
          <CollapsibleSection title="Safer Spaces - Why & How">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-liberation-pride-purple mb-3">Creating Genuinely Safer Spaces</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We call them "safer" not "safe" spaces because we acknowledge that complete safety cannot be guaranteed,
                  but we can create conditions that significantly reduce harm and promote healing.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-liberation-pride-purple">
                  <h5 className="font-bold text-liberation-pride-purple mb-2">Community Protection Measures</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Proactive moderation by trained community members</li>
                    <li>• Zero tolerance for racism, transphobia, homophobia, or other oppression</li>
                    <li>• Content moderation queue system with community oversight</li>
                    <li>• Immediate response protocols for harassment or threats</li>
                    <li>• De-escalation training for community moderators</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-liberation-healing-sage">
                  <h5 className="font-bold text-liberation-healing-sage mb-2">Harm Reduction Approach</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Restorative justice processes instead of punitive banning</li>
                    <li>• Mental health crisis intervention protocols</li>
                    <li>• Conflict mediation by trained community facilitators</li>
                    <li>• Regular community check-ins and feedback mechanisms</li>
                    <li>• Connection to local mental health and crisis resources</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-liberation-sovereignty-gold">
                  <h5 className="font-bold text-liberation-sovereignty-gold mb-2">Technical Safeguards</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Advanced privacy controls and encrypted communications</li>
                    <li>• AI-assisted content warnings for potentially triggering material</li>
                    <li>• Granular blocking and filtering options</li>
                    <li>• Anonymous reporting mechanisms for community concerns</li>
                    <li>• Regular security audits and vulnerability assessments</li>
                  </ul>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Technical Specifications */}
          <CollapsibleSection title="Technical Specifications">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold text-liberation-sovereignty-gold mb-3">Platform Architecture</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li><strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS</li>
                    <li><strong>Backend:</strong> Node.js, Express, PostgreSQL</li>
                    <li><strong>Hosting:</strong> Vercel (Frontend), Railway (Backend)</li>
                    <li><strong>CDN:</strong> Cloudflare with DDoS protection</li>
                    <li><strong>Monitoring:</strong> Real-time performance tracking</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-liberation-sovereignty-gold mb-3">Security & Privacy</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li><strong>Encryption:</strong> TLS 1.3, AES-256 data encryption</li>
                    <li><strong>Authentication:</strong> Multi-factor authentication available</li>
                    <li><strong>Privacy:</strong> No third-party tracking, minimal data collection</li>
                    <li><strong>Compliance:</strong> GDPR, CCPA compliant</li>
                    <li><strong>Auditing:</strong> Regular third-party security assessments</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h5 className="font-bold text-liberation-pride-pink mb-2">Open Source Commitment</h5>
                <p className="text-sm text-gray-300">
                  Our platform architecture is open source to ensure transparency and community oversight.
                  Community members can review, audit, and contribute to the codebase.
                  Repository: <a href="https://github.com/BLKOUTUK/blkout-community-platform" target="_blank" rel="noopener noreferrer" className="text-liberation-sovereignty-gold hover:underline">github.com/BLKOUTUK</a>
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Legal & Organizational Information */}
          <CollapsibleSection title="Legal & Organizational Information">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-liberation-pride-purple mb-4">Organizational Structure</h4>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div>
                      <strong className="text-white">Legal Name:</strong><br />
                      BLKOUT Creative Limited
                    </div>
                    <div>
                      <strong className="text-white">Legal Status:</strong><br />
                      Community Benefit Society (CBS)
                    </div>
                    <div>
                      <strong className="text-white">Registration Number:</strong><br />
                      <a
                        href="https://find-and-update.company-information.service.gov.uk/company/RS009639"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-liberation-sovereignty-gold hover:underline font-semibold"
                      >
                        RS009639
                      </a>
                    </div>
                    <div>
                      <strong className="text-white">Registered With:</strong><br />
                      Financial Conduct Authority (FCA), London
                    </div>
                    <div>
                      <strong className="text-white">Legislation:</strong><br />
                      Co-operative and Community Benefit Societies Act 2014
                    </div>
                    <div>
                      <strong className="text-white">Governance Model:</strong><br />
                      Cooperative ownership with democratic member governance
                    </div>
                    <div>
                      <strong className="text-white">Financial Model:</strong><br />
                      Community benefit society with asset lock. Fair creator compensation at democratically agreed rates.
                      All profits reinvested in community programs, mutual aid, and creative enterprise.
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-liberation-healing-sage mb-4">Contact Information</h4>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-liberation-healing-sage mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Registered Office:</strong><br />
                        London, United Kingdom<br />
                        <span className="text-xs text-gray-400">(full address available on application)</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Mail className="w-4 h-4 text-liberation-healing-sage mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Contact:</strong><br />
                        <a href="mailto:editor@blkoutuk.com" className="text-liberation-sovereignty-gold hover:underline">
                          editor@blkoutuk.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-liberation-healing-sage mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Public Register:</strong><br />
                        <a
                          href="https://find-and-update.company-information.service.gov.uk/company/RS009639"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-liberation-sovereignty-gold hover:underline text-xs"
                        >
                          View on Companies House
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h5 className="font-bold text-liberation-sovereignty-gold mb-2">Community Benefit Society (CBS) Benefits</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Democratic member control - one member, one vote regardless of investment</li>
                  <li>• Asset lock - community assets cannot be extracted by private interests</li>
                  <li>• Community purpose priority over profit maximization</li>
                  <li>• Tax advantages for community benefit activities</li>
                  <li>• FCA regulatory oversight ensuring community benefit compliance</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>

          {/* Community Guidelines & Policies */}
          <CollapsibleSection title="Community Guidelines & Policies">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-liberation-pride-pink">
                  <h5 className="font-bold text-liberation-pride-pink mb-2">Liberation-Centered Values</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Center Black queer joy and liberation in all interactions</li>
                    <li>• Challenge oppressive systems, not individuals experiencing oppression</li>
                    <li>• Practice accountability and restorative justice</li>
                    <li>• Honor the labor and wisdom of Black queer ancestors and elders</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-liberation-healing-sage">
                  <h5 className="font-bold text-liberation-healing-sage mb-2">Prohibited Behaviors</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Racism, transphobia, homophobia, or other forms of oppression</li>
                    <li>• Harassment, doxxing, or threats of violence</li>
                    <li>• Content that promotes self-harm or exploitation</li>
                    <li>• Corporate extraction or exploitative business practices</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-liberation-sovereignty-gold">
                  <h5 className="font-bold text-liberation-sovereignty-gold mb-2">Accountability Process</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Community reporting and peer mediation first</li>
                    <li>• Restorative justice circles for community harm</li>
                    <li>• Escalation to trained community moderators when needed</li>
                    <li>• Removal only as last resort after community process</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-300">
                  <strong className="text-liberation-sovereignty-gold">Full Community Guidelines:</strong>
                  <a href="https://blkouthub.com/invitation?code=BE862C" target="_blank" rel="noopener noreferrer" className="text-liberation-sovereignty-gold hover:underline ml-1">
                    Join BLKOUTHUB to access community guidelines
                  </a>
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Transparency & Accountability */}
          <CollapsibleSection title="Transparency & Accountability">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-bold text-liberation-pride-purple mb-2">Financial Transparency</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Monthly financial reports published to community</li>
                    <li>• Transparent creator compensation tracking</li>
                    <li>• Annual community audit and budget approval</li>
                    <li>• Open-book accounting with member access</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h5 className="font-bold text-liberation-healing-sage mb-2">Decision-Making Transparency</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• All community votes and results publicly visible</li>
                    <li>• Community meeting minutes published</li>
                    <li>• Platform changes proposed and voted on by members</li>
                    <li>• Conflict resolution outcomes shared (with privacy protection)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h5 className="font-bold text-liberation-sovereignty-gold mb-2">Community Oversight Mechanisms</h5>
                <p className="text-sm text-gray-300 mb-2">
                  The community maintains oversight through multiple channels:
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Elected community council with rotating membership</li>
                  <li>• Anonymous feedback systems for platform concerns</li>
                  <li>• Regular community assemblies for major decisions</li>
                  <li>• External mediation available for unresolved conflicts</li>
                  <li>• Annual third-party audits of community benefit compliance</li>
                </ul>
              </div>

              {/* Best Practice Hub link */}
              <button
                onClick={() => onNavigate?.('compliance')}
                className="w-full bg-liberation-black-power p-6 rounded-xl border border-[#d4af37]/30 hover:border-[#d4af37]/60 transition-all group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#d4af37]/10">
                      <Shield className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-lg group-hover:text-[#d4af37] transition-colors">Governance & Best Practice Hub</h5>
                      <p className="text-sm text-gray-400 mt-1">
                        See how we benchmark against ICA Cooperative Principles, Co-operatives UK Governance Code, WCAG, and more.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#d4af37] transition-colors flex-shrink-0" />
                </div>
              </button>
            </div>
          </CollapsibleSection>

          {/* Brand Guidelines & Media Kit */}
          <CollapsibleSection title="Brand Guidelines & Media Kit">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-liberation-sovereignty-gold mb-3">For Partners & Media</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Creating content about BLKOUT? Our brand guidelines ensure authentic, consistent representation
                  of The Black Queer Men's Liberation Collective across all platforms and materials.
                </p>
              </div>

              {/* About the Editor */}
              <div className="bg-liberation-black-power p-6 rounded-xl border-2 border-liberation-sovereignty-gold">
                <h5 className="font-bold text-liberation-sovereignty-gold mb-4 text-xl">About the Editor</h5>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src="/Branding and logos/Robwebsite.png"
                      alt="Dr Rob Berkeley - Site Editor & Creator"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-lg border-2 border-liberation-sovereignty-gold"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-3">
                      <h6 className="text-xl font-bold text-white mb-1">Dr Rob Berkeley</h6>
                      <p className="text-liberation-pride-pink font-semibold">Site Editor & Creator</p>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-3 text-sm">
                      Award-winning busybody and recovering academic, Dr Rob Berkeley leads the development of BLKOUT Media.
                      He was director of the racial justice think-tank, Runnymede Trust (2009-14), before a stint advising
                      the BBC on audience accountability. He serves on the boards of Stanley Arts (SE25), the Black Boy Joy
                      Club CIC, and is a Chair of Doc Society, and the Black Researcher Consortium. Rob was awarded an MBE
                      in 2015 for services to equality.
                    </p>
                    <p className="text-xs text-gray-400 italic">
                      <strong className="text-white">Transparency commitment:</strong> You have a right to know who makes decisions
                      that affect your community experience. Questions and feedback welcomed at{' '}
                      <a href="mailto:editor@blkoutuk.com" className="text-liberation-sovereignty-gold hover:underline">editor@blkoutuk.com</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Logo */}
              <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-liberation-sovereignty-gold">
                <h5 className="font-bold text-liberation-sovereignty-gold mb-4">Download Official Logo</h5>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 h-20 bg-black rounded-lg border-2 border-gray-700 p-2 flex items-center justify-center">
                    <img
                      src="/brand/BLKOUT_Logo_1024px.png"
                      alt="BLKOUT Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong className="text-white">BLKOUT Logo:</strong> Circular badge design with "BLK OUT" text
                    </p>
                    <a
                      href="/brand/BLKOUT_Logo_1024px.png"
                      download
                      className="inline-flex items-center gap-2 text-liberation-sovereignty-gold hover:underline text-sm font-semibold"
                    >
                      ⬇️ Download Logo (PNG, 1024x1024)
                    </a>
                  </div>
                </div>
              </div>

              {/* 3 Required Elements */}
              <div className="bg-liberation-black-power p-6 rounded-xl border-2 border-liberation-pride-pink">
                <h5 className="font-bold text-white mb-4 text-xl">🎯 3 Required Elements on EVERY Asset</h5>
                <p className="text-gray-300 mb-4">Every BLKOUT-branded design must include:</p>

                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h6 className="font-bold text-liberation-sovereignty-gold mb-2">1. Logo (Top-Left or Top-Center)</h6>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Minimum size: 80px</li>
                      <li>• Recommended: 120-150px</li>
                      <li>• Clear space: 20px around logo</li>
                      <li>• Color: White logo on dark backgrounds</li>
                    </ul>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg">
                    <h6 className="font-bold text-liberation-sovereignty-gold mb-2">2. Byline (Bottom of Design)</h6>
                    <p className="text-white font-mono bg-black/50 p-2 rounded text-sm mb-2">
                      The Black Queer Men's Liberation Collective
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Font: Inter, 14-16px</li>
                      <li>• Color: White (#FFFFFF)</li>
                      <li>• Position: Centered, 30-40px from bottom</li>
                    </ul>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg">
                    <h6 className="font-bold text-liberation-sovereignty-gold mb-2">3. Website (Below Byline)</h6>
                    <p className="text-liberation-sovereignty-gold font-mono bg-black/50 p-2 rounded text-sm mb-2 font-semibold">
                      blkoutuk.com
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Font: Inter, 14-16px</li>
                      <li>• Color: <span className="text-liberation-sovereignty-gold font-bold">Liberation Gold (#FFD700)</span> — CRITICAL!</li>
                      <li>• Position: Centered, directly below byline</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="bg-gray-800 p-6 rounded-xl">
                <h5 className="font-bold text-liberation-sovereignty-gold mb-4">🎨 Brand Color Palette</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <div className="h-16 rounded-lg mb-2" style={{ background: '#000000', border: '2px solid #404040' }}></div>
                    <p className="text-xs font-bold text-white">Black</p>
                    <p className="text-xs text-gray-400 font-mono">#000000</p>
                    <p className="text-xs text-gray-500">Backgrounds</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <div className="h-16 rounded-lg mb-2" style={{ background: '#FFFFFF' }}></div>
                    <p className="text-xs font-bold text-white">White</p>
                    <p className="text-xs text-gray-400 font-mono">#FFFFFF</p>
                    <p className="text-xs text-gray-500">Text</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <div className="h-16 rounded-lg mb-2" style={{ background: '#a855f7' }}></div>
                    <p className="text-xs font-bold text-white">Purple</p>
                    <p className="text-xs text-gray-400 font-mono">#a855f7</p>
                    <p className="text-xs text-gray-500">Brand primary</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <div className="h-16 rounded-lg mb-2" style={{ background: '#FFD700' }}></div>
                    <p className="text-xs font-bold text-white">Liberation Gold</p>
                    <p className="text-xs text-gray-400 font-mono">#FFD700</p>
                    <p className="text-xs text-gray-500">Website URL!</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <div className="h-16 rounded-lg mb-2" style={{ background: '#FFB3DA' }}></div>
                    <p className="text-xs font-bold text-white">Pride Pink</p>
                    <p className="text-xs text-gray-400 font-mono">#FFB3DA</p>
                    <p className="text-xs text-gray-500">Joy</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <div className="h-16 rounded-lg mb-2" style={{ background: '#4DA6FF' }}></div>
                    <p className="text-xs font-bold text-white">Pride Blue</p>
                    <p className="text-xs text-gray-400 font-mono">#4DA6FF</p>
                    <p className="text-xs text-gray-500">Community</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400">
                    <strong className="text-white">Pan-African Accents (optional):</strong> Red #E31E24, Green #00A86B
                  </p>
                </div>
              </div>

              {/* Typography */}
              <div className="bg-gray-800 p-6 rounded-xl">
                <h5 className="font-bold text-liberation-sovereignty-gold mb-4">📝 Typography</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-white font-semibold">Headings</span>
                    <span className="text-gray-400 text-sm">Space Grotesk, Bold (600-700)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-white font-semibold">Body Text</span>
                    <span className="text-gray-400 text-sm">Inter, Regular (400)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-liberation-sovereignty-gold font-semibold">Website URL</span>
                    <span className="text-gray-400 text-sm">Inter, Regular, Gold #FFD700</span>
                  </div>
                </div>
              </div>

              {/* DO's and DON'Ts */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-liberation-black-power p-6 rounded-xl border-2 border-liberation-success">
                  <h5 className="font-bold text-liberation-success mb-3">✅ DO (Maintains Brand Integrity)</h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>✅ Black backgrounds (#000000)</li>
                    <li>✅ Logo in top-left/center (small)</li>
                    <li>✅ Footer with byline + website</li>
                    <li>✅ Website in gold (#FFD700)</li>
                    <li>✅ Sharp edges by default (One Platform Design, locked 26 Apr 2026)</li>
                    <li>✅ Heavy gold borders (4-8px) on hero CTAs</li>
                    <li>✅ High contrast white/black</li>
                    <li>✅ Joyful, celebratory mood</li>
                    <li>✅ Pride color accents</li>
                    <li>✅ Generous spacing</li>
                  </ul>
                </div>

                <div className="bg-liberation-black-power p-6 rounded-xl border-2 border-liberation-error">
                  <h5 className="font-bold text-liberation-error mb-3">❌ DON'T (Breaks Brand)</h5>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>❌ White/light backgrounds</li>
                    <li>❌ Centered/huge logo</li>
                    <li>❌ Missing footer elements</li>
                    <li>❌ White website URL (must be gold!)</li>
                    <li>❌ Soft/rounded body cards (legacy pre-26 Apr pattern)</li>
                    <li>❌ Decorative gradient washes</li>
                    <li>❌ Low contrast text</li>
                    <li>❌ Stretch/distort logo</li>
                    <li>❌ Change logo colors</li>
                    <li>❌ Corporate/sterile aesthetics</li>
                  </ul>
                </div>
              </div>

              {/* Size Recommendations */}
              <div className="bg-gray-800 p-6 rounded-xl">
                <h5 className="font-bold text-liberation-sovereignty-gold mb-4">📱 Size Recommendations by Platform</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                    <span className="text-white font-semibold text-sm">Instagram Post</span>
                    <span className="text-gray-400 text-sm">1080x1080px • Logo: 120-150px</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                    <span className="text-white font-semibold text-sm">Instagram Story</span>
                    <span className="text-gray-400 text-sm">1080x1920px • Logo: 100-120px</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                    <span className="text-white font-semibold text-sm">LinkedIn Post</span>
                    <span className="text-gray-400 text-sm">1200x627px • Logo: 120-150px</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                    <span className="text-white font-semibold text-sm">Print Flyer</span>
                    <span className="text-gray-400 text-sm">300 DPI • Logo: 1 inch minimum</span>
                  </div>
                </div>
              </div>

              {/* Pre-Flight Checklist */}
              <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 p-6 rounded-xl border-2 border-liberation-sovereignty-gold">
                <h5 className="font-bold text-liberation-sovereignty-gold mb-4 text-xl">🎯 Pre-Flight Checklist</h5>
                <p className="text-gray-300 mb-4 text-sm">Before finalizing any BLKOUT-branded design, verify:</p>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">Logo present in top-left or top-center?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">Logo is 80px minimum?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">Logo has 20px clear space?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">Background is pure black (#000000)?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">Text is white (#FFFFFF)?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">Footer includes byline?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">Website "blkoutuk.com" included?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300"><strong>Website in gold (#FFD700)?</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">Rounded corners (12px+)?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">Design feels joyful and celebratory?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-liberation-sovereignty-gold font-bold">☐</span>
                    <span className="text-sm text-gray-300">High contrast throughout?</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-liberation-pride-purple">
                <h5 className="font-bold text-liberation-pride-purple mb-2">Need Custom Assets or Have Questions?</h5>
                <p className="text-sm text-gray-300">
                  For custom design requests, partnership inquiries, or questions about brand usage,
                  email <a href="mailto:editor@blkoutuk.com" className="text-liberation-sovereignty-gold hover:underline font-semibold">editor@blkoutuk.com</a>
                </p>
              </div>
            </div>
          </CollapsibleSection>

        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-liberation-pride-pink to-liberation-pride-purple rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-black mb-4">QUESTIONS ABOUT OUR PRACTICES?</h3>
          <p className="mb-6">
            Transparency is fundamental to liberation. If you have questions about any of our practices,
            policies, or technical implementations, we're committed to providing clear answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@blkoutuk.com?subject=Question about BLKOUT practices" className="bg-liberation-gold-divine text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors">
              Contact Community Council
            </a>
            <a href="/governance" className="border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
              Join Community Assembly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}