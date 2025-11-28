# BLKOUT Platform Integration Documentation

## Overview

This document describes the **modular integration architecture** between the BLKOUT Community Platform and ecosystem modules. The architecture follows a **hub-and-spoke model** where the main platform serves as the central navigation hub, while specialized modules provide focused functionality.

**Last Updated:** 2025-11-27

---

## Architecture

### Module Ecosystem

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BLKOUT Ecosystem                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Community Platform (Hub)                          │    │
│  │                    blkout.vercel.app                                 │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │ • Platform homepage (/liberation)      • Story Archive (/stories)   │    │
│  │ • Service discovery (/platform)        • Voices editorial (/voices) │    │
│  │ • Governance dashboard (/governance)   • IVOR interface (/intro)    │    │
│  │ • About & mission (/about)             • Photo competition          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│              │                    │                    │                     │
│              ▼                    ▼                    ▼                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ comms-blkout     │  │ events-blkout    │  │ news-blkout      │          │
│  │ (Admin/Content)  │  │ (Events Calendar)│  │ (Newsroom)       │          │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤          │
│  │ • Discover page  │  │ • Event listing  │  │ • Article list   │          │
│  │ • Content mgmt   │  │ • Event scraping │  │ • News curation  │          │
│  │ • AI Agents      │  │ • Moderation     │  │ • Moderation     │          │
│  │ • SocialSync     │  │ • Chrome ext     │  │ • Chrome ext     │          │
│  │ • Newsletters    │  └──────────────────┘  └──────────────────┘          │
│  │ • Advent Calendar│                                                       │
│  └──────────────────┘                                                       │
│              │                    │                    │                     │
│              └────────────────────┴────────────────────┘                     │
│                                   │                                          │
│                    ┌──────────────▼──────────────┐                          │
│                    │     Shared Supabase         │                          │
│                    │     Database                │                          │
│                    │  ───────────────────────    │                          │
│                    │  • announcements            │                          │
│                    │  • content                  │                          │
│                    │  • events (submissions)     │                          │
│                    │  • articles (news)          │                          │
│                    │  • voices_articles          │                          │
│                    │  • socialsync_agent_tasks   │                          │
│                    └─────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Module Specifications

### 1. comms-blkout (Communications & Content Admin)

**Repository:** `/home/robbe/ACTIVE_PROJECTS/comms-blkout`
**Deployment:** To be deployed at `comms.blkoutuk.com` or `admin.blkoutuk.com`
**Tech Stack:** React 19 + TypeScript 5.7 + Vite 7 + Tailwind CSS

#### Recent Improvements (Nov 2025)

| Feature | Status | Description |
|---------|--------|-------------|
| **SocialSync Integration** | ✅ Complete | AI-powered content generation with Gemini API |
| **Advent Calendar Widget** | ✅ Complete | Seasonal community engagement feature |
| **Newsletter Archive** | ✅ Complete | Historical newsletter browsing via SendFox API |
| **Agent Prompt Modal** | ✅ Complete | Customizable AI agent prompts |
| **Hub News Channel** | ✅ Complete | BLKOUTHUB integration for news syndication |
| **Real Supabase Data** | ✅ Complete | Removed mock data, using production database |

#### Route Structure

```
/discover          → Public content showcase (landing page)
/admin             → Dashboard with agent status
/admin/calendar    → Content scheduling calendar
/admin/drafts      → Draft management
/admin/agents      → AI agent configuration
/admin/analytics   → Engagement metrics
/admin/settings    → Platform settings
/admin/socialsync  → SocialSync content tool
/admin/editorial   → Editorial workflow
/admin/newsletters → Newsletter management
```

#### Key Components

```
src/components/
├── discover/
│   ├── AdventCalendarWidget.tsx    # Seasonal engagement (NEW)
│   ├── AnnouncementsSection.tsx    # Community announcements
│   ├── BlkoutHubWidget.tsx         # BLKOUTHUB integration
│   ├── NewsletterArchive.tsx       # SendFox integration (NEW)
│   ├── HeroSection.tsx             # Landing hero
│   └── YouTubeEmbed.tsx            # Video content
├── socialsync/
│   ├── Controls.tsx                # SocialSync controls (NEW)
│   ├── PreviewArea.tsx             # Content preview (NEW)
│   ├── AssetLibrary.tsx            # Media assets (NEW)
│   └── constants.ts                # Config constants (NEW)
├── agents/
│   └── AgentPromptModal.tsx        # Agent configuration (NEW)
├── layout/
│   └── Layout.tsx                  # App shell
└── shared/
    └── ContentCard.tsx             # Content display
```

#### Services

```
src/services/
├── announcementsService.ts         # Announcements CRUD
├── hubNewsChannel.ts               # BLKOUTHUB news API (NEW)
├── sendfox.ts                      # Newsletter API (NEW)
└── socialsync/
    ├── gemini.ts                   # Google Gemini AI (NEW)
    ├── generation.ts               # Content generation (NEW)
    ├── integration.ts              # Platform integrations (NEW)
    ├── supabase.ts                 # Database operations (NEW)
    └── platforms/                  # Platform-specific configs
```

---

### 2. events-blkout (Events Calendar)

**Repository:** `/home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/events-blkout`
**Deployment:** `events-blkout.vercel.app`
**Tech Stack:** React + TypeScript + Vite + Tailwind CSS

#### Features
- Dual data source (Google Sheets + Supabase)
- Chrome extension for event curation
- Admin moderation queue
- Event scraping dashboard
- Organization monitoring

---

### 3. news-blkout (Newsroom)

**Repository:** `/home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/news-blkout`
**Deployment:** `news-blkout.vercel.app`
**Tech Stack:** React + TypeScript + Vite + Tailwind CSS

#### Features
- Article submission and display
- Chrome extension for news curation
- Admin moderation dashboard
- Content warning system
- Category filtering

---

## Integration Pattern: Hub-and-Spoke

### Current Model

**Shared Components** (copied between modules):
- Type definitions (announcements.ts, content.ts)
- Some UI components (ContentCard, AnnouncementsSection)
- Services (announcementsService.ts)

**Independent Modules** (separate deployments):
- Complete admin interfaces per module
- Module-specific features
- Independent routing

**Connection Point**:
- Shared Supabase database
- Each module writes to specific tables
- Cross-module reads via shared anon key
- No direct API calls between modules

---

## Uniformity Analysis & Recommendations

### Current Inconsistencies

| Aspect | comms-blkout | events-blkout | news-blkout | Recommendation |
|--------|--------------|---------------|-------------|----------------|
| **React Version** | 19.2 | 18.x | 18.x | Standardize to React 19 |
| **Vite Version** | 7.x | 5.x | 5.x | Standardize to Vite 7 |
| **TypeScript** | 5.7 | 5.3 | 5.3 | Standardize to 5.7 |
| **Tailwind** | 3.4 | 3.4 | 3.4 | ✅ Consistent |
| **Admin Routes** | /admin/* | /admin | /admin | Standardize pattern |
| **Extension Hosting** | N/A | Main platform | Main platform | ✅ Consistent |

### Recommended Uniform Structure

Each module should follow this pattern:

```
module-blkout/
├── src/
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   ├── shared/           # Reusable components
│   │   ├── discover/         # Public page components (if applicable)
│   │   └── admin/            # Admin components
│   ├── pages/
│   │   ├── public/           # Public routes
│   │   └── admin/            # Protected routes
│   ├── hooks/                # Custom hooks
│   ├── services/             # API services
│   ├── lib/                  # Utilities (supabase, etc.)
│   ├── types/                # TypeScript definitions
│   └── styles/               # Global styles
├── public/
│   ├── images/               # Static images
│   └── extensions/           # Chrome extensions (if applicable)
├── vercel.json               # Deployment config
├── package.json
├── tsconfig.json
└── README.md
```

### Shared Package Recommendation

Create a shared package for common elements:

```
@blkout/shared
├── components/
│   ├── ContentCard.tsx
│   ├── AnnouncementsSection.tsx
│   ├── BlkoutHubWidget.tsx
│   └── Layout.tsx
├── services/
│   ├── supabase.ts
│   └── announcements.ts
├── types/
│   ├── content.ts
│   ├── announcements.ts
│   └── common.ts
├── hooks/
│   ├── useAuth.ts
│   └── useContent.ts
└── utils/
    └── formatting.ts
```

---

## Data Flow

### Content Publishing Workflow (comms-blkout)

```
1. Content Creation (Admin Dashboard)
   ↓
2. AI Agent Enhancement (Griot/Listener/Weaver/Strategist)
   ↓
3. SocialSync Generation (Gemini AI)
   ↓
4. Write to Supabase (socialsync_agent_tasks, status: 'draft')
   ↓
5. Admin Review & Approval
   ↓
6. Publish (status: 'published')
   ↓
7. Display on Discover Page
```

### Cross-Module Content Flow

```
comms-blkout (content creation)
       ↓
   Supabase (shared database)
       ↓
   ┌───┴───┐
   ↓       ↓
events   news
(reads   (reads
events)  articles)
```

---

## Database Schema

### Shared Tables

#### `announcements`
```sql
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  category TEXT NOT NULL, -- 'event', 'update', 'campaign', 'urgent'
  status TEXT NOT NULL,   -- 'draft', 'published', 'archived'
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

#### `content` (comms-blkout)
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  content_type TEXT,      -- 'post', 'article', 'video', etc.
  status TEXT NOT NULL,   -- 'draft', 'scheduled', 'published', 'archived'
  platforms TEXT[],       -- ['instagram', 'linkedin', 'twitter']
  published_at TIMESTAMP,
  scheduled_for TIMESTAMP,
  agent_type TEXT,        -- 'griot', 'listener', 'weaver', 'strategist'
  engagement_metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `socialsync_agent_tasks` (NEW)
```sql
CREATE TABLE socialsync_agent_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  agent_response JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Configuration

### comms-blkout (.env)
```bash
# Supabase Connection
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Configuration
VITE_GEMINI_API=your-gemini-api-key

# Newsletter Integration
VITE_SENDFOX_API_KEY=your-sendfox-key

# Auth (disabled for development)
VITE_AUTH_DISABLED=true
```

### Community Platform (.env)
```bash
# Supabase Connection (shared)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# IVOR API
VITE_API_URL=https://blkout-api-railway-production.up.railway.app/api
```

---

## Deployment Architecture

### Production Domains

```
┌────────────────────────────────────────────────┐
│ blkout.vercel.app (or blkoutuk.com)            │
│ └─> Community Platform (Hub)                   │
│     • Public platform pages                    │
│     • Service discovery                        │
│     • User-facing features                     │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ comms.blkoutuk.com (or admin.blkoutuk.com)     │
│ └─> comms-blkout                               │
│     • Content management                       │
│     • AI agents                                │
│     • SocialSync                               │
│     • Protected by authentication              │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ events-blkout.vercel.app                       │
│ └─> Events Calendar                            │
│     • Event discovery                          │
│     • Community submissions                    │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ news-blkout.vercel.app                         │
│ └─> Newsroom                                   │
│     • Liberation news                          │
│     • Article submissions                      │
└────────────────────────────────────────────────┘
```

---

## AI Agents

### Agent Types (comms-blkout)

| Agent | Role | Voice | Content Type |
|-------|------|-------|--------------|
| **Griot** | Storyteller | Warm, narrative, culturally grounded | Community stories |
| **Listener** | Intelligence | Analytical, observant | Trend analysis |
| **Weaver** | Engagement | Inviting, action-oriented | Interactive posts |
| **Strategist** | Planning | Clear, purposeful | Campaign comms |

### SocialSync AI (NEW)

Uses Google Gemini API for:
- Content generation based on prompts
- Platform-specific formatting
- Liberation-centered messaging
- Multi-platform adaptation

---

## Security

### Row Level Security (RLS)

```sql
-- Public access to published content
CREATE POLICY "Public read published content"
  ON content FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public read published announcements"
  ON announcements FOR SELECT
  USING (status = 'published');

-- Admin full access (requires auth)
CREATE POLICY "Admin full access to content"
  ON content FOR ALL
  USING (auth.role() = 'authenticated');
```

### Module Access Levels

| Module | Public Access | Admin Access |
|--------|--------------|--------------|
| Community Platform | Read published | N/A |
| comms-blkout | Discover page | Full CRUD |
| events-blkout | Event listing | Moderation |
| news-blkout | Article listing | Moderation |

---

## Development Workflow

### Running Multiple Modules

```bash
# Terminal 1: Community Platform (Hub)
cd /home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform
npm run dev  # http://localhost:5173

# Terminal 2: comms-blkout
cd /home/robbe/ACTIVE_PROJECTS/comms-blkout
npm run dev  # http://localhost:5174

# Terminal 3: events-blkout
cd /home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/events-blkout
npm run dev  # http://localhost:5175

# Terminal 4: news-blkout
cd /home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/news-blkout
npm run dev  # http://localhost:5176
```

---

## Future Enhancements

### Phase 2: Module Uniformity

1. **Shared Package Creation**
   - Extract common components to @blkout/shared
   - Unified type definitions
   - Consistent service patterns

2. **Version Alignment**
   - Upgrade all modules to React 19
   - Standardize Vite 7 across ecosystem
   - Align TypeScript versions

3. **Authentication Unification**
   - Implement SSO across modules
   - Shared auth context
   - Role-based access control

### Phase 3: Advanced Integration

1. **API Gateway**
   - Centralized API routing
   - Rate limiting
   - Analytics aggregation

2. **Real-time Features**
   - Supabase subscriptions
   - Cross-module notifications
   - Live content updates

3. **Enhanced AI**
   - IVOR integration with comms-blkout
   - Automated content suggestions
   - Community sentiment analysis

---

## Contact & Resources

- **Community Platform**: https://blkout.vercel.app
- **Admin Module**: comms.blkoutuk.com (when deployed)
- **Supabase Dashboard**: https://app.supabase.com
- **Support**: platform@blkoutuk.com

---

*This integration architecture supports BLKOUT values of cooperative ownership, democratic governance, and community empowerment through modular, maintainable platform design.*
