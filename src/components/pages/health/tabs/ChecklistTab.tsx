/**
 * Checklist Tab Component
 * Pre-promotion validation checklist display
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import type { PromotionChecklist } from '../types';

interface ChecklistTabProps {
  checklist: PromotionChecklist | null;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({ checklist }) => {
  if (!checklist) return null;

  return (
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

        <StatusBadge status={checklist.overallStatus} />
      </div>

      {/* Summary Stats */}
      <SummaryStats summary={checklist.summary} />

      {/* Blockers */}
      {checklist.blockers.length > 0 && (
        <AlertSection
          type="error"
          title="Critical Blockers"
          icon={<XCircle className="w-5 h-5" />}
          items={checklist.blockers}
        />
      )}

      {/* Warnings */}
      {checklist.warnings.length > 0 && (
        <AlertSection
          type="warning"
          title="Warnings"
          icon={<AlertTriangle className="w-5 h-5" />}
          items={checklist.warnings}
        />
      )}

      {/* Checklist Items by Category */}
      {[...new Set(checklist.items.map(i => i.category))].map((category) => (
        <CategorySection
          key={category}
          category={category}
          items={checklist.items.filter(item => item.category === category)}
        />
      ))}

      {/* Decision */}
      <DecisionBanner status={checklist.overallStatus} />
    </motion.div>
  );
};

// Status Badge Component
interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <div className={`px-6 py-3 rounded-lg font-bold text-lg ${
    status === 'APPROVED'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
      : status === 'WARNING'
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
  }`}>
    {status}
  </div>
);

// Summary Stats Component
interface SummaryStatsProps {
  summary: {
    passed: number;
    failed: number;
    skipped: number;
    total: number;
  };
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ summary }) => (
  <div className="grid grid-cols-3 gap-6 mb-8">
    <div className="p-6 rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Passed</div>
      <div className="text-3xl font-bold text-green-600">
        {summary.passed}/{summary.total}
      </div>
    </div>

    <div className="p-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Failed</div>
      <div className="text-3xl font-bold text-red-600">
        {summary.failed}/{summary.total}
      </div>
    </div>

    <div className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skipped</div>
      <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
        {summary.skipped}/{summary.total}
      </div>
    </div>
  </div>
);

// Alert Section Component
interface AlertSectionProps {
  type: 'error' | 'warning';
  title: string;
  icon: React.ReactNode;
  items: string[];
}

const AlertSection: React.FC<AlertSectionProps> = ({ type, title, icon, items }) => {
  const colors = type === 'error'
    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200'
    : 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200';

  const textColor = type === 'error'
    ? 'text-red-700 dark:text-red-300'
    : 'text-yellow-700 dark:text-yellow-300';

  return (
    <div className={`mb-6 p-6 rounded-xl border-2 ${colors}`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`text-sm ${textColor}`}>
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Category Section Component
interface ChecklistItem {
  item: string;
  status: 'pass' | 'fail' | 'skip';
  category: string;
  required: boolean;
  details?: string;
}

interface CategorySectionProps {
  category: string;
  items: ChecklistItem[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, items }) => (
  <div className="mb-6 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
      {category}
    </h3>

    <div className="space-y-3">
      {items.map((item, i) => (
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
);

// Decision Banner Component
interface DecisionBannerProps {
  status: string;
}

const DecisionBanner: React.FC<DecisionBannerProps> = ({ status }) => (
  <div className={`p-8 rounded-xl text-center ${
    status === 'APPROVED'
      ? 'bg-green-100 dark:bg-green-900/20'
      : status === 'WARNING'
      ? 'bg-yellow-100 dark:bg-yellow-900/20'
      : 'bg-red-100 dark:bg-red-900/20'
  }`}>
    <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
      Decision: {status}
    </div>
    <p className="text-gray-700 dark:text-gray-300">
      {status === 'APPROVED' ? (
        'Approved for production deployment.'
      ) : status === 'WARNING' ? (
        'Review warnings before deploying to production.'
      ) : (
        'Resolve critical blockers before deploying to production.'
      )}
    </p>
  </div>
);

export default ChecklistTab;
