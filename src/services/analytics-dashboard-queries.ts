// BLKOUT Liberation Platform - Analytics Dashboard Queries
// Phase 3.1: Pre-built analytics queries for the admin dashboard
// Provides efficient data access for performance visualization

import { supabase } from '../../lib/supabase';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AgentTrendData {
  agentType: string;
  agentName: string | null;
  scorePeriod: string;
  periodStart: string;
  approvalRate: number;
  rejectionRate: number;
  engagementScore: number | null;
  liberationAlignmentScore: number | null;
  totalItemsProcessed: number;
  performanceTrend: string | null;
  movingAvgApproval: number | null;
  weekOverWeekChange: number | null;
}

export interface ContentEngagementData {
  contentType: string;
  measurementDate: string;
  metricType: string;
  totalValue: number;
  avgValue: number;
  uniqueContentCount: number;
  source: string | null;
}

export interface NewsletterHistoryData {
  newsletterName: string | null;
  sendDate: string;
  totalSent: number;
  totalDelivered: number;
  deliveryRate: number;
  uniqueOpens: number;
  openRate: number;
  uniqueClicks: number;
  clickRate: number;
  clickToOpenRate: number;
  unsubscribes: number;
  liberationContentEngagement: number | null;
  communityActionClicks: number;
  openRateRank: number;
  clickRateRank: number;
  rollingAvgOpenRate: number | null;
  rollingAvgClickRate: number | null;
}

export interface TopPerformingContentData {
  contentType: string;
  totalContent: number;
  avgRelevance: number;
  avgEngagementPrediction: number;
  avgLiberationAlignment: number;
  totalRecommendations: number;
  totalClicks: number;
  totalEngagements: number;
  clickThroughRate: number;
  engagementConversionRate: number;
}

export interface IntelligenceAdjustmentData {
  eventType: string;
  eventDate: string;
  eventCount: number;
  avgChange: number;
  positiveAdjustments: number;
  negativeAdjustments: number;
  triggerMetric: string | null;
}

export interface DashboardSummary {
  totalActiveContent: number;
  avgRelevanceScore: number;
  avgEngagementRate: number;
  totalAgents: number;
  avgAgentApprovalRate: number;
  contentBoostedToday: number;
  contentReducedToday: number;
  newslettersSentThisWeek: number;
  avgNewsletterOpenRate: number;
  avgNewsletterClickRate: number;
  liberationAlignmentAvg: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PerformanceComparison {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

// ============================================================================
// ANALYTICS DASHBOARD QUERIES SERVICE
// ============================================================================

class AnalyticsDashboardQueries {

  // ========================================
  // SUMMARY QUERIES
  // ========================================

  /**
   * Get comprehensive dashboard summary
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      // Parallel fetch all summary data
      const [
        contentStats,
        agentStats,
        adjustmentStats,
        newsletterStats,
      ] = await Promise.all([
        this.getContentStats(),
        this.getAgentStats(),
        this.getAdjustmentStatsToday(),
        this.getNewsletterStatsThisWeek(),
      ]);

      return {
        totalActiveContent: contentStats.totalActive,
        avgRelevanceScore: contentStats.avgRelevance,
        avgEngagementRate: contentStats.avgEngagement,
        totalAgents: agentStats.totalAgents,
        avgAgentApprovalRate: agentStats.avgApprovalRate,
        contentBoostedToday: adjustmentStats.boosted,
        contentReducedToday: adjustmentStats.reduced,
        newslettersSentThisWeek: newsletterStats.count,
        avgNewsletterOpenRate: newsletterStats.avgOpenRate,
        avgNewsletterClickRate: newsletterStats.avgClickRate,
        liberationAlignmentAvg: contentStats.avgLiberationAlignment,
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      // Return safe defaults
      return {
        totalActiveContent: 0,
        avgRelevanceScore: 0,
        avgEngagementRate: 0,
        totalAgents: 0,
        avgAgentApprovalRate: 0,
        contentBoostedToday: 0,
        contentReducedToday: 0,
        newslettersSentThisWeek: 0,
        avgNewsletterOpenRate: 0,
        avgNewsletterClickRate: 0,
        liberationAlignmentAvg: 0,
      };
    }
  }

  private async getContentStats(): Promise<{
    totalActive: number;
    avgRelevance: number;
    avgEngagement: number;
    avgLiberationAlignment: number;
  }> {
    const { data, error } = await supabase
      .from('ivor_intelligence')
      .select('relevance_score, engagement_prediction, liberation_alignment')
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      return { totalActive: 0, avgRelevance: 0, avgEngagement: 0, avgLiberationAlignment: 0 };
    }

    const total = data.length;
    const avgRelevance = data.reduce((sum, d) => sum + (d.relevance_score || 0), 0) / total;
    const avgEngagement = data.reduce((sum, d) => sum + (d.engagement_prediction || 0), 0) / total;
    const avgLiberation = data.reduce((sum, d) => sum + (d.liberation_alignment || 0), 0) / total;

    return {
      totalActive: total,
      avgRelevance,
      avgEngagement,
      avgLiberationAlignment: avgLiberation,
    };
  }

  private async getAgentStats(): Promise<{
    totalAgents: number;
    avgApprovalRate: number;
  }> {
    const { data, error } = await supabase
      .from('agent_quality_scores')
      .select('agent_id, approval_rate')
      .eq('score_period', 'weekly');

    if (error || !data || data.length === 0) {
      return { totalAgents: 0, avgApprovalRate: 0 };
    }

    // Get unique agents
    const uniqueAgents = new Set(data.map(d => d.agent_id));
    const avgApproval = data.reduce((sum, d) => sum + (d.approval_rate || 0), 0) / data.length;

    return {
      totalAgents: uniqueAgents.size,
      avgApprovalRate: avgApproval,
    };
  }

  private async getAdjustmentStatsToday(): Promise<{
    boosted: number;
    reduced: number;
  }> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('feedback_loop_events')
      .select('event_type')
      .gte('created_at', `${today}T00:00:00Z`)
      .in('event_type', ['relevance_boost', 'relevance_reduction']);

    if (error || !data) {
      return { boosted: 0, reduced: 0 };
    }

    const boosted = data.filter(d => d.event_type === 'relevance_boost').length;
    const reduced = data.filter(d => d.event_type === 'relevance_reduction').length;

    return { boosted, reduced };
  }

  private async getNewsletterStatsThisWeek(): Promise<{
    count: number;
    avgOpenRate: number;
    avgClickRate: number;
  }> {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('newsletter_performance')
      .select('open_rate, click_rate')
      .gte('send_date', weekAgo);

    if (error || !data || data.length === 0) {
      return { count: 0, avgOpenRate: 0, avgClickRate: 0 };
    }

    const avgOpen = data.reduce((sum, d) => sum + (d.open_rate || 0), 0) / data.length;
    const avgClick = data.reduce((sum, d) => sum + (d.click_rate || 0), 0) / data.length;

    return {
      count: data.length,
      avgOpenRate: avgOpen,
      avgClickRate: avgClick,
    };
  }

  // ========================================
  // AGENT PERFORMANCE QUERIES
  // ========================================

  /**
   * Get agent performance trends
   */
  async getAgentPerformanceTrends(
    agentType?: string,
    daysBack: number = 90
  ): Promise<AgentTrendData[]> {
    try {
      const { data, error } = await supabase
        .from('agent_performance_trends')
        .select('*');

      if (error) {
        console.error('Error fetching agent trends:', error);
        return [];
      }

      let results = data || [];

      if (agentType) {
        results = results.filter(r => r.agent_type === agentType);
      }

      return results.map(r => ({
        agentType: r.agent_type,
        agentName: r.agent_name,
        scorePeriod: r.score_period,
        periodStart: r.period_start,
        approvalRate: r.approval_rate || 0,
        rejectionRate: r.rejection_rate || 0,
        engagementScore: r.engagement_score,
        liberationAlignmentScore: r.liberation_alignment_score,
        totalItemsProcessed: r.total_items_processed || 0,
        performanceTrend: r.performance_trend,
        movingAvgApproval: r.moving_avg_approval,
        weekOverWeekChange: r.wow_change,
      }));
    } catch (error) {
      console.error('Exception fetching agent trends:', error);
      return [];
    }
  }

  /**
   * Get agent performance comparison (current vs previous period)
   */
  async getAgentPerformanceComparison(agentId: string): Promise<PerformanceComparison | null> {
    try {
      const { data, error } = await supabase
        .from('agent_quality_scores')
        .select('approval_rate, period_start')
        .eq('agent_id', agentId)
        .eq('score_period', 'weekly')
        .order('period_start', { ascending: false })
        .limit(2);

      if (error || !data || data.length < 2) {
        return null;
      }

      const current = data[0].approval_rate || 0;
      const previous = data[1].approval_rate || 0;
      const change = current - previous;
      const changePercent = previous > 0 ? (change / previous) * 100 : 0;

      return {
        current,
        previous,
        change,
        changePercent,
        trend: change > 0.01 ? 'up' : change < -0.01 ? 'down' : 'stable',
      };
    } catch (error) {
      return null;
    }
  }

  // ========================================
  // CONTENT ENGAGEMENT QUERIES
  // ========================================

  /**
   * Get content engagement timeline
   */
  async getContentEngagementTimeline(
    contentType?: string,
    daysBack: number = 30
  ): Promise<ContentEngagementData[]> {
    try {
      const { data, error } = await supabase
        .from('content_engagement_timeline')
        .select('*');

      if (error) {
        console.error('Error fetching engagement timeline:', error);
        return [];
      }

      let results = data || [];

      if (contentType) {
        results = results.filter(r => r.content_type === contentType);
      }

      return results.map(r => ({
        contentType: r.content_type,
        measurementDate: r.measurement_date,
        metricType: r.metric_type,
        totalValue: r.total_value || 0,
        avgValue: r.avg_value || 0,
        uniqueContentCount: r.unique_content_count || 0,
        source: r.source,
      }));
    } catch (error) {
      console.error('Exception fetching engagement timeline:', error);
      return [];
    }
  }

  /**
   * Get engagement rate time series for charting
   */
  async getEngagementRateTimeSeries(
    contentType?: string,
    daysBack: number = 30
  ): Promise<TimeSeriesDataPoint[]> {
    try {
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      let query = supabase
        .from('content_performance')
        .select('measured_at, metric_type, metric_value')
        .gte('measured_at', startDate)
        .eq('metric_type', 'engagement');

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error || !data) {
        return [];
      }

      // Aggregate by day
      const dailyData = new Map<string, number[]>();
      data.forEach(d => {
        const date = d.measured_at.split('T')[0];
        if (!dailyData.has(date)) {
          dailyData.set(date, []);
        }
        dailyData.get(date)!.push(d.metric_value);
      });

      return Array.from(dailyData.entries())
        .map(([date, values]) => ({
          date,
          value: values.reduce((sum, v) => sum + v, 0) / values.length,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      return [];
    }
  }

  // ========================================
  // NEWSLETTER PERFORMANCE QUERIES
  // ========================================

  /**
   * Get newsletter performance history
   */
  async getNewsletterPerformanceHistory(limit: number = 20): Promise<NewsletterHistoryData[]> {
    try {
      const { data, error } = await supabase
        .from('newsletter_performance_history')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error fetching newsletter history:', error);
        return [];
      }

      return (data || []).map(r => ({
        newsletterName: r.newsletter_name,
        sendDate: r.send_date,
        totalSent: r.total_sent || 0,
        totalDelivered: r.total_delivered || 0,
        deliveryRate: r.delivery_rate || 0,
        uniqueOpens: r.unique_opens || 0,
        openRate: r.open_rate || 0,
        uniqueClicks: r.unique_clicks || 0,
        clickRate: r.click_rate || 0,
        clickToOpenRate: r.click_to_open_rate || 0,
        unsubscribes: r.unsubscribes || 0,
        liberationContentEngagement: r.liberation_content_engagement,
        communityActionClicks: r.community_action_clicks || 0,
        openRateRank: r.open_rate_rank || 0,
        clickRateRank: r.click_rate_rank || 0,
        rollingAvgOpenRate: r.rolling_avg_open_rate,
        rollingAvgClickRate: r.rolling_avg_click_rate,
      }));
    } catch (error) {
      console.error('Exception fetching newsletter history:', error);
      return [];
    }
  }

  /**
   * Get newsletter open rate time series
   */
  async getNewsletterOpenRateTimeSeries(daysBack: number = 90): Promise<TimeSeriesDataPoint[]> {
    try {
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('newsletter_performance')
        .select('send_date, open_rate, newsletter_name')
        .gte('send_date', startDate)
        .order('send_date', { ascending: true });

      if (error || !data) {
        return [];
      }

      return data.map(d => ({
        date: d.send_date.split('T')[0],
        value: d.open_rate || 0,
        label: d.newsletter_name,
      }));
    } catch (error) {
      return [];
    }
  }

  // ========================================
  // TOP PERFORMING CONTENT QUERIES
  // ========================================

  /**
   * Get top performing content by type
   */
  async getTopPerformingContent(): Promise<TopPerformingContentData[]> {
    try {
      const { data, error } = await supabase
        .from('top_performing_content')
        .select('*');

      if (error) {
        console.error('Error fetching top content:', error);
        return [];
      }

      return (data || []).map(r => ({
        contentType: r.content_type,
        totalContent: r.total_content || 0,
        avgRelevance: r.avg_relevance || 0,
        avgEngagementPrediction: r.avg_engagement_prediction || 0,
        avgLiberationAlignment: r.avg_liberation_alignment || 0,
        totalRecommendations: r.total_recommendations || 0,
        totalClicks: r.total_clicks || 0,
        totalEngagements: r.total_engagements || 0,
        clickThroughRate: r.click_through_rate || 0,
        engagementConversionRate: r.engagement_conversion_rate || 0,
      }));
    } catch (error) {
      console.error('Exception fetching top content:', error);
      return [];
    }
  }

  /**
   * Get individual top performing content items
   */
  async getTopContentItems(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ivor_intelligence')
        .select('*')
        .eq('is_active', true)
        .order('relevance_score', { ascending: false })
        .order('times_engaged', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching top content items:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      return [];
    }
  }

  // ========================================
  // INTELLIGENCE ADJUSTMENT QUERIES
  // ========================================

  /**
   * Get intelligence adjustment summary
   */
  async getIntelligenceAdjustmentSummary(): Promise<IntelligenceAdjustmentData[]> {
    try {
      const { data, error } = await supabase
        .from('intelligence_adjustment_summary')
        .select('*');

      if (error) {
        console.error('Error fetching adjustment summary:', error);
        return [];
      }

      return (data || []).map(r => ({
        eventType: r.event_type,
        eventDate: r.event_date,
        eventCount: r.event_count || 0,
        avgChange: r.avg_change || 0,
        positiveAdjustments: r.positive_adjustments || 0,
        negativeAdjustments: r.negative_adjustments || 0,
        triggerMetric: r.trigger_metric,
      }));
    } catch (error) {
      console.error('Exception fetching adjustment summary:', error);
      return [];
    }
  }

  /**
   * Get adjustment activity time series
   */
  async getAdjustmentActivityTimeSeries(daysBack: number = 30): Promise<TimeSeriesDataPoint[]> {
    try {
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('feedback_loop_events')
        .select('created_at, event_type')
        .gte('created_at', startDate)
        .in('event_type', ['relevance_boost', 'relevance_reduction']);

      if (error || !data) {
        return [];
      }

      // Aggregate by day
      const dailyData = new Map<string, number>();
      data.forEach(d => {
        const date = d.created_at.split('T')[0];
        dailyData.set(date, (dailyData.get(date) || 0) + 1);
      });

      return Array.from(dailyData.entries())
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      return [];
    }
  }

  // ========================================
  // LIBERATION ALIGNMENT QUERIES
  // ========================================

  /**
   * Get liberation alignment distribution
   */
  async getLiberationAlignmentDistribution(): Promise<{
    ranges: { range: string; count: number; percentage: number }[];
    average: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('ivor_intelligence')
        .select('liberation_alignment')
        .eq('is_active', true);

      if (error || !data || data.length === 0) {
        return { ranges: [], average: 0 };
      }

      const total = data.length;
      const ranges = [
        { range: '0.0-0.2', min: 0, max: 0.2, count: 0 },
        { range: '0.2-0.4', min: 0.2, max: 0.4, count: 0 },
        { range: '0.4-0.6', min: 0.4, max: 0.6, count: 0 },
        { range: '0.6-0.8', min: 0.6, max: 0.8, count: 0 },
        { range: '0.8-1.0', min: 0.8, max: 1.0, count: 0 },
      ];

      let sum = 0;
      data.forEach(d => {
        const value = d.liberation_alignment || 0;
        sum += value;

        for (const range of ranges) {
          if (value >= range.min && value < range.max) {
            range.count++;
            break;
          }
          if (value === 1.0 && range.max === 1.0) {
            range.count++;
            break;
          }
        }
      });

      return {
        ranges: ranges.map(r => ({
          range: r.range,
          count: r.count,
          percentage: (r.count / total) * 100,
        })),
        average: sum / total,
      };
    } catch (error) {
      return { ranges: [], average: 0 };
    }
  }

  // ========================================
  // COMPREHENSIVE DASHBOARD DATA
  // ========================================

  /**
   * Get all dashboard data in a single call (optimized)
   */
  async getCompleteDashboardData(): Promise<{
    summary: DashboardSummary;
    agentTrends: AgentTrendData[];
    engagementTimeline: ContentEngagementData[];
    topContent: TopPerformingContentData[];
    adjustmentSummary: IntelligenceAdjustmentData[];
    newsletterHistory: NewsletterHistoryData[];
    liberationDistribution: { ranges: { range: string; count: number; percentage: number }[]; average: number };
  }> {
    // Parallel fetch all data
    const [
      summary,
      agentTrends,
      engagementTimeline,
      topContent,
      adjustmentSummary,
      newsletterHistory,
      liberationDistribution,
    ] = await Promise.all([
      this.getDashboardSummary(),
      this.getAgentPerformanceTrends(),
      this.getContentEngagementTimeline(),
      this.getTopPerformingContent(),
      this.getIntelligenceAdjustmentSummary(),
      this.getNewsletterPerformanceHistory(),
      this.getLiberationAlignmentDistribution(),
    ]);

    return {
      summary,
      agentTrends,
      engagementTimeline,
      topContent,
      adjustmentSummary,
      newsletterHistory,
      liberationDistribution,
    };
  }
}

// Export singleton instance
export const analyticsDashboardQueries = new AnalyticsDashboardQueries();
