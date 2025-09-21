// BLKOUT Liberation Platform - News Submission Form
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Form UI only - NO business logic

import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/liberation-utils';

interface NewsSubmissionFormProps {
  onSubmit: (formData: NewsFormData) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  traumaInformed: boolean;
  accessibilityFeatures: string[];
}

/**
 * QI COMPLIANCE: News submission form for community content
 * BOUNDARY ENFORCEMENT: Presentation layer only - NO business logic
 * LIBERATION VALUES: Community-centered content creation
 * ACCESSIBILITY: WCAG 3.0 Bronze compliant form design
 */
const NewsSubmissionForm: React.FC<NewsSubmissionFormProps> = ({
  onSubmit,
  onClose,
  isSubmitting = false
}) => {
  // QI COMPLIANCE: Form state for presentation only - NO business logic
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: 'community-news',
    tags: [],
    traumaInformed: true,
    accessibilityFeatures: []
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-liberation-black-power">
            Submit Community News
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="news-title" className="block text-sm font-medium text-gray-700 mb-2">
              Article Title *
            </label>
            <input
              id="news-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-pride-purple"
              required
              placeholder="Enter compelling article title..."
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="news-excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Article Excerpt *
            </label>
            <textarea
              id="news-excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-pride-purple"
              rows={3}
              required
              placeholder="Brief summary of the article..."
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="news-content" className="block text-sm font-medium text-gray-700 mb-2">
              Article Content *
            </label>
            <textarea
              id="news-content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-pride-purple"
              rows={8}
              required
              placeholder="Write your article content here..."
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="news-category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="news-category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-pride-purple"
            >
              <option value="community-news">Community News</option>
              <option value="liberation-action">Liberation Action</option>
              <option value="organizing">Organizing</option>
              <option value="mutual-aid">Mutual Aid</option>
              <option value="celebration">Community Celebration</option>
              <option value="education">Education</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-liberation-pride-purple"
                placeholder="Add tags..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-liberation-pride-purple text-white rounded hover:bg-opacity-90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-liberation-pride-pink bg-opacity-20 text-liberation-pride-purple rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Community Values */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="trauma-informed"
                type="checkbox"
                checked={formData.traumaInformed}
                onChange={(e) => setFormData(prev => ({ ...prev, traumaInformed: e.target.checked }))}
                className="w-4 h-4 text-liberation-pride-purple focus:ring-liberation-pride-purple border-gray-300 rounded"
              />
              <label htmlFor="trauma-informed" className="ml-2 text-sm text-gray-700">
                This content follows trauma-informed principles
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              Content will be reviewed by community moderators
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.content}
                className={cn(
                  "px-6 py-2 rounded-lg flex items-center gap-2",
                  "bg-liberation-pride-purple text-white",
                  "hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Article'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsSubmissionForm;