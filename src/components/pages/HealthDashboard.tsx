// BLKOUT Unified Command Center - Platform Health Dashboard
// Organizational intelligence dashboard for trust-building with community

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Database,
  Globe,
  Server,
  Clock,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';

// Service imports
import {
  checkAllServices,
  getOverallStatus,
  getAverageResponseTime,
  type ServiceHealth,
} from '@/services/platformHealthCheck';
import { checkDatabaseHealth, getDatabaseHealthSummary, type DatabaseHealth } from '@/services/databaseHealthCheck';
import { checkAllRoutes, type RouteCheck } from '@/services/criticalRouteChecker';
import {
  generatePromotionChecklist,
  formatChecklistAsMarkdown,
  exportChecklistAsJSON,
  type PromotionChecklist,
} from '@/services/promotionChecklist';
import { diagnoseFailure, formatDiagnosis } from '@/services/failureDiagnosis';
import {
  checkAllContainers,
  getCategorySummary,
  getCriticalIssues,
  getTotalResourceUsage,
  type ContainerHealth,
} from '@/services/dockerHealthCheck';

type Tab = 'overview' | 'routes' | 'database' | 'infrastructure' | 'checklist';

const HealthDashboard: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Health data
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [database, setDatabase] = useState<DatabaseHealth | null>(null);
  const [routes, setRoutes] = useState<RouteCheck[]>([]);
  const [containers, setContainers] = useState<ContainerHealth[]>([]);
  const [checklist, setChecklist] = useState<PromotionChecklist | null>(null);

  /**
   * Perform comprehensive health check
   */
  const performHealthCheck = async () => {
    setIsLoading(true);

    try {
      // Run all health checks in parallel (including new Docker infrastructure)
      const [servicesData, databaseData, routesData, containersData] = await Promise.all([
        checkAllServices(),
        checkDatabaseHealth(),
        checkAllRoutes(),
        checkAllContainers(),
      ]);

      setServices(servicesData);
      setDatabase(databaseData);
      setRoutes(routesData);
      setContainers(containersData);

      // Generate promotion checklist
      const checklistData = generatePromotionChecklist(servicesData, databaseData, routesData);
      setChecklist(checklistData);

      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Auto-refresh every 2 minutes
   */
  useEffect(() => {
    performHealthCheck();

    if (autoRefresh) {
      const interval = setInterval(() => {
        performHealthCheck();
      }, 120000); // 2 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  /**
   * Export health report as markdown
   */
  const exportMarkdown = () => {
    if (!checklist) return;

    const markdown = formatChecklistAsMarkdown(checklist);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blkout-health-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.md`;
    a.click();
  };

  /**
   * Export health report as JSON
   */
  const exportJSON = () => {
    if (!checklist) return;

    const json = exportChecklistAsJSON(checklist);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blkout-health-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
    a.click();
  };

  /**
   * Generate comprehensive troubleshooting report
   */
  const generateTroubleshootingReport = (): string => {
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
      lines.push('### 🚨 Critical Blockers');
      lines.push('');
      checklist.blockers.forEach(blocker => {
        lines.push(`- ❌ ${blocker}`);
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

      // Add diagnosis if service has issues
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

        // Diagnose database issues
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
          const diagnosis = diagnoseFailure('database', {
            error: 'Connection failed',
          });
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

        // Diagnose route failures
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
  };

  /**
   * Export comprehensive troubleshooting report
   */
  const exportTroubleshooting = () => {
    const report = generateTroubleshootingReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blkout-troubleshooting-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.md`;
    a.click();
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: 'healthy' | 'degraded' | 'down' | 'unknown') => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'down':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  /**
   * Get status icon
   */
  const getStatusIcon = (status: 'healthy' | 'degraded' | 'down' | 'unknown') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6" />;
      case 'degraded':
        return <AlertTriangle className="w-6 h-6" />;
      case 'down':
        return <XCircle className="w-6 h-6" />;
      default:
        return <AlertCircle className="w-6 h-6" />;
    }
  };

  const overallStatus = services.length > 0 ? getOverallStatus(services) : 'unknown';
  const avgResponseTime = services.length > 0 ? getAverageResponseTime(services) : 0;
  const dbSummary = database ? getDatabaseHealthSummary(database) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  BLKOUT Command Center
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unified platform health monitoring
                </p>
              </div>
            </div>

            {/* Overall Status Badge */}
            <div className={`flex items-center gap-3 px-6 py-3 rounded-lg ${getStatusColor(overallStatus)}`}>
              {getStatusIcon(overallStatus)}
              <div>
                <div className="text-sm font-medium">Platform Status</div>
                <div className="text-lg font-bold uppercase">{overallStatus}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={performHealthCheck}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-refresh (2 min)
            </label>

            <div className="flex-1" />

            <button
              onClick={exportMarkdown}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Download className="w-4 h-4" />
              Export MD
            </button>

            <button
              onClick={exportJSON}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>

            <button
              onClick={exportTroubleshooting}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              title="Download comprehensive troubleshooting report with diagnoses"
            >
              <Download className="w-4 h-4" />
              Troubleshooting Report
            </button>

            {lastCheck && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {format(lastCheck, 'HH:mm:ss')}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Services</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {services.filter(s => s.status === 'healthy').length}/{services.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {avgResponseTime}ms
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Database</div>
              <div className={`text-2xl font-bold ${dbSummary?.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                {database?.connected ? 'Connected' : 'Down'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Articles</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {database?.legacyArticlesCount || 0}/281
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(['overview', 'routes', 'database', 'infrastructure', 'checklist'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Service Health Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <motion.div
                    key={service.name}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl border-2 ${
                      service.status === 'healthy'
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                        : service.status === 'degraded'
                        ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                          {service.name}
                        </h3>
                      </div>
                      {getStatusIcon(service.status)}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 uppercase">
                          {service.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Response</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {service.responseTime}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">HTTP</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {service.details.httpStatus || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">SSL</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {service.details.ssl ? '✓ Valid' : '✗ Invalid'}
                        </span>
                      </div>
                    </div>

                    {service.details.errors && service.details.errors.length > 0 && (
                      <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">
                          Errors:
                        </div>
                        <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                          {service.details.errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      {service.url}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'routes' && (
            <motion.div
              key="routes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Critical Route Validation
              </h2>

              <div className="space-y-4">
                {routes.map((route) => (
                  <motion.div
                    key={route.route}
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 rounded-xl border-2 ${
                      route.status === 'pass'
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                        : route.status === 'warning'
                        ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {route.route}
                        </h3>
                        <a
                          href={route.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                        >
                          {route.url}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {route.responseTime}ms
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          route.status === 'pass'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                            : route.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                        }`}>
                          {route.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {route.validations.map((validation, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          {validation.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-gray-700 dark:text-gray-300">
                            {validation.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {route.errors.length > 0 && (
                      <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">
                          Errors:
                        </div>
                        <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                          {route.errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'database' && database && (
            <motion.div
              key="database"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Database Health & Integrity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Connection Status */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl border-2 ${
                    database.connected
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Connection Status
                    </h3>
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {database.connected ? (
                      <span className="text-green-600">Connected</span>
                    ) : (
                      <span className="text-red-600">Disconnected</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dbSummary?.message}
                  </p>
                </motion.div>

                {/* Article Counts */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl border-2 ${
                    database.legacyArticlesCount === 281
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Legacy Articles (Joseph Beam)
                    </h3>
                  </div>
                  <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {database.legacyArticlesCount}/281
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {database.legacyArticlesCount === 281
                      ? 'All articles present'
                      : `Missing ${281 - database.legacyArticlesCount} articles`}
                  </p>
                </motion.div>

                {/* News Articles */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      News Articles
                    </h3>
                  </div>
                  <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {database.newsArticlesCount}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Published articles
                  </p>
                </motion.div>

                {/* Events */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Events
                    </h3>
                  </div>
                  <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {database.eventsCount}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {database.moderationQueueCount} in moderation queue
                  </p>
                </motion.div>
              </div>

              {/* Data Integrity Checks */}
              <div className="mt-6 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                  Data Integrity Checks
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Mock Data Detection</span>
                    {database.hasMockData ? (
                      <span className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        Mock data present
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        No mock data
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">RLS Policies</span>
                    {database.rlsActive ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="w-5 h-5" />
                        Not configured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Database Errors */}
              {database.errors.length > 0 && (
                <div className="mt-6 p-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                  <h3 className="text-lg font-bold mb-4 text-red-800 dark:text-red-200">
                    Database Errors
                  </h3>
                  <ul className="space-y-2">
                    {database.errors.map((error, i) => (
                      <li key={i} className="text-sm text-red-700 dark:text-red-300">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'infrastructure' && (
            <motion.div
              key="infrastructure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Docker Infrastructure Status
              </h2>

              {/* Category Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {(() => {
                  const categorySummary = getCategorySummary(containers);
                  const criticalIssues = getCriticalIssues(containers);
                  const resourceUsage = getTotalResourceUsage(containers);

                  return (
                    <>
                      {/* IVOR Services Summary */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Activity className="w-6 h-6 text-purple-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            IVOR Services
                          </h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Running</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {categorySummary.ivor.running}/{categorySummary.ivor.total}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Critical</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {categorySummary.ivor.critical} services
                            </span>
                          </div>
                          {categorySummary.ivor.running === categorySummary.ivor.total ? (
                            <div className="flex items-center gap-2 text-green-600 mt-2">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">All systems operational</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-600 mt-2">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Services degraded</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Coolify Summary */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Server className="w-6 h-6 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Coolify Platform
                          </h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Running</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {categorySummary.coolify.running}/{categorySummary.coolify.total}
                            </span>
                          </div>
                          {categorySummary.coolify.running === categorySummary.coolify.total ? (
                            <div className="flex items-center gap-2 text-green-600 mt-2">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Platform operational</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-600 mt-2">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Platform degraded</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Critical Issues Alert */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="w-6 h-6 text-orange-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Critical Alerts
                          </h3>
                        </div>
                        {criticalIssues.length > 0 ? (
                          <div className="space-y-2">
                            {criticalIssues.map((issue, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <span className="text-red-600">{issue}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">No critical issues</span>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Container List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Container Details
                </h3>

                {/* IVOR Microservices */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    IVOR Microservices (Voice Chatbot Foundation)
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {containers.filter(c => c.category === 'ivor').map((container) => (
                      <div
                        key={container.container}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                                {container.name}
                              </h5>
                              {container.status === 'running' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : container.status === 'restarting' ? (
                                <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Status:</span>{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{container.status}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Uptime:</span>{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{container.uptime}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">CPU:</span>{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{container.cpu}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Memory:</span>{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{container.memory}</span>
                              </div>
                            </div>
                            {container.details.ports && container.details.ports.length > 0 && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Ports: {container.details.ports.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coolify Platform */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Coolify Platform Management
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {containers.filter(c => c.category === 'coolify').map((container) => (
                      <div
                        key={container.container}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                                {container.name}
                              </h5>
                              {container.status === 'running' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Status:</span>{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{container.status}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Uptime:</span>{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{container.uptime}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">CPU:</span>{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{container.cpu}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Memory:</span>{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{container.memory}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Future Infrastructure Note */}
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Phase 1: Core Infrastructure (Current)
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Monitoring IVOR microservices (6) and Coolify platform (2) - critical for February 2026 voice chatbot launch.
                      </p>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">
                        Phase 2: Admin & Analytics (Planned)
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Future expansion will include: Research Agent, Impact Analytics, Admin Tools, and other backend services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'checklist' && checklist && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Pre-Promotion Validation Checklist
                </h2>

                <div className={`px-6 py-3 rounded-lg font-bold text-lg ${
                  checklist.overallStatus === 'APPROVED'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                    : checklist.overallStatus === 'WARNING'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                }`}>
                  {checklist.overallStatus}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Passed</div>
                  <div className="text-3xl font-bold text-green-600">
                    {checklist.summary.passed}/{checklist.summary.total}
                  </div>
                </div>

                <div className="p-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Failed</div>
                  <div className="text-3xl font-bold text-red-600">
                    {checklist.summary.failed}/{checklist.summary.total}
                  </div>
                </div>

                <div className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skipped</div>
                  <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                    {checklist.summary.skipped}/{checklist.summary.total}
                  </div>
                </div>
              </div>

              {/* Blockers */}
              {checklist.blockers.length > 0 && (
                <div className="mb-6 p-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                  <h3 className="text-lg font-bold mb-4 text-red-800 dark:text-red-200 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Critical Blockers
                  </h3>
                  <ul className="space-y-2">
                    {checklist.blockers.map((blocker, i) => (
                      <li key={i} className="text-sm text-red-700 dark:text-red-300">
                        • {blocker}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {checklist.warnings.length > 0 && (
                <div className="mb-6 p-6 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
                  <h3 className="text-lg font-bold mb-4 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Warnings
                  </h3>
                  <ul className="space-y-2">
                    {checklist.warnings.map((warning, i) => (
                      <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Checklist Items by Category */}
              {[...new Set(checklist.items.map(i => i.category))].map((category) => (
                <div key={category} className="mb-6 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {category}
                  </h3>

                  <div className="space-y-3">
                    {checklist.items
                      .filter(item => item.category === category)
                      .map((item, i) => (
                        <div key={i} className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {item.status === 'pass' ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            ) : item.status === 'fail' ? (
                              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                            )}

                            <div className="flex-1">
                              <div className="text-gray-900 dark:text-gray-100">
                                {item.item}
                                {item.required && (
                                  <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400">
                                    REQUIRED
                                  </span>
                                )}
                              </div>
                              {item.details && (
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {item.details}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              {/* Decision */}
              <div className={`p-8 rounded-xl text-center ${
                checklist.overallStatus === 'APPROVED'
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : checklist.overallStatus === 'WARNING'
                  ? 'bg-yellow-100 dark:bg-yellow-900/20'
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  Decision: {checklist.overallStatus}
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {checklist.overallStatus === 'APPROVED' ? (
                    'Approved for production deployment.'
                  ) : checklist.overallStatus === 'WARNING' ? (
                    'Review warnings before deploying to production.'
                  ) : (
                    'Resolve critical blockers before deploying to production.'
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HealthDashboard;
