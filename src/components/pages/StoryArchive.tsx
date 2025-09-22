import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, BookOpen, Tag, Clock, User, Calendar } from 'lucide-react';
import VideoHero from '@/components/ui/VideoHero';
import { storyArchiveAPI, Story } from '@/services/story-archive-api';

const StoryArchive: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStories, setTotalStories] = useState(0);

  const storiesPerPage = 12;

  useEffect(() => {
    loadCategories();
    loadStories();
  }, [searchQuery, selectedCategory, currentPage]);

  const loadCategories = async () => {
    const cats = await storyArchiveAPI.getCategories();
    setCategories(['all', ...cats]);
  };

  const loadStories = async () => {
    setLoading(true);
    try {
      const result = await storyArchiveAPI.searchStories(
        searchQuery,
        selectedCategory,
        currentPage,
        storiesPerPage
      );

      setStories(result.stories);
      setTotalPages(result.totalPages);
      setTotalStories(result.total);
    } finally {
      setLoading(false);
    }
  };

  const loadFullStory = async (storyId: string) => {
    setLoading(true);
    const story = await storyArchiveAPI.getStory(storyId);
    if (story) {
      setSelectedStory(story);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadStories();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Full story view
  if (selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Story Header */}
        <header className="border-b border-liberation-sovereignty-gold/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
            <button
              onClick={() => setSelectedStory(null)}
              className="flex items-center text-gray-400 hover:text-liberation-sovereignty-gold transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Archive
            </button>
          </div>
        </header>

        {/* Story Content */}
        <article className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          {/* Story Meta */}
          <div className="mb-8">
            {selectedStory.category && (
              <span className="inline-block px-3 py-1 bg-liberation-sovereignty-gold/20 text-liberation-sovereignty-gold rounded-full text-sm font-semibold mb-4">
                {selectedStory.category}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              {selectedStory.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              {selectedStory.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedStory.author}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedStory.publishedAt)}</span>
              </div>
              {selectedStory.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedStory.readTime}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {selectedStory.tags && selectedStory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedStory.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          {selectedStory.imageUrl && (
            <img
              src={selectedStory.imageUrl}
              alt={selectedStory.title}
              className="w-full h-auto rounded-2xl mb-8"
            />
          )}

          {/* Story Content */}
          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedStory.content }}
          />

          {/* Original Source Link */}
          {selectedStory.originalUrl && (
            <div className="mt-12 p-6 bg-liberation-sovereignty-gold/10 border border-liberation-sovereignty-gold/20 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">Originally published on blkoutuk.com</p>
              <a
                href={selectedStory.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-liberation-sovereignty-gold hover:underline"
              >
                View original article →
              </a>
            </div>
          )}
        </article>
      </div>
    );
  }

  // Archive listing view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Video Hero */}
      <VideoHero
        title="STORIES"
        subtitle="Your voices, your experiences, your liberation"
        description="270+ stories from the BLKOUT community."
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

      {/* Search and Filters */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-liberation-sovereignty-gold/20">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-liberation-sovereignty-gold focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold/90 text-black rounded-lg font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-liberation-sovereignty-gold text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All Stories' : category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-4 text-sm text-gray-400">
              Found {totalStories} {totalStories === 1 ? 'story' : 'stories'}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </div>
          )}
        </div>
      </section>

      {/* Stories Grid */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-liberation-sovereignty-gold/30 border-t-liberation-sovereignty-gold rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-liberation-sovereignty-gold font-bold">Loading stories...</div>
            </div>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No stories found</h2>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {stories.map((story) => (
                <article
                  key={story.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-liberation-sovereignty-gold/10 hover:border-liberation-sovereignty-gold/30 transition-all duration-300 cursor-pointer group"
                  onClick={() => loadFullStory(story.id)}
                >
                  {story.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {story.category && (
                      <span className="inline-block px-2 py-1 bg-liberation-sovereignty-gold/20 text-liberation-sovereignty-gold rounded text-xs font-semibold mb-3">
                        {story.category}
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-liberation-sovereignty-gold transition-colors">
                      {story.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {story.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        {story.author && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {story.author}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(story.publishedAt)}
                        </span>
                      </div>
                      {story.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {story.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = currentPage - 2 + i;
                    if (page < 1 || page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                          page === currentPage
                            ? 'bg-liberation-sovereignty-gold text-black'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default StoryArchive;