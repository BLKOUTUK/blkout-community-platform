/**
 * Pipeline Tab Component
 * Displays pipeline health checks for campaigns
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  AlertCircle,
  Play,
  Loader2,
  Clock,
  Filter
} from 'lucide-react';
import type { PipelineCheck, PipelineCheckStatus } from '../types';

interface PipelineTabProps {
  checks: PipelineCheck[];
  isRunning: boolean;
  onRunChecks: () => void;
}

/**
 * Get check card color classes based on status
 */
const getCheckColor = (status: PipelineCheckStatus): string => {
  switch (status) {
    case 'passing':
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/10';
    case 'failing':
      return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10';
    default:
      return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
  }
};

/**
 * Get status badge color classes
 */
const getStatusBadgeColor = (status: PipelineCheckStatus): string => {
  switch (status) {
    case 'passing':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
    case 'failing':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
  }
};

/**
 * Get status icon component
 */
const getStatusIcon = (status: PipelineCheckStatus): React.ReactElement => {
  const iconClass = 'w-5 h-5';
  switch (status) {
    case 'passing':
      return <CheckCircle className={`${iconClass} text-green-600`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
    case 'failing':
      return <XCircle className={`${iconClass} text-red-600`} />;
    default:
      return <AlertCircle className={`${iconClass} text-gray-400`} />;
  }
};

/**
 * Get overall status based on checks
 */
const getOverallStatus = (checks: PipelineCheck[]): 'passing' | 'warning' | 'failing' => {
  if (checks.some(c => c.status === 'failing')) return 'failing';
  if (checks.some(c => c.status === 'warning')) return 'warning';
  return 'passing';
};

/**
 * Format date for display
 */
const formatTimestamp = (date: Date): string => {
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const PipelineTab: React.FC<PipelineTabProps> = ({
  checks,
  isRunning,
  onRunChecks
}) => {
  const [groupByCampaign, setGroupByCampaign] = useState(false);

  // Calculate summary stats
  const summary = useMemo(() => {
    const passing = checks.filter(c => c.status === 'passing').length;
    const warning = checks.filter(c => c.status === 'warning').length;
    const failing = checks.filter(c => c.status === 'failing').length;
    const unknown = checks.filter(c => c.status === 'unknown').length;
    return { passing, warning, failing, unknown, total: checks.length };
  }, [checks]);

  // Get most recent check timestamp
  const lastRun = useMemo(() => {
    if (checks.length === 0) return null;
    const timestamps = checks.map(c => new Date(c.lastChecked).getTime());
    return new Date(Math.max(...timestamps));
  }, [checks]);

  // Overall status
  const overallStatus = useMemo(() => getOverallStatus(checks), [checks]);

  // Group checks by campaign if enabled
  const groupedChecks = useMemo(() => {
    if (!groupByCampaign) return { 'All Checks': checks };

    const groups: Record<string, PipelineCheck[]> = {};
    checks.forEach(check => {
      const key = check.campaignId || 'Global';
      if (!groups[key]) groups[key] = [];
      groups[key].push(check);
    });
    return groups;
  }, [checks, groupByCampaign]);

  return (
    <motion.div
      key="pipeline"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Pipeline Health Checks
        </h2>

        <div className="flex items-center gap-4">
          {/* Group by campaign toggle */}
          <button
            onClick={() => setGroupByCampaign(!groupByCampaign)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
              groupByCampaign
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            Group by Campaign
          </button>

          {/* Run All Checks button */}
          <button
            onClick={onRunChecks}
            disabled={isRunning}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run All Checks
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className={`p-6 rounded-xl border-2 mb-6 ${
        overallStatus === 'passing'
          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10'
          : overallStatus === 'warning'
          ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/10'
          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getStatusIcon(overallStatus)}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Overall Status: {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
              </h3>
              {lastRun && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" />
                  Last run: {formatTimestamp(lastRun)}
                </p>
              )}
            </div>
          </div>

          {/* Status counts */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.passing}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Passing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.warning}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Warning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.failing}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Failing</div>
            </div>
            {summary.unknown > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{summary.unknown}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Unknown</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Check Cards */}
      {Object.entries(groupedChecks).map(([groupName, groupChecks]) => (
        <div key={groupName} className="mb-8">
          {groupByCampaign && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {groupName}
            </h3>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupChecks.map((check) => (
              <CheckCard key={check.id} check={check} />
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {checks.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No Pipeline Checks
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Run checks to see pipeline health status.
          </p>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Individual Check Card Component
 */
interface CheckCardProps {
  check: PipelineCheck;
}

const CheckCard: React.FC<CheckCardProps> = ({ check }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl border-2 ${getCheckColor(check.status)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(check.status)}
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {check.name}
          </h4>
        </div>

        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(check.status)}`}>
          {check.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {check.description}
      </p>

      {check.details && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 italic">
          {check.details}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatTimestamp(check.lastChecked)}
        </span>

        {check.campaignId && (
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            {check.campaignId}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default PipelineTab;
