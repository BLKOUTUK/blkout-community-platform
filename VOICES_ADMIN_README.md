# BLKOUT Voices Admin & Staging Area

## Overview

The Voices Admin interface provides a comprehensive system for managing article pitches, reviewing submissions, and publishing editorial content on the BLKOUT platform.

## Features

### 1. **Article Pitch Staging System**
- Review community-submitted article pitches
- Approve or reject pitches with reviewer notes
- Track pitch status (pending, approved, rejected, in review)
- Filter pitches by status
- Convert approved pitches directly to article drafts

### 2. **Article Management**
- View all articles (published and drafts)
- Edit existing articles
- Toggle publish/unpublish status
- Feature/unfeature articles for homepage
- Delete articles
- Filter by status (all, published, draft)

### 3. **Rich Article Editor**
- Create new articles from scratch
- Convert approved pitches to full articles
- Full markdown support for content
- Set article metadata (author, category, tags)
- Upload hero images and thumbnails
- Set alt text for accessibility
- Preview article before publishing
- Save as draft or publish immediately

## Access

Navigate to: **Admin Dashboard → Voices Editorial Tab**

URL: `https://blkout-community-platform.vercel.app/admin` → Click "Voices Editorial"

## Workflow

### Pitch Review Workflow

1. **Review Submitted Pitches**
   - Navigate to "Pitch Staging" tab
   - Filter by "Pending" to see new submissions
   - Review pitch details:
     - Title
     - Author name and email
     - Category
     - Pitch content
     - Target word count
     - Deadline (if specified)

2. **Approve or Reject**
   - Click "Approve" to accept pitch
   - Click "Reject" to decline pitch
   - Add reviewer notes (optional)
   - Approved pitches appear in "Approved" filter

3. **Create Article from Pitch**
   - Click "Create Article" on approved pitch
   - System pre-fills editor with pitch content
   - Complete article content
   - Add images, tags, and metadata
   - Save as draft or publish

### Article Publishing Workflow

1. **Create New Article**
   - Click "New Article" button in header
   - OR create from approved pitch
   - Fill in all required fields:
     - Title *
     - Author *
     - Category *
     - Excerpt *
     - Content *

2. **Add Metadata**
   - Select category (Opinion, Analysis, Editorial, Community Voice, Liberation Thought)
   - Add tags (comma-separated)
   - Upload hero image URL
   - Upload thumbnail image URL
   - Add alt text for images (accessibility)

3. **Set Status**
   - Check "Feature this article" to highlight on homepage
   - Check "Publish immediately" to make live
   - Leave unchecked to save as draft

4. **Save & Publish**
   - Click "Create Article" or "Update Article"
   - Article appears in Article Management tab
   - Published articles visible on `/voices` page

### Article Management

1. **Edit Existing Articles**
   - Navigate to "Article Management" tab
   - Click "Edit" on any article
   - Make changes in editor
   - Click "Update Article" to save

2. **Toggle Publish Status**
   - Click "Publish" to make draft live
   - Click "Unpublish" to revert to draft
   - Published date automatically set

3. **Feature Articles**
   - Click "Feature" to highlight on homepage
   - Click "Unfeature" to remove from featured
   - Maximum 5 featured articles recommended

4. **Delete Articles**
   - Click "Delete" button
   - Confirm deletion (cannot be undone)
   - Article permanently removed

## Database Schema

### `article_pitches` Table

```sql
- id: UUID (primary key)
- name: TEXT (author name)
- email: TEXT (author email)
- title: TEXT (pitch title)
- category: TEXT (opinion, analysis, editorial, community, liberation)
- pitch: TEXT (pitch content)
- word_count: INTEGER (target word count)
- deadline: TIMESTAMPTZ (optional deadline)
- status: TEXT (pending, approved, rejected, in_review)
- submitted_at: TIMESTAMPTZ
- reviewed_at: TIMESTAMPTZ
- reviewer_notes: TEXT
```

### `voices_articles` Table

```sql
- id: UUID (primary key)
- title: TEXT
- content: TEXT (markdown supported)
- excerpt: TEXT (200 chars)
- author: TEXT
- category: TEXT (opinion, analysis, editorial, community, liberation)
- tags: TEXT[] (array of tags)
- featured: BOOLEAN
- published: BOOLEAN
- slug: TEXT (unique URL identifier)
- hero_image: TEXT (URL)
- hero_image_alt: TEXT
- thumbnail_image: TEXT (URL)
- thumbnail_alt: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- published_at: TIMESTAMPTZ
```

## Categories

1. **Opinion** - Personal perspectives and viewpoints
2. **Analysis** - In-depth examination of issues
3. **Editorial** - Official platform positions
4. **Community Voice** - Community member stories
5. **Liberation Thought** - Liberation philosophy and theory

## Content Guidelines

### Pitch Approval Criteria

- ✅ Centers Black QTIPOC+ voices and experiences
- ✅ Aligns with liberation values
- ✅ Original perspective or analysis
- ✅ Clearly articulated pitch
- ✅ Realistic word count and timeline
- ❌ Duplicates existing content
- ❌ Contains hate speech or discrimination
- ❌ Poorly written or unclear

### Article Publishing Standards

- **Length**: 500-2000 words recommended
- **Formatting**: Use markdown headers, paragraphs
- **Images**: Include hero image and thumbnail
- **Accessibility**: Always add alt text for images
- **Excerpts**: 150-200 characters
- **Tags**: 3-5 relevant tags
- **SEO**: Descriptive titles and slugs

## Stats Dashboard

The admin interface displays key metrics:

- **Total Articles**: All articles in system
- **Published Articles**: Live on platform
- **Draft Articles**: Unpublished drafts
- **Featured Articles**: Currently featured
- **Pending Pitches**: Awaiting review
- **Approved Pitches**: Ready for article creation

## Tips & Best Practices

### For Pitch Review

1. **Respond Promptly**: Review pitches within 48 hours
2. **Provide Feedback**: Add reviewer notes for rejected pitches
3. **Track Deadlines**: Prioritize time-sensitive pitches
4. **Communicate**: Email authors about pitch status

### For Article Editing

1. **Proofread**: Check spelling and grammar before publishing
2. **Link Verification**: Ensure all external links work
3. **Image Quality**: Use high-resolution images (1200x800 recommended)
4. **Mobile Preview**: Check how content looks on mobile
5. **SEO Optimization**: Use descriptive titles and tags

### For Content Management

1. **Update Regularly**: Refresh featured articles weekly
2. **Archive Old Content**: Unpublish outdated articles
3. **Track Performance**: Monitor which categories perform best
4. **Community Engagement**: Highlight diverse community voices
5. **Backup**: Export content regularly (feature coming soon)

## Markdown Support

The editor supports full markdown syntax:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet list item
- Another item

1. Numbered list
2. Second item

[Link text](https://example.com)

> Blockquote
```

## Troubleshooting

### Pitch Not Loading
- Check database connection
- Verify Supabase credentials
- Check browser console for errors

### Images Not Displaying
- Verify image URLs are accessible
- Check CORS settings on image host
- Use direct image URLs (not landing pages)

### Publish Button Not Working
- Ensure all required fields filled
- Check for validation errors
- Verify user permissions

### Articles Not Appearing on `/voices`
- Confirm article is published (not draft)
- Check published_at timestamp is set
- Clear browser cache
- Verify slug is unique

## API Endpoints

### Submit Article Pitch
```
POST /api/voices/submit-pitch
Body: { name, email, title, category, pitch, word_count?, deadline? }
```

### Get Published Articles
```
voicesAPI.getPublishedArticles()
```

### Get All Articles (Admin)
```
voicesAPI.getAllArticles()
```

### Create Article
```
voicesAPI.createArticle(articleData)
```

### Update Article
```
voicesAPI.updateArticle(id, updates)
```

### Toggle Published
```
voicesAPI.togglePublished(id, published)
```

### Toggle Featured
```
voicesAPI.toggleFeatured(id, featured)
```

### Delete Article
```
voicesAPI.deleteArticle(id)
```

## Future Enhancements

- [ ] Email notifications for pitch status changes
- [ ] Rich text WYSIWYG editor
- [ ] Image upload to Supabase storage
- [ ] Article scheduling for future publication
- [ ] Article analytics and metrics
- [ ] Comment moderation system
- [ ] Multi-author collaboration
- [ ] Version history and revisions
- [ ] Content export/import
- [ ] SEO preview and recommendations

## Support

For technical issues or questions:
- GitHub Issues: [blkout-community-platform](https://github.com/your-org/blkout-community-platform/issues)
- Email: admin@blkout.uk
- Discord: BLKOUT Community Server

## Migration

To set up the database tables, run:

```bash
cd /home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform
psql $DATABASE_URL -f database/migrations/002_voices_system.sql
```

Or via Supabase dashboard:
1. Go to SQL Editor
2. Copy contents of `database/migrations/002_voices_system.sql`
3. Execute the migration

---

**BLKOUT Liberation Platform** | Voices Admin Documentation | v1.0.0
