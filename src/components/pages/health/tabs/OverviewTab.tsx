/**
 * Overview Tab Component
 * Service health overview grid
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Server, Globe } from 'lucide-react';
import type { ServiceHealth } from '../types';
import { getStatusIcon, getCardBorderColor } from '../utils/statusHelpers';

interface OverviewTabProps {
  services: ServiceHealth[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ services }) => {
  return (
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
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </motion.div>
  );
};

// Service Card Component
interface ServiceCardProps {
  service: ServiceHealth;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-xl border-2 ${getCardBorderColor(service.status)}`}
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
);

export default OverviewTab;
