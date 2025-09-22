// BLKOUT Liberation Platform - Governance API Endpoint
// Layer 2: API Gateway for Democratic Governance
// STRICT SEPARATION: API layer only - NO business logic

import { VercelRequest, VercelResponse } from '@vercel/node';

// Governance data structures following liberation principles
interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  proposedAt: string;
  votingDeadline: string;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  votes: {
    yes: number;
    no: number;
    abstain: number;
  };
  quorumRequired: number;
  consensusThreshold: number;
  category: 'platform' | 'community' | 'economic' | 'policy';
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface VotingRights {
  canVote: boolean;
  canPropose: boolean;
  canModerate: boolean;
  voteWeight: 1; // QI REQUIREMENT: Always 1 for democratic governance
  participationLevel: 'observer' | 'member' | 'organizer' | 'moderator';
}

interface DemocraticGovernanceDisplay {
  votingRights: VotingRights;
  activeProposals: GovernanceProposal[];
  votingHistory: any[];
  consensusParticipation: any[];
}

// Mock governance data respecting liberation values
const MOCK_GOVERNANCE_DATA: DemocraticGovernanceDisplay = {
  votingRights: {
    canVote: true,
    canPropose: true,
    canModerate: false,
    voteWeight: 1, // QI REQUIREMENT: Democratic equality
    participationLevel: 'member'
  },
  activeProposals: [
    {
      id: 'prop_001',
      title: 'Creator Revenue Share Increase to 80%',
      description: 'Proposal to increase minimum creator revenue share from 75% to 80% to enhance economic justice.',
      proposedBy: 'Community Economics Working Group',
      proposedAt: '2025-09-20T10:00:00Z',
      votingDeadline: '2025-09-30T23:59:59Z',
      status: 'active',
      votes: { yes: 142, no: 23, abstain: 8 },
      quorumRequired: 100,
      consensusThreshold: 0.67,
      category: 'economic',
      impactLevel: 'high'
    },
    {
      id: 'prop_002',
      title: 'Enhanced Trauma-Informed Content Warnings',
      description: 'Implementation of more granular content warning system with community-defined categories.',
      proposedBy: 'Safety & Healing Circle',
      proposedAt: '2025-09-18T14:30:00Z',
      votingDeadline: '2025-09-28T23:59:59Z',
      status: 'active',
      votes: { yes: 89, no: 5, abstain: 12 },
      quorumRequired: 75,
      consensusThreshold: 0.75,
      category: 'community',
      impactLevel: 'medium'
    },
    {
      id: 'prop_003',
      title: 'IVOR AI Ethics Guidelines',
      description: 'Establishing community-controlled guidelines for AI assistant behavior and data sovereignty.',
      proposedBy: 'AI Ethics Committee',
      proposedAt: '2025-09-15T09:00:00Z',
      votingDeadline: '2025-09-25T23:59:59Z',
      status: 'active',
      votes: { yes: 156, no: 18, abstain: 15 },
      quorumRequired: 100,
      consensusThreshold: 0.70,
      category: 'platform',
      impactLevel: 'critical'
    }
  ],
  votingHistory: [
    {
      proposalId: 'prop_archived_001',
      title: 'Community Moderation Standards',
      userVote: 'yes',
      result: 'passed',
      votedAt: '2025-09-10T16:20:00Z'
    },
    {
      proposalId: 'prop_archived_002',
      title: 'Platform Accessibility Improvements',
      userVote: 'yes',
      result: 'passed',
      votedAt: '2025-09-05T11:45:00Z'
    }
  ],
  consensusParticipation: [
    {
      type: 'community_discussion',
      topic: 'Creator Sovereignty Enhancement',
      participatedAt: '2025-09-12T19:30:00Z',
      consensusLevel: 'emerging'
    }
  ]
};

// CORS headers for API requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Liberation-Layer, X-API-Contract'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    switch (req.method) {
      case 'GET':
        return handleGetGovernance(req, res);
      case 'POST':
        return handleGovernanceAction(req, res);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: 'This endpoint supports GET and POST methods only'
        });
    }
  } catch (error) {
    console.error('Governance API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Governance services temporarily unavailable'
    });
  }
}

async function handleGetGovernance(req: VercelRequest, res: VercelResponse) {
  const { type } = req.query;

  switch (type) {
    case 'dashboard':
      return res.status(200).json({
        success: true,
        data: MOCK_GOVERNANCE_DATA,
        timestamp: new Date().toISOString(),
        liberationValues: {
          democraticGovernance: 'community-controlled',
          onePersonOneVote: true,
          consensusBuilding: 'active',
          transparentProcess: true
        }
      });

    case 'proposals':
      return res.status(200).json({
        success: true,
        data: {
          proposals: MOCK_GOVERNANCE_DATA.activeProposals,
          totalActive: MOCK_GOVERNANCE_DATA.activeProposals.length,
          participationRate: 0.73
        }
      });

    case 'voting-rights':
      return res.status(200).json({
        success: true,
        data: MOCK_GOVERNANCE_DATA.votingRights
      });

    default:
      return res.status(200).json({
        success: true,
        data: MOCK_GOVERNANCE_DATA
      });
  }
}

async function handleGovernanceAction(req: VercelRequest, res: VercelResponse) {
  const { action } = req.body;

  switch (action) {
    case 'submit_vote':
      return handleVoteSubmission(req, res);
    case 'submit_proposal':
      return handleProposalSubmission(req, res);
    default:
      return res.status(400).json({
        error: 'Invalid action',
        message: 'Supported actions: submit_vote, submit_proposal'
      });
  }
}

async function handleVoteSubmission(req: VercelRequest, res: VercelResponse) {
  const { proposalId, vote, userId } = req.body;

  // QI COMPLIANCE: Validate democratic voting principles
  if (!proposalId || !vote || !['yes', 'no', 'abstain'].includes(vote)) {
    return res.status(400).json({
      error: 'Invalid vote submission',
      message: 'proposalId and vote (yes/no/abstain) are required'
    });
  }

  // Mock vote processing - in production, this would update the database
  const mockResult = {
    success: true,
    message: 'Vote submitted successfully',
    proposalStatus: 'active',
    voteWeight: 1, // QI REQUIREMENT: Always 1 for democratic governance
    votingDeadline: '2025-09-30T23:59:59Z',
    currentTally: {
      yes: 143,
      no: 23,
      abstain: 9
    }
  };

  return res.status(200).json(mockResult);
}

async function handleProposalSubmission(req: VercelRequest, res: VercelResponse) {
  const { title, description, category, impactLevel, userId } = req.body;

  // QI COMPLIANCE: Validate proposal requirements
  if (!title || !description || !category) {
    return res.status(400).json({
      error: 'Invalid proposal submission',
      message: 'title, description, and category are required'
    });
  }

  // Mock proposal creation - in production, this would create database record
  const mockProposalId = `prop_${Date.now()}`;
  const mockResult = {
    success: true,
    proposalId: mockProposalId,
    message: 'Proposal submitted for community review',
    reviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    votingPeriod: 10, // days
    quorumRequired: impactLevel === 'critical' ? 150 : 100,
    consensusThreshold: impactLevel === 'critical' ? 0.75 : 0.67
  };

  return res.status(201).json(mockResult);
}