/**
 * Single Story Submission Component
 * Form for manually submitting individual stories to the moderation queue
 */

import React, { useState } from 'react';
import { communityAPI } from '@/services/community-api';
import { StoryFormData } from '../types';

interface SingleStorySubmissionProps {
  onSubmit: () => void;
}

export const SingleStorySubmission: React.FC<SingleStorySubmissionProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    url: '',
    category: '',
    excerpt: '',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await communityAPI.submitSingleStory({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });

      setFormData({ title: '', url: '', category: '', excerpt: '', tags: '' });
      onSubmit();
    } catch (error) {
      console.error('Failed to submit story:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { value: 'liberation', label: 'Liberation' },
    { value: 'community', label: 'Community' },
    { value: 'culture', label: 'Culture' },
    { value: 'politics', label: 'Politics' },
    { value: 'health', label: 'Health' },
    { value: 'economics', label: 'Economics' },
    { value: 'environment', label: 'Environment' },
    { value: 'technology', label: 'Technology' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Add Single Story</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Story title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="https://..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Brief description of the story..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black font-semibold rounded-lg transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Story'}
        </button>
      </form>
    </div>
  );
};

export default SingleStorySubmission;
