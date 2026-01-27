/**
 * Infrastructure Tab Component
 * Docker infrastructure status display
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, AlertTriangle, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import type { ContainerHealth } from '../types';
import {
  getCategorySummary,
  getCriticalIssues,
} from '@/services/dockerHealthCheck';

interface InfrastructureTabProps {
  containers: ContainerHealth[];
}

export const InfrastructureTab: React.FC<InfrastructureTabProps> = ({ containers }) => {
  const categorySummary = getCategorySummary(containers);
  const criticalIssues = getCriticalIssues(containers);

  return (
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
        <CategoryCard
          icon={<Activity className="w-6 h-6 text-purple-600" />}
          title="IVOR Services"
          running={categorySummary.ivor.running}
          total={categorySummary.ivor.total}
          critical={categorySummary.ivor.critical}
        />

        <CategoryCard
          icon={<Server className="w-6 h-6 text-blue-600" />}
          title="Coolify Platform"
          running={categorySummary.coolify.running}
          total={categorySummary.coolify.total}
        />

        <CriticalAlertsCard issues={criticalIssues} />
      </div>

      {/* Container List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Container Details
        </h3>

        {/* IVOR Microservices */}
        <ContainerSection
          title="IVOR Microservices (Voice Chatbot Foundation)"
          icon={<Activity className="w-5 h-5" />}
          iconColor="text-purple-600 dark:text-purple-400"
          containers={containers.filter(c => c.category === 'ivor')}
        />

        {/* Coolify Platform */}
        <ContainerSection
          title="Coolify Platform Management"
          icon={<Server className="w-5 h-5" />}
          iconColor="text-blue-600 dark:text-blue-400"
          containers={containers.filter(c => c.category === 'coolify')}
        />

        {/* Future Infrastructure Note */}
        <FutureInfrastructureNote />
      </div>
    </motion.div>
  );
};

// Category Card Component
interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  running: number;
  total: number;
  critical?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, running, total, critical }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Running</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {running}/{total}
        </span>
      </div>
      {critical !== undefined && (
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Critical</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {critical} services
          </span>
        </div>
      )}
      {running === total ? (
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
);

// Critical Alerts Card Component
interface CriticalAlertsCardProps {
  issues: string[];
}

const CriticalAlertsCard: React.FC<CriticalAlertsCardProps> = ({ issues }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
    <div className="flex items-center gap-3 mb-4">
      <AlertTriangle className="w-6 h-6 text-orange-600" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Critical Alerts
      </h3>
    </div>
    {issues.length > 0 ? (
      <div className="space-y-2">
        {issues.map((issue, idx) => (
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
);

// Container Section Component
interface ContainerSectionProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  containers: ContainerHealth[];
}

const ContainerSection: React.FC<ContainerSectionProps> = ({
  title,
  icon,
  iconColor,
  containers
}) => (
  <div className="mb-6">
    <h4 className={`text-lg font-semibold ${iconColor} mb-3 flex items-center gap-2`}>
      {icon}
      {title}
    </h4>
    <div className="grid grid-cols-1 gap-3">
      {containers.map((container) => (
        <ContainerCard key={container.container} container={container} />
      ))}
    </div>
  </div>
);

// Container Card Component
interface ContainerCardProps {
  container: ContainerHealth;
}

const ContainerCard: React.FC<ContainerCardProps> = ({ container }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
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
);

// Future Infrastructure Note Component
const FutureInfrastructureNote: React.FC = () => (
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
);

export default InfrastructureTab;
