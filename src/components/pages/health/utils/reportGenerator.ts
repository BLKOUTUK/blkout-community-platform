/**
 * Report Generator Utility
 * Generates comprehensive troubleshooting reports
 */

import { format } from 'date-fns';
import type { ServiceHealth, DatabaseHealth, RouteCheck, PromotionChecklist } from '../types';
import { diagnoseFailure, formatDiagnosis } from '@/services/failureDiagnosis';

/**
 * Generate comprehensive troubleshooting report
 */
export function generateTroubleshootingReport(
  services: ServiceHealth[],
  database: DatabaseHealth | null,
  routes: RouteCheck[],
  checklist: PromotionChecklist | null,
  overallStatus: string
): string {
  const lines: string[] = [];
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  // Header
  lines.push('# BLKOUT Platform Troubleshooting Report');
  lines.push('');
  lines.push(`**Generated**: ${timestamp}`);
  lines.push(`**Platform**: blkoutuk.com`);
  lines.push(`**Report Type**: Comprehensive Diagnostic`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Executive Summary
  lines.push('## Executive Summary');
  lines.push('');
  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  const downCount = services.filter(s => s.status === 'down').length;

  lines.push(`**Overall Status**: ${overallStatus.toUpperCase()}`);
  lines.push(`**Services**: ${healthyCount} healthy, ${degradedCount} degraded, ${downCount} down`);
  lines.push(`**Database**: ${database?.connected ? 'Connected' : 'Disconnected'}`);
  lines.push(`**Legacy Articles**: ${database?.legacyArticlesCount || 0}/281`);
  lines.push(`**Deployment Status**: ${checklist?.overallStatus || 'UNKNOWN'}`);
  lines.push('');

  // Critical Issues
  if (checklist && checklist.blockers.length > 0) {
    lines.push('### Critical Blockers');
    lines.push('');
    checklist.blockers.forEach(blocker => {
      lines.push(`- ${blocker}`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Service Health Details
  lines.push('## Service Health Details');
  lines.push('');

  services.forEach((service) => {
    lines.push(`### ${service.name}`);
    lines.push('');
    lines.push(`**URL**: ${service.url}`);
    lines.push(`**Status**: ${service.status.toUpperCase()}`);
    lines.push(`**HTTP Status**: ${service.details.httpStatus}`);
    lines.push(`**Response Time**: ${service.responseTime}ms`);
    lines.push(`**SSL**: ${service.details.ssl ? '✓ Valid' : '✗ Invalid'}`);
    lines.push(`**Last Check**: ${service.lastCheck}`);
    lines.push('');

    if (service.status !== 'healthy') {
      if (service.details.errors && service.details.errors.length > 0) {
        lines.push('**Errors**:');
        service.details.errors.forEach(error => {
          lines.push(`- ${error}`);
        });
        lines.push('');
      }

      // Diagnose the failure
      if (service.details.httpStatus === 0) {
        const diagnosis = diagnoseFailure('connectivity', { error: service.details.errors?.[0] || '' });
        lines.push('**Diagnosis**:');
        lines.push('');
        lines.push(formatDiagnosis(diagnosis));
      } else if (service.details.httpStatus >= 400) {
        const diagnosis = diagnoseFailure('http_status', {
          httpStatus: service.details.httpStatus,
          route: service.url
        });
        lines.push('**Diagnosis**:');
        lines.push('');
        lines.push(formatDiagnosis(diagnosis));
      } else if (service.responseTime > 3000) {
        const diagnosis = diagnoseFailure('performance', { responseTime: service.responseTime });
        lines.push('**Diagnosis**:');
        lines.push('');
        lines.push(formatDiagnosis(diagnosis));
      }
    }

    lines.push('');
  });

  lines.push('---');
  lines.push('');

  // Database Health
  if (database) {
    lines.push('## Database Health');
    lines.push('');
    lines.push(`**Connection**: ${database.connected ? '✓ Connected' : '✗ Disconnected'}`);
    lines.push(`**Legacy Articles**: ${database.legacyArticlesCount}/281 ${database.legacyArticlesCount === 281 ? '✓' : '❌'}`);
    lines.push(`**News Articles**: ${database.newsArticlesCount}`);
    lines.push(`**Events**: ${database.eventsCount}`);
    lines.push(`**Moderation Queue**: ${database.moderationQueueCount} pending`);
    lines.push(`**Mock Data**: ${database.hasMockData ? '❌ Detected' : '✓ None'}`);
    lines.push(`**RLS Active**: ${database.rlsActive ? '✓ Yes' : '⚠️ Not configured'}`);
    lines.push(`**Last Check**: ${database.lastCheck}`);
    lines.push('');

    if (database.errors.length > 0) {
      lines.push('**Database Errors**:');
      database.errors.forEach(error => {
        lines.push(`- ${error}`);
      });
      lines.push('');

      if (database.legacyArticlesCount !== 281) {
        const diagnosis = diagnoseFailure('database', {
          error: 'Article count mismatch',
          expectedCount: 281,
          actualCount: database.legacyArticlesCount
        });
        lines.push('**Diagnosis - Article Count Mismatch**:');
        lines.push('');
        lines.push(formatDiagnosis(diagnosis));
        lines.push('');
      }

      if (!database.connected) {
        const diagnosis = diagnoseFailure('database', { error: 'Connection failed' });
        lines.push('**Diagnosis - Connection Failure**:');
        lines.push('');
        lines.push(formatDiagnosis(diagnosis));
        lines.push('');
      }
    }
  }

  lines.push('---');
  lines.push('');

  // Route Health
  lines.push('## Critical Route Validation');
  lines.push('');

  routes.forEach((route) => {
    const statusEmoji = route.status === 'pass' ? '✓' : route.status === 'warning' ? '⚠️' : '✗';
    lines.push(`### ${statusEmoji} ${route.route}`);
    lines.push('');
    lines.push(`**URL**: ${route.url}`);
    lines.push(`**Status**: ${route.status.toUpperCase()}`);
    lines.push(`**HTTP Status**: ${route.httpStatus}`);
    lines.push(`**Response Time**: ${route.responseTime}ms`);
    lines.push('');

    lines.push('**Validations**:');
    route.validations.forEach(validation => {
      const icon = validation.passed ? '✓' : '✗';
      lines.push(`- ${icon} ${validation.name}: ${validation.actual}`);
    });
    lines.push('');

    if (route.errors.length > 0) {
      lines.push('**Errors**:');
      route.errors.forEach(error => {
        lines.push(`- ${error}`);
      });
      lines.push('');

      if (route.httpStatus >= 400) {
        const diagnosis = diagnoseFailure('http_status', {
          httpStatus: route.httpStatus,
          route: route.route
        });
        lines.push('**Diagnosis**:');
        lines.push('');
        lines.push(formatDiagnosis(diagnosis));
        lines.push('');
      }
    }
  });

  lines.push('---');
  lines.push('');

  // Pre-Deployment Checklist
  if (checklist) {
    lines.push('## Pre-Deployment Checklist');
    lines.push('');
    lines.push(`**Overall Status**: **${checklist.overallStatus}**`);
    lines.push(`**Passed**: ${checklist.summary.passed}/${checklist.summary.total}`);
    lines.push(`**Failed**: ${checklist.summary.failed}/${checklist.summary.total}`);
    lines.push(`**Skipped**: ${checklist.summary.skipped}/${checklist.summary.total}`);
    lines.push('');

    if (checklist.blockers.length > 0) {
      lines.push('### Critical Blockers');
      checklist.blockers.forEach(blocker => {
        lines.push(`- ${blocker}`);
      });
      lines.push('');
    }

    if (checklist.warnings.length > 0) {
      lines.push('### Warnings');
      checklist.warnings.forEach(warning => {
        lines.push(`- ${warning}`);
      });
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');

  // Recommended Actions
  lines.push('## Recommended Actions');
  lines.push('');
  lines.push('### Immediate Actions');
  lines.push('');

  const failedServices = services.filter(s => s.status === 'down');
  if (failedServices.length > 0) {
    lines.push('**Fix Failed Services**:');
    failedServices.forEach(service => {
      lines.push(`1. Check ${service.name} deployment in Coolify`);
      lines.push(`   - URL: ${service.url}`);
      lines.push(`   - Check application logs`);
      lines.push(`   - Verify environment variables`);
      lines.push(`   - Restart service if needed`);
    });
    lines.push('');
  }

  if (database && database.legacyArticlesCount !== 281) {
    lines.push('**Fix Database Article Count**:');
    lines.push('1. Verify Supabase connection credentials');
    lines.push('2. Check legacy_articles table in Supabase dashboard');
    lines.push('3. Verify migrations were applied');
    lines.push('4. Check RLS policies are not blocking reads');
    lines.push('');
  }

  if (database && database.errors.length > 0) {
    lines.push('**Fix Database Connection Issues**:');
    lines.push('1. Check VITE_SUPABASE_URL environment variable');
    lines.push('2. Check VITE_SUPABASE_ANON_KEY environment variable');
    lines.push('3. Verify environment variables are set at build time');
    lines.push('4. Check Dockerfile ENV commands execute before npm run build');
    lines.push('');
  }

  const failedRoutes = routes.filter(r => r.status === 'fail');
  if (failedRoutes.length > 0) {
    lines.push('**Fix Failed Routes**:');
    failedRoutes.forEach(route => {
      lines.push(`1. Fix ${route.route}:`);
      lines.push(`   - HTTP Status: ${route.httpStatus}`);
      lines.push(`   - Check server.cjs routing`);
      lines.push(`   - Verify component exists`);
      lines.push(`   - Check browser console for errors`);
    });
    lines.push('');
  }

  lines.push('### After Each Fix');
  lines.push('');
  lines.push('1. Redeploy the application via Coolify');
  lines.push('2. Wait 2-3 minutes for deployment to complete');
  lines.push('3. Return to health dashboard and click "Refresh"');
  lines.push('4. Verify the issue is resolved');
  lines.push('5. Export new report to track progress');
  lines.push('');

  lines.push('---');
  lines.push('');

  // System Information
  lines.push('## System Information');
  lines.push('');
  lines.push(`**Platform**: BLKOUT Liberation Platform`);
  lines.push(`**Repository**: BLKOUTUK/blkout-community-platform`);
  lines.push(`**Production URL**: https://blkoutuk.com`);
  lines.push(`**Deployment**: Coolify (Hostinger UK)`);
  lines.push(`**Database**: Supabase`);
  lines.push(`**Report Generated**: ${timestamp}`);
  lines.push('');

  lines.push('---');
  lines.push('');

  // Related Documentation
  lines.push('## Related Documentation');
  lines.push('');
  lines.push('- `/HEALTH_DASHBOARD.md` - Health Dashboard user guide');
  lines.push('- `/PLATFORM_REMEDIATION_PLAN.md` - Systematic fix plan');
  lines.push('- `/SESSION_HANDOFF.md` - Current deployment status');
  lines.push('- `/COMMAND_CENTER_ROADMAP.md` - Long-term vision');
  lines.push('- `/DEPLOYMENT-PLAN.md` - Infrastructure architecture');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('*Generated by BLKOUT Health Dashboard - https://blkoutuk.com/health-dashboard*');

  return lines.join('\n');
}
