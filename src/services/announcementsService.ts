/**
 * BLKOUT Community Platform - Announcements Service
 * Service layer for fetching announcements from comms-blkout database
 */

import { supabase } from '../lib/supabase';
import type { AnnouncementDB, Announcement } from '../types/announcements';
import { convertAnnouncementFromDB } from '../types/announcements';

/**
 * Check if Supabase is configured
 */
function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key && url !== 'https://placeholder-url.supabase.co');
}

/**
 * Handle Supabase errors gracefully
 */
function handleSupabaseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Fetch published announcements for public display
 * @param limit - Maximum number of announcements to fetch (default: 10)
 */
export async function fetchPublishedAnnouncements(
  limit: number = 10
): Promise<{ data: Announcement[] | null; error: string | null }> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: 'Supabase is not configured. Please set up your environment variables.',
      };
    }

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('priority', { ascending: false })
      .order('display_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching announcements:', error);
      return {
        data: null,
        error: handleSupabaseError(error),
      };
    }

    const announcements = data?.map((dbAnnouncement) =>
      convertAnnouncementFromDB(dbAnnouncement as AnnouncementDB)
    ) || [];

    return {
      data: announcements,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching announcements:', error);
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

