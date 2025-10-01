import React, { useState, useEffect } from 'react';
import { PenTool, Star, Calendar, User, ArrowRight, Tag, Clock, Quote, ChevronRight, FileText } from 'lucide-react';
import { voicesAPI, type VoicesArticle } from '@/services/voices-api';
import ArticlePitchForm from '@/components/voices/ArticlePitchForm';
import ArticleShareButtons from '@/components/voices/ArticleShareButtons';
import ArticleCallToAction from '@/components/voices/ArticleCallToAction';

const VoicesPage: React.FC = () => {
  const [articles, setArticles] = useState<VoicesArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<VoicesArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<VoicesArticle | null>(null);
  const [showPitchForm, setShowPitchForm] = useState(false);

  const categories = [
    { id: 'all', label: 'All Voices', icon: PenTool, color: 'purple' },
    { id: 'opinion', label: 'Opinion', icon: Quote, color: 'blue' },
    { id: 'analysis', label: 'Analysis', icon: PenTool, color: 'green' },
    { id: 'editorial', label: 'Editorial', icon: Star, color: 'red' },
    { id: 'community', label: 'Community Voice', icon: User, color: 'gold' },
    { id: 'liberation', label: 'Liberation Thought', icon: ArrowRight, color: 'purple' },
  ];

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const [allArticles, featured] = await Promise.all([
          selectedCategory === 'all'
            ? voicesAPI.getPublishedArticles()
            : voicesAPI.getArticlesByCategory(selectedCategory),
          voicesAPI.getFeaturedArticles()
        ]);

        setArticles(allArticles);
        setFeaturedArticles(featured);
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [selectedCategory]);

  const handleArticleClick = (article: VoicesArticle) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const getCategoryColor = (category: string) => {
    const categoryConfig = categories.find(c => c.id === category);
    switch (categoryConfig?.color) {
      case 'blue': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'green': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'red': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'gold': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'purple': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  // If an article is selected, show the article detail view
  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-liberation-black-power text-liberation-silver">
        {/* Article Hero */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={selectedArticle.hero_image || '/Fallback images/blue images/blue man.jpg'}
            alt={selectedArticle.hero_image_alt || selectedArticle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-liberation-black-power via-liberation-black-power/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-liberation-gold-divine hover:text-liberation-gold-divine/80 transition-colors mb-6"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Voices
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide border ${getCategoryColor(selectedArticle.category)}`}>
                    {selectedArticle.category}
                  </span>
                  {selectedArticle.featured && (
                    <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-300 text-sm font-semibold flex items-center gap-1 border border-yellow-500/30">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-liberation-gold-divine leading-tight">
                  {selectedArticle.title}
                </h1>

                <p className="text-xl md:text-2xl text-liberation-silver leading-relaxed max-w-3xl">
                  {selectedArticle.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-liberation-silver/70">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>By {selectedArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(selectedArticle.published_at || selectedArticle.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{Math.max(1, Math.ceil(selectedArticle.content.length / 1000))} min read</span>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="pt-4 border-t border-liberation-silver/10">
                  <ArticleShareButtons
                    title={selectedArticle.title}
                    excerpt={selectedArticle.excerpt}
                    url={`${window.location.origin}/voices/${selectedArticle.slug}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg prose-invert max-w-none">
            {selectedArticle.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-3xl font-bold text-liberation-gold-divine mt-8 mb-4">
                    {paragraph.substring(2)}
                  </h1>
                );
              } else if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-liberation-gold-divine mt-6 mb-3">
                    {paragraph.substring(3)}
                  </h2>
                );
              } else if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-liberation-gold-divine mt-4 mb-2">
                    {paragraph.substring(4)}
                  </h3>
                );
              } else if (paragraph.trim() === '') {
                return <br key={index} />;
              } else {
                return (
                  <p key={index} className="text-liberation-silver leading-relaxed mb-4 text-lg">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>

          {/* Tags */}
          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-liberation-silver/20">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="h-5 w-5 text-liberation-silver/70" />
                {selectedArticle.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-liberation-silver/10 rounded-full text-sm text-liberation-silver/70 hover:bg-liberation-silver/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action - Link to relevant platform section */}
          <ArticleCallToAction articleSlug={selectedArticle.slug} />
        </div>
      </div>
    );
  }

  // Main Vox-style layout
  return (
    <div className="min-h-screen bg-liberation-black-power text-liberation-silver">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-black to-purple-900 border-b border-liberation-silver/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-liberation-gold-divine mb-4">
              BLKOUT Voices
            </h1>
            <p className="text-xl md:text-2xl text-liberation-silver max-w-3xl mx-auto mb-6">
              Editorial perspectives, community voices, and liberation thought from our community
            </p>
            <button
              onClick={() => setShowPitchForm(!showPitchForm)}
              className="inline-flex items-center gap-2 bg-liberation-gold-divine text-liberation-black-power px-6 py-3 rounded-lg font-bold hover:bg-liberation-gold-divine/90 transition-colors"
            >
              <FileText className="h-5 w-5" />
              {showPitchForm ? 'Hide Pitch Form' : 'Pitch an Article'}
            </button>
          </div>
        </div>
      </div>

      {/* Article Pitch Form */}
      {showPitchForm && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ArticlePitchForm onClose={() => setShowPitchForm(false)} />
        </div>
      )}

      {/* Featured Hero Article */}
      {featuredArticles.length > 1 && (
        <section className="relative">
          <div className="relative h-[600px] overflow-hidden">
            <img
              src={featuredArticles[1].hero_image || '/Fallback images/blue images/blue man.jpg'}
              alt={featuredArticles[1].hero_image_alt || featuredArticles[1].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-liberation-black-power via-liberation-black-power/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-7xl mx-auto">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold uppercase tracking-wide">Featured</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide border ${getCategoryColor(featuredArticles[1].category)}`}>
                      {featuredArticles[1].category}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-black text-liberation-gold-divine mb-4 leading-tight">
                    {featuredArticles[1].title}
                  </h2>

                  <p className="text-xl md:text-2xl text-liberation-silver mb-6 leading-relaxed">
                    {featuredArticles[1].excerpt}
                  </p>

                  <div className="flex items-center gap-6 text-liberation-silver/70 mb-6">
                    <span>By {featuredArticles[1].author}</span>
                    <span>{new Date(featuredArticles[1].published_at || featuredArticles[1].created_at).toLocaleDateString()}</span>
                    <span>{Math.max(1, Math.ceil(featuredArticles[1].content.length / 1000))} min read</span>
                  </div>

                  <button
                    onClick={() => handleArticleClick(featuredArticles[1])}
                    className="inline-flex items-center gap-2 bg-liberation-gold-divine text-liberation-black-power px-8 py-4 rounded-lg font-bold text-lg hover:bg-liberation-gold-divine/90 transition-colors"
                  >
                    Read Article
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="bg-liberation-black-power/90 border-y border-liberation-silver/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-liberation-gold-divine text-liberation-black-power'
                      : 'bg-liberation-silver/10 text-liberation-silver hover:bg-liberation-silver/20 hover:text-liberation-gold-divine border border-liberation-silver/20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-liberation-gold-divine mx-auto mb-6"></div>
              <p className="text-liberation-silver text-xl">Loading voices...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <PenTool className="h-20 w-20 text-liberation-silver/40 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-liberation-silver mb-4">No articles yet</h3>
              <p className="text-liberation-silver/70 text-lg">
                {selectedCategory === 'all'
                  ? 'Be the first to share your voice with the community.'
                  : `No articles in the ${categories.find(c => c.id === selectedCategory)?.label} category yet.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="group cursor-pointer bg-liberation-black-power/50 rounded-xl overflow-hidden border border-liberation-silver/20 hover:border-liberation-gold-divine/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl"
                >
                  {/* Article Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={article.thumbnail_image || article.hero_image || '/Fallback images/blue images/blue man.jpg'}
                      alt={article.thumbnail_alt || article.hero_image_alt || article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {article.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-300 text-xs font-semibold flex items-center gap-1 border border-yellow-500/30">
                          <Star className="h-3 w-3" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-liberation-gold-divine mb-3 group-hover:text-liberation-gold-divine/80 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-liberation-silver/80 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-liberation-silver/60 mb-4">
                      <span className="font-medium">By {article.author}</span>
                      <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-liberation-silver/10 rounded text-xs text-liberation-silver/70"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 2 && (
                          <span className="px-2 py-1 bg-liberation-silver/10 rounded text-xs text-liberation-silver/70">
                            +{article.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-liberation-silver/60 text-xs">
                        {Math.max(1, Math.ceil(article.content.length / 1000))} min read
                      </span>
                      <div className="flex items-center text-liberation-gold-divine text-sm font-medium group-hover:text-liberation-gold-divine/80 transition-colors">
                        Read more
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VoicesPage;