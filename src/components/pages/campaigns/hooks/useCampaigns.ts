/**
 * Campaign Hooks
 * React hooks for campaign data management
 */

import { useState, useEffect, useCallback } from 'react';
import type { Campaign, ContentItem, ContentStatus, PipelineCheck, PipelineCheckStatus, ScheduleEvent } from '../types';
import { loadAllCampaigns, getCampaignSummary } from '../services/campaignLoader';

/**
 * Hook to load and manage campaigns
 */
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadAllCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load campaigns'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  return {
    campaigns,
    isLoading,
    error,
    refresh: loadCampaigns
  };
}

/**
 * Hook to get content status grouped by status
 */
export function useContentStatus(campaigns: Campaign[]) {
  const allContent = campaigns.flatMap(c => c.contentItems);

  const byStatus = allContent.reduce((acc, item) => {
    if (!acc[item.status]) acc[item.status] = [];
    acc[item.status].push(item);
    return acc;
  }, {} as Record<ContentStatus, ContentItem[]>);

  const statusOrder: ContentStatus[] = ['idea', 'drafted', 'designed', 'approved', 'scheduled', 'published'];

  const columns = statusOrder.map(status => ({
    status,
    items: byStatus[status] || [],
    count: byStatus[status]?.length || 0
  }));

  const totals = {
    total: allContent.length,
    completed: (byStatus.published?.length || 0) + (byStatus.scheduled?.length || 0),
    inProgress: (byStatus.drafted?.length || 0) + (byStatus.designed?.length || 0) + (byStatus.approved?.length || 0),
    notStarted: byStatus.idea?.length || 0
  };

  return { columns, totals, allContent };
}

/**
 * Hook to generate schedule events for calendar
 */
export function useScheduleEvents(campaigns: Campaign[]): ScheduleEvent[] {
  return campaigns.flatMap(campaign =>
    campaign.contentItems
      .filter(item => item.scheduledFor)
      .map(item => ({
        id: item.id,
        title: item.title,
        start: item.scheduledFor!,
        platform: item.platform,
        campaignId: campaign.id,
        contentItemId: item.id,
        status: item.status,
        allDay: false
      }))
  );
}

/**
 * Callback type for status change notifications
 */
export type PipelineStatusChangeCallback = (
  newStatus: PipelineCheckStatus,
  failingChecks: PipelineCheck[]
) => void;

/**
 * Hook for pipeline health checks
 */
export function usePipelineHealth(
  campaigns: Campaign[],
  onStatusChange?: PipelineStatusChangeCallback
) {
  const [checks, setChecks] = useState<PipelineCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [previousStatus, setPreviousStatus] = useState<PipelineCheckStatus>('unknown');

  const runChecks = useCallback(async () => {
    setIsRunning(true);
    const newChecks: PipelineCheck[] = [];

    for (const campaign of campaigns) {
      const summary = getCampaignSummary(campaign);

      // Check 1: Config Valid
      newChecks.push({
        id: `${campaign.id}-config-valid`,
        name: 'Config Valid',
        description: `Campaign JSON loaded successfully for ${campaign.name}`,
        status: campaign.id ? 'passing' : 'failing',
        lastChecked: new Date(),
        campaignId: campaign.id
      });

      // Check 2: Content Complete
      const contentComplete = summary.totalItems > 0 && summary.completedItems > 0;
      newChecks.push({
        id: `${campaign.id}-content-complete`,
        name: 'Content Complete',
        description: `${summary.completedItems}/${summary.totalItems} items ready`,
        status: summary.completionPercentage >= 80 ? 'passing' :
                summary.completionPercentage >= 50 ? 'warning' : 'failing',
        lastChecked: new Date(),
        details: `${summary.completionPercentage}% complete`,
        campaignId: campaign.id
      });

      // Check 3: Has Scheduled Content
      const scheduledContent = campaign.contentItems.filter(i => i.scheduledFor);
      newChecks.push({
        id: `${campaign.id}-scheduling-set`,
        name: 'Scheduling Set',
        description: `${scheduledContent.length} items have scheduled dates`,
        status: scheduledContent.length >= campaign.contentItems.length * 0.5 ? 'passing' :
                scheduledContent.length > 0 ? 'warning' : 'failing',
        lastChecked: new Date(),
        campaignId: campaign.id
      });

      // Check 4: Agent Tasks Assigned
      const agentTasks = campaign.agentTasks;
      newChecks.push({
        id: `${campaign.id}-agents-assigned`,
        name: 'Agent Tasks Assigned',
        description: `${agentTasks.length} agents have tasks`,
        status: agentTasks.length >= 3 ? 'passing' :
                agentTasks.length > 0 ? 'warning' : 'failing',
        lastChecked: new Date(),
        campaignId: campaign.id
      });

      // Check 5: Metrics Defined
      const hasMetrics = campaign.metrics && (campaign.metrics.targetReach || campaign.metrics.applications);
      newChecks.push({
        id: `${campaign.id}-metrics-defined`,
        name: 'Metrics Defined',
        description: hasMetrics ? 'Success metrics configured' : 'No metrics defined',
        status: hasMetrics ? 'passing' : 'warning',
        lastChecked: new Date(),
        campaignId: campaign.id
      });

      // Check 6: Newsletter Ready
      const hasNewsletter = campaign.contentItems.some(i => i.type === 'newsletter' && i.status !== 'idea');
      newChecks.push({
        id: `${campaign.id}-newsletter-ready`,
        name: 'Newsletter Ready',
        description: hasNewsletter ? 'Newsletter content drafted' : 'Newsletter not started',
        status: hasNewsletter ? 'passing' : 'warning',
        lastChecked: new Date(),
        campaignId: campaign.id
      });

      // Check 7: Social Content Ready
      const socialContent = campaign.contentItems.filter(i => i.type === 'social');
      const readySocial = socialContent.filter(i => i.status !== 'idea').length;
      newChecks.push({
        id: `${campaign.id}-social-ready`,
        name: 'Social Content Ready',
        description: `${readySocial}/${socialContent.length} social posts drafted`,
        status: readySocial === socialContent.length ? 'passing' :
                readySocial > socialContent.length / 2 ? 'warning' : 'failing',
        lastChecked: new Date(),
        campaignId: campaign.id
      });

      // Check 8: Visual Assets
      const visualAssets = campaign.contentItems.filter(i => i.type === 'graphic');
      const readyVisuals = visualAssets.filter(i => i.status !== 'idea').length;
      newChecks.push({
        id: `${campaign.id}-visuals-ready`,
        name: 'Visual Assets Ready',
        description: `${readyVisuals}/${visualAssets.length} graphics designed`,
        status: visualAssets.length === 0 ? 'unknown' :
                readyVisuals === visualAssets.length ? 'passing' :
                readyVisuals > 0 ? 'warning' : 'failing',
        lastChecked: new Date(),
        campaignId: campaign.id
      });
    }

    setChecks(newChecks);
    setLastRun(new Date());
    setIsRunning(false);
  }, [campaigns]);

  useEffect(() => {
    if (campaigns.length > 0) {
      runChecks();
    }
  }, [campaigns, runChecks]);

  const overallStatus: PipelineCheckStatus = checks.length === 0 ? 'unknown' :
    checks.some(c => c.status === 'failing') ? 'failing' :
    checks.some(c => c.status === 'warning') ? 'warning' : 'passing';

  // Trigger callback when status changes to failing or warning
  useEffect(() => {
    if (overallStatus !== previousStatus) {
      if (overallStatus === 'failing' || overallStatus === 'warning') {
        const failingOrWarning = checks.filter(
          c => c.status === 'failing' || c.status === 'warning'
        );
        onStatusChange?.(overallStatus, failingOrWarning);
      }
      setPreviousStatus(overallStatus);
    }
  }, [overallStatus, previousStatus, checks, onStatusChange]);

  return {
    checks,
    isRunning,
    lastRun,
    overallStatus,
    runChecks
  };
}

/**
 * Hook for campaign summaries
 */
export function useCampaignSummaries(campaigns: Campaign[]) {
  return campaigns.map(campaign => ({
    campaign,
    summary: getCampaignSummary(campaign)
  }));
}
