# Chrome Extensions - Deployment Summary

## ✅ COMPLETE - Ready for Deployment

Both Chrome extensions have been created, packaged, and configured with the correct admin dashboard URLs.

---

## 📦 Packaged Extensions

**Location:** `public/extensions/`

- `blkout-events-curator-v1.0.0.zip` (102 KB)
- `blkout-news-curator-v1.0.0.zip` (94 KB)

**Public URLs (after deployment):**
- Events: `https://blkout.vercel.app/extensions/blkout-events-curator-v1.0.0.zip`
- News: `https://blkout.vercel.app/extensions/blkout-news-curator-v1.0.0.zip`

---

## 🎯 Admin Dashboard URLs

**IMPORTANT:** Each extension links to its own separate admin dashboard:

### Events Extension
- **Dashboard URL:** `https://events-blkout.vercel.app/admin`
- Submits to: `/api/events/moderation-queue`
- Opens dashboard after submission

### News Extension
- **Dashboard URL:** `https://news-blkout.vercel.app/admin`
- Submits to: `/api/news/moderation-queue`
- Opens dashboard after submission

---

## 🔧 ModerationTools Widget

**Component:** `src/components/moderation/ModerationTools.tsx`

**Features:**
- Download buttons for both extensions
- "View Dashboard" links to respective admin dashboards
- Installation instructions
- Curator stats display (when userRole = 'curator')

**Integration:**

Add to your admin dashboard:

```tsx
import { ModerationTools } from '@/components/moderation/ModerationTools';

// In admin dashboard component:
<ModerationTools userRole="admin" />
```

The widget includes direct links to:
- Events Dashboard: `https://events-blkout.vercel.app/admin`
- News Dashboard: `https://news-blkout.vercel.app/admin`

---

## 🎨 Extension Features

### Both Extensions Include:

**Core Functionality:**
- ✅ Auto-extraction from Schema.org, Open Graph, platform-specific sources
- ✅ Image management (select up to 5 extracted + upload images)
- ✅ Manual image upload (5MB max per image, JPG/PNG/WebP)
- ✅ Edit-before-approve workflow (all submissions go to moderation queue)
- ✅ Offline capability (local storage backup if API unavailable)
- ✅ Form validation (required fields, date ranges, file sizes)
- ✅ Dashboard integration (prompts to open admin dashboard after submission)

**Events Extension:**
- Extracts from: Eventbrite, Meetup, Facebook Events, Schema.org
- Fields: Title, dates, location, organizer, description, capacity, price, tags, accessibility
- Theme: Blue/purple gradient (📅 calendar icon)

**News Extension:**
- Extracts from: News sites with JSON-LD, Open Graph, Twitter Cards
- Fields: Headline, author, publication, summary, content, category, tags, content warnings
- Auto-detects: Content warnings for sensitive topics
- Theme: Orange/red gradient (📰 newspaper icon)

---

## 📝 Deployment Checklist

### Before Deploying:

- [x] Extensions packaged as ZIP files
- [x] Correct dashboard URLs configured
- [x] ModerationTools widget created
- [x] Icons uploaded and resized
- [x] Background workers configured
- [x] Content scripts created

### To Deploy:

1. **Deploy main app** (fresh-blkout)
   - The `public/extensions/` folder will be served automatically
   - Extensions will be available at the public URLs

2. **Add ModerationTools widget to admin dashboard**
   - Import the component
   - Add `<ModerationTools userRole="admin" />` to the dashboard

3. **Test the workflow:**
   - Admin logs in → sees ModerationTools widget
   - Downloads extension → installs in Chrome
   - Visits event/news page → clicks extension icon
   - Data auto-extracted → submits to queue
   - Dashboard link opens correct admin panel

---

## 👥 Curator Workflow

### 1. Admin Approves Curator
- Curator applies via website
- Admin reviews and approves
- Admin notifies curator

### 2. Curator Downloads Extension
- Curator logs into admin area (or dedicated curator portal)
- Sees ModerationTools widget
- Downloads appropriate extension(s)

### 3. Curator Installs Extension
1. Download ZIP file
2. Extract to folder (e.g., `Documents/BLKOUT Extensions/`)
3. Open Chrome → `chrome://extensions/`
4. Enable "Developer mode" (top-right toggle)
5. Click "Load unpacked" → select extracted folder
6. Extension icon appears in toolbar

### 4. Curator Starts Curating
- Visit event/news page
- Click extension icon
- Review auto-extracted data
- Add/select images
- Edit fields as needed
- Submit to moderation queue
- Dashboard opens for review

### 5. Admin Reviews & Publishes
- Reviews submission in appropriate dashboard:
  - Events: `events-blkout.vercel.app/admin`
  - News: `news-blkout.vercel.app/admin`
- Edits if needed
- Approves → content goes live

---

## 🔄 Future Updates

When updating extensions:

1. **Update code** in `chrome-extension-events/` or `chrome-extension-news/`
2. **Increment version** in `manifest.json`
3. **Repackage:**
   ```bash
   cd /path/to/fresh-blkout
   python3 -c "
   import zipfile
   import os
   
   # Events
   with zipfile.ZipFile('public/extensions/blkout-events-curator-v1.1.0.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
       for root, dirs, files in os.walk('chrome-extension-events'):
           dirs[:] = [d for d in dirs if d not in ['node_modules', '.git']]
           for file in files:
               if not file.endswith(('.md', '.DS_Store', ':Zone.Identifier')):
                   file_path = os.path.join(root, file)
                   arcname = os.path.relpath(file_path, 'chrome-extension-events')
                   zipf.write(file_path, arcname)
   
   # News
   with zipfile.ZipFile('public/extensions/blkout-news-curator-v1.1.0.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
       for root, dirs, files in os.walk('chrome-extension-news'):
           dirs[:] = [d for d in dirs if d not in ['node_modules', '.git']]
           for file in files:
               if not file.endswith(('.md', '.DS_Store', ':Zone.Identifier')):
                   file_path = os.path.join(root, file)
                   arcname = os.path.relpath(file_path, 'chrome-extension-news')
                   zipf.write(file_path, arcname)
   "
   ```
4. **Update ModerationTools.tsx** with new version numbers
5. **Deploy** updated app
6. **Notify curators** to download new version

---

## 🎉 Summary

Everything is ready! The extensions will:
- Extract event/news data automatically
- Allow image selection and upload
- Submit to the correct moderation queues
- Link to the correct admin dashboards
- Work offline with local storage backup

Curators can start using them immediately after deployment.

---

*Created: 2025-10-06*
*Version: 1.0.0*
