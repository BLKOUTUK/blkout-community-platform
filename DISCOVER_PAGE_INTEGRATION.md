# Discover Page Integration Guide

## Overview

This guide explains the enhanced Discover Page integration, which connects the BLKOUT Community Platform with the comms-blkout administrative module to provide a dynamic, AI-powered content discovery experience.

## What Changed

### Before Integration
The original Discover Page (`DiscoverPage.tsx`) was a static component with placeholder content.

### After Integration
The enhanced Discover Page (`DiscoverPage.enhanced.tsx`) is a dynamic, database-driven component that:
- Displays real content created by AI agents
- Shows community announcements from admin
- Integrates BLKOUT HUB promotional widget
- Embeds BLKOUT YouTube channel
- Provides filtering and search functionality
- Supports dark mode and smooth animations

## Components Architecture

```
DiscoverPage.enhanced.tsx
├─ HeroSection
│  └─ Liberation branding and values
├─ BlkoutHubWidget
│  └─ Promotional widget for BLKOUT HUB
├─ AnnouncementsSection (left column)
│  └─ Community announcements from database
├─ YouTubeEmbed (right column)
│  └─ Latest videos from BLKOUT channel
└─ Content Grid
   └─ ContentCard × N
      └─ Published posts from AI agents
```

## File Structure

### New Components

```
src/components/discover/
├─ HeroSection.tsx              # Hero section with stats and values
├─ BlkoutHubWidget.tsx          # BLKOUT HUB promotional widget
├─ AnnouncementsSection.tsx     # Community announcements display
└─ YouTubeEmbed.tsx             # YouTube channel embed

src/components/shared/
└─ ContentCard.tsx              # Individual content item display

src/hooks/
└─ usePublishedContent.ts       # Hook for fetching published content

src/services/
└─ announcementsService.ts      # Service for fetching announcements

src/types/
├─ announcements.ts             # Announcement type definitions
└─ content.ts                   # Content type definitions

src/components/pages/
├─ DiscoverPage.tsx             # Original (backed up as .backup)
└─ DiscoverPage.enhanced.tsx    # New enhanced version
```

## Data Flow

### Published Content

```
comms-blkout Admin
↓
Create Content with AI Agent
↓
Set Status: 'published'
↓
Write to Supabase content table
↓
usePublishedContent hook fetches
↓
Display in Content Grid (ContentCard)
```

### Announcements

```
comms-blkout Admin
↓
Create Announcement
↓
Set Status: 'published'
↓
Write to Supabase announcements table
↓
fetchPublishedAnnouncements() fetches
↓
Display in AnnouncementsSection
```

## Component Details

### HeroSection

**Purpose**: Welcome message and platform values
**Features**:
- Animated entrance with Framer Motion
- Stats display (users, engagement, connections)
- Values badges (75% Creator Sovereignty, Community Power, Democratic Governance)
- Responsive grid layout
- Dark mode support

**File**: `src/components/discover/HeroSection.tsx:1`

### BlkoutHubWidget

**Purpose**: Promote BLKOUT HUB community platform
**Features**:
- Gradient background (purple to pink)
- Feature list with check icons
- Dual CTAs (Learn More, Join Community)
- Links to blkouthub.com
- Hover animations

**File**: `src/components/discover/BlkoutHubWidget.tsx:1`

### AnnouncementsSection

**Purpose**: Display community announcements
**Data Source**: Supabase `announcements` table
**Features**:
- Category badges (Event, Update, Campaign, Urgent)
- Date display with Calendar icon
- Author attribution
- Loading state with spinner
- Error state with retry button
- Demo mode indicator when using mock data
- "View all announcements" link

**Mock Data Fallback**: Returns 3 sample announcements if database unavailable

**File**: `src/components/discover/AnnouncementsSection.tsx:1`

### YouTubeEmbed

**Purpose**: Embed BLKOUT YouTube channel
**Configuration**:
- Channel: @blkoutuk
- Playlist: PLQIvk5RMvEWxx_xt-vvwKS8k-D7eRRnDh
- Responsive iframe
- Dark mode support

**File**: `src/components/discover/YouTubeEmbed.tsx:1`

### ContentCard

**Purpose**: Display individual content pieces
**Features**:
- Platform badges with color coding
- Engagement metrics (likes, comments, shares)
- Agent type badge (Griot, Listener, Weaver, Strategist)
- Date display with formatting
- External link icon for published content
- Hover scale animation
- Line-clamped body text (max 3 lines)

**Platform Colors**:
- Instagram: Pink
- LinkedIn: Blue
- Twitter: Sky blue
- Facebook: Indigo
- TikTok: Gray
- YouTube: Red

**File**: `src/components/shared/ContentCard.tsx:1`

## Hooks and Services

### usePublishedContent

**Purpose**: Fetch published content from database
**Returns**: `{ content, isLoading, error }`

**Behavior**:
1. Checks if Supabase is configured
2. If not configured → uses mock data (3 sample posts)
3. If configured → fetches from `content` table where `status = 'published'`
4. If fetch fails → fallback to mock data
5. If no data returned → fallback to mock data

**Mock Content**: 3 sample posts representing different agent types

**File**: `src/hooks/usePublishedContent.ts:1`

### fetchPublishedAnnouncements

**Purpose**: Fetch published announcements from database
**Parameters**: `limit` (default: 10)
**Returns**: `{ data: Announcement[] | null, error: string | null }`

**Query**:
```sql
SELECT * FROM announcements
WHERE status = 'published'
  AND deleted_at IS NULL
ORDER BY priority DESC, display_date DESC
LIMIT 10
```

**Mock Announcements**: 3 sample announcements if database unavailable

**File**: `src/services/announcementsService.ts:1`

## Type Definitions

### Content

```typescript
export interface Content {
  id: string;
  title: string;
  body: string;
  contentType?: 'post' | 'article' | 'video' | 'event';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  platforms: PlatformType[];
  publishedAt?: Date;
  scheduledFor?: Date;
  agentType?: AgentType;
  engagementMetrics?: EngagementMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export type PlatformType =
  | 'instagram'
  | 'linkedin'
  | 'twitter'
  | 'facebook'
  | 'tiktok'
  | 'youtube';

export type AgentType =
  | 'griot'      // Storyteller
  | 'listener'   // Intelligence
  | 'weaver'     // Engagement
  | 'strategist'; // Planning
```

**File**: `src/types/content.ts:1`

### Announcement

```typescript
export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: AnnouncementCategory;
  link?: string;
  authorName?: string;
}

export type AnnouncementCategory =
  | 'event'
  | 'update'
  | 'campaign'
  | 'urgent';
```

**File**: `src/types/announcements.ts:1`

## Styling and Theming

### Liberation Theme Colors

The enhanced Discover Page uses the BLKOUT liberation theme:

- **Primary**: Purple (`purple-600`, `purple-500`)
- **Accent**: Pink (`pink-600`, `pink-500`)
- **Community**: Emerald (`emerald-500`)
- **Campaigns**: Amber (`amber-500`)
- **Updates**: Indigo (`indigo-600`)

### Dark Mode

All components support dark mode via Tailwind's `dark:` prefix:
```tsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

### Animations

Framer Motion animations for:
- Page entrance (staggered)
- Component reveals (fade + slide)
- Hover states (scale, translate)
- Loading states (spin)

## Filtering and Search

### Platform Filter

Dropdown to filter content by platform:
- All Platforms (default)
- Instagram
- LinkedIn
- Twitter
- Facebook
- TikTok
- YouTube

**Implementation**:
```typescript
const filteredContent = content.filter((item) =>
  selectedPlatform === 'all' || item.platforms.includes(selectedPlatform)
);
```

### Search Query

Text input to search by title or body:
```typescript
const matchesSearch =
  searchQuery === '' ||
  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.body.toLowerCase().includes(searchQuery.toLowerCase());
```

## Loading and Error States

### Loading State
- Animated spinner (purple)
- "Loading content..." message
- Centered on page

### Error State (Announcements)
- Amber alert box
- "Unable to load announcements" message
- Explanation of fallback behavior
- "Try again" button to retry

### Empty State
- No content icon
- "No content found" message
- Conditional message based on filters
- Encourages adjusting filters or checking back

## Activating the Enhanced Discover Page

### Option 1: Replace Original File

```bash
cd /home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform/src/components/pages
mv DiscoverPage.tsx DiscoverPage.tsx.old
mv DiscoverPage.enhanced.tsx DiscoverPage.tsx
```

### Option 2: Update Router Import

In your routing file:
```typescript
// Before
import DiscoverPage from './components/pages/DiscoverPage';

// After
import DiscoverPage from './components/pages/DiscoverPage.enhanced';
```

### Option 3: Conditional Rendering

```typescript
// Enable via feature flag
const useEnhancedDiscover = import.meta.env.VITE_USE_ENHANCED_DISCOVER === 'true';

{useEnhancedDiscover ? <DiscoverPageEnhanced /> : <DiscoverPage />}
```

## Testing the Integration

### 1. Local Development Test

```bash
# Terminal 1: Run community platform
cd /home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform
npm run dev

# Terminal 2: Run comms-blkout admin
cd /home/robbe/ACTIVE_PROJECTS/comms-blkout
npm run dev
```

### 2. Create Test Content

1. Navigate to comms-blkout admin (localhost:5174)
2. Go to Content → Create New
3. Select an AI agent (e.g., Griot)
4. Fill in title, body, select platforms
5. Set status to "Published"
6. Save

### 3. Verify on Discover Page

1. Navigate to community platform (localhost:5173)
2. Go to Discover page
3. Refresh the page
4. Verify your test content appears in the grid

### 4. Test Filtering

1. Use platform dropdown to filter by specific platform
2. Use search box to search for content by keyword
3. Verify filtering works correctly

### 5. Test Mock Fallback

1. Set `VITE_SUPABASE_URL` to placeholder value in `.env`
2. Restart dev server
3. Verify mock content displays
4. Check for "Demo Mode" badge on announcements

## Troubleshooting

### Content Not Appearing

**Issue**: Created content in admin but not showing on discover page

**Solutions**:
1. Verify content status is set to "published"
2. Check Supabase connection (same credentials in both platforms)
3. Check browser console for errors
4. Verify `content` table exists in database
5. Check RLS policies allow public read of published content

### Styling Issues

**Issue**: Components look broken or unstyled

**Solutions**:
1. Verify Tailwind CSS is configured properly
2. Check that all component dependencies are imported
3. Ensure `framer-motion` is installed: `npm install framer-motion`
4. Verify dark mode is working (toggle system theme)

### YouTube Embed Not Loading

**Issue**: YouTube section is blank

**Solutions**:
1. Check browser console for CORS errors
2. Verify playlist ID is correct: `PLQIvk5RMvEWxx_xt-vvwKS8k-D7eRRnDh`
3. Ensure YouTube embed is not blocked by ad blocker
4. Check network tab for failed iframe requests

### Mock Data Showing Instead of Real Data

**Issue**: Seeing sample content instead of database content

**Solutions**:
1. Verify `VITE_SUPABASE_URL` is not set to placeholder
2. Check Supabase credentials are correct
3. Ensure database has published content
4. Check browser console for "using mock content data" message
5. Verify network requests are reaching Supabase

## Performance Optimization

### Image Optimization (Future)

When adding images to content:
```typescript
// Use Next.js Image component or similar
<img src={content.image} alt={content.title} loading="lazy" />
```

### Pagination (Future)

For large content libraries:
```typescript
const { content, isLoading, loadMore, hasMore } = usePublishedContent({
  limit: 12,
  offset: page * 12
});
```

### Caching (Future)

Implement React Query for better data management:
```typescript
import { useQuery } from '@tanstack/react-query';

const { data: content } = useQuery({
  queryKey: ['published-content'],
  queryFn: fetchPublishedContent,
  staleTime: 5 * 60 * 1000 // 5 minutes
});
```

## Accessibility

All components include accessibility features:
- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states on interactive elements
- Sufficient color contrast ratios
- Screen reader friendly

## Browser Support

The enhanced Discover Page supports:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Next Steps

After successful integration:

1. **Monitor Usage**: Track which content gets most engagement
2. **Gather Feedback**: Ask community members about discover page experience
3. **Iterate on AI Agents**: Refine agent prompts based on content performance
4. **Add Features**: Consider recommendations, bookmarks, sharing
5. **Optimize Performance**: Implement pagination, caching, lazy loading

## Support

For questions or issues:
- Check main INTEGRATION.md document
- Review comms-blkout DEPLOYMENT.md
- Contact: platform@blkoutuk.com

---

*The enhanced Discover Page brings together community content, AI-powered storytelling, and liberation values in one dynamic experience.*
