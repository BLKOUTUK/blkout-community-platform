/**
 * BLKOUT Unified Command Center - Platform Health Dashboard
 * Modularized version with tab-based architecture
 *
 * Structure:
 * - tabs/OverviewTab.tsx - Service health overview
 * - tabs/RoutesTab.tsx - Critical route validation
 * - tabs/DatabaseTab.tsx - Database health & integrity
 * - tabs/InfrastructureTab.tsx - Docker infrastructure
 * - tabs/ChecklistTab.tsx - Pre-promotion checklist
 * - utils/statusHelpers.tsx - Status color/icon utilities
 * - types.ts - Type definitions
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Activity, RefreshCw, Download, Clock } from 'lucide-react';
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
import { checkAllContainers, type ContainerHealth } from '@/services/dockerHealthCheck';

// Import modular tab components
import { OverviewTab, RoutesTab, DatabaseTab, InfrastructureTab, ChecklistTab } from './tabs';
import { getStatusColor, getStatusIcon } from './utils/statusHelpers';
import { generateTroubleshootingReport } from './utils/reportGenerator';
import type { Tab } from './types';

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
      const interval = setInterval(performHealthCheck, 120000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  /**
   * Export health report as markdown
   */
  const exportMarkdown = () => {
    if (!checklist) return;
    const markdown = formatChecklistAsMarkdown(checklist);
    downloadFile(markdown, 'text/markdown', `blkout-health-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.md`);
  };

  /**
   * Export health report as JSON
   */
  const exportJSON = () => {
    if (!checklist) return;
    const json = exportChecklistAsJSON(checklist);
    downloadFile(json, 'application/json', `blkout-health-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`);
  };

  /**
   * Export comprehensive troubleshooting report
   */
  const exportTroubleshooting = () => {
    const report = generateTroubleshootingReport(services, database, routes, checklist, overallStatus);
    downloadFile(report, 'text/markdown', `blkout-troubleshooting-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.md`);
  };

  const downloadFile = (content: string, type: string, filename: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
          <ActionBar
            isLoading={isLoading}
            autoRefresh={autoRefresh}
            lastCheck={lastCheck}
            onRefresh={performHealthCheck}
            onAutoRefreshChange={setAutoRefresh}
            onExportMarkdown={exportMarkdown}
            onExportJSON={exportJSON}
            onExportTroubleshooting={exportTroubleshooting}
          />
        </div>
      </header>

      {/* Stats Bar */}
      <StatsBar
        services={services}
        avgResponseTime={avgResponseTime}
        database={database}
        dbSummary={dbSummary}
      />

      {/* Tabs */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <OverviewTab services={services} />}
          {activeTab === 'routes' && <RoutesTab routes={routes} />}
          {activeTab === 'database' && <DatabaseTab database={database} />}
          {activeTab === 'infrastructure' && <InfrastructureTab containers={containers} />}
          {activeTab === 'checklist' && <ChecklistTab checklist={checklist} />}
        </AnimatePresence>
      </main>
    </div>
  );
};

// Action Bar Component
interface ActionBarProps {
  isLoading: boolean;
  autoRefresh: boolean;
  lastCheck: Date | null;
  onRefresh: () => void;
  onAutoRefreshChange: (value: boolean) => void;
  onExportMarkdown: () => void;
  onExportJSON: () => void;
  onExportTroubleshooting: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  isLoading,
  autoRefresh,
  lastCheck,
  onRefresh,
  onAutoRefreshChange,
  onExportMarkdown,
  onExportJSON,
  onExportTroubleshooting,
}) => (
  <div className="flex items-center gap-4 mt-4">
    <button
      onClick={onRefresh}
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
        onChange={(e) => onAutoRefreshChange(e.target.checked)}
        className="rounded"
      />
      Auto-refresh (2 min)
    </label>

    <div className="flex-1" />

    <button
      onClick={onExportMarkdown}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
    >
      <Download className="w-4 h-4" />
      Export MD
    </button>

    <button
      onClick={onExportJSON}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
    >
      <Download className="w-4 h-4" />
      Export JSON
    </button>

    <button
      onClick={onExportTroubleshooting}
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
);

// Stats Bar Component
interface StatsBarProps {
  services: ServiceHealth[];
  avgResponseTime: number;
  database: DatabaseHealth | null;
  dbSummary: { status: string; message: string } | null;
}

const StatsBar: React.FC<StatsBarProps> = ({ services, avgResponseTime, database, dbSummary }) => (
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
);

// Tab Navigation Component
interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => (
  <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex gap-1">
        {(['overview', 'routes', 'database', 'infrastructure', 'checklist'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
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
);

export default HealthDashboard;
