// BLKOUT Liberation Platform - Health Check API Endpoint
// Layer 2: API Gateway Health Monitoring
// STRICT SEPARATION: Health monitoring only

import { VercelRequest, VercelResponse } from '@vercel/node';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  services: {
    frontend: 'healthy' | 'degraded' | 'down';
    api: 'healthy' | 'degraded' | 'down';
    governance: 'healthy' | 'degraded' | 'down';
    content: 'healthy' | 'degraded' | 'down';
    admin: 'healthy' | 'degraded' | 'down';
  };
  liberation: {
    democraticGovernance: boolean;
    creatorSovereignty: boolean;
    traumaInformed: boolean;
    communityOwned: boolean;
  };
  metrics: {
    responseTime: number;
    activeUsers: number;
    systemLoad: number;
  };
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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

  // Only support GET requests for health checks
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Health check endpoint only supports GET requests'
    });
  }

  try {
    const startTime = Date.now();

    // Mock health check - in production, these would be real service checks
    const healthStatus: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      services: {
        frontend: 'healthy',
        api: 'healthy',
        governance: 'healthy',
        content: 'healthy',
        admin: 'healthy'
      },
      liberation: {
        democraticGovernance: true,
        creatorSovereignty: true,
        traumaInformed: true,
        communityOwned: true
      },
      metrics: {
        responseTime: Date.now() - startTime,
        activeUsers: 234,
        systemLoad: 0.42
      }
    };

    // Determine overall status
    const serviceStatuses = Object.values(healthStatus.services);
    if (serviceStatuses.includes('down')) {
      healthStatus.status = 'down';
    } else if (serviceStatuses.includes('degraded')) {
      healthStatus.status = 'degraded';
    }

    const httpStatus = healthStatus.status === 'healthy' ? 200 : 503;

    return res.status(httpStatus).json({
      success: healthStatus.status === 'healthy',
      data: healthStatus,
      message: `Platform is ${healthStatus.status}`,
      liberation: '🏴‍☠️ Liberation through technology'
    });

  } catch (error) {
    console.error('Health check error:', error);

    return res.status(503).json({
      success: false,
      status: 'down',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: 'Unable to determine system health'
    });
  }
}