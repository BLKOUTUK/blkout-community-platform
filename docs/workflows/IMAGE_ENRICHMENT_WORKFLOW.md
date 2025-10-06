# BLKOUT Content Curation: Image Enrichment Workflow

## Overview

The BLKOUT Chrome extensions now include **comprehensive image handling** to create richer, more engaging content for the community. Images are automatically extracted from source pages and curators can add additional images manually.

---

## Image Features

### 1. **Auto-Extraction**
Both extensions automatically extract images from source pages:

**Events Extension:**
- Event posters/banners from Eventbrite, Meetup, Facebook
- Schema.org image fields
- Open Graph images (`og:image`)
- High-resolution images (>300x200px) from event pages

**News Extension:**
- Article featured images
- Schema.org NewsArticle images
- Open Graph images
- Twitter Card images
- Hero images from article content

### 2. **Image Selection**
Curators can:
- ✅ **Select** which auto-extracted images to include (up to 5 total)
- 🔄 **Deselect** images that aren't relevant or high-quality
- 🎯 **Auto-selection**: First image is automatically selected by default

### 3. **Manual Upload**
Curators can upload additional images:
- 📤 **Upload button** for adding custom images
- 📏 **Limits**: Maximum 5 images total, 5MB per image
- 📸 **Formats**: JPG, PNG, WebP supported
- 💾 **Storage**: Images converted to base64 for submission

### 4. **Image Management**
Rich image management interface:
- **Preview grid**: Visual thumbnails of all extracted images
- **Selection state**: Clear visual indicators (✓ Selected / Select)
- **Upload preview**: Separate grid for uploaded images
- **Remove functionality**: Easy removal of uploaded images
- **File info**: Display file size for uploaded images

---

## User Experience Flow

### For Events:

1. **Curator visits event page** (e.g., Eventbrite event)
2. **Extension auto-extracts images**:
   - Event poster
   - Venue photos
   - Organizer logos
3. **Image grid displays** with "Select" buttons
4. **First image auto-selected** (usually event poster)
5. **Curator reviews images**:
   - Selects high-quality, relevant images
   - Deselects low-quality or irrelevant images
   - Can upload additional venue photos or community images
6. **Selected images** (both extracted + uploaded) included in submission
7. **Admin dashboard** shows all images for final review/edit
8. **Published event** displays selected images in gallery

### For News:

1. **Curator visits news article**
2. **Extension auto-extracts images**:
   - Featured article image
   - Inline content images
   - Author photo (if relevant)
3. **Image grid displays** with "Select" buttons
4. **First image auto-selected** (usually featured image)
5. **Curator reviews images**:
   - Selects images that enhance story
   - Deselects duplicate or low-quality images
   - Can upload infographics or community photos related to story
6. **Selected images** included in submission
7. **Admin dashboard** shows all images for final review/edit
8. **Published article** displays selected images with content

---

## Technical Implementation

### Image Data Structure

**For Auto-Extracted Images:**
```json
{
  "images": {
    "selected": [
      "https://cdn.eventbrite.com/event-poster.jpg",
      "https://venue.com/photos/main.jpg"
    ],
    "uploaded": [
      {
        "name": "community-photo.jpg",
        "size": 245678,
        "type": "image/jpeg",
        "data": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        "uploadedAt": "2025-10-05T14:30:00Z"
      }
    ],
    "total": 3
  }
}
```

### Validation Rules

**Size Limits:**
- Maximum 5 images per submission (extracted + uploaded combined)
- Maximum 5MB per uploaded image
- No size limit for auto-extracted images (loaded from URLs)

**Format Requirements:**
- **Uploaded**: JPG, PNG, WebP only
- **Extracted**: Any format (loaded from source URLs)

**Quality Checks:**
- Minimum dimensions for auto-extraction: 300x200px
- Filters out icons, logos, and tiny images automatically

---

## Image Display in Moderation Queue

### Admin Dashboard View:

**Image Gallery Section:**
```
┌─────────────────────────────────────────┐
│  EVENT/ARTICLE IMAGES (3)               │
├─────────────────────────────────────────┤
│                                         │
│  [Image 1]     [Image 2]     [Image 3] │
│  Selected      Selected      Uploaded   │
│  🗑️ Remove     🗑️ Remove     🗑️ Remove   │
│  ⭐ Set Featured ⭐ Set Featured         │
│                                         │
│  [+ Upload More Images]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Admin Capabilities:**
- ✏️ **Edit**: Crop, resize, or replace images
- 🗑️ **Remove**: Delete unwanted images
- ⭐ **Set Featured**: Choose which image appears first
- 📤 **Upload**: Add more images during review
- 🔄 **Reorder**: Drag-and-drop to reorder image sequence
- ✅ **Preview**: See how images will appear on website

---

## Benefits for User Experience

### For Content Consumers:

1. **Visual Engagement**: Rich, image-filled content is more engaging
2. **Context**: Images provide immediate visual context (venue, speakers, article subject)
3. **Accessibility**: Alt text auto-generated from image context
4. **Mobile Experience**: Optimized image loading for mobile devices
5. **Social Sharing**: Images included when content shared on social media

### For Curators:

1. **Speed**: Auto-extraction saves time manually finding images
2. **Quality Control**: Selection interface ensures only best images used
3. **Flexibility**: Can add custom images to enhance content
4. **Feedback**: Visual preview before submission
5. **Easy Corrections**: Can adjust image selection before submitting

### For Admins:

1. **Review Power**: Final say on which images appear
2. **Quality Assurance**: Can reject low-quality images
3. **Legal Safety**: Can remove potentially copyrighted or problematic images
4. **Consistency**: Ensure images match platform style guidelines
5. **Enhancement**: Can add better images during review process

---

## Image Optimization

### Auto-Optimization (Future Enhancement):
- Automatic resizing to optimal dimensions
- WebP conversion for smaller file sizes
- Lazy loading for improved page performance
- Responsive image srcsets generated
- CDN delivery for faster loading

### Accessibility:
- Alt text fields for all images
- Image descriptions for screen readers
- High contrast mode support
- Keyboard navigation for image selection

---

## Storage & Performance

### Extension Storage:
- **Extracted images**: Stored as URLs (minimal storage)
- **Uploaded images**: Stored as base64 in Chrome local storage
- **Auto-sync**: Syncs to server when API available
- **Local backup**: Retains images even if submission fails

### Server-Side:
- **CDN Upload**: Uploaded images sent to CDN/S3
- **URL Storage**: Extracted image URLs stored in database
- **Thumbnail Generation**: Automated thumbnail creation
- **Optimization**: Server-side image optimization pipeline

### Performance Considerations:
- **Lazy Loading**: Images loaded only when visible
- **Progressive Loading**: Show low-res placeholder first
- **Caching**: Aggressive browser caching for images
- **Compression**: Automatic compression during upload

---

## Example Use Cases

### Case 1: Community March Event
**Scenario**: Curator finds a march organized on Eventbrite

**Auto-Extracted:**
- Event poster with march route
- Photo of organizers
- Historical march photos from description

**Curator Actions:**
- ✓ Selects event poster (auto-selected)
- ✓ Selects historical march photo
- ✗ Deselects blurry organizer photo
- 📤 Uploads high-res community solidarity photo

**Result**: Event published with 3 high-quality, relevant images

---

### Case 2: News Article About Policy Change
**Scenario**: Curator finds article about new legislation

**Auto-Extracted:**
- Featured article image (generic stock photo)
- Photo of politician
- Infographic about policy

**Curator Actions:**
- ✗ Deselects generic stock photo
- ✓ Selects politician photo (auto-selected as first alternative)
- ✓ Selects policy infographic
- 📤 Uploads community impact photo

**Result**: Article published with 3 contextual, informative images

---

### Case 3: Workshop Event
**Scenario**: Curator finds workshop on Meetup

**Auto-Extracted:**
- Meetup group logo (small, low-quality)
- Venue exterior photo
- No other images found

**Curator Actions:**
- ✗ Deselects low-quality logo
- ✓ Selects venue photo
- 📤 Uploads workshop materials photo
- 📤 Uploads facilitator headshot
- 📤 Uploads previous workshop group photo

**Result**: Event published with 4 rich, engaging images

---

## Future Enhancements

### Planned Features:
1. **AI-Powered Tagging**: Auto-tag images for better searchability
2. **Duplicate Detection**: Automatically detect and remove duplicate images
3. **Image Editing**: Built-in crop/rotate/filter tools
4. **Copyright Check**: Warn about potentially copyrighted images
5. **Image Recommendations**: AI suggests best images from multiple sources
6. **Community Image Library**: Reusable community-owned image collection
7. **Image Attribution**: Automatic photographer/source attribution
8. **Accessibility Scanning**: Auto-generate descriptive alt text

### Integration Possibilities:
- **Unsplash Integration**: Suggest free stock images if none found
- **Community Photo Uploads**: Users can submit community event photos
- **Instagram Integration**: Pull images from event/organization Instagram
- **Archive Integration**: Access to BLKOUT historical photo archive

---

## Best Practices for Curators

### Image Selection Guidelines:

✅ **DO:**
- Select high-resolution, clear images
- Choose images that represent the content accurately
- Include diverse representation when possible
- Verify image permissions and attribution
- Select images with good lighting and composition
- Include accessibility info (describe what's in image)

❌ **DON'T:**
- Select blurry or pixelated images
- Use copyrighted images without permission
- Include images with visible branding (unless relevant)
- Select images that misrepresent the content
- Upload images with sensitive/private information
- Use images with poor contrast or visibility

### Upload Recommendations:

1. **Event Photos**: Action shots, venue photos, speaker headshots
2. **News Articles**: Infographics, community impact photos, relevant context images
3. **File Preparation**: Crop/edit images before upload for best quality
4. **Attribution**: Note photo source in curator notes if applicable
5. **Diversity**: Include images that reflect our community's diversity

---

*Version 1.0.0 | Last updated: 2025-10-05*
*Part of BLKOUT Content Curation System*
