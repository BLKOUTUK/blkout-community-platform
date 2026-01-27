/**
 * Routes Tab Component
 * Critical route validation display
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { RouteCheck } from '../types';
import { getCardBorderColor, getStatusBadgeColor } from '../utils/statusHelpers';

interface RoutesTabProps {
  routes: RouteCheck[];
}

export const RoutesTab: React.FC<RoutesTabProps> = ({ routes }) => {
  return (
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
          <RouteCard key={route.route} route={route} />
        ))}
      </div>
    </motion.div>
  );
};

// Route Card Component
interface RouteCardProps {
  route: RouteCheck;
}

const RouteCard: React.FC<RouteCardProps> = ({ route }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className={`p-6 rounded-xl border-2 ${getCardBorderColor(route.status)}`}
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
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(route.status)}`}>
          {route.status.toUpperCase()}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      {route.validations.map((validation, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
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
);

export default RoutesTab;
