// BLKOUT Liberation Platform - Main Application
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Application shell only - NO business logic

import React, { useState, useEffect } from 'react';
import { DollarSign, Brain, ExternalLink } from 'lucide-react';
import {
  cn,
  culturalUtils,
  traumaInformedUtils,
  liberationColors
} from '@/lib/liberation-utils';
import AdminAuth, { checkAdminAuth } from '@/components/admin/AdminAuth';  // RE-ENABLED for launch
import AdminDashboard from '@/components/admin/AdminDashboard';
import AboutUs from '@/components/pages/AboutUs';
import StoryArchive from '@/components/pages/StoryArchive';
import ArticleDetail from '@/components/pages/ArticleDetail';
import DiscoverPage from '@/components/pages/DiscoverPage.enhanced';
import Footer from '@/components/ui/Footer';
import IVORIntroduction from '@/components/pages/IVORIntroduction';
import IVORAssistant from './components/ivor/IVORAssistant';
import GovernancePage from '@/components/pages/GovernancePage';
import GovernanceProposalsPage from '@/components/pages/GovernanceProposalsPage';
import MemberPortalPage from '@/components/pages/MemberPortalPage';
import FinancialDashboard from '@/components/pages/FinancialDashboard';
import TermsOfService from '@/components/pages/TermsOfService';
import PrivacyPolicy from '@/components/pages/PrivacyPolicy';
import HealthDashboard from '@/components/pages/HealthDashboard';
import MobileNav from '@/components/ui/MobileNav';
import InstallPrompt from '@/components/ui/InstallPrompt';
import FirstTimeUserFlow from '@/components/onboarding/FirstTimeUserFlow';
import VideoHero from '@/components/ui/VideoHero';
import TheoryOfChangeMasonry from '@/components/movement/TheoryOfChangeMasonry';
import ShopPage from '@/components/pages/ShopPage';
import BoardNavigationHub from '@/components/governance/board/BoardNavigationHub';
import CampaignDashboard from '@/components/pages/campaigns/CampaignDashboard';
import AnimatedLiberationGrid from '@/components/home/AnimatedLiberationGrid';
import { supabase } from '@/lib/supabase';

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
type NavigationTab = 'liberation' | 'governance' | 'governance-proposals' | 'my-account' | 'finances' | 'about' | 'stories' | 'intro' | 'admin' | 'platform' | 'discover' | 'terms' | 'privacy' | 'health-dashboard' | 'movement' | 'shop' | 'board' | 'campaigns';

// Liberation Quotes Collection - Powerful voices from our community
const LIBERATION_QUOTES = [
  { quote: "NOT EVERYTHING THAT IS FACED CAN BE CHANGED, BUT NOTHING CAN BE CHANGED UNTIL IT IS FACED.", author: "JAMES BALDWIN" },
  { quote: "THOSE WHO DO NOT SEE THEMSELVES REFLECTED IN NATIONAL HERITAGE ARE EXCLUDED FROM IT.", author: "STUART HALL" },
  { quote: "YOUR SILENCE WILL NOT PROTECT YOU.", author: "AUDRE LORDE" },
  { quote: "THE SOUL THAT IS WITHIN ME NO MAN CAN DEGRADE.", author: "FREDERICK DOUGLASS" },
  { quote: "WE NEED, IN EVERY COMMUNITY, A GROUP OF ANGELIC TROUBLEMAKERS.", author: "BAYARD RUSTIN" },
  { quote: "IF THEY DON'T GIVE YOU A SEAT AT THE TABLE, BRING A FOLDING CHAIR.", author: "SHIRLEY CHISHOLM" },
  { quote: "CHANGE WILL NOT COME IF WE WAIT FOR SOME OTHER PERSON OR SOME OTHER TIME. WE ARE THE ONES WE'VE BEEN WAITING FOR.", author: "BARACK OBAMA" },
  { quote: "YOU ARE YOUR BEST THING.", author: "TONI MORRISON" },
  { quote: "NO PERSON IS YOUR FRIEND WHO DEMANDS YOUR SILENCE OR DENIES YOUR RIGHT TO GROW.", author: "ALICE WALKER" },
  { quote: "HOLD FAST TO DREAMS, FOR IF DREAMS DIE, LIFE IS A BROKEN-WINGED BIRD THAT CANNOT FLY.", author: "LANGSTON HUGHES" },
  { quote: "DO THE BEST YOU CAN UNTIL YOU KNOW BETTER. THEN WHEN YOU KNOW BETTER, DO BETTER.", author: "MAYA ANGELOU" },
  { quote: "BLACK MEN LOVING BLACK MEN IS THE REVOLUTIONARY ACT.", author: "JOSEPH BEAM" },
  { quote: "THERE IS POWER IN NAMING YOURSELF, IN PROCLAIMING TO THE WORLD THAT YOU EXIST ON YOUR OWN TERMS.", author: "DIRIYE OSMAN" }
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
  const validTabs: NavigationTab[] = ['liberation', 'governance', 'governance-proposals', 'my-account', 'finances', 'about', 'stories', 'intro', 'admin', 'platform', 'discover', 'terms', 'privacy', 'health-dashboard', 'movement', 'shop', 'board', 'campaigns'];

  if (validTabs.includes(path as NavigationTab)) {
    return path as NavigationTab;
  }

  return 'liberation'; // Default fallback
}

export default function App() {
  // State for navigation and platform functionality
  const [activeTab, setActiveTab] = useState<NavigationTab>(getInitialTabFromURL());
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // Require authentication
  const [showIVOR, setShowIVOR] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    membersServed: 0,
    storiesShared: 0,
    eventsHosted: 0,
    liberationActions: 0
  });
  const [statsLoaded, setStatsLoaded] = useState(false);

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

  // Check admin authentication on mount
  useEffect(() => {
    const authResult = checkAdminAuth();
    setIsAdminAuthenticated(authResult.isAuthenticated);

    // Check if this is user's first visit
    const hasVisited = localStorage.getItem('blkout-has-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
    }
  }, []);

  // Load real platform stats from Supabase
  useEffect(() => {
    const loadPlatformStats = async () => {
      try {
        // Query real counts from database tables
        const [membersResult, storiesResult, eventsResult, actionsResult] = await Promise.all([
          supabase.from('governance_members').select('id', { count: 'exact', head: true }),
          supabase.from('legacy_articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('governance_proposals').select('id', { count: 'exact', head: true })
        ]);

        setPlatformStats({
          membersServed: membersResult.count || 0,
          storiesShared: storiesResult.count || 0,
          eventsHosted: eventsResult.count || 0,
          liberationActions: actionsResult.count || 0
        });
        setStatsLoaded(true);
      } catch (error) {
        console.error('Error loading platform stats:', error);
        // Keep zeros on error rather than showing fake numbers
      }
    };

    loadPlatformStats();
  }, []);

  // Refresh stats every 5 minutes (real data, not simulated)
  useEffect(() => {
    if (!statsLoaded) return;

    const statsInterval = setInterval(async () => {
      try {
        const actionsResult = await supabase
          .from('governance_proposals')
          .select('id', { count: 'exact', head: true });

        if (actionsResult.count !== null) {
          setPlatformStats(prev => ({
            ...prev,
            liberationActions: actionsResult.count || prev.liberationActions
          }));
        }
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }
    }, 300000); // 5 minutes
    return () => clearInterval(statsInterval);
  }, [statsLoaded]);

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
      case 'governance-proposals':
        return <GovernanceProposalsPage />;
      case 'my-account':
        return <MemberPortalPage />;
      case 'finances':
        return <FinancialDashboard />;
      case 'terms':
        return <TermsOfService />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'platform':
      case 'discover':
        window.location.href = 'https://comms.blkoutuk.cloud/discover';
        return null;
      case 'admin':
        if (!isAdminAuthenticated) {
          return (
            <AdminAuth
              onAuthenticated={() => setIsAdminAuthenticated(true)}
              onCancel={() => changeActiveTab('liberation')}
              requiredAction="Access admin dashboard"
            />
          );
        }
        return <AdminDashboard />;
      case 'health-dashboard':
        return <HealthDashboard />;
      case 'movement':
        return <TheoryOfChangeMasonry />;
      case 'shop':
        return <ShopPage />;
      case 'board':
        return <BoardNavigationHub />;
      case 'campaigns':
        return <CampaignDashboard />;
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

      {/* Animated Liberation Grid - Progressive reveal gateway */}
      <AnimatedLiberationGrid onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />

      {/* Heroes Video - Theory of Change */}
      <section
        onClick={() => changeActiveTab('movement')}
        className="bg-gradient-to-br from-liberation-purple-spirit to-liberation-black-power text-white p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 mb-8 cursor-pointer group"
      >
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-liberation-gold-divine transition-colors">
            Our Heroes, Our Story
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Discover how we're building liberation together
          </p>
          <div className="relative rounded-xl overflow-hidden mb-6 max-w-5xl mx-auto shadow-2xl" style={{ aspectRatio: '16/9' }}>
            <video
              src="/videos/Heroes2.mp4"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <button className="bg-liberation-gold-divine text-liberation-black-power px-8 py-3 rounded-lg font-bold hover:bg-liberation-gold-divine/90 transition-all transform hover:scale-105">
            Explore Our Theory of Change →
          </button>
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
                      href="https://comms.blkoutuk.cloud/discover"
                      className="px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5"
                    >
                      Discover
                    </a>
                    <a
                      href="https://blkouthub.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5 flex items-center gap-1.5"
                      title="Join our community discussion platform"
                    >
                      Community
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

                  {/* Shop */}
                  <div className="flex items-center gap-1 px-2 border-r border-liberation-gold-divine/20">
                    <button
                      onClick={() => changeActiveTab('shop')}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                        activeTab === 'shop'
                          ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                          : 'text-liberation-silver/80 hover:text-yellow-500 hover:bg-white/5'
                      }`}
                    >
                      <DollarSign className="h-4 w-4" />
                      Shop
                    </button>
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
                      onClick={() => changeActiveTab('board')}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'board'
                          ? 'bg-liberation-gold-divine/20 text-liberation-gold-divine border border-liberation-gold-divine/30'
                          : 'text-liberation-silver/80 hover:text-liberation-gold-divine hover:bg-white/5'
                      }`}
                    >
                      Board
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
