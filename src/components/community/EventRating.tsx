// BLKOUT Liberation Platform - Community Event Rating Interface
// Trauma-informed rating system for community events

import React, { useState, useEffect } from 'react';
import { Star, Heart, Users, Shield, Accessibility, ThumbsUp, MessageCircle, Flag, CheckCircle } from 'lucide-react';
import type { CommunityEvent } from '@/types/liberation';

interface EventRatingProps {
  event: CommunityEvent;
  onRatingUpdate?: (eventId: string, newRating: EventRatingData) => void;
  userRating?: EventRatingData;
  showAggregates?: boolean;
  traumaInformed?: boolean;
}

interface EventRatingData {
  overallRating: number; // 1-5 stars
  aspects: {
    accessibility: number;
    traumaInformed: number;
    organization: number;
    communityValue: number;
    inclusion: number;
  };
  attended: 'yes' | 'no' | 'partial';
  wouldRecommend: boolean;
  feedback?: string;
  helpfulTags?: string[];
  reportConcerns?: boolean;
}

interface AggregateRating {
  totalRatings: number;
  averageRating: number;
  aspectAverages: {
    accessibility: number;
    traumaInformed: number;
    organization: number;
    communityValue: number;
    inclusion: number;
  };
  recommendationRate: number;
  attendanceDistribution: {
    yes: number;
    no: number;
    partial: number;
  };
  topTags: { tag: string; count: number }[];
}

export const EventRating: React.FC<EventRatingProps> = ({
  event,
  onRatingUpdate,
  userRating,
  showAggregates = true,
  traumaInformed = true
}) => {
  const [rating, setRating] = useState<EventRatingData>(
    userRating || {
      overallRating: 0,
      aspects: {
        accessibility: 0,
        traumaInformed: 0,
        organization: 0,
        communityValue: 0,
        inclusion: 0
      },
      attended: 'no',
      wouldRecommend: false,
      helpfulTags: [],
      reportConcerns: false
    }
  );

  const [aggregateRating, setAggregateRating] = useState<AggregateRating>({
    totalRatings: 24,
    averageRating: 4.3,
    aspectAverages: {
      accessibility: 4.1,
      traumaInformed: 4.5,
      organization: 4.2,
      communityValue: 4.6,
      inclusion: 4.4
    },
    recommendationRate: 0.87,
    attendanceDistribution: { yes: 18, no: 4, partial: 2 },
    topTags: [
      { tag: 'welcoming', count: 12 },
      { tag: 'educational', count: 10 },
      { tag: 'accessible', count: 8 },
      { tag: 'healing', count: 6 }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [activeSection, setActiveSection] = useState<'rate' | 'view' | null>(
    userRating ? 'view' : null
  );

  const aspectLabels = {
    accessibility: { label: 'Accessibility', icon: Accessibility, color: 'text-blue-400' },
    traumaInformed: { label: 'Trauma-Informed', icon: Shield, color: 'text-green-400' },
    organization: { label: 'Organization', icon: Users, color: 'text-purple-400' },
    communityValue: { label: 'Community Value', icon: Heart, color: 'text-red-400' },
    inclusion: { label: 'Inclusion', icon: ThumbsUp, color: 'text-yellow-400' }
  };

  const predefinedTags = [
    'welcoming', 'educational', 'accessible', 'healing', 'empowering',
    'well-organized', 'inspiring', 'supportive', 'inclusive', 'transformative',
    'community-centered', 'culturally-affirming', 'practical', 'engaging'
  ];

  const handleOverallRatingChange = (newRating: number) => {
    if (traumaInformed && rating.overallRating > 0) {
      // Gentle confirmation for rating changes
      const confirmed = window.confirm('Would you like to update your rating?');
      if (!confirmed) return;
    }

    setRating(prev => ({ ...prev, overallRating: newRating }));
  };

  const handleAspectRatingChange = (aspect: keyof EventRatingData['aspects'], newRating: number) => {
    setRating(prev => ({
      ...prev,
      aspects: { ...prev.aspects, [aspect]: newRating }
    }));
  };

  const handleTagToggle = (tag: string) => {
    setRating(prev => ({
      ...prev,
      helpfulTags: prev.helpfulTags?.includes(tag)
        ? prev.helpfulTags.filter(t => t !== tag)
        : [...(prev.helpfulTags || []), tag]
    }));
  };

  const handleSubmitRating = async () => {
    if (rating.overallRating === 0) {
      alert('Please provide an overall rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (onRatingUpdate) {
        onRatingUpdate(event.id, rating);
      }

      setShowThankYou(true);
      setActiveSection('view');

      setTimeout(() => setShowThankYou(false), 3000);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating: React.FC<{
    value: number;
    onChange: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
  }> = ({ value, onChange, size = 'md', disabled = false }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            disabled={disabled}
            className={`${sizeClasses[size]} transition-colors ${
              disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Star
              className={`w-full h-full ${
                star <= value ? 'text-yellow-400 fill-current' : 'text-gray-500'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (showThankYou) {
    return (
      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
        <p className="text-green-300">
          Your rating helps build a stronger community. Your feedback matters!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">Community Event Rating</h3>
        <p className="text-gray-300">Share your experience to help future attendees</p>
      </div>

      {/* Toggle between Rate and View */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setActiveSection('rate')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === 'rate'
              ? 'bg-yellow-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {userRating ? 'Update Rating' : 'Rate Event'}
        </button>

        {showAggregates && (
          <button
            onClick={() => setActiveSection('view')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'view'
                ? 'bg-yellow-500 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            View Community Ratings
          </button>
        )}
      </div>

      {/* Rating Form */}
      {activeSection === 'rate' && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 space-y-6">
          {/* Attendance */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Did you attend this event?</label>
            <div className="flex gap-4">
              {(['yes', 'partial', 'no'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRating(prev => ({ ...prev, attended: option }))}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                    rating.attended === option
                      ? 'bg-yellow-500 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {option === 'yes' ? 'Yes, fully' : option === 'partial' ? 'Partially' : 'No, but interested'}
                </button>
              ))}
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Overall Rating</label>
            <div className="flex items-center gap-3">
              <StarRating
                value={rating.overallRating}
                onChange={handleOverallRatingChange}
                size="lg"
              />
              <span className="text-white font-medium">
                {rating.overallRating > 0 ? `${rating.overallRating}/5` : 'Rate this event'}
              </span>
            </div>
          </div>

          {/* Aspect Ratings */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">Rate Specific Aspects</label>
            <div className="space-y-4">
              {Object.entries(aspectLabels).map(([key, { label, icon: Icon, color }]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="text-white font-medium">{label}</span>
                  </div>
                  <StarRating
                    value={rating.aspects[key as keyof typeof rating.aspects]}
                    onChange={(newRating) => handleAspectRatingChange(key as keyof EventRatingData['aspects'], newRating)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Would you recommend this event?</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRating(prev => ({ ...prev, wouldRecommend: true }))}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  rating.wouldRecommend
                    ? 'bg-green-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Yes, recommend
              </button>
              <button
                type="button"
                onClick={() => setRating(prev => ({ ...prev, wouldRecommend: false }))}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  !rating.wouldRecommend && rating.wouldRecommend !== undefined
                    ? 'bg-red-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                No, not recommend
              </button>
            </div>
          </div>

          {/* Helpful Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Helpful tags (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    rating.helpfulTags?.includes(tag)
                      ? 'bg-yellow-500 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Additional feedback (optional)</label>
            <textarea
              value={rating.feedback || ''}
              onChange={(e) => setRating(prev => ({ ...prev, feedback: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Share what made this event special or how it could be improved..."
            />
          </div>

          {/* Report Concerns */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="report-concerns"
              checked={rating.reportConcerns || false}
              onChange={(e) => setRating(prev => ({ ...prev, reportConcerns: e.target.checked }))}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="report-concerns" className="text-sm text-gray-300">
              I have concerns about this event that should be reviewed privately
            </label>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmitRating}
            disabled={isSubmitting || rating.overallRating === 0}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : userRating ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      )}

      {/* Community Ratings View */}
      {activeSection === 'view' && showAggregates && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <StarRating value={Math.round(aggregateRating.averageRating)} onChange={() => {}} disabled size="lg" />
                <span className="text-2xl font-bold text-white">{aggregateRating.averageRating.toFixed(1)}</span>
              </div>
              <p className="text-gray-300">
                Based on {aggregateRating.totalRatings} community ratings
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {Math.round(aggregateRating.recommendationRate * 100)}% would recommend
              </p>
            </div>

            {/* Aspect Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Aspect Ratings</h4>
              {Object.entries(aspectLabels).map(([key, { label, icon: Icon, color }]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-gray-300">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating
                      value={Math.round(aggregateRating.aspectAverages[key as keyof typeof aggregateRating.aspectAverages])}
                      onChange={() => {}}
                      disabled
                      size="sm"
                    />
                    <span className="text-white text-sm">
                      {aggregateRating.aspectAverages[key as keyof typeof aggregateRating.aspectAverages].toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h4 className="font-semibold text-white mb-4">What people are saying</h4>
            <div className="flex flex-wrap gap-2">
              {aggregateRating.topTags.map(({ tag, count }) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm"
                >
                  {tag} ({count})
                </span>
              ))}
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h4 className="font-semibold text-white mb-4">Attendance Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Attended fully</span>
                <span className="text-white">{aggregateRating.attendanceDistribution.yes} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Attended partially</span>
                <span className="text-white">{aggregateRating.attendanceDistribution.partial} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Interested but didn't attend</span>
                <span className="text-white">{aggregateRating.attendanceDistribution.no} people</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRating;