// BLKOUT Pre-Promotion Checklist Generator
// Generates comprehensive validation checklist before deploying to production

import type { ServiceHealth } from './platformHealthCheck';
import type { DatabaseHealth } from './databaseHealthCheck';
import type { RouteCheck } from './criticalRouteChecker';
import { format } from 'date-fns';

export interface ChecklistItem {
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'skip';
  required: boolean;
  details?: string;
}

export interface PromotionChecklist {
  timestamp: string;
  overallStatus: 'APPROVED' | 'BLOCKED' | 'WARNING';
  blockers: string[];
  warnings: string[];
  items: ChecklistItem[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}

/**
 * Generate pre-promotion checklist from health check results
 */
export function generatePromotionChecklist(
  services: ServiceHealth[],
  database: DatabaseHealth,
  routes: RouteCheck[]
): PromotionChecklist {
  const items: ChecklistItem[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];

  // Category 1: Service Health
  items.push({
    category: 'Service Health',
    item: 'All 7 services return 200 OK',
    status: services.every(s => s.details.httpStatus === 200) ? 'pass' : 'fail',
    required: true,
    details: `${services.filter(s => s.details.httpStatus === 200).length}/7 services healthy`,
  });

  if (!services.every(s => s.details.httpStatus === 200)) {
    blockers.push('Not all services are healthy');
  }

  items.push({
    category: 'Service Health',
    item: 'Response times < 3000ms SLA',
    status: services.every(s => s.responseTime < 3000) ? 'pass' : 'fail',
    required: false,
    details: `Max response time: ${Math.max(...services.map(s => s.responseTime))}ms`,
  });

  if (!services.every(s => s.responseTime < 3000)) {
    warnings.push('Some services have slow response times');
  }

  items.push({
    category: 'Service Health',
    item: 'SSL certificates valid',
    status: services.every(s => s.details.ssl) ? 'pass' : 'fail',
    required: true,
    details: `${services.filter(s => s.details.ssl).length}/7 services using HTTPS`,
  });

  if (!services.every(s => s.details.ssl)) {
    blockers.push('Not all services have valid SSL');
  }

  // Category 2: Critical Features
  const movementRoute = routes.find(r => r.route === '/movement');
  items.push({
    category: 'Critical Features',
    item: 'Theory of Change loads with masonry grid',
    status: movementRoute ? (movementRoute.status === 'pass' ? 'pass' : 'fail') : 'skip',
    required: true,
    details: movementRoute ? `${movementRoute.validations.filter(v => v.passed).length}/${movementRoute.validations.length} validations passed` : undefined,
  });

  if (movementRoute && movementRoute.status !== 'pass') {
    blockers.push('Theory of Change page not functional');
  }

  const storiesRoute = routes.find(r => r.route === '/stories');
  items.push({
    category: 'Critical Features',
    item: '281 stories in archive',
    status: database.legacyArticlesCount === 281 ? 'pass' : 'fail',
    required: true,
    details: `${database.legacyArticlesCount}/281 articles found`,
  });

  if (database.legacyArticlesCount !== 281) {
    blockers.push(`Legacy articles count mismatch: ${database.legacyArticlesCount}/281`);
  }

  const eventsRoute = routes.find(r => r.route === '/events');
  items.push({
    category: 'Critical Features',
    item: 'Events calendar functional',
    status: eventsRoute ? (eventsRoute.status === 'pass' ? 'pass' : 'fail') : 'skip',
    required: true,
    details: eventsRoute ? `HTTP ${eventsRoute.httpStatus}` : undefined,
  });

  if (eventsRoute && eventsRoute.status !== 'pass') {
    blockers.push('Events calendar not functional');
  }

  const governanceRoute = routes.find(r => r.route === '/governance');
  items.push({
    category: 'Critical Features',
    item: 'Governance dashboard works',
    status: governanceRoute ? (governanceRoute.status === 'pass' ? 'pass' : 'fail') : 'skip',
    required: true,
    details: governanceRoute ? `${governanceRoute.validations.filter(v => v.passed).length}/${governanceRoute.validations.length} validations passed` : undefined,
  });

  if (governanceRoute && governanceRoute.status !== 'pass') {
    blockers.push('Governance dashboard not functional');
  }

  // Category 3: Database Integrity
  items.push({
    category: 'Database Integrity',
    item: 'Supabase connection verified',
    status: database.connected ? 'pass' : 'fail',
    required: true,
    details: database.connected ? 'Connected' : 'Connection failed',
  });

  if (!database.connected) {
    blockers.push('Database connection failed');
  }

  items.push({
    category: 'Database Integrity',
    item: 'Article count === 281',
    status: database.legacyArticlesCount === 281 ? 'pass' : 'fail',
    required: true,
    details: `${database.legacyArticlesCount}/281`,
  });

  items.push({
    category: 'Database Integrity',
    item: 'No mock data present',
    status: !database.hasMockData ? 'pass' : 'fail',
    required: true,
    details: database.hasMockData ? 'Mock data detected' : 'No mock data',
  });

  if (database.hasMockData) {
    blockers.push('Mock/test data in production tables');
  }

  items.push({
    category: 'Database Integrity',
    item: 'RLS policies active',
    status: database.rlsActive ? 'pass' : 'fail',
    required: false,
    details: database.rlsActive ? 'RLS active' : 'RLS not configured',
  });

  // Category 4: Integration
  items.push({
    category: 'Integration',
    item: 'Cross-service links work',
    status: 'skip', // Would need additional testing
    required: false,
    details: 'Manual verification required',
  });

  items.push({
    category: 'Integration',
    item: 'Auth flows functional',
    status: 'skip', // Would need additional testing
    required: false,
    details: 'Manual verification required',
  });

  const adminRoute = routes.find(r => r.route === '/admin');
  items.push({
    category: 'Integration',
    item: 'API endpoints operational',
    status: adminRoute ? (adminRoute.status !== 'fail' ? 'pass' : 'fail') : 'skip',
    required: true,
    details: adminRoute ? `Admin endpoint: HTTP ${adminRoute.httpStatus}` : undefined,
  });

  // Category 5: Performance
  items.push({
    category: 'Performance',
    item: 'Load time < 3s for all pages',
    status: routes.every(r => r.responseTime < 3000) ? 'pass' : 'fail',
    required: false,
    details: `Max load time: ${Math.max(...routes.map(r => r.responseTime))}ms`,
  });

  items.push({
    category: 'Performance',
    item: '50 concurrent users handled',
    status: 'skip', // Would need load testing
    required: false,
    details: 'Load testing required',
  });

  items.push({
    category: 'Performance',
    item: 'Error rate < 1%',
    status: 'skip', // Would need monitoring data
    required: false,
    details: 'Monitoring data required',
  });

  // Calculate summary
  const summary = {
    total: items.length,
    passed: items.filter(i => i.status === 'pass').length,
    failed: items.filter(i => i.status === 'fail').length,
    skipped: items.filter(i => i.status === 'skip').length,
  };

  // Determine overall status
  let overallStatus: PromotionChecklist['overallStatus'] = 'APPROVED';
  if (blockers.length > 0) {
    overallStatus = 'BLOCKED';
  } else if (warnings.length > 0) {
    overallStatus = 'WARNING';
  }

  return {
    timestamp: new Date().toISOString(),
    overallStatus,
    blockers,
    warnings,
    items,
    summary,
  };
}

/**
 * Format checklist as markdown
 */
export function formatChecklistAsMarkdown(checklist: PromotionChecklist): string {
  const lines: string[] = [];

  // Header
  lines.push('# Pre-Promotion Validation Checklist');
  lines.push('');
  lines.push(`**Generated**: ${format(new Date(checklist.timestamp), 'yyyy-MM-dd HH:mm:ss')}`);
  lines.push(`**Status**: **${checklist.overallStatus}**`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push(`- ✅ Passed: ${checklist.summary.passed}/${checklist.summary.total}`);
  lines.push(`- ❌ Failed: ${checklist.summary.failed}/${checklist.summary.total}`);
  lines.push(`- ⏭️ Skipped: ${checklist.summary.skipped}/${checklist.summary.total}`);
  lines.push('');

  // Blockers
  if (checklist.blockers.length > 0) {
    lines.push('## 🚫 Critical Blockers');
    checklist.blockers.forEach(blocker => {
      lines.push(`- ${blocker}`);
    });
    lines.push('');
  }

  // Warnings
  if (checklist.warnings.length > 0) {
    lines.push('## ⚠️ Warnings');
    checklist.warnings.forEach(warning => {
      lines.push(`- ${warning}`);
    });
    lines.push('');
  }

  // Detailed checklist by category
  const categories = [...new Set(checklist.items.map(i => i.category))];

  categories.forEach(category => {
    lines.push(`## ${category}`);
    lines.push('');

    const categoryItems = checklist.items.filter(i => i.category === category);

    categoryItems.forEach(item => {
      const icon = item.status === 'pass' ? '✅' : item.status === 'fail' ? '❌' : '⏭️';
      const requiredLabel = item.required ? ' **(REQUIRED)**' : '';
      lines.push(`- ${icon} ${item.item}${requiredLabel}`);

      if (item.details) {
        lines.push(`  - *${item.details}*`);
      }
    });

    lines.push('');
  });

  // Decision
  lines.push('---');
  lines.push('');
  lines.push(`## Decision: **${checklist.overallStatus}**`);

  if (checklist.overallStatus === 'BLOCKED') {
    lines.push('');
    lines.push('**Action Required**: Resolve critical blockers before deploying to production.');
  } else if (checklist.overallStatus === 'WARNING') {
    lines.push('');
    lines.push('**Action Required**: Review warnings before deploying to production.');
  } else {
    lines.push('');
    lines.push('**Action**: Approved for production deployment.');
  }

  return lines.join('\n');
}

/**
 * Export checklist as JSON
 */
export function exportChecklistAsJSON(checklist: PromotionChecklist): string {
  return JSON.stringify(checklist, null, 2);
}
