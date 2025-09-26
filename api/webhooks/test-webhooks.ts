import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Testing configuration
const TEST_API_KEY = process.env.TEST_API_KEY || 'test-key-development';
const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || 'https://blkout.vercel.app';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
};

// Test interfaces
interface WebhookTestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'failure' | 'warning';
  response_code: number;
  response_time_ms: number;
  payload_sent: any;
  response_received: any;
  error_details?: string;
  liberation_compliance: boolean;
}

interface TestSuite {
  name: string;
  description: string;
  tests: WebhookTestResult[];
  overall_status: 'pass' | 'fail' | 'partial';
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  execution_time_ms: number;
}

// Sample test payloads for different webhook types
const samplePayloads = {
  n8n_content: {
    content_type: 'news',
    source_url: 'https://example-news.com/liberation-article',
    extracted_data: {
      title: 'Community Organizes for Housing Justice',
      description: 'Local community members come together to fight gentrification and demand affordable housing.',
      content: 'In a powerful display of solidarity, community members across the city have organized to demand housing justice and fight against the displacement of long-term residents...',
      date: new Date().toISOString(),
      tags: ['housing-justice', 'community-organizing', 'liberation']
    },
    classification: {
      category: 'community-organizing',
      confidence: 0.85,
      tags: ['housing', 'justice', 'organizing']
    },
    automation_source: 'n8n-test-workflow',
    timestamp: new Date().toISOString(),
    workflow_id: 'test-workflow-123'
  },

  n8n_research: {
    search_query: 'Black liberation community organizing 2024',
    results: [
      {
        title: 'Community Mutual Aid Networks Expand',
        url: 'https://example.com/mutual-aid-expansion',
        description: 'Mutual aid networks in Black communities are expanding to meet growing needs.',
        relevance_score: 0.8,
        source: 'community-news'
      },
      {
        title: 'Youth Organizing Workshop Series',
        url: 'https://example.com/youth-organizing',
        description: 'New workshop series empowers young people in community organizing skills.',
        relevance_score: 0.75,
        source: 'organizing-calendar'
      }
    ],
    timestamp: new Date().toISOString(),
    source: 'automated-research'
  },

  blkouthub_event: {
    content_type: 'community_event',
    payload: {
      title: 'Community Healing Circle',
      description: 'A space for community members to come together for healing and connection.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Community Center, 123 Liberation Ave',
      contact_info: {
        email: 'healing@community.org'
      },
      organizer: 'Community Wellness Collective',
      tags: ['healing', 'community', 'wellness'],
      community_guidelines_compliant: true
    },
    authentication: process.env.BLKOUTHUB_BEARER_TOKEN || 'test-token',
    timestamp: new Date().toISOString(),
    source: 'blkouthub-community',
    verification_status: 'verified'
  },

  blkouthub_mutual_aid: {
    aid_type: 'request',
    title: 'Food Support Needed for Family',
    description: 'Single parent needs food assistance for family of four.',
    location: {
      area: 'East Community District',
      postal_code: '12345',
      accessible: true
    },
    contact: {
      preferred_method: 'email',
      details: 'mutualaid@community.org',
      anonymous: false
    },
    urgency: 'high',
    categories: ['food', 'family-support'],
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  },

  social_media_post: {
    platform: 'mastodon',
    post_id: 'test-post-123',
    content: {
      text: 'Community organizing is how we build the world we need. Join us for tonight\'s housing justice meeting! #HousingJustice #CommunityPower #Liberation',
      hashtags: ['HousingJustice', 'CommunityPower', 'Liberation'],
      mentions: ['@community_org']
    },
    metadata: {
      author: {
        username: 'community_organizer',
        display_name: 'Community Organizer',
        follower_count: 2500,
        verified: false
      },
      engagement: {
        likes: 45,
        shares: 12,
        comments: 8
      },
      posted_at: new Date().toISOString(),
      url: 'https://mastodon.social/@community_organizer/123',
      language: 'en'
    },
    extraction_method: 'api',
    relevance_score: 0.9
  }
};

// Execute webhook test
async function testWebhookEndpoint(
  endpoint: string,
  method: string,
  payload: any,
  headers: Record<string, string> = {}
): Promise<WebhookTestResult> {
  const startTime = Date.now();

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${WEBHOOK_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: method !== 'GET' ? JSON.stringify(payload) : undefined
    });

    const responseTime = Date.now() - startTime;
    const responseData = await response.json();

    return {
      endpoint,
      method,
      status: response.ok ? 'success' : 'failure',
      response_code: response.status,
      response_time_ms: responseTime,
      payload_sent: payload,
      response_received: responseData,
      error_details: response.ok ? undefined : responseData.error || 'Unknown error',
      liberation_compliance: responseData.liberation_message ? true : false
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return {
      endpoint,
      method,
      status: 'failure',
      response_code: 0,
      response_time_ms: responseTime,
      payload_sent: payload,
      response_received: null,
      error_details: error instanceof Error ? error.message : 'Network error',
      liberation_compliance: false
    };
  }
}

// Run comprehensive webhook test suite
async function runWebhookTestSuite(): Promise<TestSuite[]> {
  const testSuites: TestSuite[] = [];
  const startTime = Date.now();

  // N8N Webhook Tests
  const n8nTests: WebhookTestResult[] = [];

  // Test N8N content webhook
  n8nTests.push(await testWebhookEndpoint(
    '/api/webhooks/n8n/content',
    'POST',
    samplePayloads.n8n_content,
    { 'X-N8N-Signature': process.env.N8N_WEBHOOK_SECRET || 'test-secret' }
  ));

  // Test N8N research webhook
  n8nTests.push(await testWebhookEndpoint(
    '/api/webhooks/n8n/research',
    'POST',
    samplePayloads.n8n_research,
    { 'X-N8N-Signature': process.env.N8N_WEBHOOK_SECRET || 'test-secret' }
  ));

  const n8nSuite: TestSuite = {
    name: 'N8N Webhook Integration',
    description: 'Tests for N8N automation webhook endpoints',
    tests: n8nTests,
    overall_status: n8nTests.every(t => t.status === 'success') ? 'pass' :
                   n8nTests.some(t => t.status === 'success') ? 'partial' : 'fail',
    total_tests: n8nTests.length,
    passed_tests: n8nTests.filter(t => t.status === 'success').length,
    failed_tests: n8nTests.filter(t => t.status === 'failure').length,
    execution_time_ms: n8nTests.reduce((sum, t) => sum + t.response_time_ms, 0)
  };
  testSuites.push(n8nSuite);

  // BLKOUTHUB Webhook Tests
  const blkouthubTests: WebhookTestResult[] = [];

  // Test BLKOUTHUB community event webhook
  blkouthubTests.push(await testWebhookEndpoint(
    '/api/webhooks/blkouthub',
    'POST',
    samplePayloads.blkouthub_event,
    { 'Authorization': `Bearer ${process.env.BLKOUTHUB_BEARER_TOKEN || 'test-token'}` }
  ));

  // Test BLKOUTHUB mutual aid webhook
  blkouthubTests.push(await testWebhookEndpoint(
    '/api/webhooks/blkouthub/mutual-aid',
    'POST',
    samplePayloads.blkouthub_mutual_aid,
    { 'Authorization': `Bearer ${process.env.BLKOUTHUB_BEARER_TOKEN || 'test-token'}` }
  ));

  // Test BLKOUTHUB health endpoint
  blkouthubTests.push(await testWebhookEndpoint(
    '/api/webhooks/blkouthub/health',
    'GET',
    null
  ));

  const blkouthubSuite: TestSuite = {
    name: 'BLKOUTHUB Community Integration',
    description: 'Tests for BLKOUTHUB community webhook endpoints',
    tests: blkouthubTests,
    overall_status: blkouthubTests.every(t => t.status === 'success') ? 'pass' :
                   blkouthubTests.some(t => t.status === 'success') ? 'partial' : 'fail',
    total_tests: blkouthubTests.length,
    passed_tests: blkouthubTests.filter(t => t.status === 'success').length,
    failed_tests: blkouthubTests.filter(t => t.status === 'failure').length,
    execution_time_ms: blkouthubTests.reduce((sum, t) => sum + t.response_time_ms, 0)
  };
  testSuites.push(blkouthubSuite);

  // Social Media Webhook Tests
  const socialTests: WebhookTestResult[] = [];

  // Test social media ingestion webhook
  socialTests.push(await testWebhookEndpoint(
    '/api/webhooks/social-media/ingest',
    'POST',
    samplePayloads.social_media_post,
    { 'Authorization': `Bearer ${process.env.SOCIAL_WEBHOOK_SECRET || 'test-secret'}` }
  ));

  // Test social media health endpoint
  socialTests.push(await testWebhookEndpoint(
    '/api/webhooks/social-media/health',
    'GET',
    null
  ));

  // Test social media stats endpoint
  socialTests.push(await testWebhookEndpoint(
    '/api/webhooks/social-media/stats',
    'GET',
    null
  ));

  const socialSuite: TestSuite = {
    name: 'Social Media Automation',
    description: 'Tests for social media automation webhook endpoints',
    tests: socialTests,
    overall_status: socialTests.every(t => t.status === 'success') ? 'pass' :
                   socialTests.some(t => t.status === 'success') ? 'partial' : 'fail',
    total_tests: socialTests.length,
    passed_tests: socialTests.filter(t => t.status === 'success').length,
    failed_tests: socialTests.filter(t => t.status === 'failure').length,
    execution_time_ms: socialTests.reduce((sum, t) => sum + t.response_time_ms, 0)
  };
  testSuites.push(socialSuite);

  // Analytics Webhook Tests
  const analyticsTests: WebhookTestResult[] = [];

  // Test analytics overview endpoint
  analyticsTests.push(await testWebhookEndpoint(
    '/api/webhooks/automation-analytics/overview?timeframe=7d',
    'GET',
    null,
    { 'X-API-Key': process.env.ANALYTICS_API_KEY || 'demo-key-for-development' }
  ));

  // Test analytics health endpoint
  analyticsTests.push(await testWebhookEndpoint(
    '/api/webhooks/automation-analytics/health',
    'GET',
    null,
    { 'X-API-Key': process.env.ANALYTICS_API_KEY || 'demo-key-for-development' }
  ));

  const analyticsSuite: TestSuite = {
    name: 'Automation Analytics',
    description: 'Tests for automation analytics and monitoring endpoints',
    tests: analyticsTests,
    overall_status: analyticsTests.every(t => t.status === 'success') ? 'pass' :
                   analyticsTests.some(t => t.status === 'success') ? 'partial' : 'fail',
    total_tests: analyticsTests.length,
    passed_tests: analyticsTests.filter(t => t.status === 'success').length,
    failed_tests: analyticsTests.filter(t => t.status === 'failure').length,
    execution_time_ms: analyticsTests.reduce((sum, t) => sum + t.response_time_ms, 0)
  };
  testSuites.push(analyticsSuite);

  return testSuites;
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
  if (!apiKey || apiKey !== TEST_API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key for webhook testing',
      liberation_message: 'Testing access requires proper authentication for community protection'
    });
  }

  const { method, url } = req;
  const urlPath = url?.split('?')[0];

  try {
    switch (method) {
      case 'GET':
        if (urlPath === '/api/webhooks/test-webhooks' || urlPath === '/api/webhooks/test-webhooks/run') {
          // Run comprehensive webhook test suite
          console.log('🧪 Running comprehensive webhook test suite...');
          const startTime = Date.now();

          const testSuites = await runWebhookTestSuite();
          const totalExecutionTime = Date.now() - startTime;

          const overallStats = {
            total_suites: testSuites.length,
            passed_suites: testSuites.filter(s => s.overall_status === 'pass').length,
            failed_suites: testSuites.filter(s => s.overall_status === 'fail').length,
            partial_suites: testSuites.filter(s => s.overall_status === 'partial').length,
            total_tests: testSuites.reduce((sum, s) => sum + s.total_tests, 0),
            passed_tests: testSuites.reduce((sum, s) => sum + s.passed_tests, 0),
            failed_tests: testSuites.reduce((sum, s) => sum + s.failed_tests, 0),
            total_execution_time_ms: totalExecutionTime,
            liberation_compliant_tests: testSuites.reduce((sum, s) =>
              sum + s.tests.filter(t => t.liberation_compliance).length, 0
            )
          };

          // Log test results to database for tracking
          const testLogId = randomUUID();
          const testLogEntry = {
            content_id: testLogId,
            content_table: 'webhook_test_log',
            action: 'test-suite-executed',
            moderator_id: 'webhook-testing',
            reason: `Webhook test suite: ${overallStats.passed_tests}/${overallStats.total_tests} tests passed`,
            metadata: {
              test_suites: testSuites,
              overall_stats: overallStats,
              executed_at: new Date().toISOString(),
              webhook_base_url: WEBHOOK_BASE_URL
            }
          };

          await supabase.from('moderation_log').insert([testLogEntry]);

          console.log(`✅ Webhook test suite completed: ${overallStats.passed_tests}/${overallStats.total_tests} tests passed`);

          return res.status(200).json({
            success: true,
            message: 'Webhook test suite completed',
            overall_stats: overallStats,
            test_suites: testSuites,
            liberation_message: 'Webhook testing ensures community automation serves liberation values'
          });
        }

        if (urlPath === '/api/webhooks/test-webhooks/health') {
          // Health check for webhook testing system
          return res.status(200).json({
            success: true,
            service: 'Webhook Testing System',
            status: 'operational',
            webhook_base_url: WEBHOOK_BASE_URL,
            test_authentication: TEST_API_KEY ? 'configured' : 'missing',
            database: supabaseUrl ? 'connected' : 'disconnected',
            sample_payloads_available: Object.keys(samplePayloads).length,
            liberation_message: 'Webhook testing system operational - ensuring community automation quality'
          });
        }

        if (urlPath === '/api/webhooks/test-webhooks/payloads') {
          // Return sample payloads for manual testing
          return res.status(200).json({
            success: true,
            message: 'Sample webhook payloads for testing',
            payloads: samplePayloads,
            liberation_message: 'Sample payloads help community test and validate webhook automation'
          });
        }

        return res.status(404).json({ success: false, error: 'Webhook testing endpoint not found' });

      case 'POST':
        if (urlPath === '/api/webhooks/test-webhooks/single') {
          // Test a single webhook endpoint
          const { endpoint, method: testMethod, payload, headers: testHeaders } = req.body;

          if (!endpoint || !testMethod) {
            return res.status(400).json({
              success: false,
              error: 'Missing required fields: endpoint, method'
            });
          }

          console.log(`🧪 Testing single webhook: ${testMethod} ${endpoint}`);

          const testResult = await testWebhookEndpoint(
            endpoint,
            testMethod,
            payload || {},
            testHeaders || {}
          );

          return res.status(200).json({
            success: true,
            message: 'Single webhook test completed',
            test_result: testResult,
            liberation_message: 'Single webhook testing enables focused community automation validation'
          });
        }

        return res.status(404).json({ success: false, error: 'Webhook testing endpoint not found' });

      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
          liberation_message: 'Only GET and POST requests supported for webhook testing'
        });
    }
  } catch (error) {
    console.error('❌ Webhook testing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error in webhook testing',
      details: error instanceof Error ? error.message : 'Unknown error',
      liberation_message: 'Technical difficulties with webhook testing - community will address'
    });
  }
}