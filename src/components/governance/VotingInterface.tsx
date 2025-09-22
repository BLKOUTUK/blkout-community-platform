// BLKOUT Liberation Platform - Voting Interface Component
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Presentation component only - NO business logic

import React, { useState, useEffect } from 'react';
import {
  Vote,
  Heart,
  X,
  Pause,
  ArrowRight,
  MessageSquare,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Shield
} from 'lucide-react';
import { LiberationButton } from '@/components/ui/liberation-button';
import { TraumaInformedContainer } from '@/components/protection/trauma-informed-container';
import {
  cn,
  governanceUtils,
  accessibilityUtils,
  traumaInformedUtils,
  liberationColors,
  dateUtils
} from '@/lib/liberation-utils';
import { communityAPI } from '@/services/community-api';
import type {
  ProposalDisplay,
  VoteSubmission,
  VoteResult,
  BaseComponentProps
} from '@/types/liberation';

/**
 * QI COMPLIANCE: Voting Interface Component
 * BOUNDARY ENFORCEMENT: Only submits votes through Layer 2 API Gateway
 * LIBERATION VALUES: Democratic participation with trauma-informed design
 * ACCESSIBILITY: WCAG 3.0 Bronze compliant with comprehensive voting accessibility
 * CULTURAL AUTHENTICITY: Community consensus-building and collective decision-making
 */

export interface VotingInterfaceProps extends BaseComponentProps {
  readonly proposal: ProposalDisplay;
  readonly onVoteSubmitted?: (result: VoteResult) => void;
  readonly onDiscussionOpen?: (proposalId: string) => void;
  readonly traumaInformedMode?: boolean;
  readonly showLiberationImpact?: boolean;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  proposal,
  onVoteSubmitted,
  onDiscussionOpen,
  traumaInformedMode = true,
  showLiberationImpact = true,
  className,
  'data-testid': testId,
  ...props
}) => {
  // QI COMPLIANCE: State for presentation data only - NO business logic
  const [selectedVote, setSelectedVote] = useState<VoteSubmission['vote'] | null>(null);
  const [rationale, setRationale] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRationale, setShowRationale] = useState(false);

  // Liberation values color mapping
  const getImpactColor = (impact: number) => {
    if (impact > 0.5) return 'text-green-600';
    if (impact < -0.5) return 'text-red-600';
    return 'text-gray-600';
  };

  // Vote option configurations
  const voteOptions = [
    {
      value: 'support' as const,
      label: 'Support',
      description: 'I agree with this proposal and want it implemented',
      icon: CheckCircle,
      color: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      value: 'oppose' as const,
      label: 'Oppose',
      description: 'I disagree with this proposal in its current form',
      icon: X,
      color: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      value: 'abstain' as const,
      label: 'Abstain',
      description: 'I choose not to take a position on this proposal',
      icon: Pause,
      color: 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100',
      iconColor: 'text-gray-600'
    },
    {
      value: 'block' as const,
      label: 'Block',
      description: 'This proposal fundamentally conflicts with our liberation values',
      icon: Shield,
      color: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100',
      iconColor: 'text-orange-600',
      requiresRationale: true
    }
  ];

  // Check if voting deadline has passed
  const isVotingOpen = () => {
    return new Date(proposal.votingDeadline) > new Date() && proposal.status === 'voting';
  };

  // Handle vote selection
  const handleVoteSelection = (vote: VoteSubmission['vote']) => {
    setSelectedVote(vote);
    setError(null);

    // Show rationale input for block votes
    if (vote === 'block') {
      setShowRationale(true);
    } else {
      setShowRationale(false);
      setRationale('');
    }

    // Show confirmation for block votes immediately
    if (vote === 'block') {
      setShowConfirmation(true);
    }
  };

  // Validate vote submission
  const validateVote = (): string | null => {
    if (!selectedVote) {
      return 'Please select a vote option';
    }

    if (selectedVote === 'block' && (!rationale.trim() || rationale.trim().length < 10)) {
      return 'Block votes require detailed rationale (minimum 10 characters)';
    }

    return null;
  };

  // Submit vote
  const handleVoteSubmit = async () => {
    const validationError = validateVote();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const voteData: VoteSubmission = {
        proposalId: proposal.id,
        vote: selectedVote!,
        rationale: rationale.trim() || undefined,
        isAnonymous,
        confidenceLevel
      };

      // BOUNDARY ENFORCEMENT: Only submit through Layer 2 API Gateway
      const result = await communityAPI.submitVote(voteData);

      if (result.success) {
        onVoteSubmitted?.(result);
        // Reset form
        setSelectedVote(null);
        setRationale('');
        setShowConfirmation(false);
        setShowRationale(false);
      } else {
        setError(result.message || 'Failed to submit vote');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit vote');
    } finally {
      setLoading(false);
    }
  };

  // Render vote option button
  const renderVoteOption = (option: typeof voteOptions[0]) => {
    const Icon = option.icon;
    const isSelected = selectedVote === option.value;

    return (
      <button
        key={option.value}
        onClick={() => handleVoteSelection(option.value)}
        disabled={!isVotingOpen() || loading}
        className={cn(
          'w-full p-4 border-2 rounded-lg text-left',
          'transition-all duration-200',
          'focus:ring-2 focus:ring-liberation-pride-purple focus:outline-none',
          isSelected
            ? cn(option.color, 'border-opacity-100 shadow-sm')
            : 'bg-white border-gray-200 hover:border-gray-300',
          !isVotingOpen() && 'opacity-50 cursor-not-allowed',
          traumaInformedMode && traumaInformedUtils.getSafeTransition('medium')
        )}
        aria-pressed={isSelected}
        aria-describedby={`vote-${option.value}-description`}
      >
        <div className="flex items-start space-x-3">
          <Icon
            className={cn(
              'h-6 w-6 mt-0.5',
              isSelected ? option.iconColor : 'text-gray-400'
            )}
            aria-hidden="true"
          />
          <div className="flex-1">
            <div className={cn(
              'font-semibold',
              isSelected ? '' : 'text-gray-700'
            )}>
              {option.label}
            </div>
            <div
              id={`vote-${option.value}-description`}
              className={cn(
                'text-sm mt-1',
                isSelected ? 'opacity-90' : 'text-gray-500'
              )}
            >
              {option.description}
            </div>
            {option.requiresRationale && (
              <div className="text-xs mt-2 italic text-orange-600">
                Requires detailed rationale
              </div>
            )}
          </div>
          {isSelected && (
            <CheckCircle className="h-5 w-5 text-liberation-pride-purple" aria-hidden="true" />
          )}
        </div>
      </button>
    );
  };

  // Render proposal information
  const renderProposalInfo = () => (
    <div className="space-y-4 mb-6">
      {/* Proposal Header */}
      <div>
        <h3 className="text-xl font-bold font-liberation text-liberation-black-power mb-2">
          {proposal.title}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="capitalize">{proposal.category.replace('_', ' ')}</span>
          <span className="flex items-center space-x-1">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>Deadline: {dateUtils.formatDisplayDate(proposal.votingDeadline)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>{proposal.currentSupport}% support</span>
          </span>
        </div>
      </div>

      {/* Proposal Summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 leading-relaxed">
          {proposal.summary}
        </p>
      </div>

      {/* Liberation Values Impact */}
      {showLiberationImpact && proposal.liberationImpact && (
        <div className="p-4 bg-liberation-pride-purple bg-opacity-5 rounded-lg border border-liberation-pride-purple border-opacity-20">
          <h4 className="font-medium mb-3 text-liberation-black-power">
            Liberation Values Impact
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>Creator Sovereignty:</span>
              <span className={getImpactColor(proposal.liberationImpact.creatorSovereignty)}>
                {proposal.liberationImpact.creatorSovereignty > 0 ? '+' : ''}
                {proposal.liberationImpact.creatorSovereignty.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Community Safety:</span>
              <span className={getImpactColor(proposal.liberationImpact.communitySafety)}>
                {proposal.liberationImpact.communitySafety > 0 ? '+' : ''}
                {proposal.liberationImpact.communitySafety.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cultural Authenticity:</span>
              <span className={getImpactColor(proposal.liberationImpact.culturalAuthenticity)}>
                {proposal.liberationImpact.culturalAuthenticity > 0 ? '+' : ''}
                {proposal.liberationImpact.culturalAuthenticity.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Democratic Governance:</span>
              <span className={getImpactColor(proposal.liberationImpact.democraticGovernance)}>
                {proposal.liberationImpact.democraticGovernance > 0 ? '+' : ''}
                {proposal.liberationImpact.democraticGovernance.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Discussion Link */}
      {onDiscussionOpen && (
        <div className="flex justify-center">
          <button
            onClick={() => onDiscussionOpen(proposal.id)}
            className={cn(
              'flex items-center space-x-2 text-liberation-pride-purple hover:underline',
              'focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple rounded',
              traumaInformedMode && traumaInformedUtils.getSafeTransition('fast')
            )}
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            <span>Join Community Discussion ({proposal.discussionCount || 0})</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );

  // Render voting deadline warning
  const renderDeadlineWarning = () => {
    const deadline = new Date(proposal.votingDeadline);
    const now = new Date();
    const hoursLeft = Math.max(0, (deadline.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (hoursLeft <= 0) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
            <span className="text-red-800 font-medium">Voting Closed</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            The voting deadline has passed. Results will be processed shortly.
          </p>
        </div>
      );
    }

    if (hoursLeft <= 24) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" aria-hidden="true" />
            <span className="text-yellow-800 font-medium">Voting Ends Soon</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Only {Math.round(hoursLeft)} hours left to vote. Make your voice heard!
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <TraumaInformedContainer
      traumaInformedMode={traumaInformedMode}
      className={cn(
        'max-w-2xl mx-auto p-6 bg-white rounded-lg border-2',
        liberationColors.pride.purple,
        'border-liberation-pride-purple/20',
        className
      )}
      data-testid={testId}
      aria-label={`Voting interface for proposal: ${proposal.title}`}
      {...props}
    >
      {/* Proposal Information */}
      {renderProposalInfo()}

      {/* Deadline Warning */}
      {renderDeadlineWarning()}

      {/* Voting Options */}
      {isVotingOpen() && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold font-liberation text-liberation-black-power mb-4">
              Cast Your Vote
            </h4>
            <div className="space-y-3">
              {voteOptions.map(renderVoteOption)}
            </div>
          </div>

          {/* Rationale Input */}
          {showRationale && (
            <div className="space-y-2">
              <label
                htmlFor="vote-rationale"
                className="block text-sm font-medium text-liberation-black-power"
              >
                Rationale for Block Vote *
              </label>
              <textarea
                id="vote-rationale"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                rows={4}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg resize-vertical',
                  'focus:ring-2 focus:ring-liberation-pride-purple focus:border-liberation-pride-purple',
                  'border-gray-300'
                )}
                placeholder="Please explain why this proposal conflicts with our liberation values and suggest improvements..."
                aria-describedby="rationale-help"
              />
              <p id="rationale-help" className="text-xs text-gray-500">
                Block votes require detailed explanation to help improve the proposal
              </p>
            </div>
          )}

          {/* Vote Options */}
          {selectedVote && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-liberation-black-power">Vote Options</h5>

              {/* Anonymous Voting */}
              {proposal.anonymousVotingAllowed && (
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Cast anonymous vote</span>
                </label>
              )}

              {/* Confidence Level */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-liberation-black-power">
                  Confidence Level
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
                    className="flex-1"
                    aria-describedby="confidence-display"
                  />
                  <span
                    id="confidence-display"
                    className="font-medium text-liberation-pride-purple min-w-[3rem]"
                  >
                    {Math.round(confidenceLevel * 100)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  How confident are you in this vote?
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
                <span className="text-red-800 font-medium">Vote Error</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Vote Confirmation */}
          {selectedVote && !showConfirmation && selectedVote !== 'block' && (
            <div className="flex justify-center">
              <LiberationButton
                variant="democratic-governance"
                onClick={() => setShowConfirmation(true)}
                disabled={loading}
              >
                Review Vote
              </LiberationButton>
            </div>
          )}

          {/* Final Confirmation */}
          {showConfirmation && (
            <div className="p-4 bg-liberation-pride-purple bg-opacity-10 border border-liberation-pride-purple border-opacity-30 rounded-lg">
              <h5 className="font-medium mb-2">Confirm Your Vote</h5>
              <p className="text-sm mb-4">
                You are voting <strong>{selectedVote}</strong> on this proposal.
                {isAnonymous && ' Your vote will be anonymous.'}
                {rationale && (
                  <>
                    <br />
                    <strong>Rationale:</strong> {rationale}
                  </>
                )}
              </p>
              <div className="flex space-x-3">
                <LiberationButton
                  variant="democratic-governance"
                  onClick={handleVoteSubmit}
                  loading={loading}
                  disabled={loading}
                >
                  Submit Vote
                </LiberationButton>
                <LiberationButton
                  variant="outline"
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedVote(null);
                    setRationale('');
                    setShowRationale(false);
                  }}
                  disabled={loading}
                >
                  Cancel
                </LiberationButton>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Voting Closed Message */}
      {!isVotingOpen() && proposal.status !== 'voting' && (
        <div className="text-center p-8 text-gray-500">
          <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
          <p>Voting is not currently open for this proposal</p>
          <p className="text-sm mt-2">Status: {proposal.status}</p>
        </div>
      )}
    </TraumaInformedContainer>
  );
};