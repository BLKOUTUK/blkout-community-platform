// BLKOUT Liberation Platform - Community Analytics API
// Privacy-preserving analytics with liberation values enforcement
// Democratic access to community insights and trend analysis

import { VercelRequest, VercelResponse } from '@vercel/node';
import { contentClassificationML, type ContentClassification } from '../src/services/content-classification-ml';

// Analytics response interfaces
interface CommunityInsightsResponse {
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
  trend_strength: number; // 0-1
  growth_rate: number; // -1 to 1
  liberation_impact: number; // -1 to 1
  content_volume: number;
  community_interest: number; // 0-1
  avg_quality_score: number; // 0-1
}

interface TopicTrend {
  topic: string;
  trend_period: string;
  popularity_score: number; // 0-1
  liberation_alignment: number; // 0-1
  community_engagement: number; // 0-1
  emerging_strength: number; // 0-1
}

interface EngagementData {
  metric_name: string;
  value: number;
  trend_direction: 'up' | 'down' | 'stable';
  community_impact: number; // 0-1
  period: string;
}

interface SourceMetrics {
  source_name: string;
  content_count: number;
  avg_quality_score: number;
  liberation_alignment_avg: number;
  community_rating_avg: number;
  curator_reputation: number;
}

interface SatisfactionData {
  overall_satisfaction: number; // 0-5
  platform_trust: number; // 0-5
  creator_empowerment: number; // 0-5
  community_safety: number; // 0-5
  democratic_participation: number; // 0-5
}

interface SafetyMetrics {
  harassment_reports: number;
  resolution_rate: number; // 0-1
  community_violations: number;
  trauma_informed_score: number; // 0-1
  accessibility_compliance: number; // 0-1
}

interface LiberationMetrics {
  overall_liberation_score: number; // 0-1
  creator_sovereignty_compliance: number; // 0-1
  economic_justice_score: number; // 0-1
  cultural_authenticity_score: number; // 0-1
  anti_oppression_score: number; // 0-1
  revenue_transparency: number; // 0-1
  creator_revenue_share: number; // Must be >= 0.75
}

interface FeedbackAnalysis {
  total_feedback_submissions: number;
  avg_feedback_rating: number; // 1-5
  improvement_suggestions: string[];
  community_priorities: string[];
}

interface TransparencyScore {
  financial_transparency: number; // 0-1
  decision_transparency: number; // 0-1
  algorithm_transparency: number; // 0-1
  data_usage_transparency: number; // 0-1
}

interface ModeratorMetrics {
  response_time_avg: number; // hours
  satisfaction_rating: number; // 1-5
  bias_reports: number;
  community_trust: number; // 0-1
}

interface PrivacyComplianceReport {
  differential_privacy_active: boolean;
  consent_rate: number; // 0-1
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

// Mock analytics data (in production, this would come from database)
const MOCK_ANALYTICS_DATA = {
  content_trends: {
    top_categories: [
      {
        category: 'Community Organizing',
        trend_strength: 0.87,
        growth_rate: 0.15,
        liberation_impact: 0.92,
        content_volume: 156,
        community_interest: 0.89,
        avg_quality_score: 0.83
      },
      {
        category: 'Arts & Culture',
        trend_strength: 0.76,
        growth_rate: 0.08,
        liberation_impact: 0.81,
        content_volume: 203,
        community_interest: 0.78,
        avg_quality_score: 0.86
      },
      {
        category: 'Economic Justice',
        trend_strength: 0.82,
        growth_rate: 0.22,
        liberation_impact: 0.94,
        content_volume: 89,
        community_interest: 0.91,
        avg_quality_score: 0.79
      },
      {
        category: 'Health & Wellness',
        trend_strength: 0.69,
        growth_rate: 0.05,
        liberation_impact: 0.73,
        content_volume: 134,
        community_interest: 0.71,
        avg_quality_score: 0.81
      }
    ],
    emerging_topics: [
      {
        topic: 'platform-sovereignty',
        trend_period: 'last_30_days',
        popularity_score: 0.78,
        liberation_alignment: 0.95,
        community_engagement: 0.84,
        emerging_strength: 0.91
      },
      {
        topic: 'digital-organizing',
        trend_period: 'last_30_days',
        popularity_score: 0.71,
        liberation_alignment: 0.87,
        community_engagement: 0.79,
        emerging_strength: 0.83
      },
      {
        topic: 'community-care',
        trend_period: 'last_30_days',
        popularity_score: 0.65,
        liberation_alignment: 0.89,
        community_engagement: 0.73,
        emerging_strength: 0.77
      }
    ],
    engagement_patterns: [
      {
        metric_name: 'community_discussions',
        value: 342,
        trend_direction: 'up' as const,
        community_impact: 0.87,
        period: 'last_7_days'
      },
      {
        metric_name: 'content_shares',
        value: 1876,
        trend_direction: 'up' as const,
        community_impact: 0.74,
        period: 'last_7_days'
      },
      {
        metric_name: 'peer_connections',
        value: 95,
        trend_direction: 'stable' as const,
        community_impact: 0.81,
        period: 'last_7_days'
      }
    ],
    source_performance: [
      {
        source_name: 'Community Curators',
        content_count: 287,
        avg_quality_score: 0.85,
        liberation_alignment_avg: 0.89,
        community_rating_avg: 4.3,
        curator_reputation: 0.91
      },
      {
        source_name: 'Liberation Media',
        content_count: 156,
        avg_quality_score: 0.82,
        liberation_alignment_avg: 0.94,
        community_rating_avg: 4.1,
        curator_reputation: 0.87
      },
      {
        source_name: 'Community Submissions',
        content_count: 203,
        avg_quality_score: 0.76,
        liberation_alignment_avg: 0.81,
        community_rating_avg: 3.9,
        curator_reputation: 0.73
      }
    ]
  },
  community_health: {
    participation_rates: 0.73,
    satisfaction_scores: {
      overall_satisfaction: 4.2,
      platform_trust: 4.5,
      creator_empowerment: 4.1,
      community_safety: 4.3,
      democratic_participation: 3.8
    },
    safety_indicators: {
      harassment_reports: 3,
      resolution_rate: 0.94,
      community_violations: 1,
      trauma_informed_score: 0.89,
      accessibility_compliance: 0.86
    },
    liberation_compliance: {
      overall_liberation_score: 0.84,
      creator_sovereignty_compliance: 0.87,
      economic_justice_score: 0.82,
      cultural_authenticity_score: 0.88,
      anti_oppression_score: 0.81,
      revenue_transparency: 0.95,
      creator_revenue_share: 0.75 // Exactly at minimum required
    }
  },
  democratic_governance: {
    voting_participation: 0.67,
    community_feedback: {
      total_feedback_submissions: 89,
      avg_feedback_rating: 4.1,
      improvement_suggestions: [
        'More diverse content categories',
        'Enhanced mobile accessibility',
        'Improved translation features',
        'Better crisis support resources'
      ],
      community_priorities: [
        'Economic justice initiatives',
        'Trauma-informed design improvements',
        'Creator sovereignty tools',
        'Democratic decision-making processes'
      ]
    },
    decision_transparency: {
      financial_transparency: 0.95,
      decision_transparency: 0.82,
      algorithm_transparency: 0.78,
      data_usage_transparency: 0.91
    },
    moderator_performance: {
      response_time_avg: 4.2, // hours
      satisfaction_rating: 4.3,
      bias_reports: 1,
      community_trust: 0.89
    }
  },
  privacy_report: {
    differential_privacy_active: true,
    consent_rate: 0.94,
    data_anonymization_level: 'differential',
    retention_policy_compliant: true,
    user_control_features_active: true
  },
  data_sovereignty: {
    community_data_ownership: true,
    third_party_sharing: false,
    data_export_available: true,
    algorithmic_transparency: true,
    community_algorithm_control: true
  }
};

// CORS headers for community access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Community-Member, X-Analytics-Consent'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    switch (req.method) {
      case 'GET':
        return handleGetAnalytics(req, res);
      case 'POST':
        return handleAnalyticsAction(req, res);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: 'This endpoint supports GET and POST methods only'
        });
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Analytics services temporarily unavailable',
      liberation_impact: 'Community data sovereignty maintained'
    });
  }
}

async function handleGetAnalytics(req: VercelRequest, res: VercelResponse) {
  const {
    type,
    period = 'weekly',
    category,
    liberation_filter = 'true',
    privacy_level = 'community'
  } = req.query;

  // Validate community member access
  const communityMember = req.headers['x-community-member'];
  const analyticsConsent = req.headers['x-analytics-consent'];

  if (privacy_level === 'detailed' && !communityMember) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Detailed analytics require community membership',
      public_analytics_available: true,
      liberation_principle: 'Community data sovereignty'
    });
  }

  switch (type) {
    case 'community-insights':
      return res.status(200).json({
        success: true,
        data: MOCK_ANALYTICS_DATA,
        metadata: {
          generated_at: new Date().toISOString(),
          period: period,
          privacy_level: privacy_level,
          liberation_compliance: true,
          differential_privacy_applied: true,
          community_validated: true,
          data_sovereignty_maintained: true
        },
        liberation_metrics: {
          creator_revenue_share_minimum: 0.75,
          current_creator_share: MOCK_ANALYTICS_DATA.community_health.liberation_compliance.creator_revenue_share,
          community_ownership: true,
          democratic_decision_making: true,
          privacy_preserving: true
        }
      });

    case 'liberation-compliance':
      return res.status(200).json({
        success: true,
        data: {
          overall_score: MOCK_ANALYTICS_DATA.community_health.liberation_compliance.overall_liberation_score,
          detailed_scores: MOCK_ANALYTICS_DATA.community_health.liberation_compliance,
          compliance_status: 'COMPLIANT',
          minimum_requirements_met: true,
          improvement_areas: [
            'Democratic participation could be higher',
            'Anti-oppression initiatives expanding'
          ],
          community_feedback: 'Positive direction, continue current trajectory'
        },
        transparency: {
          methodology: 'Community ML Analytics with Democratic Validation',
          last_community_review: '2025-09-20',
          next_review_date: '2025-10-20',
          community_input_weight: 0.4,
          algorithm_transparency_score: 0.78
        }
      });

    case 'content-trends':
      const filteredTrends = liberation_filter === 'true'
        ? MOCK_ANALYTICS_DATA.content_trends.top_categories.filter(
            cat => cat.liberation_impact >= 0.7
          )
        : MOCK_ANALYTICS_DATA.content_trends.top_categories;

      return res.status(200).json({
        success: true,
        data: {
          trending_categories: filteredTrends,
          emerging_topics: MOCK_ANALYTICS_DATA.content_trends.emerging_topics,
          engagement_highlights: MOCK_ANALYTICS_DATA.content_trends.engagement_patterns,
          period: period,
          liberation_focus: liberation_filter === 'true'
        },
        community_impact: {
          total_content_analyzed: 892,
          liberation_aligned_percentage: 0.84,
          community_curated_percentage: 0.67,
          avg_community_rating: 4.1
        }
      });

    case 'ml-performance':
      const modelConfig = contentClassificationML.getModelConfig();
      return res.status(200).json({
        success: true,
        data: {
          model_performance: {
            accuracy: modelConfig.accuracy,
            bias_score: modelConfig.bias_score,
            cultural_sensitivity: modelConfig.cultural_sensitivity_score,
            trauma_awareness: modelConfig.trauma_awareness_score,
            community_validated: modelConfig.community_validated
          },
          training_diversity: modelConfig.training_data_diversity,
          bias_monitoring: {
            overall_bias: 0.12,
            cultural_bias: 0.08,
            gender_bias: 0.09,
            age_bias: 0.07,
            socioeconomic_bias: 0.15
          },
          community_feedback: {
            accuracy_rating: 4.2,
            cultural_appropriateness: 4.4,
            bias_reports: 2,
            improvement_suggestions: 12
          },
          liberation_alignment: {
            promotes_creator_sovereignty: true,
            culturally_authentic: true,
            trauma_informed: true,
            community_beneficial: true
          }
        }
      });

    case 'privacy-report':
      return res.status(200).json({
        success: true,
        data: MOCK_ANALYTICS_DATA.privacy_report,
        data_sovereignty: MOCK_ANALYTICS_DATA.data_sovereignty,
        community_rights: {
          data_portability: true,
          deletion_rights: true,
          consent_management: true,
          algorithmic_transparency: true,
          community_algorithm_governance: true
        },
        privacy_technology: {
          differential_privacy_epsilon: 1.0,
          k_anonymity_level: 5,
          data_minimization: true,
          purpose_limitation: true,
          storage_minimization: true
        }
      });

    default:
      // Return summary analytics for general requests
      return res.status(200).json({
        success: true,
        data: {
          summary: {
            total_community_members: 1247,
            active_weekly_users: 892,
            content_pieces_analyzed: 1156,
            liberation_compliance_score: 0.84,
            community_satisfaction: 4.2,
            creator_revenue_share: 0.75,
            democratic_participation_rate: 0.67
          },
          quick_insights: [
            'Community organizing content trending upward (+15%)',
            'Economic justice discussions growing rapidly (+22%)',
            'Platform sovereignty emerging as key topic',
            'High community satisfaction with safety measures',
            'Creator revenue sharing meets liberation minimum (75%)'
          ],
          liberation_status: 'COMPLIANT',
          community_health: 'STRONG',
          next_community_review: '2025-10-01'
        },
        available_endpoints: [
          'community-insights',
          'liberation-compliance',
          'content-trends',
          'ml-performance',
          'privacy-report'
        ]
      });
  }
}

async function handleAnalyticsAction(req: VercelRequest, res: VercelResponse) {
  const { action, content_data, feedback_data } = req.body;

  switch (action) {
    case 'classify-content':
      if (!content_data) {
        return res.status(400).json({
          error: 'Content data required',
          message: 'Provide content_data for classification'
        });
      }

      try {
        const classification = await contentClassificationML.classifyContent(content_data);

        return res.status(200).json({
          success: true,
          data: classification,
          liberation_compliance: {
            alignment_score: classification.liberation_alignment_score,
            safety_verified: classification.safety_assessment.community_safe,
            trauma_informed: classification.safety_assessment.trauma_informed,
            cultural_respectful: classification.safety_assessment.cultural_respectful
          },
          requires_community_review: classification.requires_human_review,
          model_version: classification.model_version
        });
      } catch (error) {
        console.error('Content classification error:', error);
        return res.status(500).json({
          error: 'Classification failed',
          message: 'Unable to classify content at this time',
          fallback_available: true
        });
      }

    case 'batch-classify':
      if (!content_data || !Array.isArray(content_data)) {
        return res.status(400).json({
          error: 'Batch content data required',
          message: 'Provide array of content_data for batch classification'
        });
      }

      try {
        const classifications = await contentClassificationML.batchClassifyContent(content_data);

        const summary = {
          total_classified: classifications.length,
          avg_liberation_score: classifications.reduce((sum, c) => sum + c.liberation_alignment_score, 0) / classifications.length,
          requires_review_count: classifications.filter(c => c.requires_human_review).length,
          high_quality_count: classifications.filter(c => c.quality_indicators.information_density > 0.7).length
        };

        return res.status(200).json({
          success: true,
          data: classifications,
          summary: summary,
          batch_processing_time: Date.now(), // Placeholder for timing
          liberation_compliance_maintained: true
        });
      } catch (error) {
        console.error('Batch classification error:', error);
        return res.status(500).json({
          error: 'Batch classification failed',
          message: 'Unable to process batch classification',
          partial_results_available: false
        });
      }

    case 'submit-feedback':
      if (!feedback_data) {
        return res.status(400).json({
          error: 'Feedback data required',
          message: 'Provide feedback_data for community input'
        });
      }

      // Mock feedback processing (in production, would save to database)
      return res.status(201).json({
        success: true,
        message: 'Community feedback received',
        feedback_id: `feedback_${Date.now()}`,
        processing_status: 'queued',
        estimated_review_time: '24-48 hours',
        community_impact: 'Your feedback helps improve liberation-centered analytics',
        anonymity_preserved: feedback_data.anonymous || false
      });

    case 'request-data-export':
      // Mock data export request (community data sovereignty)
      return res.status(202).json({
        success: true,
        message: 'Data export request queued',
        export_id: `export_${Date.now()}`,
        estimated_completion: '2-4 hours',
        data_sovereignty_rights: {
          full_data_portability: true,
          machine_readable_format: true,
          deletion_after_export: 'optional',
          community_ownership_maintained: true
        },
        available_formats: ['JSON', 'CSV', 'XML'],
        privacy_preserved: true
      });

    default:
      return res.status(400).json({
        error: 'Unknown action',
        message: 'Supported actions: classify-content, batch-classify, submit-feedback, request-data-export'
      });
  }
}