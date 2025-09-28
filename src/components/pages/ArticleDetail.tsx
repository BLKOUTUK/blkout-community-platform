// Article Detail Page - Full article content display
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, User, ExternalLink, Calendar, Tag, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArticleDetailProps {
  articleId: string;
  source: 'news' | 'archive';
  onBack: () => void;
}

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags?: string[];
  originalUrl?: string;
  sourceName?: string;
  imageUrl?: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId, source, onBack }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        // Determine which API endpoint to use based on source
        const endpoint = source === 'news' ? '/api/news' : '/api/stories';

        // First try to get the specific article by searching
        const searchParams = new URLSearchParams({
          search: articleId,
          limit: '100'
        });

        const response = await fetch(`${endpoint}?${searchParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }

        const data = await response.json();

        if (data.success && data.data) {
          const articles = source === 'news' ? data.data.articles : data.data.stories;
          const foundArticle = articles.find((article: any) => article.id === articleId);

          if (foundArticle) {
            setArticle(foundArticle);
          } else {
            setError('Article not found');
          }
        } else {
          setError('Failed to load article');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, source]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 mb-8 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {source === 'news' ? 'News' : 'Archive'}
            </button>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
                Article Not Found
              </h1>
              <p className="text-red-600 dark:text-red-300">
                {error || 'The article you requested could not be found.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Back Navigation */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {source === 'news' ? 'News' : 'Archive'}
          </button>

          {/* Article Header */}
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
                <Tag className="w-3 h-3" />
                {article.category}
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedAt)}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>

              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              {article.originalUrl && article.originalUrl !== '#' && (
                <a
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original
                </a>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {article.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="space-y-6 text-gray-800 dark:text-gray-200 leading-relaxed"
              />
            ) : (
              <div className="space-y-6">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {article.excerpt}
                </p>

                {article.originalUrl && article.originalUrl !== '#' && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6">
                    <p className="text-amber-800 dark:text-amber-200 mb-4">
                      This is a summary of an external article. Read the full piece at the source:
                    </p>
                    <a
                      href={article.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {article.sourceName || 'Read Full Article'}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </div>
  );
};

export default ArticleDetail;