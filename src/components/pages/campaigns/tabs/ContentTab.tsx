/**
 * ContentTab - Kanban-style Content Inventory
 * Shows content items organized by status columns
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Globe,
  MessageCircle,
  Filter,
  ChevronDown,
  Calendar,
  X
} from 'lucide-react';
import { format } from 'date-fns';

import { useContentStatus } from '../hooks/useCampaigns';
import { ContentThumbnail } from '../components/ContentThumbnail';
import type { Campaign, ContentItem, ContentStatus, Platform, ContentType } from '../types';

interface ContentTabProps {
  campaigns: Campaign[];
}

// Platform icon mapping
const getPlatformIcon = (platform: Platform): React.ReactNode => {
  const iconClass = 'w-4 h-4';
  switch (platform) {
    case 'instagram':
      return <Instagram className={iconClass} />;
    case 'twitter':
      return <Twitter className={iconClass} />;
    case 'linkedin':
      return <Linkedin className={iconClass} />;
    case 'email':
      return <Mail className={iconClass} />;
    case 'website':
      return <Globe className={iconClass} />;
    case 'hub':
      return <MessageCircle className={iconClass} />;
    case 'tiktok':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      );
    default:
      return <Globe className={iconClass} />;
  }
};

// Status column configuration
const statusConfig: Record<ContentStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  idea: {
    label: 'Idea',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600'
  },
  drafted: {
    label: 'Drafted',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-300 dark:border-blue-600'
  },
  designed: {
    label: 'Designed',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    borderColor: 'border-purple-300 dark:border-purple-600'
  },
  approved: {
    label: 'Approved',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-300 dark:border-yellow-600'
  },
  scheduled: {
    label: 'Scheduled',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    borderColor: 'border-orange-300 dark:border-orange-600'
  },
  published: {
    label: 'Published',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-300 dark:border-green-600'
  }
};

// Content type labels
const contentTypeLabels: Record<ContentType, string> = {
  social: 'Social Post',
  newsletter: 'Newsletter',
  video: 'Video',
  graphic: 'Graphic',
  article: 'Article',
  story: 'Story'
};

// Platform labels
const platformLabels: Record<Platform, string> = {
  instagram: 'Instagram',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  email: 'Email',
  hub: 'Hub',
  website: 'Website'
};

// Content card component with thumbnail
const ContentCard: React.FC<{
  item: ContentItem;
  campaignName: string;
}> = ({ item, campaignName }) => {
  const config = statusConfig[item.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`p-3 bg-white dark:bg-gray-800 rounded-lg border ${config.borderColor} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
    >
      {/* Thumbnail and header row */}
      <div className="flex items-start gap-3 mb-2">
        {/* Thumbnail */}
        <ContentThumbnail item={item} size="sm" showPreview={true} />

        {/* Title and type */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
            {item.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <div className={`p-1 rounded ${config.bgColor} ${config.color}`}>
              {getPlatformIcon(item.platform)}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {contentTypeLabels[item.type]}
            </span>
          </div>
        </div>
      </div>

      {/* Campaign badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 truncate max-w-full">
          {campaignName}
        </span>
      </div>

      {/* Scheduled date */}
      {item.scheduledFor && (
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-3 h-3" />
          {format(new Date(item.scheduledFor), 'MMM d, yyyy')}
        </div>
      )}

      {/* Content preview snippet */}
      {item.content && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">
          {item.content.slice(0, 80)}{item.content.length > 80 ? '...' : ''}
        </div>
      )}
    </motion.div>
  );
};

// Filter dropdown component
const FilterDropdown: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-gray-700 dark:text-gray-300">{label}:</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {options.find(o => o.value === value)?.label || 'All'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    value === option.value
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ContentTab: React.FC<ContentTabProps> = ({ campaigns }) => {
  // Filter state
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');

  // Get content status from hook
  const { columns, totals, allContent } = useContentStatus(campaigns);

  // Build filter options
  const campaignOptions = useMemo(() => [
    { value: 'all', label: 'All Campaigns' },
    ...campaigns.map(c => ({ value: c.id, label: c.name.split(':')[0] }))
  ], [campaigns]);

  const platformOptions = useMemo(() => {
    const platforms = new Set(allContent.map(c => c.platform));
    return [
      { value: 'all', label: 'All Platforms' },
      ...Array.from(platforms).map(p => ({ value: p, label: platformLabels[p] }))
    ];
  }, [allContent]);

  const contentTypeOptions = useMemo(() => {
    const types = new Set(allContent.map(c => c.type));
    return [
      { value: 'all', label: 'All Types' },
      ...Array.from(types).map(t => ({ value: t, label: contentTypeLabels[t as ContentType] }))
    ];
  }, [allContent]);

  // Apply filters to columns
  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      items: column.items.filter(item => {
        if (campaignFilter !== 'all' && item.campaignId !== campaignFilter) return false;
        if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
        if (contentTypeFilter !== 'all' && item.type !== contentTypeFilter) return false;
        return true;
      })
    }));
  }, [columns, campaignFilter, platformFilter, contentTypeFilter]);

  // Get campaign name helper
  const getCampaignName = (campaignId: string): string => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign?.name.split(':')[0] || 'Unknown';
  };

  // Check if any filters are active
  const hasActiveFilters = campaignFilter !== 'all' || platformFilter !== 'all' || contentTypeFilter !== 'all';

  // Clear all filters
  const clearFilters = () => {
    setCampaignFilter('all');
    setPlatformFilter('all');
    setContentTypeFilter('all');
  };

  // Calculate filtered totals
  const filteredTotals = useMemo(() => {
    const allFiltered = filteredColumns.flatMap(c => c.items);
    return {
      total: allFiltered.length,
      completed: filteredColumns
        .filter(c => c.status === 'published' || c.status === 'scheduled')
        .reduce((sum, c) => sum + c.items.length, 0),
      inProgress: filteredColumns
        .filter(c => c.status === 'drafted' || c.status === 'designed' || c.status === 'approved')
        .reduce((sum, c) => sum + c.items.length, 0),
      notStarted: filteredColumns
        .filter(c => c.status === 'idea')
        .reduce((sum, c) => sum + c.items.length, 0)
    };
  }, [filteredColumns]);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <FilterDropdown
          label="Campaign"
          value={campaignFilter}
          options={campaignOptions}
          onChange={setCampaignFilter}
        />
        <FilterDropdown
          label="Platform"
          value={platformFilter}
          options={platformOptions}
          onChange={setPlatformFilter}
        />
        <FilterDropdown
          label="Type"
          value={contentTypeFilter}
          options={contentTypeOptions}
          onChange={setContentTypeFilter}
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}

        <div className="flex-1" />

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-gray-100">{filteredTotals.total}</span> items
          </span>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Items</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {filteredTotals.total}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Not Started</div>
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {filteredTotals.notStarted}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {filteredTotals.inProgress}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {filteredTotals.completed}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex gap-4 min-w-max">
          {filteredColumns.map((column) => {
            const config = statusConfig[column.status];
            return (
              <motion.div
                key={column.status}
                layout
                className="w-72 flex-shrink-0"
              >
                {/* Column Header */}
                <div className={`p-3 rounded-t-lg ${config.bgColor} border-t-4 ${config.borderColor.replace('border-', 'border-t-')}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${config.color}`}>
                      {config.label}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                      {column.items.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-b-lg p-3 min-h-[400px] space-y-3 border border-t-0 border-gray-200 dark:border-gray-700">
                  <AnimatePresence>
                    {column.items.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center h-32 text-sm text-gray-400 dark:text-gray-600"
                      >
                        No items
                      </motion.div>
                    ) : (
                      column.items.map((item) => (
                        <ContentCard
                          key={item.id}
                          item={item}
                          campaignName={getCampaignName(item.campaignId)}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
