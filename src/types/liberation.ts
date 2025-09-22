// BLKOUT Liberation Platform - Frontend Types
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Presentation types only - NO business logic

/**
 * QI COMPLIANCE: These types define ONLY presentation layer contracts
 * NO business logic, NO data persistence, NO API implementation details
 */

// Liberation Journey Types (Presentation Only)
export interface LiberationJourneyDisplay {
  readonly currentStage: 'discovering' | 'healing' | 'empowered' | 'organizing';
  readonly progressPercentage: number; // 0-100 for UI display
  readonly celebrationMoments: CelebrationMoment[];
  readonly nextMilestones: Milestone[];
}

export interface CelebrationMoment {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly achievedDate: string; // ISO string for display
  readonly joyLevel: 'gentle' | 'moderate' | 'celebration' | 'revolutionary';
}

export interface Milestone {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly targetDate?: string; // ISO string for display
}

// Creator Sovereignty Types (Presentation Only)
export interface CreatorSovereigntyDisplay {
  readonly creatorId: string;
  readonly revenueTransparency: RevenueTransparencyDisplay;
  readonly contentOwnership: ContentOwnershipDisplay;
  readonly narrativeAuthority: NarrativeAuthorityDisplay;
}

export interface RevenueTransparencyDisplay {
  readonly creatorShare: number; // Must display >= 0.75 (75%)
  readonly totalRevenue: string; // Formatted currency string
  readonly creatorEarnings: string; // Formatted currency string
  readonly platformShare: string; // Formatted currency string
  readonly communityBenefit: string; // Formatted currency string
  readonly lastUpdated: string; // ISO string for display
}

export interface ContentOwnershipDisplay {
  readonly hasFullEditorialControl: boolean;
  readonly hasContentRemovalRights: boolean;
  readonly hasAttributionControl: boolean;
  readonly hasDistributionControl: boolean;
  readonly licenseType: string;
}

export interface NarrativeAuthorityDisplay {
  readonly canControlPresentation: boolean;
  readonly canModifyHeadlines: boolean;
  readonly canControlImagery: boolean;
  readonly canControlTags: boolean;
  readonly canControlPromotion: boolean;
}

// Democratic Governance Types (Presentation Only)
export interface DemocraticGovernanceDisplay {
  readonly votingRights: VotingRightsDisplay;
  readonly activeProposals: ProposalDisplay[];
  readonly votingHistory: VoteHistoryDisplay[];
  readonly consensusParticipation: ConsensusDisplay[];
  readonly revenueTransparency?: RevenueTransparencyDisplay;
  readonly resourceAllocations?: ResourceAllocationDisplay[];
  readonly communityMetrics?: CommunityMetricsDisplay;
}

export interface VotingRightsDisplay {
  readonly canVote: boolean;
  readonly canPropose: boolean;
  readonly canModerate: boolean;
  readonly voteWeight: number; // Always 1 for one-member-one-vote
  readonly participationLevel: 'observer' | 'voter' | 'proposer' | 'facilitator' | 'admin';
}

export interface ProposalDisplay {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly summary: string;
  readonly category: 'platform_governance' | 'community_guidelines' | 'resource_allocation' | 'policy_change' | 'creator_sovereignty' | 'safety_measures';
  readonly priorityLevel: 'low' | 'medium' | 'high' | 'critical';
  readonly votingType: 'consensus' | 'majority' | 'supermajority' | 'quadratic' | 'weighted';
  readonly proposer: string;
  readonly submissionDate: string;
  readonly votingDeadline: string;
  readonly votingStartDate?: string;
  readonly currentSupport: number; // percentage 0-100
  readonly status: 'draft' | 'active' | 'voting' | 'passed' | 'rejected' | 'implemented' | 'archived' | 'blocked_for_revision';
  readonly currentVotes?: VoteTallyDisplay;
  readonly discussionCount?: number;
  readonly liberationImpact?: LiberationImpactDisplay;
}

export interface VoteTallyDisplay {
  readonly totalVotes: number;
  readonly supportVotes: number;
  readonly opposeVotes: number;
  readonly abstainVotes: number;
  readonly blockVotes: number;
  readonly delegateVotes: number;
}

export interface VoteHistoryDisplay {
  readonly proposalId: string;
  readonly proposalTitle: string;
  readonly proposalCategory: string;
  readonly proposalStatus: string;
  readonly vote: 'support' | 'oppose' | 'abstain' | 'block' | 'delegate';
  readonly votedAt: string;
  readonly rationale?: string;
  readonly confidenceLevel?: number;
}

export interface ConsensusDisplay {
  readonly consensusLevel: number; // 0-100 percentage
  readonly supportLevel: number; // 0-100 percentage
  readonly blockers: number;
  readonly discussionPoints: string[];
}

export interface LiberationImpactDisplay {
  readonly creatorSovereignty: number; // -1 to 1
  readonly communitySafety: number; // -1 to 1
  readonly culturalAuthenticity: number; // -1 to 1
  readonly democraticGovernance: number; // -1 to 1
}

export interface ResourceAllocationDisplay {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly amount: string; // formatted currency
  readonly category: 'platform_development' | 'community_support' | 'creator_payments' | 'moderation' | 'infrastructure' | 'events' | 'advocacy';
  readonly status: 'allocated' | 'in_progress' | 'completed' | 'cancelled';
  readonly allocatedDate: string;
  readonly completionDate?: string;
  readonly actualSpent: string; // formatted currency
  readonly proposalLinked: boolean;
  readonly emergencyAllocation: boolean;
  readonly impactScores: {
    readonly communityBenefit: number;
    readonly creatorSovereignty: number;
  };
}

export interface CommunityMetricsDisplay {
  readonly totalMembers: number;
  readonly activeVoters: number;
  readonly proposalsThisMonth: number;
  readonly consensusRate: number; // percentage
}

// Community Protection Types (Presentation Only)
export interface CommunityProtectionDisplay {
  readonly safetySettings: SafetySettingsDisplay;
  readonly traumaInformedSettings: TraumaInformedDisplay;
  readonly accessibilitySettings: AccessibilityDisplay;
  readonly communityGuidelines: CommunityGuidelinesDisplay;
}

export interface SafetySettingsDisplay {
  readonly contentWarningsEnabled: boolean;
  readonly triggerTopicFiltering: boolean;
  readonly communityModerationActive: boolean;
  readonly crisisSupportAvailable: boolean;
}

export interface TraumaInformedDisplay {
  readonly gentleAnimations: boolean;
  readonly reducedMotion: boolean;
  readonly consentBasedInteractions: boolean;
  readonly safeSpaceIndicators: boolean;
}

export interface AccessibilityDisplay {
  readonly screenReaderOptimized: boolean;
  readonly keyboardNavigationEnabled: boolean;
  readonly highContrastMode: boolean;
  readonly largeTextMode: boolean;
  readonly touchFriendlyInterface: boolean;
}

export interface CommunityGuidelinesDisplay {
  readonly guidelinesSummary: string;
  readonly lastUpdated: string;
  readonly communityApproved: boolean;
  readonly enforcementLevel: 'community' | 'moderated' | 'strict';
}

// Submission Types (Layer 2 Integration Only)
export interface VoteSubmission {
  readonly proposalId: string;
  readonly vote: 'support' | 'oppose' | 'abstain' | 'block' | 'delegate';
  readonly rationale?: string;
  readonly isAnonymous?: boolean;
  readonly confidenceLevel?: number;
  readonly delegatedToMemberId?: string;
}

export interface ProposalSubmission {
  readonly title: string;
  readonly description: string;
  readonly category: 'platform_governance' | 'community_guidelines' | 'resource_allocation' | 'policy_change' | 'creator_sovereignty' | 'safety_measures';
  readonly priorityLevel?: 'low' | 'medium' | 'high' | 'critical';
  readonly votingType?: 'consensus' | 'majority' | 'supermajority' | 'quadratic' | 'weighted';
  readonly consensusThreshold?: number;
  readonly votingDeadline: string;
  readonly anonymousVotingAllowed?: boolean;
  readonly resourceRequirements?: any;
  readonly creatorSovereigntyImpact?: number;
  readonly communitySafetyImpact?: number;
  readonly culturalAuthenticityImpact?: number;
  readonly democraticGovernanceImpact?: number;
}

export interface VoteResult {
  readonly success: boolean;
  readonly message: string;
  readonly voteId?: string;
}

export interface ProposalResult {
  readonly success: boolean;
  readonly message: string;
  readonly proposalId?: string;
}

// API Contract Types (Layer 2 Integration Only)
export interface CommunityAPIContract {
  // STRICT BOUNDARY: These define contract shape only, NO implementation
  readonly getLiberationDashboard: () => Promise<LiberationJourneyDisplay>;
  readonly getCreatorDashboard: () => Promise<CreatorSovereigntyDisplay>;
  readonly getGovernanceDashboard: () => Promise<DemocraticGovernanceDisplay>;
  readonly getCommunityProtection: () => Promise<CommunityProtectionDisplay>;
  readonly submitVote: (vote: VoteSubmission) => Promise<VoteResult>;
  readonly submitProposal: (proposal: ProposalSubmission) => Promise<ProposalResult>;
}

// Component Props Base Types
export interface BaseComponentProps {
  readonly className?: string;
  readonly 'data-testid'?: string;
  readonly 'aria-label'?: string;
  readonly traumaInformed?: boolean;
  readonly accessible?: boolean;
}

// Liberation Values Validation (Presentation Layer Only)
export interface LiberationValuesDisplay {
  readonly creatorSovereigntyVisible: boolean; // Must show >= 75%
  readonly communityProtectionActive: boolean;
  readonly democraticGovernanceEnabled: boolean;
  readonly blackQueerJoyEnabled: boolean;
  readonly antiOppressionUXActive: boolean;
  readonly culturalAuthenticityMaintained: boolean;
}

// Event Types for Community Calendar and Moderation
export interface CommunityEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly excerpt: string;
  readonly category: 'mutual-aid' | 'organizing' | 'education' | 'celebration' | 'support' | 'action';
  readonly type: 'virtual' | 'in-person' | 'hybrid';
  readonly date: string; // ISO string
  readonly endDate?: string; // ISO string
  readonly location: EventLocation;
  readonly organizer: EventOrganizer;
  readonly registration: EventRegistration;
  readonly accessibilityFeatures: string[];
  readonly traumaInformed: boolean;
  readonly communityGuidelines: boolean;
  readonly moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  readonly submittedAt: string;
  readonly submittedBy: string;
  readonly moderatedBy?: string;
  readonly moderatedAt?: string;
  readonly tags: string[];
  readonly imageUrl?: string;
  readonly externalUrl?: string;
  readonly communityRating?: number;
  readonly attendeeCount?: number;
  readonly reviews?: EventReview[];
}

export interface EventLocation {
  readonly type: 'virtual' | 'in-person' | 'hybrid';
  readonly details?: string;
  readonly address?: string;
  readonly city?: string;
  readonly state?: string;
  readonly country?: string;
  readonly virtualLink?: string;
  readonly accessibilityNotes?: string;
}

export interface EventOrganizer {
  readonly name: string;
  readonly email?: string;
  readonly organization?: string;
  readonly communityMember: boolean;
  readonly reputation?: number;
}

export interface EventRegistration {
  readonly required: boolean;
  readonly capacity?: number;
  readonly currentAttendees?: number;
  readonly registrationUrl?: string;
  readonly deadline?: string; // ISO string
  readonly cost?: string;
  readonly scholarshipsAvailable?: boolean;
}

export interface EventReview {
  readonly id: string;
  readonly eventId: string;
  readonly reviewerId: string;
  readonly reviewerName: string;
  readonly rating: number; // 1-5
  readonly title?: string;
  readonly content: string;
  readonly aspects: EventReviewAspects;
  readonly wouldRecommend: boolean;
  readonly attendedVirtually?: boolean;
  readonly submittedAt: string;
  readonly verified: boolean;
  readonly helpful: number;
}

export interface EventReviewAspects {
  readonly accessibility: number; // 1-5
  readonly traumaInformed: number; // 1-5
  readonly organization: number; // 1-5
  readonly communityValue: number; // 1-5
  readonly inclusion: number; // 1-5
}

// Event Submission Types
export interface EventSubmission {
  readonly title: string;
  readonly description: string;
  readonly excerpt: string;
  readonly category: 'mutual-aid' | 'organizing' | 'education' | 'celebration' | 'support' | 'action';
  readonly type: 'virtual' | 'in-person' | 'hybrid';
  readonly date: string;
  readonly endDate?: string;
  readonly location: Omit<EventLocation, 'accessibilityNotes'>;
  readonly organizer: Omit<EventOrganizer, 'reputation'>;
  readonly registration: EventRegistration;
  readonly accessibilityFeatures: string[];
  readonly tags: string[];
  readonly imageUrl?: string;
  readonly externalUrl?: string;
}

export interface BulkEventSubmission {
  readonly events: EventSubmission[];
  readonly submissionNotes?: string;
  readonly priority?: 'low' | 'medium' | 'high';
}

// Event Moderation Types
export interface EventModerationItem {
  readonly id: string;
  readonly title: string;
  readonly submittedBy: string;
  readonly submittedAt: string;
  readonly category: string;
  readonly type: string;
  readonly date: string;
  readonly description: string;
  readonly organizer: string;
  readonly status: 'pending' | 'approved' | 'rejected';
  readonly flagReason?: string;
  readonly moderationNotes?: string;
}

// News Article Types (Enhanced for Moderation)
export interface NewsArticle {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly description: string;
  readonly category: string;
  readonly submittedBy: string;
  readonly submittedAt: string;
  readonly imageUrl?: string;
  readonly tags: string[];
  readonly moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  readonly moderatedBy?: string;
  readonly moderatedAt?: string;
  readonly moderationNotes?: string;
  readonly communityRating?: number;
  readonly totalVotes: number;
  readonly interestScore: number;
  readonly relevanceScore: number;
  readonly curatorId: string;
}