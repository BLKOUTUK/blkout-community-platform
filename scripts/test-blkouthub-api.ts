#!/usr/bin/env ts-node

/**
 * BLKOUTHUB API Connection Test Script
 * Tests connectivity to Heartbeat.chat API and validates configuration
 *
 * Usage:
 *   npm run test:blkouthub
 *   or
 *   ts-node scripts/test-blkouthub-api.ts
 *
 * Environment Variables Required:
 *   HEARTBEAT_API_TOKEN - Your Heartbeat.chat API token
 *   BLKOUTHUB_COMMUNITY_ID - Your BLKOUTHUB community ID on Heartbeat
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
}

const results: TestResult[] = [];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function printHeader() {
  console.log('\n' + colors.cyan + colors.bold + '='.repeat(60) + colors.reset);
  console.log(colors.cyan + colors.bold + '  BLKOUTHUB API Connection Test' + colors.reset);
  console.log(colors.cyan + colors.bold + '='.repeat(60) + colors.reset + '\n');
}

function printResult(result: TestResult) {
  const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
  const color = result.status === 'pass' ? colors.green : result.status === 'fail' ? colors.red : colors.yellow;

  console.log(`${icon} ${color}${result.test}${colors.reset}`);
  console.log(`   ${result.message}`);
  if (result.details) {
    console.log(`   ${colors.cyan}Details: ${JSON.stringify(result.details, null, 2)}${colors.reset}`);
  }
  console.log('');
}

function printSummary() {
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warn').length;

  console.log('\n' + colors.cyan + colors.bold + '='.repeat(60) + colors.reset);
  console.log(colors.cyan + colors.bold + '  Test Summary' + colors.reset);
  console.log(colors.cyan + colors.bold + '='.repeat(60) + colors.reset + '\n');

  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${warnings}${colors.reset}`);
  console.log(`Total Tests: ${results.length}\n`);

  if (failed === 0 && warnings === 0) {
    console.log(colors.green + colors.bold + '🎉 All tests passed! BLKOUTHUB integration is ready.' + colors.reset + '\n');
  } else if (failed === 0) {
    console.log(colors.yellow + '⚠️  Some warnings present. Review configuration.' + colors.reset + '\n');
  } else {
    console.log(colors.red + '❌ Some tests failed. Please fix configuration issues.' + colors.reset + '\n');
  }
}

async function testEnvironmentVariables() {
  console.log(colors.bold + '1. Testing Environment Variables...' + colors.reset + '\n');

  // Test HEARTBEAT_API_TOKEN
  const heartbeatToken = process.env.HEARTBEAT_API_TOKEN;
  if (!heartbeatToken) {
    results.push({
      test: 'HEARTBEAT_API_TOKEN',
      status: 'fail',
      message: 'Environment variable not set. Add to .env.local file.'
    });
  } else if (heartbeatToken === 'dev-heartbeat-token' || heartbeatToken.includes('your-')) {
    results.push({
      test: 'HEARTBEAT_API_TOKEN',
      status: 'warn',
      message: 'Using placeholder token. Replace with real Heartbeat.chat API token.',
      details: { token: heartbeatToken.substring(0, 10) + '...' }
    });
  } else {
    results.push({
      test: 'HEARTBEAT_API_TOKEN',
      status: 'pass',
      message: 'Environment variable set correctly.',
      details: { token: heartbeatToken.substring(0, 10) + '...' }
    });
  }

  // Test BLKOUTHUB_COMMUNITY_ID
  const communityId = process.env.BLKOUTHUB_COMMUNITY_ID;
  if (!communityId) {
    results.push({
      test: 'BLKOUTHUB_COMMUNITY_ID',
      status: 'fail',
      message: 'Environment variable not set. Add to .env.local file.'
    });
  } else if (communityId.includes('your-')) {
    results.push({
      test: 'BLKOUTHUB_COMMUNITY_ID',
      status: 'warn',
      message: 'Using placeholder community ID. Replace with real BLKOUTHUB ID.',
      details: { communityId }
    });
  } else {
    results.push({
      test: 'BLKOUTHUB_COMMUNITY_ID',
      status: 'pass',
      message: 'Environment variable set correctly.',
      details: { communityId }
    });
  }

  results.forEach(printResult);
}

async function testHeartbeatAPI() {
  console.log(colors.bold + '2. Testing Heartbeat.chat API Connection...' + colors.reset + '\n');

  const heartbeatToken = process.env.HEARTBEAT_API_TOKEN;

  if (!heartbeatToken || heartbeatToken === 'dev-heartbeat-token' || heartbeatToken.includes('your-')) {
    results.push({
      test: 'Heartbeat API Connection',
      status: 'warn',
      message: 'Skipped - Valid API token required. Configure HEARTBEAT_API_TOKEN first.'
    });
    printResult(results[results.length - 1]);
    return;
  }

  try {
    // Test basic API connectivity
    const response = await fetch('https://api.heartbeat.chat/v1/health', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${heartbeatToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      results.push({
        test: 'Heartbeat API Health Check',
        status: 'pass',
        message: 'Successfully connected to Heartbeat.chat API.',
        details: { status: response.status }
      });
    } else {
      results.push({
        test: 'Heartbeat API Health Check',
        status: 'fail',
        message: `API returned error status: ${response.status}`,
        details: { status: response.status, statusText: response.statusText }
      });
    }
  } catch (error) {
    results.push({
      test: 'Heartbeat API Health Check',
      status: 'fail',
      message: 'Failed to connect to Heartbeat.chat API.',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }

  printResult(results[results.length - 1]);
}

async function testCommunityAccess() {
  console.log(colors.bold + '3. Testing BLKOUTHUB Community Access...' + colors.reset + '\n');

  const heartbeatToken = process.env.HEARTBEAT_API_TOKEN;
  const communityId = process.env.BLKOUTHUB_COMMUNITY_ID;

  if (!heartbeatToken || !communityId ||
      heartbeatToken === 'dev-heartbeat-token' ||
      communityId.includes('your-')) {
    results.push({
      test: 'Community Access',
      status: 'warn',
      message: 'Skipped - Valid API token and community ID required.'
    });
    printResult(results[results.length - 1]);
    return;
  }

  try {
    // Test community access
    const response = await fetch(`https://api.heartbeat.chat/v1/communities/${communityId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${heartbeatToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      results.push({
        test: 'BLKOUTHUB Community Access',
        status: 'pass',
        message: 'Successfully accessed BLKOUTHUB community data.',
        details: {
          communityId,
          name: data.name || 'Unknown',
          memberCount: data.memberCount || 'Unknown'
        }
      });
    } else {
      results.push({
        test: 'BLKOUTHUB Community Access',
        status: 'fail',
        message: `Failed to access community: ${response.status}`,
        details: { status: response.status, statusText: response.statusText }
      });
    }
  } catch (error) {
    results.push({
      test: 'BLKOUTHUB Community Access',
      status: 'fail',
      message: 'Failed to fetch community data.',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }

  printResult(results[results.length - 1]);
}

async function testMembershipVerification() {
  console.log(colors.bold + '4. Testing Membership Verification...' + colors.reset + '\n');

  const heartbeatToken = process.env.HEARTBEAT_API_TOKEN;
  const communityId = process.env.BLKOUTHUB_COMMUNITY_ID;

  if (!heartbeatToken || !communityId ||
      heartbeatToken === 'dev-heartbeat-token' ||
      communityId.includes('your-')) {
    results.push({
      test: 'Membership Verification',
      status: 'warn',
      message: 'Skipped - Valid API token and community ID required.'
    });
    printResult(results[results.length - 1]);
    return;
  }

  try {
    // Test user search endpoint (used for membership verification)
    const testEmail = 'test@example.com';
    const response = await fetch('https://api.heartbeat.chat/v1/find/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${heartbeatToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail,
        communityId: communityId
      })
    });

    // 200 or 404 are both acceptable (user exists or doesn't)
    if (response.ok || response.status === 404) {
      results.push({
        test: 'Membership Verification Endpoint',
        status: 'pass',
        message: 'Membership verification endpoint accessible.',
        details: { status: response.status }
      });
    } else if (response.status === 401 || response.status === 403) {
      results.push({
        test: 'Membership Verification Endpoint',
        status: 'fail',
        message: 'Authentication failed. Check API token permissions.',
        details: { status: response.status }
      });
    } else {
      results.push({
        test: 'Membership Verification Endpoint',
        status: 'warn',
        message: `Unexpected response: ${response.status}`,
        details: { status: response.status, statusText: response.statusText }
      });
    }
  } catch (error) {
    results.push({
      test: 'Membership Verification Endpoint',
      status: 'fail',
      message: 'Failed to access verification endpoint.',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
  }

  printResult(results[results.length - 1]);
}

async function runTests() {
  printHeader();

  await testEnvironmentVariables();
  await testHeartbeatAPI();
  await testCommunityAccess();
  await testMembershipVerification();

  printSummary();

  // Exit with error code if any tests failed
  const failed = results.filter(r => r.status === 'fail').length;
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error(colors.red + '\n❌ Test script error:', error, colors.reset);
  process.exit(1);
});
