/**
 * Campaign Overview Tab Component
 * Displays 3-month calendar overview with campaign summary cards and timeline
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import type { Campaign, Platform, ContentItem } from '../types';
import type { getCampaignSummary } from '../services/campaignLoader';
import { ContentThumbnail } from '../components/ContentThumbnail';

interface OverviewTabProps {
  campaigns: Campaign[];
  summaries: Array<{
    campaign: Campaign;
    summary: ReturnType<typeof getCampaignSummary>;
  }>;
}

type CampaignSummary = ReturnType<typeof getCampaignSummary>;

/**
 * Get status badge styling
 */
const getStatusBadge = (status: Campaign['status']): { color: string; label: string } => {
  switch (status) {
    case 'active':
      return {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
        label: 'Active'
      };
    case 'draft':
      return {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
        label: 'Draft'
      };
    case 'completed':
      return {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
        label: 'Completed'
      };
    case 'archived':
      return {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200',
        label: 'Archived'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200',
        label: 'Unknown'
      };
  }
};

/**
 * Get card border color based on status
 */
const getCardBorderColor = (status: Campaign['status']): string => {
  switch (status) {
    case 'active':
      return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10';
    case 'draft':
      return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10';
    case 'completed':
      return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10';
    case 'archived':
      return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
    default:
      return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
  }
};

/**
 * Get platform icon component
 */
const getPlatformIcon = (platform: Platform): React.ReactElement => {
  switch (platform) {
    case 'instagram':
      return <Instagram className="w-4 h-4" />;
    case 'twitter':
      return <Twitter className="w-4 h-4" />;
    case 'linkedin':
      return <Linkedin className="w-4 h-4" />;
    case 'email':
      return <Mail className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

/**
 * Format date range for display
 */
const formatDateRange = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-GB', options);
  const endStr = end.toLocaleDateString('en-GB', { ...options, year: 'numeric' });
  return `${startStr} - ${endStr}`;
};

/**
 * Get progress bar color based on percentage
 */
const getProgressColor = (percentage: number): string => {
  if (percentage >= 75) return 'bg-green-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};

// Campaign Summary Card Component
interface CampaignCardProps {
  campaign: Campaign;
  summary: CampaignSummary;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, summary }) => {
  const statusBadge = getStatusBadge(campaign.status);
  const platformCounts = summary.contentByPlatform;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl border-2 ${getCardBorderColor(campaign.status)}`}
    >
      {/* Header with name and status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">
            {campaign.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
            {campaign.tagline}
          </p>
        </div>
        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
          {statusBadge.label}
        </span>
      </div>

      {/* Date range */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <Calendar className="w-4 h-4" />
        <span>{formatDateRange(campaign.launchDate, campaign.endDate)}</span>
      </div>

      {/* Content completion progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Content Progress</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {summary.completionPercentage}%
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full transition-all duration-500 ${getProgressColor(summary.completionPercentage)}`}
            style={{ width: `${summary.completionPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
          <span>{summary.completedItems} of {summary.totalItems} items</span>
          <span>
            {campaign.status === 'active' ? (
              summary.isActive ? 'In Progress' : 'Upcoming'
            ) : (
              statusBadge.label
            )}
          </span>
        </div>
      </div>

      {/* Days remaining countdown */}
      {(campaign.status === 'active' || campaign.status === 'draft') && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {summary.daysRemaining > 0 ? (
              <>
                <span className="font-semibold">{summary.daysRemaining}</span> days remaining
              </>
            ) : (
              <span className="text-red-600 dark:text-red-400">Campaign ended</span>
            )}
          </span>
        </div>
      )}

      {/* Platform content counts */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        {Object.entries(platformCounts).map(([platform, count]) => (
          <div
            key={platform}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400"
            title={`${count} ${platform} items`}
          >
            {getPlatformIcon(platform as Platform)}
            <span className="text-xs font-medium">{count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Content Gallery Component - Shows larger thumbnails of featured content
interface ContentGalleryProps {
  campaigns: Campaign[];
  maxItems?: number;
}

const ContentGallery: React.FC<ContentGalleryProps> = ({ campaigns, maxItems = 8 }) => {
  // Get all content items, prioritizing scheduled and designed items
  const featuredContent = campaigns
    .flatMap(campaign =>
      campaign.contentItems.map(item => ({
        ...item,
        campaignName: campaign.name.split(':')[0]
      }))
    )
    .filter(item =>
      item.status === 'scheduled' ||
      item.status === 'designed' ||
      item.status === 'approved' ||
      item.type === 'video' ||
      item.type === 'graphic'
    )
    .slice(0, maxItems);

  if (featuredContent.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-8 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
        Content Preview Gallery
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {featuredContent.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-2">
            <ContentThumbnail
              item={item as ContentItem}
              size="md"
              showPreview={true}
            />
            <div className="text-center w-full">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                {item.title.length > 20 ? `${item.title.slice(0, 20)}...` : item.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.campaignName}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Click thumbnails to preview content • Showing {featuredContent.length} featured items
      </p>
    </motion.div>
  );
};

// Timeline Component
interface TimelineProps {
  campaigns: Campaign[];
}

const CampaignTimeline: React.FC<TimelineProps> = ({ campaigns }) => {
  // Calculate 3-month window
  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  // Generate month labels
  const months: Date[] = [];
  for (let i = 0; i < 3; i++) {
    months.push(new Date(now.getFullYear(), now.getMonth() - 1 + i, 1));
  }

  // Calculate campaign bar positions
  const totalDays = Math.ceil((endMonth.getTime() - startMonth.getTime()) / (1000 * 60 * 60 * 24));

  const getCampaignBar = (campaign: Campaign) => {
    const campaignStart = Math.max(campaign.launchDate.getTime(), startMonth.getTime());
    const campaignEnd = Math.min(campaign.endDate.getTime(), endMonth.getTime());

    if (campaignEnd < startMonth.getTime() || campaignStart > endMonth.getTime()) {
      return null; // Campaign outside visible window
    }

    const startOffset = Math.max(0, (campaignStart - startMonth.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((campaignEnd - campaignStart) / (1000 * 60 * 60 * 24));

    const leftPercent = (startOffset / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 2)}%`
    };
  };

  const getBarColor = (status: Campaign['status']): string => {
    switch (status) {
      case 'active':
        return 'bg-green-500 dark:bg-green-600';
      case 'draft':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'completed':
        return 'bg-blue-500 dark:bg-blue-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
        Campaign Timeline
      </h3>

      {/* Month headers */}
      <div className="grid grid-cols-3 gap-1 mb-4">
        {months.map((month, idx) => (
          <div
            key={idx}
            className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2 border-b border-gray-200 dark:border-gray-700"
          >
            {month.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </div>
        ))}
      </div>

      {/* Campaign bars */}
      <div className="space-y-3 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
          {months.map((_, idx) => (
            <div
              key={idx}
              className={`border-r border-gray-200 dark:border-gray-700 ${idx === 2 ? 'border-r-0' : ''}`}
            />
          ))}
        </div>

        {/* Today marker */}
        {(() => {
          const todayOffset = (now.getTime() - startMonth.getTime()) / (1000 * 60 * 60 * 24);
          const todayPercent = (todayOffset / totalDays) * 100;
          if (todayPercent >= 0 && todayPercent <= 100) {
            return (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-purple-500 dark:bg-purple-400 z-10"
                style={{ left: `${todayPercent}%` }}
                title="Today"
              />
            );
          }
          return null;
        })()}

        {campaigns.map((campaign) => {
          const barStyle = getCampaignBar(campaign);
          if (!barStyle) return null;

          return (
            <div key={campaign.id} className="relative h-8">
              <div
                className={`absolute h-6 rounded-full ${getBarColor(campaign.status)} flex items-center px-2 shadow-sm`}
                style={{
                  left: barStyle.left,
                  width: barStyle.width,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
                title={`${campaign.name}: ${formatDateRange(campaign.launchDate, campaign.endDate)}`}
              >
                <span className="text-xs text-white font-medium truncate">
                  {campaign.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-0.5 h-4 bg-purple-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Overview Tab Main Component
 */
export const OverviewTab: React.FC<OverviewTabProps> = ({ campaigns, summaries }) => {
  // Sort summaries: active first, then by launch date
  const sortedSummaries = [...summaries].sort((a, b) => {
    // Active campaigns first
    if (a.campaign.status === 'active' && b.campaign.status !== 'active') return -1;
    if (a.campaign.status !== 'active' && b.campaign.status === 'active') return 1;
    // Then by launch date (soonest first)
    return a.campaign.launchDate.getTime() - b.campaign.launchDate.getTime();
  });

  if (campaigns.length === 0) {
    return (
      <motion.div
        key="overview-empty"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center py-12"
      >
        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No Campaigns Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Campaign data will appear here once loaded.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Campaign Overview
      </h2>

      {/* Campaign Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sortedSummaries.map(({ campaign, summary }) => (
          <CampaignCard key={campaign.id} campaign={campaign} summary={summary} />
        ))}
      </div>

      {/* Content Preview Gallery */}
      <ContentGallery campaigns={campaigns} maxItems={8} />

      {/* Timeline View */}
      <CampaignTimeline campaigns={campaigns} />

      {/* Quick Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {campaigns.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</div>
        </div>
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {campaigns.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </div>
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {summaries.reduce((acc, { summary }) => acc + summary.totalItems, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Content Items</div>
        </div>
        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {summaries.reduce((acc, { summary }) => acc + summary.completedItems, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Ready/Published</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverviewTab;
