// BLKOUT Liberation Platform - Community Insights Dashboard
// Democratic access to analytics with liberation values enforcement
// Community-controlled data visualization and trend analysis

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp, TrendingDown, Users, Heart, Shield,
  BarChart3, PieChart, Activity, Zap, Eye, Lock
} from 'lucide-react';

// Analytics interfaces from the API
interface CommunityInsightsData {
  content_trends: {
    top_categories: CategoryTrend[];
    emerging_topics: TopicTrend[];
    engagement_patterns: EngagementData[];
    source_performance: SourceMetrics[];
  };
  community_health: {
    participation_rates: number;
    satisfaction_scores: SatisfactionData;
    safety_indicators: SafetyMetrics;
    liberation_compliance: LiberationMetrics;
  };
  democratic_governance: {
    voting_participation: number;
    community_feedback: FeedbackAnalysis;
    decision_transparency: TransparencyScore;
    moderator_performance: ModeratorMetrics;
  };
  privacy_report: PrivacyComplianceReport;
  data_sovereignty: DataSovereigntyStatus;
}

interface CategoryTrend {
  category: string;
  trend_strength: number;
  growth_rate: number;
  liberation_impact: number;
  content_volume: number;
  community_interest: number;
  avg_quality_score: number;
}

interface LiberationMetrics {
  overall_liberation_score: number;
  creator_sovereignty_compliance: number;
  economic_justice_score: number;
  cultural_authenticity_score: number;
  anti_oppression_score: number;
  revenue_transparency: number;
  creator_revenue_share: number;
}

interface SatisfactionData {
  overall_satisfaction: number;
  platform_trust: number;
  creator_empowerment: number;
  community_safety: number;
  democratic_participation: number;
}

interface SafetyMetrics {
  harassment_reports: number;
  resolution_rate: number;
  community_violations: number;
  trauma_informed_score: number;
  accessibility_compliance: number;
}

interface PrivacyComplianceReport {
  differential_privacy_active: boolean;
  consent_rate: number;
  data_anonymization_level: string;
  retention_policy_compliant: boolean;
  user_control_features_active: boolean;
}

interface DataSovereigntyStatus {
  community_data_ownership: boolean;
  third_party_sharing: boolean;
  data_export_available: boolean;
  algorithmic_transparency: boolean;
  community_algorithm_control: boolean;
}

export default function CommunityInsightsDashboard() {
  const [insightsData, setInsightsData] = useState<CommunityInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [privacyLevel, setPrivacyLevel] = useState('community');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchCommunityInsights();
  }, [selectedTimeframe, privacyLevel]);

  const fetchCommunityInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?type=community-insights&period=${selectedTimeframe}&privacy_level=${privacyLevel}`, {
        headers: {
          'X-Community-Member': 'true',
          'X-Analytics-Consent': 'true'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setInsightsData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch community insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100)}%`;
  };

  const formatScore = (value: number): string => {
    return `${(value * 5).toFixed(1)}/5.0`;
  };

  const getTrendIcon = (growthRate: number) => {
    return growthRate > 0.05 ? <TrendingUp className="w-4 h-4 text-green-500" /> :
           growthRate < -0.05 ? <TrendingDown className="w-4 h-4 text-red-500" /> :
           <Activity className="w-4 h-4 text-yellow-500" />;
  };

  const getLiberationScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLiberationScoreBg = (score: number): string => {
    if (score >= 0.8) return 'bg-green-100';
    if (score >= 0.6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading community insights...</p>
            <p className="text-sm text-gray-500 mt-1">Applying liberation values filters</p>
          </div>
        </div>
      </div>
    );
  }

  if (!insightsData) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Community Insights Unavailable</h3>
        <p className="text-gray-500 mb-4">Analytics data is currently being processed.</p>
        <Button onClick={fetchCommunityInsights}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Insights Dashboard</h1>
          <p className="text-gray-600">Liberation-centered analytics with community sovereignty</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <Button
            variant={showDetails ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </div>

      {/* Privacy and Data Sovereignty Banner */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-purple-900 mb-1">Community Data Sovereignty</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${insightsData.data_sovereignty.community_data_ownership ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  Community Ownership
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${insightsData.privacy_report.differential_privacy_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  Privacy Protection
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${!insightsData.data_sovereignty.third_party_sharing ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  No Third-Party Sharing
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${insightsData.data_sovereignty.algorithmic_transparency ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  Algorithm Transparency
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="liberation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="liberation">Liberation Metrics</TabsTrigger>
          <TabsTrigger value="trends">Content Trends</TabsTrigger>
          <TabsTrigger value="community">Community Health</TabsTrigger>
          <TabsTrigger value="governance">Democratic Governance</TabsTrigger>
        </TabsList>

        {/* Liberation Metrics Tab */}
        <TabsContent value="liberation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Liberation Score */}
            <Card className={getLiberationScoreBg(insightsData.community_health.liberation_compliance.overall_liberation_score)}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Liberation Alignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-gray-900">
                  {formatPercentage(insightsData.community_health.liberation_compliance.overall_liberation_score)}
                </div>
                <Progress
                  value={insightsData.community_health.liberation_compliance.overall_liberation_score * 100}
                  className="mb-3"
                />
                <p className="text-sm text-gray-600">
                  Community-validated liberation values compliance
                </p>
              </CardContent>
            </Card>

            {/* Creator Sovereignty */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Creator Sovereignty</CardTitle>
                <CardDescription>Revenue sharing and creative control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Share</span>
                    <span className="font-medium">
                      {formatPercentage(insightsData.community_health.liberation_compliance.creator_revenue_share)}
                    </span>
                  </div>
                  <Progress
                    value={insightsData.community_health.liberation_compliance.creator_revenue_share * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compliance Score</span>
                    <span className={`font-medium ${getLiberationScoreColor(insightsData.community_health.liberation_compliance.creator_sovereignty_compliance)}`}>
                      {formatPercentage(insightsData.community_health.liberation_compliance.creator_sovereignty_compliance)}
                    </span>
                  </div>
                  {insightsData.community_health.liberation_compliance.creator_revenue_share >= 0.75 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Meets Liberation Minimum (75%)
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Economic Justice */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Economic Justice</CardTitle>
                <CardDescription>Fair resource distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {formatPercentage(insightsData.community_health.liberation_compliance.economic_justice_score)}
                </div>
                <Progress
                  value={insightsData.community_health.liberation_compliance.economic_justice_score * 100}
                  className="mb-3"
                />
                <div className="text-sm text-gray-600">
                  Revenue transparency: {formatPercentage(insightsData.community_health.liberation_compliance.revenue_transparency)}
                </div>
              </CardContent>
            </Card>

            {/* Cultural Authenticity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cultural Authenticity</CardTitle>
                <CardDescription>Community voice and representation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2 text-gray-900">
                  {formatPercentage(insightsData.community_health.liberation_compliance.cultural_authenticity_score)}
                </div>
                <Progress
                  value={insightsData.community_health.liberation_compliance.cultural_authenticity_score * 100}
                  className="mb-3"
                />
                <p className="text-sm text-gray-600">
                  Black queer voices centered and amplified
                </p>
              </CardContent>
            </Card>

            {/* Anti-Oppression */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Anti-Oppression</CardTitle>
                <CardDescription>Systems transformation focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2 text-gray-900">
                  {formatPercentage(insightsData.community_health.liberation_compliance.anti_oppression_score)}
                </div>
                <Progress
                  value={insightsData.community_health.liberation_compliance.anti_oppression_score * 100}
                  className="mb-3"
                />
                <p className="text-sm text-gray-600">
                  Content actively challenges oppressive systems
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Trending Categories
                </CardTitle>
                <CardDescription>Liberation-aligned content categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insightsData.content_trends.top_categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{category.category}</h4>
                          {getTrendIcon(category.growth_rate)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Interest: {formatPercentage(category.community_interest)}</span>
                          <span>Quality: {formatScore(category.avg_quality_score)}</span>
                          <span>{category.content_volume} pieces</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getLiberationScoreColor(category.liberation_impact)}`}>
                          Liberation: {formatPercentage(category.liberation_impact)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emerging Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Emerging Topics
                </CardTitle>
                <CardDescription>New conversations gaining momentum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insightsData.content_trends.emerging_topics.map((topic, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{topic.topic.replace('-', ' ')}</h4>
                        <Badge variant="secondary">
                          {formatPercentage(topic.emerging_strength)} emerging
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Liberation:</span>
                          <span className={`ml-1 font-medium ${getLiberationScoreColor(topic.liberation_alignment)}`}>
                            {formatPercentage(topic.liberation_alignment)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Engagement:</span>
                          <span className="ml-1 font-medium">
                            {formatPercentage(topic.community_engagement)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Community Engagement Patterns
              </CardTitle>
              <CardDescription>How the community interacts with content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insightsData.content_trends.engagement_patterns.map((pattern, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {pattern.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mb-1 capitalize">
                      {pattern.metric_name.replace('_', ' ')}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(pattern.trend_direction === 'up' ? 0.1 : pattern.trend_direction === 'down' ? -0.1 : 0)}
                      <span className="text-xs text-gray-500">{pattern.trend_direction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Health Tab */}
        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Satisfaction Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Community Satisfaction
                </CardTitle>
                <CardDescription>How the community feels about the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(insightsData.community_health.satisfaction_scores).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(value / 5) * 100} className="w-20" />
                        <span className="font-medium w-12">{formatScore(value / 5)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Community Safety
                </CardTitle>
                <CardDescription>Safety and protection metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Harassment Reports</span>
                    <span className="font-medium">{insightsData.community_health.safety_indicators.harassment_reports}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolution Rate</span>
                    <span className="font-medium text-green-600">
                      {formatPercentage(insightsData.community_health.safety_indicators.resolution_rate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trauma-Informed Score</span>
                    <span className="font-medium">
                      {formatScore(insightsData.community_health.safety_indicators.trauma_informed_score)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accessibility Compliance</span>
                    <span className="font-medium">
                      {formatPercentage(insightsData.community_health.safety_indicators.accessibility_compliance)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participation Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Community Participation
              </CardTitle>
              <CardDescription>Active engagement and involvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {formatPercentage(insightsData.community_health.participation_rates)}
                </div>
                <p className="text-gray-600 mb-4">of community members actively participate</p>
                <Progress value={insightsData.community_health.participation_rates * 100} className="max-w-md mx-auto" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Democratic Governance Tab */}
        <TabsContent value="governance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Voting Participation */}
            <Card>
              <CardHeader>
                <CardTitle>Democratic Participation</CardTitle>
                <CardDescription>Community involvement in decision-making</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPercentage(insightsData.democratic_governance.voting_participation)}
                  </div>
                  <p className="text-gray-600">voting participation rate</p>
                </div>
                <Progress value={insightsData.democratic_governance.voting_participation * 100} />
              </CardContent>
            </Card>

            {/* Community Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Community Voice</CardTitle>
                <CardDescription>Feedback and improvement suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feedback Submissions</span>
                    <span className="font-medium">
                      {insightsData.democratic_governance.community_feedback.total_feedback_submissions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Rating</span>
                    <span className="font-medium">
                      {insightsData.democratic_governance.community_feedback.avg_feedback_rating}/5.0
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Community Priorities */}
          <Card>
            <CardHeader>
              <CardTitle>Community Priorities</CardTitle>
              <CardDescription>What the community wants to see improved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-3">Improvement Suggestions</h4>
                  <div className="space-y-2">
                    {insightsData.democratic_governance.community_feedback.improvement_suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Community Priorities</h4>
                  <div className="space-y-2">
                    {insightsData.democratic_governance.community_feedback.community_priorities.map((priority, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span className="text-sm">{priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer with Data Export Option */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Your Data, Your Rights</h3>
              <p className="text-sm text-gray-600">
                All analytics are community-owned and privacy-preserving.
                Consent rate: {formatPercentage(insightsData.privacy_report.consent_rate)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                Privacy Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}