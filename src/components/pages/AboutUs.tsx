// BLKOUT Liberation Platform - About Us Page
// Comprehensive transparency, policies, and technical information

import React, { useState } from 'react';
import { Shield, Heart, Users, FileText, MapPin, Phone, Mail, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import VideoHero from '@/components/ui/VideoHero';

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

export default function AboutUs() {
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
                  Repository: <a href="https://github.com/BLKOUTUK/blkout-liberation-frontend" target="_blank" rel="noopener noreferrer" className="text-liberation-sovereignty-gold hover:underline">github.com/BLKOUTUK</a>
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
                      <strong className="text-white">Legal Status:</strong><br />
                      Community Benefit Society (CBS)<br />
                      Registration Number: [To be registered]
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
                        [To be determined upon CBS registration]<br />
                        United Kingdom
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-liberation-healing-sage" />
                      <div>
                        <strong className="text-white">Contact:</strong><br />
                        info@blkoutcollective.org
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
                  <li>• Regulatory oversight ensuring community benefit compliance</li>
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
            <button className="bg-white text-liberation-pride-purple px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Contact Community Council
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
              Join Community Assembly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}