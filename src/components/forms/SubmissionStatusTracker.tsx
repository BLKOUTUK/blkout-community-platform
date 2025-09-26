// BLKOUT Liberation Platform - Submission Status Tracker
// Layer 1: Community Frontend Presentation Layer
// LIBERATION VALUES: Transparent submission tracking with community care

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Heart,
  Eye,
  MessageSquare,
  Calendar,
  Shield,
  Info,
  RefreshCw
} from 'lucide-react';
import { TraumaInformedContainer } from '@/components/protection/trauma-informed-container';
import { LiberationButton } from '@/components/ui/liberation-button';
import {
  cn,
  traumaInformedUtils,
  accessibilityUtils,
  liberationColors,
  dateUtils
} from '@/lib/liberation-utils';
import type { BaseComponentProps } from '@/types/liberation';

/**
 * LIBERATION VALUES: Transparent Submission Status Tracking
 * TRAUMA-INFORMED: Gentle updates with community support integration
 * ACCESSIBILITY: WCAG 2.1 AAA compliance with screen reader optimization
 * TRANSPARENCY: Real-time status updates with clear community communication
 */

export interface SubmissionStatus {
  id: string;
  type: 'event' | 'news' | 'story';
  title: string;
  status: 'submitted' | 'in_review' | 'approved' | 'published' | 'rejected' | 'needs_changes';
  submittedAt: string;
  lastUpdated: string;
  reviewerNotes?: string;
  estimatedReviewTime?: number; // in hours
  nextSteps?: string[];
  communityFeedback?: {
    supportive: number;
    concerns: number;
    suggestions: string[];
  };
}

interface SubmissionStatusTrackerProps extends BaseComponentProps {
  readonly submissions?: SubmissionStatus[];
  readonly autoRefresh?: boolean;
  readonly refreshInterval?: number; // in seconds
  readonly showCommunityFeedback?: boolean;
  readonly onStatusUpdate?: (submissionId: string, newStatus: string) => void;
}

const STATUS_COLORS = {
  submitted: liberationColors.healing.sage,
  in_review: liberationColors.pride.yellow,
  approved: liberationColors.healing.sage,
  published: liberationColors.pride.blue,
  rejected: liberationColors.panAfrican.red,
  needs_changes: liberationColors.pride.purple
} as const;

const STATUS_ICONS = {
  submitted: Clock,
  in_review: Eye,
  approved: CheckCircle,
  published: Globe,
  rejected: AlertTriangle,
  needs_changes: MessageSquare
} as const;

const STATUS_MESSAGES = {
  submitted: {
    title: 'Submission Received',
    description: 'Your submission has been received and is in the community review queue.',
    supportMessage: 'Thank you for contributing to our community!'
  },
  in_review: {
    title: 'Under Community Review',
    description: 'Our community organizing team is reviewing your submission.',
    supportMessage: 'We appreciate your patience as we ensure community safety and alignment with liberation values.'
  },
  approved: {
    title: 'Approved for Publishing',
    description: 'Your submission has been approved and will be published soon.',
    supportMessage: 'Congratulations! Your contribution strengthens our community.'
  },
  published: {
    title: 'Published',
    description: 'Your submission is now live and available to the community.',
    supportMessage: 'Thank you for sharing your voice with the community!'
  },
  rejected: {
    title: 'Needs Revision',
    description: 'Your submission needs some changes before it can be published.',
    supportMessage: 'We\'re here to help you revise and resubmit. Community care is our priority.'
  },
  needs_changes: {
    title: 'Revision Requested',
    description: 'Please review the feedback and make the suggested changes.',
    supportMessage: 'Our community moderators have provided specific guidance to help you.'
  }
} as const;

export const SubmissionStatusTracker: React.FC<SubmissionStatusTrackerProps> = ({
  submissions = [],
  autoRefresh = true,
  refreshInterval = 30,
  showCommunityFeedback = true,
  onStatusUpdate,
  className,
  'data-testid': testId,
  ...props
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSubmissions, setExpandedSubmissions] = useState<Set<string>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      // Simulate API call for status updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastRefresh(new Date());

      // Trigger status update callback if provided
      if (onStatusUpdate) {
        submissions.forEach(submission => {
          onStatusUpdate(submission.id, submission.status);
        });
      }
    } catch (error) {
      console.error('Failed to refresh submission status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle expanded view for submission details
  const toggleExpanded = (submissionId: string) => {
    setExpandedSubmissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(submissionId)) {
        newSet.delete(submissionId);
      } else {
        newSet.add(submissionId);
      }
      return newSet;
    });
  };

  // Render individual submission status
  const renderSubmissionStatus = (submission: SubmissionStatus) => {
    const StatusIcon = STATUS_ICONS[submission.status];
    const statusInfo = STATUS_MESSAGES[submission.status];
    const isExpanded = expandedSubmissions.has(submission.id);
    const statusColor = STATUS_COLORS[submission.status];

    return (
      <div
        key={submission.id}
        className={cn(
          'border rounded-lg p-4 transition-all duration-300',
          'hover:shadow-sm',
          traumaInformedUtils.getGentleAnimation('fade')
        )}
      >
        {/* Status Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className={cn(
              'p-2 rounded-full',
              statusColor,
              'bg-opacity-20'
            )}>
              <StatusIcon className={cn('h-4 w-4', statusColor.replace('bg-', 'text-'))} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-gray-900 truncate">
                  {submission.title}
                </h3>
                <span className="text-xs text-gray-500 capitalize">
                  {submission.type}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className={cn('font-medium', statusColor.replace('bg-', 'text-'))}>
                  {statusInfo.title}
                </span>
                <span className="text-xs">
                  {dateUtils.formatDateTime(submission.lastUpdated)}
                </span>
              </div>
            </div>
          </div>

          <LiberationButton
            variant="ghost"
            size="sm"
            onClick={() => toggleExpanded(submission.id)}
            ariaDescription={`${isExpanded ? 'Collapse' : 'Expand'} details for ${submission.title}`}
          >
            {isExpanded ? 'Less' : 'More'}
          </LiberationButton>
        </div>

        {/* Status Description */}
        <div className={cn(
          'px-2 py-3 rounded',
          statusColor,
          'bg-opacity-10 border-l-4 border-opacity-50'
        )}>
          <p className="text-sm text-gray-700 mb-2">
            {statusInfo.description}
          </p>

          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Heart className="h-3 w-3" />
            <span>{statusInfo.supportMessage}</span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className={cn(
            'mt-4 pt-4 border-t space-y-4',
            traumaInformedUtils.getGentleAnimation('slide')
          )}>
            {/* Timeline */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Timeline
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Submitted: {dateUtils.formatDateTime(submission.submittedAt)}</div>
                <div>Last Updated: {dateUtils.formatDateTime(submission.lastUpdated)}</div>
                {submission.estimatedReviewTime && (
                  <div>
                    Estimated Review Time: {submission.estimatedReviewTime} hours
                  </div>
                )}
              </div>
            </div>

            {/* Reviewer Notes */}
            {submission.reviewerNotes && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Community Feedback
                </h4>
                <div className={cn(
                  'p-3 rounded text-sm',
                  liberationColors.healing.lavender,
                  'bg-liberation-healing-lavender/10 border border-liberation-healing-lavender/20'
                )}>
                  {submission.reviewerNotes}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {submission.nextSteps && submission.nextSteps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Next Steps
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {submission.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-liberation-pride-purple">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Community Feedback */}
            {showCommunityFeedback && submission.communityFeedback && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  Community Response
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className={cn(
                    'p-2 rounded text-center text-xs',
                    liberationColors.healing.sage,
                    'bg-liberation-healing-sage/10'
                  )}>
                    <div className="font-medium">{submission.communityFeedback.supportive}</div>
                    <div>Community Support</div>
                  </div>
                  <div className={cn(
                    'p-2 rounded text-center text-xs',
                    liberationColors.pride.yellow,
                    'bg-liberation-pride-yellow/10'
                  )}>
                    <div className="font-medium">{submission.communityFeedback.concerns}</div>
                    <div>Community Concerns</div>
                  </div>
                </div>

                {submission.communityFeedback.suggestions.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">Community Suggestions:</div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {submission.communityFeedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-liberation-healing-sage">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Empty state
  if (submissions.length === 0) {
    return (
      <TraumaInformedContainer
        safeSpaceIndicator
        gentleAnimations
        className={className}
        data-testid={testId}
        {...props}
      >
        <div className="text-center py-12">
          <div className={cn(
            'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4',
            liberationColors.healing.sage,
            'bg-liberation-healing-sage/20'
          )}>
            <FileText className="h-8 w-8 text-liberation-healing-sage" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Submissions Yet
          </h3>

          <p className="text-gray-600 mb-6">
            Your submissions will appear here once you start sharing with the community.
          </p>

          <div className="flex justify-center space-x-4">
            <LiberationButton variant="community-empowerment">
              Submit Event
            </LiberationButton>
            <LiberationButton variant="community-healing">
              Share News
            </LiberationButton>
          </div>
        </div>
      </TraumaInformedContainer>
    );
  }

  return (
    <TraumaInformedContainer
      contentWarning="This area shows submission status and community feedback"
      safeSpaceIndicator
      supportResources
      gentleAnimations
      className={className}
      data-testid={testId}
      {...props}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Your Submissions
            </h2>
            <p className="text-sm text-gray-600">
              Track the status of your community contributions with transparency
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500">
              Last updated: {dateUtils.formatDateTime(lastRefresh.toISOString())}
            </div>

            <LiberationButton
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              ariaDescription="Refresh submission status"
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
              {isRefreshing ? 'Updating...' : 'Refresh'}
            </LiberationButton>
          </div>
        </div>

        {/* Status Legend */}
        <div className={cn(
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-lg',
          liberationColors.healing.sage,
          'bg-liberation-healing-sage/5 border border-liberation-healing-sage/20'
        )}>
          {Object.entries(STATUS_MESSAGES).map(([status, info]) => {
            const StatusIcon = STATUS_ICONS[status as keyof typeof STATUS_ICONS];
            const statusColor = STATUS_COLORS[status as keyof typeof STATUS_COLORS];

            return (
              <div key={status} className="flex items-center space-x-2">
                <div className={cn(
                  'p-1 rounded',
                  statusColor,
                  'bg-opacity-20'
                )}>
                  <StatusIcon className={cn('h-3 w-3', statusColor.replace('bg-', 'text-'))} />
                </div>
                <span className="text-xs text-gray-700 capitalize font-medium">
                  {info.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.map(renderSubmissionStatus)}
        </div>

        {/* Community Support */}
        <div className={cn(
          'p-4 rounded-lg border-l-4',
          liberationColors.healing.lavender,
          'border-liberation-healing-lavender bg-liberation-healing-lavender/10'
        )}>
          <div className="flex items-start space-x-3">
            <Heart className="h-4 w-4 text-liberation-healing-lavender flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium mb-1">Community Care Notice</div>
              <p>
                Our community review process prioritizes trauma-informed practices and liberation values.
                If you have questions about your submission status, our community care team is here to help.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TraumaInformedContainer>
  );
};