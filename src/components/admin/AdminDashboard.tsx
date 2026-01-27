/**
 * BLKOUT Liberation Platform - Admin Dashboard
 * Modularized version with tab-based navigation
 *
 * Structure:
 * - tabs/OverviewTab.tsx - Statistics and quick actions
 * - tabs/ModerationTab.tsx - Story moderation queue
 * - tabs/SubmissionsTab.tsx - Story submission forms
 * - tabs/ExtensionTab.tsx - Chrome extension management
 * - submissions/ - Submission form components
 * - utils/ - Utility functions
 * - types.ts - Shared type definitions
 */

import React, { useState, useEffect } from 'react';
import { Shield, Eye, Plus, Settings, UserCheck, BarChart3, Globe } from 'lucide-react';
import { communityAPI } from '@/services/community-api';
import { liberationDB } from '@/lib/supabase';
import { IVORFeedbackCollection } from './IVORFeedbackCollection';

// Import modular tab components
import { OverviewTab } from './tabs/OverviewTab';
import { ModerationTab } from './tabs/ModerationTab';
import { SubmissionsTab } from './tabs/SubmissionsTab';
import { ExtensionTab } from './tabs/ExtensionTab';

// Import types
import type { AdminStats, ModerationItem, TabDefinition } from './types';

// Tab configuration
const tabs: TabDefinition[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'moderation', label: 'Story Moderation', icon: Eye },
  { id: 'submissions', label: 'Story Submissions', icon: Plus },
  { id: 'extension', label: 'Chrome Extension', icon: Globe },
  { id: 'ivor', label: 'IVOR Training', icon: Settings },
];

export const AdminDashboard: React.FC = () => {
  // NO AUTH - Admin is always accessible
  const user = { email: 'admin@blkout.uk', role: 'admin', name: 'Admin' };

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    pendingStories: 0,
    approvedToday: 0,
    totalCurators: 0,
    weeklySubmissions: 0,
    pendingEvents: 0,
    eventsApprovedToday: 0,
    totalEventOrganizers: 0,
    weeklyEventSubmissions: 0
  });
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [queueData, statsData] = await Promise.all([
        communityAPI.getModerationQueue(),
        liberationDB.getAdminStats()
      ]);

      setModerationQueue(queueData);

      // Merge stats with defaults to handle missing properties
      setStats(prevStats => ({
        ...prevStats,
        ...(statsData as Partial<AdminStats>)
      }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStory = async (storyId: string) => {
    try {
      await communityAPI.approveStoryForNewsroom(storyId);
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to approve story:', error);
    }
  };

  const handleRejectStory = async (storyId: string) => {
    try {
      await communityAPI.rejectStory(storyId);
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to reject story:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900">
      {/* Header */}
      <AdminHeader user={user} />

      {/* Navigation Tabs */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            stats={stats}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'moderation' && (
          <ModerationTab
            moderationQueue={moderationQueue}
            loading={loading}
            onRefresh={loadDashboardData}
            onApprove={handleApproveStory}
            onReject={handleRejectStory}
          />
        )}

        {activeTab === 'submissions' && (
          <SubmissionsTab onSubmit={loadDashboardData} />
        )}

        {activeTab === 'extension' && (
          <ExtensionTab />
        )}

        {activeTab === 'ivor' && (
          <IVORFeedbackCollection />
        )}
      </div>
    </div>
  );
};

// Admin Header Component
interface AdminHeaderProps {
  user: { email: string; role: string; name: string };
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user }) => (
  <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-green-400">
            <UserCheck className="w-5 h-5" />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <button
            onClick={() => console.log('No auth - logout not needed')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Admin Mode
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Tab Navigation Component
interface TabNavigationProps {
  tabs: TabDefinition[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => (
  <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  </div>
);

export default AdminDashboard;
