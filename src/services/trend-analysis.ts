// BLKOUT Liberation Platform - Trend Analysis Service
// Community empowerment-focused trend detection and analysis
// Privacy-preserving insights with liberation values enforcement

export interface TrendAnalysisConfig {
  analysis_period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  liberation_focus: boolean;
  community_validation_required: boolean;
  privacy_level: 'public' | 'community' | 'detailed';
  min_data_points: number;
  confidence_threshold: number;
}

export interface CommunityTrend {
  id: string;
  category: string;
  subcategory?: string;
  trend_strength: number; // 0-1 scale
  growth_rate: number; // -1 to 1 scale
  liberation_impact: number; // -1 to 1 scale
  community_interest_score: number; // 0-1 scale
  content_volume: number;
  unique_contributors: number;
  avg_quality_score: number;
  avg_community_rating: number;
  engagement_patterns: EngagementPattern[];
  demographic_insights: DemographicInsight[];
  trend_period: {
    start_date: Date;
    end_date: Date;
    period_type: string;
  };
  confidence_level: number;
  community_validated: boolean;
  validation_votes: number;
}

export interface EngagementPattern {
  metric_name: string;
  value: number;
  trend_direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  community_impact: number;
  liberation_alignment: number;
}

export interface DemographicInsight {
  dimension: string; // e.g., 'age_range', 'identity_group', 'location_type'
  distribution: { [key: string]: number }; // Anonymized distribution
  engagement_variation: number; // How engagement varies across groups
  liberation_impact_variation: number;
}

export interface TrendPrediction {
  trend_id: string;
  predicted_trajectory: 'growth' | 'decline' | 'stability' | 'volatility';
  confidence: number;
  factors: TrendFactor[];
  liberation_implications: string[];
  community_empowerment_potential: number;
  recommended_actions: string[];
}

export interface TrendFactor {
  factor_name: string;
  influence_strength: number; // -1 to 1
  factor_type: 'content' | 'community' | 'external' | 'platform' | 'liberation';
  description: string;
}

export interface CommunityEmpowermentMetrics {
  organizing_potential: number; // 0-1 scale
  healing_impact: number; // 0-1 scale
  joy_celebration: number; // 0-1 scale
  economic_justice_focus: number; // 0-1 scale
  cultural_authenticity: number; // 0-1 scale
  democratic_participation: number; // 0-1 scale
  creator_sovereignty: number; // 0-1 scale
  anti_oppression_alignment: number; // 0-1 scale
}

class TrendAnalysisService {
  private config: TrendAnalysisConfig;
  private liberationWeights: Map<string, number>;

  constructor(config?: Partial<TrendAnalysisConfig>) {
    this.config = {
      analysis_period: 'weekly',
      liberation_focus: true,
      community_validation_required: true,
      privacy_level: 'community',
      min_data_points: 10,
      confidence_threshold: 0.7,
      ...config
    };

    this.initializeLiberationWeights();
  }

  /**
   * Analyze community trends with liberation values focus
   */
  async analyzeCommunityTrends(
    contentData: any[],
    timeframe: { start: Date; end: Date }
  ): Promise<CommunityTrend[]> {

    // Filter for liberation-aligned content if focus is enabled
    const analysisData = this.config.liberation_focus
      ? contentData.filter(item => this.isLiberationAligned(item))
      : contentData;

    // Group content by categories for trend analysis
    const categoryGroups = this.groupContentByCategory(analysisData);

    const trends: CommunityTrend[] = [];

    for (const [category, items] of categoryGroups.entries()) {
      if (items.length < this.config.min_data_points) continue;

      const trend = await this.calculateCategoryTrend(category, items, timeframe);

      if (trend.confidence_level >= this.config.confidence_threshold) {
        trends.push(trend);
      }
    }

    // Sort by liberation impact and community interest
    return trends.sort((a, b) => {
      const scoreA = (a.liberation_impact * 0.6) + (a.community_interest_score * 0.4);
      const scoreB = (b.liberation_impact * 0.6) + (b.community_interest_score * 0.4);
      return scoreB - scoreA;
    });
  }

  /**
   * Predict future trends based on current patterns
   */
  async predictTrendTrajectories(
    currentTrends: CommunityTrend[],
    historicalData?: any[]
  ): Promise<TrendPrediction[]> {

    const predictions: TrendPrediction[] = [];

    for (const trend of currentTrends) {
      const prediction = await this.generateTrendPrediction(trend, historicalData);
      predictions.push(prediction);
    }

    return predictions.sort((a, b) =>
      b.community_empowerment_potential - a.community_empowerment_potential
    );
  }

  /**
   * Analyze community empowerment metrics from trends
   */
  calculateCommunityEmpowermentMetrics(trends: CommunityTrend[]): CommunityEmpowermentMetrics {
    const metrics: CommunityEmpowermentMetrics = {
      organizing_potential: 0,
      healing_impact: 0,
      joy_celebration: 0,
      economic_justice_focus: 0,
      cultural_authenticity: 0,
      democratic_participation: 0,
      creator_sovereignty: 0,
      anti_oppression_alignment: 0
    };

    if (trends.length === 0) return metrics;

    // Calculate weighted averages based on liberation impact and community interest
    for (const trend of trends) {
      const weight = (trend.liberation_impact + trend.community_interest_score) / 2;

      metrics.organizing_potential += this.extractMetricFromTrend(trend, 'organizing') * weight;
      metrics.healing_impact += this.extractMetricFromTrend(trend, 'healing') * weight;
      metrics.joy_celebration += this.extractMetricFromTrend(trend, 'joy') * weight;
      metrics.economic_justice_focus += this.extractMetricFromTrend(trend, 'economic_justice') * weight;
      metrics.cultural_authenticity += this.extractMetricFromTrend(trend, 'cultural') * weight;
      metrics.democratic_participation += this.extractMetricFromTrend(trend, 'democratic') * weight;
      metrics.creator_sovereignty += this.extractMetricFromTrend(trend, 'creator') * weight;
      metrics.anti_oppression_alignment += this.extractMetricFromTrend(trend, 'anti_oppression') * weight;
    }

    // Normalize by total weight
    const totalWeight = trends.reduce((sum, trend) =>
      sum + ((trend.liberation_impact + trend.community_interest_score) / 2), 0);

    if (totalWeight > 0) {
      Object.keys(metrics).forEach(key => {
        (metrics as any)[key] /= totalWeight;
      });
    }

    return metrics;
  }

  /**
   * Identify emerging liberation-focused topics
   */
  async identifyEmergingLiberationTopics(
    contentData: any[],
    timeWindow: { current: Date; comparison: Date }
  ): Promise<{
    topic: string;
    emergence_strength: number;
    liberation_alignment: number;
    community_engagement: number;
    growth_velocity: number;
  }[]> {

    // Extract topics from recent content
    const currentPeriodTopics = this.extractTopics(
      contentData.filter(item => new Date(item.created_at) >= timeWindow.comparison)
    );

    const emergingTopics: any[] = [];

    for (const [topic, currentData] of currentPeriodTopics.entries()) {
      const historicalData = this.getHistoricalTopicData(topic, contentData, timeWindow.comparison);

      if (this.isEmergingTopic(currentData, historicalData)) {
        const liberationAlignment = this.assessTopicLiberationAlignment(topic, currentData);
        const communityEngagement = this.calculateTopicEngagement(currentData);
        const growthVelocity = this.calculateTopicGrowth(currentData, historicalData);
        const emergenceStrength = this.calculateEmergenceStrength(currentData, historicalData);

        emergingTopics.push({
          topic,
          emergence_strength: emergenceStrength,
          liberation_alignment: liberationAlignment,
          community_engagement: communityEngagement,
          growth_velocity: growthVelocity
        });
      }
    }

    return emergingTopics
      .sort((a, b) =>
        (b.liberation_alignment * 0.4 + b.emergence_strength * 0.3 + b.community_engagement * 0.3) -
        (a.liberation_alignment * 0.4 + a.emergence_strength * 0.3 + a.community_engagement * 0.3)
      )
      .slice(0, 10);
  }

  /**
   * Generate community insights report
   */
  generateCommunityInsightsReport(
    trends: CommunityTrend[],
    empowermentMetrics: CommunityEmpowermentMetrics,
    predictions: TrendPrediction[]
  ): {
    summary: string;
    key_insights: string[];
    liberation_highlights: string[];
    community_empowerment_areas: string[];
    recommended_actions: string[];
    celebration_moments: string[];
  } {

    const report = {
      summary: this.generateSummary(trends, empowermentMetrics),
      key_insights: this.extractKeyInsights(trends),
      liberation_highlights: this.extractLiberationHighlights(trends, empowermentMetrics),
      community_empowerment_areas: this.identifyEmpowermentAreas(empowermentMetrics),
      recommended_actions: this.generateRecommendedActions(predictions),
      celebration_moments: this.identifyCelebrationMoments(trends)
    };

    return report;
  }

  // Private helper methods

  private initializeLiberationWeights(): void {
    this.liberationWeights = new Map([
      ['community-organizing', 0.95],
      ['economic-justice', 0.92],
      ['anti-oppression', 0.90],
      ['creator-sovereignty', 0.88],
      ['healing-centered', 0.85],
      ['cultural-authenticity', 0.83],
      ['democratic-participation', 0.80],
      ['joy-celebration', 0.78],
      ['mutual-aid', 0.85],
      ['platform-sovereignty', 0.87]
    ]);
  }

  private isLiberationAligned(item: any): boolean {
    if (!item.liberation_alignment_score) return false;
    return item.liberation_alignment_score >= 0.6;
  }

  private groupContentByCategory(data: any[]): Map<string, any[]> {
    const groups = new Map<string, any[]>();

    for (const item of data) {
      const category = item.primary_category || item.category || 'General';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(item);
    }

    return groups;
  }

  private async calculateCategoryTrend(
    category: string,
    items: any[],
    timeframe: { start: Date; end: Date }
  ): Promise<CommunityTrend> {

    // Sort items by date
    const sortedItems = items.sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Calculate trend metrics
    const trendStrength = this.calculateTrendStrength(sortedItems);
    const growthRate = this.calculateGrowthRate(sortedItems, timeframe);
    const liberationImpact = this.calculateLiberationImpact(sortedItems);
    const communityInterest = this.calculateCommunityInterest(sortedItems);
    const qualityScore = this.calculateAverageQuality(sortedItems);
    const communityRating = this.calculateAverageCommunityRating(sortedItems);
    const engagementPatterns = this.analyzeEngagementPatterns(sortedItems);
    const demographicInsights = this.analyzeDemographics(sortedItems);
    const uniqueContributors = this.countUniqueContributors(sortedItems);

    return {
      id: `trend_${category}_${Date.now()}`,
      category,
      trend_strength: trendStrength,
      growth_rate: growthRate,
      liberation_impact: liberationImpact,
      community_interest_score: communityInterest,
      content_volume: items.length,
      unique_contributors: uniqueContributors,
      avg_quality_score: qualityScore,
      avg_community_rating: communityRating,
      engagement_patterns: engagementPatterns,
      demographic_insights: demographicInsights,
      trend_period: {
        start_date: timeframe.start,
        end_date: timeframe.end,
        period_type: this.config.analysis_period
      },
      confidence_level: this.calculateConfidence(trendStrength, items.length),
      community_validated: false,
      validation_votes: 0
    };
  }

  private calculateTrendStrength(items: any[]): number {
    if (items.length < 3) return 0;

    // Calculate momentum based on recent activity increase
    const totalDays = 30; // Last 30 days
    const midPoint = Math.floor(items.length / 2);

    const firstHalf = items.slice(0, midPoint);
    const secondHalf = items.slice(midPoint);

    const firstHalfRate = firstHalf.length / (totalDays / 2);
    const secondHalfRate = secondHalf.length / (totalDays / 2);

    if (firstHalfRate === 0) return secondHalfRate > 0 ? 1 : 0;

    const strength = (secondHalfRate - firstHalfRate) / firstHalfRate;
    return Math.max(0, Math.min(1, (strength + 1) / 2));
  }

  private calculateGrowthRate(items: any[], timeframe: { start: Date; end: Date }): number {
    const timeSpan = timeframe.end.getTime() - timeframe.start.getTime();
    const daySpan = timeSpan / (1000 * 60 * 60 * 24);

    if (daySpan <= 1) return 0;

    const midPoint = new Date(timeframe.start.getTime() + (timeSpan / 2));

    const firstHalf = items.filter(item => new Date(item.created_at) < midPoint).length;
    const secondHalf = items.filter(item => new Date(item.created_at) >= midPoint).length;

    if (firstHalf === 0) return secondHalf > 0 ? 1 : 0;

    const growthRate = (secondHalf - firstHalf) / firstHalf;
    return Math.max(-1, Math.min(1, growthRate));
  }

  private calculateLiberationImpact(items: any[]): number {
    if (items.length === 0) return 0;

    const liberationScores = items
      .filter(item => item.liberation_alignment_score != null)
      .map(item => item.liberation_alignment_score);

    if (liberationScores.length === 0) return 0.5; // Neutral if no scores

    return liberationScores.reduce((sum, score) => sum + score, 0) / liberationScores.length;
  }

  private calculateCommunityInterest(items: any[]): number {
    if (items.length === 0) return 0;

    const interestScores = items.map(item => {
      const votes = item.total_votes || 0;
      const rating = item.community_rating || 0;
      const engagement = item.engagement_score || 0;

      // Normalize and combine metrics
      const voteScore = Math.min(1, votes / 100); // Normalize votes to 0-1
      const ratingScore = rating / 5; // Assuming 5-point scale
      const engagementScore = engagement; // Assuming already 0-1

      return (voteScore + ratingScore + engagementScore) / 3;
    });

    return interestScores.reduce((sum, score) => sum + score, 0) / interestScores.length;
  }

  private calculateAverageQuality(items: any[]): number {
    if (items.length === 0) return 0;

    const qualityScores = items
      .filter(item => item.quality_score != null)
      .map(item => item.quality_score);

    if (qualityScores.length === 0) return 0.7; // Default quality assumption

    return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
  }

  private calculateAverageCommunityRating(items: any[]): number {
    if (items.length === 0) return 0;

    const ratings = items
      .filter(item => item.community_rating != null)
      .map(item => item.community_rating);

    if (ratings.length === 0) return 3.5; // Default neutral rating

    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }

  private analyzeEngagementPatterns(items: any[]): EngagementPattern[] {
    const patterns: EngagementPattern[] = [];

    // Analyze different engagement metrics
    const metrics = ['views', 'shares', 'discussions', 'ratings'];

    for (const metric of metrics) {
      const values = items
        .filter(item => item[metric] != null)
        .map(item => item[metric]);

      if (values.length < 2) continue;

      const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
      const trend = this.calculateMetricTrend(values);

      patterns.push({
        metric_name: metric,
        value: avgValue,
        trend_direction: trend,
        community_impact: this.assessCommunityImpact(metric, avgValue),
        liberation_alignment: this.assessMetricLiberationAlignment(metric, items)
      });
    }

    return patterns;
  }

  private analyzeDemographics(items: any[]): DemographicInsight[] {
    // Privacy-preserving demographic analysis
    const insights: DemographicInsight[] = [];

    // Analyze engagement patterns across different dimensions (anonymized)
    const dimensions = ['age_range', 'identity_group', 'location_type'];

    for (const dimension of dimensions) {
      const distribution = this.calculateAnonymizedDistribution(items, dimension);
      const engagementVariation = this.calculateEngagementVariation(items, dimension);
      const liberationVariation = this.calculateLiberationVariation(items, dimension);

      insights.push({
        dimension,
        distribution,
        engagement_variation: engagementVariation,
        liberation_impact_variation: liberationVariation
      });
    }

    return insights;
  }

  private countUniqueContributors(items: any[]): number {
    const contributors = new Set();
    items.forEach(item => {
      if (item.author || item.curator_id || item.submitted_by) {
        contributors.add(item.author || item.curator_id || item.submitted_by);
      }
    });
    return contributors.size;
  }

  private calculateConfidence(trendStrength: number, sampleSize: number): number {
    // Higher confidence with stronger trends and larger sample sizes
    const strengthFactor = trendStrength;
    const sizeFactor = Math.min(1, sampleSize / 50); // Normalize to 50 items

    return (strengthFactor + sizeFactor) / 2;
  }

  private async generateTrendPrediction(
    trend: CommunityTrend,
    historicalData?: any[]
  ): Promise<TrendPrediction> {

    const factors = this.identifyTrendFactors(trend, historicalData);
    const trajectory = this.predictTrajectory(trend, factors);
    const liberationImplications = this.assessLiberationImplications(trend, trajectory);
    const empowermentPotential = this.calculateEmpowermentPotential(trend, factors);
    const actions = this.generateActionRecommendations(trend, trajectory, factors);

    return {
      trend_id: trend.id,
      predicted_trajectory: trajectory,
      confidence: trend.confidence_level,
      factors,
      liberation_implications: liberationImplications,
      community_empowerment_potential: empowermentPotential,
      recommended_actions: actions
    };
  }

  private extractMetricFromTrend(trend: CommunityTrend, metricType: string): number {
    // Extract specific liberation metrics from trend data
    const keywords = this.getLiberationKeywords(metricType);

    // Analyze trend category and content for liberation alignment
    const categoryMatch = keywords.some(keyword =>
      trend.category.toLowerCase().includes(keyword)
    );

    return categoryMatch ? 0.8 : 0.3; // High score for matching categories
  }

  private getLiberationKeywords(metricType: string): string[] {
    const keywordMap = {
      'organizing': ['organizing', 'activism', 'movement', 'collective', 'mobilize'],
      'healing': ['healing', 'wellness', 'therapy', 'support', 'care'],
      'joy': ['joy', 'celebration', 'happiness', 'festival', 'art'],
      'economic_justice': ['economic', 'finance', 'wage', 'wealth', 'justice'],
      'cultural': ['culture', 'heritage', 'tradition', 'identity', 'authenticity'],
      'democratic': ['democratic', 'vote', 'governance', 'participation', 'consensus'],
      'creator': ['creator', 'artist', 'ownership', 'sovereignty', 'rights'],
      'anti_oppression': ['justice', 'liberation', 'equality', 'anti-racist', 'freedom']
    };

    return keywordMap[metricType as keyof typeof keywordMap] || [];
  }

  // Additional helper methods would be implemented here...

  private extractTopics(data: any[]): Map<string, any> {
    const topics = new Map();
    // Topic extraction logic would go here
    return topics;
  }

  private getHistoricalTopicData(topic: string, data: any[], cutoffDate: Date): any {
    // Historical data retrieval logic
    return {};
  }

  private isEmergingTopic(currentData: any, historicalData: any): boolean {
    // Emergence detection logic
    return true;
  }

  private assessTopicLiberationAlignment(topic: string, data: any): number {
    // Topic liberation alignment assessment
    return 0.8;
  }

  private calculateTopicEngagement(data: any): number {
    // Topic engagement calculation
    return 0.7;
  }

  private calculateTopicGrowth(currentData: any, historicalData: any): number {
    // Growth velocity calculation
    return 0.6;
  }

  private calculateEmergenceStrength(currentData: any, historicalData: any): number {
    // Emergence strength calculation
    return 0.8;
  }

  private generateSummary(trends: CommunityTrend[], metrics: CommunityEmpowermentMetrics): string {
    return `Community trends analysis shows strong liberation alignment with ${trends.length} active trends identified.`;
  }

  private extractKeyInsights(trends: CommunityTrend[]): string[] {
    return trends.slice(0, 5).map(trend =>
      `${trend.category} showing ${trend.growth_rate > 0 ? 'growth' : 'stability'} with ${Math.round(trend.liberation_impact * 100)}% liberation alignment`
    );
  }

  private extractLiberationHighlights(trends: CommunityTrend[], metrics: CommunityEmpowermentMetrics): string[] {
    const highlights: string[] = [];

    if (metrics.organizing_potential > 0.7) {
      highlights.push('Strong community organizing potential identified');
    }
    if (metrics.healing_impact > 0.7) {
      highlights.push('Significant healing-centered content engagement');
    }
    if (metrics.joy_celebration > 0.7) {
      highlights.push('Vibrant Black joy and celebration themes trending');
    }

    return highlights;
  }

  private identifyEmpowermentAreas(metrics: CommunityEmpowermentMetrics): string[] {
    const areas: string[] = [];
    const threshold = 0.6;

    Object.entries(metrics).forEach(([key, value]) => {
      if (value > threshold) {
        areas.push(key.replace('_', ' '));
      }
    });

    return areas;
  }

  private generateRecommendedActions(predictions: TrendPrediction[]): string[] {
    const actions: string[] = [];

    predictions.forEach(prediction => {
      if (prediction.community_empowerment_potential > 0.8) {
        actions.push(`Amplify ${prediction.trend_id} for maximum community benefit`);
      }
    });

    return actions.slice(0, 5);
  }

  private identifyCelebrationMoments(trends: CommunityTrend[]): string[] {
    return trends
      .filter(trend => trend.liberation_impact > 0.8)
      .map(trend => `${trend.category} achieving high liberation alignment`)
      .slice(0, 3);
  }

  // Additional private methods for completeness...

  private calculateMetricTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' | 'volatile' {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const changeRatio = (secondAvg - firstAvg) / Math.max(firstAvg, 1);

    if (Math.abs(changeRatio) < 0.1) return 'stable';
    if (changeRatio > 0.1) return 'increasing';
    if (changeRatio < -0.1) return 'decreasing';
    return 'volatile';
  }

  private assessCommunityImpact(metric: string, value: number): number {
    // Simple impact assessment based on metric type and value
    const impactWeights = {
      'views': 0.3,
      'shares': 0.8,
      'discussions': 0.9,
      'ratings': 0.7
    };

    const baseImpact = (impactWeights as any)[metric] || 0.5;
    const valueImpact = Math.min(1, value / 1000); // Normalize large values

    return (baseImpact + valueImpact) / 2;
  }

  private assessMetricLiberationAlignment(metric: string, items: any[]): number {
    // Assess how well a metric aligns with liberation values
    const avgLiberationScore = items
      .filter(item => item.liberation_alignment_score != null)
      .reduce((sum, item) => sum + item.liberation_alignment_score, 0) /
      Math.max(items.length, 1);

    return avgLiberationScore;
  }

  private calculateAnonymizedDistribution(items: any[], dimension: string): { [key: string]: number } {
    // Privacy-preserving demographic distribution
    const distribution: { [key: string]: number } = {};

    // Mock anonymized distribution for privacy
    distribution['group_a'] = 0.4;
    distribution['group_b'] = 0.3;
    distribution['group_c'] = 0.2;
    distribution['group_d'] = 0.1;

    return distribution;
  }

  private calculateEngagementVariation(items: any[], dimension: string): number {
    // Calculate how engagement varies across demographic groups
    return 0.2; // Mock variation score
  }

  private calculateLiberationVariation(items: any[], dimension: string): number {
    // Calculate liberation impact variation across groups
    return 0.15; // Mock variation score
  }

  private identifyTrendFactors(trend: CommunityTrend, historicalData?: any[]): TrendFactor[] {
    const factors: TrendFactor[] = [
      {
        factor_name: 'Community Interest',
        influence_strength: trend.community_interest_score,
        factor_type: 'community',
        description: 'Level of community engagement and interest'
      },
      {
        factor_name: 'Liberation Alignment',
        influence_strength: trend.liberation_impact,
        factor_type: 'liberation',
        description: 'Alignment with liberation values and principles'
      },
      {
        factor_name: 'Content Quality',
        influence_strength: trend.avg_quality_score,
        factor_type: 'content',
        description: 'Overall quality and value of content in category'
      }
    ];

    return factors;
  }

  private predictTrajectory(trend: CommunityTrend, factors: TrendFactor[]): 'growth' | 'decline' | 'stability' | 'volatility' {
    const avgFactorStrength = factors.reduce((sum, factor) => sum + factor.influence_strength, 0) / factors.length;

    if (avgFactorStrength > 0.7 && trend.growth_rate > 0.1) return 'growth';
    if (avgFactorStrength < 0.4 || trend.growth_rate < -0.1) return 'decline';
    if (trend.confidence_level < 0.5) return 'volatility';
    return 'stability';
  }

  private assessLiberationImplications(trend: CommunityTrend, trajectory: string): string[] {
    const implications: string[] = [];

    if (trend.liberation_impact > 0.8) {
      implications.push('Strong potential for community empowerment');
    }
    if (trajectory === 'growth') {
      implications.push('Growing liberation consciousness in community');
    }

    return implications;
  }

  private calculateEmpowermentPotential(trend: CommunityTrend, factors: TrendFactor[]): number {
    const liberationFactor = factors.find(f => f.factor_type === 'liberation');
    const communityFactor = factors.find(f => f.factor_type === 'community');

    const liberationWeight = liberationFactor?.influence_strength || 0;
    const communityWeight = communityFactor?.influence_strength || 0;

    return (liberationWeight * 0.6 + communityWeight * 0.4);
  }

  private generateActionRecommendations(trend: CommunityTrend, trajectory: string, factors: TrendFactor[]): string[] {
    const actions: string[] = [];

    if (trajectory === 'growth' && trend.liberation_impact > 0.7) {
      actions.push('Amplify and promote this trend for maximum community benefit');
    }

    if (trend.avg_quality_score < 0.6) {
      actions.push('Focus on improving content quality in this category');
    }

    return actions;
  }
}

// Export the service class and interfaces
export { TrendAnalysisService };
export type { TrendAnalysisConfig, CommunityTrend, TrendPrediction, CommunityEmpowermentMetrics };