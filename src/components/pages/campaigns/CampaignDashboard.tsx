/**
 * BLKOUT Campaign Content Dashboard
 * Unified view for campaign content tracking, scheduling, and pipeline health
 *
 * Structure:
 * - tabs/OverviewTab.tsx - 3-month calendar view
 * - tabs/ContentTab.tsx - Kanban content inventory
 * - tabs/ScheduleTab.tsx - Publication timeline
 * - tabs/PipelineTab.tsx - Health checks
 * - tabs/AutomationTab.tsx - Quick actions
 */

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  RefreshCw,
  Clock,
  FileText,
  CalendarDays,
  Activity,
  Zap,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

// Hooks
import { useCampaigns, useCampaignSummaries, usePipelineHealth } from './hooks/useCampaigns';

// Tabs
import { OverviewTab, ContentTab, ScheduleTab, PipelineTab, AutomationTab } from './tabs';

// Components
import PipelineNotification from './components/PipelineNotification';

// Types
import type { CampaignTab, PipelineCheck, PipelineCheckStatus } from './types';

// Status helpers (reuse from Health Dashboard)
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'passing':
    case 'active':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'warning':
    case 'draft':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'failing':
    case 'archived':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    case 'completed':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
};

const CampaignDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CampaignTab>('overview');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  // Callback for pipeline status changes
  const handlePipelineStatusChange = useCallback((
    newStatus: PipelineCheckStatus,
    failingChecks: PipelineCheck[]
  ) => {
    if (newStatus === 'failing' || newStatus === 'warning') {
      setShowNotification(true);
    }
  }, []);

  // Load campaigns
  const { campaigns, isLoading, error, refresh } = useCampaigns();
  const summaries = useCampaignSummaries(campaigns);
  const { checks, isRunning, lastRun, overallStatus, runChecks } = usePipelineHealth(
    campaigns,
    handlePipelineStatusChange
  );

  // Handle notification dismiss
  const handleNotificationDismiss = useCallback(() => {
    setShowNotification(false);
  }, []);

  // Handle view details from notification
  const handleViewPipelineDetails = useCallback(() => {
    setShowNotification(false);
    setActiveTab('pipeline');
  }, []);

  // Get totals across all campaigns
  const totalContent = campaigns.reduce((sum, c) => sum + c.contentItems.length, 0);
  const completedContent = campaigns.reduce(
    (sum, c) => sum + c.contentItems.filter(i => i.status === 'published' || i.status === 'scheduled').length,
    0
  );
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  const tabs: { id: CampaignTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Calendar className="w-4 h-4" /> },
    { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'pipeline', label: 'Pipeline', icon: <Activity className="w-4 h-4" /> },
    { id: 'automation', label: 'Automation', icon: <Zap className="w-4 h-4" /> }
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load campaigns</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Pipeline Notification */}
      {showNotification && (
        <PipelineNotification
          checks={checks}
          onDismiss={handleNotificationDismiss}
          onViewDetails={handleViewPipelineDetails}
          autoHide={false}
        />
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Campaign Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Content tracking and campaign management
                </p>
              </div>
            </div>

            {/* Pipeline Status Badge */}
            <div className={`flex items-center gap-3 px-6 py-3 rounded-lg ${getStatusColor(overallStatus)}`}>
              <Activity className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium">Pipeline Status</div>
                <div className="text-lg font-bold uppercase">{overallStatus}</div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => { refresh(); runChecks(); }}
              disabled={isLoading || isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading || isRunning ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <div className="flex-1" />

            {lastRun && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                Last check: {format(lastRun, 'HH:mm:ss')}
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
              <div className="text-sm text-gray-600 dark:text-gray-400">Campaigns</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activeCampaigns} active
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Content Items</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completedContent}/{totalContent}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pipeline Checks</div>
              <div className={`text-2xl font-bold ${
                checks.filter(c => c.status === 'passing').length === checks.length
                  ? 'text-green-600'
                  : 'text-yellow-600'
              }`}>
                {checks.filter(c => c.status === 'passing').length}/{checks.length} passing
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Quick Select */}
      {campaigns.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-4 overflow-x-auto">
              <button
                onClick={() => setSelectedCampaignId(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCampaignId === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                All Campaigns
              </button>
              {campaigns.map(campaign => (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCampaignId === campaign.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    campaign.status === 'active' ? 'bg-green-500' :
                    campaign.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  {campaign.name.split(':')[0]}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <OverviewTab
                  campaigns={selectedCampaignId
                    ? campaigns.filter(c => c.id === selectedCampaignId)
                    : campaigns}
                  summaries={summaries}
                />
              )}
              {activeTab === 'content' && (
                <ContentTab
                  campaigns={selectedCampaignId
                    ? campaigns.filter(c => c.id === selectedCampaignId)
                    : campaigns}
                />
              )}
              {activeTab === 'schedule' && (
                <ScheduleTab
                  campaigns={selectedCampaignId
                    ? campaigns.filter(c => c.id === selectedCampaignId)
                    : campaigns}
                />
              )}
              {activeTab === 'pipeline' && (
                <PipelineTab
                  checks={selectedCampaignId
                    ? checks.filter(c => c.campaignId === selectedCampaignId)
                    : checks}
                  isRunning={isRunning}
                  onRunChecks={runChecks}
                />
              )}
              {activeTab === 'automation' && (
                <AutomationTab
                  campaigns={selectedCampaignId
                    ? campaigns.filter(c => c.id === selectedCampaignId)
                    : campaigns}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default CampaignDashboard;
