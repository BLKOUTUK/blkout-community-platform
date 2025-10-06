# Chrome Extensions: Access & Distribution Guide

## Overview

The BLKOUT Chrome extensions are **volunteer curator tools** - they are NOT needed by regular community members. Only curators and admins who help moderate content need these extensions.

---

## Who Needs Which Extension?

### **Volunteer Curators**
People who help find and submit events/news for the platform.

**Need:**
- 📅 **Events Extension** (if curating events)
- 📰 **News Extension** (if curating news)
- Or **both** if doing both types of curation

**Don't Need:**
- Admin dashboard access (view-only access to see their submissions)
- Direct publish permissions (content goes through approval)

### **Admins/Moderators**
Team members who review, edit, and approve content before publication.

**Need:**
- 📅 **Events Extension** (optional, for quick submissions)
- 📰 **News Extension** (optional, for quick submissions)
- 🔐 **Admin dashboard access** (REQUIRED - for reviewing queue)

**Primary Workflow:**
- Admins mainly work in dashboard (`/admin/events` and `/admin/news`)
- Extensions are optional for admins (for quick personal submissions)

### **Regular Community Members**
People who just use the BLKOUT platform.

**Don't Need:**
- Any extensions
- Just visit website normally to view events, read news, etc.

---

## Distribution Options

### Option 1: **Direct Download from BLKOUT Website** (Recommended)

**Best for:**
- Controlled distribution to vetted curators only
- Easy updates and version management
- No Chrome Web Store approval delays
- Private/internal tool

**Setup:**
1. Host `.zip` files on BLKOUT website
2. Create download page: `https://liberation.blkoutcollective.org/curator-tools`
3. Require authentication (curator login) to access downloads
4. Include installation instructions

**Curator Access Flow:**
```
1. Curator applies to volunteer → Admin approves
2. Curator receives email with curator portal credentials
3. Curator logs into: liberation.blkoutcollective.org/curator-portal
4. Downloads appropriate extension(s) from tools page
5. Follows installation guide (see below)
6. Starts curating!
```

**File Structure on Website:**
```
/curator-tools/
├── index.html                          # Download page (auth required)
├── downloads/
│   ├── blkout-events-curator-v1.0.0.zip
│   ├── blkout-news-curator-v1.0.0.zip
│   └── installation-guide.pdf
└── updates/
    └── changelog.md
```

---

### Option 2: **Chrome Web Store** (Public Distribution)

**Best for:**
- Wider reach and discoverability
- Automatic updates for users
- Official Chrome security review
- Public visibility

**Considerations:**
- ⏱️ Takes 1-2 weeks for initial review
- 💰 One-time $5 developer fee
- 📝 Must follow Chrome Web Store policies
- 🔒 Less control over who installs

**Publishing Steps:**
1. Create Chrome Web Store developer account
2. Pay $5 developer fee (one-time)
3. Prepare store listing:
   - Title, description, screenshots
   - Privacy policy URL
   - Support email
4. Upload `.zip` file
5. Submit for review
6. Wait 1-2 weeks for approval
7. Extension goes live

**Store Listing (Example):**
```
Name: BLKOUT Events Curator
Developer: BLKOUT Collective
Category: Productivity
Description: Official content curation tool for BLKOUT
Liberation Platform volunteer curators. Quickly extract
and submit event information from Eventbrite, Meetup,
and other event platforms.

Permissions Required:
- activeTab: Read current page content
- storage: Save drafts and settings
- notifications: Notify on successful submissions

Privacy: No data is collected or shared with third parties.
All submissions go directly to BLKOUT moderation queue.
```

---

### Option 3: **Hybrid Approach** (Recommended)

**Best of both worlds:**

1. **Start with Direct Download:**
   - Launch immediately with direct downloads
   - Vet and train initial curator cohort
   - Gather feedback and fix bugs
   - Establish proven track record

2. **Later: Publish to Chrome Web Store:**
   - After 3-6 months of stable operation
   - Use it for wider curator recruitment
   - Makes onboarding easier for new curators
   - Automatic updates for all users

---

## Installation Methods

### Method 1: **Developer Mode (For Direct Downloads)**

**When to Use:**
- Installing from BLKOUT website downloads
- Testing new versions
- Development/beta versions

**Steps for Curators:**

1. **Download Extension**
   - Visit `liberation.blkoutcollective.org/curator-tools`
   - Log in with curator credentials
   - Download `blkout-events-curator-v1.0.0.zip`
   - Save to Downloads folder

2. **Extract ZIP File**
   - Right-click ZIP file → "Extract All"
   - Choose destination (e.g., `Documents/BLKOUT Extensions/`)
   - Remember folder location

3. **Install in Chrome**
   - Open Chrome
   - Go to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in top-right)
   - Click **"Load unpacked"**
   - Select the extracted folder
   - Extension icon appears in toolbar

4. **Pin Extension**
   - Click puzzle piece icon in Chrome toolbar
   - Find BLKOUT extension
   - Click pin icon to keep it visible

5. **Test Extension**
   - Visit an event page (e.g., Eventbrite)
   - Click extension icon
   - Should auto-extract event data

**Video Tutorial:**
Create screen recording showing these steps (2-3 minutes)

---

### Method 2: **Chrome Web Store (If Published)**

**Steps for Curators:**

1. **Visit Store Page**
   - Admin sends link to Chrome Web Store listing
   - Or search "BLKOUT Events Curator" in store

2. **Install**
   - Click "Add to Chrome"
   - Confirm permissions
   - Extension installs automatically

3. **Start Using**
   - Extension icon appears in toolbar
   - No developer mode needed
   - Auto-updates when new versions released

Much simpler! But requires Web Store approval.

---

## Curator Onboarding Flow

### **Step 1: Application & Approval**

**Curator Applies:**
- Fills out volunteer form on BLKOUT website
- Indicates interest in: Events, News, or Both
- Provides background/motivation

**Admin Reviews:**
- Checks application
- Conducts brief interview (optional)
- Approves or declines

### **Step 2: Account Setup**

**Admin Actions:**
- Creates curator account in system
- Assigns permissions (events, news, or both)
- Sends welcome email with credentials

**Email Template:**
```
Subject: Welcome to BLKOUT Content Curation Team!

Hi [Name],

Welcome! You've been approved as a volunteer curator for
BLKOUT Liberation Platform.

🔑 Your Curator Portal Access:
URL: https://liberation.blkoutcollective.org/curator-portal
Email: [email]
Temporary Password: [temp_password]
(Please change on first login)

📥 Next Steps:

1. Log into curator portal
2. Download your extension(s):
   - Events Curator (for event curation)
   - News Curator (for news curation)
3. Follow installation guide
4. Complete onboarding tutorial
5. Start curating!

📚 Resources:
- Installation Guide: [link]
- Video Tutorial: [link]
- Curator Handbook: [link]
- Support: curator-support@blkout.com

We're excited to have you on the team!

Solidarity,
BLKOUT Admin Team
```

### **Step 3: Extension Installation**

**Curator:**
- Logs into curator portal
- Downloads appropriate extension(s)
- Follows installation guide (video + written)
- Tests on sample event/article

### **Step 4: Training**

**Interactive Tutorial in Portal:**
- How to use extension (live demo)
- What makes good submissions
- Image selection guidelines
- Quality standards
- Community guidelines

**Practice Submissions:**
- Submit 2-3 test events/articles
- Admin reviews and provides feedback
- Curator learns from feedback

### **Step 5: Active Curation**

**Curator Starts:**
- Finds events/news in the wild
- Uses extension to submit
- Checks dashboard for approval status
- Improves based on admin feedback

---

## Access Control & Security

### **Curator Portal Authentication**

**Login Required:**
- Curator portal protected by authentication
- Download page requires valid curator account
- Can't download extensions without approval

**Database Schema:**
```sql
CREATE TABLE curators (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'curator',
  permissions JSONB DEFAULT '{"events": false, "news": false}',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id)
);

-- Permissions example:
-- {"events": true, "news": false} → Events curator only
-- {"events": true, "news": true}  → Both
```

### **Extension Access Control**

**API Authentication:**
- Extensions require valid curator ID
- Generated on first use, stored in Chrome storage
- API validates curator ID on each submission
- Invalid IDs rejected

**Implementation in Extension:**
```javascript
async getCuratorId() {
  const result = await chrome.storage.local.get(['curatorId', 'curatorEmail']);

  if (!result.curatorId) {
    // First time use - register with API
    const response = await fetch(`${this.apiEndpoint}/curators/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: await this.promptForEmail(),
        extensionVersion: this.version
      })
    });

    const data = await response.json();

    if (data.approved) {
      await chrome.storage.local.set({
        curatorId: data.curatorId,
        curatorEmail: data.email
      });
      return data.curatorId;
    } else {
      throw new Error('Curator account not approved. Please contact admin.');
    }
  }

  return result.curatorId;
}
```

---

## Distribution Workflow Diagram

```
┌─────────────────────────────────────────────────────┐
│  CURATOR APPLIES (website form)                     │
└───────────────┬─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────┐
│  ADMIN REVIEWS APPLICATION                          │
│  ├─ Approve → Create curator account                │
│  └─ Decline → Send rejection email                  │
└───────────────┬─────────────────────────────────────┘
                ↓ (if approved)
┌─────────────────────────────────────────────────────┐
│  ADMIN SENDS WELCOME EMAIL                          │
│  ├─ Curator portal credentials                      │
│  ├─ Installation guide link                         │
│  └─ Training resources                              │
└───────────────┬─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────┐
│  CURATOR LOGS INTO PORTAL                           │
│  ├─ Downloads extension(s)                          │
│  ├─ Watches video tutorial                          │
│  └─ Completes practice submissions                  │
└───────────────┬─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────┐
│  CURATOR INSTALLS EXTENSION                         │
│  ├─ Extract ZIP file                                │
│  ├─ Load unpacked in Chrome                         │
│  ├─ Register with email on first use                │
│  └─ Receive curator ID from API                     │
└───────────────┬─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────┐
│  CURATOR STARTS CURATING                            │
│  ├─ Find events/news in the wild                    │
│  ├─ Use extension to extract & submit               │
│  ├─ Admin reviews in dashboard                      │
│  └─ Content published after approval                │
└─────────────────────────────────────────────────────┘
```

---

## Managing Updates

### **Version Updates (Direct Download)**

**When New Version Released:**

1. **Admin Updates Files:**
   - Upload new ZIP to `/curator-tools/downloads/`
   - Update changelog
   - Increment version number

2. **Notify Curators:**
   - Email blast to all curators
   - In-app notification in curator portal
   - Update notification in extension (if possible)

3. **Curator Updates:**
   - Download new ZIP
   - Remove old extension from Chrome
   - Load new unpacked extension
   - Same curator ID persists (in Chrome storage)

**Email Template:**
```
Subject: New BLKOUT Events Curator Extension - v1.1.0

Hi Curators,

We've released a new version of the Events Curator extension
with improvements and bug fixes!

✨ What's New:
- Better image extraction from Eventbrite
- Fixed date parsing for UK format
- Improved offline mode
- New accessibility field

📥 How to Update:
1. Visit curator portal: [link]
2. Download v1.1.0
3. In Chrome, remove old extension
4. Install new version (same process as before)

Your curator ID and stats will be preserved.

Questions? Reply to this email.

Thanks for all you do!
BLKOUT Admin Team
```

### **Version Updates (Chrome Web Store)**

**Automatic!**
- Upload new version to Chrome Web Store
- Chrome auto-updates all curators within 24-48 hours
- No curator action needed
- Much better user experience

---

## Support & Help Desk

### **Curator Support Channels:**

1. **Email:** curator-support@blkout.com
2. **Slack/Discord:** #curator-support channel
3. **Portal:** Built-in help chat
4. **Documentation:** Searchable help center

### **Common Issues & Solutions:**

**"Extension won't extract data"**
- Solution: Check if page has structured data (Schema.org)
- Fallback: Use manual upload for images, fill fields manually

**"Can't install extension"**
- Solution: Ensure Developer Mode enabled in chrome://extensions/
- Video guide: [link]

**"Submissions not appearing in dashboard"**
- Solution: Check API connection, verify curator ID registered
- Contact admin if persists

**"Images too large to upload"**
- Solution: Compress images before upload
- Tool: TinyPNG or similar
- Max 5MB per image

---

## Metrics to Track

### **Curator Engagement:**
- Number of active curators
- Submissions per curator (average)
- Approval rate per curator
- Time to first submission (onboarding effectiveness)

### **Extension Performance:**
- Successful extractions (by source)
- Manual fallback rate
- Image upload usage
- Offline mode usage

### **Support Metrics:**
- Support tickets by category
- Common installation issues
- Feature requests
- Bug reports

---

## Recommendation: Phased Rollout

### **Phase 1: Beta (Weeks 1-4)**
- **Curators:** 5-10 trusted volunteers
- **Method:** Direct download only
- **Goal:** Find bugs, gather feedback, refine workflow
- **Support:** High-touch, direct admin support

### **Phase 2: Expansion (Weeks 5-12)**
- **Curators:** 20-30 volunteers
- **Method:** Direct download with improved onboarding
- **Goal:** Scale up content volume, test at scale
- **Support:** Self-service docs + email support

### **Phase 3: Public (Month 4+)**
- **Curators:** Open recruitment
- **Method:** Chrome Web Store + direct download
- **Goal:** Maximize content coverage
- **Support:** Automated help center + community support

---

## Cost Breakdown

### **Direct Download (Current Approach):**
- **Cost:** $0
- **Hosting:** Use existing BLKOUT infrastructure
- **Time:** Ready now
- **Maintenance:** Manual update distribution

### **Chrome Web Store:**
- **Cost:** $5 one-time developer fee
- **Hosting:** Google hosts extension
- **Time:** 1-2 weeks initial approval
- **Maintenance:** Automatic updates

### **Recommended:** Start Free, Upgrade Later
- Launch with direct download (free, immediate)
- After 3-6 months, publish to Web Store ($5)
- Best of both: fast start + eventual ease of use

---

## Next Steps

1. ✅ **Create curator portal download page**
   - Auth-protected
   - Host ZIP files
   - Include installation guide

2. ✅ **Write curator handbook**
   - Extension usage guide
   - Quality standards
   - Best practices

3. ✅ **Record video tutorials**
   - Installation walkthrough (3 min)
   - Extension usage demo (5 min)
   - Quality examples (5 min)

4. ✅ **Set up support infrastructure**
   - curator-support@blkout.com email
   - Help documentation
   - FAQ page

5. ✅ **Recruit beta curators**
   - Reach out to 5-10 trusted community members
   - Get feedback
   - Refine before wider release

---

*Distribution & Access Guide v1.0.0 | Created: 2025-10-05*
