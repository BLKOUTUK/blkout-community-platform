// BLKOUT Liberation Platform - Voices API Client
// Editorial content management for community voices and opinion pieces

import { supabase } from '@/lib/supabase';

export interface VoicesArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'opinion' | 'analysis' | 'editorial' | 'community' | 'liberation';
  tags: string[];
  featured: boolean;
  published: boolean;
  slug: string;
  hero_image?: string;
  hero_image_alt?: string;
  thumbnail_image?: string;
  thumbnail_alt?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface VoicesArticleSubmission {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'opinion' | 'analysis' | 'editorial' | 'community' | 'liberation';
  tags: string[];
  featured?: boolean;
  published?: boolean;
  slug?: string;
  hero_image?: string;
  hero_image_alt?: string;
  thumbnail_image?: string;
  thumbnail_alt?: string;
}

export interface VoicesArticleUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  category?: 'opinion' | 'analysis' | 'editorial' | 'community' | 'liberation';
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  slug?: string;
  hero_image?: string;
  hero_image_alt?: string;
  thumbnail_image?: string;
  thumbnail_alt?: string;
}

/**
 * Voices API Client for managing editorial content
 * Handles CRUD operations for articles and opinion pieces
 */
export class VoicesAPIClient {

  /**
   * Get all published articles for public consumption
   */
  async getPublishedArticles(): Promise<VoicesArticle[]> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch published articles: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching published articles:', error);
      throw error;
    }
  }

  /**
   * Get featured articles for homepage/highlights
   */
  async getFeaturedArticles(): Promise<VoicesArticle[]> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) {
        throw new Error(`Failed to fetch featured articles: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      throw error;
    }
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(category: string): Promise<VoicesArticle[]> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .select('*')
        .eq('published', true)
        .eq('category', category)
        .order('published_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch articles by category: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      throw error;
    }
  }

  /**
   * Get single article by slug for public reading
   */
  async getArticleBySlug(slug: string): Promise<VoicesArticle | null> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Article not found
        }
        throw new Error(`Failed to fetch article: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      throw error;
    }
  }

  // Admin methods (require authentication)

  /**
   * Get all articles for admin management (published and unpublished)
   */
  async getAllArticles(): Promise<VoicesArticle[]> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch all articles: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all articles:', error);
      throw error;
    }
  }

  /**
   * Get single article by ID for admin editing
   */
  async getArticleById(id: string): Promise<VoicesArticle | null> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Article not found
        }
        throw new Error(`Failed to fetch article: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching article by ID:', error);
      throw error;
    }
  }

  /**
   * Create new article
   */
  async createArticle(article: VoicesArticleSubmission): Promise<VoicesArticle> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .insert([article])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create article: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  /**
   * Update existing article
   */
  async updateArticle(id: string, updates: VoicesArticleUpdate): Promise<VoicesArticle> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update article: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  /**
   * Delete article
   */
  async deleteArticle(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('voices_articles')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete article: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  /**
   * Toggle article published status
   */
  async togglePublished(id: string, published: boolean): Promise<VoicesArticle> {
    try {
      const updates: VoicesArticleUpdate = {
        published,
        // Set published_at if publishing for the first time
        ...(published && { published_at: new Date().toISOString() })
      };

      const { data, error } = await supabase
        .from('voices_articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to toggle publish status: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error toggling publish status:', error);
      throw error;
    }
  }

  /**
   * Toggle article featured status
   */
  async toggleFeatured(id: string, featured: boolean): Promise<VoicesArticle> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .update({ featured })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to toggle featured status: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  }

  /**
   * Search articles by title, content, or tags
   */
  async searchArticles(query: string, publishedOnly: boolean = true): Promise<VoicesArticle[]> {
    try {
      let queryBuilder = supabase
        .from('voices_articles')
        .select('*');

      if (publishedOnly) {
        queryBuilder = queryBuilder.eq('published', true);
      }

      // Search in title, excerpt, content, and tags
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`);

      const { data, error } = await queryBuilder
        .order('published_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search articles: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  }

  /**
   * Get articles count by status for admin dashboard
   */
  async getArticleStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    featured: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('voices_articles')
        .select('published, featured');

      if (error) {
        throw new Error(`Failed to fetch article stats: ${error.message}`);
      }

      const total = data?.length || 0;
      const published = data?.filter(article => article.published).length || 0;
      const draft = total - published;
      const featured = data?.filter(article => article.featured).length || 0;

      return { total, published, draft, featured };
    } catch (error) {
      console.error('Error fetching article stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const voicesAPI = new VoicesAPIClient();