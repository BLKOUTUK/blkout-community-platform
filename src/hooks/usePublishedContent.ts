/**
 * BLKOUT Community Platform - Published Content Hook
 * Hook for fetching published content from shared Supabase database with comms-blkout
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Content } from '../types/content';

/**
 * Check if Supabase is configured
 */
function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key && url !== 'https://placeholder-url.supabase.co');
}

/**
 * Mock content for fallback when Supabase is not configured
 */
const mockContent: Content[] = [
  {
    id: '1',
    title: 'Celebrating Black Queer Joy',
    body: 'Our community gathering brought together over 100 Black queer individuals for an afternoon of celebration, connection, and collective power building.',
    contentType: 'post',
    status: 'published',
    platforms: ['instagram', 'linkedin'],
    publishedAt: new Date('2024-03-15'),
    agentType: 'griot',
    engagementMetrics: {
      likes: 342,
      comments: 56,
      shares: 89
    },
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: '2',
    title: 'Liberation Through Media Sovereignty',
    body: 'Join our workshop series on creating liberatory content and building community power through authentic storytelling rooted in Black feminist thought.',
    contentType: 'article',
    status: 'published',
    platforms: ['linkedin', 'twitter'],
    publishedAt: new Date('2024-03-12'),
    agentType: 'strategist',
    engagementMetrics: {
      likes: 198,
      comments: 34,
      shares: 67
    },
    createdAt: new Date('2024-03-11'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: '3',
    title: 'Community Organizing Wins',
    body: 'Through cooperative decision-making and democratic governance, our community successfully launched three new mutual aid initiatives this month.',
    contentType: 'post',
    status: 'published',
    platforms: ['instagram', 'facebook'],
    publishedAt: new Date('2024-03-10'),
    agentType: 'weaver',
    engagementMetrics: {
      likes: 276,
      comments: 45,
      shares: 102
    },
    createdAt: new Date('2024-03-09'),
    updatedAt: new Date('2024-03-10')
  }
];

/**
 * Hook for fetching published content for Discover page
 */
export function usePublishedContent() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublishedContent();
  }, []);

  const fetchPublishedContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // If Supabase is not configured, use mock data
      if (!isSupabaseConfigured()) {
        console.info('Supabase not configured, using mock content data');
        setContent(mockContent);
        setIsLoading(false);
        return;
      }

      // Fetch from Supabase (shared database with comms-blkout)
      const { data, error: fetchError } = await supabase
        .from('content')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;

      // Use fetched data or fallback to mock data
      setContent(data && data.length > 0 ? data : mockContent);
    } catch (err) {
      console.error('Error fetching published content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
      // Fallback to mock data on error
      setContent(mockContent);
    } finally {
      setIsLoading(false);
    }
  };

  return { content, isLoading, error };
}
