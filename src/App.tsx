// BLKOUT Liberation Platform - Main Application
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Application shell only - NO business logic

import React, { useState, useEffect } from 'react';
import { DollarSign, Brain } from 'lucide-react';
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
import TenYears from '@/components/pages/TenYears';
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
import MembershipPage from '@/components/pages/MembershipPage';
import ApparelPage from '@/components/pages/ApparelPage';
import ApparelRangePage from '@/components/pages/ApparelRangePage';
import CompassDropPage from '@/components/pages/CompassDropPage';
import GbpParisInterestPage from '@/components/pages/GbpParisInterestPage';
import BoardNavigationHub from '@/components/governance/board/BoardNavigationHub';
import CampaignDashboard from '@/components/pages/campaigns/CampaignDashboard';
import CompliancePage from '@/components/pages/CompliancePage';
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
type NavigationTab = 'liberation' | 'ten-years' | 'governance' | 'governance-proposals' | 'my-account' | 'finances' | 'about' | 'stories' | 'intro' | 'admin' | 'platform' | 'discover' | 'terms' | 'privacy' | 'health-dashboard' | 'movement' | 'shop' | 'shop/membership' | 'shop/apparel' | 'shop/apparel/blkout-proud' | 'shop/apparel/brother-to-brother' | 'shop/apparel/icons' | 'shop/drops/compass-journal' | 'board' | 'campaigns' | 'compliance' | 'gbp-paris';

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
  { quote: "THERE IS POWER IN NAMING YOURSELF, IN PROCLAIMING TO THE WORLD THAT YOU EXIST ON YOUR OWN TERMS.", author: "DIRIYE OSMAN" },
  { quote: "I WANT US TO TALK TO EACH OTHER; AS BLACK AND GAY PEOPLE WHO MAKE UP OUR VAST DIASPORA.", author: "DR ANTOINE ROGERS, BLKOUT CO-FOUNDER" },
  { quote: "WE WANT TO CREATE A DIALOGUE BETWEEN OUR VARIOUS TRIBES \u2013 THE DADDIES AND THE TWINKS, THE HOMOTHUG AND BLERD, THE CONSCIOUS BROTHER AND THE CLUB KID; FOR WE ARE ALL OF THEM.", author: "MARC THOMPSON, BLKOUT CO-FOUNDER" },
  { quote: "WE STARTED A CONVERSATION TO LIBERATE, NOT CONSTRAIN; TO WRESTLE WITH THE DIFFICULT QUESTIONS, NOT HIDE FROM THEM; TO CHALLENGE AND SUPPORT.", author: "ROB BERKELEY, BLKOUT CO-FOUNDER" }
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
              className="px-6 py-3 bg-liberation-pan-african-red text-white rounded-lg hover:bg-opacity-80 transition-colors"
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

// Section accent palette per BLKOUT One Platform Design (DESIGN_COLOUR_ARCHITECTURE.md §5).
// The 4px bar above the nav (Option C hybrid chrome) reflects the active section.
// Core (gold-divine) stays default for the front-door cluster; purple = News/Archive,
// red = Members/About, orange = Shop. AIvor would be broadcast-blue once tokenised.
const SECTION_ACCENT: Partial<Record<string, string>> = {
  stories: 'bg-liberation-pride-purple-deep',
  about: 'bg-liberation-pan-african-red',
  'ten-years': 'bg-liberation-gold-divine',
  governance: 'bg-liberation-pan-african-red',
  'governance-proposals': 'bg-liberation-pan-african-red',
  'my-account': 'bg-liberation-pan-african-red',
  finances: 'bg-liberation-pan-african-red',
  board: 'bg-liberation-pan-african-red',
  shop: 'bg-liberation-pride-orange',
  intro: 'bg-liberation-aivor', // AIvor channel — broadcast blue
};
function getSectionAccent(tab: string): string {
  return SECTION_ACCENT[tab] || 'bg-liberation-gold-divine';
}

// Function to get initial tab from URL path
function getInitialTabFromURL(): NavigationTab {
  const path = window.location.pathname.slice(1); // Remove leading slash
  const validTabs: NavigationTab[] = ['liberation', 'ten-years', 'governance', 'governance-proposals', 'my-account', 'finances', 'about', 'stories', 'intro', 'admin', 'platform', 'discover', 'terms', 'privacy', 'health-dashboard', 'movement', 'shop', 'shop/membership', 'shop/apparel', 'shop/apparel/blkout-proud', 'shop/apparel/brother-to-brother', 'shop/apparel/icons', 'shop/drops/compass-journal', 'board', 'campaigns', 'compliance', 'gbp-paris'];

  if (validTabs.includes(path as NavigationTab)) {
    return path as NavigationTab;
  }

  // /stories/<slug> deep links — keep the 'stories' tab active.
  if (path.startsWith('stories/')) {
    return 'stories';
  }

  return 'liberation'; // Default fallback
}

// Extract the article slug from /stories/<slug> URLs. Returns undefined for
// the bare /stories listing path.
function getStorySlugFromURL(): string | undefined {
  const m = window.location.pathname.match(/^\/stories\/(.+?)\/?$/);
  return m ? m[1] : undefined;
}

export default function App() {
  // State for navigation and platform functionality
  const [activeTab, setActiveTab] = useState<NavigationTab>(getInitialTabFromURL());
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // Require authentication
  const [showIVOR, setShowIVOR] = useState(() => {
    // Open chat if ?chat=open is in URL (from external links)
    const params = new URLSearchParams(window.location.search);
    return params.get('chat') === 'open';
  });
  // Extract UTM parameters from URL for campaign tracking
  const [utmParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      utmContent: params.get('utm_content') || undefined,
    };
  });
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

  // Quote rotation effect - resets on tab change so returning to homepage restarts
  useEffect(() => {
    if (activeTab !== 'liberation') return;
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % LIBERATION_QUOTES.length);
    }, 8000);
    return () => clearInterval(quoteInterval);
  }, [activeTab]);

  const advanceQuote = () => {
    setCurrentQuote(prev => (prev + 1) % LIBERATION_QUOTES.length);
  };

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
          supabase.from('archived_articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
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
        return <AboutUs onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />;
      case 'stories':
        return <StoryArchive initialSlug={getStorySlugFromURL()} />;
      case 'ten-years':
        return <TenYears onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />;
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
        window.location.href = 'https://comms.blkoutuk.com/discover';
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
        return <ShopPage onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />;
      case 'shop/membership':
        return <MembershipPage />;
      case 'shop/apparel':
        return <ApparelPage onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />;
      case 'shop/apparel/blkout-proud':
        return <ApparelRangePage range="blkout-proud" onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />;
      case 'shop/apparel/brother-to-brother':
        return <ApparelRangePage range="brother-to-brother" onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />;
      case 'shop/apparel/icons':
        return <ApparelRangePage range="icons" onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />;
      case 'shop/drops/compass-journal':
        return <CompassDropPage onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />;
      case 'gbp-paris':
        return <GbpParisInterestPage onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />;
      case 'board':
        return <BoardNavigationHub />;
      case 'campaigns':
        return <CampaignDashboard />;
      case 'compliance':
        return <CompliancePage />;
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
      <section
        onClick={advanceQuote}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') advanceQuote(); }}
        aria-label="Tap to see next quote"
        className="bg-liberation-black-power p-6 md:p-8 border-4 border-liberation-gold-divine mb-8 shadow-xl cursor-pointer select-none group"
      >
        <div className="text-center">
          <blockquote
            key={currentQuote}
            className="text-2xl md:text-3xl lg:text-4xl font-black text-liberation-sovereignty-gold mb-4 leading-tight animate-fade-in"
            style={{
              textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000'
            }}
          >
            &ldquo;{LIBERATION_QUOTES[currentQuote].quote}&rdquo;
          </blockquote>
          <cite
            key={`cite-${currentQuote}`}
            className="text-lg md:text-xl font-bold text-gray-300 uppercase block mb-4 animate-fade-in"
            style={{
              textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
            }}
          >
            &mdash; {LIBERATION_QUOTES[currentQuote].author}
          </cite>
          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-2">
            {LIBERATION_QUOTES.map((_, i) => (
              <span
                key={i}
                className={`inline-block w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentQuote
                    ? 'bg-liberation-sovereignty-gold scale-125'
                    : 'bg-gray-600 group-hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            Tap for next quote
          </p>
        </div>
      </section>

      {/* Animated Liberation Grid - Progressive reveal gateway */}
      <AnimatedLiberationGrid onNavigate={(tab) => changeActiveTab(tab as NavigationTab)} />

      {/* Heroes & 10th Anniversary Videos */}
      <section className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-liberation-gold-divine">
            Our Heroes, Our Story
          </h2>
          <p className="text-xl mt-2 opacity-90">
            Discover how we're building liberation together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Heroes2 — Theory of Change */}
          <div
            onClick={() => changeActiveTab('movement')}
            className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
          >
            <div style={{ aspectRatio: '16/9' }}>
              {/* Was autoPlay on a 35 MB file. preload="none" means nothing is
                  fetched until the visitor presses play. */}
              <video
                src="/videos/Heroes2.mp4"
                className="w-full h-full object-cover"
                controls
                preload="none"
                poster="/images/poster-Heroes2.jpg"
                muted
                playsInline
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-bold text-sm uppercase tracking-wide group-hover:text-liberation-gold-divine transition-colors">
                Explore Our Theory of Change →
              </p>
            </div>
          </div>

          {/* Ten — 10th anniversary film (7 Feb 2026). Click-to-play: six months on it
              should be present, not overbearing, and it is a 20 MB download. */}
          <a
            href="https://comms.blkoutuk.com/10years"
            target="_blank"
            rel="noopener noreferrer"
            className="relative rounded-xl overflow-hidden shadow-2xl group block"
          >
            <div style={{ aspectRatio: '16/9' }}>
              <video
                controls
                preload="none"
                poster="/images/poster-Ten.jpg"
                src="/videos/Ten.mp4"
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-liberation-gold-divine text-xs uppercase tracking-widest font-semibold mb-1">
                #BLKOUT10Years
              </p>
              <p className="text-white font-bold text-sm uppercase tracking-wide group-hover:text-liberation-gold-divine transition-colors">
                10 Years of Liberation →
              </p>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-liberation-gold-divine/50 rounded-xl transition-colors duration-500 pointer-events-none" />
          </a>
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
      <div className="min-h-screen bg-liberation-black-power noise text-white">
          {/* Install Prompt Banner */}
          <InstallPrompt />

          {/* First Time User Flow */}
          {isFirstVisit && (
            <FirstTimeUserFlow onComplete={handleFirstVisitComplete} />
          )}

          {/* Main Navigation */}
          <div className={`sticky top-0 z-40 h-1 transition-colors duration-300 ${getSectionAccent(activeTab)}`} aria-hidden />
          <nav className="sticky top-1 z-40 bg-liberation-black-power border-b border-liberation-gold-divine/30 shadow-lg backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16 md:h-18">
                {/* Logo, Brain icon and Brand */}
                <div className="flex items-center space-x-3">
                  <img
                    src="/blkout-logo.png"
                    alt="BLKOUT"
                    className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform drop-shadow-lg"
                    onClick={() => changeActiveTab('liberation')}
                  />
                  <button
                    onClick={() => setShowIVOR(true)}
                    className="p-2 bg-liberation-gold-divine/10 text-liberation-gold-divine rounded-md hover:bg-liberation-gold-divine/20 transition-all duration-200 border border-liberation-gold-divine/30"
                    title="Ask AIvor"
                  >
                    <Brain className="h-5 w-5" />
                  </button>
                </div>

                {/* Desktop Navigation — Top 5, right-aligned.
                    Option C hybrid (DESIGN_COLOUR_ARCHITECTURE.md §7): each button carries its own section accent
                    via a 2px underline that activates on hover and persists when the section is current. */}
                <div className="hidden lg:flex items-center gap-4">
                  <button
                    onClick={() => changeActiveTab('liberation')}
                    className={`px-4 py-2 text-base font-signature font-black uppercase tracking-tight transition-colors duration-200 border-b-2 ${
                      activeTab === 'liberation'
                        ? 'text-liberation-gold-divine border-liberation-gold-divine'
                        : 'text-gray-200 border-transparent hover:text-liberation-gold-divine hover:border-liberation-gold-divine/60'
                    }`}
                  >
                    Home
                  </button>
                  <a
                    href="https://events.blkoutuk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-base font-signature font-black uppercase tracking-tight transition-colors duration-200 border-b-2 border-transparent text-gray-200 hover:text-liberation-events hover:border-liberation-events/60 flex items-center gap-2"
                  >
                    Events
                  </a>
                  <a
                    href="https://news.blkoutuk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-base font-signature font-black uppercase tracking-tight transition-colors duration-200 border-b-2 border-transparent text-gray-200 hover:text-liberation-pride-purple-deep hover:border-liberation-pride-purple-deep/60 flex items-center gap-2"
                  >
                    News
                  </a>
                  <button
                    onClick={() => changeActiveTab('intro')}
                    className={`px-4 py-2 text-base font-signature font-black uppercase tracking-tight transition-colors duration-200 border-b-2 ${
                      activeTab === 'intro'
                        ? 'text-liberation-aivor border-liberation-aivor'
                        : 'text-gray-200 border-transparent hover:text-liberation-aivor hover:border-liberation-aivor/60'
                    }`}
                  >
                    AIvor
                  </button>
                  <a
                    href="https://voices.blkoutuk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-base font-signature font-black uppercase tracking-tight transition-colors duration-200 border-b-2 border-transparent text-gray-200 hover:text-liberation-pan-african-green hover:border-liberation-pan-african-green/60 flex items-center gap-2"
                  >
                    Voices
                  </a>
                </div>

                {/* Mobile Menu only */}
                <div className="flex items-center gap-2 lg:hidden">
                  <MobileNav
                    activeTab={activeTab}
                    onTabChange={changeActiveTab}
                    onIVOROpen={() => setShowIVOR(true)}
                    isAdminAuthenticated={isAdminAuthenticated}
                  />
                </div>
              </div>
            </div>
            {/* Second row — only on Home, AIvor, About.
                Section accents per tab: Shop=orange, Membership/About=red, Discover/Community=core gold. */}
            {['liberation', 'intro', 'about', 'ten-years'].includes(activeTab) && (
              <div className="hidden lg:block border-t border-liberation-gold-divine/20 bg-liberation-black-power/80">
                <div className="container mx-auto px-4">
                  <div className="flex items-center gap-3 justify-end py-1.5">
                    <a href="https://comms.blkoutuk.com/discover" className="px-3 py-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 border-transparent text-gray-400 hover:text-liberation-gold-divine hover:border-liberation-gold-divine/60">Discover</a>
                    <a href="https://blkouthub.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 border-transparent text-gray-400 hover:text-liberation-gold-divine hover:border-liberation-gold-divine/60">Community</a>
                    <button onClick={() => changeActiveTab('shop')} className={`px-3 py-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 ${activeTab === 'shop' ? 'text-liberation-pride-orange border-liberation-pride-orange' : 'text-gray-400 border-transparent hover:text-liberation-pride-orange hover:border-liberation-pride-orange/60'}`}>Shop</button>
                    <button onClick={() => changeActiveTab('governance')} className={`px-3 py-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 ${activeTab === 'governance' ? 'text-liberation-pan-african-red border-liberation-pan-african-red' : 'text-gray-400 border-transparent hover:text-liberation-pan-african-red hover:border-liberation-pan-african-red/60'}`}>Membership</button>
                    <button onClick={() => changeActiveTab('about')} className={`px-3 py-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 ${activeTab === 'about' ? 'text-liberation-pan-african-red border-liberation-pan-african-red' : 'text-gray-400 border-transparent hover:text-liberation-pan-african-red hover:border-liberation-pan-african-red/60'}`}>About</button>
                    <button onClick={() => changeActiveTab('ten-years')} className={`px-3 py-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 ${activeTab === 'ten-years' ? 'text-liberation-gold-divine border-liberation-gold-divine' : 'text-gray-400 border-transparent hover:text-liberation-gold-divine hover:border-liberation-gold-divine/60'}`}>Ten Years</button>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Main Content Area */}
          <main className="container mx-auto px-4 py-8">
            {renderContent()}
          </main>

          {/* Footer */}
          <Footer />

          {/* IVOR Assistant Overlay */}
          {showIVOR && (
            <IVORAssistant onClose={() => setShowIVOR(false)} utmParams={utmParams} />
          )}

      </div>
    </ErrorBoundary>
  );
}
