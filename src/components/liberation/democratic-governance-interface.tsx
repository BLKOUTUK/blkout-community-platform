// BLKOUT Liberation Platform - Democratic Governance Interface
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Presentation component only - NO business logic

import React, { useState, useEffect } from 'react';
import { Vote, Users, MessageSquare, Calendar, CheckCircle, XCircle, Clock, AlertTriangle, Crown } from 'lucide-react';
import { LiberationButton } from '@/components/ui/liberation-button';
import {
  cn,
  governanceUtils,
  accessibilityUtils,
  traumaInformedUtils,
  liberationColors,
  dateUtils
} from '@/lib/liberation-utils';
import { communityAPI } from '@/services/community-api';
import { useBLKOUTHUBMembership } from '@/services/blkouthub-integration';
import BLKOUTHUBMemberBadge from '@/components/community/BLKOUTHUBMemberBadge';
import VideoHero from '@/components/ui/VideoHero';
import type {
  GovernanceDisplay,
  GovernanceProposal,
  VotingHistory,
  ConsensusTracking,
  BaseComponentProps
} from '@/types/liberation';

/**
 * QI COMPLIANCE: Democratic Governance Interface Component
 * BOUNDARY ENFORCEMENT: Only displays data from Layer 2 API Gateway
 * LIBERATION VALUES: Community democracy and consensus building embedded
 * ACCESSIBILITY: WCAG 3.0 Bronze compliant with screen reader support
 * CULTURAL AUTHENTICITY: Democratic organizing principles centered
 */

export interface DemocraticGovernanceInterfaceProps extends BaseComponentProps {
  readonly communityRole?: 'member' | 'organizer' | 'moderator' | 'admin';
  readonly showHistory?: boolean;
  readonly enableConsensusView?: boolean;
  readonly traumaInformedMode?: boolean;
}

export const DemocraticGovernanceInterface: React.FC<DemocraticGovernanceInterfaceProps> = ({
  communityRole = 'member',
  showHistory = true,
  enableConsensusView = true,
  traumaInformedMode = true,
  className,
  'data-testid': testId,
  ...props
}) => {
  // QI COMPLIANCE: State for presentation data only - NO business logic
  const [governanceData, setGovernanceData] = useState<GovernanceDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'consensus'>('active');

  // QI COMPLIANCE: Data fetching through Layer 2 API Gateway only
  useEffect(() => {
    const fetchGovernanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        // BOUNDARY ENFORCEMENT: Only call Layer 2 API Gateway
        const data = await communityAPI.getGovernanceDashboard();
        setGovernanceData(data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load governance data');
      } finally {
        setLoading(false);
      }
    };

    fetchGovernanceData();
  }, []);

  // Loading state with accessibility
  if (loading) {
    return (
      <div
        className={cn(
          'animate-pulse space-y-4 p-6',
          liberationColors.pride.purple,
          'opacity-20 rounded-lg',
          className
        )}
        data-testid={`${testId}-loading`}
        aria-label="Loading democratic governance interface"
      >
        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Error state with community support
  if (error || !governanceData) {
    return (
      <div
        className={cn(
          'p-6 rounded-lg border-2 border-red-200 bg-red-50',
          'text-red-800',
          className
        )}
        data-testid={`${testId}-error`}
        role="alert"
        aria-describedby={`${testId}-error-description`}
      >
        <h3 className="font-semibold mb-2">Unable to Load Governance Data</h3>
        <p id={`${testId}-error-description`} className="text-sm mb-4">
          {error || 'Governance information is currently unavailable. Your democratic rights remain protected.'}
        </p>
        <LiberationButton
          variant="community-protection"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Try Again
        </LiberationButton>
      </div>
    );
  }

  // QI COMPLIANCE: Voting rights display (presentation only)
  const renderVotingRights = () => {
    const { votingRights } = governanceData;

    return (
      <div className="p-4 bg-liberation-pride-purple/10 border border-liberation-pride-purple/20 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <Crown className="h-5 w-5 text-liberation-pride-purple" aria-hidden="true" />
          <h3 className="font-semibold text-liberation-pride-purple">
            Your Democratic Rights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className={votingRights.canVote ? '✅' : '❌'}>
              {votingRights.canVote ? '✅' : '❌'}
            </span>
            <span>Vote on Proposals</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={votingRights.canPropose ? '✅' : '❌'}>
              {votingRights.canPropose ? '✅' : '❌'}
            </span>
            <span>Submit Proposals</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={votingRights.canModerate ? '✅' : '❌'}>
              {votingRights.canModerate ? '✅' : '❌'}
            </span>
            <span>Moderate Discussions</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={votingRights.canDelegate ? '✅' : '❌'}>
              {votingRights.canDelegate ? '✅' : '❌'}
            </span>
            <span>Delegate Voting</span>
          </div>
        </div>
      </div>
    );
  };

  // QI COMPLIANCE: Active proposals display (presentation only)
  const renderActiveProposals = () => {
    const { activeProposals } = governanceData;

    if (activeProposals.length === 0) {
      return (
        <div className="text-center py-12">
          <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Proposals</h3>
          <p className="text-gray-500">
            Community democracy is quiet right now. Check back soon for new proposals.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {activeProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-liberation-pride-purple/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{proposal.title}</h4>
                <p className="text-sm text-gray-600">{proposal.description}</p>
              </div>
              <span className={cn(
                'text-xs px-2 py-1 rounded',
                proposal.urgency === 'high' ? 'bg-red-100 text-red-800' :
                proposal.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              )}>
                {proposal.urgency.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span>Voting ends: {dateUtils.formatDisplayDate(proposal.votingDeadline)}</span>
              <span>{proposal.totalVotes} votes cast</span>
            </div>

            <div className="flex space-x-2">
              <LiberationButton
                variant="community-engagement"
                size="sm"
                onClick={() => {
                  // TODO: Implement voting functionality
                  console.log('Vote for:', proposal.id);
                }}
              >
                <Vote className="h-4 w-4 mr-1" />
                Vote
              </LiberationButton>
              <LiberationButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  // TODO: Implement discussion functionality
                  console.log('Discuss:', proposal.id);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Discuss
              </LiberationButton>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn('space-y-8', className)} data-testid={testId} {...props}>
      {/* Hero Section with Video Background */}
      <VideoHero
        title="🗳️ DEMOCRATIC GOVERNANCE"
        subtitle="Community-controlled decision making"
        description="Every voice matters in our liberation. Participate in democratic decision-making, vote on platform policies, and shape our collective future through consensus building."
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

      {/* Main Governance Interface */}
      <div
        className={cn(
          'space-y-6 p-6 rounded-lg border-2',
          liberationColors.pride.purple,
          'border-liberation-pride-purple/20 bg-white',
          traumaInformedMode && traumaInformedUtils.getSafeTransition('medium')
        )}
        aria-label="Democratic governance interface"
      >
        {/* Voting Rights Section */}
        <section aria-labelledby="voting-rights-heading">
          <h3 id="voting-rights-heading" className="sr-only">
            Your democratic participation rights
          </h3>
          {renderVotingRights()}
        </section>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Governance sections">
            {[
              { key: 'active', label: 'Active Proposals', icon: Vote },
              { key: 'history', label: 'Voting History', icon: MessageSquare },
              ...(enableConsensusView ? [{ key: 'consensus', label: 'Consensus Building', icon: Users }] : []),
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
        <div className="min-h-[400px]">
          {activeTab === 'active' && (
            <section aria-labelledby="active-proposals-heading">
              <h3 id="active-proposals-heading" className="sr-only">
                Active proposals requiring your vote
              </h3>
              {renderActiveProposals()}
            </section>
          )}

          {activeTab === 'history' && showHistory && (
            <section aria-labelledby="voting-history-heading">
              <h3 id="voting-history-heading" className="sr-only">
                Your voting history and democratic participation
              </h3>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Voting History</h3>
                <p className="text-gray-500">
                  Your democratic participation history will appear here.
                </p>
              </div>
            </section>
          )}

          {activeTab === 'consensus' && enableConsensusView && (
            <section aria-labelledby="consensus-building-heading">
              <h3 id="consensus-building-heading" className="sr-only">
                Community consensus building and discussion
              </h3>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Consensus Building</h3>
                <p className="text-gray-500">
                  Community consensus discussions and collaboration tools coming soon.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};