// BLKOUT Liberation Platform - Admin API Endpoint
// Layer 2: API Gateway for Administrative Functions
// STRICT SEPARATION: API layer only - NO business logic

import { VercelRequest, VercelResponse } from '@vercel/node';

// Admin data structures
interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  moderationQueue: number;
  revenueGenerated: string;
  communityHealth: number;
}

interface ModerationItem {
  id: string;
  type: 'story' | 'event' | 'comment';
  title: string;
  author: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  flagReason?: string;
  priority: 'low' | 'medium' | 'high';
}

interface AdminDashboardData {
  stats: AdminStats;
  moderationQueue: ModerationItem[];
  recentActivity: any[];
  systemHealth: {
    api: 'healthy' | 'degraded' | 'down';
    database: 'healthy' | 'degraded' | 'down';
    frontend: 'healthy' | 'degraded' | 'down';
    governance: 'healthy' | 'degraded' | 'down';
  };
}

// Mock admin data
const MOCK_ADMIN_DATA: AdminDashboardData = {
  stats: {
    totalUsers: 847,
    activeUsers: 234,
    totalContent: 1456,
    moderationQueue: 12,
    revenueGenerated: '£18,450.00',
    communityHealth: 0.89
  },
  moderationQueue: [
    {
      id: 'mod_001',
      type: 'story',
      title: 'Community Organizing Workshop Results',
      author: 'Jordan M.',
      submittedAt: '2025-09-22T09:15:00Z',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 'mod_002',
      type: 'event',
      title: 'Black Queer Joy Celebration',
      author: 'Alex T.',
      submittedAt: '2025-09-22T08:30:00Z',
      status: 'pending',
      flagReason: 'Location verification needed',
      priority: 'low'
    },
    {
      id: 'mod_003',
      type: 'comment',
      title: 'Response to Mental Health Resources',
      author: 'Sam K.',
      submittedAt: '2025-09-22T07:45:00Z',
      status: 'pending',
      flagReason: 'Community guidelines review',
      priority: 'high'
    }
  ],
  recentActivity: [
    {
      timestamp: '2025-09-22T10:30:00Z',
      action: 'Story approved: "Liberation Through Art"',
      moderator: 'Admin'
    },
    {
      timestamp: '2025-09-22T10:15:00Z',
      action: 'New user registration: Maya S.',
      moderator: 'System'
    },
    {
      timestamp: '2025-09-22T09:45:00Z',
      action: 'Event submitted for review',
      moderator: 'System'
    }
  ],
  systemHealth: {
    api: 'healthy',
    database: 'healthy',
    frontend: 'healthy',
    governance: 'healthy'
  }
};

// Admin credentials for basic authentication
const ADMIN_CREDENTIALS = {
  admin: 'blkOUT2025!',
  moderator: 'blkOUT2025!'
};

// CORS headers
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
        return handleGetAdmin(req, res);
      case 'POST':
        return handleAdminAction(req, res);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: 'This endpoint supports GET and POST methods only'
        });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Admin services temporarily unavailable'
    });
  }
}

async function handleGetAdmin(req: VercelRequest, res: VercelResponse) {
  const { type, auth } = req.query;

  // Basic authentication check
  if (!isValidAuth(auth as string)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid admin credentials required'
    });
  }

  switch (type) {
    case 'dashboard':
      return res.status(200).json({
        success: true,
        data: MOCK_ADMIN_DATA,
        timestamp: new Date().toISOString()
      });

    case 'moderation-queue':
      return res.status(200).json({
        success: true,
        data: {
          queue: MOCK_ADMIN_DATA.moderationQueue,
          stats: {
            total: MOCK_ADMIN_DATA.moderationQueue.length,
            pending: MOCK_ADMIN_DATA.moderationQueue.filter(item => item.status === 'pending').length,
            highPriority: MOCK_ADMIN_DATA.moderationQueue.filter(item => item.priority === 'high').length
          }
        }
      });

    case 'stats':
      return res.status(200).json({
        success: true,
        data: MOCK_ADMIN_DATA.stats
      });

    case 'system-health':
      return res.status(200).json({
        success: true,
        data: MOCK_ADMIN_DATA.systemHealth
      });

    default:
      return res.status(200).json({
        success: true,
        data: MOCK_ADMIN_DATA
      });
  }
}

async function handleAdminAction(req: VercelRequest, res: VercelResponse) {
  const { action, auth } = req.body;

  // Basic authentication check
  if (!isValidAuth(auth)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid admin credentials required'
    });
  }

  switch (action) {
    case 'authenticate':
      return handleAuthentication(req, res);
    case 'moderate_content':
      return handleContentModeration(req, res);
    case 'update_settings':
      return handleSettingsUpdate(req, res);
    default:
      return res.status(400).json({
        error: 'Invalid action',
        message: 'Supported actions: authenticate, moderate_content, update_settings'
      });
  }
}

async function handleAuthentication(req: VercelRequest, res: VercelResponse) {
  const { username, password } = req.body;

  // Validate credentials
  const isValidAdmin = username === 'admin' && password === ADMIN_CREDENTIALS.admin;
  const isValidModerator = username === 'moderator' && password === ADMIN_CREDENTIALS.moderator;

  if (!isValidAdmin && !isValidModerator) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Access denied to moderation system.'
    });
  }

  // Create session token (in production, use proper JWT)
  const sessionToken = `session_${Date.now()}_${username}`;
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

  return res.status(200).json({
    success: true,
    session: {
      token: sessionToken,
      expiresAt: expiresAt.toISOString(),
      role: isValidAdmin ? 'admin' : 'moderator',
      username: username
    },
    message: 'Authentication successful'
  });
}

async function handleContentModeration(req: VercelRequest, res: VercelResponse) {
  const { itemId, decision, moderatorNotes } = req.body;

  if (!itemId || !decision || !['approve', 'reject'].includes(decision)) {
    return res.status(400).json({
      error: 'Invalid moderation request',
      message: 'itemId and decision (approve/reject) are required'
    });
  }

  // Mock moderation processing
  const mockResult = {
    success: true,
    message: `Content ${decision}d successfully`,
    itemId: itemId,
    status: decision === 'approve' ? 'approved' : 'rejected',
    moderatedAt: new Date().toISOString(),
    moderatorNotes: moderatorNotes || ''
  };

  return res.status(200).json(mockResult);
}

async function handleSettingsUpdate(req: VercelRequest, res: VercelResponse) {
  const { settingType, value } = req.body;

  if (!settingType) {
    return res.status(400).json({
      error: 'Invalid settings update',
      message: 'settingType is required'
    });
  }

  // Mock settings update
  const mockResult = {
    success: true,
    message: `Setting '${settingType}' updated successfully`,
    settingType: settingType,
    newValue: value,
    updatedAt: new Date().toISOString()
  };

  return res.status(200).json(mockResult);
}

function isValidAuth(auth: string): boolean {
  if (!auth) return false;

  // Simple base64 decode for basic auth (in production, use proper JWT validation)
  try {
    const decoded = Buffer.from(auth, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    return (username === 'admin' && password === ADMIN_CREDENTIALS.admin) ||
           (username === 'moderator' && password === ADMIN_CREDENTIALS.moderator);
  } catch {
    return false;
  }
}