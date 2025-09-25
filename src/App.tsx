// BLKOUT Liberation Platform - Main Application
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Application shell only - NO business logic

import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, Vote, Shield, Info, Play, Users, Brain, ArrowRight, ExternalLink, Globe, Mail, Trophy, Camera } from 'lucide-react';
import {
  cn,
  culturalUtils,
  traumaInformedUtils,
  liberationColors
} from '@/lib/liberation-utils';
// import AdminAuth, { checkAdminAuth } from '@/components/admin/AdminAuth';  // REMOVED - NO AUTH
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
// import { DemocraticGovernanceInterface } from '@/components/liberation/democratic-governance-interface';
import { useBLKOUTHUBMembership } from '@/services/blkouthub-integration';
// import { AuthProvider } from '@/hooks/useAuth';  // REMOVED - NO AUTH

// Photo Competition Integration
import { PhotoCompetitionModal } from '@/components/competition/PhotoCompetitionModal';

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
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('BLKOUT Platform Error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('BLKOUT Platform Error Details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);

    // Store error details in window for debugging
    if (typeof window !== 'undefined') {
      (window as any).BLKOUT_ERROR = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      };
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-liberation-black-power text-liberation-gold-divine flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">🏴‍☠️ BLKOUT Liberation Platform</h1>
            <p className="text-liberation-silver mb-4">Loading error occurred. Check console for details.</p>
            <p className="text-xs text-gray-500 mb-4">Error: {this.state.error?.message || this.state.error?.toString() || 'Unknown error'}</p>
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

// Function to get initial tab from URL path
function getInitialTabFromURL(): NavigationTab {
  const path = window.location.pathname.slice(1); // Remove leading slash
  const validTabs: NavigationTab[] = ['liberation', 'governance', 'community', 'about', 'news', 'stories', 'events', 'intro', 'admin'];

  if (validTabs.includes(path as NavigationTab)) {
    return path as NavigationTab;
  }

  return 'liberation'; // Default fallback
}

export default function App() {
  // State for navigation and platform functionality
  const [activeTab, setActiveTab] = useState<NavigationTab>(getInitialTabFromURL());
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true); // Admin always accessible
  const [showIVOR, setShowIVOR] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showBLKOUTHUBInvitation, setShowBLKOUTHUBInvitation] = useState(false);
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [competitionInitialView, setCompetitionInitialView] = useState<'landing' | 'submit' | 'gallery' | 'voting' | 'results'>('landing');
  const [platformStats, setPlatformStats] = useState({
    membersServed: 847,
    storiesShared: 234,
    eventsHosted: 89,
    liberationActions: 156
  });

  // Custom function to change tab and update URL
  const changeActiveTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.history.pushState({}, '', `/${tab === 'liberation' ? '' : tab}`);
  };

  // Quote rotation effect
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % LIBERATION_QUOTES.length);
    }, 8000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTabFromURL());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // NO AUTHENTICATION - Admin is always accessible
  useEffect(() => {
    // Admin is open - no auth needed

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
        return <IVORIntroduction
          onStartChat={() => setShowIVOR(true)}
          onJoinCommunity={() => changeActiveTab('community')}
          onLearnMore={() => changeActiveTab('about')}
        />;
      case 'governance':
        return (
          <div className="min-h-screen bg-white text-black p-8">
            <h1 className="text-3xl font-bold mb-4">Democratic Governance</h1>
            <p>Governance interface temporarily under maintenance.</p>
          </div>
        );
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
      {/* Hero Section with Photo Competition Video */}
      <VideoHero
        title="CAPTURE LIBERATION"
        description="Join our October Photo Competition celebrating Black queer joy and creativity"
        videos={[
          '/videos/hero/Photo Comp Oct25 (Video).mp4',
          '/videos/hero/PLATFORM HERO 1.mp4',
          '/videos/hero/PLATFORM HERO 2.mp4'
        ]}
        height="lg"
        textColor="light"
        overlayOpacity={0.7}
        className="mb-8"
      >
        <button
          onClick={() => {
            setCompetitionInitialView('landing');
            setShowCompetitionModal(true);
          }}
          className="mt-6 px-8 py-4 bg-liberation-pride-purple text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Enter Photo Competition
        </button>
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
          onClick={() => {
            setCompetitionInitialView('landing');
            setShowCompetitionModal(true);
          }}
          className="group bg-gradient-to-br from-liberation-pride-purple to-liberation-pride-pink text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left border-2 border-liberation-gold-divine"
        >
          <div className="flex items-center mb-4">
            <Trophy className="h-8 w-8 text-liberation-gold-divine" />
          </div>
          <h3 className="text-lg font-bold mb-2">Photo Competition</h3>
          <p className="text-liberation-silver text-sm mb-4">
            October 2025: Capture Liberation through your lens. Win prizes & recognition!
          </p>
          <div className="flex items-center text-liberation-gold-divine font-semibold text-sm">
            Enter Now
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => changeActiveTab('intro')}
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
          onClick={() => changeActiveTab('community')}
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
          onClick={() => window.open('https://sendfox.com/blkoutuk', '_blank')}
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
          onClick={() => changeActiveTab('governance')}
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
    const { member, permissions, loading } = useBLKOUTHUBMembership();

    return (
      <div className="space-y-8">
        {/* Platform Page Features */}
        <PlatformPage />

        {/* BLKOUTHUB Integration */}
        {loading ? (
          <div className="text-center text-liberation-silver">
            Loading BLKOUTHUB membership status...
          </div>
        ) : member ? (
          <BLKOUTHUBBenefitsDisplay
            member={member}
            permissions={permissions}
            displayMode="card"
            onViewProfile={() => window.open('https://www.heartbeat.chat/', '_blank')}
          />
        ) : (
          <button
            onClick={() => setShowBLKOUTHUBInvitation(true)}
            className="w-full max-w-md mx-auto bg-gradient-to-r from-liberation-gold-divine to-liberation-red-liberation text-liberation-black-power p-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            🏴‍☠️ Join BLKOUTHUB for Enhanced Governance Access
          </button>
        )}
      </div>
    );
  };

  // Complete first visit flow
  const handleFirstVisitComplete = () => {
    localStorage.setItem('blkout-has-visited', 'true');
    setIsFirstVisit(false);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-liberation-purple-spirit to-liberation-black-power text-white">
          {/* Install Prompt Banner */}
          <InstallPrompt />

          {/* First Time User Flow */}
          {isFirstVisit && (
            <FirstTimeUserFlow onComplete={handleFirstVisitComplete} />
          )}

          {/* Main Navigation */}
          <nav className="sticky top-0 z-40 bg-liberation-black-power border-b-2 border-liberation-gold-divine shadow-2xl">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16 md:h-20">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-4">
                  <img 
                    src="/blkout-logo.png" 
                    alt="BLKOUT" 
                    className="h-10 md:h-12 w-auto cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => changeActiveTab('liberation')}
                  />
                  <div className="hidden sm:block">
                    <div className="text-liberation-gold-divine font-black text-lg md:text-xl">
                      LIBERATION PLATFORM
                    </div>
                    <div className="text-liberation-silver text-xs">
                      Black Queer Liberation Technology
                    </div>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-2">
                  <button
                    onClick={() => changeActiveTab('liberation')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                      activeTab === 'liberation' 
                        ? 'bg-liberation-red-liberation text-white' 
                        : 'text-liberation-silver hover:text-liberation-gold-divine'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => changeActiveTab('community')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                      activeTab === 'community' 
                        ? 'bg-liberation-red-liberation text-white' 
                        : 'text-liberation-silver hover:text-liberation-gold-divine'
                    }`}
                  >
                    Platform
                  </button>
                  <button
                    onClick={() => changeActiveTab('governance')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                      activeTab === 'governance' 
                        ? 'bg-liberation-red-liberation text-white' 
                        : 'text-liberation-silver hover:text-liberation-gold-divine'
                    }`}
                  >
                    Governance
                  </button>
                  <button
                    onClick={() => changeActiveTab('stories')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                      activeTab === 'stories' 
                        ? 'bg-liberation-red-liberation text-white' 
                        : 'text-liberation-silver hover:text-liberation-gold-divine'
                    }`}
                  >
                    Events
                  </button>
                  <button
                    onClick={() => changeActiveTab('news')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                      activeTab === 'news' 
                        ? 'bg-liberation-red-liberation text-white' 
                        : 'text-liberation-silver hover:text-liberation-gold-divine'
                    }`}
                  >
                    News
                  </button>
                  <button
                    onClick={() => changeActiveTab('intro')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                      activeTab === 'intro' 
                        ? 'bg-liberation-red-liberation text-white' 
                        : 'text-liberation-silver hover:text-liberation-gold-divine'
                    }`}
                  >
                    IVOR
                  </button>
                  <button
                    onClick={() => changeActiveTab('about')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                      activeTab === 'about' 
                        ? 'bg-liberation-red-liberation text-white' 
                        : 'text-liberation-silver hover:text-liberation-gold-divine'
                    }`}
                  >
                    About
                  </button>
                </div>

                {/* IVOR and Mobile Menu Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowIVOR(true)}
                    className="p-2 bg-liberation-gold-divine text-liberation-black-power rounded-lg hover:bg-opacity-90 transition-all duration-300"
                  >
                    <Brain className="h-5 w-5 md:h-6 md:w-6" />
                  </button>
                  <MobileNav
                    activeTab={activeTab}
                    setActiveTab={changeActiveTab}
                    isAdminAuthenticated={isAdminAuthenticated}
                  />
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="container mx-auto px-4 py-8">
            {renderContent()}
          </main>

          {/* Footer */}
          <Footer />

          {/* IVOR Assistant Overlay */}
          {showIVOR && (
            <IVORAssistant onClose={() => setShowIVOR(false)} />
          )}

          {/* BLKOUTHUB Invitation Modal */}
          {showBLKOUTHUBInvitation && (
            <BLKOUTHUBInvitation
              onClose={() => setShowBLKOUTHUBInvitation(false)}
              onJoinSuccess={() => {
                setShowBLKOUTHUBInvitation(false);
                window.open('https://www.heartbeat.chat/', '_blank');
              }}
            />
          )}

          {/* Photo Competition Modal */}
          <PhotoCompetitionModal
            isOpen={showCompetitionModal}
            onClose={() => setShowCompetitionModal(false)}
            initialView={competitionInitialView}
            competitionId="oct-2025"
          />
      </div>
    </ErrorBoundary>
  );
}
