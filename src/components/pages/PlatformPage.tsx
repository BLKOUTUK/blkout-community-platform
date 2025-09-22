import React from 'react';
import { Heart, Brain, Vote, Users, Info, Play } from 'lucide-react';
import VideoHero from '@/components/ui/VideoHero';

interface PlatformPageProps {
  onNavigate: (tab: string) => void;
}

const PlatformPage: React.FC<PlatformPageProps> = ({ onNavigate }) => {
  const navigationLinks = [
    {
      id: 'liberation',
      label: 'LIBERATION',
      icon: Heart,
      description: 'Community-owned platform for Black queer liberation',
      color: 'bg-liberation-red-liberation'
    },
    {
      id: 'intro',
      label: 'IVOR',
      icon: Brain,
      description: 'Meet your AI liberation assistant',
      color: 'bg-liberation-purple-spirit'
    },
    {
      id: 'governance',
      label: 'GOVERNANCE',
      icon: Vote,
      description: 'Democratic community decision-making',
      color: 'bg-liberation-green-africa'
    },
    {
      id: 'community',
      label: 'COMMUNITY',
      icon: Users,
      description: 'Connect with liberation organizers',
      color: 'bg-liberation-sovereignty-gold'
    },
    {
      id: 'news',
      label: 'NEWSROOM',
      icon: Play,
      description: 'Stories, events, and community updates',
      color: 'bg-liberation-pride-pink'
    },
    {
      id: 'about',
      label: 'ABOUT',
      icon: Info,
      description: 'Our mission, values, and vision',
      color: 'bg-liberation-healing-sage'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section with Video */}
      <VideoHero
        title="PLATFORM"
        description="Welcome to your liberation technology"
        videos={[
          '/videos/hero/PLATFORM HERO 1.mp4',
          '/videos/hero/PLATFORM HERO 2.mp4',
          '/videos/hero/PLATFORM HERO 3.mp4'
        ]}
        height="md"
        textColor="light"
        overlayOpacity={0.7}
        className="mb-12"
      />

      {/* Welcome Statement */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase" style={{
          textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
          WebkitTextStroke: '1px #000'
        }}>
          WELCOME HOME
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          This is your space. A platform built by and for Black queer communities.
          Where your voice matters. Where your story is valued. Where liberation
          is more than a dream—it's what we're building together, every day.
        </p>

        <div className="bg-liberation-sovereignty-gold/10 border border-liberation-sovereignty-gold/20 rounded-2xl p-8 mb-12">
          <p className="text-lg text-liberation-sovereignty-gold font-semibold">
            "We are the ones we've been waiting for."
          </p>
        </div>
      </section>

      {/* Navigation Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`${link.color} text-white p-8 rounded-2xl hover:scale-105 transition-all duration-300 text-left group`}
            >
              <div className="flex items-start justify-between mb-4">
                <link.icon className="h-10 w-10" />
                <span className="text-xs opacity-75 group-hover:opacity-100 transition-opacity">
                  EXPLORE →
                </span>
              </div>

              <h3 className="text-2xl font-black mb-3 uppercase" style={{
                textShadow: '1px 1px 0px rgba(0,0,0,0.5)'
              }}>
                {link.label}
              </h3>

              <p className="text-sm opacity-90 leading-relaxed">
                {link.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Community Values */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-liberation-black-power rounded-2xl p-8 border border-liberation-sovereignty-gold/20 text-center">
          <h2 className="text-2xl font-bold text-liberation-sovereignty-gold mb-6">
            OUR LIBERATION VALUES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="text-liberation-silver">
              <div className="text-2xl mb-2">✊🏾</div>
              <div>Fair Creator Compensation</div>
            </div>
            <div className="text-liberation-silver">
              <div className="text-2xl mb-2">🗳️</div>
              <div>Democratic Governance</div>
            </div>
            <div className="text-liberation-silver">
              <div className="text-2xl mb-2">💜</div>
              <div>Trauma-Informed Design</div>
            </div>
            <div className="text-liberation-silver">
              <div className="text-2xl mb-2">💰</div>
              <div>Economic Justice</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlatformPage;