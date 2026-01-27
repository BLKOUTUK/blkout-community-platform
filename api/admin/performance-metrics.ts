// BLKOUT Liberation Platform - Performance Metrics API
// Phase 3.1: API endpoints for performance metrics and feedback loop
// Admin dashboard data access

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { performanceMetricsService } from '../../src/services/performance-metrics-service';
import { feedbackLoopService } from '../../src/services/feedback-loop-service';
import { analyticsDashboardQueries } from '../../src/services/analytics-dashboard-queries';

// CORS headers for admin dashboard access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Liberation-Platform',
  'Content-Type': 'application/json',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const { action } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res, action as string);
      case 'POST':
        return handlePost(req, res, action as string);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Performance metrics API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: String(error),
    });
  }
}

// ============================================================================
// GET HANDLERS
// ============================================================================

async function handleGet(req: VercelRequest, res: VercelResponse, action: string) {
  switch (action) {
    case 'dashboard-summary':
      return getDashboardSummary(req, res);

    case 'complete-dashboard':
      return getCompleteDashboard(req, res);

    case 'agent-trends':
      return getAgentTrends(req, res);

    case 'content-engagement':
      return getContentEngagement(req, res);

    case 'newsletter-history':
      return getNewsletterHistory(req, res);

    case 'top-content':
      return getTopContent(req, res);

    case 'adjustment-summary':
      return getAdjustmentSummary(req, res);

    case 'liberation-distribution':
      return getLiberationDistribution(req, res);

    case 'engagement-timeseries':
      return getEngagementTimeSeries(req, res);

    case 'feedback-loop-config':
      return getFeedbackLoopConfig(req, res);

    default:
      return res.status(400).json({ error: 'Invalid action', validActions: [
        'dashboard-summary',
        'complete-dashboard',
        'agent-trends',
        'content-engagement',
        'newsletter-history',
        'top-content',
        'adjustment-summary',
        'liberation-distribution',
        'engagement-timeseries',
        'feedback-loop-config',
      ]});
  }
}

async function getDashboardSummary(req: VercelRequest, res: VercelResponse) {
  const summary = await analyticsDashboardQueries.getDashboardSummary();
  return res.status(200).json({
    success: true,
    data: summary,
    timestamp: new Date().toISOString(),
  });
}

async function getCompleteDashboard(req: VercelRequest, res: VercelResponse) {
  const dashboardData = await analyticsDashboardQueries.getCompleteDashboardData();
  return res.status(200).json({
    success: true,
    data: dashboardData,
    timestamp: new Date().toISOString(),
  });
}

async function getAgentTrends(req: VercelRequest, res: VercelResponse) {
  const { agentType, daysBack } = req.query;
  const trends = await analyticsDashboardQueries.getAgentPerformanceTrends(
    agentType as string,
    Number(daysBack) || 90
  );
  return res.status(200).json({
    success: true,
    data: trends,
    count: trends.length,
    timestamp: new Date().toISOString(),
  });
}

async function getContentEngagement(req: VercelRequest, res: VercelResponse) {
  const { contentType, daysBack } = req.query;
  const engagement = await analyticsDashboardQueries.getContentEngagementTimeline(
    contentType as string,
    Number(daysBack) || 30
  );
  return res.status(200).json({
    success: true,
    data: engagement,
    count: engagement.length,
    timestamp: new Date().toISOString(),
  });
}

async function getNewsletterHistory(req: VercelRequest, res: VercelResponse) {
  const { limit } = req.query;
  const history = await analyticsDashboardQueries.getNewsletterPerformanceHistory(
    Number(limit) || 20
  );
  return res.status(200).json({
    success: true,
    data: history,
    count: history.length,
    timestamp: new Date().toISOString(),
  });
}

async function getTopContent(req: VercelRequest, res: VercelResponse) {
  const topContent = await analyticsDashboardQueries.getTopPerformingContent();
  return res.status(200).json({
    success: true,
    data: topContent,
    count: topContent.length,
    timestamp: new Date().toISOString(),
  });
}

async function getAdjustmentSummary(req: VercelRequest, res: VercelResponse) {
  const summary = await analyticsDashboardQueries.getIntelligenceAdjustmentSummary();
  return res.status(200).json({
    success: true,
    data: summary,
    count: summary.length,
    timestamp: new Date().toISOString(),
  });
}

async function getLiberationDistribution(req: VercelRequest, res: VercelResponse) {
  const distribution = await analyticsDashboardQueries.getLiberationAlignmentDistribution();
  return res.status(200).json({
    success: true,
    data: distribution,
    timestamp: new Date().toISOString(),
  });
}

async function getEngagementTimeSeries(req: VercelRequest, res: VercelResponse) {
  const { contentType, daysBack } = req.query;
  const timeSeries = await analyticsDashboardQueries.getEngagementRateTimeSeries(
    contentType as string,
    Number(daysBack) || 30
  );
  return res.status(200).json({
    success: true,
    data: timeSeries,
    count: timeSeries.length,
    timestamp: new Date().toISOString(),
  });
}

async function getFeedbackLoopConfig(req: VercelRequest, res: VercelResponse) {
  const config = feedbackLoopService.getConfig();
  return res.status(200).json({
    success: true,
    data: config,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// POST HANDLERS
// ============================================================================

async function handlePost(req: VercelRequest, res: VercelResponse, action: string) {
  switch (action) {
    case 'record-metric':
      return recordMetric(req, res);

    case 'record-metrics-batch':
      return recordMetricsBatch(req, res);

    case 'record-newsletter-open':
      return recordNewsletterOpen(req, res);

    case 'record-newsletter-click':
      return recordNewsletterClick(req, res);

    case 'record-newsletter-performance':
      return recordNewsletterPerformance(req, res);

    case 'process-feedback':
      return processContentFeedback(req, res);

    case 'run-feedback-cycle':
      return runFeedbackCycle(req, res);

    case 'boost-content':
      return boostContent(req, res);

    case 'reduce-content':
      return reduceContent(req, res);

    case 'upsert-intelligence':
      return upsertIntelligence(req, res);

    case 'update-feedback-config':
      return updateFeedbackConfig(req, res);

    default:
      return res.status(400).json({ error: 'Invalid action', validActions: [
        'record-metric',
        'record-metrics-batch',
        'record-newsletter-open',
        'record-newsletter-click',
        'record-newsletter-performance',
        'process-feedback',
        'run-feedback-cycle',
        'boost-content',
        'reduce-content',
        'upsert-intelligence',
        'update-feedback-config',
      ]});
  }
}

async function recordMetric(req: VercelRequest, res: VercelResponse) {
  const metric = req.body;

  if (!metric.content_type || !metric.content_id || !metric.metric_type) {
    return res.status(400).json({
      error: 'Missing required fields: content_type, content_id, metric_type',
    });
  }

  const result = await performanceMetricsService.recordMetric(metric);

  if (result.success) {
    return res.status(201).json({
      success: true,
      id: result.id,
      message: 'Metric recorded successfully',
    });
  } else {
    return res.status(400).json({
      success: false,
      error: result.error,
    });
  }
}

async function recordMetricsBatch(req: VercelRequest, res: VercelResponse) {
  const { metrics } = req.body;

  if (!Array.isArray(metrics) || metrics.length === 0) {
    return res.status(400).json({
      error: 'metrics must be a non-empty array',
    });
  }

  const result = await performanceMetricsService.recordMetricsBatch(metrics);

  return res.status(result.success ? 201 : 207).json({
    success: result.success,
    count: result.count,
    errors: result.errors,
    message: `Recorded ${result.count} of ${metrics.length} metrics`,
  });
}

async function recordNewsletterOpen(req: VercelRequest, res: VercelResponse) {
  const { newsletterId, contentIds, source } = req.body;

  if (!newsletterId) {
    return res.status(400).json({ error: 'Missing required field: newsletterId' });
  }

  await performanceMetricsService.recordNewsletterOpen(
    newsletterId,
    contentIds || [],
    source || 'email'
  );

  return res.status(201).json({
    success: true,
    message: 'Newsletter open recorded',
  });
}

async function recordNewsletterClick(req: VercelRequest, res: VercelResponse) {
  const { newsletterId, contentId, linkUrl, source } = req.body;

  if (!newsletterId || !contentId) {
    return res.status(400).json({
      error: 'Missing required fields: newsletterId, contentId',
    });
  }

  await performanceMetricsService.recordNewsletterClick(
    newsletterId,
    contentId,
    linkUrl || '',
    source || 'email'
  );

  return res.status(201).json({
    success: true,
    message: 'Newsletter click recorded',
  });
}

async function recordNewsletterPerformance(req: VercelRequest, res: VercelResponse) {
  const performance = req.body;

  if (!performance.newsletter_id) {
    return res.status(400).json({ error: 'Missing required field: newsletter_id' });
  }

  const result = await performanceMetricsService.recordNewsletterPerformance(performance);

  if (result.success) {
    return res.status(201).json({
      success: true,
      message: 'Newsletter performance recorded',
    });
  } else {
    return res.status(400).json({
      success: false,
      error: result.error,
    });
  }
}

async function processContentFeedback(req: VercelRequest, res: VercelResponse) {
  const { contentId, contentType, metrics } = req.body;

  if (!contentId || !contentType) {
    return res.status(400).json({
      error: 'Missing required fields: contentId, contentType',
    });
  }

  const result = await feedbackLoopService.processContentFeedback(
    contentId,
    contentType,
    metrics || {}
  );

  return res.status(200).json({
    success: true,
    data: result,
    timestamp: new Date().toISOString(),
  });
}

async function runFeedbackCycle(req: VercelRequest, res: VercelResponse) {
  // This is an admin-only action that runs the full feedback loop
  const report = await feedbackLoopService.runFeedbackLoopCycle();

  return res.status(200).json({
    success: true,
    data: report,
    message: 'Feedback loop cycle completed',
    timestamp: new Date().toISOString(),
  });
}

async function boostContent(req: VercelRequest, res: VercelResponse) {
  const { contentIds, boostAmount, reason } = req.body;

  if (!Array.isArray(contentIds) || contentIds.length === 0) {
    return res.status(400).json({ error: 'contentIds must be a non-empty array' });
  }

  const boostedCount = await performanceMetricsService.boostContentRelevance(
    contentIds,
    boostAmount || 10,
    reason || 'manual_boost'
  );

  return res.status(200).json({
    success: true,
    boostedCount,
    message: `Boosted ${boostedCount} content items`,
  });
}

async function reduceContent(req: VercelRequest, res: VercelResponse) {
  const { contentIds, reductionAmount, reason } = req.body;

  if (!Array.isArray(contentIds) || contentIds.length === 0) {
    return res.status(400).json({ error: 'contentIds must be a non-empty array' });
  }

  const reducedCount = await performanceMetricsService.reduceContentRelevance(
    contentIds,
    reductionAmount || 5,
    reason || 'manual_reduction'
  );

  return res.status(200).json({
    success: true,
    reducedCount,
    message: `Reduced ${reducedCount} content items`,
  });
}

async function upsertIntelligence(req: VercelRequest, res: VercelResponse) {
  const intelligence = req.body;

  if (!intelligence.content_type || !intelligence.content_id) {
    return res.status(400).json({
      error: 'Missing required fields: content_type, content_id',
    });
  }

  const result = await performanceMetricsService.upsertIvorIntelligence(intelligence);

  if (result.success) {
    return res.status(201).json({
      success: true,
      message: 'Intelligence data upserted',
    });
  } else {
    return res.status(400).json({
      success: false,
      error: result.error,
    });
  }
}

async function updateFeedbackConfig(req: VercelRequest, res: VercelResponse) {
  const config = req.body;

  feedbackLoopService.updateConfig(config);

  return res.status(200).json({
    success: true,
    message: 'Feedback loop configuration updated',
    newConfig: feedbackLoopService.getConfig(),
  });
}
