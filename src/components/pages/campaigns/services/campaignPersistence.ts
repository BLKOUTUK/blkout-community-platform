/**
 * Campaign Content Status Persistence Service
 * Handles Supabase persistence for campaign content status tracking
 *
 * SQL Migration (run in Supabase SQL editor):
 *
 * CREATE TABLE IF NOT EXISTS campaign_content_status (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   campaign_id TEXT NOT NULL,
 *   content_item_id TEXT NOT NULL,
 *   status TEXT NOT NULL,
 *   notes TEXT,
 *   updated_by TEXT,
 *   updated_at TIMESTAMPTZ DEFAULT NOW(),
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(campaign_id, content_item_id)
 * );
 *
 * CREATE INDEX idx_campaign_content_status_campaign ON campaign_content_status(campaign_id);
 * CREATE INDEX idx_campaign_content_status_content ON campaign_content_status(content_item_id);
 */

import { supabase } from '@/lib/supabase';
import type { ContentStatus } from '../types';

const TABLE_NAME = 'campaign_content_status';

export interface ContentStatusRecord {
  id?: string;
  campaign_id: string;
  content_item_id: string;
  status: ContentStatus;
  notes?: string;
  updated_by?: string;
  updated_at: string;
  created_at?: string;
}

export interface ContentStatusHistoryRecord extends ContentStatusRecord {
  created_at: string;
}

/**
 * Save content status change to Supabase
 * Uses upsert to handle both new records and updates
 */
export async function saveContentStatus(
  campaignId: string,
  contentItemId: string,
  status: ContentStatus,
  notes?: string,
  updatedBy?: string
): Promise<boolean> {
  try {
    const record: Omit<ContentStatusRecord, 'id' | 'created_at'> = {
      campaign_id: campaignId,
      content_item_id: contentItemId,
      status,
      notes: notes || undefined,
      updated_by: updatedBy || undefined,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert(record, {
        onConflict: 'campaign_id,content_item_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error saving content status to Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception saving content status:', error);
    return false;
  }
}

/**
 * Get all status overrides for specified campaigns
 * Returns records that override the JSON-derived status
 */
export async function getContentStatusOverrides(
  campaignIds: string[]
): Promise<ContentStatusRecord[]> {
  if (campaignIds.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .in('campaign_id', campaignIds)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching content status overrides:', error);
      return [];
    }

    return (data || []).map(record => ({
      id: record.id,
      campaign_id: record.campaign_id,
      content_item_id: record.content_item_id,
      status: record.status as ContentStatus,
      notes: record.notes,
      updated_by: record.updated_by,
      updated_at: record.updated_at,
      created_at: record.created_at
    }));
  } catch (error) {
    console.error('Exception fetching content status overrides:', error);
    return [];
  }
}

/**
 * Get status history for a specific content item
 * Useful for audit trail and tracking changes over time
 */
export async function getContentStatusHistory(
  contentItemId: string
): Promise<ContentStatusHistoryRecord[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('content_item_id', contentItemId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching content status history:', error);
      return [];
    }

    return (data || []).map(record => ({
      id: record.id,
      campaign_id: record.campaign_id,
      content_item_id: record.content_item_id,
      status: record.status as ContentStatus,
      notes: record.notes,
      updated_by: record.updated_by,
      updated_at: record.updated_at,
      created_at: record.created_at
    }));
  } catch (error) {
    console.error('Exception fetching content status history:', error);
    return [];
  }
}

/**
 * Delete a content status override (revert to JSON-derived status)
 */
export async function deleteContentStatusOverride(
  campaignId: string,
  contentItemId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('campaign_id', campaignId)
      .eq('content_item_id', contentItemId);

    if (error) {
      console.error('Error deleting content status override:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception deleting content status override:', error);
    return false;
  }
}

/**
 * Batch save multiple content status changes
 * More efficient for bulk operations
 */
export async function batchSaveContentStatus(
  records: Array<{
    campaignId: string;
    contentItemId: string;
    status: ContentStatus;
    notes?: string;
  }>,
  updatedBy?: string
): Promise<{ success: number; failed: number }> {
  const results = { success: 0, failed: 0 };

  if (records.length === 0) {
    return results;
  }

  try {
    const upsertRecords = records.map(r => ({
      campaign_id: r.campaignId,
      content_item_id: r.contentItemId,
      status: r.status,
      notes: r.notes || null,
      updated_by: updatedBy || null,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert(upsertRecords, {
        onConflict: 'campaign_id,content_item_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error batch saving content statuses:', error);
      results.failed = records.length;
      return results;
    }

    results.success = records.length;
    return results;
  } catch (error) {
    console.error('Exception batch saving content statuses:', error);
    results.failed = records.length;
    return results;
  }
}

/**
 * Check if Supabase connection is available for persistence
 */
export async function isSupabaseAvailable(): Promise<boolean> {
  try {
    // Simple health check query
    const { error } = await supabase
      .from(TABLE_NAME)
      .select('id')
      .limit(1);

    // Table might not exist yet, which is different from connection failure
    if (error && error.code === '42P01') {
      console.warn('campaign_content_status table does not exist. Run migration SQL.');
      return false;
    }

    if (error && error.message?.includes('Invalid API key')) {
      console.error('Supabase connection unavailable: Invalid API key');
      return false;
    }

    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
}
