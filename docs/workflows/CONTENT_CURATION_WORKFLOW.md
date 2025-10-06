# BLKOUT Content Curation Workflow

## Overview

The BLKOUT platform uses a **edit-before-approve workflow** for all content submitted by volunteer curators. This ensures that all events and news articles are reviewed, edited, and validated before appearing on the public-facing website.

## Chrome Extensions

### 1. **BLKOUT Events Curator** (📅)
Chrome extension for discovering and curating community events.

**Icon**: Calendar/date-themed (blue/purple gradient)

**Features**:
- Auto-extracts event data from multiple sources:
  - **Schema.org JSON-LD** (highest confidence)
  - **Eventbrite** (platform-specific extraction)
  - **Meetup.com** (platform-specific extraction)
  - **Facebook Events** (basic extraction)
  - **Generic HTML** (fallback extraction)

- **Auto-extracted fields**:
  - Event title
  - Start/end date and time
  - Venue/location (physical address or online platform)
  - Organizer/host information
  - Event description
  - Capacity limits
  - Price/cost
  - Registration URLs
  - Event type (workshop, protest, conference, etc.)
  - Accessibility information
  - Relevant tags

- **Dashboard link**: `https://liberation.blkoutcollective.org/admin/events`

---

### 2. **BLKOUT News Curator** (📰)
Chrome extension for discovering and curating news articles and stories.

**Icon**: Newspaper/article-themed (orange/red gradient)

**Features**:
- Auto-extracts article data from multiple sources:
  - **Schema.org JSON-LD** (NewsArticle, Article, BlogPosting)
  - **Open Graph metadata**
  - **Twitter Card metadata**
  - **Generic HTML** (fallback extraction)

- **Auto-extracted fields**:
  - Article headline
  - Author(s)
  - Publication/source
  - Published date
  - Summary/excerpt
  - Article content (key excerpts)
  - Category (activism, justice, culture, policy, etc.)
  - Tags
  - Images
  - Content warnings (auto-detected)
  - Community relevance assessment

- **Dashboard link**: `https://liberation.blkoutcollective.org/admin/news`

---

## Content Submission Workflow

### Step 1: Discovery & Extraction
1. Curator visits an event page or news article
2. Clicks the Chrome extension icon
3. Extension automatically scrapes all available data
4. Shows data source confidence level:
   - ✅ **High confidence**: Schema.org JSON-LD or platform-specific
   - ⚡ **Medium confidence**: Open Graph/Twitter Card metadata
   - ⚠️ **Manual**: Generic HTML extraction (requires verification)

### Step 2: Review & Edit in Extension
1. Curator reviews all auto-extracted fields
2. **Required fields** are marked with `*` and validated
3. Curator edits/corrects any inaccurate data
4. Adds missing information (tags, accessibility, community relevance)
5. Validates date ranges, URLs, and other structured data

### Step 3: Submit to Moderation Queue
1. Curator clicks "Submit to [Events/News] Queue"
2. Content is validated for required fields
3. Submitted with status: `pending_review`
4. **Workflow metadata**:
   ```json
   {
     "stage": "curator_submission",
     "requiresReview": true,
     "requiresEdit": true,
     "canPublishDirectly": false
   }
   ```
5. Content is **NOT** published to the website yet

### Step 4: Admin Review & Edit (Dashboard)
**Location**: Admin dashboard (`/admin/events` or `/admin/news`)

**Admin capabilities**:
1. View all items in moderation queue
2. See curator submission with extracted data
3. **Edit all fields** before approval:
   - Fix typos, improve descriptions
   - Add/remove tags
   - Update dates, times, locations
   - Enhance content quality
   - Add accessibility notes
   - Set content warnings
4. Preview how content will appear on website
5. **Three possible actions**:
   - ✅ **Approve & Publish**: Content goes live immediately
   - ✏️ **Request Changes**: Send back to curator with notes
   - ❌ **Reject**: Remove from queue with reason

### Step 5: Publication
- Approved content appears on public website
- Curator receives notification of approval
- Curator stats updated (approval rate, total submissions)

---

## Data Collection Standards

### Events Extension Collects:
| Field | Required | Auto-Extracted | Notes |
|-------|----------|----------------|-------|
| Title | ✅ | Yes | From h1, Schema.org, or platform |
| Start Date/Time | ✅ | Yes | ISO format, validated |
| Location | ✅ | Yes | Address or "Online" |
| Description | ❌ | Yes | Trimmed to reasonable length |
| Organizer | ❌ | Yes | Host/organization name |
| End Date/Time | ❌ | Yes | Optional, must be after start |
| Event Type | ❌ | Yes | Auto-inferred from content |
| Capacity | ❌ | Sometimes | From ticket limits, RSVP caps |
| Price | ❌ | Yes | Free, £X, or "Sliding scale" |
| Registration URL | ❌ | Yes | Eventbrite, Meetup, etc. |
| Tags | ❌ | Yes | Liberation keywords auto-tagged |
| Accessibility | ❌ | Sometimes | Wheelchair, BSL, etc. |
| Images | ❌ | Yes | OG image or prominent photos |

### News Extension Collects:
| Field | Required | Auto-Extracted | Notes |
|-------|----------|----------------|-------|
| Headline | ✅ | Yes | From Schema.org or h1 |
| Summary | ✅ | Yes | Meta description or excerpt |
| Source URL | ✅ | Yes | Original article URL (readonly) |
| Author | ❌ | Yes | Byline or Schema.org author |
| Publication | ❌ | Yes | Publisher or site name |
| Published Date | ❌ | Yes | From Schema.org or time element |
| Category | ❌ | Yes | Auto-inferred, curator can override |
| Content/Excerpts | ❌ | Yes | Key paragraphs or quotes |
| Tags | ❌ | Yes | Liberation keywords auto-tagged |
| Community Relevance | ❌ | Yes | Auto-assessed, curator adds context |
| Content Warning | ❌ | Yes | Auto-detected for sensitive topics |
| Warning Text | ❌ | No | If CW enabled, curator provides text |
| Images | ❌ | Yes | Featured image from article |

---

## Validation Rules

### Events
- Start date must be in the future (warning if past)
- End date must be after start date
- Location required (can be "Online" or "TBA")
- Title must be at least 5 characters
- Description recommended (warning if empty)

### News
- Source URL must be valid and accessible
- Headline must be at least 10 characters
- Summary must be at least 50 characters
- Content warnings validated if sensitive keywords detected
- Published date should not be in future (warning)

---

## Curator Stats Tracking

Both extensions track:
- **Today's submissions**: Number of items submitted today
- **Approval rate**: % of submissions approved by admins
- **Queue size**: Total items awaiting review

Stats help curators understand:
- Their contribution volume
- Content quality (approval rate)
- Platform activity level

---

## API Endpoints

### Events
```
POST /api/events/moderation-queue
GET  /api/events/moderation-queue/size
GET  /api/events/moderation-queue/items
PUT  /api/events/moderation-queue/:id (admin edit)
POST /api/events/moderation-queue/:id/approve (admin)
POST /api/events/moderation-queue/:id/reject (admin)
```

### News
```
POST /api/news/moderation-queue
GET  /api/news/moderation-queue/size
GET  /api/news/moderation-queue/items
PUT  /api/news/moderation-queue/:id (admin edit)
POST /api/news/moderation-queue/:id/approve (admin)
POST /api/news/moderation-queue/:id/reject (admin)
```

---

## Local Storage Fallback

If API is unavailable:
1. Extensions save submissions to local Chrome storage
2. Content stored with timestamp and status
3. Auto-syncs when connection restored
4. Curator notified: "Content saved locally (will sync when online)"

---

## Benefits of Edit-Before-Approve Workflow

1. **Quality Control**: Every piece of content reviewed by admin before publication
2. **Consistency**: Admins ensure style guide compliance
3. **Safety**: Content warnings and sensitive content properly handled
4. **Accuracy**: Dates, locations, facts verified before going live
5. **Community Trust**: Only high-quality, relevant content reaches audience
6. **Curator Training**: Curators see what gets approved/rejected, improving submissions
7. **Legal Protection**: Admins can catch problematic content before publication

---

## Curator Best Practices

1. **Verify auto-extracted data**: Don't blindly trust automation
2. **Add context**: Explain why content is relevant to BLKOUT community
3. **Use tags generously**: Helps with discoverability
4. **Fill accessibility info**: Make events inclusive
5. **Check content warnings**: Better safe than sorry
6. **Write clear summaries**: Help readers decide if content is for them
7. **Test registration links**: Ensure URLs work before submitting

---

## For Developers: Testing the Workflow

1. Load unpacked extension in Chrome (`chrome://extensions/`)
2. Visit an event page (e.g., Eventbrite, Meetup)
3. Click extension icon to trigger extraction
4. Review extracted data and submit
5. Check browser console for API calls
6. Verify data appears in moderation queue (dashboard)
7. Test admin approval/rejection flow
8. Confirm approved content appears on public site

---

*Version 1.0.0 | Last updated: 2025-10-05*
