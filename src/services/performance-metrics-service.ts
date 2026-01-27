// BLKOUT Liberation Platform - Performance Metrics Service
// Phase 3.1: Records and tracks content performance metrics for the self-improving system
// Integrates with the feedback loop to optimize IVOR recommendations

import { supabase } from '../../lib/supabase';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ContentType = 'newsletter' | 'article' | 'social' | 'event' | 'resource' | 'announcement';

export type MetricType =
  | 'opens'
  | 'clicks'
  | 'approvals'
  | 'rejections'
  | 'engagement'
  | 'shares'
  | 'views'
  | 'time_spent'
  | 'completions'
  | 'feedback_positive'
  | 'feedback_negative'
  | 'ivor_recommendations'
  | 'conversions';

export type MeasurementPeriod = 'hourly' | 'daily' | 'weekly' | 'monthly';

export type AgentType =
  | 'newsletter_curator'
  | 'social_media_manager'
  | 'content_classifier'
  | 'trend_analyzer'
  | 'event_recommender'
  | 'ivor_responder'
  | 'moderation_reviewer';

export interface PerformanceMetric {
  id?: string;
  content_type: ContentType;
  content_id: string;
  metric_type: MetricType;
  metric_value: number;
  measured_at?: Date;
  measurement_period?: MeasurementPeriod;
  metadata?: Record<string, unknown>;
  source?: string;
  campaign_id?: string;
  agent_id?: string;
}

export interface AgentQualityScore {
  id?: string;
  agent_id: string;
  agent_type: AgentType;
  agent_name?: string;
  approval_rate: number;
  rejection_rate?: number;
  engagement_score?: number;
  accuracy_score?: number;
  liberation_alignment_score?: number;
  cultural_sensitivity_score?: number;
  total_items_processed?: number;
  performance_trend?: 'improving' | 'stable' | 'declining' | 'volatile';
  score_period?: 'daily' | 'weekly' | 'monthly' | 'all_time';
}

export interface IvorIntelligence {
  id?: string;
  content_type: string;
  content_id: string;
  relevance_score: number;
  quality_score?: number;
  engagement_prediction?: number;
  liberation_alignment?: number;
  community_relevance?: number;
  cultural_authenticity?: number;
  times_recommended?: number;
  times_clicked?: number;
  times_engaged?: number;
  content_tags?: string[];
  content_categories?: string[];
  is_active?: boolean;
}

export interface NewsletterPerformance {
  id?: string;
  newsletter_id: string;
  newsletter_name?: string;
  send_date: Date;
  total_sent: number;
  total_delivered: number;
  total_bounced?: number;
  total_opens: number;
  unique_opens: number;
  total_clicks: number;
  unique_clicks: number;
  unsubscribes?: number;
  spam_reports?: number;
  top_clicked_links?: Array<{ url: string; clicks: number }>;
  liberation_content_engagement?: number;
  community_action_clicks?: number;
}

export interface EngagementMetrics {
  contentId: string;
  contentType: ContentType;
  engagementRate: number;
  clickThroughRate: number;
  timeSpentAvg: number;
  shareRate: number;
  conversionRate: number;
}

export interface FeedbackLoopResult {
  success: boolean;
  adjustedCount: number;
  boostCount: number;
  reductionCount: number;
  message: string;
}

// ============================================================================
// PERFORMANCE METRICS SERVICE
// ============================================================================

class PerformanceMetricsService {
  // Threshold configurations
  private readonly HIGH_ENGAGEMENT_THRESHOLD = 0.4;
  private readonly LOW_ENGAGEMENT_THRESHOLD = 0.1;
  private readonly BOOST_AMOUNT = 10; // Percentage points
  private readonly REDUCTION_AMOUNT = 5; // Percentage points

  // ========================================
  // METRIC RECORDING FUNCTIONS
  // ========================================

  /**
   * Record a single performance metric
   */
  async recordMetric(metric: PerformanceMetric): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('content_performance')
        .insert({
          content_type: metric.content_type,
          content_id: metric.content_id,
          metric_type: metric.metric_type,
          metric_value: metric.metric_value,
          measured_at: metric.measured_at || new Date().toISOString(),
          measurement_period: metric.measurement_period || 'daily',
          metadata: metric.metadata || {},
          source: metric.source,
          campaign_id: metric.campaign_id,
          agent_id: metric.agent_id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording metric:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Exception recording metric:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Record multiple metrics in batch
   */
  async recordMetricsBatch(metrics: PerformanceMetric[]): Promise<{ success: boolean; count: number; errors: string[] }> {
    const errors: string[] = [];
    let successCount = 0;

    // Process in chunks of 100 for optimal performance
    const chunkSize = 100;
    for (let i = 0; i < metrics.length; i += chunkSize) {
      const chunk = metrics.slice(i, i + chunkSize);

      try {
        const { data, error } = await supabase
          .from('content_performance')
          .insert(chunk.map(m => ({
            content_type: m.content_type,
            content_id: m.content_id,
            metric_type: m.metric_type,
            metric_value: m.metric_value,
            measured_at: m.measured_at || new Date().toISOString(),
            measurement_period: m.measurement_period || 'daily',
            metadata: m.metadata || {},
            source: m.source,
            campaign_id: m.campaign_id,
            agent_id: m.agent_id,
          })));

        if (error) {
          errors.push(`Chunk ${i / chunkSize + 1}: ${error.message}`);
        } else {
          successCount += chunk.length;
        }
      } catch (error) {
        errors.push(`Chunk ${i / chunkSize + 1}: ${String(error)}`);
      }
    }

    return {
      success: errors.length === 0,
      count: successCount,
      errors,
    };
  }

  /**
   * Record newsletter open event
   */
  async recordNewsletterOpen(
    newsletterId: string,
    contentIds: string[],
    source: string = 'email'
  ): Promise<void> {
    // Record aggregate newsletter open
    await this.recordMetric({
      content_type: 'newsletter',
      content_id: newsletterId,
      metric_type: 'opens',
      metric_value: 1,
      source,
    });

    // Record individual content impressions
    const contentMetrics = contentIds.map(id => ({
      content_type: 'article' as ContentType,
      content_id: id,
      metric_type: 'views' as MetricType,
      metric_value: 1,
      source: 'newsletter',
      metadata: { newsletter_id: newsletterId },
    }));

    await this.recordMetricsBatch(contentMetrics);
  }

  /**
   * Record newsletter click event
   */
  async recordNewsletterClick(
    newsletterId: string,
    contentId: string,
    linkUrl: string,
    source: string = 'email'
  ): Promise<void> {
    // Record newsletter click
    await this.recordMetric({
      content_type: 'newsletter',
      content_id: newsletterId,
      metric_type: 'clicks',
      metric_value: 1,
      source,
      metadata: { clicked_content: contentId, link_url: linkUrl },
    });

    // Record content click
    await this.recordMetric({
      content_type: 'article',
      content_id: contentId,
      metric_type: 'clicks',
      metric_value: 1,
      source: 'newsletter',
      metadata: { newsletter_id: newsletterId },
    });

    // Update IVOR intelligence for clicked content
    await this.incrementIvorEngagement(contentId, 'click');
  }

  /**
   * Record content approval or rejection
   */
  async recordModerationDecision(
    contentId: string,
    contentType: ContentType,
    decision: 'approved' | 'rejected',
    agentId?: string,
    moderatorNotes?: string
  ): Promise<void> {
    await this.recordMetric({
      content_type: contentType,
      content_id: contentId,
      metric_type: decision === 'approved' ? 'approvals' : 'rejections',
      metric_value: 1,
      agent_id: agentId,
      metadata: { moderator_notes: moderatorNotes },
    });

    // Update agent quality score if agent was involved
    if (agentId) {
      await this.updateAgentApprovalStats(agentId, decision === 'approved');
    }
  }

  // ========================================
  // IVOR INTELLIGENCE FUNCTIONS
  // ========================================

  /**
   * Create or update IVOR intelligence entry
   */
  async upsertIvorIntelligence(intelligence: IvorIntelligence): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('ivor_intelligence')
        .upsert({
          content_type: intelligence.content_type,
          content_id: intelligence.content_id,
          relevance_score: intelligence.relevance_score,
          quality_score: intelligence.quality_score || 0.5,
          engagement_prediction: intelligence.engagement_prediction || 0.5,
          liberation_alignment: intelligence.liberation_alignment || 0.5,
          community_relevance: intelligence.community_relevance || 0.5,
          cultural_authenticity: intelligence.cultural_authenticity || 0.5,
          content_tags: intelligence.content_tags || [],
          content_categories: intelligence.content_categories || [],
          is_active: intelligence.is_active !== false,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'content_type,content_id',
        });

      if (error) {
        console.error('Error upserting IVOR intelligence:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Increment IVOR engagement counters
   */
  async incrementIvorEngagement(
    contentId: string,
    engagementType: 'recommendation' | 'click' | 'share' | 'engagement'
  ): Promise<void> {
    const columnMap = {
      recommendation: 'times_recommended',
      click: 'times_clicked',
      share: 'times_shared',
      engagement: 'times_engaged',
    };

    const column = columnMap[engagementType];

    try {
      await supabase.rpc('increment_ivor_engagement', {
        p_content_id: contentId,
        p_column: column,
      });
    } catch (error) {
      // Fallback: direct update with raw SQL
      const { error: updateError } = await supabase
        .from('ivor_intelligence')
        .update({
          [column]: supabase.rpc('increment', { column_value: column }),
          updated_at: new Date().toISOString(),
        })
        .eq('content_id', contentId);

      if (updateError) {
        console.error('Error incrementing IVOR engagement:', updateError);
      }
    }
  }

  // ========================================
  // FEEDBACK LOOP FUNCTIONS
  // ========================================

  /**
   * Main feedback loop processor - analyzes performance and adjusts intelligence
   */
  async processPerformanceFeedback(metrics: EngagementMetrics): Promise<FeedbackLoopResult> {
    let boostCount = 0;
    let reductionCount = 0;

    try {
      // High engagement: boost relevance
      if (metrics.engagementRate > this.HIGH_ENGAGEMENT_THRESHOLD) {
        const boostResult = await this.boostContentRelevance(
          [metrics.contentId],
          this.BOOST_AMOUNT,
          'high_engagement'
        );
        boostCount = boostResult;
      }

      // Low engagement: reduce relevance
      if (metrics.engagementRate < this.LOW_ENGAGEMENT_THRESHOLD) {
        const reductionResult = await this.reduceContentRelevance(
          [metrics.contentId],
          this.REDUCTION_AMOUNT,
          'low_engagement'
        );
        reductionCount = reductionResult;
      }

      // Update agent quality scores if applicable
      await this.updateAgentQualityFromMetrics(metrics);

      return {
        success: true,
        adjustedCount: boostCount + reductionCount,
        boostCount,
        reductionCount,
        message: `Processed feedback: ${boostCount} boosted, ${reductionCount} reduced`,
      };
    } catch (error) {
      return {
        success: false,
        adjustedCount: 0,
        boostCount: 0,
        reductionCount: 0,
        message: `Error processing feedback: ${String(error)}`,
      };
    }
  }

  /**
   * Boost content relevance for high-performing content
   */
  async boostContentRelevance(
    contentIds: string[],
    boostAmount: number = 10,
    reason: string = 'high_engagement'
  ): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('boost_content_relevance', {
        p_content_ids: contentIds,
        p_boost_amount: boostAmount,
        p_reason: reason,
      });

      if (error) {
        console.error('Error boosting content relevance:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Exception boosting content relevance:', error);
      return 0;
    }
  }

  /**
   * Reduce content relevance for low-performing content
   */
  async reduceContentRelevance(
    contentIds: string[],
    reductionAmount: number = 5,
    reason: string = 'low_engagement'
  ): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('reduce_content_relevance', {
        p_content_ids: contentIds,
        p_reduction_amount: reductionAmount,
        p_reason: reason,
      });

      if (error) {
        console.error('Error reducing content relevance:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Exception reducing content relevance:', error);
      return 0;
    }
  }

  /**
   * Update IVOR intelligence from performance metrics
   */
  async updateIntelligenceFromPerformance(metrics: EngagementMetrics): Promise<void> {
    const { contentId, engagementRate, clickThroughRate } = metrics;

    // Calculate new engagement prediction based on actual performance
    const newEngagementPrediction = (engagementRate + clickThroughRate) / 2;

    try {
      const { error } = await supabase
        .from('ivor_intelligence')
        .update({
          engagement_prediction: newEngagementPrediction,
          updated_at: new Date().toISOString(),
        })
        .eq('content_id', contentId);

      if (error) {
        console.error('Error updating intelligence from performance:', error);
      }
    } catch (error) {
      console.error('Exception updating intelligence:', error);
    }
  }

  // ========================================
  // AGENT QUALITY SCORE FUNCTIONS
  // ========================================

  /**
   * Update agent approval statistics
   */
  async updateAgentApprovalStats(agentId: string, wasApproved: boolean): Promise<void> {
    try {
      // Get current agent stats
      const { data: currentStats } = await supabase
        .from('agent_quality_scores')
        .select('*')
        .eq('agent_id', agentId)
        .eq('score_period', 'weekly')
        .single();

      const totalProcessed = (currentStats?.total_items_processed || 0) + 1;
      const totalApprovals = (currentStats?.total_approvals || 0) + (wasApproved ? 1 : 0);
      const totalRejections = (currentStats?.total_rejections || 0) + (wasApproved ? 0 : 1);
      const approvalRate = totalApprovals / totalProcessed;

      // Update or insert agent quality score
      await supabase.rpc('update_agent_quality_score', {
        p_agent_id: agentId,
        p_agent_type: 'content_classifier', // Default type, should be passed as parameter
        p_approval_rate: approvalRate,
      });
    } catch (error) {
      console.error('Error updating agent approval stats:', error);
    }
  }

  /**
   * Update agent quality scores based on engagement metrics
   */
  private async updateAgentQualityFromMetrics(metrics: EngagementMetrics): Promise<void> {
    // This would be called when we can attribute engagement back to an agent
    // Implementation depends on how content is tagged with agent attribution
  }

  /**
   * Get agent performance for a specific period
   */
  async getAgentPerformance(
    agentId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<AgentQualityScore | null> {
    try {
      const { data, error } = await supabase
        .from('agent_quality_scores')
        .select('*')
        .eq('agent_id', agentId)
        .eq('score_period', period)
        .order('period_start', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching agent performance:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching agent performance:', error);
      return null;
    }
  }

  // ========================================
  // NEWSLETTER PERFORMANCE FUNCTIONS
  // ========================================

  /**
   * Record comprehensive newsletter performance
   */
  async recordNewsletterPerformance(performance: NewsletterPerformance): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('newsletter_performance')
        .upsert({
          newsletter_id: performance.newsletter_id,
          newsletter_name: performance.newsletter_name,
          send_date: performance.send_date,
          total_sent: performance.total_sent,
          total_delivered: performance.total_delivered,
          total_bounced: performance.total_bounced || 0,
          total_opens: performance.total_opens,
          unique_opens: performance.unique_opens,
          total_clicks: performance.total_clicks,
          unique_clicks: performance.unique_clicks,
          unsubscribes: performance.unsubscribes || 0,
          spam_reports: performance.spam_reports || 0,
          top_clicked_links: performance.top_clicked_links || [],
          liberation_content_engagement: performance.liberation_content_engagement,
          community_action_clicks: performance.community_action_clicks || 0,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'newsletter_id',
        });

      if (error) {
        console.error('Error recording newsletter performance:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get newsletter performance history
   */
  async getNewsletterPerformanceHistory(limit: number = 10): Promise<NewsletterPerformance[]> {
    try {
      const { data, error } = await supabase
        .from('newsletter_performance_history')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error fetching newsletter history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching newsletter history:', error);
      return [];
    }
  }

  // ========================================
  // ANALYTICS QUERY FUNCTIONS
  // ========================================

  /**
   * Get agent performance trends
   */
  async getAgentPerformanceTrends(agentType?: AgentType): Promise<any[]> {
    try {
      let query = supabase
        .from('agent_performance_trends')
        .select('*');

      if (agentType) {
        query = query.eq('agent_type', agentType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching agent trends:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching agent trends:', error);
      return [];
    }
  }

  /**
   * Get content engagement timeline
   */
  async getContentEngagementTimeline(
    contentType?: ContentType,
    daysBack: number = 30
  ): Promise<any[]> {
    try {
      let query = supabase
        .from('content_engagement_timeline')
        .select('*');

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching engagement timeline:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching engagement timeline:', error);
      return [];
    }
  }

  /**
   * Get top performing content
   */
  async getTopPerformingContent(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('top_performing_content')
        .select('*');

      if (error) {
        console.error('Error fetching top content:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching top content:', error);
      return [];
    }
  }

  /**
   * Get intelligence adjustment summary
   */
  async getIntelligenceAdjustmentSummary(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('intelligence_adjustment_summary')
        .select('*');

      if (error) {
        console.error('Error fetching adjustment summary:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching adjustment summary:', error);
      return [];
    }
  }

  /**
   * Get comprehensive analytics dashboard data
   */
  async getAnalyticsDashboardData(): Promise<{
    agentTrends: any[];
    engagementTimeline: any[];
    topContent: any[];
    adjustmentSummary: any[];
    newsletterHistory: any[];
  }> {
    // Fetch all dashboard data in parallel for efficiency
    const [
      agentTrends,
      engagementTimeline,
      topContent,
      adjustmentSummary,
      newsletterHistory,
    ] = await Promise.all([
      this.getAgentPerformanceTrends(),
      this.getContentEngagementTimeline(),
      this.getTopPerformingContent(),
      this.getIntelligenceAdjustmentSummary(),
      this.getNewsletterPerformanceHistory(),
    ]);

    return {
      agentTrends,
      engagementTimeline,
      topContent,
      adjustmentSummary,
      newsletterHistory,
    };
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /**
   * Calculate engagement rate from raw metrics
   */
  calculateEngagementRate(
    clicks: number,
    shares: number,
    completions: number,
    views: number
  ): number {
    if (views === 0) return 0;
    const engagements = clicks + (shares * 2) + (completions * 3); // Weighted engagements
    return Math.min(1, engagements / views);
  }

  /**
   * Calculate click-through rate
   */
  calculateClickThroughRate(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return Math.min(1, clicks / impressions);
  }

  /**
   * Batch process feedback for multiple content items
   */
  async batchProcessFeedback(
    metricsArray: EngagementMetrics[]
  ): Promise<{ processed: number; boosted: number; reduced: number }> {
    let processed = 0;
    let boosted = 0;
    let reduced = 0;

    for (const metrics of metricsArray) {
      const result = await this.processPerformanceFeedback(metrics);
      if (result.success) {
        processed++;
        boosted += result.boostCount;
        reduced += result.reductionCount;
      }
    }

    return { processed, boosted, reduced };
  }
}

// Export singleton instance
export const performanceMetricsService = new PerformanceMetricsService();
