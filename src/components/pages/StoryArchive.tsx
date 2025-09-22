import React, { useState, useEffect } from 'react';
import { Heart, Calendar, User, ArrowRight, ArrowLeft, BookOpen, Tag, ChevronLeft, ChevronRight, Play, Volume2, Image, ExternalLink, Star, Clock } from 'lucide-react';
import VideoHero from '@/components/ui/VideoHero';

interface StoryArchiveItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  imageUrl?: string;
  originalUrl?: string; // For blkoutuk.com articles
  contentType?: 'article' | 'audio' | 'video' | 'gallery' | 'multimedia';
  audioUrl?: string;
  videoUrl?: string;
  galleryImages?: string[];
  blkoutTheme?: 'CONNECT' | 'CREATE' | 'CARE'; // Original blkoutuk.com themes
}

interface StoryDetail {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  imageUrl?: string;
  contentType?: 'article' | 'audio' | 'video' | 'gallery' | 'multimedia';
  audioUrl?: string;
  videoUrl?: string;
  galleryImages?: string[];
  blkoutTheme?: 'CONNECT' | 'CREATE' | 'CARE';
  originalUrl?: string;
}

const StoryArchive: React.FC = () => {
  const [stories, setStories] = useState<StoryArchiveItem[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);

  const themes = ['all', 'CONNECT', 'CREATE', 'CARE'];
  const contentTypes = ['all', 'article', 'audio', 'video', 'gallery', 'multimedia'];
  const storiesPerPage = 12;

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to story archive endpoint
      const response = await fetch('https://api.blkoutcollective.org/v1/story-archive');
      if (response.ok) {
        const data = await response.json();
        setStories(data.articles || []);
      } else {
        // Empty state for now - waiting for 270+ articles migration
        setStories([]);
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStoryDetail = async (storyId: string) => {
    setPageLoading(true);
    try {
      // TODO: Replace with actual API call for full story content
      const response = await fetch(`https://api.blkoutcollective.org/v1/story-archive/${storyId}`);
      if (response.ok) {
        const story = await response.json();
        setSelectedStory(story);
      }
    } catch (error) {
      console.error('Failed to load story detail:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const getContentTypeIcon = (type?: string) => {
    switch (type) {
      case 'audio':
        return <Volume2 className="h-4 w-4" />;
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'gallery':
        return <Image className="h-4 w-4" />;
      case 'multimedia':
        return <Star className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const filteredStories = stories.filter(story => {
    const themeMatch = selectedTheme === 'all' || story.blkoutTheme === selectedTheme;
    const contentTypeMatch = selectedContentType === 'all' || story.contentType === selectedContentType;
    return themeMatch && contentTypeMatch;
  });

  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  const startIndex = (currentPage - 1) * storiesPerPage;
  const currentStories = filteredStories.slice(startIndex, startIndex + storiesPerPage);

  // Find featured story (first story or specific featured story)
  const featuredStory = filteredStories[0];
  const regularStories = currentStories.filter(story => story.id !== featuredStory?.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Full-page story view for reading, listening, or watching
  if (selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Story Header */}
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedStory(null)}
                className="flex items-center text-gray-400 hover:text-liberation-sovereignty-gold transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Archive
              </button>

              <div className="flex items-center gap-4">
                {selectedStory.originalUrl && (
                  <a
                    href={selectedStory.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-liberation-sovereignty-gold hover:text-liberation-sovereignty-gold/80 transition-colors text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Original on blkoutuk.com
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Story Content */}
        <main className="py-8 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {pageLoading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-liberation-sovereignty-gold/30 border-t-liberation-sovereignty-gold rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-liberation-sovereignty-gold font-medium">Loading story...</div>
              </div>
            ) : (
              <article className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-8 md:p-12">
                  {/* Story Meta */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs bg-liberation-sovereignty-gold text-black px-3 py-1 rounded-full font-semibold">
                      {selectedStory.blkoutTheme?.toUpperCase() || selectedStory.category.toUpperCase()}
                    </span>
                    {selectedStory.contentType && selectedStory.contentType !== 'article' && (
                      <div className="flex items-center gap-2 text-liberation-sovereignty-gold text-sm">
                        {getContentTypeIcon(selectedStory.contentType)}
                        <span className="capitalize font-medium">{selectedStory.contentType}</span>
                      </div>
                    )}
                    <span className="text-gray-400 text-sm">{selectedStory.readTime}</span>
                  </div>

                  {/* Story Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    {selectedStory.title}
                  </h1>

                  {/* Story Byline */}
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-white/10">
                    <span>By {selectedStory.author}</span>
                    <span>•</span>
                    <span>{formatDate(selectedStory.publishedAt)}</span>
                  </div>

                  {/* Multimedia Content */}
                  {selectedStory.contentType === 'audio' && selectedStory.audioUrl && (
                    <div className="mb-8">
                      <div className="bg-liberation-sovereignty-gold/10 border border-liberation-sovereignty-gold/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Volume2 className="h-5 w-5 text-liberation-sovereignty-gold" />
                          <h3 className="text-liberation-sovereignty-gold font-semibold">Audio Story</h3>
                        </div>
                        <audio controls className="w-full">
                          <source src={selectedStory.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  )}

                  {selectedStory.contentType === 'video' && selectedStory.videoUrl && (
                    <div className="mb-8">
                      <div className="bg-liberation-sovereignty-gold/10 border border-liberation-sovereignty-gold/20 rounded-xl overflow-hidden">
                        <video controls className="w-full" poster={selectedStory.imageUrl}>
                          <source src={selectedStory.videoUrl} type="video/mp4" />
                          Your browser does not support the video element.
                        </video>
                      </div>
                    </div>
                  )}

                  {selectedStory.contentType === 'gallery' && selectedStory.galleryImages && (
                    <div className="mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedStory.galleryImages.map((imageUrl, index) => (
                          <div key={index} className="bg-liberation-sovereignty-gold/10 border border-liberation-sovereignty-gold/20 rounded-xl overflow-hidden">
                            <img src={imageUrl} alt={`Gallery image ${index + 1}`} className="w-full h-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Story Content */}
                  <div className="prose prose-lg prose-invert max-w-none">
                    <div
                      className="text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedStory.content }}
                    />
                  </div>

                  {/* Story Tags */}
                  {selectedStory.tags && selectedStory.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-white/10">
                      <h4 className="text-liberation-sovereignty-gold font-semibold text-sm mb-4 uppercase tracking-wide">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStory.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Video Hero Section */}
      <VideoHero
        title="STORY ARCHIVE"
        subtitle="270+ stories from blkoutuk.com"
        description="Preserving our community's rich history of creative expression, cultural commentary, and liberation narratives. Read, listen, and watch stories that shaped our movement."
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
                STORY <span className="text-liberation-sovereignty-gold">ARCHIVE</span>
              </h1>
              <p className="text-gray-400 text-sm">270+ stories from blkoutuk.com • Read, Listen, Watch</p>
            </div>

            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Filters - Vox-inspired minimal design */}
      <section className="py-6 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            {/* Theme Filters */}
            <div>
              <h3 className="text-liberation-sovereignty-gold font-semibold text-sm mb-3 uppercase tracking-wide">Themes</h3>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedTheme === theme
                        ? 'bg-liberation-sovereignty-gold text-black'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {theme === 'all' ? 'All Stories' : theme.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Type Filters */}
            <div>
              <h3 className="text-liberation-sovereignty-gold font-semibold text-sm mb-3 uppercase tracking-wide">Content Type</h3>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedContentType(type)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedContentType === type
                        ? 'bg-liberation-sovereignty-gold text-black'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {getContentTypeIcon(type)}
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid - Vox-Inspired Layout */}
      <main className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            /* Loading State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredStories.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-liberation-sovereignty-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-liberation-sovereignty-gold" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Story Archive Coming Soon</h2>
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                We're preparing the migration of 270+ stories from blkoutuk.com. This archive will preserve our community's rich history.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-2xl mx-auto">
                <h3 className="text-liberation-sovereignty-gold font-semibold text-base mb-4">Migration In Progress</h3>
                <div className="text-gray-300 text-sm space-y-2">
                  <div>→ Preserving original publication dates and author credits</div>
                  <div>→ Migrating multimedia content (audio, video, galleries)</div>
                  <div>→ Maintaining blkoutuk.com theme categorization</div>
                  <div>→ Creating enhanced reading, listening, and viewing experiences</div>
                  <div>→ Building connections to current platform features</div>
                </div>
              </div>
            </div>
          ) : (
            /* Vox-Inspired Stories Layout */
            <div className="space-y-8">
              {/* Featured Story (if any) */}
              {featuredStory && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="h-5 w-5 text-liberation-sovereignty-gold" />
                    <h2 className="text-lg font-bold text-liberation-sovereignty-gold uppercase tracking-wide">Featured Story</h2>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-liberation-sovereignty-gold/30 transition-all duration-300 group cursor-pointer"
                       onClick={() => loadStoryDetail(featuredStory.id)}>
                    <div className="p-8">
                      {/* Content Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-liberation-sovereignty-gold text-black px-3 py-1 rounded-full font-semibold">
                            {featuredStory.blkoutTheme?.toUpperCase() || featuredStory.category.toUpperCase()}
                          </span>
                          {featuredStory.contentType && featuredStory.contentType !== 'article' && (
                            <div className="flex items-center gap-2 text-liberation-sovereignty-gold text-sm">
                              {getContentTypeIcon(featuredStory.contentType)}
                              <span className="capitalize font-medium">{featuredStory.contentType}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-gray-400 text-sm">{featuredStory.readTime}</span>
                      </div>

                      <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-liberation-sovereignty-gold transition-colors leading-tight">
                        {featuredStory.title}
                      </h2>

                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        {featuredStory.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>By {featuredStory.author}</span>
                          <span>•</span>
                          <span>{formatDate(featuredStory.publishedAt)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-liberation-sovereignty-gold text-sm font-medium">Read Story</span>
                          <ArrowRight className="h-5 w-5 text-liberation-sovereignty-gold group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Stories Grid */}
              <div>
                <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wide">Story Archive</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularStories.map((story) => (
                    <article
                      key={story.id}
                      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-liberation-sovereignty-gold/30 transition-all duration-300 group cursor-pointer"
                      onClick={() => loadStoryDetail(story.id)}
                    >
                      <div className="p-6">
                        {/* Story Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-liberation-sovereignty-gold/20 text-liberation-sovereignty-gold px-2 py-1 rounded font-medium">
                              {story.blkoutTheme?.toUpperCase() || story.category.toUpperCase()}
                            </span>
                          </div>

                          {/* Content Type Indicator */}
                          {story.contentType && story.contentType !== 'article' && (
                            <div className="flex items-center gap-1 text-liberation-sovereignty-gold text-sm">
                              {getContentTypeIcon(story.contentType)}
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-liberation-sovereignty-gold transition-colors line-clamp-2 leading-tight">
                          {story.title}
                        </h3>

                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                          {story.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>By {story.author}</span>
                            <span>•</span>
                            <span>{formatDate(story.publishedAt)}</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{story.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-8">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === index + 1
                            ? 'bg-liberation-sovereignty-gold text-black'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StoryArchive;