/**
 * Pipeline Notification Component
 * Toast-style notification that appears when pipeline checks fail
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Bell, CheckCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { PipelineCheck, PipelineCheckStatus } from '../types';

interface PipelineNotificationProps {
  checks: PipelineCheck[];
  onDismiss?: () => void;
  onViewDetails?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const DISMISSED_KEY = 'blkout-pipeline-notification-dismissed';

/**
 * Get a unique key for the current set of failing checks
 * Used to track dismissed notifications per session
 */
function getFailingChecksKey(checks: PipelineCheck[]): string {
  const failingIds = checks
    .filter(c => c.status === 'failing' || c.status === 'warning')
    .map(c => c.id)
    .sort()
    .join(',');
  return failingIds;
}

/**
 * Check if a notification has been dismissed for the current failing checks
 */
function isDismissed(checks: PipelineCheck[]): boolean {
  if (typeof window === 'undefined') return false;
  const dismissedKey = sessionStorage.getItem(DISMISSED_KEY);
  if (!dismissedKey) return false;
  return dismissedKey === getFailingChecksKey(checks);
}

/**
 * Mark the current failing checks as dismissed
 */
function setDismissed(checks: PipelineCheck[]): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(DISMISSED_KEY, getFailingChecksKey(checks));
}

const PipelineNotification: React.FC<PipelineNotificationProps> = ({
  checks,
  onDismiss,
  onViewDetails,
  autoHide = false,
  autoHideDelay = 10000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasRequestedNotificationPermission, setHasRequestedNotificationPermission] = useState(false);

  const failingChecks = checks.filter(c => c.status === 'failing');
  const warningChecks = checks.filter(c => c.status === 'warning');
  const hasIssues = failingChecks.length > 0 || warningChecks.length > 0;

  // Check if we should show the notification
  useEffect(() => {
    if (!hasIssues) {
      setIsVisible(false);
      return;
    }

    // Don't show if already dismissed for these checks
    if (isDismissed(checks)) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Auto-hide if enabled
    if (autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [checks, hasIssues, autoHide, autoHideDelay]);

  // Request browser notification permission (optional)
  const requestNotificationPermission = useCallback(async () => {
    if (hasRequestedNotificationPermission) return;
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    setHasRequestedNotificationPermission(true);

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, [hasRequestedNotificationPermission]);

  // Send browser notification for critical failures
  useEffect(() => {
    if (failingChecks.length > 0 && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Pipeline Check Failed', {
          body: `${failingChecks.length} pipeline check${failingChecks.length > 1 ? 's' : ''} failing`,
          icon: '/favicon.ico',
          tag: 'pipeline-notification'
        });
      }
    }
  }, [failingChecks.length]);

  const handleDismiss = useCallback(() => {
    setDismissed(checks);
    setIsVisible(false);
    onDismiss?.();
  }, [checks, onDismiss]);

  const handleViewDetails = useCallback(() => {
    handleDismiss();
    onViewDetails?.();
  }, [handleDismiss, onViewDetails]);

  if (!isVisible) return null;

  const statusColor = failingChecks.length > 0
    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
    : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';

  const iconColor = failingChecks.length > 0
    ? 'text-red-500'
    : 'text-yellow-500';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-24 right-6 z-50 w-80 rounded-lg border shadow-lg ${statusColor}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${failingChecks.length > 0 ? 'bg-red-100 dark:bg-red-900/40' : 'bg-yellow-100 dark:bg-yellow-900/40'}`}>
              <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Pipeline Issues
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {failingChecks.length > 0 && (
                  <span className="text-red-600 dark:text-red-400">
                    {failingChecks.length} failing
                  </span>
                )}
                {failingChecks.length > 0 && warningChecks.length > 0 && ', '}
                {warningChecks.length > 0 && (
                  <span className="text-yellow-600 dark:text-yellow-400">
                    {warningChecks.length} warning{warningChecks.length > 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Expandable Details */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span>
              {isExpanded ? 'Hide details' : 'Show details'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 space-y-2 max-h-48 overflow-y-auto">
                  {/* Failing checks */}
                  {failingChecks.map(check => (
                    <div
                      key={check.id}
                      className="flex items-start gap-2 text-sm"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {check.name}
                        </span>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {check.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Warning checks */}
                  {warningChecks.map(check => (
                    <div
                      key={check.id}
                      className="flex items-start gap-2 text-sm"
                    >
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {check.name}
                        </span>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {check.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between gap-2">
          {/* Enable browser notifications button */}
          {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default' && (
            <button
              onClick={requestNotificationPermission}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Bell className="w-3 h-3" />
              Enable alerts
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
          >
            View Details
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PipelineNotification;
