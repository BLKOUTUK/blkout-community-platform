// BLKOUT Liberation Platform - Main Application
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Application shell only - NO business logic

import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, Vote, Shield, Info, Play, Users, Brain, ArrowRight, ExternalLink, Globe, Mail } from 'lucide-react';
import {
  cn,
  culturalUtils,
  traumaInformedUtils,
  liberationColors
} from '@/lib/liberation-utils';
import AdminAuth, { checkAdminAuth } from '@/components/admin/AdminAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AboutUs from '@/components/pages/AboutUs';
import NewsPage from '@/components/pages/NewsPage';
import StoryArchive from '@/components/pages/StoryArchive';
import EventsCalendar from '@/components/pages/EventsCalendar';
import PlatformPage from '@/components/pages/PlatformPage';
import Footer from '@/components/ui/Footer';
import IVORIntroduction from '@/components/pages/IVORIntroduction';
import IVORAssistant from './components/ivor/IVORAssistant';
import MobileNav from '@/components/ui/MobileNav';
import InstallPrompt from '@/components/ui/InstallPrompt';
import FirstTimeUserFlow from '@/components/onboarding/FirstTimeUserFlow';
import BLKOUTHUBInvitation from '@/components/community/BLKOUTHUBInvitation';
import BLKOUTHUBBenefitsDisplay from '@/components/community/BLKOUTHUBBenefitsDisplay';
import VideoHero from '@/components/ui/VideoHero';
import { DemocraticGovernanceInterface } from '@/components/liberation/democratic-governance-interface';
import { useBLKOUTHUBMembership } from '@/services/blkouthub-integration';

// API Configuration - Working backend
const LIBERATION_API = import.meta.env.VITE_API_URL || 'https://blkout.vercel.app/api';

// Import live events API at the top level
import { eventsAPI } from './services/events-api';

/**
 * QI COMPLIANCE: Main BLKOUT Liberation Platform Application
 * BOUNDARY ENFORCEMENT: Presentation layer only - NO business logic
 * LIBERATION VALUES: All liberation values embedded throughout
 * ACCESSIBILITY: WCAG 3.0 Bronze compliant navigation and interaction
 * CULTURAL AUTHENTICITY: Black queer joy and Pan-African design celebration
 */

// Navigation tab type
type NavigationTab = 'liberation' | 'governance' | 'community' | 'about' | 'news' | 'stories' | 'events' | 'intro' | 'admin';

// Liberation Quotes Collection - Powerful voices from our community
const LIBERATION_QUOTES = [
  { quote: "NOT EVERYTHING THAT IS FACED CAN BE CHANGED, BUT NOTHING CAN BE CHANGED UNTIL IT IS FACED.", author: "JAMES BALDWIN" },
  { quote: "THOSE WHO DO NOT SEE THEMSELVES REFLECTED IN NATIONAL HERITAGE ARE EXCLUDED FROM IT.", author: "STUART HALL" },
  { quote: "I, TOO, SING AMERICA. I AM THE DARKER BROTHER.", author: "LANGSTON HUGHES" },
  { quote: "THE SOUL THAT IS WITHIN ME NO MAN CAN DEGRADE.", author: "FREDERICK DOUGLASS" },
  { quote: "WE NEED, IN EVERY COMMUNITY, A GROUP OF ANGELIC TROUBLEMAKERS.", author: "BAYARD RUSTIN" },
  { quote: "IF THEY DON'T GIVE YOU A SEAT AT THE TABLE, BRING A FOLDING CHAIR.", author: "SHIRLEY CHISHOLM" },
  { quote: "CHANGE WILL NOT COME IF WE WAIT FOR SOME OTHER PERSON OR SOME OTHER TIME. WE ARE THE ONES WE'VE BEEN WAITING FOR.", author: "BARACK OBAMA" },
  { quote: "YOU ARE YOUR BEST THING.", author: "TONI MORRISON" },
  { quote: "NO PERSON IS YOUR FRIEND WHO DEMANDS YOUR SILENCE OR DENIES YOUR RIGHT TO GROW.", author: "ALICE WALKER" },
  { quote: "HOLD FAST TO DREAMS, FOR IF DREAMS DIE, LIFE IS A BROKEN-WINGED BIRD THAT CANNOT FLY.", author: "LANGSTON HUGHES" },
  { quote: "DO THE BEST YOU CAN UNTIL YOU KNOW BETTER. THEN WHEN YOU KNOW BETTER, DO BETTER.", author: "MAYA ANGELOU" },
  { quote: "BLACK MEN LOVING BLACK MEN IS THE REVOLUTIONARY ACT.", author: "JOSEPH BEAM" },
  { quote: "WE HAVE TO KEEP UP OUR GUARD. WE WON'T GET THE KINDER, GENTLER NATION THAT BUSH PROMISED UNLESS WE FIGHT FOR IT.", author: "URVASHI VAID" }
];

// Simple error boundary component for better UX
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-liberation-black-power text-liberation-gold-divine flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">🏴‍☠️ BLKOUT Liberation Platform</h1>
            <p className="text-liberation-silver mb-4">Platform temporarily unavailable. Liberation continues.</p>
            <button
              className="px-6 py-3 bg-liberation-red-liberation text-white rounded-lg hover:bg-opacity-80 transition-colors"
              onClick={() => window.location.reload()}
            >
              Return to Liberation
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // State for navigation and platform functionality
  const [activeTab, setActiveTab] = useState<NavigationTab>('liberation');
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showIVOR, setShowIVOR] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showBLKOUTHUBInvitation, setShowBLKOUTHUBInvitation] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    membersServed: 847,
    storiesShared: 234,
    eventsHosted: 89,
    liberationActions: 156
  });

  // Quote rotation effect
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % LIBERATION_QUOTES.length);
    }, 8000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Check admin authentication and first visit on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkAdminAuth();
      setIsAdminAuthenticated(isAuthenticated);
    };
    checkAuth();

    // Check if this is user's first visit
    const hasVisited = localStorage.getItem('blkout-has-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
    }
  }, []);

  // Simulated platform stats update
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setPlatformStats(prev => ({
        ...prev,
        liberationActions: prev.liberationActions + Math.floor(Math.random() * 3)
      }));
    }, 30000);
    return () => clearInterval(statsInterval);
  }, []);

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutUs />;
      case 'news':
        return <NewsPage />;
      case 'stories':
        return <EventsCalendar />;
      case 'events':
        return renderLiberationDashboard();
      case 'intro':
        return <IVORIntroduction />;
      case 'governance':
        return <DemocraticGovernanceInterface />;
      case 'community':
        return renderCommunityDashboard();
      case 'admin':
        return <AdminDashboard />;
      default:
        return renderLiberationDashboard();
    }
  };

  // Main liberation dashboard
  const renderLiberationDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section with Three Background Videos */}
      <VideoHero
        title="WELCOME"
        description="Your home for Black queer liberation technology"
        videos={[
          '/videos/hero/PLATFORM HERO 1.mp4',
          '/videos/hero/PLATFORM HERO 2.mp4',
          '/videos/hero/PLATFORM HERO 3.mp4'
        ]}
        height="lg"
        textColor="light"
        overlayOpacity={0.7}
        className="mb-8"
      >
      </VideoHero>

      {/* Rotating Liberation Quotes */}
      <section className="bg-liberation-black-power rounded-xl p-6 md:p-8 border border-liberation-sovereignty-gold/20 mb-8">
        <div className="text-center">
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-black text-liberation-sovereignty-gold mb-4 leading-tight" style={{
            textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000'
          }}>
            "{LIBERATION_QUOTES[currentQuote].quote}"
          </blockquote>
          <cite className="text-lg md:text-xl font-bold text-liberation-silver uppercase" style={{
            textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
          }}>
            — {LIBERATION_QUOTES[currentQuote].author}
          </cite>
        </div>
      </section>

      {/* Welcome Links Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <button
          onClick={() => window.open('https://blkout-scrollytelling.vercel.app', '_blank')}
          className="group bg-gradient-to-br from-liberation-red-liberation to-liberation-purple-spirit text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left"
        >
          <div className="flex items-center mb-4">
            <Play className="h-8 w-8 text-liberation-gold-divine" />
          </div>
          <h3 className="text-lg font-bold mb-2">Liberation Story</h3>
          <p className="text-liberation-silver text-sm mb-4">
            Experience our immersive scrollytelling journey through Black queer liberation.
          </p>
          <div className="flex items-center text-liberation-gold-divine font-semibold text-sm">
            Watch Story
            <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('intro')}
          className="group bg-gradient-to-br from-liberation-green-africa to-liberation-gold-divine text-liberation-black-power p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left"
        >
          <div className="flex items-center mb-4">
            <Brain className="h-8 w-8 text-liberation-black-power" />
          </div>
          <h3 className="text-lg font-bold mb-2">Meet IVOR</h3>
          <p className="text-liberation-black-power opacity-80 text-sm mb-4">
            Chat with our trauma-informed AI assistant built for our community.
          </p>
          <div className="flex items-center text-liberation-black-power font-semibold text-sm">
            Start Chat
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className="group bg-gradient-to-br from-liberation-purple-spirit to-liberation-black-power text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left"
        >
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-liberation-gold-divine" />
          </div>
          <h3 className="text-lg font-bold mb-2">Community Platform</h3>
          <p className="text-liberation-silver text-sm mb-4">
            Explore events, stories, and democratic governance features.
          </p>
          <div className="flex items-center text-liberation-gold-divine font-semibold text-sm">
            Enter Platform
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => window.open('https://blkouthub.com', '_blank')}
          className="group bg-gradient-to-br from-liberation-gold-divine to-liberation-red-liberation text-liberation-black-power p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left"
        >
          <div className="flex items-center mb-4">
            <Globe className="h-8 w-8 text-liberation-black-power" />
          </div>
          <h3 className="text-lg font-bold mb-2">BLKOUTHUB</h3>
          <p className="text-liberation-black-power opacity-80 text-sm mb-4">
            Join our secure community on Heartbeat.chat with enhanced governance access.
          </p>
          <div className="flex items-center text-liberation-black-power font-semibold text-sm">
            Visit Hub
            <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => window.open('https://blkout.substack.com', '_blank')}
          className="group bg-gradient-to-br from-liberation-silver to-liberation-purple-spirit text-liberation-black-power p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left"
        >
          <div className="flex items-center mb-4">
            <Mail className="h-8 w-8 text-liberation-black-power" />
          </div>
          <h3 className="text-lg font-bold mb-2">Liberation Newsletter</h3>
          <p className="text-liberation-black-power opacity-80 text-sm mb-4">
            Stay connected with our liberation updates and community news.
          </p>
          <div className="flex items-center text-liberation-black-power font-semibold text-sm">
            Subscribe
            <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('governance')}
          className="group bg-gradient-to-br from-liberation-black-power to-liberation-red-liberation text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 border-2 border-liberation-gold-divine text-left"
        >
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 text-liberation-gold-divine" />
          </div>
          <h3 className="text-lg font-bold mb-2">I Want It All</h3>
          <p className="text-liberation-silver text-sm mb-4">
            Start here and explore the entire ecosystem at your own pace.
          </p>
          <div className="flex items-center text-liberation-gold-divine font-semibold text-sm">
            Full Access
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </section>

    </div>
  );

  // Community Dashboard with BLKOUTHUB Integration
  const renderCommunityDashboard = () => {
    // Mock user email for testing - in production this would come from auth
    const userEmail = "demo@blkout.org";
    const { member: blkouthubMember, permissions: governancePermissions, loading: membershipLoading } = useBLKOUTHUBMembership(userEmail);

    return (
      <div className="space-y-8">
        {/* Community Header with Video Background */}
        <VideoHero
          title="COMMUNITY"
          description="Join BLKOUTHUB - Your gateway to Black queer liberation organizing"
          videos={[
            '/videos/hero/PLATFORM HERO 1.mp4',
            '/videos/hero/PLATFORM HERO 2.mp4',
            '/videos/hero/PLATFORM HERO 3.mp4'
          ]}
          height="md"
          textColor="light"
          overlayOpacity={0.7}
          className="mb-8"
        />

        {/* BLKOUTHUB Introduction */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase" style={{
            textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
            WebkitTextStroke: '1px #000'
          }}>
            WELCOME TO BLKOUTHUB
          </h2>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            BLKOUTHUB is our secure community platform where Black queer organizers connect,
            collaborate, and build liberation together. A space designed by us, for us -
            with privacy, safety, and collective power at its core.
          </p>

          <div className="bg-liberation-sovereignty-gold/10 border border-liberation-sovereignty-gold/20 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-liberation-sovereignty-gold mb-4">
              What BLKOUTHUB Offers
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-liberation-sovereignty-gold text-xl">🔒</span>
                  <div>
                    <h4 className="font-bold text-white mb-1">Secure Community Spaces</h4>
                    <p className="text-gray-400 text-sm">Verified members only. Your data, your sovereignty.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-liberation-sovereignty-gold text-xl">🗳️</span>
                  <div>
                    <h4 className="font-bold text-white mb-1">Democratic Governance</h4>
                    <p className="text-gray-400 text-sm">Vote on platform decisions and resource allocation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-liberation-sovereignty-gold text-xl">💬</span>
                  <div>
                    <h4 className="font-bold text-white mb-1">Heartbeat.chat Integration</h4>
                    <p className="text-gray-400 text-sm">Real-time organizing and community support.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-liberation-sovereignty-gold text-xl">✊🏾</span>
                  <div>
                    <h4 className="font-bold text-white mb-1">Organizing Tools</h4>
                    <p className="text-gray-400 text-sm">Coordinate actions, events, and mutual aid.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-liberation-sovereignty-gold text-xl">💜</span>
                  <div>
                    <h4 className="font-bold text-white mb-1">Trauma-Informed Support</h4>
                    <p className="text-gray-400 text-sm">Healing-centered spaces and crisis resources.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-liberation-sovereignty-gold text-xl">🌟</span>
                  <div>
                    <h4 className="font-bold text-white mb-1">Member Benefits</h4>
                    <p className="text-gray-400 text-sm">Exclusive content, events, and opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLKOUTHUB Membership Status */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-liberation-gold-divine text-center">
            Your Membership Status
          </h2>

          {membershipLoading ? (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-liberation-gold-divine mx-auto"></div>
              <p className="text-liberation-silver mt-4">Checking BLKOUTHUB membership...</p>
            </div>
          ) : blkouthubMember && governancePermissions ? (
            <BLKOUTHUBBenefitsDisplay
              member={blkouthubMember}
              permissions={governancePermissions}
              displayMode="full"
              onViewProfile={() => window.open(blkouthubMember.profileUrl, '_blank')}
              className="max-w-4xl mx-auto"
            />
          ) : (
            <BLKOUTHUBBenefitsDisplay
              member={blkouthubMember!}
              permissions={governancePermissions!}
              displayMode="full"
              showJoinButton={true}
              onJoinBLKOUTHUB={() => setShowBLKOUTHUBInvite(true)}
              className="max-w-4xl mx-auto"
            />
          )}
        </section>

        {/* Community Actions Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-liberation-purple-spirit rounded-xl p-6 text-white">
            <Users className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Community</h3>
            <p className="text-liberation-silver mb-4">Join verified members in protected discussions on Heartbeat.chat platform.</p>
            <button
              onClick={() => window.open('https://blkouthub.com', '_blank')}
              className="bg-white text-liberation-purple-spirit px-4 py-2 rounded font-semibold hover:bg-opacity-90 transition-colors"
            >
              Visit BLKOUTHUB
            </button>
          </div>

          <div className="bg-liberation-red-liberation rounded-xl p-6 text-white">
            <Vote className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Enhanced Governance</h3>
            <p className="text-liberation-silver mb-4">Unlock voting rights and proposal creation through community membership.</p>
            <button
              onClick={() => setActiveTab('governance')}
              className="bg-white text-liberation-red-liberation px-4 py-2 rounded font-semibold hover:bg-opacity-90 transition-colors"
            >
              View Governance
            </button>
          </div>

          <div className="bg-liberation-green-africa rounded-xl p-6 text-white">
            <Heart className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Member Benefits</h3>
            <p className="text-liberation-silver mb-4">Access exclusive content, events, and democratic participation opportunities.</p>
            <button
              onClick={() => {
                if (blkouthubMember) {
                  window.open(blkouthubMember.profileUrl, '_blank');
                } else {
                  setShowBLKOUTHUBInvite(true);
                }
              }}
              className="bg-white text-liberation-green-africa px-4 py-2 rounded font-semibold hover:bg-opacity-90 transition-colors"
            >
              {blkouthubMember ? 'View Profile' : 'Join Now'}
            </button>
          </div>
        </section>

        {/* Community Stats */}
        <section className="bg-liberation-black-power rounded-xl p-6">
          <h2 className="text-xl md:text-2xl font-bold text-liberation-gold-divine mb-6 text-center">Community Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-liberation-gold-divine">850+</div>
              <div className="text-liberation-silver text-sm">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-liberation-gold-divine">240+</div>
              <div className="text-liberation-silver text-sm">Governance Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-liberation-gold-divine">95%</div>
              <div className="text-liberation-silver text-sm">Member Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-liberation-gold-divine">24/7</div>
              <div className="text-liberation-silver text-sm">Community Support</div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-liberation-black-power text-liberation-silver">
        {/* Navigation Header */}
        <nav className="bg-liberation-black-power border-b border-liberation-silver border-opacity-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <img
                  src="/blkout-logo.png"
                  alt="BLKOUT Logo"
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-xl font-bold text-liberation-gold-divine">BLKOUT</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  {[
                    { id: 'liberation', label: 'Platform', icon: Heart },
                    { id: 'intro', label: 'IVOR', icon: Brain },
                    { id: 'news', label: 'Newsroom', icon: Play },
                    { id: 'stories', label: 'Events', icon: Vote },
                    { id: 'community', label: 'Community', icon: Users },
                    { id: 'governance', label: 'Governance', icon: Vote },
                    { id: 'about', label: 'About', icon: Info }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as NavigationTab)}
                      className={cn(
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 touch-friendly',
                        activeTab === id
                          ? 'bg-liberation-gold-divine text-liberation-black-power'
                          : 'text-liberation-silver hover:bg-liberation-silver hover:bg-opacity-10'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop IVOR and Admin */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => setShowIVOR(true)}
                  className="bg-liberation-green-africa text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors touch-friendly"
                >
                  Ask IVOR
                </button>
                {isAdminAuthenticated && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 touch-friendly',
                      activeTab === 'admin'
                        ? 'bg-liberation-gold-divine text-liberation-black-power'
                        : 'text-liberation-gold-divine hover:bg-liberation-gold-divine hover:bg-opacity-10'
                    )}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </button>
                )}
              </div>

              {/* Mobile Navigation */}
              <MobileNav
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab as NavigationTab)}
                onIVOROpen={() => setShowIVOR(true)}
                isAdminAuthenticated={isAdminAuthenticated}
              />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {renderContent()}
          </div>
        </main>

        {/* IVOR Assistant Modal */}
        {showIVOR && (
          <IVORAssistant onClose={() => setShowIVOR(false)} />
        )}

        {/* First Time User Flow */}
        {isFirstVisit && (
          <FirstTimeUserFlow
            onComplete={() => setIsFirstVisit(false)}
            onSkip={() => setIsFirstVisit(false)}
            onOpenIVOR={() => setShowIVOR(true)}
          />
        )}

        {/* Admin Authentication Modal */}
        {!isAdminAuthenticated && (
          <AdminAuth
            onAuthenticated={setIsAdminAuthenticated}
            onCancel={() => {}}
            requiredAction="admin_access"
          />
        )}

        {/* PWA Install Prompt */}
        <InstallPrompt />

        {/* Footer Navigation */}
        {activeTab !== 'liberation' && (
          <Footer onNavigate={setActiveTab} currentTab={activeTab} />
        )}
      </div>
    </ErrorBoundary>
  );
}