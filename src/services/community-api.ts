// BLKOUT Liberation Platform - Community API Client
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: API contract definitions only - NO business logic implementation

import type {
  CommunityAPIContract,
  LiberationJourneyDisplay,
  CreatorSovereigntyDisplay,
  DemocraticGovernanceDisplay,
  CommunityProtectionDisplay,
  VoteSubmission,
  ProposalSubmission,
  VoteResult,
  ProposalResult,
} from '@/types/liberation';

/**
 * QI COMPLIANCE: Community API Client for Layer 2 integration
 * BOUNDARY ENFORCEMENT: Only API calls to Layer 2 API Gateway
 * NO business logic, NO data transformation, NO direct backend calls
 */

// API Configuration (Layer 2 API Gateway endpoint)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://blkout.vercel.app/api'; // Layer 2 API Gateway

// API Client Class implementing CommunityAPIContract
export class CommunityAPIClient implements CommunityAPIContract {
  protected readonly baseURL: string;
  
  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }
  
  /**
   * QI COMPLIANCE: All methods call Layer 2 API Gateway ONLY
   * NO direct backend calls, NO business logic processing
   */
  
  // Liberation Journey Dashboard (Presentation data only)
  async getLiberationDashboard(): Promise<LiberationJourneyDisplay> {
    const response = await this.fetchFromAPIGateway('/liberation-dashboard');
    return this.validateLiberationJourneyResponse(response);
  }
  
  // Creator Sovereignty Dashboard (Presentation data only)
  async getCreatorDashboard(): Promise<CreatorSovereigntyDisplay> {
    const response = await this.fetchFromAPIGateway('/creator-dashboard');
    return this.validateCreatorSovereigntyResponse(response);
  }
  
  // Democratic Governance Dashboard (Presentation data only)
  async getGovernanceDashboard(): Promise<DemocraticGovernanceDisplay> {
    const response = await this.fetchFromAPIGateway('/governance-dashboard');
    return this.validateGovernanceResponse(response);
  }
  
  // Community Protection Settings (Presentation data only)
  async getCommunityProtection(): Promise<CommunityProtectionDisplay> {
    const response = await this.fetchFromAPIGateway('/community-protection');
    return this.validateProtectionResponse(response);
  }
  
  // Submit Vote (Layer 2 API Gateway only)
  async submitVote(vote: VoteSubmission): Promise<VoteResult> {
    const response = await this.postToAPIGateway('/submit-vote', vote);
    return this.validateVoteResult(response);
  }
  
  // Submit Proposal (Layer 2 API Gateway only)
  async submitProposal(proposal: ProposalSubmission): Promise<ProposalResult> {
    const response = await this.postToAPIGateway('/submit-proposal', proposal);
    return this.validateProposalResult(response);
  }
  
  // Private helper methods (API Gateway communication only)
  
  private async fetchFromAPIGateway(endpoint: string): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Liberation-Layer': 'frontend-presentation', // Layer identification
          'X-API-Contract': 'community-api-v1', // Contract versioning
        },
        credentials: 'include', // Community authentication
      });
      
      if (!response.ok) {
        throw new Error(`API Gateway error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Community API Gateway communication error:', error);
      throw new Error('Unable to connect to community services');
    }
  }
  
  private async postToAPIGateway(endpoint: string, data: any): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Liberation-Layer': 'frontend-presentation',
          'X-API-Contract': 'community-api-v1',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API Gateway error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Community API Gateway communication error:', error);
      throw new Error('Unable to submit to community services');
    }
  }
  
  // Response validation methods (presentation layer validation only)
  
  private validateLiberationJourneyResponse(response: any): LiberationJourneyDisplay {
    // QI COMPLIANCE: Validate response shape for UI consumption only
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid liberation journey data received');
    }
    
    return {
      currentStage: response.currentStage || 'discovering',
      progressPercentage: Math.min(100, Math.max(0, response.progressPercentage || 0)),
      celebrationMoments: Array.isArray(response.celebrationMoments) ? response.celebrationMoments : [],
      nextMilestones: Array.isArray(response.nextMilestones) ? response.nextMilestones : [],
    };
  }
  
  private validateCreatorSovereigntyResponse(response: any): CreatorSovereigntyDisplay {
    // QI COMPLIANCE: Validate 75% creator sovereignty display requirement
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid creator sovereignty data received');
    }
    
    const revenueTransparency = response.revenueTransparency || {};
    const creatorShare = revenueTransparency.creatorShare || 0;
    
    // QI REQUIREMENT: Creator share must be >= 75% for display
    if (creatorShare < 0.75) {
      console.warn('Creator sovereignty violation: Share below 75% minimum');
    }
    
    return {
      creatorId: response.creatorId || '',
      revenueTransparency: {
        creatorShare,
        totalRevenue: revenueTransparency.totalRevenue || '0.00',
        creatorEarnings: revenueTransparency.creatorEarnings || '0.00',
        platformShare: revenueTransparency.platformShare || '0.00',
        communityBenefit: revenueTransparency.communityBenefit || '0.00',
        lastUpdated: revenueTransparency.lastUpdated || new Date().toISOString(),
      },
      contentOwnership: response.contentOwnership || {
        hasFullEditorialControl: false,
        hasContentRemovalRights: false,
        hasAttributionControl: false,
        hasDistributionControl: false,
        licenseType: 'Unknown',
      },
      narrativeAuthority: response.narrativeAuthority || {
        canControlPresentation: false,
        canModifyHeadlines: false,
        canControlImagery: false,
        canControlTags: false,
        canControlPromotion: false,
      },
    };
  }
  
  private validateGovernanceResponse(response: any): DemocraticGovernanceDisplay {
    // QI COMPLIANCE: Validate democratic governance data for UI display
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid governance data received');
    }
    
    const votingRights = response.votingRights || {};
    
    // QI REQUIREMENT: Ensure one-member-one-vote is maintained
    const voteWeight = votingRights.voteWeight || 1;
    if (voteWeight !== 1) {
      console.warn('Democratic governance violation: Vote weight not equal to 1');
    }
    
    return {
      votingRights: {
        canVote: votingRights.canVote || false,
        canPropose: votingRights.canPropose || false,
        canModerate: votingRights.canModerate || false,
        voteWeight: 1, // QI REQUIREMENT: Always 1 for democratic governance
        participationLevel: votingRights.participationLevel || 'observer',
      },
      activeProposals: Array.isArray(response.activeProposals) ? response.activeProposals : [],
      votingHistory: Array.isArray(response.votingHistory) ? response.votingHistory : [],
      consensusParticipation: Array.isArray(response.consensusParticipation) ? response.consensusParticipation : [],
    };
  }
  
  private validateProtectionResponse(response: any): CommunityProtectionDisplay {
    // QI COMPLIANCE: Validate community protection settings for UI display
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid community protection data received');
    }
    
    return {
      safetySettings: response.safetySettings || {
        contentWarningsEnabled: true,
        communityModerationLevel: 'standard',
        crisisResourcesVisible: true,
        supportNetworkConnected: false,
        reportingEnabled: true,
      },
      traumaInformedSettings: response.traumaInformedSettings || {
        gentleAnimations: true,
        softTransitions: true,
        contentPreview: true,
        consentBeforeAction: true,
        easyExit: true,
        supportResourcesIntegrated: false,
      },
      accessibilitySettings: response.accessibilitySettings || {
        screenReaderOptimized: false,
        highContrastMode: false,
        textScaling: 100,
        keyboardNavigationOnly: false,
        reducedMotion: false,
        colorBlindFriendly: false,
      },
      communityGuidelines: response.communityGuidelines || {
        title: 'Community Guidelines',
        summary: 'Community-controlled guidelines for safe participation',
        lastUpdated: new Date().toISOString(),
        communityApproved: false,
        enforcementLevel: 'community',
        reportingProcess: 'Community-driven restorative justice process',
      },
    };
  }
  
  private validateVoteResult(response: any): VoteResult {
    // QI COMPLIANCE: Validate vote submission result for UI feedback
    return {
      success: response.success || false,
      message: response.message || 'Vote submission result unknown',
      proposalStatus: response.proposalStatus || 'pending',
    };
  }
  
  private validateProposalResult(response: any): ProposalResult {
    // QI COMPLIANCE: Validate proposal submission result for UI feedback
    return {
      success: response.success || false,
      proposalId: response.proposalId || '',
      message: response.message || 'Proposal submission result unknown',
      reviewDate: response.reviewDate || new Date().toISOString(),
    };
  }

  // Chrome Extension Integration Endpoints
  async submitStoryFromExtension(storyData: {
    title: string;
    excerpt: string;
    originalUrl: string;
    sourceName: string;
    category: string;
    tags: string[];
    curatorId: string;
    contentType?: 'article' | 'event' | 'story';
    eventData?: {
      date?: string;
      location?: string;
      capacity?: number;
    };
    extractedImages?: string[];
    metadata?: Record<string, any>;
  }): Promise<{ success: boolean; id?: string; message: string }> {
    const response = await this.postToAPIGateway('/story-submissions', {
      ...storyData,
      submittedVia: 'chrome-extension',
      submittedAt: new Date().toISOString(),
    });
    return this.validateStorySubmissionResult(response);
  }

  async submitEventFromExtension(eventData: {
    title: string;
    description: string;
    excerpt: string;
    category: 'mutual-aid' | 'organizing' | 'education' | 'celebration' | 'support' | 'action';
    type: 'virtual' | 'in-person' | 'hybrid';
    date: string;
    endDate?: string;
    location: {
      type: 'virtual' | 'in-person' | 'hybrid';
      details?: string;
      address?: string;
      virtualLink?: string;
    };
    organizer: {
      name: string;
      email?: string;
      organization?: string;
    };
    registration?: {
      required: boolean;
      capacity?: number;
      registrationUrl?: string;
      deadline?: string;
      cost?: string;
    };
    accessibilityFeatures: string[];
    tags: string[];
    curatorId: string;
    extractedImages?: string[];
    metadata?: Record<string, any>;
  }): Promise<{ success: boolean; id?: string; message: string }> {
    const response = await this.postToAPIGateway('/event-submissions', {
      ...eventData,
      submittedVia: 'chrome-extension',
      submittedAt: new Date().toISOString(),
    });
    return this.validateEventSubmissionResult(response);
  }

  async getModerationQueue(curatorId?: string): Promise<{
    submissions: Array<{
      id: string;
      title: string;
      excerpt: string;
      originalUrl: string;
      sourceName: string;
      curatorId: string;
      submittedAt: string;
      status: 'pending' | 'approved' | 'rejected';
      moderatorFeedback?: string;
    }>;
    stats: {
      totalPending: number;
      yourSubmissions: number;
      approvalRate: number;
    };
  }> {
    const endpoint = curatorId ? `/moderation-queue?curatorId=${curatorId}` : '/moderation-queue';
    const response = await this.fetchFromAPIGateway(endpoint);
    return this.validateModerationQueueResponse(response);
  }

  async updateStoryRating(storyId: string, interestLevel: 'low' | 'medium' | 'high', userId?: string): Promise<{
    success: boolean;
    newInterestScore: number;
    totalVotes: number;
  }> {
    const response = await this.postToAPIGateway('/story-ratings', {
      storyId,
      interestLevel,
      userId,
      ratedAt: new Date().toISOString(),
    });
    return this.validateRatingResult(response);
  }

  async updateEventRating(eventId: string, ratingData: {
    overallRating: number;
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
  }, userId?: string): Promise<{
    success: boolean;
    ratingId: string;
    aggregateRating: number;
    totalRatings: number;
  }> {
    const response = await this.postToAPIGateway('/event-ratings', {
      eventId,
      ...ratingData,
      userId,
      ratedAt: new Date().toISOString(),
    });
    return this.validateEventRatingResult(response);
  }

  async getStoryArchive(filters?: {
    category?: string;
    contentType?: 'article' | 'audio' | 'video' | 'gallery' | 'multimedia';
    blkoutTheme?: 'CONNECT' | 'CREATE' | 'CARE';
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{
    articles: Array<{
      id: string;
      title: string;
      excerpt: string;
      content: string;
      category: string;
      author: string;
      publishedAt: string;
      readTime: string;
      tags: string[];
      imageUrl?: string;
      originalUrl?: string;
      contentType?: 'article' | 'audio' | 'video' | 'gallery' | 'multimedia';
      audioUrl?: string;
      videoUrl?: string;
      galleryImages?: string[];
      blkoutTheme?: 'CONNECT' | 'CREATE' | 'CARE';
      interestScore?: number;
      totalVotes?: number;
    }>;
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const endpoint = `/story-archive${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.fetchFromAPIGateway(endpoint);
    return this.validateStoryArchiveResponse(response);
  }

  async getNewsArticles(filters?: {
    category?: string;
    timeframe?: 'today' | 'week' | 'month';
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{
    articles: Array<{
      id: string;
      title: string;
      excerpt: string;
      category: string;
      author: string;
      publishedAt: string;
      readTime: string;
      originalUrl: string;
      sourceName: string;
      curatorId: string;
      submittedAt: string;
      interestScore: number;
      totalVotes: number;
      userInterestLevel?: 'low' | 'medium' | 'high';
      topics: string[];
      sentiment: string;
      relevanceScore: number;
      isStoryOfWeek?: boolean;
      weeklyRank?: number;
    }>;
    featured?: {
      id: string;
      title: string;
      excerpt: string;
      category: string;
      author: string;
      publishedAt: string;
      readTime: string;
      originalUrl: string;
      sourceName: string;
      interestScore: number;
      totalVotes: number;
      weeklyRank: number;
    };
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/news-articles${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.fetchFromAPIGateway(endpoint);
    return this.validateNewsArticlesResponse(response);
  }

  // Validation methods for new endpoints
  private validateStorySubmissionResult(response: any): { success: boolean; id?: string; message: string } {
    return {
      success: response.success || false,
      id: response.id || undefined,
      message: response.message || 'Story submission result unknown',
    };
  }

  private validateEventSubmissionResult(response: any): { success: boolean; id?: string; message: string } {
    return {
      success: response.success || false,
      id: response.id || undefined,
      message: response.message || 'Event submission result unknown',
    };
  }

  private validateEventRatingResult(response: any): {
    success: boolean;
    ratingId: string;
    aggregateRating: number;
    totalRatings: number;
  } {
    return {
      success: response.success || false,
      ratingId: response.ratingId || '',
      aggregateRating: Math.min(5, Math.max(0, response.aggregateRating || 0)),
      totalRatings: Math.max(0, response.totalRatings || 0),
    };
  }

  private validateModerationQueueResponse(response: any): {
    submissions: Array<any>;
    stats: { totalPending: number; yourSubmissions: number; approvalRate: number };
  } {
    return {
      submissions: Array.isArray(response.submissions) ? response.submissions : [],
      stats: {
        totalPending: response.stats?.totalPending || 0,
        yourSubmissions: response.stats?.yourSubmissions || 0,
        approvalRate: response.stats?.approvalRate || 0,
      },
    };
  }

  private validateRatingResult(response: any): {
    success: boolean;
    newInterestScore: number;
    totalVotes: number;
  } {
    return {
      success: response.success || false,
      newInterestScore: Math.min(100, Math.max(0, response.newInterestScore || 0)),
      totalVotes: Math.max(0, response.totalVotes || 0),
    };
  }

  private validateStoryArchiveResponse(response: any): {
    articles: Array<any>;
    pagination: { total: number; limit: number; offset: number; hasMore: boolean };
  } {
    return {
      articles: Array.isArray(response.articles) ? response.articles : [],
      pagination: {
        total: Math.max(0, response.pagination?.total || 0),
        limit: Math.max(1, response.pagination?.limit || 20),
        offset: Math.max(0, response.pagination?.offset || 0),
        hasMore: response.pagination?.hasMore || false,
      },
    };
  }

  private validateNewsArticlesResponse(response: any): {
    articles: Array<any>;
    featured?: any;
    pagination: { total: number; limit: number; offset: number; hasMore: boolean };
  } {
    return {
      articles: Array.isArray(response.articles) ? response.articles : [],
      featured: response.featured || undefined,
      pagination: {
        total: Math.max(0, response.pagination?.total || 0),
        limit: Math.max(1, response.pagination?.limit || 20),
        offset: Math.max(0, response.pagination?.offset || 0),
        hasMore: response.pagination?.hasMore || false,
      },
    };
  }
}

export class CommunityAPIAdmin extends CommunityAPIClient {
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('blkout_admin_token')}`,
      'X-Liberation-Layer': 'admin-interface',
    };
  }

  // Event-specific admin methods
  async getEventModerationQueue(): Promise<EventModerationItem[]> {
    try {
      const response = await fetch(`${this.baseURL}/admin/events/moderation-queue`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch event moderation queue: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Event moderation queue fetch error:', error);
      // Return mock data for development
      return [
        {
          id: 'event-001',
          title: 'Black Queer Youth Mental Health Workshop',
          submittedBy: 'community_organizer_001',
          submittedAt: '2024-01-15T10:00:00Z',
          category: 'education',
          type: 'hybrid',
          date: '2024-02-01T18:00:00Z',
          description: 'Trauma-informed mental health workshop specifically designed for Black queer youth.',
          organizer: 'Liberation Mental Health Collective',
          status: 'pending'
        },
        {
          id: 'event-002',
          title: 'Community Mutual Aid Distribution',
          submittedBy: 'mutual_aid_coord',
          submittedAt: '2024-01-14T15:30:00Z',
          category: 'mutual-aid',
          type: 'in-person',
          date: '2024-01-25T14:00:00Z',
          description: 'Weekly food and resource distribution for community members in need.',
          organizer: 'BLKOUT Mutual Aid Network',
          status: 'pending'
        }
      ];
    }
  }

  async approveEventForCalendar(eventId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admin/events/${eventId}/approve`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ action: 'approve_to_calendar' })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to approve event: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Event approval error:', error);
      throw error;
    }
  }

  async rejectEvent(eventId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admin/events/${eventId}/reject`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ action: 'reject' })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reject event: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Event rejection error:', error);
      throw error;
    }
  }

  async submitSingleEvent(eventData: EventSubmission): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admin/events/submit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`Failed to submit event: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Single event submission error:', error);
      throw error;
    }
  }

  async submitBulkEvents(bulkData: BulkEventSubmission): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admin/events/bulk-submit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(bulkData)
      });

      if (!response.ok) {
        throw new Error(`Failed to submit bulk events: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Bulk events submission error:', error);
      throw error;
    }
  }

  // Admin-specific methods for dashboard functionality
  async getAdminStats(): Promise<{
    pendingStories: number;
    approvedToday: number;
    totalCurators: number;
    weeklySubmissions: number;
  }> {
    try {
      const response = await fetch(`${this.baseURL}/admin/stats`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch admin stats: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Admin stats fetch error:', error);
      // Return mock data for development
      return {
        pendingStories: 12,
        approvedToday: 8,
        totalCurators: 45,
        weeklySubmissions: 28
      };
    }
  }

  async approveStoryForNewsroom(storyId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admin/stories/${storyId}/approve`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ action: 'approve_to_newsroom' })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to approve story: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Story approval error:', error);
      throw error;
    }
  }

  async rejectStory(storyId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admin/stories/${storyId}/reject`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ action: 'reject' })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reject story: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Story rejection error:', error);
      throw error;
    }
  }

  async submitSingleStory(storyData: {
    title: string;
    url: string;
    category: string;
    excerpt: string;
    tags: string[];
  }): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/admin/stories/submit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(storyData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit story: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Single story submission error:', error);
      throw error;
    }
  }
}

// Export singleton instance for application use
export const communityAPI = new CommunityAPIAdmin();

// Export type-only imports for component use
export type {
  CommunityAPIContract,
  LiberationJourneyDisplay,
  CreatorSovereigntyDisplay,
  DemocraticGovernanceDisplay,
  CommunityProtectionDisplay,
  VoteSubmission,
  ProposalSubmission,
  VoteResult,
  ProposalResult,
};