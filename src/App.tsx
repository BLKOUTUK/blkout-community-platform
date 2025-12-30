// BLKOUT Liberation Platform - Main Application
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Application shell only - NO business logic

import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, Vote, Shield, Info, Play, Users, Brain, ArrowRight, ExternalLink, Globe, Mail, Calendar, PenTool } from 'lucide-react';
import {
  cn,
  culturalUtils,
  traumaInformedUtils,
  liberationColors
} from '@/lib/liberation-utils';
// import AdminAuth, { checkAdminAuth } from '@/components/admin/AdminAuth';  // REMOVED - NO AUTH
import AdminDashboard from '@/components/admin/AdminDashboard';
import AboutUs from '@/components/pages/AboutUs';
import StoryArchive from '@/components/pages/StoryArchive';
import ArticleDetail from '@/components/pages/ArticleDetail';
import DiscoverPage from '@/components/pages/DiscoverPage.enhanced';
import Footer from '@/components/ui/Footer';
import IVORIntroduction from '@/components/pages/IVORIntroduction';
import IVORAssistant from './components/ivor/IVORAssistant';
import GovernancePage from '@/components/pages/GovernancePage';
import TermsOfService from '@/components/pages/TermsOfService';
import PrivacyPolicy from '@/components/pages/PrivacyPolicy';
import HealthDashboard from '@/components/pages/HealthDashboard';
import MobileNav from '@/components/ui/MobileNav';
import InstallPrompt from '@/components/ui/InstallPrompt';
import FirstTimeUserFlow from '@/components/onboarding/FirstTimeUserFlow';
import VideoHero from '@/components/ui/VideoHero';
import TheoryOfChangeMasonry from '@/components/movement/TheoryOfChangeMasonry';


// API Configuration - Working backend
const LIBERATION_API = import.meta.env.VITE_API_URL || '/api';

/**
 * QI COMPLIANCE: Main BLKOUT Liberation Platform Application
 * BOUNDARY ENFORCEMENT: Presentation layer only - NO business logic
 * LIBERATION VALUES: All liberation values embedded throughout
 * ACCESSIBILITY: WCAG 3.0 Bronze compliant navigation and interaction
 * CULTURAL AUTHENTICITY: Black queer joy and Pan-African design celebration
 */

// Navigation tab type
type NavigationTab = 'liberation' | 'governance' | 'about' | 'stories' | 'intro' | 'admin' | 'platform' | 'terms' | 'privacy' | 'health-dashboard' | 'movement';

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
  const validTabs: NavigationTab[] = ['liberation', 'governance', 'about', 'stories', 'intro', 'admin', 'platform', 'terms', 'privacy', 'health-dashboard', 'movement'];

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
      case 'stories':
        return <StoryArchive />;
      case 'intro':
        return <IVORIntroduction
          onStartChat={() => setShowIVOR(true)}
          onJoinCommunity={() => changeActiveTab('platform')}
          onLearnMore={() => changeActiveTab('about')}
        />;
      case 'governance':
        return <GovernancePage />;
      case 'terms':
        return <TermsOfService />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'platform':
        return <DiscoverPage onNavigate={changeActiveTab} />;
      case 'admin':
        return <AdminDashboard />;
      case 'health-dashboard':
        return <HealthDashboard />;
      case 'movement':
        return <TheoryOfChangeMasonry />;
      default:
        return renderLiberationDashboard();
    }
  };

  // Main liberation dashboard
  const renderLiberationDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <VideoHero
        title="BLKOUTUK.COM"
        subtitle="The digital home for Black Queer Men, by Black Queer Men."
        description="Where Realness Lives"
        videos={[
          '/videos/hero/PLATFORM HERO 1.mp4',
          '/videos/hero/PLATFORM HERO 2.mp4',
          '/videos/hero/PLATFORM HERO 3.mp4'
        ]}
        height="lg"
        textColor="light"
        overlayOpacity={0.7}
        className="mb-8"
        logoSrc="/Branding and logos/blkoutlogo_wht_transparent.png"
      />

      {/* Rotating Liberation Quotes */}
      <section className="bg-liberation-black-power rounded-xl p-6 md:p-8 border border-liberation-sovereignty-gold/20 mb-8 shadow-xl">
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
          onClick={() => changeActiveTab('stories')}
          className="group bg-gradient-to-br from-liberation-red-liberation/90 to-liberation-purple-spirit text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
        >
          <div className="flex justify-center mb-4">
            <img
              src="/Branding and logos/blkoutlogo_wht_transparent.png"
              alt="BLKOUT"
              className="h-12 w-auto"
            />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-wide text-center" style={{
            WebkitTextStroke: '2px #fff',
            color: 'transparent'
          }}>ARCHIVE</h3>
          <p className="text-white text-sm mb-4 leading-relaxed text-center">
            Know your history<br/>270+ BLKOUT articles 2016-2024
          </p>
        </button>

        <a
          href="https://events.blkoutuk.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gradient-to-br from-liberation-pride-purple/90 to-liberation-pride-pink text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
        >
          <div className="flex justify-center mb-4">
            <img
              src="/Branding and logos/blkoutlogo_wht_transparent.png"
              alt="BLKOUT"
              className="h-12 w-auto"
            />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-wide text-center" style={{
            WebkitTextStroke: '2px #fff',
            color: 'transparent'
          }}>WHAT'S ON</h3>
          <p className="text-white text-sm mb-4 leading-relaxed text-center">
            parties - culture - workshops<br/>Where the Black Queer Magic happens
          </p>
        </a>

        <button
          onClick={() => changeActiveTab('intro')}
          className="group bg-gradient-to-br from-liberation-green-africa/90 to-liberation-gold-divine text-liberation-black-power p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
        >
          <div className="flex justify-center mb-4">
            <img
              src="/Branding and logos/blkoutlogo_wht_transparent.png"
              alt="BLKOUT"
              className="h-12 w-auto"
            />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-wide text-center" style={{
            WebkitTextStroke: '2px #000',
            color: 'transparent'
          }}>ASK IVOR</h3>
          <p className="text-liberation-black-power text-sm mb-4 leading-relaxed text-center">
            Our AI Community Liberation Assistant
          </p>
        </button>

        <button
          onClick={() => changeActiveTab('platform')}
          className="group bg-gradient-to-br from-liberation-purple-spirit/90 to-liberation-black-power text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
        >
          <div className="flex justify-center mb-4">
            <img
              src="/Branding and logos/blkoutlogo_wht_transparent.png"
              alt="BLKOUT"
              className="h-12 w-auto"
            />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-wide text-center" style={{
            WebkitTextStroke: '2px #fff',
            color: 'transparent'
          }}>DISCOVER</h3>
          <p className="text-white text-sm mb-4 leading-relaxed text-center">
            New features, community highlights, and ways to connect.<br/>Your guide to everything BLKOUT.
          </p>
        </button>

        <a
          href="https://news.blkoutuk.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gradient-to-br from-liberation-gold-divine/90 to-liberation-red-liberation text-liberation-black-power p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
        >
          <div className="flex justify-center mb-4">
            <img
              src="/Branding and logos/blkoutlogo_wht_transparent.png"
              alt="BLKOUT"
              className="h-12 w-auto"
            />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-wide text-center" style={{
            WebkitTextStroke: '2px #000',
            color: 'transparent'
          }}>NEWS THAT MATTERS</h3>
          <p className="text-liberation-black-power text-sm mb-4 leading-relaxed text-center">
            News reports and analysis through a Black Queer lens<br/>Set the tone, shape the agenda
          </p>
        </a>

        <button
          onClick={() => changeActiveTab('about')}
          className="group bg-gradient-to-br from-liberation-silver/90 to-liberation-purple-spirit text-liberation-black-power p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
        >
          <div className="flex justify-center mb-4">
            <img
              src="/Branding and logos/blkoutlogo_wht_transparent.png"
              alt="BLKOUT"
              className="h-12 w-auto"
            />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-wide text-center" style={{
            WebkitTextStroke: '2px #000',
            color: 'transparent'
          }}>ABOUT</h3>
          <p className="text-liberation-black-power text-sm mb-4 leading-relaxed text-center">
            For and By Black Queer Men<br/>"Without community, there is no liberation"
          </p>
        </button>

        <a
          href="https://voices.blkoutuk.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gradient-to-br from-liberation-pride-purple/90 via-liberation-gold-divine/90 to-liberation-red-liberation text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
        >
          <div className="flex justify-center mb-4">
            <img
              src="/Branding and logos/blkoutlogo_wht_transparent.png"
              alt="BLKOUT"
              className="h-12 w-auto"
            />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-wide text-center" style={{
            WebkitTextStroke: '2px #fff',
            color: 'transparent'
          }}>BLKOUT VOICES</h3>
          <p className="text-white text-sm mb-4 leading-relaxed text-center">
            Liberation narratives, views, perspectives and new writing from our community
          </p>
        </a>

        <button
          onClick={() => changeActiveTab('governance')}
          className="group bg-gradient-to-br from-liberation-black-power/90 to-liberation-red-liberation text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
        >
          <div className="flex justify-center mb-4">
            <img
              src="/Branding and logos/blkoutlogo_wht_transparent.png"
              alt="BLKOUT"
              className="h-12 w-auto"
            />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-wide text-center" style={{
            WebkitTextStroke: '2px #fff',
            color: 'transparent'
          }}>OWNERS' MANUAL</h3>
          <p className="text-white text-sm mb-4 leading-relaxed text-center">
            Every voice matters. Our members shape our future.<br/>This is how we build liberation - stronger together.
          </p>
        </button>
      </section>

      {/* Advent Calendar Widget */}
      <section className="bg-gradient-to-br from-liberation-red-liberation to-liberation-green-africa text-white p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 mb-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Calendar className="w-16 h-16 text-liberation-gold-divine" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">BLKOUT Advent Calendar 2025</h2>
          <p className="text-xl mb-6 opacity-90">
            24 days of Black queer joy, community, and celebration
          </p>
          <div className="relative rounded-xl overflow-hidden mb-6 max-w-5xl mx-auto" style={{ aspectRatio: '16/9' }}>
            <iframe
              src="https://www.flexclip.com/embed/12797929e05ada2d26d26d1916680d12093ac71.html"
              className="w-full h-full"
              style={{ border: 'none' }}
              allowFullScreen
              allow="autoplay; encrypted-media"
              title="BLKOUT Advent Calendar 2025"
            />
          </div>
          <p className="text-sm mt-4 opacity-75">
            Unwrap something special every day this December
          </p>
        </div>
      </section>

    </div>
  );


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
          <nav className="sticky top-0 z-40 bg-liberation-black-power border-b border-liberation-gold-divine/30 shadow-lg backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16 md:h-18">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-3">
                  <img
                    src="/blkout-logo.png"
                    alt="BLKOUT"
                    className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
                    onClick={() => changeActiveTab('liberation')}
                  />
                  <div className="hidden md:block border-l border-liberation-gold-divine/30 pl-3">
                    <div className="text-liberation-gold-divine font-bold text-sm tracking-wider">
                      BLKOUT
                    </div>
                    <div className="text-liberation-silver/70 text-xs">
                      Liberation Platform
                    </div>
                  </div>
                </div>

                {/* Desktop Navigation - Organized Groups */}
                <div className="hidden lg:flex items-center gap-1">
                  {/* Platform Navigation */}
                  <div className="flex items-center gap-1 px-2 border-r border-liberation-gold-divine/20">
                    <button
                      onClick={() => changeActiveTab('liberation')}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'liberation'
                          ? 'bg-liberation-gold-divine/20 text-liberation-gold-divine'
                          : 'text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5'
                      }`}
                    >
                      Home
                    </button>
                    <a
                      href="https://blkoutuk.com/discover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5 flex items-center gap-1.5"
                    >
                      Discover
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                    <button
                      onClick={() => changeActiveTab('stories')}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'stories'
                          ? 'bg-liberation-gold-divine/20 text-liberation-gold-divine'
                          : 'text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5'
                      }`}
                    >
                      Archive
                    </button>
                  </div>

                  {/* Content Hubs */}
                  <div className="flex items-center gap-1 px-2 border-r border-liberation-gold-divine/20">
                    <a
                      href="https://events.blkoutuk.cloud"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5 flex items-center gap-1.5"
                    >
                      Events
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                    <a
                      href="https://news.blkoutuk.cloud"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5 flex items-center gap-1.5"
                    >
                      News
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                    <a
                      href="https://voices.blkoutuk.cloud"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md text-sm font-bold transition-all duration-200 bg-liberation-gold-divine/10 text-liberation-gold-divine hover:bg-liberation-gold-divine/20 flex items-center gap-1.5 border border-liberation-gold-divine/30"
                    >
                      Voices
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Info & Tools */}
                  <div className="flex items-center gap-1 px-2">
                    <button
                      onClick={() => changeActiveTab('governance')}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'governance'
                          ? 'bg-liberation-gold-divine/20 text-liberation-gold-divine'
                          : 'text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5'
                      }`}
                    >
                      Ownership
                    </button>
                    <button
                      onClick={() => changeActiveTab('about')}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'about'
                          ? 'bg-liberation-gold-divine/20 text-liberation-gold-divine'
                          : 'text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5'
                      }`}
                    >
                      About
                    </button>
                  </div>
                </div>

                {/* IVOR and Mobile Menu */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowIVOR(true)}
                    className="p-2 bg-liberation-gold-divine/10 text-liberation-gold-divine rounded-md hover:bg-liberation-gold-divine/20 transition-all duration-200 border border-liberation-gold-divine/30"
                    title="Ask IVOR"
                  >
                    <Brain className="h-5 w-5" />
                  </button>
                  <MobileNav
                    activeTab={activeTab}
                    onTabChange={changeActiveTab}
                    onIVOROpen={() => setShowIVOR(true)}
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

      </div>
    </ErrorBoundary>
  );
}
