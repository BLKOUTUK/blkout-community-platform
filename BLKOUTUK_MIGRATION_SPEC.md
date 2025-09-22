# BLKOUTUK.COM Article Migration Specification

## Overview
Migration specification for 270+ articles from blkoutuk.com to the Liberation Platform Story Archive with full multimedia support.

## Data Structure

### Enhanced StoryArchiveItem Interface
```typescript
interface StoryArchiveItem {
  id: string;                    // Unique identifier
  title: string;                 // Article title
  excerpt: string;               // Short description for grid view
  content: string;               // Full article content (HTML preserved)
  category: string;              // Article category
  author: string;                // Author name
  publishedAt: string;           // Original publication date (ISO format)
  readTime: string;              // Estimated read time
  tags: string[];                // Content tags for filtering

  // Migration-specific fields
  originalUrl?: string;          // Original blkoutuk.com URL
  contentType?: 'article' | 'audio' | 'video' | 'gallery' | 'multimedia';
  blkoutTheme?: 'CONNECT' | 'CREATE' | 'CARE'; // Original blkoutuk.com themes

  // Media fields
  imageUrl?: string;             // Featured image
  audioUrl?: string;             // Audio content URL
  videoUrl?: string;             // Video content URL
  galleryImages?: string[];      // Array of gallery image URLs
}
```

## Content Types from blkoutuk.com

### 1. CONNECT - Community Articles
- **Focus**: Community connection, networking, experiences
- **Examples**: Community events, personal stories, social connections
- **Migration**: Standard article format with community-focused tags

### 2. CREATE - Cultural Content
- **Focus**: Artistic expression, creative works, cultural commentary
- **Examples**: Art features, creative writing, cultural analysis
- **Migration**: Support for gallery images, embedded media

### 3. CARE - Health & Leadership
- **Focus**: Health, wellness, leadership, personal development
- **Examples**: Health articles, leadership pieces, self-care content
- **Migration**: Standard article format with wellness-focused tags

## Enhanced Features for Migration

### Full-Page Reading Experience
- ✅ **Read**: Enhanced typography with proper prose styling
- ✅ **Listen**: Audio player integration with custom styling
- ✅ **Watch**: Video player with poster images and controls
- ✅ **Gallery**: Grid layout for multi-image content

### Content Type Indicators
- 🎵 Audio content: Volume icon in grid and detail view
- 🎬 Video content: Play icon in grid and detail view
- 🖼️ Gallery content: Image icon in grid and detail view
- 📖 Standard articles: No additional icons

### Navigation Enhancements
- Back to archive functionality
- Original article link preservation
- Theme-based visual indicators
- Mobile-responsive design

## API Integration Points

### Current API Endpoint
```
GET https://api.blkoutcollective.org/v1/story-archive
```

### Expected Response Format
```json
{
  "articles": [
    {
      "id": "article-001",
      "title": "Building Black Queer Community",
      "excerpt": "Exploring connections and community building...",
      "content": "<p>Full HTML content...</p>",
      "category": "community",
      "author": "Community Contributor",
      "publishedAt": "2023-01-15T00:00:00Z",
      "readTime": "5 min read",
      "tags": ["black-joy", "community-power"],
      "originalUrl": "https://blkoutuk.com/building-community",
      "contentType": "article",
      "blkoutTheme": "CONNECT",
      "imageUrl": "/images/articles/article-001.jpg"
    }
  ]
}
```

### Multimedia Content Examples
```json
{
  "id": "audio-story-001",
  "contentType": "audio",
  "audioUrl": "/audio/stories/story-001.mp3",
  "blkoutTheme": "CREATE"
}
```

```json
{
  "id": "video-story-001",
  "contentType": "video",
  "videoUrl": "/videos/stories/story-001.mp4",
  "blkoutTheme": "CREATE"
}
```

```json
{
  "id": "gallery-001",
  "contentType": "gallery",
  "galleryImages": [
    "/images/gallery/gallery-001-1.jpg",
    "/images/gallery/gallery-001-2.jpg"
  ],
  "blkoutTheme": "CREATE"
}
```

## Implementation Status

✅ **Enhanced Data Structure**: Complete multimedia support
✅ **Full-Page Reading**: Rich article detail view with navigation
✅ **Audio Support**: Custom audio player with community styling
✅ **Video Support**: Integrated video player with poster support
✅ **Gallery Support**: Responsive grid layout for multiple images
✅ **Theme Integration**: CONNECT/CREATE/CARE theme indicators
✅ **Original URL Preservation**: Links back to blkoutuk.com
✅ **Mobile Responsive**: Touch-friendly navigation and media controls

## Migration Checklist

### Content Migration
- [ ] Export all 270+ articles from blkoutuk.com
- [ ] Preserve original publication dates and author information
- [ ] Maintain content categorization (CONNECT/CREATE/CARE)
- [ ] Extract and migrate multimedia content
- [ ] Generate appropriate tags for filtering

### Media Migration
- [ ] Download and host featured images
- [ ] Extract and host audio content
- [ ] Extract and host video content
- [ ] Migrate gallery images
- [ ] Optimize media for web delivery

### API Implementation
- [ ] Update API to serve migrated content
- [ ] Implement content type filtering
- [ ] Add theme-based filtering
- [ ] Ensure proper pagination for 270+ articles

### Quality Assurance
- [ ] Test reading experience across devices
- [ ] Verify multimedia playback functionality
- [ ] Test navigation and filtering
- [ ] Validate content preservation and formatting

## Community Impact

This migration preserves the rich history of blkoutuk.com while enhancing it with:
- **Liberation Platform Integration**: Content lives within the community platform
- **Enhanced Accessibility**: Improved navigation and multimedia controls
- **Community Connection**: Integration with platform features like content rating
- **Narrative Sovereignty**: Community control over content presentation
- **Mobile Optimization**: Touch-friendly interface for all content types

The enhanced Story Archive serves as a bridge between blkoutuk.com's legacy and the Liberation Platform's future, ensuring no community voice is lost in the transition.