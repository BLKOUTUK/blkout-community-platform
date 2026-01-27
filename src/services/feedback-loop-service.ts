// BLKOUT Liberation Platform - Feedback Loop Service
// Phase 3.1: Self-improving system that adjusts intelligence based on performance
// Orchestrates the feedback loop between content performance and IVOR recommendations

import { supabase } from '../../lib/supabase';
import {
  performanceMetricsService,
  EngagementMetrics,
  ContentType,
  MetricType
} from './performance-metrics-service';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FeedbackLoopConfig {
  // Engagement thresholds
  highEngagementThreshold: number;
  lowEngagementThreshold: number;

  // Adjustment amounts
  boostAmount: number;
  reductionAmount: number;

  // Processing settings
  batchSize: number;
  processingIntervalHours: number;

  // Liberation values weights
  liberationBoostMultiplier: number;
  culturalAuthenticityWeight: number;
  communityRelevanceWeight: number;
}

export interface FeedbackLoopEvent {
  id?: string;
  event_type: 'relevance_boost' | 'relevance_reduction' | 'quality_update' |
              'agent_retrain_trigger' | 'threshold_alert' | 'performance_milestone' |
              'content_expiry' | 'trend_detected' | 'anomaly_detected';
  source_table: string;
  source_id: string;
  previous_value?: number;
  new_value?: number;
  change_amount?: number;
  change_reason?: string;
  triggered_by: string;
  trigger_metric?: string;
  trigger_threshold?: number;
  metadata?: Record<string, unknown>;
}

export interface ContentPerformanceSummary {
  contentId: string;
  contentType: ContentType;
  totalViews: number;
  totalClicks: number;
  totalShares: number;
  totalEngagements: number;
  openRate: number;
  clickThroughRate: number;
  engagementRate: number;
  liberationAlignment: number;
  currentRelevanceScore: number;
  recommendedAdjustment: number;
  adjustmentReason: string;
}

export interface AgentPerformanceSummary {
  agentId: string;
  agentType: string;
  approvalRate: number;
  engagementScore: number;
  liberationAlignmentScore: number;
  totalItemsProcessed: number;
  performanceTrend: 'improving' | 'stable' | 'declining' | 'volatile';
  needsRetraining: boolean;
  retrainingReason?: string;
}

export interface FeedbackLoopReport {
  processedAt: Date;
  totalContentProcessed: number;
  totalAgentsEvaluated: number;
  contentBoosted: number;
  contentReduced: number;
  agentsTriggeredForRetraining: number;
  topPerformingContent: ContentPerformanceSummary[];
  lowPerformingContent: ContentPerformanceSummary[];
  agentPerformance: AgentPerformanceSummary[];
  anomaliesDetected: string[];
  recommendations: string[];
}

// ============================================================================
// FEEDBACK LOOP SERVICE
// ============================================================================

class FeedbackLoopService {
  private config: FeedbackLoopConfig;

  constructor(config?: Partial<FeedbackLoopConfig>) {
    this.config = {
      highEngagementThreshold: 0.4,
      lowEngagementThreshold: 0.1,
      boostAmount: 10,
      reductionAmount: 5,
      batchSize: 100,
      processingIntervalHours: 24,
      liberationBoostMultiplier: 1.2,
      culturalAuthenticityWeight: 0.3,
      communityRelevanceWeight: 0.3,
      ...config,
    };
  }

  // ========================================
  // MAIN FEEDBACK LOOP PROCESSING
  // ========================================

  /**
   * Run the complete feedback loop processing cycle
   */
  async runFeedbackLoopCycle(): Promise<FeedbackLoopReport> {
    const startTime = new Date();
    const report: FeedbackLoopReport = {
      processedAt: startTime,
      totalContentProcessed: 0,
      totalAgentsEvaluated: 0,
      contentBoosted: 0,
      contentReduced: 0,
      agentsTriggeredForRetraining: 0,
      topPerformingContent: [],
      lowPerformingContent: [],
      agentPerformance: [],
      anomaliesDetected: [],
      recommendations: [],
    };

    try {
      // Step 1: Gather performance metrics
      const contentMetrics = await this.gatherContentPerformanceMetrics();
      report.totalContentProcessed = contentMetrics.length;

      // Step 2: Analyze and categorize content
      const { high, low, normal } = this.categorizeContentPerformance(contentMetrics);

      // Step 3: Process high performers (boost)
      for (const content of high) {
        const boosted = await this.boostHighPerformer(content);
        if (boosted) {
          report.contentBoosted++;
          report.topPerformingContent.push(content);
        }
      }

      // Step 4: Process low performers (reduce)
      for (const content of low) {
        const reduced = await this.reduceUnderperformer(content);
        if (reduced) {
          report.contentReduced++;
          report.lowPerformingContent.push(content);
        }
      }

      // Step 5: Evaluate agent performance
      const agentMetrics = await this.evaluateAgentPerformance();
      report.totalAgentsEvaluated = agentMetrics.length;
      report.agentPerformance = agentMetrics;

      // Step 6: Check for retraining triggers
      for (const agent of agentMetrics) {
        if (agent.needsRetraining) {
          await this.triggerAgentRetraining(agent);
          report.agentsTriggeredForRetraining++;
        }
      }

      // Step 7: Detect anomalies
      const anomalies = await this.detectAnomalies(contentMetrics, agentMetrics);
      report.anomaliesDetected = anomalies;

      // Step 8: Generate recommendations
      report.recommendations = this.generateRecommendations(report);

      // Step 9: Log the cycle completion
      await this.logFeedbackLoopCycle(report);

    } catch (error) {
      console.error('Error in feedback loop cycle:', error);
      report.anomaliesDetected.push(`Cycle error: ${String(error)}`);
    }

    return report;
  }

  /**
   * Process feedback for specific content based on new metrics
   */
  async processContentFeedback(
    contentId: string,
    contentType: ContentType,
    metrics: Partial<EngagementMetrics>
  ): Promise<{ adjusted: boolean; adjustment: number; reason: string }> {
    try {
      // Get current intelligence data
      const intelligence = await this.getContentIntelligence(contentId);

      if (!intelligence) {
        return { adjusted: false, adjustment: 0, reason: 'Content not found in intelligence' };
      }

      // Calculate engagement rate
      const engagementRate = metrics.engagementRate || 0;
      const liberationAlignment = intelligence.liberation_alignment || 0.5;

      // Determine adjustment
      let adjustment = 0;
      let reason = '';

      if (engagementRate >= this.config.highEngagementThreshold) {
        // High engagement: boost
        adjustment = this.config.boostAmount;

        // Extra boost for liberation-aligned content
        if (liberationAlignment >= 0.7) {
          adjustment *= this.config.liberationBoostMultiplier;
          reason = 'High engagement + high liberation alignment';
        } else {
          reason = 'High engagement';
        }

        await performanceMetricsService.boostContentRelevance([contentId], adjustment, reason);

      } else if (engagementRate <= this.config.lowEngagementThreshold) {
        // Low engagement: reduce (but protect high liberation content)
        adjustment = -this.config.reductionAmount;

        // Smaller reduction for liberation-aligned content
        if (liberationAlignment >= 0.8) {
          adjustment = -Math.floor(this.config.reductionAmount / 2);
          reason = 'Low engagement but protected due to high liberation alignment';
        } else {
          reason = 'Low engagement';
        }

        await performanceMetricsService.reduceContentRelevance([contentId], Math.abs(adjustment), reason);
      } else {
        reason = 'Engagement within normal range - no adjustment needed';
      }

      // Log the event
      if (adjustment !== 0) {
        await this.logFeedbackEvent({
          event_type: adjustment > 0 ? 'relevance_boost' : 'relevance_reduction',
          source_table: 'ivor_intelligence',
          source_id: contentId,
          previous_value: intelligence.relevance_score,
          new_value: Math.max(0, Math.min(1, intelligence.relevance_score + (adjustment / 100))),
          change_amount: adjustment,
          change_reason: reason,
          triggered_by: 'feedback_loop',
          trigger_metric: 'engagement_rate',
          trigger_threshold: adjustment > 0 ? this.config.highEngagementThreshold : this.config.lowEngagementThreshold,
        });
      }

      return { adjusted: adjustment !== 0, adjustment, reason };
    } catch (error) {
      console.error('Error processing content feedback:', error);
      return { adjusted: false, adjustment: 0, reason: `Error: ${String(error)}` };
    }
  }

  // ========================================
  // METRIC GATHERING FUNCTIONS
  // ========================================

  /**
   * Gather comprehensive performance metrics for all active content
   */
  private async gatherContentPerformanceMetrics(): Promise<ContentPerformanceSummary[]> {
    try {
      // Get all active content from intelligence table
      const { data: intelligenceData, error: intError } = await supabase
        .from('ivor_intelligence')
        .select('*')
        .eq('is_active', true);

      if (intError || !intelligenceData) {
        console.error('Error fetching intelligence data:', intError);
        return [];
      }

      // Get recent performance metrics
      const { data: metricsData, error: metError } = await supabase
        .from('content_performance')
        .select('*')
        .gte('measured_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (metError) {
        console.error('Error fetching metrics data:', metError);
        return [];
      }

      // Aggregate metrics by content
      const metricsMap = new Map<string, {
        views: number;
        clicks: number;
        shares: number;
        engagements: number;
        opens: number;
      }>();

      (metricsData || []).forEach(metric => {
        const existing = metricsMap.get(metric.content_id) || {
          views: 0, clicks: 0, shares: 0, engagements: 0, opens: 0
        };

        switch (metric.metric_type) {
          case 'views':
            existing.views += metric.metric_value;
            break;
          case 'clicks':
            existing.clicks += metric.metric_value;
            break;
          case 'shares':
            existing.shares += metric.metric_value;
            break;
          case 'engagement':
            existing.engagements += metric.metric_value;
            break;
          case 'opens':
            existing.opens += metric.metric_value;
            break;
        }

        metricsMap.set(metric.content_id, existing);
      });

      // Create summaries
      return intelligenceData.map(intel => {
        const metrics = metricsMap.get(intel.content_id) || {
          views: 0, clicks: 0, shares: 0, engagements: 0, opens: 0
        };

        const totalViews = metrics.views || 1; // Avoid division by zero
        const engagementRate = (metrics.clicks + metrics.shares + metrics.engagements) / totalViews;
        const clickThroughRate = metrics.clicks / totalViews;
        const openRate = metrics.opens / totalViews;

        // Calculate recommended adjustment
        let recommendedAdjustment = 0;
        let adjustmentReason = 'Normal performance';

        if (engagementRate >= this.config.highEngagementThreshold) {
          recommendedAdjustment = this.config.boostAmount;
          if (intel.liberation_alignment >= 0.7) {
            recommendedAdjustment *= this.config.liberationBoostMultiplier;
          }
          adjustmentReason = 'High engagement - recommend boost';
        } else if (engagementRate <= this.config.lowEngagementThreshold) {
          recommendedAdjustment = -this.config.reductionAmount;
          if (intel.liberation_alignment >= 0.8) {
            recommendedAdjustment = -Math.floor(this.config.reductionAmount / 2);
          }
          adjustmentReason = 'Low engagement - recommend reduction';
        }

        return {
          contentId: intel.content_id,
          contentType: intel.content_type as ContentType,
          totalViews: metrics.views,
          totalClicks: metrics.clicks,
          totalShares: metrics.shares,
          totalEngagements: metrics.engagements,
          openRate,
          clickThroughRate,
          engagementRate,
          liberationAlignment: intel.liberation_alignment || 0.5,
          currentRelevanceScore: intel.relevance_score,
          recommendedAdjustment,
          adjustmentReason,
        };
      });
    } catch (error) {
      console.error('Error gathering content metrics:', error);
      return [];
    }
  }

  /**
   * Categorize content into high, low, and normal performers
   */
  private categorizeContentPerformance(
    metrics: ContentPerformanceSummary[]
  ): { high: ContentPerformanceSummary[]; low: ContentPerformanceSummary[]; normal: ContentPerformanceSummary[] } {
    const high: ContentPerformanceSummary[] = [];
    const low: ContentPerformanceSummary[] = [];
    const normal: ContentPerformanceSummary[] = [];

    metrics.forEach(metric => {
      if (metric.engagementRate >= this.config.highEngagementThreshold) {
        high.push(metric);
      } else if (metric.engagementRate <= this.config.lowEngagementThreshold) {
        low.push(metric);
      } else {
        normal.push(metric);
      }
    });

    // Sort high performers by engagement
    high.sort((a, b) => b.engagementRate - a.engagementRate);

    // Sort low performers by relevance (give priority to liberation-aligned content)
    low.sort((a, b) => a.liberationAlignment - b.liberationAlignment);

    return { high, low, normal };
  }

  // ========================================
  // ADJUSTMENT FUNCTIONS
  // ========================================

  /**
   * Boost a high-performing piece of content
   */
  private async boostHighPerformer(content: ContentPerformanceSummary): Promise<boolean> {
    try {
      let boostAmount = this.config.boostAmount;
      let reason = 'High engagement';

      // Extra boost for liberation-aligned content
      if (content.liberationAlignment >= 0.7) {
        boostAmount *= this.config.liberationBoostMultiplier;
        reason = 'High engagement + liberation aligned';
      }

      const result = await performanceMetricsService.boostContentRelevance(
        [content.contentId],
        boostAmount,
        reason
      );

      return result > 0;
    } catch (error) {
      console.error('Error boosting high performer:', error);
      return false;
    }
  }

  /**
   * Reduce relevance of underperforming content
   */
  private async reduceUnderperformer(content: ContentPerformanceSummary): Promise<boolean> {
    try {
      let reductionAmount = this.config.reductionAmount;
      let reason = 'Low engagement';

      // Protect liberation-aligned content
      if (content.liberationAlignment >= 0.8) {
        reductionAmount = Math.floor(reductionAmount / 2);
        reason = 'Low engagement (protected - high liberation alignment)';
      }

      const result = await performanceMetricsService.reduceContentRelevance(
        [content.contentId],
        reductionAmount,
        reason
      );

      return result > 0;
    } catch (error) {
      console.error('Error reducing underperformer:', error);
      return false;
    }
  }

  // ========================================
  // AGENT EVALUATION FUNCTIONS
  // ========================================

  /**
   * Evaluate all agent performance
   */
  private async evaluateAgentPerformance(): Promise<AgentPerformanceSummary[]> {
    try {
      const { data, error } = await supabase
        .from('agent_quality_scores')
        .select('*')
        .eq('score_period', 'weekly')
        .order('period_start', { ascending: false });

      if (error || !data) {
        console.error('Error fetching agent scores:', error);
        return [];
      }

      // Group by agent and get latest scores
      const agentMap = new Map<string, any>();
      data.forEach(score => {
        if (!agentMap.has(score.agent_id)) {
          agentMap.set(score.agent_id, score);
        }
      });

      return Array.from(agentMap.values()).map(score => ({
        agentId: score.agent_id,
        agentType: score.agent_type,
        approvalRate: score.approval_rate || 0,
        engagementScore: score.engagement_score || 0,
        liberationAlignmentScore: score.liberation_alignment_score || 0,
        totalItemsProcessed: score.total_items_processed || 0,
        performanceTrend: score.performance_trend || 'stable',
        needsRetraining: this.checkRetrainingNeed(score),
        retrainingReason: this.getRetrainingReason(score),
      }));
    } catch (error) {
      console.error('Error evaluating agent performance:', error);
      return [];
    }
  }

  /**
   * Check if an agent needs retraining
   */
  private checkRetrainingNeed(agentScore: any): boolean {
    // Retrain if:
    // 1. Approval rate below 60%
    // 2. Performance trend is declining
    // 3. Liberation alignment score below 0.5
    return (
      (agentScore.approval_rate || 0) < 0.6 ||
      agentScore.performance_trend === 'declining' ||
      (agentScore.liberation_alignment_score || 0) < 0.5
    );
  }

  /**
   * Get the reason for retraining
   */
  private getRetrainingReason(agentScore: any): string | undefined {
    const reasons: string[] = [];

    if ((agentScore.approval_rate || 0) < 0.6) {
      reasons.push('Low approval rate');
    }
    if (agentScore.performance_trend === 'declining') {
      reasons.push('Declining performance trend');
    }
    if ((agentScore.liberation_alignment_score || 0) < 0.5) {
      reasons.push('Low liberation alignment');
    }

    return reasons.length > 0 ? reasons.join(', ') : undefined;
  }

  /**
   * Trigger agent retraining
   */
  private async triggerAgentRetraining(agent: AgentPerformanceSummary): Promise<void> {
    await this.logFeedbackEvent({
      event_type: 'agent_retrain_trigger',
      source_table: 'agent_quality_scores',
      source_id: agent.agentId,
      change_reason: agent.retrainingReason,
      triggered_by: 'feedback_loop',
      metadata: {
        agent_type: agent.agentType,
        approval_rate: agent.approvalRate,
        performance_trend: agent.performanceTrend,
      },
    });

    console.log(`Retraining triggered for agent ${agent.agentId}: ${agent.retrainingReason}`);
  }

  // ========================================
  // ANOMALY DETECTION
  // ========================================

  /**
   * Detect anomalies in performance data
   */
  private async detectAnomalies(
    contentMetrics: ContentPerformanceSummary[],
    agentMetrics: AgentPerformanceSummary[]
  ): Promise<string[]> {
    const anomalies: string[] = [];

    // Check for sudden performance drops
    const avgEngagement = contentMetrics.reduce((sum, m) => sum + m.engagementRate, 0) / contentMetrics.length;
    if (avgEngagement < 0.05) {
      anomalies.push('Overall engagement rate critically low');
    }

    // Check for agent issues
    const decliningAgents = agentMetrics.filter(a => a.performanceTrend === 'declining').length;
    if (decliningAgents > agentMetrics.length / 2) {
      anomalies.push(`More than half of agents (${decliningAgents}) showing declining performance`);
    }

    // Check for unusual content patterns
    const lowPerformers = contentMetrics.filter(m => m.engagementRate < this.config.lowEngagementThreshold);
    if (lowPerformers.length > contentMetrics.length * 0.5) {
      anomalies.push('More than 50% of content underperforming');
    }

    return anomalies;
  }

  // ========================================
  // RECOMMENDATION GENERATION
  // ========================================

  /**
   * Generate recommendations based on the feedback loop report
   */
  private generateRecommendations(report: FeedbackLoopReport): string[] {
    const recommendations: string[] = [];

    // Content recommendations
    if (report.contentBoosted > 0) {
      recommendations.push(
        `Consider creating more content similar to the ${report.contentBoosted} high-performing items`
      );
    }

    if (report.contentReduced > 10) {
      recommendations.push(
        'Review content strategy - high number of underperforming items detected'
      );
    }

    // Agent recommendations
    if (report.agentsTriggeredForRetraining > 0) {
      recommendations.push(
        `${report.agentsTriggeredForRetraining} agents need retraining - review agent configurations`
      );
    }

    // Liberation alignment recommendations
    const avgLiberationAlignment = report.topPerformingContent.reduce(
      (sum, c) => sum + c.liberationAlignment, 0
    ) / (report.topPerformingContent.length || 1);

    if (avgLiberationAlignment > 0.7) {
      recommendations.push(
        'High liberation-aligned content performing well - continue prioritizing liberation values'
      );
    }

    // Anomaly-based recommendations
    if (report.anomaliesDetected.length > 0) {
      recommendations.push('Address detected anomalies before next feedback cycle');
    }

    return recommendations;
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /**
   * Get content intelligence data
   */
  private async getContentIntelligence(contentId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('ivor_intelligence')
        .select('*')
        .eq('content_id', contentId)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Log a feedback loop event
   */
  private async logFeedbackEvent(event: FeedbackLoopEvent): Promise<void> {
    try {
      await supabase.from('feedback_loop_events').insert({
        event_type: event.event_type,
        source_table: event.source_table,
        source_id: event.source_id,
        previous_value: event.previous_value,
        new_value: event.new_value,
        change_amount: event.change_amount,
        change_reason: event.change_reason,
        triggered_by: event.triggered_by,
        trigger_metric: event.trigger_metric,
        trigger_threshold: event.trigger_threshold,
        metadata: event.metadata || {},
      });
    } catch (error) {
      console.error('Error logging feedback event:', error);
    }
  }

  /**
   * Log the complete feedback loop cycle
   */
  private async logFeedbackLoopCycle(report: FeedbackLoopReport): Promise<void> {
    try {
      await supabase.from('feedback_loop_events').insert({
        event_type: 'performance_milestone',
        source_table: 'feedback_loop_cycle',
        source_id: crypto.randomUUID(),
        change_reason: 'Feedback loop cycle completed',
        triggered_by: 'system',
        metadata: {
          processed_at: report.processedAt.toISOString(),
          total_content_processed: report.totalContentProcessed,
          total_agents_evaluated: report.totalAgentsEvaluated,
          content_boosted: report.contentBoosted,
          content_reduced: report.contentReduced,
          agents_triggered_for_retraining: report.agentsTriggeredForRetraining,
          anomalies_count: report.anomaliesDetected.length,
          recommendations_count: report.recommendations.length,
        },
      });
    } catch (error) {
      console.error('Error logging feedback cycle:', error);
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<FeedbackLoopConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): FeedbackLoopConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const feedbackLoopService = new FeedbackLoopService();
