import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with proper data governance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Authentication for analytics access
const ANALYTICS_API_KEY = process.env.ANALYTICS_API_KEY || 'demo-key-for-development';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
};

// Analytics interfaces
interface AutomationMetrics {
  total_submissions: number;
  auto_approved: number;
  pending_review: number;
  rejected: number;
  duplicate_filtered: number;
  source_breakdown: Record<string, number>;
  content_type_breakdown: Record<string, number>;
  quality_distribution: {
    high: number; // > 0.8
    medium: number; // 0.5-0.8
    low: number; // < 0.5
  };
  liberation_compliance: {
    fully_compliant: number;
    partially_compliant: number;
    non_compliant: number;
    needs_review: number;
  };
}

interface TimeSeriesData {
  date: string;
  submissions: number;
  auto_approved: number;
  manual_review: number;
  average_quality: number;
}

interface SourcePerformance {
  source: string;
  total_submissions: number;
  approval_rate: number;
  average_quality: number;
  duplicate_rate: number;
  liberation_compliance_rate: number;
  last_submission: string;
}

// Liberation Values: Democratic transparency through analytics
async function getAutomationMetrics(timeframe: string = '30d'): Promise<AutomationMetrics> {
  const cutoffDate = new Date();
  switch (timeframe) {
    case '24h':
      cutoffDate.setHours(cutoffDate.getHours() - 24);
      break;
    case '7d':
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      break;
    case '30d':
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      break;
    default:
      cutoffDate.setDate(cutoffDate.getDate() - 30);
  }

  // Get automation submissions from moderation_log
  const { data: submissions, error } = await supabase
    .from('moderation_log')
    .select('*')
    .gte('timestamp', cutoffDate.toISOString())
    .in('moderator_id', ['n8n-automation', 'n8n-research', 'blkouthub-community', 'blkouthub-mutual-aid']);

  if (error) {
    throw new Error(`Analytics query failed: ${error.message}`);
  }

  const metrics: AutomationMetrics = {
    total_submissions: submissions?.length || 0,
    auto_approved: 0,
    pending_review: 0,
    rejected: 0,
    duplicate_filtered: 0,
    source_breakdown: {},
    content_type_breakdown: {},
    quality_distribution: { high: 0, medium: 0, low: 0 },
    liberation_compliance: {
      fully_compliant: 0,
      partially_compliant: 0,
      non_compliant: 0,
      needs_review: 0
    }
  };

  if (!submissions) return metrics;

  // Process each submission for analytics
  submissions.forEach(submission => {
    // Action analysis
    if (submission.action?.includes('auto-approved')) {
      metrics.auto_approved++;
    } else if (submission.action?.includes('rejected')) {
      metrics.rejected++;
    } else {
      metrics.pending_review++;
    }

    // Source breakdown
    const source = submission.metadata?.automation_source || submission.moderator_id || 'unknown';
    metrics.source_breakdown[source] = (metrics.source_breakdown[source] || 0) + 1;

    // Content type breakdown
    const contentType = submission.content_table || 'unknown';
    metrics.content_type_breakdown[contentType] = (metrics.content_type_breakdown[contentType] || 0) + 1;

    // Quality distribution analysis
    const ivorAnalysis = submission.metadata?.ivor_analysis;
    if (ivorAnalysis?.quality_score !== undefined) {
      if (ivorAnalysis.quality_score > 0.8) {
        metrics.quality_distribution.high++;
      } else if (ivorAnalysis.quality_score >= 0.5) {
        metrics.quality_distribution.medium++;
      } else {
        metrics.quality_distribution.low++;
      }
    }

    // Liberation compliance analysis
    const liberationCompliance = submission.metadata?.liberation_compliance;
    if (liberationCompliance) {
      if (liberationCompliance.community_aligned &&
          liberationCompliance.trauma_informed &&
          liberationCompliance.anti_oppression) {
        metrics.liberation_compliance.fully_compliant++;
      } else if (liberationCompliance.community_aligned ||
                 liberationCompliance.trauma_informed ||
                 liberationCompliance.anti_oppression) {
        metrics.liberation_compliance.partially_compliant++;
      } else {
        metrics.liberation_compliance.non_compliant++;
      }
    } else {
      metrics.liberation_compliance.needs_review++;
    }

    // Check for duplicates
    if (submission.reason?.includes('duplicate') || submission.action?.includes('duplicate')) {
      metrics.duplicate_filtered++;
    }
  });

  return metrics;
}

async function getTimeSeriesData(timeframe: string = '30d'): Promise<TimeSeriesData[]> {
  const cutoffDate = new Date();
  let groupBy = 'day';

  switch (timeframe) {
    case '24h':
      cutoffDate.setHours(cutoffDate.getHours() - 24);
      groupBy = 'hour';
      break;
    case '7d':
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      groupBy = 'day';
      break;
    case '30d':
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      groupBy = 'day';
      break;
  }

  // Get submissions grouped by time period
  const { data: submissions, error } = await supabase
    .from('moderation_log')
    .select('*')
    .gte('timestamp', cutoffDate.toISOString())
    .in('moderator_id', ['n8n-automation', 'n8n-research', 'blkouthub-community', 'blkouthub-mutual-aid'])
    .order('timestamp', { ascending: true });

  if (error) {
    throw new Error(`Time series query failed: ${error.message}`);
  }

  // Group submissions by date
  const timeSeriesMap = new Map<string, {
    submissions: number;
    auto_approved: number;
    manual_review: number;
    quality_scores: number[];
  }>();

  submissions?.forEach(submission => {
    const date = new Date(submission.timestamp);
    const dateKey = groupBy === 'hour'
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (!timeSeriesMap.has(dateKey)) {
      timeSeriesMap.set(dateKey, {
        submissions: 0,
        auto_approved: 0,
        manual_review: 0,
        quality_scores: []
      });
    }

    const data = timeSeriesMap.get(dateKey)!;
    data.submissions++;

    if (submission.action?.includes('auto-approved')) {
      data.auto_approved++;
    } else {
      data.manual_review++;
    }

    const qualityScore = submission.metadata?.ivor_analysis?.quality_score;
    if (qualityScore !== undefined) {
      data.quality_scores.push(qualityScore);
    }
  });

  // Convert to array format
  return Array.from(timeSeriesMap.entries()).map(([date, data]) => ({
    date,
    submissions: data.submissions,
    auto_approved: data.auto_approved,
    manual_review: data.manual_review,
    average_quality: data.quality_scores.length > 0
      ? data.quality_scores.reduce((a, b) => a + b, 0) / data.quality_scores.length
      : 0
  }));
}

async function getSourcePerformance(): Promise<SourcePerformance[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30); // Last 30 days

  const { data: submissions, error } = await supabase
    .from('moderation_log')
    .select('*')
    .gte('timestamp', cutoffDate.toISOString())
    .in('moderator_id', ['n8n-automation', 'n8n-research', 'blkouthub-community', 'blkouthub-mutual-aid']);

  if (error) {
    throw new Error(`Source performance query failed: ${error.message}`);
  }

  if (!submissions) return [];

  // Group by source
  const sourceMap = new Map<string, {
    total: number;
    approved: number;
    quality_scores: number[];
    duplicates: number;
    liberation_compliant: number;
    last_submission: string;
  }>();

  submissions.forEach(submission => {
    const source = submission.metadata?.automation_source || submission.moderator_id || 'unknown';

    if (!sourceMap.has(source)) {
      sourceMap.set(source, {
        total: 0,
        approved: 0,
        quality_scores: [],
        duplicates: 0,
        liberation_compliant: 0,
        last_submission: submission.timestamp
      });
    }

    const data = sourceMap.get(source)!;
    data.total++;

    if (submission.action?.includes('auto-approved') || submission.action?.includes('approved')) {
      data.approved++;
    }

    if (submission.reason?.includes('duplicate')) {
      data.duplicates++;
    }

    if (submission.metadata?.liberation_compliance?.community_aligned) {
      data.liberation_compliant++;
    }

    const qualityScore = submission.metadata?.ivor_analysis?.quality_score;
    if (qualityScore !== undefined) {
      data.quality_scores.push(qualityScore);
    }

    // Track latest submission
    if (new Date(submission.timestamp) > new Date(data.last_submission)) {
      data.last_submission = submission.timestamp;
    }
  });

  return Array.from(sourceMap.entries()).map(([source, data]) => ({
    source,
    total_submissions: data.total,
    approval_rate: data.total > 0 ? (data.approved / data.total) * 100 : 0,
    average_quality: data.quality_scores.length > 0
      ? data.quality_scores.reduce((a, b) => a + b, 0) / data.quality_scores.length
      : 0,
    duplicate_rate: data.total > 0 ? (data.duplicates / data.total) * 100 : 0,
    liberation_compliance_rate: data.total > 0 ? (data.liberation_compliant / data.total) * 100 : 0,
    last_submission: data.last_submission
  })).sort((a, b) => b.total_submissions - a.total_submissions);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).json({ message: 'OK' });
  }

  // Add CORS headers to all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Authentication check
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  if (!apiKey || apiKey !== ANALYTICS_API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
      liberation_message: 'Analytics access requires proper community authentication'
    });
  }

  const { method, url } = req;
  const urlPath = url?.split('?')[0];
  const timeframe = (req.query.timeframe as string) || '30d';

  try {
    switch (method) {
      case 'GET':
        if (urlPath === '/api/webhooks/automation-analytics' || urlPath === '/api/webhooks/automation-analytics/overview') {
          // Overall automation metrics
          const metrics = await getAutomationMetrics(timeframe);

          return res.status(200).json({
            success: true,
            timeframe,
            metrics,
            liberation_message: 'Automation analytics promote community transparency and democratic oversight'
          });
        }

        if (urlPath === '/api/webhooks/automation-analytics/timeseries') {
          // Time series data for charts
          const timeSeries = await getTimeSeriesData(timeframe);

          return res.status(200).json({
            success: true,
            timeframe,
            data: timeSeries,
            liberation_message: 'Time series data enables community tracking of automation performance'
          });
        }

        if (urlPath === '/api/webhooks/automation-analytics/sources') {
          // Source performance analysis
          const sourcePerformance = await getSourcePerformance();

          return res.status(200).json({
            success: true,
            sources: sourcePerformance,
            liberation_message: 'Source analysis helps community evaluate automation effectiveness'
          });
        }

        if (urlPath === '/api/webhooks/automation-analytics/dashboard') {
          // Complete dashboard data
          const [metrics, timeSeries, sources] = await Promise.all([
            getAutomationMetrics(timeframe),
            getTimeSeriesData(timeframe),
            getSourcePerformance()
          ]);

          return res.status(200).json({
            success: true,
            timeframe,
            dashboard: {
              overview: metrics,
              timeseries: timeSeries,
              source_performance: sources,
              last_updated: new Date().toISOString()
            },
            liberation_message: 'Complete automation analytics dashboard for community democratic oversight'
          });
        }

        if (urlPath === '/api/webhooks/automation-analytics/health') {
          // Health check with system status
          const recentSubmissions = await supabase
            .from('moderation_log')
            .select('count')
            .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .in('moderator_id', ['n8n-automation', 'n8n-research', 'blkouthub-community']);

          return res.status(200).json({
            success: true,
            service: 'Automation Analytics',
            status: 'operational',
            database: supabaseUrl ? 'connected' : 'disconnected',
            recent_activity: recentSubmissions?.data?.[0]?.count || 0,
            liberation_message: 'Analytics service operational - supporting community transparency'
          });
        }

        return res.status(404).json({ success: false, error: 'Analytics endpoint not found' });

      case 'POST':
        if (urlPath === '/api/webhooks/automation-analytics/alert') {
          // Create community alert for automation issues
          const { alert_type, message, priority, source } = req.body;

          if (!alert_type || !message) {
            return res.status(400).json({
              success: false,
              error: 'Missing required fields: alert_type, message'
            });
          }

          // Log alert to moderation system
          const alertData = {
            content_id: `alert-${Date.now()}`,
            content_table: 'system_alert',
            action: 'automation-alert',
            moderator_id: 'automation-analytics',
            reason: `${alert_type}: ${message}`,
            metadata: {
              alert_type,
              message,
              priority: priority || 'medium',
              source: source || 'unknown',
              timestamp: new Date().toISOString()
            }
          };

          const { data, error } = await supabase
            .from('moderation_log')
            .insert([alertData])
            .select()
            .single();

          if (error) {
            return res.status(500).json({ success: false, error: error.message });
          }

          console.log(`🚨 Automation alert: ${alert_type} - ${message}`);

          return res.status(201).json({
            success: true,
            message: 'Community alert logged',
            alert_id: data?.id,
            liberation_message: 'Community alerts enable democratic response to automation issues'
          });
        }

        return res.status(404).json({ success: false, error: 'Analytics endpoint not found' });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
          liberation_message: 'Only GET and POST requests supported for analytics'
        });
    }
  } catch (error) {
    console.error('❌ Automation analytics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      liberation_message: 'Technical difficulties with analytics - community tech collective will address'
    });
  }
}