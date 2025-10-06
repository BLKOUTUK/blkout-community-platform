# Simple Extension Distribution - Admin Dashboard

## Overview

**Simplest approach:** Just add download links to the admin dashboard. That's it!

---

## Implementation

### 1. Add Widget to Admin Dashboard

Created: `src/components/moderation/ModerationTools.tsx`

**Features:**
- Shows download links for both extensions
- Only visible to admins and curators
- Includes installation instructions
- Displays curator stats (if curator role)

**Usage:**
```tsx
import { ModerationTools } from '@/components/moderation/ModerationTools';

// In your admin dashboard:
<ModerationTools userRole="admin" />

// Or for curators:
<ModerationTools userRole="curator" />
```

---

### 2. Host ZIP Files in Public Folder

**File structure:**
```
public/
└── extensions/
    ├── blkout-events-curator-v1.0.0.zip
    ├── blkout-news-curator-v1.0.0.zip
    └── installation-guide.pdf
```

**When ready to distribute:**
1. Package extensions as ZIP files
2. Copy to `public/extensions/` folder
3. Deploy - files accessible at:
   - `https://liberation.blkoutcollective.org/extensions/blkout-events-curator-v1.0.0.zip`
   - `https://liberation.blkoutcollective.org/extensions/blkout-news-curator-v1.0.0.zip`

---

### 3. Access Control (Optional)

**Basic (current):** Anyone with admin dashboard access can download
- Admin dashboard already requires authentication
- If you can see the widget, you can download

**Advanced (optional later):**
Add middleware to protect `/extensions/` route:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/extensions')) {
    // Check if user is admin or curator
    const session = await getSession(request);
    if (!session || !['admin', 'curator'].includes(session.role)) {
      return new Response('Unauthorized', { status: 401 });
    }
  }
}
```

---

## User Flow

### For Admins/Curators:

1. **Log into admin dashboard**
   - `liberation.blkoutcollective.org/admin`

2. **See "Curator Tools" widget**
   - Two cards: Events Curator + News Curator
   - Download buttons

3. **Click "Download Extension"**
   - ZIP file downloads to computer

4. **Follow installation instructions** (shown in widget)
   - Extract ZIP
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Load unpacked extension

5. **Start curating!**
   - Visit event/news page
   - Click extension icon
   - Auto-extract data
   - Submit to moderation queue

---

## Installation Instructions (For Curators)

### Step-by-Step:

**1. Download**
- Click "Download Extension" in admin dashboard
- Save ZIP file (e.g., `blkout-events-curator-v1.0.0.zip`)

**2. Extract**
- Right-click ZIP → "Extract All"
- Choose location (e.g., `Documents/BLKOUT Extensions/`)
- Remember this folder location!

**3. Install in Chrome**
- Open Chrome
- Go to `chrome://extensions/`
- Turn ON "Developer mode" (toggle in top-right)
- Click "Load unpacked"
- Select the extracted folder
- Extension appears in toolbar

**4. Pin to Toolbar**
- Click puzzle piece icon in Chrome toolbar
- Find your extension
- Click pin icon to keep it visible

**5. Test It**
- Visit an event page (e.g., Eventbrite event)
- Click extension icon
- Should auto-extract event data
- Edit/review → Submit to queue

**Done!** 🎉

---

## Updating Extensions

### When you release a new version:

**1. Update ZIP files**
```bash
# Package new versions
cd chrome-extension-events
zip -r ../public/extensions/blkout-events-curator-v1.1.0.zip .

cd ../chrome-extension-news
zip -r ../public/extensions/blkout-news-curator-v1.1.0.zip .
```

**2. Update widget**
```tsx
// Update version numbers in ModerationTools.tsx
const fileName = type === 'events'
  ? 'blkout-events-curator-v1.1.0.zip'  // ← Update version
  : 'blkout-news-curator-v1.1.0.zip';   // ← Update version
```

**3. Notify curators**
- Post in admin dashboard: "New version available!"
- Or send email to curators
- Curators re-download and reinstall

**That's it!** No Chrome Web Store, no complex infrastructure.

---

## Benefits of This Approach

✅ **Simple**: Just host files, add widget, done
✅ **Fast**: Ready immediately, no approval wait
✅ **Free**: No costs, uses existing infrastructure
✅ **Controlled**: Only admins/curators can access
✅ **Flexible**: Easy to update and iterate

---

## What You Need to Do

### Immediate (to launch):

1. ✅ **Widget created**: `ModerationTools.tsx` ready to use
2. ⏳ **Add to dashboard**: Import widget in admin dashboard page
3. ⏳ **Package extensions**: Create ZIP files from extension folders
4. ⏳ **Copy to public**: Move ZIPs to `public/extensions/`
5. ⏳ **Deploy**: Push to production

### Before beta launch:

1. ⏳ **Create installation guide PDF**: Detailed visual guide
2. ⏳ **Test download flow**: Ensure ZIPs download correctly
3. ⏳ **Test installation**: Verify extensions install properly
4. ⏳ **Create demo video**: Short walkthrough (optional)

---

## Packaging Commands

When extensions are ready:

```bash
# From fresh-blkout directory

# Package Events Extension
cd chrome-extension-events
zip -r blkout-events-curator-v1.0.0.zip . -x "*.git*" -x "node_modules/*" -x "*.DS_Store"
mv blkout-events-curator-v1.0.0.zip ../public/extensions/

# Package News Extension
cd ../chrome-extension-news
zip -r blkout-news-curator-v1.0.0.zip . -x "*.git*" -x "node_modules/*" -x "*.DS_Store"
mv blkout-news-curator-v1.0.0.zip ../public/extensions/

# Done!
```

---

## Example Admin Dashboard Integration

```tsx
// src/app/admin/page.tsx or wherever admin dashboard lives

import { ModerationTools } from '@/components/moderation/ModerationTools';

export default function AdminDashboard() {
  const userRole = 'admin'; // Or get from session

  return (
    <div className="container mx-auto p-6">
      <h1>Admin Dashboard</h1>

      {/* Your existing admin content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats, charts, etc. */}
      </div>

      {/* Curator Tools Widget */}
      <div className="mb-6">
        <ModerationTools userRole={userRole} />
      </div>

      {/* More admin content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moderation queues, user management, etc. */}
      </div>
    </div>
  );
}
```

---

## That's It!

**No complex portal, no auth system, no Chrome Web Store submission.**

Just:
1. Host ZIPs in public folder
2. Add widget to admin dashboard
3. Curators download and install
4. Start curating

Simple and effective! 🚀

---

*Version 1.0.0 | Created: 2025-10-05*
