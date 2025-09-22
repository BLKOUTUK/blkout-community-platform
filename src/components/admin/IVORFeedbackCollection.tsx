// BLKOUT Liberation Platform - IVOR Feedback Collection for ML Learning
// Community feedback system to improve IVOR's responses and recommendations

import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Brain, TrendingUp, AlertCircle, CheckCircle, X, Send } from 'lucide-react';
import { LiberationButton } from '@/components/ui/liberation-button';
import { cn, liberationColors, traumaInformedUtils } from '@/lib/liberation-utils';
import VideoHero from '@/components/ui/VideoHero';

interface IVORInteraction {
  id: string;
  timestamp: string;
  userQuery: string;
  ivorResponse: string;
  responseType: 'information' | 'recommendation' | 'support' | 'guidance';
  context: string;
  sessionId: string;
}

interface FeedbackSubmission {
  interactionId: string;
  rating: 'helpful' | 'not_helpful' | 'harmful';
  accuracy: number; // 1-5 scale
  relevance: number; // 1-5 scale
  tone: 'appropriate' | 'too_clinical' | 'too_casual' | 'insensitive';
  suggestions: string;
  categories: string[];
  learningPriority: 'low' | 'medium' | 'high' | 'critical';
}

interface LearningMetrics {
  totalFeedback: number;
  helpfulResponses: number;
  accuracyAverage: number;
  commonIssues: Array<{
    category: string;
    frequency: number;
    examples: string[];
  }>;
  improvementAreas: string[];
  successPatterns: string[];
}

interface IVORFeedbackCollectionProps {
  className?: string;
  onFeedbackSubmitted?: (feedback: FeedbackSubmission) => void;
}

export const IVORFeedbackCollection: React.FC<IVORFeedbackCollectionProps> = ({
  className,
  onFeedbackSubmitted
}) => {
  const [recentInteractions, setRecentInteractions] = useState<IVORInteraction[]>([]);
  const [selectedInteraction, setSelectedInteraction] = useState<IVORInteraction | null>(null);
  const [feedback, setFeedback] = useState<Partial<FeedbackSubmission>>({});
  const [learningMetrics, setLearningMetrics] = useState<LearningMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'metrics' | 'patterns'>('feedback');

  // Feedback categories for IVOR improvement
  const feedbackCategories = [
    'health-information', 'crisis-support', 'resource-recommendations',
    'community-connections', 'mental-health', 'identity-affirmation',
    'safety-planning', 'advocacy-guidance', 'cultural-sensitivity',
    'trauma-awareness', 'accessibility', 'intersectionality'
  ];

  useEffect(() => {
    loadRecentInteractions();
    loadLearningMetrics();
  }, []);

  const loadRecentInteractions = async () => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call to IVOR backend
      // Simulated recent interactions for demonstration
      const mockInteractions: IVORInteraction[] = [
        {
          id: 'int_001',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          userQuery: 'I\'m feeling overwhelmed and need mental health resources in my area',
          ivorResponse: 'I understand you\'re feeling overwhelmed. Here are some mental health resources that may help: [1] Crisis Text Line: Text HOME to 741741 [2] National Suicide Prevention Lifeline: 988 [3] Local community centers with sliding scale therapy. Would you like me to help you find specific resources in your location?',
          responseType: 'support',
          context: 'Mental health crisis support',
          sessionId: 'sess_abc123'
        },
        {
          id: 'int_002',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          userQuery: 'What are some Black-owned businesses I can support in my community?',
          ivorResponse: 'Supporting Black-owned businesses is a powerful way to strengthen our community! I can help you find local Black-owned businesses. Could you share your city or zip code? I can then provide specific recommendations for restaurants, shops, services, and professional businesses in your area.',
          responseType: 'recommendation',
          context: 'Community economic support',
          sessionId: 'sess_def456'
        },
        {
          id: 'int_003',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
          userQuery: 'How do I advocate for myself in healthcare settings?',
          ivorResponse: 'Healthcare self-advocacy is crucial, especially for Black and LGBTQ+ individuals who face documented disparities. Here are key strategies: [1] Prepare questions in advance [2] Bring a support person if possible [3] Document everything [4] Know your rights to request different providers [5] Trust your instincts about your body. Would you like specific scripts for common healthcare situations?',
          responseType: 'guidance',
          context: 'Healthcare advocacy',
          sessionId: 'sess_ghi789'
        }
      ];

      setRecentInteractions(mockInteractions);
    } catch (error) {
      console.error('Failed to load recent interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLearningMetrics = async () => {
    try {
      // TODO: Replace with actual API call to learning analytics
      const mockMetrics: LearningMetrics = {
        totalFeedback: 1247,
        helpfulResponses: 1089,
        accuracyAverage: 4.2,
        commonIssues: [
          {
            category: 'resource-outdated',
            frequency: 23,
            examples: ['Phone numbers no longer working', 'Websites not accessible', 'Services discontinued']
          },
          {
            category: 'tone-too-clinical',
            frequency: 18,
            examples: ['Sounds like a medical textbook', 'Not warm enough for crisis situations']
          },
          {
            category: 'missing-cultural-context',
            frequency: 15,
            examples: ['Didn\'t account for religious considerations', 'Missed intersectional identity factors']
          }
        ],
        improvementAreas: [
          'Real-time resource verification',
          'More conversational crisis support tone',
          'Enhanced cultural competency responses',
          'Better geographic specificity'
        ],
        successPatterns: [
          'Trauma-informed language consistently rated highly',
          'Community resource recommendations well-received',
          'Identity-affirming responses show strong positive feedback',
          'Safety-first approach appreciated in crisis situations'
        ]
      };

      setLearningMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load learning metrics:', error);
    }
  };

  const submitFeedback = async () => {
    if (!selectedInteraction || !feedback.rating) return;

    try {
      setSubmitting(true);

      const submission: FeedbackSubmission = {
        interactionId: selectedInteraction.id,
        rating: feedback.rating!,
        accuracy: feedback.accuracy || 3,
        relevance: feedback.relevance || 3,
        tone: feedback.tone || 'appropriate',
        suggestions: feedback.suggestions || '',
        categories: feedback.categories || [],
        learningPriority: feedback.learningPriority || 'medium'
      };

      // TODO: Submit to IVOR learning backend
      console.log('Submitting feedback for IVOR learning:', submission);

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(submission);
      }

      // Reset form
      setFeedback({});
      setSelectedInteraction(null);

      // Refresh metrics
      await loadLearningMetrics();

    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderInteractionCard = (interaction: IVORInteraction) => (
    <div
      key={interaction.id}
      className={cn(
        'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
        selectedInteraction?.id === interaction.id
          ? 'border-liberation-pride-purple bg-liberation-pride-purple/5'
          : 'border-gray-200 hover:border-liberation-pride-purple/30'
      )}
      onClick={() => setSelectedInteraction(interaction)}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500">
          {new Date(interaction.timestamp).toLocaleString()}
        </span>
        <span className={cn(
          'text-xs px-2 py-1 rounded',
          interaction.responseType === 'support' ? 'bg-red-100 text-red-700' :
          interaction.responseType === 'guidance' ? 'bg-blue-100 text-blue-700' :
          interaction.responseType === 'recommendation' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        )}>
          {interaction.responseType}
        </span>
      </div>

      <div className="mb-3">
        <div className="text-sm font-medium text-gray-900 mb-1">User Query:</div>
        <div className="text-sm text-gray-600 line-clamp-2">{interaction.userQuery}</div>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-900 mb-1">IVOR Response:</div>
        <div className="text-sm text-gray-600 line-clamp-3">{interaction.ivorResponse}</div>
      </div>
    </div>
  );

  const renderFeedbackForm = () => {
    if (!selectedInteraction) {
      return (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Interaction</h3>
          <p className="text-gray-500">
            Choose a recent IVOR interaction to provide learning feedback.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Selected Interaction Display */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Providing Feedback For:</h4>
          <div className="text-sm text-gray-600 mb-2">
            <strong>Query:</strong> {selectedInteraction.userQuery}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Response:</strong> {selectedInteraction.ivorResponse}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Overall Rating *
          </label>
          <div className="flex space-x-4">
            {[
              { value: 'helpful', icon: ThumbsUp, label: 'Helpful', color: 'green' },
              { value: 'not_helpful', icon: ThumbsDown, label: 'Not Helpful', color: 'yellow' },
              { value: 'harmful', icon: AlertCircle, label: 'Potentially Harmful', color: 'red' }
            ].map(({ value, icon: Icon, label, color }) => (
              <button
                key={value}
                onClick={() => setFeedback(prev => ({ ...prev, rating: value as any }))}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors',
                  feedback.rating === value
                    ? color === 'green' ? 'border-green-500 bg-green-50 text-green-700' :
                      color === 'yellow' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
                      'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accuracy (1-5)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={feedback.accuracy || 3}
              onChange={(e) => setFeedback(prev => ({ ...prev, accuracy: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Inaccurate</span>
              <span>{feedback.accuracy || 3}</span>
              <span>Very Accurate</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relevance (1-5)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={feedback.relevance || 3}
              onChange={(e) => setFeedback(prev => ({ ...prev, relevance: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Irrelevant</span>
              <span>{feedback.relevance || 3}</span>
              <span>Very Relevant</span>
            </div>
          </div>
        </div>

        {/* Tone Assessment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Response Tone
          </label>
          <select
            value={feedback.tone || 'appropriate'}
            onChange={(e) => setFeedback(prev => ({ ...prev, tone: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
          >
            <option value="appropriate">Appropriate and balanced</option>
            <option value="too_clinical">Too clinical/medical</option>
            <option value="too_casual">Too casual for situation</option>
            <option value="insensitive">Culturally insensitive</option>
          </select>
        </div>

        {/* Feedback Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relevant Categories (select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {feedbackCategories.map(category => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={feedback.categories?.includes(category) || false}
                  onChange={(e) => {
                    const categories = feedback.categories || [];
                    if (e.target.checked) {
                      setFeedback(prev => ({
                        ...prev,
                        categories: [...categories, category]
                      }));
                    } else {
                      setFeedback(prev => ({
                        ...prev,
                        categories: categories.filter(c => c !== category)
                      }));
                    }
                  }}
                  className="rounded border-gray-300 text-liberation-pride-purple focus:ring-liberation-pride-purple"
                />
                <span className="text-sm text-gray-700">
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suggestions for Improvement
          </label>
          <textarea
            value={feedback.suggestions || ''}
            onChange={(e) => setFeedback(prev => ({ ...prev, suggestions: e.target.value }))}
            placeholder="What could IVOR have done better? Be specific about improvements..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
          />
        </div>

        {/* Learning Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Priority for IVOR
          </label>
          <select
            value={feedback.learningPriority || 'medium'}
            onChange={(e) => setFeedback(prev => ({ ...prev, learningPriority: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
          >
            <option value="low">Low - Minor improvement</option>
            <option value="medium">Medium - Important for quality</option>
            <option value="high">High - Significant impact</option>
            <option value="critical">Critical - Safety or harm concern</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <LiberationButton
            variant="secondary"
            onClick={() => {
              setSelectedInteraction(null);
              setFeedback({});
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </LiberationButton>
          <LiberationButton
            onClick={submitFeedback}
            disabled={!feedback.rating || submitting}
          >
            {submitting ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit Feedback
          </LiberationButton>
        </div>
      </div>
    );
  };

  const renderLearningMetrics = () => {
    if (!learningMetrics) {
      return (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Metrics</h3>
          <p className="text-gray-500">Analyzing IVOR's learning progress...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((learningMetrics.helpfulResponses / learningMetrics.totalFeedback) * 100)}%
            </div>
            <div className="text-sm text-green-700">Helpful Responses</div>
            <div className="text-xs text-gray-500">
              {learningMetrics.helpfulResponses} of {learningMetrics.totalFeedback} total
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {learningMetrics.accuracyAverage.toFixed(1)}/5
            </div>
            <div className="text-sm text-blue-700">Average Accuracy</div>
            <div className="text-xs text-gray-500">Based on community ratings</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {learningMetrics.improvementAreas.length}
            </div>
            <div className="text-sm text-purple-700">Active Learning Areas</div>
            <div className="text-xs text-gray-500">Areas being improved</div>
          </div>
        </div>

        {/* Common Issues */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Common Issues</h4>
          <div className="space-y-3">
            {learningMetrics.commonIssues.map((issue, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-yellow-800">
                    {issue.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h5>
                  <span className="text-sm text-yellow-600">{issue.frequency} reports</span>
                </div>
                <div className="text-sm text-yellow-700">
                  Examples: {issue.examples.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Patterns */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Success Patterns</h4>
          <div className="space-y-2">
            {learningMetrics.successPatterns.map((pattern, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800">{pattern}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Hero Section */}
      <VideoHero
        title="IVOR LEARNING LAB"
        subtitle="Community feedback for AI improvement"
        description="Help train IVOR to better serve our community. Your feedback teaches our AI assistant to provide more accurate, culturally-sensitive, and helpful responses to community needs."
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
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Feedback sections">
            {[
              { key: 'feedback', label: 'Provide Feedback', icon: MessageSquare },
              { key: 'metrics', label: 'Learning Metrics', icon: TrendingUp },
              { key: 'patterns', label: 'Improvement Patterns', icon: Brain }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={cn(
                  'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm',
                  'hover:text-liberation-pride-purple hover:border-liberation-pride-purple/50',
                  traumaInformedUtils.getSafeTransition('fast'),
                  activeTab === key
                    ? 'border-liberation-pride-purple text-liberation-pride-purple'
                    : 'border-transparent text-gray-500'
                )}
                aria-current={activeTab === key ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'feedback' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Interactions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent IVOR Interactions
                </h3>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse p-4 bg-gray-100 rounded-lg h-32" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {recentInteractions.map(renderInteractionCard)}
                  </div>
                )}
              </div>

              {/* Feedback Form */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Learning Feedback
                </h3>
                {renderFeedbackForm()}
              </div>
            </div>
          )}

          {activeTab === 'metrics' && renderLearningMetrics()}

          {activeTab === 'patterns' && (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI Learning Patterns</h3>
              <p className="text-gray-500">
                Advanced pattern analysis and learning insights coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IVORFeedbackCollection;