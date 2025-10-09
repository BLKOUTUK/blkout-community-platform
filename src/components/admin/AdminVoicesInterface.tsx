// BLKOUT Liberation Platform - Voices Admin Interface
// Article pitch review, staging, and content management

import React, { useState, useEffect } from 'react';
import {
  PenTool, FileText, Eye, EyeOff, CheckCircle, XCircle, Star, Upload, Edit3, Trash2,
  Clock, User, Calendar, Tag, AlertCircle, Send, Save, ExternalLink, ArrowRight, Plus
} from 'lucide-react';
import { voicesAPI, type VoicesArticle, type VoicesArticleSubmission } from '@/services/voices-api';
import { liberationDB } from '@/lib/supabase';

interface ArticlePitch {
  id: string;
  name: string;
  email: string;
  title: string;
  category: string;
  pitch: string;
  word_count: number | null;
  deadline: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  submitted_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
}

interface VoicesStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  featuredArticles: number;
  pendingPitches: number;
  approvedPitches: number;
}

export const AdminVoicesInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pitches' | 'articles' | 'editor'>('pitches');
  const [stats, setStats] = useState<VoicesStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    featuredArticles: 0,
    pendingPitches: 0,
    approvedPitches: 0,
  });

  // Pitch Management State
  const [pitches, setPitches] = useState<ArticlePitch[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<ArticlePitch | null>(null);
  const [pitchFilter, setPitchFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Article Management State
  const [articles, setArticles] = useState<VoicesArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<VoicesArticle | null>(null);
  const [articleFilter, setArticleFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Editor State
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [editorArticle, setEditorArticle] = useState<Partial<VoicesArticleSubmission>>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: 'opinion',
    tags: [],
    featured: false,
    published: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load data on mount and when filters change
  useEffect(() => {
    loadStats();
    loadPitches();
    loadArticles();
  }, []);

  const loadStats = async () => {
    try {
      const articleStats = await voicesAPI.getArticleStats();
      const { data: pitchData } = await liberationDB
        .from('article_pitches')
        .select('status');

      const pendingPitches = pitchData?.filter(p => p.status === 'pending').length || 0;
      const approvedPitches = pitchData?.filter(p => p.status === 'approved').length || 0;

      setStats({
        ...articleStats,
        pendingPitches,
        approvedPitches,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadPitches = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await liberationDB
        .from('article_pitches')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPitches(data || []);
    } catch (err) {
      setError('Failed to load pitches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await voicesAPI.getAllArticles();
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePitchReview = async (pitchId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error: updateError } = await liberationDB
        .from('article_pitches')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: notes,
        })
        .eq('id', pitchId);

      if (updateError) throw updateError;

      setSuccess(`Pitch ${status} successfully`);
      loadPitches();
      loadStats();
      setSelectedPitch(null);
    } catch (err) {
      setError(`Failed to ${status} pitch`);
      console.error(err);
    }
  };

  const handleCreateFromPitch = (pitch: ArticlePitch) => {
    setEditorMode('create');
    setEditorArticle({
      title: pitch.title,
      content: `# ${pitch.title}\n\n${pitch.pitch}\n\n## Introduction\n\n[Write your introduction here]\n\n## Main Content\n\n[Develop your article here]`,
      excerpt: pitch.pitch.substring(0, 200) + '...',
      author: pitch.name,
      category: pitch.category as any,
      tags: [],
      featured: false,
      published: false,
    });
    setActiveTab('editor');
  };

  const handleSaveArticle = async () => {
    setLoading(true);
    try {
      if (editorMode === 'create') {
        // Generate slug from title
        const slug = editorArticle.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';

        await voicesAPI.createArticle({
          ...editorArticle as VoicesArticleSubmission,
          slug,
        });
        setSuccess('Article created successfully');
      } else if (selectedArticle) {
        await voicesAPI.updateArticle(selectedArticle.id, editorArticle);
        setSuccess('Article updated successfully');
      }

      loadArticles();
      loadStats();
      setActiveTab('articles');
      resetEditor();
    } catch (err) {
      setError('Failed to save article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (articleId: string, currentStatus: boolean) => {
    try {
      await voicesAPI.togglePublished(articleId, !currentStatus);
      setSuccess(`Article ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      loadArticles();
      loadStats();
    } catch (err) {
      setError('Failed to toggle publish status');
      console.error(err);
    }
  };

  const handleFeaturedToggle = async (articleId: string, currentStatus: boolean) => {
    try {
      await voicesAPI.toggleFeatured(articleId, !currentStatus);
      setSuccess(`Article ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
      loadArticles();
      loadStats();
    } catch (err) {
      setError('Failed to toggle featured status');
      console.error(err);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      await voicesAPI.deleteArticle(articleId);
      setSuccess('Article deleted successfully');
      loadArticles();
      loadStats();
    } catch (err) {
      setError('Failed to delete article');
      console.error(err);
    }
  };

  const handleEditArticle = (article: VoicesArticle) => {
    setSelectedArticle(article);
    setEditorMode('edit');
    setEditorArticle({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      tags: article.tags,
      featured: article.featured,
      published: article.published,
      hero_image: article.hero_image,
      hero_image_alt: article.hero_image_alt,
      thumbnail_image: article.thumbnail_image,
      thumbnail_alt: article.thumbnail_alt,
    });
    setActiveTab('editor');
  };

  const resetEditor = () => {
    setEditorArticle({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      category: 'opinion',
      tags: [],
      featured: false,
      published: false,
    });
    setSelectedArticle(null);
    setEditorMode('create');
  };

  const filteredPitches = pitches.filter(pitch => {
    if (pitchFilter === 'all') return true;
    return pitch.status === pitchFilter;
  });

  const filteredArticles = articles.filter(article => {
    if (articleFilter === 'all') return true;
    if (articleFilter === 'published') return article.published;
    if (articleFilter === 'draft') return !article.published;
    return true;
  });

  // Dismiss notifications after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-liberation-black-power text-liberation-silver">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-black to-purple-900 border-b border-liberation-silver/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-liberation-gold-divine mb-2">
                Voices Admin
              </h1>
              <p className="text-liberation-silver/70">
                Manage article pitches, review content, and publish voices
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  resetEditor();
                  setActiveTab('editor');
                }}
                className="flex items-center gap-2 bg-liberation-gold-divine text-liberation-black-power px-6 py-3 rounded-lg font-bold hover:bg-liberation-gold-divine/90 transition-colors"
              >
                <Plus className="h-5 w-5" />
                New Article
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-green-300">{success}</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-liberation-silver/10 rounded-lg p-6 border border-liberation-silver/20">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-liberation-gold-divine">
              {stats.totalArticles}
            </div>
            <div className="text-sm text-liberation-silver/70">Total Articles</div>
          </div>

          <div className="bg-liberation-silver/10 rounded-lg p-6 border border-liberation-silver/20">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-liberation-gold-divine">
              {stats.publishedArticles}
            </div>
            <div className="text-sm text-liberation-silver/70">Published</div>
          </div>

          <div className="bg-liberation-silver/10 rounded-lg p-6 border border-liberation-silver/20">
            <div className="flex items-center justify-between mb-2">
              <Edit3 className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-liberation-gold-divine">
              {stats.draftArticles}
            </div>
            <div className="text-sm text-liberation-silver/70">Drafts</div>
          </div>

          <div className="bg-liberation-silver/10 rounded-lg p-6 border border-liberation-silver/20">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-liberation-gold-divine">
              {stats.featuredArticles}
            </div>
            <div className="text-sm text-liberation-silver/70">Featured</div>
          </div>

          <div className="bg-liberation-silver/10 rounded-lg p-6 border border-liberation-silver/20">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-liberation-gold-divine">
              {stats.pendingPitches}
            </div>
            <div className="text-sm text-liberation-silver/70">Pending Pitches</div>
          </div>

          <div className="bg-liberation-silver/10 rounded-lg p-6 border border-liberation-silver/20">
            <div className="flex items-center justify-between mb-2">
              <PenTool className="h-6 w-6 text-pink-400" />
            </div>
            <div className="text-3xl font-bold text-liberation-gold-divine">
              {stats.approvedPitches}
            </div>
            <div className="text-sm text-liberation-silver/70">Approved Pitches</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 border-b border-liberation-silver/20">
          <button
            onClick={() => setActiveTab('pitches')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'pitches'
                ? 'text-liberation-gold-divine border-b-2 border-liberation-gold-divine'
                : 'text-liberation-silver/70 hover:text-liberation-silver'
            }`}
          >
            Pitch Staging
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'articles'
                ? 'text-liberation-gold-divine border-b-2 border-liberation-gold-divine'
                : 'text-liberation-silver/70 hover:text-liberation-silver'
            }`}
          >
            Article Management
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'editor'
                ? 'text-liberation-gold-divine border-b-2 border-liberation-gold-divine'
                : 'text-liberation-silver/70 hover:text-liberation-silver'
            }`}
          >
            Article Editor
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pitch Staging Tab */}
        {activeTab === 'pitches' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-liberation-gold-divine">Article Pitches</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPitchFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    pitchFilter === 'all'
                      ? 'bg-liberation-gold-divine text-liberation-black-power'
                      : 'bg-liberation-silver/10 text-liberation-silver hover:bg-liberation-silver/20'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setPitchFilter('pending')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    pitchFilter === 'pending'
                      ? 'bg-liberation-gold-divine text-liberation-black-power'
                      : 'bg-liberation-silver/10 text-liberation-silver hover:bg-liberation-silver/20'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setPitchFilter('approved')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    pitchFilter === 'approved'
                      ? 'bg-liberation-gold-divine text-liberation-black-power'
                      : 'bg-liberation-silver/10 text-liberation-silver hover:bg-liberation-silver/20'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setPitchFilter('rejected')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    pitchFilter === 'rejected'
                      ? 'bg-liberation-gold-divine text-liberation-black-power'
                      : 'bg-liberation-silver/10 text-liberation-silver hover:bg-liberation-silver/20'
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-liberation-gold-divine mx-auto mb-6"></div>
                <p className="text-liberation-silver">Loading pitches...</p>
              </div>
            ) : filteredPitches.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="h-20 w-20 text-liberation-silver/40 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-liberation-silver mb-4">No pitches found</h3>
                <p className="text-liberation-silver/70">
                  {pitchFilter === 'pending'
                    ? 'No pending pitches to review at the moment.'
                    : `No ${pitchFilter} pitches to display.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPitches.map((pitch) => (
                  <div
                    key={pitch.id}
                    className="bg-liberation-silver/10 rounded-lg p-6 border border-liberation-silver/20 hover:border-liberation-gold-divine/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-liberation-gold-divine mb-2">
                          {pitch.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-liberation-silver/70">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {pitch.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(pitch.submitted_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        pitch.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        pitch.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        pitch.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {pitch.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-liberation-silver/80 mb-2">
                        <span className="font-semibold">Category:</span> {pitch.category}
                      </p>
                      {pitch.word_count && (
                        <p className="text-sm text-liberation-silver/80 mb-2">
                          <span className="font-semibold">Target Word Count:</span> {pitch.word_count}
                        </p>
                      )}
                      {pitch.deadline && (
                        <p className="text-sm text-liberation-silver/80 mb-2">
                          <span className="font-semibold">Deadline:</span> {new Date(pitch.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="mb-4 p-4 bg-liberation-black-power/50 rounded-lg">
                      <p className="text-sm text-liberation-silver leading-relaxed">
                        {pitch.pitch}
                      </p>
                    </div>

                    {pitch.reviewer_notes && (
                      <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-yellow-300">
                          <span className="font-semibold">Reviewer Notes:</span> {pitch.reviewer_notes}
                        </p>
                      </div>
                    )}

                    {pitch.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePitchReview(pitch.id, 'approved')}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg font-semibold hover:bg-green-500/30 transition-colors border border-green-500/30"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handlePitchReview(pitch.id, 'rejected')}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}

                    {pitch.status === 'approved' && (
                      <button
                        onClick={() => handleCreateFromPitch(pitch)}
                        className="w-full flex items-center justify-center gap-2 bg-liberation-gold-divine text-liberation-black-power px-4 py-2 rounded-lg font-semibold hover:bg-liberation-gold-divine/90 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        Create Article
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Article Management Tab */}
        {activeTab === 'articles' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-liberation-gold-divine">Published Articles</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setArticleFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    articleFilter === 'all'
                      ? 'bg-liberation-gold-divine text-liberation-black-power'
                      : 'bg-liberation-silver/10 text-liberation-silver hover:bg-liberation-silver/20'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setArticleFilter('published')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    articleFilter === 'published'
                      ? 'bg-liberation-gold-divine text-liberation-black-power'
                      : 'bg-liberation-silver/10 text-liberation-silver hover:bg-liberation-silver/20'
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => setArticleFilter('draft')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    articleFilter === 'draft'
                      ? 'bg-liberation-gold-divine text-liberation-black-power'
                      : 'bg-liberation-silver/10 text-liberation-silver hover:bg-liberation-silver/20'
                  }`}
                >
                  Drafts
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-liberation-gold-divine mx-auto mb-6"></div>
                <p className="text-liberation-silver">Loading articles...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <PenTool className="h-20 w-20 text-liberation-silver/40 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-liberation-silver mb-4">No articles found</h3>
                <p className="text-liberation-silver/70">
                  {articleFilter === 'draft'
                    ? 'No draft articles at the moment.'
                    : `No ${articleFilter} articles to display.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-liberation-silver/10 rounded-lg p-6 border border-liberation-silver/20 hover:border-liberation-gold-divine/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {(article.thumbnail_image || article.hero_image) && (
                        <img
                          src={article.thumbnail_image || article.hero_image}
                          alt={article.thumbnail_alt || article.hero_image_alt || article.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      )}

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-liberation-gold-divine mb-1">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-liberation-silver/70 mb-2">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {article.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(article.published_at || article.created_at).toLocaleDateString()}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                                article.category === 'opinion' ? 'bg-blue-500/20 text-blue-300' :
                                article.category === 'analysis' ? 'bg-green-500/20 text-green-300' :
                                article.category === 'editorial' ? 'bg-red-500/20 text-red-300' :
                                article.category === 'community' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-purple-500/20 text-purple-300'
                              }`}>
                                {article.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {article.featured && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-semibold border border-yellow-500/30">
                                <Star className="h-3 w-3" />
                                Featured
                              </span>
                            )}
                            {article.published ? (
                              <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-semibold border border-green-500/30">
                                <CheckCircle className="h-3 w-3" />
                                Published
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs font-semibold border border-gray-500/30">
                                <Edit3 className="h-3 w-3" />
                                Draft
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-liberation-silver/80 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        {article.tags && article.tags.length > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            <Tag className="h-4 w-4 text-liberation-silver/50" />
                            <div className="flex flex-wrap gap-2">
                              {article.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-liberation-silver/10 rounded text-xs text-liberation-silver/70"
                                >
                                  {tag}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="px-2 py-1 bg-liberation-silver/10 rounded text-xs text-liberation-silver/70">
                                  +{article.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg font-semibold hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => handlePublishToggle(article.id, article.published)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors border ${
                              article.published
                                ? 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 border-gray-500/30'
                                : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/30'
                            }`}
                          >
                            {article.published ? (
                              <>
                                <EyeOff className="h-4 w-4" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Publish
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleFeaturedToggle(article.id, article.featured)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors border ${
                              article.featured
                                ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border-yellow-500/30'
                                : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 border-gray-500/30'
                            }`}
                          >
                            <Star className="h-4 w-4" />
                            {article.featured ? 'Unfeature' : 'Feature'}
                          </button>

                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>

                          {article.published && (
                            <a
                              href={`/voices/${article.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-liberation-silver/10 text-liberation-silver px-4 py-2 rounded-lg font-semibold hover:bg-liberation-silver/20 transition-colors border border-liberation-silver/20"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Article Editor Tab */}
        {activeTab === 'editor' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-liberation-gold-divine">
                {editorMode === 'create' ? 'Create New Article' : 'Edit Article'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={resetEditor}
                  className="px-4 py-2 bg-liberation-silver/10 text-liberation-silver rounded-lg font-semibold hover:bg-liberation-silver/20 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleSaveArticle}
                  disabled={loading || !editorArticle.title || !editorArticle.content}
                  className="flex items-center gap-2 bg-liberation-gold-divine text-liberation-black-power px-6 py-2 rounded-lg font-semibold hover:bg-liberation-gold-divine/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : editorMode === 'create' ? 'Create Article' : 'Update Article'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-liberation-silver mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editorArticle.title || ''}
                  onChange={(e) => setEditorArticle({ ...editorArticle, title: e.target.value })}
                  placeholder="Enter article title"
                  className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver placeholder-liberation-silver/50 focus:outline-none focus:border-liberation-gold-divine transition-colors"
                />
              </div>

              {/* Author & Category */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-liberation-silver mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={editorArticle.author || ''}
                    onChange={(e) => setEditorArticle({ ...editorArticle, author: e.target.value })}
                    placeholder="Enter author name"
                    className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver placeholder-liberation-silver/50 focus:outline-none focus:border-liberation-gold-divine transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-liberation-silver mb-2">
                    Category *
                  </label>
                  <select
                    value={editorArticle.category || 'opinion'}
                    onChange={(e) => setEditorArticle({ ...editorArticle, category: e.target.value as any })}
                    className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver focus:outline-none focus:border-liberation-gold-divine transition-colors"
                  >
                    <option value="opinion">Opinion</option>
                    <option value="analysis">Analysis</option>
                    <option value="editorial">Editorial</option>
                    <option value="community">Community Voice</option>
                    <option value="liberation">Liberation Thought</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-liberation-silver mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={editorArticle.excerpt || ''}
                  onChange={(e) => setEditorArticle({ ...editorArticle, excerpt: e.target.value })}
                  placeholder="Enter a brief excerpt or summary (150-200 characters)"
                  rows={3}
                  className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver placeholder-liberation-silver/50 focus:outline-none focus:border-liberation-gold-divine transition-colors resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-liberation-silver mb-2">
                  Content *
                </label>
                <textarea
                  value={editorArticle.content || ''}
                  onChange={(e) => setEditorArticle({ ...editorArticle, content: e.target.value })}
                  placeholder="Write your article content here. Use markdown formatting:&#10;# Heading 1&#10;## Heading 2&#10;### Heading 3&#10;&#10;Regular paragraph text."
                  rows={20}
                  className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver placeholder-liberation-silver/50 focus:outline-none focus:border-liberation-gold-divine transition-colors resize-none font-mono"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-liberation-silver mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editorArticle.tags?.join(', ') || ''}
                  onChange={(e) => setEditorArticle({
                    ...editorArticle,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. liberation, community, activism"
                  className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver placeholder-liberation-silver/50 focus:outline-none focus:border-liberation-gold-divine transition-colors"
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-liberation-silver mb-2">
                    Hero Image URL
                  </label>
                  <input
                    type="url"
                    value={editorArticle.hero_image || ''}
                    onChange={(e) => setEditorArticle({ ...editorArticle, hero_image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver placeholder-liberation-silver/50 focus:outline-none focus:border-liberation-gold-divine transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-liberation-silver mb-2">
                    Hero Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={editorArticle.hero_image_alt || ''}
                    onChange={(e) => setEditorArticle({ ...editorArticle, hero_image_alt: e.target.value })}
                    placeholder="Descriptive alt text"
                    className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver placeholder-liberation-silver/50 focus:outline-none focus:border-liberation-gold-divine transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-liberation-silver mb-2">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={editorArticle.thumbnail_image || ''}
                    onChange={(e) => setEditorArticle({ ...editorArticle, thumbnail_image: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver placeholder-liberation-silver/50 focus:outline-none focus:border-liberation-gold-divine transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-liberation-silver mb-2">
                    Thumbnail Alt Text
                  </label>
                  <input
                    type="text"
                    value={editorArticle.thumbnail_alt || ''}
                    onChange={(e) => setEditorArticle({ ...editorArticle, thumbnail_alt: e.target.value })}
                    placeholder="Descriptive alt text"
                    className="w-full px-4 py-3 bg-liberation-silver/10 border border-liberation-silver/20 rounded-lg text-liberation-silver placeholder-liberation-silver/50 focus:outline-none focus:border-liberation-gold-divine transition-colors"
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editorArticle.featured || false}
                    onChange={(e) => setEditorArticle({ ...editorArticle, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-liberation-silver/20 bg-liberation-silver/10 text-liberation-gold-divine focus:ring-liberation-gold-divine focus:ring-offset-0"
                  />
                  <span className="text-sm font-semibold text-liberation-silver">
                    Feature this article
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editorArticle.published || false}
                    onChange={(e) => setEditorArticle({ ...editorArticle, published: e.target.checked })}
                    className="w-5 h-5 rounded border-liberation-silver/20 bg-liberation-silver/10 text-liberation-gold-divine focus:ring-liberation-gold-divine focus:ring-offset-0"
                  />
                  <span className="text-sm font-semibold text-liberation-silver">
                    Publish immediately
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVoicesInterface;
