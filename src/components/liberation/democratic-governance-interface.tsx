// BLKOUT Liberation Platform - Democratic Governance Interface
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Presentation component only - NO business logic

import React, { useState, useEffect } from 'react';
import { Vote, Users, MessageSquare, Calendar, CheckCircle, XCircle, Clock, AlertTriangle, Crown, FileText, DollarSign, UserPlus, Lightbulb, Handshake, Building } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'active' | 'membership' | 'transparency' | 'financial' | 'ideas' | 'partnerships'>('active');

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
        title="COMMUNITY BENEFIT SOCIETY GOVERNANCE"
        subtitle="Democratic member control and transparency"
        description="As a Community Benefit Society with asset lock, we are governed by our members through democratic one-member-one-vote principles. Access membership, transparency reports, financial statements, and participate in shaping our community-controlled future."
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
          <nav className="-mb-px flex flex-wrap gap-2 md:gap-8" aria-label="CBS Governance sections">
            {[
              { key: 'active', label: 'Active Proposals', icon: Vote },
              { key: 'membership', label: 'Membership', icon: UserPlus },
              { key: 'transparency', label: 'Meeting Reports', icon: FileText },
              { key: 'financial', label: 'Financial Reports', icon: DollarSign },
              { key: 'ideas', label: 'New Ideas', icon: Lightbulb },
              { key: 'partnerships', label: 'Partnerships', icon: Handshake },
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

          {activeTab === 'membership' && (
            <section aria-labelledby="membership-heading">
              <h3 id="membership-heading" className="text-xl font-bold text-liberation-black-power mb-6">
                Community Benefit Society Membership
              </h3>
              <div className="space-y-6">
                {/* CBS Information */}
                <div className="bg-liberation-pride-purple/10 border border-liberation-pride-purple/20 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building className="h-6 w-6 text-liberation-pride-purple" />
                    <h4 className="text-lg font-semibold text-liberation-pride-purple">Community Benefit Society Structure</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <p><strong>Legal Status:</strong> Community Benefit Society (CBS) with asset lock</p>
                    <p><strong>Governance:</strong> One-member-one-vote democratic control</p>
                    <p><strong>Purpose:</strong> Community benefit takes priority over profit maximization</p>
                    <p><strong>Asset Protection:</strong> Community assets cannot be extracted by private interests</p>
                    <p><strong>Member Rights:</strong> Democratic participation, information access, and community oversight</p>
                  </div>
                </div>

                {/* Membership Journey */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-liberation-black-power">🌟 Community Membership</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Participate in democratic governance</li>
                      <li>• Vote on community decisions</li>
                      <li>• Access transparency reports</li>
                      <li>• Propose new initiatives</li>
                      <li>• Shape platform development</li>
                    </ul>
                    <LiberationButton
                      variant="community-engagement"
                      onClick={() => {
                        // TODO: Navigate to membership application
                        console.log('Navigate to community membership application');
                      }}
                    >
                      Apply for Community Membership
                    </LiberationButton>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-liberation-black-power">👑 Full CBS Membership</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Full voting rights on all matters</li>
                      <li>• Access to financial records</li>
                      <li>• Eligibility for elected positions</li>
                      <li>• Legal member protections</li>
                      <li>• Annual member benefits</li>
                    </ul>
                    <LiberationButton
                      variant="democratic-governance"
                      onClick={() => {
                        // TODO: Navigate to full membership application
                        console.log('Navigate to full CBS membership application');
                      }}
                    >
                      Apply for Full Membership
                    </LiberationButton>
                  </div>
                </div>

                {/* Member Benefits */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-liberation-black-power mb-4">Member Rights & Benefits</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Democratic Rights:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Vote on policies</li>
                        <li>• Propose changes</li>
                        <li>• Elect representatives</li>
                        <li>• Request special meetings</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Information Access:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Annual reports</li>
                        <li>• Financial statements</li>
                        <li>• Meeting minutes</li>
                        <li>• Strategic plans</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Community Benefits:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Priority support</li>
                        <li>• Member events</li>
                        <li>• Skill sharing</li>
                        <li>• Network access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'transparency' && (
            <section aria-labelledby="transparency-heading">
              <h3 id="transparency-heading" className="text-xl font-bold text-liberation-black-power mb-6">
                Transparency Reports & Meeting Minutes
              </h3>
              <div className="space-y-6">
                {/* Recent Reports */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-liberation-black-power mb-4">📋 Recent Meeting Reports</h4>
                  <div className="space-y-4">
                    {[
                      { date: '2024-12-15', title: 'Annual General Meeting 2024', type: 'AGM', status: 'Published' },
                      { date: '2024-11-20', title: 'Community Council Meeting', type: 'Council', status: 'Published' },
                      { date: '2024-10-15', title: 'Financial Review Committee', type: 'Committee', status: 'Published' },
                      { date: '2024-09-30', title: 'Platform Development Discussion', type: 'Special', status: 'Draft' },
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded border">
                        <div>
                          <h5 className="font-medium text-liberation-black-power">{report.title}</h5>
                          <div className="text-sm text-gray-600">
                            {report.date} • {report.type} Meeting
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            report.status === 'Published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          )}>
                            {report.status}
                          </span>
                          <LiberationButton
                            variant="outline"
                            size="sm"
                            onClick={() => console.log('View report:', report.title)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </LiberationButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meeting Schedule */}
                <div className="bg-liberation-pride-purple/10 border border-liberation-pride-purple/20 rounded-lg p-6">
                  <h4 className="font-semibold text-liberation-pride-purple mb-4">📅 Upcoming Meetings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>Community Council Meeting</strong>
                        <div className="text-sm text-gray-600">Monthly governance review</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">January 15, 2025</div>
                        <div className="text-sm text-gray-600">7:00 PM GMT</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>Annual General Meeting</strong>
                        <div className="text-sm text-gray-600">Year-end review and planning</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">March 20, 2025</div>
                        <div className="text-sm text-gray-600">6:00 PM GMT</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-liberation-pride-purple/20">
                    <p className="text-sm text-gray-600 mb-3">
                      All members are welcome to attend. Meeting links and agendas are sent 48 hours in advance.
                    </p>
                    <LiberationButton
                      variant="community-engagement"
                      size="sm"
                      onClick={() => console.log('Subscribe to meeting notifications')}
                    >
                      Get Meeting Notifications
                    </LiberationButton>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'financial' && (
            <section aria-labelledby="financial-heading">
              <h3 id="financial-heading" className="text-xl font-bold text-liberation-black-power mb-6">
                Statutory Financial Reporting
              </h3>
              <div className="space-y-6">
                {/* CBS Financial Transparency */}
                <div className="bg-liberation-healing-sage/10 border border-liberation-healing-sage/20 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <DollarSign className="h-6 w-6 text-liberation-healing-sage" />
                    <h4 className="text-lg font-semibold text-liberation-healing-sage">CBS Financial Transparency</h4>
                  </div>
                  <p className="text-sm mb-4">
                    As a Community Benefit Society, we are required to maintain transparent financial reporting
                    for all members. All profits are reinvested in community benefit activities.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Asset Lock Protection:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Community assets protected from extraction</li>
                        <li>• Surplus reinvested in community benefit</li>
                        <li>• No shareholder profit distribution</li>
                        <li>• Democratic financial governance</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Creator Compensation:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Fair compensation at agreed rates</li>
                        <li>• Democratic rate setting process</li>
                        <li>• Transparent payment structures</li>
                        <li>• Community oversight of compensation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Financial Reports */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-liberation-black-power">📊 Annual Financial Reports</h4>
                  {[
                    { year: '2024', status: 'Published', audited: true, deadline: '2025-03-31' },
                    { year: '2023', status: 'Published', audited: true, deadline: '2024-03-31' },
                    { year: '2022', status: 'Published', audited: false, deadline: '2023-03-31' },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                      <div>
                        <h5 className="font-medium">Annual Report {report.year}</h5>
                        <div className="text-sm text-gray-600">
                          {report.audited ? 'Independent audit completed' : 'Internal review completed'}
                          • Filed by {report.deadline}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {report.audited && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            Audited
                          </span>
                        )}
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          {report.status}
                        </span>
                        <LiberationButton
                          variant="outline"
                          size="sm"
                          onClick={() => console.log('Download report:', report.year)}
                        >
                          Download
                        </LiberationButton>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current Financial Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-liberation-black-power mb-4">💰 Current Year Summary</h4>
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white p-4 rounded">
                      <div className="text-2xl font-bold text-liberation-pride-purple">£12,450</div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="bg-white p-4 rounded">
                      <div className="text-2xl font-bold text-liberation-healing-sage">£8,200</div>
                      <div className="text-sm text-gray-600">Creator Compensation</div>
                    </div>
                    <div className="bg-white p-4 rounded">
                      <div className="text-2xl font-bold text-liberation-sovereignty-gold">£2,100</div>
                      <div className="text-sm text-gray-600">Platform Operations</div>
                    </div>
                    <div className="bg-white p-4 rounded">
                      <div className="text-2xl font-bold text-liberation-red-liberation">£2,150</div>
                      <div className="text-sm text-gray-600">Community Programs</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Last updated: December 2024 • Full annual report available March 2025</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'ideas' && (
            <section aria-labelledby="ideas-heading">
              <h3 id="ideas-heading" className="text-xl font-bold text-liberation-black-power mb-6">
                New Ideas & Community Suggestions
              </h3>
              <div className="space-y-6">
                {/* Idea Submission */}
                <div className="bg-liberation-sovereignty-gold/10 border border-liberation-sovereignty-gold/20 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Lightbulb className="h-6 w-6 text-liberation-sovereignty-gold" />
                    <h4 className="text-lg font-semibold text-liberation-sovereignty-gold">Share Your Ideas</h4>
                  </div>
                  <p className="text-sm mb-4">
                    Have an idea to improve our platform or community? Share it here for community discussion
                    and potential development into formal proposals.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="idea-title" className="block text-sm font-medium text-liberation-black-power mb-2">
                        Idea Title
                      </label>
                      <input
                        id="idea-title"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-sovereignty-gold focus:border-liberation-sovereignty-gold"
                        placeholder="Brief, descriptive title for your idea"
                      />
                    </div>
                    <div>
                      <label htmlFor="idea-description" className="block text-sm font-medium text-liberation-black-power mb-2">
                        Description & Benefits
                      </label>
                      <textarea
                        id="idea-description"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-sovereignty-gold focus:border-liberation-sovereignty-gold"
                        placeholder="Describe your idea and how it could benefit the community..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <LiberationButton
                        variant="community-engagement"
                        onClick={() => console.log('Submit new idea')}
                      >
                        Submit Idea
                      </LiberationButton>
                      <LiberationButton
                        variant="outline"
                        onClick={() => console.log('Save draft idea')}
                      >
                        Save Draft
                      </LiberationButton>
                    </div>
                  </div>
                </div>

                {/* Recent Ideas */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-liberation-black-power">💡 Recent Community Ideas</h4>
                  {[
                    {
                      title: 'Mobile App for Platform Access',
                      author: 'Community Member',
                      date: '2024-12-10',
                      comments: 8,
                      status: 'Under Review'
                    },
                    {
                      title: 'Mental Health Support Resources',
                      author: 'Community Member',
                      date: '2024-12-05',
                      comments: 15,
                      status: 'In Discussion'
                    },
                    {
                      title: 'Creator Mentorship Program',
                      author: 'Community Member',
                      date: '2024-11-28',
                      comments: 23,
                      status: 'Proposal Draft'
                    },
                  ].map((idea, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded border hover:border-liberation-sovereignty-gold/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-liberation-black-power">{idea.title}</h5>
                        <span className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          idea.status === 'Proposal Draft' ? 'bg-green-100 text-green-800' :
                          idea.status === 'In Discussion' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        )}>
                          {idea.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        By {idea.author} • {idea.date} • {idea.comments} comments
                      </div>
                      <div className="flex space-x-3">
                        <LiberationButton
                          variant="outline"
                          size="sm"
                          onClick={() => console.log('View idea:', idea.title)}
                        >
                          View & Comment
                        </LiberationButton>
                        <LiberationButton
                          variant="outline"
                          size="sm"
                          onClick={() => console.log('Support idea:', idea.title)}
                        >
                          👍 Support
                        </LiberationButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'partnerships' && (
            <section aria-labelledby="partnerships-heading">
              <h3 id="partnerships-heading" className="text-xl font-bold text-liberation-black-power mb-6">
                Partnership Opportunities
              </h3>
              <div className="space-y-6">
                {/* Partnership Principles */}
                <div className="bg-liberation-red-liberation/10 border border-liberation-red-liberation/20 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Handshake className="h-6 w-6 text-liberation-red-liberation" />
                    <h4 className="text-lg font-semibold text-liberation-red-liberation">Partnership Values</h4>
                  </div>
                  <p className="text-sm mb-4">
                    We seek partnerships that align with our liberation values and community benefit mission.
                    All partnerships must respect our CBS structure and community governance.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>We Value Partners Who:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Respect community autonomy</li>
                        <li>• Share liberation values</li>
                        <li>• Support Black queer communities</li>
                        <li>• Practice ethical business</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Partnership Areas:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Technology development</li>
                        <li>• Community programming</li>
                        <li>• Educational resources</li>
                        <li>• Mutual aid networks</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Partnership Suggestion Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-liberation-black-power mb-4">🤝 Suggest a Partnership</h4>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="partner-name" className="block text-sm font-medium text-liberation-black-power mb-2">
                          Organization/Partner Name
                        </label>
                        <input
                          id="partner-name"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-red-liberation focus:border-liberation-red-liberation"
                          placeholder="Name of potential partner"
                        />
                      </div>
                      <div>
                        <label htmlFor="partnership-type" className="block text-sm font-medium text-liberation-black-power mb-2">
                          Partnership Type
                        </label>
                        <select
                          id="partnership-type"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-red-liberation focus:border-liberation-red-liberation"
                        >
                          <option value="">Select type</option>
                          <option value="technology">Technology</option>
                          <option value="community">Community Programs</option>
                          <option value="education">Education</option>
                          <option value="mutual-aid">Mutual Aid</option>
                          <option value="advocacy">Advocacy</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="partnership-description" className="block text-sm font-medium text-liberation-black-power mb-2">
                        Partnership Description & Benefits
                      </label>
                      <textarea
                        id="partnership-description"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-red-liberation focus:border-liberation-red-liberation"
                        placeholder="Describe the potential partnership and how it aligns with our community benefit mission..."
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-info" className="block text-sm font-medium text-liberation-black-power mb-2">
                        Your Contact Information
                      </label>
                      <input
                        id="contact-info"
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-red-liberation focus:border-liberation-red-liberation"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <LiberationButton
                      variant="community-engagement"
                      onClick={() => console.log('Submit partnership suggestion')}
                    >
                      Submit Partnership Suggestion
                    </LiberationButton>
                  </div>
                </div>

                {/* Current Partnerships */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-liberation-black-power">🌟 Current Community Partnerships</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'Local Mutual Aid Network',
                        type: 'Community Support',
                        description: 'Coordinated resource sharing and emergency support',
                        status: 'Active'
                      },
                      {
                        name: 'Liberation Tech Collective',
                        type: 'Technology',
                        description: 'Open-source development and platform security',
                        status: 'Active'
                      },
                      {
                        name: 'Black Queer Artists Alliance',
                        type: 'Cultural',
                        description: 'Creative collaboration and cultural programming',
                        status: 'Developing'
                      },
                      {
                        name: 'Community Health Initiative',
                        type: 'Wellbeing',
                        description: 'Mental health resources and trauma-informed care',
                        status: 'Proposed'
                      },
                    ].map((partnership, index) => (
                      <div key={index} className="p-4 bg-white border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-liberation-black-power">{partnership.name}</h5>
                          <span className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            partnership.status === 'Active' ? 'bg-green-100 text-green-800' :
                            partnership.status === 'Developing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          )}>
                            {partnership.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{partnership.type}</div>
                        <p className="text-sm">{partnership.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};