/**
 * Database Tab Component
 * Database health and integrity display
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { DatabaseHealth } from '../types';
import { getDatabaseHealthSummary } from '@/services/databaseHealthCheck';

interface DatabaseTabProps {
  database: DatabaseHealth | null;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ database }) => {
  if (!database) return null;

  const dbSummary = getDatabaseHealthSummary(database);

  return (
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
        <StatusCard
          icon={<Database className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
          title="Connection Status"
          value={database.connected ? 'Connected' : 'Disconnected'}
          valueColor={database.connected ? 'text-green-600' : 'text-red-600'}
          description={dbSummary?.message}
          isHealthy={database.connected}
        />

        {/* Article Counts */}
        <StatusCard
          icon={<FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
          title="Legacy Articles (Joseph Beam)"
          value={`${database.legacyArticlesCount}/281`}
          description={database.legacyArticlesCount === 281
            ? 'All articles present'
            : `Missing ${281 - database.legacyArticlesCount} articles`}
          isHealthy={database.legacyArticlesCount === 281}
        />

        {/* News Articles */}
        <CountCard
          icon={<FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
          title="News Articles"
          value={database.newsArticlesCount}
          description="Published articles"
        />

        {/* Events */}
        <CountCard
          icon={<FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
          title="Events"
          value={database.eventsCount}
          description={`${database.moderationQueueCount} in moderation queue`}
        />
      </div>

      {/* Data Integrity Checks */}
      <IntegrityChecks database={database} />

      {/* Database Errors */}
      {database.errors.length > 0 && (
        <ErrorList errors={database.errors} />
      )}
    </motion.div>
  );
};

// Status Card Component
interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  valueColor?: string;
  description?: string;
  isHealthy: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  title,
  value,
  valueColor,
  description,
  isHealthy
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-xl border-2 ${
      isHealthy
        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
    }`}
  >
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
    </div>
    <div className={`text-3xl font-bold mb-2 ${valueColor || 'text-gray-900 dark:text-gray-100'}`}>
      {value}
    </div>
    {description && (
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    )}
  </motion.div>
);

// Count Card Component
interface CountCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
}

const CountCard: React.FC<CountCardProps> = ({ icon, title, value, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
  >
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
    </div>
    <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
      {value}
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {description}
    </p>
  </motion.div>
);

// Integrity Checks Component
interface IntegrityChecksProps {
  database: DatabaseHealth;
}

const IntegrityChecks: React.FC<IntegrityChecksProps> = ({ database }) => (
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
);

// Error List Component
interface ErrorListProps {
  errors: string[];
}

const ErrorList: React.FC<ErrorListProps> = ({ errors }) => (
  <div className="mt-6 p-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
    <h3 className="text-lg font-bold mb-4 text-red-800 dark:text-red-200">
      Database Errors
    </h3>
    <ul className="space-y-2">
      {errors.map((error, i) => (
        <li key={i} className="text-sm text-red-700 dark:text-red-300">
          • {error}
        </li>
      ))}
    </ul>
  </div>
);

export default DatabaseTab;
