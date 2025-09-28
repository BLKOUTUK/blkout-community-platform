// Story Archive API Service
// Handles fetching and searching real migrated stories from BLKOUT archive

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  imageUrl?: string;
  originalUrl?: string;
  contentType: 'article' | 'audio' | 'video' | 'gallery' | 'multimedia';
  blkoutTheme?: 'CONNECT' | 'CREATE' | 'CARE';
}

class StoryArchiveAPI {
  private baseUrl = '/api';
  private supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  private supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  async searchStories(query: string = '', category: string = 'all', page: number = 1, limit: number = 12): Promise<{
    stories: Story[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      // Always use the API endpoint (which handles Supabase internally)
      const params = new URLSearchParams({
        category: category !== 'all' ? category : '',
        search: query || '',
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
        sortBy: 'recent',
        status: 'published'
      });

      const response = await fetch(`${this.baseUrl}/stories?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const result = await response.json();

      // Transform the response to match our expected format
      if (result.success && result.data) {
        const stories = result.data.stories || [];
        const pagination = result.data.pagination || { total: 0, limit: 12, offset: 0, page: 1, totalPages: 0 };

        return {
          stories: stories,
          total: pagination.total || stories.length,
          page: pagination.page || page,
          totalPages: pagination.totalPages || Math.ceil(stories.length / limit)
        };
      }

      // Return empty if no data
      return {
        stories: [],
        total: 0,
        page: 1,
        totalPages: 0
      };
    } catch (error) {
      console.error('Error fetching stories:', error);
      // Return empty state if API fails
      return {
        stories: [],
        total: 0,
        page: 1,
        totalPages: 0
      };
    }
  }

  private async fetchStoriesFromSupabase(query: string = '', category: string = 'all', page: number = 1, limit: number = 12) {
    try {
      const offset = (page - 1) * limit;

      // Build the query URL for Supabase REST API
      let url = `${this.supabaseUrl}/rest/v1/stories?select=*&order=published_at.desc&limit=${limit}&offset=${offset}`;

      // Add category filter if specified
      if (category !== 'all') {
        url += `&category=eq.${encodeURIComponent(category)}`;
      }

      // Add search filter if provided
      if (query) {
        const searchQuery = encodeURIComponent(query);
        url += `&or=(title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%)`;
      }

      const response = await fetch(url, {
        headers: {
          'apikey': this.supabaseAnonKey,
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Supabase fetch failed: ${response.status}`);
      }

      const stories = await response.json();

      // Get total count for pagination
      const countUrl = `${this.supabaseUrl}/rest/v1/stories?select=count&head=true`;
      const countResponse = await fetch(countUrl, {
        headers: {
          'apikey': this.supabaseAnonKey,
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Prefer': 'count=exact'
        }
      });

      const total = parseInt(countResponse.headers.get('content-range')?.split('/')[1] || '0');

      // Transform Supabase data to match our Story interface
      const transformedStories = stories.map((story: any) => ({
        id: story.id,
        title: story.title,
        excerpt: story.excerpt || story.description || '',
        content: story.content || '',
        category: story.category || 'Uncategorized',
        author: story.author || 'Anonymous',
        publishedAt: story.published_at || story.created_at,
        readTime: story.read_time || this.estimateReadTime(story.content || ''),
        tags: story.tags || [],
        imageUrl: story.image_url,
        originalUrl: story.original_url,
        contentType: story.content_type || 'article',
        blkoutTheme: story.blkout_theme
      }));

      return {
        stories: transformedStories,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      throw error;
    }
  }

  private estimateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  async getStory(id: string): Promise<Story | null> {
    try {
      // Search for the specific story using the stories API
      const params = new URLSearchParams({
        limit: '100',  // Get enough stories to find the one we want
        offset: '0'
      });

      const response = await fetch(`${this.baseUrl}/stories?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const result = await response.json();

      if (result.success && result.data) {
        const stories = result.data.stories || [];
        const story = stories.find((s: any) => s.id === id);

        if (story) {
          return story;
        }

        // If not found in first 100, try searching all stories
        const allParams = new URLSearchParams({
          limit: result.data.pagination?.total?.toString() || '500',
          offset: '0'
        });

        const allResponse = await fetch(`${this.baseUrl}/stories?${allParams}`);

        if (allResponse.ok) {
          const allResult = await allResponse.json();
          if (allResult.success && allResult.data) {
            const allStories = allResult.data.stories || [];
            const foundStory = allStories.find((s: any) => s.id === id);
            if (foundStory) {
              return foundStory;
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching story:', error);
      return null;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      // Return known categories from the content
      return [
        'Community Organizing',
        'Arts & Culture',
        'Economic Justice',
        'Health & Wellness',
        'Education & Resources',
        'Liberation Theory',
        'Mutual Aid',
        'Black Joy',
        'Queer Liberation'
      ];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['all'];
    }
  }
}

export const storyArchiveAPI = new StoryArchiveAPI();