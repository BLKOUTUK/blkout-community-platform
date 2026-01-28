/**
 * usePersistedStatus Hook
 * Merges persisted Supabase status with JSON-derived campaign status
 * Provides graceful fallback when Supabase is unavailable
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Campaign, ContentStatus } from '../types';
import {
  getContentStatusOverrides,
  saveContentStatus,
  deleteContentStatusOverride,
  isSupabaseAvailable,
  type ContentStatusRecord
} from '../services/campaignPersistence';

interface UsePersistedStatusResult {
  /** Campaigns with persisted status merged in */
  campaigns: Campaign[];
  /** Whether status overrides are being loaded */
  isLoading: boolean;
  /** Error if persistence operations fail */
  error: Error | null;
  /** Whether Supabase persistence is available */
  isPersistenceAvailable: boolean;
  /** Map of content item IDs to their persisted status records */
  statusOverrides: Map<string, ContentStatusRecord>;
  /** Update a content item's status (persists to Supabase if available) */
  updateContentStatus: (
    campaignId: string,
    contentItemId: string,
    status: ContentStatus,
    notes?: string
  ) => Promise<boolean>;
  /** Revert a content item to its JSON-derived status */
  revertToOriginalStatus: (
    campaignId: string,
    contentItemId: string
  ) => Promise<boolean>;
  /** Refresh status overrides from Supabase */
  refresh: () => Promise<void>;
}

export function usePersistedStatus(
  campaigns: Campaign[]
): UsePersistedStatusResult {
  const [statusOverrides, setStatusOverrides] = useState<Map<string, ContentStatusRecord>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPersistenceAvailable, setIsPersistenceAvailable] = useState(false);

  // Load status overrides from Supabase
  const loadOverrides = useCallback(async () => {
    if (campaigns.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if Supabase is available first
      const available = await isSupabaseAvailable();
      setIsPersistenceAvailable(available);

      if (!available) {
        console.warn('Supabase persistence unavailable, using JSON-only status');
        setStatusOverrides(new Map());
        setIsLoading(false);
        return;
      }

      // Fetch status overrides for all campaigns
      const campaignIds = campaigns.map(c => c.id);
      const overrides = await getContentStatusOverrides(campaignIds);

      // Build map keyed by content_item_id for quick lookup
      const overrideMap = new Map<string, ContentStatusRecord>();
      overrides.forEach(record => {
        overrideMap.set(record.content_item_id, record);
      });

      setStatusOverrides(overrideMap);
    } catch (err) {
      console.error('Error loading status overrides:', err);
      setError(err instanceof Error ? err : new Error('Failed to load status overrides'));
      // Don't fail completely - just use JSON-only status
      setStatusOverrides(new Map());
    } finally {
      setIsLoading(false);
    }
  }, [campaigns]);

  // Load overrides when campaigns change
  useEffect(() => {
    loadOverrides();
  }, [loadOverrides]);

  // Merge persisted status with campaigns
  const mergedCampaigns = useMemo((): Campaign[] => {
    if (statusOverrides.size === 0) {
      return campaigns;
    }

    return campaigns.map(campaign => ({
      ...campaign,
      contentItems: campaign.contentItems.map(item => {
        const override = statusOverrides.get(item.id);
        if (override) {
          return {
            ...item,
            status: override.status
          };
        }
        return item;
      })
    }));
  }, [campaigns, statusOverrides]);

  // Update content status
  const updateContentStatus = useCallback(async (
    campaignId: string,
    contentItemId: string,
    status: ContentStatus,
    notes?: string
  ): Promise<boolean> => {
    // Optimistically update local state
    setStatusOverrides(prev => {
      const next = new Map(prev);
      next.set(contentItemId, {
        campaign_id: campaignId,
        content_item_id: contentItemId,
        status,
        notes,
        updated_at: new Date().toISOString()
      });
      return next;
    });

    // If persistence is available, save to Supabase
    if (isPersistenceAvailable) {
      const success = await saveContentStatus(campaignId, contentItemId, status, notes);
      if (!success) {
        console.warn('Failed to persist status to Supabase, keeping local state');
        // Don't revert optimistic update - user can still work locally
      }
      return success;
    }

    // Persistence unavailable - local update only
    return true;
  }, [isPersistenceAvailable]);

  // Revert to original (JSON-derived) status
  const revertToOriginalStatus = useCallback(async (
    campaignId: string,
    contentItemId: string
  ): Promise<boolean> => {
    // Optimistically remove from local state
    setStatusOverrides(prev => {
      const next = new Map(prev);
      next.delete(contentItemId);
      return next;
    });

    // If persistence is available, delete from Supabase
    if (isPersistenceAvailable) {
      const success = await deleteContentStatusOverride(campaignId, contentItemId);
      if (!success) {
        console.warn('Failed to delete status override from Supabase');
        // Reload to get correct state
        await loadOverrides();
      }
      return success;
    }

    return true;
  }, [isPersistenceAvailable, loadOverrides]);

  return {
    campaigns: mergedCampaigns,
    isLoading,
    error,
    isPersistenceAvailable,
    statusOverrides,
    updateContentStatus,
    revertToOriginalStatus,
    refresh: loadOverrides
  };
}

/**
 * Hook to check if a content item has a persisted status override
 */
export function useHasPersistedStatus(
  contentItemId: string,
  statusOverrides: Map<string, ContentStatusRecord>
): boolean {
  return statusOverrides.has(contentItemId);
}

/**
 * Hook to get persistence metadata for a content item
 */
export function useContentStatusMetadata(
  contentItemId: string,
  statusOverrides: Map<string, ContentStatusRecord>
): ContentStatusRecord | null {
  return statusOverrides.get(contentItemId) || null;
}
