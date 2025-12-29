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

type Tab = 'overview' | 'routes' | 'database' | 'checklist';

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
  const [checklist, setChecklist] = useState<PromotionChecklist | null>(null);

  /**
   * Perform comprehensive health check
   */
  const performHealthCheck = async () => {
    setIsLoading(true);

    try {
      // Run all health checks in parallel
      const [servicesData, databaseData, routesData] = await Promise.all([
        checkAllServices(),
        checkDatabaseHealth(),
        checkAllRoutes(),
      ]);

      setServices(servicesData);
      setDatabase(databaseData);
      setRoutes(routesData);

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
            {(['overview', 'routes', 'database', 'checklist'] as Tab[]).map((tab) => (
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
