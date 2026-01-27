/**
 * Status Helper Functions
 * Utility functions for status colors and icons
 */

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, AlertCircle } from 'lucide-react';
import type { HealthStatus } from '../types';

/**
 * Get status color classes
 */
export const getStatusColor = (status: HealthStatus): string => {
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
 * Get status icon component
 */
export const getStatusIcon = (status: HealthStatus): React.ReactElement => {
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

/**
 * Get border color classes for cards
 */
export const getCardBorderColor = (status: 'pass' | 'warning' | 'fail' | HealthStatus): string => {
  switch (status) {
    case 'pass':
    case 'healthy':
      return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10';
    case 'warning':
    case 'degraded':
      return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10';
    case 'fail':
    case 'down':
      return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10';
    default:
      return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
  }
};

/**
 * Get status badge classes
 */
export const getStatusBadgeColor = (status: 'pass' | 'warning' | 'fail'): string => {
  switch (status) {
    case 'pass':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
    case 'fail':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
  }
};
