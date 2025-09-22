// BLKOUT Liberation Platform - Story of the Week Selection Algorithm
// Intelligent ranking system for community-curated content

import type { NewsArticle } from '@/types/liberation';

interface StoryMetrics {
  interestScore: number;      // 0-100 based on community voting
  totalVotes: number;         // Number of community votes
  relevanceScore: number;     // 0-100 AI-determined relevance
  freshnessScore: number;     // 0-100 based on recency
  curatorReputationScore: number; // 0-100 based on curator history
  diversityScore: number;     // 0-100 encouraging topic diversity
  engagementScore: number;    // 0-100 based on discussion/shares
}

interface WeeklySelectionResult {
  storyOfWeek: NewsArticle;
  topStories: NewsArticle[];
  diversityBoosts: NewsArticle[];
  emergingVoices: NewsArticle[];
  algorithmVersion: string;
  selectionReasoning: string[];
  confidenceScore: number;
}

export class StorySelectionAlgorithm {
  private readonly ALGORITHM_VERSION = "1.0.0-community-first";

  // Weighting factors for different metrics (sum = 1.0)
  private readonly weights = {
    interest: 0.35,        // Community interest is primary factor
    relevance: 0.20,       // AI relevance for liberation themes
    freshness: 0.15,       // Recent content preferred
    curatorReputation: 0.10, // Trust established curators
    diversity: 0.10,       // Encourage topic diversity
    engagement: 0.10       // Social proof through engagement
  };

  // Diversity categories for balanced selection
  private readonly diversityCategories = [
    'liberation', 'community', 'culture', 'politics',
    'health', 'economics', 'environment', 'technology'
  ];

  constructor() {
    console.log(`Story Selection Algorithm v${this.ALGORITHM_VERSION} initialized`);
  }

  /**
   * Main algorithm: Select story of the week from community submissions
   */
  async selectStoryOfWeek(articles: NewsArticle[]): Promise<WeeklySelectionResult> {
    if (articles.length === 0) {
      throw new Error('No articles available for selection');
    }

    console.log(`Analyzing ${articles.length} articles for weekly selection`);

    // Calculate comprehensive metrics for each article
    const articlesWithMetrics = await Promise.all(
      articles.map(article => this.calculateStoryMetrics(article))
    );

    // Apply selection algorithm
    const rankedArticles = this.rankArticles(articlesWithMetrics);

    // Select primary story of the week
    const storyOfWeek = rankedArticles[0].article;

    // Select top stories (excluding story of week)
    const topStories = rankedArticles
      .slice(1, 8)
      .map(item => item.article);

    // Apply diversity boost for underrepresented topics
    const diversityBoosts = this.selectDiversityBoosts(rankedArticles);

    // Highlight emerging voices (new curators with quality content)
    const emergingVoices = this.selectEmergingVoices(rankedArticles);

    const result: WeeklySelectionResult = {
      storyOfWeek,
      topStories,
      diversityBoosts,
      emergingVoices,
      algorithmVersion: this.ALGORITHM_VERSION,
      selectionReasoning: this.generateReasoningExplanation(rankedArticles[0]),
      confidenceScore: this.calculateConfidenceScore(rankedArticles)
    };

    console.log(`Story of the Week selected: "${storyOfWeek.title}" (confidence: ${result.confidenceScore}%)`);

    return result;
  }

  /**
   * Calculate comprehensive metrics for a single article
   */
  private async calculateStoryMetrics(article: NewsArticle): Promise<{
    article: NewsArticle;
    metrics: StoryMetrics;
    compositeScore: number;
  }> {
    const metrics: StoryMetrics = {
      interestScore: this.calculateInterestScore(article),
      totalVotes: article.totalVotes,
      relevanceScore: article.relevanceScore,
      freshnessScore: this.calculateFreshnessScore(article),
      curatorReputationScore: await this.calculateCuratorReputationScore(article.curatorId),
      diversityScore: this.calculateDiversityScore(article),
      engagementScore: this.calculateEngagementScore(article)
    };

    const compositeScore = this.calculateCompositeScore(metrics);

    return {
      article,
      metrics,
      compositeScore
    };
  }

  /**
   * Calculate community interest score from voting data
   */
  private calculateInterestScore(article: NewsArticle): number {
    // Base score from aggregate community interest
    let score = article.interestScore;

    // Boost for high voting participation
    if (article.totalVotes >= 50) score += 5;
    if (article.totalVotes >= 100) score += 5;
    if (article.totalVotes >= 200) score += 5;

    // Penalty for very low participation (possible manipulation)
    if (article.totalVotes < 5) score *= 0.7;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate freshness score based on submission recency
   */
  private calculateFreshnessScore(article: NewsArticle): number {
    const now = new Date();
    const submitted = new Date(article.submittedAt);
    const hoursOld = (now.getTime() - submitted.getTime()) / (1000 * 60 * 60);

    // Optimal freshness: 6-48 hours old
    if (hoursOld <= 6) return 70; // Too fresh, may not have enough votes
    if (hoursOld <= 24) return 100; // Peak freshness
    if (hoursOld <= 48) return 90; // Still very fresh
    if (hoursOld <= 72) return 70; // Moderately fresh
    if (hoursOld <= 168) return 50; // Week old

    return Math.max(10, 50 - (hoursOld - 168) / 24 * 5); // Decay over time
  }

  /**
   * Calculate curator reputation score (placeholder for future implementation)
   */
  private async calculateCuratorReputationScore(curatorId: string): Promise<number> {
    // TODO: Implement curator reputation system
    // For now, return baseline score

    // Simulate reputation calculation based on curator history
    const mockReputationData = {
      submissionCount: Math.floor(Math.random() * 50) + 1,
      approvalRate: 0.7 + Math.random() * 0.3,
      communityFeedback: Math.floor(Math.random() * 100),
      timeActive: Math.floor(Math.random() * 365) + 30 // days
    };

    let score = 50; // Baseline for new curators

    // Boost for experience
    if (mockReputationData.submissionCount >= 10) score += 10;
    if (mockReputationData.submissionCount >= 25) score += 10;
    if (mockReputationData.submissionCount >= 50) score += 10;

    // Boost for high approval rate
    score += (mockReputationData.approvalRate - 0.5) * 40;

    // Boost for positive community feedback
    score += mockReputationData.communityFeedback * 0.2;

    // Slight boost for time active in community
    score += Math.min(20, mockReputationData.timeActive / 30 * 2);

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate diversity score to encourage topic variety
   */
  private calculateDiversityScore(article: NewsArticle): number {
    // TODO: Implement category tracking and diversity calculation
    // For now, boost underrepresented categories

    const category = article.category;
    const recentCategoryCount = this.getRecentCategoryCount(category);

    // Boost underrepresented categories
    if (recentCategoryCount === 0) return 100;
    if (recentCategoryCount <= 2) return 80;
    if (recentCategoryCount <= 5) return 60;

    return 40;
  }

  /**
   * Calculate engagement score based on social metrics
   */
  private calculateEngagementScore(article: NewsArticle): number {
    // TODO: Implement engagement tracking (comments, shares, discussions)
    // For now, simulate based on interest score and votes

    const baseEngagement = article.interestScore * 0.6;
    const voteBonus = Math.min(30, article.totalVotes * 0.3);

    return Math.min(100, baseEngagement + voteBonus);
  }

  /**
   * Calculate weighted composite score
   */
  private calculateCompositeScore(metrics: StoryMetrics): number {
    return (
      metrics.interestScore * this.weights.interest +
      metrics.relevanceScore * this.weights.relevance +
      metrics.freshnessScore * this.weights.freshness +
      metrics.curatorReputationScore * this.weights.curatorReputation +
      metrics.diversityScore * this.weights.diversity +
      metrics.engagementScore * this.weights.engagement
    );
  }

  /**
   * Rank articles by composite score
   */
  private rankArticles(articlesWithMetrics: Array<{
    article: NewsArticle;
    metrics: StoryMetrics;
    compositeScore: number;
  }>): Array<{
    article: NewsArticle;
    metrics: StoryMetrics;
    compositeScore: number;
  }> {
    return articlesWithMetrics.sort((a, b) => b.compositeScore - a.compositeScore);
  }

  /**
   * Select stories for diversity boost
   */
  private selectDiversityBoosts(rankedArticles: Array<{
    article: NewsArticle;
    metrics: StoryMetrics;
    compositeScore: number;
  }>): NewsArticle[] {
    const seenCategories = new Set<string>();
    const diversityBoosts: NewsArticle[] = [];

    for (const item of rankedArticles) {
      if (diversityBoosts.length >= 3) break;

      if (!seenCategories.has(item.article.category) &&
          item.metrics.diversityScore >= 70) {
        diversityBoosts.push(item.article);
        seenCategories.add(item.article.category);
      }
    }

    return diversityBoosts;
  }

  /**
   * Select stories from emerging community voices
   */
  private selectEmergingVoices(rankedArticles: Array<{
    article: NewsArticle;
    metrics: StoryMetrics;
    compositeScore: number;
  }>): NewsArticle[] {
    return rankedArticles
      .filter(item =>
        item.metrics.curatorReputationScore <= 60 && // Newer curators
        item.compositeScore >= 70 // But with quality content
      )
      .slice(0, 2)
      .map(item => item.article);
  }

  /**
   * Generate human-readable explanation for selection
   */
  private generateReasoningExplanation(selectedStory: {
    article: NewsArticle;
    metrics: StoryMetrics;
    compositeScore: number;
  }): string[] {
    const reasoning: string[] = [];
    const { metrics } = selectedStory;

    if (metrics.interestScore >= 80) {
      reasoning.push(`High community interest (${metrics.interestScore}/100) with ${metrics.totalVotes} votes`);
    }

    if (metrics.relevanceScore >= 85) {
      reasoning.push(`Highly relevant to liberation themes (${metrics.relevanceScore}/100)`);
    }

    if (metrics.freshnessScore >= 90) {
      reasoning.push(`Recent submission with optimal timing`);
    }

    if (metrics.curatorReputationScore >= 80) {
      reasoning.push(`Submitted by trusted community curator`);
    }

    if (metrics.diversityScore >= 80) {
      reasoning.push(`Covers underrepresented topic area`);
    }

    if (metrics.engagementScore >= 80) {
      reasoning.push(`Strong community engagement and discussion`);
    }

    if (reasoning.length === 0) {
      reasoning.push(`Balanced scoring across all community factors`);
    }

    return reasoning;
  }

  /**
   * Calculate confidence score for selection
   */
  private calculateConfidenceScore(rankedArticles: Array<{
    article: NewsArticle;
    metrics: StoryMetrics;
    compositeScore: number;
  }>): number {
    if (rankedArticles.length === 0) return 0;
    if (rankedArticles.length === 1) return 95;

    const topScore = rankedArticles[0].compositeScore;
    const secondScore = rankedArticles[1].compositeScore;
    const scoreDifference = topScore - secondScore;

    // Higher confidence with larger score differences
    let confidence = 60 + (scoreDifference * 2);

    // Boost confidence for high vote counts
    if (rankedArticles[0].metrics.totalVotes >= 50) confidence += 10;
    if (rankedArticles[0].metrics.totalVotes >= 100) confidence += 10;

    return Math.min(100, Math.max(50, Math.round(confidence)));
  }

  /**
   * Helper: Get recent category count (placeholder)
   */
  private getRecentCategoryCount(category: string): number {
    // TODO: Implement actual category tracking
    // For now, simulate based on category popularity
    const popularCategories = ['politics', 'community', 'liberation'];

    if (popularCategories.includes(category)) {
      return Math.floor(Math.random() * 8) + 2;
    }

    return Math.floor(Math.random() * 3);
  }

  /**
   * Update algorithm weights based on community feedback
   */
  updateWeights(newWeights: Partial<typeof this.weights>): void {
    Object.assign(this.weights, newWeights);

    // Ensure weights sum to 1.0
    const totalWeight = Object.values(this.weights).reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      console.warn(`Algorithm weights sum to ${totalWeight}, normalizing...`);

      const scaleFactor = 1.0 / totalWeight;
      Object.keys(this.weights).forEach(key => {
        (this.weights as any)[key] *= scaleFactor;
      });
    }

    console.log('Algorithm weights updated:', this.weights);
  }

  /**
   * Get current algorithm configuration
   */
  getAlgorithmConfig(): {
    version: string;
    weights: typeof this.weights;
    diversityCategories: string[];
  } {
    return {
      version: this.ALGORITHM_VERSION,
      weights: { ...this.weights },
      diversityCategories: [...this.diversityCategories]
    };
  }
}

// Export singleton instance
export const storySelectionAlgorithm = new StorySelectionAlgorithm();

// Export types for external use
export type { StoryMetrics, WeeklySelectionResult };