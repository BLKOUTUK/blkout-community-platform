# BLKOUT Platform Integration Documentation

## Overview

This document describes the **arms-length integration architecture** between the BLKOUT Community Platform and the comms-blkout administrative module. This integration enables a separation of concerns: the public-facing community platform focuses on user engagement and content discovery, while the comms-blkout module provides operational tools for content management and social media automation.

## Architecture

### Two-Platform System

```
┌─────────────────────────────────────────────────────────────┐
│                    BLKOUT Ecosystem                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────┐    ┌──────────────────────┐  │
│  │ Community Platform       │    │ comms-blkout         │  │
│  │ (Public-Facing)          │    │ (Admin/Operations)   │  │
│  ├──────────────────────────┤    ├──────────────────────┤  │
│  │ • Discover Page          │◄───┤ • Content Creation   │  │
│  │ • Announcements          │    │ • AI Agents          │  │
│  │ • Published Content      │    │ • Social Media Mgmt  │  │
│  │ • Events Calendar        │    │ • Publishing Tools   │  │
│  │ • Community Features     │    │ • Analytics          │  │
│  └──────────────────────────┘    └──────────────────────┘  │
│              │                              │                │
│              └──────────┬──────────────────┘                │
│                         │                                    │
│              ┌──────────▼──────────┐                        │
│              │  Shared Supabase    │                        │
│              │  Database           │                        │
│              │  ───────────────    │                        │
│              │  • announcements    │                        │
│              │  • content          │                        │
│              │  • users            │                        │
│              └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Integration Pattern: Arms-Length

**Tightly Integrated Components** (copied to community platform):
- Discover page components (HeroSection, BlkoutHubWidget, AnnouncementsSection, YouTubeEmbed)
- ContentCard component
- Type definitions (announcements.ts, content.ts)
- Services (announcementsService.ts)
- Hooks (usePublishedContent.ts)

**Arms-Length Module** (remains separate):
- Complete admin interface
- AI agents (Griot, Listener, Weaver, Strategist)
- Content creation workflows
- Social media publishing tools
- Analytics dashboards

**Connection Point**:
- Shared Supabase database
- comms-blkout writes → community platform reads
- No direct API calls between platforms
- Database-level integration only

## Data Flow

### Content Publishing Workflow

```
1. Content Creation (comms-blkout admin)
   ↓
2. AI Agent Processing (Griot/Listener/Weaver/Strategist)
   ↓
3. Write to Supabase (content table, status: 'draft')
   ↓
4. Admin Review & Approval
   ↓
5. Publish (status: 'published')
   ↓
6. Community Platform Fetch (usePublishedContent hook)
   ↓
7. Display on Discover Page
```

### Announcements Workflow

```
1. Announcement Creation (comms-blkout admin)
   ↓
2. Write to Supabase (announcements table)
   ↓
3. Community Platform Fetch (fetchPublishedAnnouncements)
   ↓
4. Display in AnnouncementsSection
```

## Database Schema

### Shared Tables

#### `content` table
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  content_type TEXT, -- 'post', 'article', 'video', etc.
  status TEXT NOT NULL, -- 'draft', 'scheduled', 'published', 'archived'
  platforms TEXT[], -- ['instagram', 'linkedin', 'twitter', etc.]
  published_at TIMESTAMP,
  scheduled_for TIMESTAMP,
  agent_type TEXT, -- 'griot', 'listener', 'weaver', 'strategist'
  engagement_metrics JSONB, -- {likes, comments, shares}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `announcements` table
```sql
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  category TEXT NOT NULL, -- 'event', 'update', 'campaign', 'urgent'
  status TEXT NOT NULL, -- 'draft', 'published', 'archived'
  priority INTEGER DEFAULT 0,
  display_date DATE NOT NULL,
  link TEXT,
  author_id UUID REFERENCES users(id),
  author_name TEXT,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Configuration

### Community Platform (.env)
```bash
# Supabase Connection (shared with comms-blkout)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_NAME=BLKOUT Community Platform
VITE_APP_URL=https://blkoutuk.com
```

### comms-blkout (.env)
```bash
# Supabase Connection (same as community platform)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Configuration (admin-only)
VITE_OPENAI_API_KEY=your-openai-key
VITE_ANTHROPIC_API_KEY=your-anthropic-key

# Social Media APIs (admin-only)
VITE_INSTAGRAM_API_KEY=your-instagram-key
VITE_LINKEDIN_API_KEY=your-linkedin-key
# ... other social platforms
```

## Deployment Architecture

### Recommended Setup

```
Production Domains:
┌────────────────────────────────────────────┐
│ blkoutuk.com                               │
│ └─> Community Platform (Vercel)           │
│     • Public discover page                 │
│     • User-facing features                 │
│     • Read-only content access             │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ admin.blkoutuk.com                         │
│ └─> comms-blkout Module (Vercel/Netlify)  │
│     • Content management                   │
│     • AI agents                            │
│     • Social media automation              │
│     • Analytics                            │
│     • Protected by authentication          │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Shared Supabase Database                   │
│ └─> Single source of truth                │
│     • Content storage                      │
│     • User management                      │
│     • Analytics                            │
└────────────────────────────────────────────┘
```

### Deployment Steps

#### 1. Deploy Community Platform
```bash
cd /home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform
npm install
npm run build
vercel --prod
# Configure domain: blkoutuk.com
```

#### 2. Deploy comms-blkout Admin
```bash
cd /home/robbe/ACTIVE_PROJECTS/comms-blkout
npm install
npm run build
vercel --prod
# Configure domain: admin.blkoutuk.com
```

#### 3. Configure Supabase
- Set up Row Level Security (RLS) policies
- Community platform: read-only access to published content
- Admin platform: full read/write access with authentication

## Security Considerations

### Data Access Control

**Community Platform** (public):
- Read-only access to `content` where `status = 'published'`
- Read-only access to `announcements` where `status = 'published'`
- No access to draft or archived content
- Uses Supabase anon key (public)

**comms-blkout** (admin):
- Full CRUD access to `content`
- Full CRUD access to `announcements`
- Protected by authentication
- Uses Supabase service role key (admin routes only)

### RLS Policies Example

```sql
-- Community platform can only read published content
CREATE POLICY "Public read published content"
  ON content FOR SELECT
  USING (status = 'published');

-- Admin can do everything (requires authentication)
CREATE POLICY "Admin full access"
  ON content FOR ALL
  USING (auth.role() = 'authenticated');
```

## Development Workflow

### Running Both Platforms Locally

#### Terminal 1: Community Platform
```bash
cd /home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform
npm run dev
# Runs on http://localhost:5173
```

#### Terminal 2: comms-blkout Admin
```bash
cd /home/robbe/ACTIVE_PROJECTS/comms-blkout
npm run dev
# Runs on http://localhost:5174 (or next available port)
```

Both platforms connect to the same Supabase database, allowing you to:
1. Create content in comms-blkout admin
2. See it appear on community platform discover page

### Mock Data Fallback

Both platforms include mock data fallbacks for development:
- If Supabase is not configured (placeholder URL)
- If database connection fails
- If no content exists yet

This allows development without database setup initially.

## AI Agents Integration

### Agent Types

The comms-blkout module includes four specialized AI agents:

1. **Griot** (Storyteller)
   - Content type: Narrative posts, storytelling
   - Purpose: Share community stories and experiences
   - Voice: Warm, narrative, culturally grounded

2. **Listener** (Intelligence)
   - Content type: Community insights, trend analysis
   - Purpose: Surface important conversations and themes
   - Voice: Analytical, observant, community-focused

3. **Weaver** (Engagement)
   - Content type: Interactive posts, calls to action
   - Purpose: Build connections and encourage participation
   - Voice: Inviting, action-oriented, inclusive

4. **Strategist** (Planning)
   - Content type: Strategic communications, campaigns
   - Purpose: Coordinate messaging and campaigns
   - Voice: Clear, purposeful, movement-building

### Agent Workflow
```
Admin creates content → Selects agent type → Agent enhances with AI → Admin reviews → Publish
```

The `agentType` field is stored in the database and displayed as a badge on the community platform's ContentCard component.

## Migration from Original Discover Page

The enhanced discover page replaces the original while maintaining compatibility:

### Original File
```
src/components/pages/DiscoverPage.tsx (backed up as DiscoverPage.tsx.backup)
```

### New File
```
src/components/pages/DiscoverPage.enhanced.tsx
```

### Switching Between Versions

To use the enhanced version, update your router:
```typescript
// Before
import DiscoverPage from './components/pages/DiscoverPage';

// After
import DiscoverPage from './components/pages/DiscoverPage.enhanced';
```

### Component Dependencies

The enhanced discover page requires:
```
src/components/discover/
  ├─ HeroSection.tsx
  ├─ BlkoutHubWidget.tsx
  ├─ AnnouncementsSection.tsx
  └─ YouTubeEmbed.tsx

src/components/shared/
  └─ ContentCard.tsx

src/hooks/
  └─ usePublishedContent.ts

src/services/
  └─ announcementsService.ts

src/types/
  ├─ announcements.ts
  └─ content.ts
```

## Testing Integration

### 1. Test Database Connection
```typescript
// In browser console on community platform
const { data, error } = await supabase
  .from('content')
  .select('*')
  .eq('status', 'published')
  .limit(1);

console.log('Data:', data, 'Error:', error);
```

### 2. Test Content Flow
1. Create a test post in comms-blkout admin
2. Set status to 'published'
3. Refresh community platform discover page
4. Verify content appears in grid

### 3. Test Announcements
1. Create a test announcement in comms-blkout admin
2. Set status to 'published'
3. Refresh community platform discover page
4. Verify announcement appears in AnnouncementsSection

### 4. Test Mock Fallbacks
1. Set `VITE_SUPABASE_URL` to placeholder value
2. Restart dev server
3. Verify mock content displays
4. Check console for "using mock content data" message

## Troubleshooting

### Content Not Appearing

**Check 1**: Verify Supabase connection
```bash
# Check environment variables are set
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

**Check 2**: Verify content status
```sql
-- In Supabase SQL Editor
SELECT id, title, status FROM content ORDER BY created_at DESC LIMIT 10;
```

**Check 3**: Check browser console
- Look for API errors
- Check network tab for failed requests
- Verify "using mock content data" is NOT showing (unless intended)

### Styling Issues

**Check 1**: Verify Tailwind classes
- All components use Tailwind CSS
- Dark mode classes use `dark:` prefix
- Ensure Tailwind config includes content paths

**Check 2**: Verify Framer Motion
```bash
npm install framer-motion
```

### Authentication Issues (comms-blkout)

**Check 1**: Verify Supabase auth is enabled
- Check Supabase dashboard → Authentication → Providers
- Ensure email provider is enabled

**Check 2**: Verify admin user exists
```sql
-- In Supabase SQL Editor
SELECT id, email FROM auth.users;
```

## Phase 2 Groundwork

This integration lays the foundation for Phase 2 enhancements:

1. **Real-time Updates**
   - Subscribe to database changes
   - Live content updates without refresh
   - Real-time engagement metrics

2. **Enhanced Analytics**
   - Track content performance
   - User engagement metrics
   - Platform-specific analytics

3. **Advanced AI Features**
   - AI-powered content recommendations
   - Automated content optimization
   - Community sentiment analysis

4. **Multi-tenancy**
   - Support for multiple communities
   - White-label deployment options
   - Federated content sharing

## Support and Maintenance

### Repository Structure
```
BLKOUT_LIBERATION_PLATFORM/
└─ blkout-community-platform/     (this repository)
   └─ INTEGRATION.md               (this file)

comms-blkout/                      (separate repository)
└─ README.md
```

### Updating Components

When comms-blkout components are updated:
1. Review changes in comms-blkout repository
2. Manually port relevant changes to community platform
3. Test integration
4. Deploy

### Database Migrations

When database schema changes:
1. Plan migration in comms-blkout repository
2. Apply migration to shared Supabase database
3. Update type definitions in both platforms
4. Test both platforms
5. Deploy in order: database → community platform → comms-blkout

## Contact and Resources

- **Community Platform**: https://blkoutuk.com
- **Admin Module**: https://admin.blkoutuk.com (when deployed)
- **Supabase Dashboard**: https://app.supabase.com
- **Support**: platform@blkoutuk.com

---

*This integration architecture supports the BLKOUT values of cooperative ownership, democratic governance, and community empowerment through a clear separation of public engagement and operational tools.*
