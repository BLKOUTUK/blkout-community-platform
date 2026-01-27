/**
 * Overview Tab Component
 * Displays admin dashboard statistics and quick actions
 */

import React from 'react';
import { Eye, CheckCircle, Calendar, Users, FileText, Settings, Plus, Chrome } from 'lucide-react';
import { AdminStats } from '../types';

interface OverviewTabProps {
  stats: AdminStats;
  onNavigateToTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats, onNavigateToTab }) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stories Section */}
        <StatCard
          label="Pending Stories"
          value={stats.pendingStories}
          icon={Eye}
          iconColor="text-yellow-400"
        />

        <StatCard
          label="Stories Approved Today"
          value={stats.approvedToday}
          icon={CheckCircle}
          iconColor="text-green-400"
        />

        {/* Events Section */}
        <StatCard
          label="Pending Events"
          value={stats.pendingEvents || 0}
          icon={Calendar}
          iconColor="text-orange-400"
        />

        <StatCard
          label="Events Approved Today"
          value={stats.eventsApprovedToday || 0}
          icon={CheckCircle}
          iconColor="text-green-400"
        />

        {/* Community Stats */}
        <StatCard
          label="Total Curators"
          value={stats.totalCurators}
          icon={Users}
          iconColor="text-blue-400"
        />

        <StatCard
          label="Event Organizers"
          value={stats.totalEventOrganizers || 0}
          icon={Users}
          iconColor="text-purple-400"
        />

        <StatCard
          label="Weekly Story Submissions"
          value={stats.weeklySubmissions}
          icon={FileText}
          iconColor="text-cyan-400"
        />

        <StatCard
          label="Weekly Event Submissions"
          value={stats.weeklyEventSubmissions || 0}
          icon={Calendar}
          iconColor="text-pink-400"
        />

        {/* System Status Card */}
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-lg p-6 border border-green-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Backend API</p>
              <p className="text-lg font-bold text-white">Railway v1.1.0</p>
              <p className="text-xs text-green-400">✅ Chrome Extension Ready</p>
            </div>
            <div className="text-green-400">
              <Settings className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            icon={Eye}
            iconColor="text-yellow-400"
            bgColor="bg-yellow-500/20 hover:bg-yellow-500/30"
            title="Story Review"
            subtitle={`${stats.pendingStories} pending stories`}
            onClick={() => onNavigateToTab('moderation')}
          />

          <QuickActionButton
            icon={Plus}
            iconColor="text-green-400"
            bgColor="bg-green-500/20 hover:bg-green-500/30"
            title="Add Content"
            subtitle="Stories & events"
            onClick={() => onNavigateToTab('submissions')}
          />

          <QuickActionButton
            icon={Chrome}
            iconColor="text-blue-400"
            bgColor="bg-blue-500/20 hover:bg-blue-500/30"
            title="Extension Setup"
            subtitle="Download & configure"
            onClick={() => onNavigateToTab('extension')}
          />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, iconColor }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-300 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <Icon className={`w-8 h-8 ${iconColor}`} />
    </div>
  </div>
);

// Quick Action Button Component
interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  iconColor,
  bgColor,
  title,
  subtitle,
  onClick
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-4 ${bgColor} rounded-lg transition-colors text-left`}
  >
    <Icon className={`w-6 h-6 ${iconColor}`} />
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-300">{subtitle}</p>
    </div>
  </button>
);

export default OverviewTab;
