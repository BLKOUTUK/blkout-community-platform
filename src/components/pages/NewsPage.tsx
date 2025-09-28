import React, { useState, useEffect } from 'react';
import { Vote, Calendar, User, ArrowRight, ArrowLeft, ThumbsUp, ThumbsDown, TrendingUp, ExternalLink, Crown, Zap } from 'lucide-react';
import ContentRating from '../community/ContentRating';
import WeeklyHighlights from '../community/WeeklyHighlights';
import VideoHero from '@/components/ui/VideoHero';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;

  // Phase 1: Story Aggregation fields
  originalUrl: string;           // External article URL
  sourceName: string;            // Publication name (e.g., "The Guardian")
  curatorId: string;             // Community curator who submitted
  submittedAt: string;           // When submitted to platform

  // Community engagement
  interestScore: number;         // Aggregate user interest (0-100)
  totalVotes: number;            // Number of user votes
  userInterestLevel?: 'low' | 'medium' | 'high'; // Current user's vote

  // IVOR learning data
  topics: string[];              // AI-extracted topics
  sentiment: string;             // Article sentiment
  relevanceScore: number;        // AI-determined relevance (0-100)

  // Featured content
  isStoryOfWeek?: boolean;       // Weekly featured story
  weeklyRank?: number;           // Ranking for the week
}

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'interest' | 'recent' | 'weekly'>('interest');

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        // Fetch from news API (community-curated news, not archive)
        const params = new URLSearchParams({
          category: selectedCategory !== 'all' ? selectedCategory : '',
          sortBy: sortBy,
          status: 'published',
          limit: '20'
        });

        const response = await fetch(`/api/news?${params}`);

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setArticles(data.data.articles || []);
          } else {
            setArticles([]);
          }
        } else {
          console.error('Failed to fetch articles');
          setArticles([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setArticles([]);
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const categories = ['all', 'liberation', 'community', 'politics', 'culture', 'economics'];

  const handleUserVote = (articleId: string, voteType: 'low' | 'medium' | 'high') => {
    // TODO: Implement API call to record user vote
    console.log(`User voted ${voteType} for article ${articleId}`);
    // This will help train IVOR on community interests
  };

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category.toLowerCase() === selectedCategory);

  const sortedArticles = filteredArticles.sort((a, b) => {
    switch (sortBy) {
      case 'interest':
        return b.interestScore - a.interestScore;
      case 'weekly':
        if (a.isStoryOfWeek) return -1;
        if (b.isStoryOfWeek) return 1;
        return (a.weeklyRank || 999) - (b.weeklyRank || 999);
      case 'recent':
      default:
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-liberation-sovereignty-gold/30 border-t-liberation-sovereignty-gold rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-liberation-sovereignty-gold font-bold">Loading Liberation News...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Video Hero Section */}
      <VideoHero
        title="NEWSROOM"
        subtitle="the news that matters. curated by us for us"
        description="Community-selected stories that shape our understanding and inspire action."
        videos={[
          '/videos/hero/PLATFORM HERO 1.mp4',
          '/videos/hero/PLATFORM HERO 2.mp4',
          '/videos/hero/PLATFORM HERO 3.mp4'
        ]}
        height="md"
        textColor="light"
        overlayOpacity={0.8}
        className="mb-8"
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-400 hover:text-liberation-sovereignty-gold transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Platform
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                COMMUNITY <span className="text-liberation-sovereignty-gold">NEWS CURATION</span>
              </h1>
              <p className="text-gray-400 text-sm">Shared news agenda built by community curators & votes</p>
            </div>

            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Filters & Sorting - Vox-inspired minimal design */}
      <section className="py-6 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            {/* Category Filters */}
            <div>
              <h3 className="text-liberation-sovereignty-gold font-semibold text-sm mb-3 uppercase tracking-wide">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-liberation-sovereignty-gold text-black'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting Options */}
            <div>
              <h3 className="text-liberation-sovereignty-gold font-semibold text-sm mb-3 uppercase tracking-wide">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortBy('interest')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    sortBy === 'interest'
                      ? 'bg-liberation-sovereignty-gold text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <TrendingUp className="h-3 w-3" />
                  Interest
                </button>
                <button
                  onClick={() => setSortBy('weekly')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    sortBy === 'weekly'
                      ? 'bg-liberation-sovereignty-gold text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Crown className="h-3 w-3" />
                  Weekly
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    sortBy === 'recent'
                      ? 'bg-liberation-sovereignty-gold text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Zap className="h-3 w-3" />
                  Recent
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid - Vox-Inspired Layout */}
      <main className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {sortedArticles.length === 0 ? (
            /* Empty State - Phase 1 Story Aggregation */
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-liberation-sovereignty-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-liberation-sovereignty-gold" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Building Our Shared News Agenda</h2>
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                Community curators are discovering stories that matter to us. Your votes will shape our collective news agenda and train IVOR.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-2xl mx-auto mb-12">
                <h3 className="text-liberation-sovereignty-gold font-semibold text-base mb-4">Phase 1: Story Aggregation (12 weeks)</h3>
                <div className="text-gray-300 text-sm space-y-2">
                  <div>→ Community curators submit relevant stories via Chrome extension</div>
                  <div>→ You vote on story relevance and interest</div>
                  <div>→ Weekly story rankings emerge from community votes</div>
                  <div>→ IVOR learns from our preferences to automate discovery</div>
                  <div>→ Building a shared agenda around liberation topics</div>
                </div>
              </div>

              {/* Weekly Highlights Preview */}
              <div className="max-w-4xl mx-auto mt-12">
                <WeeklyHighlights maxItems={6} showNewsletter={false} />
              </div>
            </div>
          ) : (
            /* Vox-Inspired Curated Stories Layout */
            <div className="space-y-8">
              {/* Featured Story of the Week */}
              {sortedArticles.find(article => article.isStoryOfWeek) && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Crown className="h-5 w-5 text-liberation-sovereignty-gold" />
                    <h2 className="text-lg font-bold text-liberation-sovereignty-gold uppercase tracking-wide">Story of the Week</h2>
                  </div>
                  {(() => {
                    const featuredStory = sortedArticles.find(article => article.isStoryOfWeek)!;
                    return (
                      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-liberation-sovereignty-gold/30 transition-all duration-300 group">
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs bg-liberation-sovereignty-gold text-black px-3 py-1 rounded-full font-semibold">
                              {featuredStory.category.toUpperCase()}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <ExternalLink className="h-3 w-3" />
                              <span>{featuredStory.sourceName}</span>
                              <span>•</span>
                              <span>{featuredStory.readTime}</span>
                            </div>
                          </div>

                          <a
                            href={featuredStory.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group-hover:text-liberation-sovereignty-gold transition-colors"
                          >
                            <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                              {featuredStory.title}
                            </h3>
                          </a>

                          <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {featuredStory.excerpt}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>By {featuredStory.author}</span>
                              <span>•</span>
                              <span>{formatDate(featuredStory.publishedAt)}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{featuredStory.interestScore}% interest</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <ContentRating
                                contentType="article"
                                contentId={featuredStory.id}
                                title={featuredStory.title}
                                compact={true}
                                showTransparency={false}
                              />
                              <a
                                href={featuredStory.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-liberation-sovereignty-gold hover:translate-x-1 transition-transform text-sm font-medium"
                              >
                                Read Full Story <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Regular Stories Grid */}
              <div>
                <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">Community Curated Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedArticles.filter(article => !article.isStoryOfWeek).map((article) => (
                    <article key={article.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-liberation-sovereignty-gold/30 transition-all duration-300 group">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-liberation-sovereignty-gold/20 text-liberation-sovereignty-gold px-2 py-1 rounded font-medium">
                              {article.category.toUpperCase()}
                            </span>
                            {article.weeklyRank && article.weeklyRank <= 10 && (
                              <span className="text-xs bg-liberation-pride-purple/20 text-liberation-pride-purple px-2 py-1 rounded font-medium">
                                #{article.weeklyRank}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <TrendingUp className="h-3 w-3" />
                            <span>{article.interestScore}%</span>
                          </div>
                        </div>

                        <a
                          href={article.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group-hover:text-liberation-sovereignty-gold transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 leading-tight">
                            {article.title}
                          </h3>
                        </a>

                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <ExternalLink className="h-3 w-3" />
                          <span>{article.sourceName}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="text-xs text-gray-500">
                            <span>Curated by {article.curatorId}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <ContentRating
                              contentType="article"
                              contentId={article.id}
                              title={article.title}
                              compact={true}
                              showTransparency={false}
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Shape Our <span className="text-liberation-sovereignty-gold">Shared News Agenda</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Phase 1: Community curation builds the foundation for IVOR's autonomous story discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold/90 text-black py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
              onClick={() => {
                // TODO: Link to Chrome extension installation
                console.log('Navigate to Chrome extension installation');
              }}
            >
              Get Curator Extension
            </button>
            <button
              className="bg-transparent border-2 border-liberation-sovereignty-gold text-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold hover:text-black py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300"
              onClick={() => {
                // TODO: Show curation guidelines
                console.log('Navigate to curation guidelines');
              }}
            >
              Curation Guidelines
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;