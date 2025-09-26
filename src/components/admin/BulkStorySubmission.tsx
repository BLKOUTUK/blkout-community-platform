// BLKOUT Liberation Platform - Bulk Story Submission Interface
// Layer 1: Community Frontend Presentation Layer
// For community curators to submit multiple stories efficiently

import React, { useState, useEffect } from 'react';
import { Upload, Plus, X, CheckCircle, AlertTriangle, FileText, Link, Globe, Tag, User, Calendar, MapPin } from 'lucide-react';
import { LiberationButton } from '@/components/ui/liberation-button';
import { cn, liberationColors, traumaInformedUtils } from '@/lib/liberation-utils';
import { communityAPI } from '@/services/community-api';
import VideoHero from '@/components/ui/VideoHero';

interface StorySubmission {
  id: string;
  title: string;
  excerpt: string;
  originalUrl: string;
  sourceName: string;
  category: string;
  tags: string[];
  contentType: 'article' | 'event' | 'story';
  eventData?: {
    date?: string;
    location?: string;
    capacity?: number;
  };
  extractedImages?: string[];
  status: 'draft' | 'submitting' | 'submitted' | 'error';
  errorMessage?: string;
}

interface BulkStorySubmissionProps {
  curatorId: string;
  onSubmissionComplete?: (submittedStories: number) => void;
  className?: string;
}

export const BulkStorySubmission: React.FC<BulkStorySubmissionProps> = ({
  curatorId,
  onSubmissionComplete,
  className
}) => {
  const [stories, setStories] = useState<StorySubmission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResults, setSubmissionResults] = useState<{
    successful: number;
    failed: number;
    total: number;
  } | null>(null);

  // Add new story form
  const addNewStory = () => {
    const newStory: StorySubmission = {
      id: `story_${Date.now()}`,
      title: '',
      excerpt: '',
      originalUrl: '',
      sourceName: '',
      category: 'community',
      tags: [],
      contentType: 'article',
      status: 'draft'
    };
    setStories(prev => [...prev, newStory]);
  };

  // Remove story from list
  const removeStory = (id: string) => {
    setStories(prev => prev.filter(story => story.id !== id));
  };

  // Update story data
  const updateStory = (id: string, updates: Partial<StorySubmission>) => {
    setStories(prev => prev.map(story =>
      story.id === id ? { ...story, ...updates } : story
    ));
  };

  // Auto-extract content from URL
  const extractFromUrl = async (id: string, url: string) => {
    if (!url) return;

    updateStory(id, { status: 'submitting' });

    try {
      // Simulate URL analysis (in real implementation, this would call a service)
      // For demo purposes, extract basic info from URL
      const urlObj = new URL(url);
      const sourceName = urlObj.hostname.replace('www.', '');
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      const title = pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') || 'Extracted Article';

      updateStory(id, {
        originalUrl: url,
        sourceName: sourceName.charAt(0).toUpperCase() + sourceName.slice(1),
        title: title.charAt(0).toUpperCase() + title.slice(1),
        excerpt: `Content extracted from ${sourceName}`,
        status: 'draft'
      });
    } catch (error) {
      updateStory(id, {
        status: 'error',
        errorMessage: 'Invalid URL or extraction failed'
      });
    }
  };

  // Submit all stories
  const submitAllStories = async () => {
    if (stories.length === 0) return;

    setIsSubmitting(true);
    setSubmissionResults(null);

    let successful = 0;
    let failed = 0;

    for (const story of stories) {
      if (story.status === 'submitted') continue;

      updateStory(story.id, { status: 'submitting' });

      try {
        const result = await communityAPI.submitStoryFromExtension({
          title: story.title,
          excerpt: story.excerpt,
          originalUrl: story.originalUrl,
          sourceName: story.sourceName,
          category: story.category,
          tags: story.tags,
          curatorId,
          contentType: story.contentType,
          eventData: story.eventData,
          extractedImages: story.extractedImages,
        });

        if (result.success) {
          updateStory(story.id, { status: 'submitted' });
          successful++;
        } else {
          updateStory(story.id, {
            status: 'error',
            errorMessage: result.message
          });
          failed++;
        }
      } catch (error) {
        updateStory(story.id, {
          status: 'error',
          errorMessage: error instanceof Error ? error.message : 'Submission failed'
        });
        failed++;
      }
    }

    setSubmissionResults({
      successful,
      failed,
      total: stories.length
    });

    setIsSubmitting(false);

    if (onSubmissionComplete) {
      onSubmissionComplete(successful);
    }
  };

  // Import from CSV/JSON
  const importStories = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedData: any[] = [];

        if (file.name.endsWith('.json')) {
          importedData = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          // Basic CSV parsing (in production, use proper CSV library)
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          importedData = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || '';
            });
            return obj;
          });
        }

        const newStories: StorySubmission[] = importedData.map((item, index) => ({
          id: `imported_${Date.now()}_${index}`,
          title: item.title || item.Title || '',
          excerpt: item.excerpt || item.Excerpt || item.description || '',
          originalUrl: item.url || item.URL || item.originalUrl || '',
          sourceName: item.source || item.Source || item.sourceName || '',
          category: item.category || item.Category || 'community',
          tags: typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : [],
          contentType: item.contentType || 'article',
          status: 'draft'
        }));

        setStories(prev => [...prev, ...newStories]);
      } catch (error) {
        console.error('Import failed:', error);
      }
    };
    reader.readAsText(file);
  };

  const renderStoryForm = (story: StorySubmission, index: number) => (
    <div
      key={story.id}
      className={cn(
        'p-6 rounded-lg border-2 transition-all duration-200',
        story.status === 'submitted' ? 'border-green-200 bg-green-50' :
        story.status === 'error' ? 'border-red-200 bg-red-50' :
        story.status === 'submitting' ? 'border-yellow-200 bg-yellow-50' :
        'border-gray-200 bg-white hover:border-liberation-pride-purple/30'
      )}
    >
      {/* Story Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-500">Story #{index + 1}</span>
          {story.status === 'submitted' && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Submitted</span>
            </div>
          )}
          {story.status === 'error' && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Error</span>
            </div>
          )}
          {story.status === 'submitting' && (
            <div className="flex items-center space-x-1 text-yellow-600">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              <span className="text-sm">Submitting...</span>
            </div>
          )}
        </div>
        <LiberationButton
          variant="danger"
          size="sm"
          onClick={() => removeStory(story.id)}
          disabled={story.status === 'submitting'}
        >
          <X className="h-4 w-4" />
        </LiberationButton>
      </div>

      {/* Error Message */}
      {story.status === 'error' && story.errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
          {story.errorMessage}
        </div>
      )}

      {/* URL Input with Auto-Extract */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Link className="h-4 w-4 inline mr-1" />
            Article URL
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={story.originalUrl}
              onChange={(e) => updateStory(story.id, { originalUrl: e.target.value })}
              onBlur={() => extractFromUrl(story.id, story.originalUrl)}
              placeholder="https://example.com/article"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
              disabled={story.status === 'submitting'}
            />
            <LiberationButton
              variant="secondary"
              size="sm"
              onClick={() => extractFromUrl(story.id, story.originalUrl)}
              disabled={!story.originalUrl || story.status === 'submitting'}
            >
              Extract
            </LiberationButton>
          </div>
        </div>
      </div>

      {/* Story Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 inline mr-1" />
            Title
          </label>
          <input
            type="text"
            value={story.title}
            onChange={(e) => updateStory(story.id, { title: e.target.value })}
            placeholder="Article title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
            disabled={story.status === 'submitting'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="h-4 w-4 inline mr-1" />
            Source
          </label>
          <input
            type="text"
            value={story.sourceName}
            onChange={(e) => updateStory(story.id, { sourceName: e.target.value })}
            placeholder="Publication name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
            disabled={story.status === 'submitting'}
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt/Summary
        </label>
        <textarea
          value={story.excerpt}
          onChange={(e) => updateStory(story.id, { excerpt: e.target.value })}
          placeholder="Brief description of the article content"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
          disabled={story.status === 'submitting'}
        />
      </div>

      {/* Category and Content Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={story.category}
            onChange={(e) => updateStory(story.id, { category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
            disabled={story.status === 'submitting'}
          >
            <option value="community">Community</option>
            <option value="liberation">Liberation</option>
            <option value="culture">Culture</option>
            <option value="politics">Politics</option>
            <option value="health">Health</option>
            <option value="economics">Economics</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
          <select
            value={story.contentType}
            onChange={(e) => updateStory(story.id, { contentType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
            disabled={story.status === 'submitting'}
          >
            <option value="article">Article</option>
            <option value="event">Event</option>
            <option value="story">Story</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="h-4 w-4 inline mr-1" />
            Tags
          </label>
          <input
            type="text"
            value={story.tags.join(', ')}
            onChange={(e) => updateStory(story.id, {
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })}
            placeholder="liberation, community, mutual-aid"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
            disabled={story.status === 'submitting'}
          />
        </div>
      </div>

      {/* Event-specific fields */}
      {story.contentType === 'event' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Event Date
            </label>
            <input
              type="datetime-local"
              value={story.eventData?.date || ''}
              onChange={(e) => updateStory(story.id, {
                eventData: { ...story.eventData, date: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
              disabled={story.status === 'submitting'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              value={story.eventData?.location || ''}
              onChange={(e) => updateStory(story.id, {
                eventData: { ...story.eventData, location: e.target.value }
              })}
              placeholder="Event location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
              disabled={story.status === 'submitting'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Capacity
            </label>
            <input
              type="number"
              value={story.eventData?.capacity || ''}
              onChange={(e) => updateStory(story.id, {
                eventData: { ...story.eventData, capacity: parseInt(e.target.value) || undefined }
              })}
              placeholder="Max attendees"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
              disabled={story.status === 'submitting'}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn('space-y-8', className)}>
      {/* Hero Section */}
      <VideoHero
        title="BULK STORY SUBMISSION"
        subtitle="Community curator content management"
        description="Submit multiple stories, articles, and events efficiently. Help build our community knowledge base by curating content from across the liberation movement."
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

      {/* Main Interface */}
      <div className="space-y-6">
        {/* Import and Add Controls */}
        <div className="flex flex-col gap-4 p-6 bg-white rounded-lg border-2 border-liberation-pride-purple/20">
          <div>
            <h2 className="text-xl font-semibold text-liberation-pride-purple mb-2">
              Story Submission Interface
            </h2>
            <p className="text-gray-600 mb-4">
              Add stories individually or import from CSV/JSON files. Download template for correct format.
            </p>
          </div>

          {/* Template Downloads */}
          <div className="flex flex-wrap gap-3 mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Download CSV Templates:</span>
            </div>
            <a
              href="/templates/story-submission-template.csv"
              download="story-submission-template.csv"
              className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded transition-colors"
            >
              <FileText className="h-3 w-3" />
              Stories Template
            </a>
            <div className="text-xs text-yellow-700">
              Templates include example data with source URLs for reference
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <input
              type="file"
              accept=".csv,.json"
              onChange={importStories}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file">
              <LiberationButton variant="secondary" size="sm" as="span">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV/JSON
              </LiberationButton>
            </label>
            <LiberationButton
              variant="community-engagement"
              size="sm"
              onClick={addNewStory}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </LiberationButton>
          </div>
        </div>

        {/* Stories List */}
        {stories.length > 0 && (
          <div className="space-y-4">
            {stories.map((story, index) => renderStoryForm(story, index))}
          </div>
        )}

        {/* Empty State */}
        {stories.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Stories Added Yet</h3>
            <p className="text-gray-500 mb-4">
              Start by adding a story manually or importing from a CSV/JSON file.
            </p>
            <LiberationButton onClick={addNewStory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Story
            </LiberationButton>
          </div>
        )}

        {/* Submission Controls */}
        {stories.length > 0 && (
          <div className="flex justify-between items-center p-6 bg-white rounded-lg border-2 border-liberation-pride-purple/20">
            <div>
              <h3 className="text-lg font-semibold text-liberation-pride-purple mb-1">
                Ready to Submit {stories.length} {stories.length === 1 ? 'Story' : 'Stories'}
              </h3>
              <p className="text-gray-600">
                Stories will be sent to the moderation queue for review
              </p>
            </div>
            <div className="flex gap-3">
              <LiberationButton
                variant="secondary"
                onClick={() => setStories([])}
                disabled={isSubmitting}
              >
                Clear All
              </LiberationButton>
              <LiberationButton
                onClick={submitAllStories}
                disabled={isSubmitting || stories.every(s => s.status === 'submitted')}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit All Stories
                  </>
                )}
              </LiberationButton>
            </div>
          </div>
        )}

        {/* Submission Results */}
        {submissionResults && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-800">
                Submission Complete
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {submissionResults.successful}
                </div>
                <div className="text-sm text-green-700">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {submissionResults.failed}
                </div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {submissionResults.total}
                </div>
                <div className="text-sm text-gray-700">Total</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
