# BLKOUT Platform - Production Architecture & Development Roadmap

## Executive Summary

The BLKOUT Platform is a modular, liberation-focused community empowerment platform built for and by Black queer communities. This document outlines the production architecture, deployment strategy, and development roadmap from Phase 1 (current) through future phases.

**Version:** 1.1.1-production
**Phase:** Phase 1.5 - Foundation & Module Uniformity
**Last Updated:** 2025-11-28

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Modular Architecture](#modular-architecture)
3. [Shared Package (@blkout/shared)](#shared-package-blkoutshared)
4. [Production Deployments](#production-deployments)
5. [Phase 1.5: Current State](#phase-15-current-state)
6. [Deployment Routes](#deployment-routes)
7. [Future Development Phases](#future-development-phases)
8. [Integration Points](#integration-points)
9. [Technical Stack](#technical-stack)

---

## Platform Overview

### Mission
Liberation-centered technology that empowers Black queer communities through:
- **Creator Sovereignty** (75% revenue transparency)
- **Democratic Governance** (community-owned decision-making)
- **Cultural Authenticity** (Black queer joy celebration)
- **Trauma-Informed Design** (safe, accessible experiences)
- **Community Protection** (anti-oppression UX)

### Platform Principles
1. **Modular Design** - Independent services with clear boundaries
2. **Deployment Sovereignty** - Each module can deploy independently
3. **API-First Integration** - Services communicate via documented APIs
4. **Liberation Values** - All modules enforce community empowerment principles
5. **Progressive Enhancement** - Core features work, advanced features enhance
6. **Shared Foundation** - Common types, services, and utilities via @blkout/shared

---

## Modular Architecture

The BLKOUT Platform consists of **6 independent modules** that work together as a unified ecosystem:

### 1. Main Platform (Core Hub)
**Repository:** `blkout-community-platform/fresh-blkout`
**Deployment:** `https://blkout.vercel.app`
**Purpose:** Central platform interface and navigation hub

**Features:**
- Platform homepage with liberation quotes
- Navigation to all ecosystem services
- Photo Competition integration
- IVOR Assistant interface
- Governance dashboard access
- Community onboarding flow

**Technology:**
- React 18.2 + TypeScript 5.3
- Vite build system
- Framer Motion animations
- Radix UI components
- Tailwind CSS with liberation color system

**Key Files:**
- `src/App.tsx` - Main application shell
- `src/components/onboarding/FirstTimeUserFlow.tsx` - User onboarding
- `src/components/competition/` - Photo competition module
- `vercel.json` - Production deployment configuration

---

### 2. Events Calendar
**Repository:** `black-qtipoc-events-calendar`
**Deployment:** `https://events-blkout.vercel.app`
**Purpose:** Community events discovery and management

**Features:**
- Google Sheets integration for event data
- Supabase database for Chrome extension submissions
- Event moderation queue for admins
- Dual integration (Sheets + Database)
- Event discovery and scraping dashboard
- Organization monitoring

**Technology:**
- React + TypeScript
- Google Sheets API integration
- Supabase for extension submissions
- Chrome Extension for event curation

**Key Components:**
- `src/components/ModerationQueue.tsx` - Admin moderation interface
- `src/components/ScrapingDashboard.tsx` - Event discovery tools
- `src/services/googleSheetsService.ts` - Google Sheets integration
- `src/services/supabaseEventService.ts` - Database integration

**Chrome Extension:**
- Current Version: **v2.2.2** (BLKOUT Moderator Tools)
- Central Download: `https://news-blkout.vercel.app/blkout-moderator-tools-v2.2.2-fixed.zip`
- Version Manifest: `https://news-blkout.vercel.app/extension-manifest.json`
- Extracts from: Eventbrite, Meetup, Facebook Events, Schema.org
- Features: Event submission, article submission, Supabase integration

---

### 3. Newsroom
**Repository:** `news-blkout`
**Deployment:** `https://news-blkout.vercel.app`
**Purpose:** Community-curated liberation news and journalism

**Features:**
- Article submission and moderation
- Supabase database for articles
- News moderation queue
- Content warning system
- Category filtering and search

**Technology:**
- React + TypeScript + Vite
- Supabase for data storage
- Framer Motion for animations
- Chrome Extension for news curation

**Key Components:**
- `src/components/pages/ModerationDashboard.tsx` - Admin interface
- `src/components/pages/NewsroomHome.tsx` - Public newsroom
- `src/components/pages/ArticleDetail.tsx` - Article view
- `src/lib/supabase.ts` - Database client

**Chrome Extension:**
- Unified with Events: **BLKOUT Moderator Tools v2.2.2**
- Central Download: `https://news-blkout.vercel.app/blkout-moderator-tools-v2.2.2-fixed.zip`
- Version Manifest: `https://news-blkout.vercel.app/extension-manifest.json`
- Extracts from: News sites with JSON-LD, Open Graph, Twitter Cards
- Single extension handles both events and news submission

---

### 4. IVOR AI Assistant
**Repository:** `ivor-core` (separate microservice)
**Deployment:** FastAPI on Railway
**API Endpoint:** `https://blkout-api-railway-production.up.railway.app`
**Purpose:** Trauma-informed AI assistant for community support

**Features:**
- GROQ AI integration for conversations
- Context-aware responses
- Trauma-informed language processing
- Multi-platform accessibility (web, mobile, Discord)
- Liberation-focused knowledge base

**Technology:**
- FastAPI (Python)
- GROQ AI models
- Railway hosting
- RESTful API architecture

**Integration:**
- Accessed via main platform interface
- API consumed by frontend: `/api/ivor/chat`
- Supports both synchronous and streaming responses

---

### 5. BLKOUTHUB (Community Platform)
**External Service:** Heartbeat.chat
**URL:** `https://blkouthub.com`
**Purpose:** Private community space with enhanced features

**Features:**
- Secure community forums
- Member verification
- Enhanced governance access
- Direct community messaging
- Event coordination

**Integration:**
- Linked from main platform
- Single sign-on (planned for Phase 2)
- Governance proposal synchronization (Phase 2)

---

### 6. Liberation Story (Scrollytelling)
**Repository:** `blkout-scrollytelling`
**Deployment:** `https://blkout-scrollytelling.vercel.app`
**Purpose:** Immersive storytelling experience about Black queer liberation

**Features:**
- Scroll-triggered animations
- Multimedia storytelling
- Liberation narrative journey
- Community story archives

**Technology:**
- React + Framer Motion
- Scroll-based animation triggers
- Video and audio integration

---

### 7. Voices Platform (Editorial Publishing)
**Repository:** `voices-blkout` (Planned - Phase 2)
**Current Status:** Integrated in main platform (Phase 1)
**Purpose:** Editorial content management and publishing for community voices

**Current Implementation (Phase 1):**
- **Location:** Main platform at `blkout.vercel.app/voices`
- **Component:** `src/components/pages/VoicesPage.tsx` (411 lines)
- **Database:** Supabase `voices_articles` table
- **API:** `src/services/voices-api.ts` - Full CRUD operations
- **Current Articles:** 5 published (will grow quickly)

**Features:**
- Published article display with categories
- Featured articles spotlight
- Article pitch/submission form
- Social sharing integration
- Category filtering (Opinion, Analysis, Editorial, Community Voice, Liberation Thought)
- Rich media support (hero images, thumbnails)
- SEO-friendly slugs

**Planned Standalone Module (Phase 2):**
**Repository:** `voices-blkout` (To be created)
**Deployment:** `https://voices-blkout.vercel.app` (Planned)

**Admin Dashboard Requirements:**
- Rich text editor with media embedding
- Image management system (upload, crop, alt text)
- Template-based publishing workflow
- Draft/review/publish status management
- Category and tag management
- SEO metadata editor
- Author management and attribution
- Analytics and engagement tracking
- Scheduled publishing
- Version history and revisions

**Technology Stack (Planned):**
- React 18.2 + TypeScript 5.3
- Rich text editor: Tiptap or Lexical
- Image management: Supabase Storage with transformation
- Template system: Customizable article layouts
- Supabase database with RLS policies
- Admin authentication and role management

**Database Schema (Current):**
```typescript
voices_articles {
  id: string (uuid)
  title: string
  content: string (rich text/markdown)
  excerpt: string
  author: string
  category: 'opinion' | 'analysis' | 'editorial' | 'community' | 'liberation'
  tags: string[]
  featured: boolean
  published: boolean
  slug: string (SEO-friendly)
  hero_image: string (url)
  hero_image_alt: string
  thumbnail_image: string (url)
  thumbnail_alt: string
  created_at: timestamp
  updated_at: timestamp
  published_at: timestamp
}
```

**Key Components (Planned):**
- `src/components/admin/VoicesEditor.tsx` - Rich text article editor
- `src/components/admin/ImageManager.tsx` - Media library and uploads
- `src/components/admin/TemplateSelector.tsx` - Article layout templates
- `src/components/admin/PublishingWorkflow.tsx` - Draft/review/publish flow
- `src/services/voicesAdminAPI.ts` - Admin CRUD operations

**Integration Points:**
- Main platform: Link to voices-blkout.vercel.app
- Supabase: Shared database with main platform
- IVOR AI: Content suggestions and editorial assistance (Phase 3)
- Image CDN: Supabase Storage or Cloudinary

**Migration Path:**
- Phase 1 (Current): Voices integrated in main platform
- Phase 2: Create standalone voices-blkout module with admin dashboard
- Phase 3: Enhanced features (AI assistance, collaborative editing)

---

## Shared Package (@blkout/shared)

A new shared package has been created to provide module uniformity across the BLKOUT ecosystem.

**Repository:** `BLKOUT_LIBERATION_PLATFORM/blkout-shared`
**Package Name:** `@blkout/shared`
**Version:** 1.0.0

### Purpose

The shared package provides:
- **Type Definitions** - Consistent TypeScript types across all modules
- **Services** - Shared Supabase client and API services
- **Hooks** - Common React hooks (useAnnouncements, etc.)
- **Utilities** - Formatting functions and constants

### Structure

```
blkout-shared/
├── src/
│   ├── types/              # Shared TypeScript definitions
│   │   └── index.ts        # Content, Announcement, Event, Article types
│   ├── services/           # API services
│   │   ├── supabase.ts     # Unified Supabase client
│   │   └── announcements.ts # Announcements CRUD
│   ├── hooks/              # React hooks
│   │   └── useAnnouncements.ts
│   ├── utils/              # Utilities
│   │   ├── formatting.ts   # Date/text formatting
│   │   └── constants.ts    # Platform configs, colors, endpoints
│   └── index.ts            # Main exports
├── package.json
├── tsconfig.json
└── README.md
```

### Key Types Provided

| Type | Description | Used By |
|------|-------------|---------|
| `Announcement` | Community announcements | All modules |
| `Content` | Social media content | comms-blkout |
| `Event` | Calendar events | events-blkout |
| `Article` | News articles | news-blkout |
| `PlatformType` | Social platforms enum | All modules |
| `AgentType` | AI agent types | comms-blkout |

### Usage

```typescript
// Import types
import type { Announcement, Content, Event } from '@blkout/shared/types';

// Import services
import { fetchPublishedAnnouncements, supabase } from '@blkout/shared/services';

// Import hooks
import { useAnnouncements } from '@blkout/shared/hooks';

// Import utilities
import { formatDate, PLATFORMS, BLKOUT_COLORS } from '@blkout/shared/utils';
```

### Module Uniformity Goals

| Aspect | Current State | Target State |
|--------|--------------|--------------|
| React Version | 18.x / 19.x mixed | React 19 standard |
| Vite Version | 5.x / 7.x mixed | Vite 7 standard |
| TypeScript | 5.3 / 5.7 mixed | TypeScript 5.7 |
| Tailwind | 3.4 (consistent) | ✅ Aligned |
| Type Definitions | Duplicated | @blkout/shared |
| Supabase Client | Per-module | @blkout/shared |

---

## Production Deployments

### Deployment Infrastructure

All services are deployed on **Vercel** with the following configuration:

**Production Services (Phase 1):**
1. Main Platform: `blkout.vercel.app`
2. Events Calendar: `events-blkout.vercel.app`
3. Newsroom: `news-blkout.vercel.app`
4. IVOR Backend: Railway (API consumed by main platform)

**External/Planned (Phase 1-2):**
5. BLKOUTHUB: `blkouthub.com` (Heartbeat.chat)
6. Scrollytelling: `blkout-scrollytelling.vercel.app`
7. Voices Platform: `voices-blkout.vercel.app` (Planned - Phase 2)

#### Main Platform (`blkout.vercel.app`)
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "regions": ["lhr1"],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

**Key Features:**
- London region (lhr1) for optimal UK/EU latency
- 30-second function timeout for API routes
- Static asset caching (31536000s for /assets/)
- No caching for admin routes
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)

#### Events Calendar (`events-blkout.vercel.app`)
- **Vercel Project:** `black-qtipoc-events-calendar`
- Google Sheets API integration via environment variables
- Supabase connection for extension submissions
- Dual data source architecture

#### Newsroom (`news-blkout.vercel.app`)
- **Vercel Project:** `news-blkout`
- Supabase for article storage
- API routes for moderation
- Content warning system

### Environment Variables Strategy

**Main Platform:**
```env
VITE_API_URL=https://blkout-api-railway-production.up.railway.app/api
VITE_SUPABASE_URL=[production-url]
VITE_SUPABASE_ANON_KEY=[anon-key]
```

**Events Calendar:**
```env
VITE_GOOGLE_SHEET_ID=[sheet-id]
VITE_SUPABASE_URL=[production-url]
VITE_SUPABASE_ANON_KEY=[anon-key]
```

**Newsroom:**
```env
VITE_SUPABASE_URL=[production-url]
VITE_SUPABASE_ANON_KEY=[anon-key]
```

**IVOR Backend (Railway):**
```env
GROQ_API_KEY=[api-key]
DATABASE_URL=[postgres-url]
CORS_ORIGINS=https://blkout.vercel.app,https://events-blkout.vercel.app,https://news-blkout.vercel.app
```

---

## Phase 1.5: Current State (Foundation & Module Uniformity)

### ✅ Completed Features

#### Core Platform
- [x] Main platform deployed to production
- [x] Liberation-focused UI with Pan-African & Pride colors
- [x] Trauma-informed animations and transitions
- [x] First-time user onboarding flow
- [x] Navigation to all ecosystem services
- [x] Photo Competition integration (Phase 1)
- [x] IVOR Assistant interface
- [x] Governance page structure
- [x] About Us page with mission/values
- [x] Voices section with 5 published articles
- [x] Story Archive with migrated blkoutuk.com content

#### Communications Hub (comms-blkout) - NEW in 1.5
- [x] SocialSync AI-assisted content creation with Gemini
- [x] Advent Calendar 2024 campaign with community engagement
- [x] Newsletter Archive integration via SendFox API
- [x] Community Directory with organization profiles
- [x] Discover Page with unified content feed
- [x] AI Agent System (Griot, Listener, Weaver, Strategist, Herald)
- [x] Platform-specific content optimization (Instagram, LinkedIn, X, etc.)
- [x] Draft management and scheduling system
- [x] Engagement analytics dashboard

#### Events Calendar
- [x] Google Sheets integration for event data
- [x] Supabase integration for extension submissions
- [x] Admin moderation queue (dual source)
- [x] Event scraping dashboard
- [x] Organization monitoring
- [x] Chrome extension for event curation (v1.0.0)
- [x] Extension download from main platform

#### Newsroom
- [x] Article submission and display
- [x] Supabase database integration
- [x] Admin moderation dashboard
- [x] Content warning system
- [x] Category filtering
- [x] Chrome extension for news curation (v1.0.0)
- [x] Extension download from main platform

#### IVOR AI
- [x] FastAPI backend deployed to Railway
- [x] GROQ AI integration
- [x] Basic conversation interface
- [x] Trauma-informed response system
- [x] API consumed by main platform

#### Content Curation System
- [x] Chrome extensions packaged and deployed
- [x] ModerationTools widget for admin dashboards
- [x] Automatic data extraction (Schema.org, Open Graph)
- [x] Image management (select + upload, max 5)
- [x] Edit-before-approve workflow
- [x] Offline capability with local storage
- [x] Dashboard integration post-submission

#### Shared Package (@blkout/shared) - NEW in 1.5
- [x] Centralized type definitions for all modules
- [x] Unified Supabase client configuration
- [x] Shared React hooks (useAnnouncements, etc.)
- [x] Common utility functions (formatting, constants)
- [x] Standardized component patterns
- [x] Module uniformity documentation

### 📊 Phase 1.5 Metrics

**Deployments:** 5 production services (including comms-blkout)
**Chrome Extensions:** 2 (Events, News)
**API Integrations:** 5 (Supabase, Google Sheets, Railway, SendFox, Gemini AI)
**External Services:** 2 (BLKOUTHUB, Scrollytelling)
**Shared Package:** @blkout/shared v1.0.0
**AI Agents:** 5 (Griot, Listener, Weaver, Strategist, Herald)

---

## Deployment Routes

### Route Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  blkout.vercel.app                          │
│                   (Main Platform)                           │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Homepage (/liberation)                          │     │
│  │  - Liberation quotes rotation                    │     │
│  │  - Photo Competition widget                      │     │
│  │  - Navigation cards to all services              │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Platform (/platform)                            │     │
│  │  - Discover page with service grid              │     │
│  │  - Links to Events, News, IVOR, etc.            │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Governance (/governance)                        │     │
│  │  - Community proposals                           │     │
│  │  - Voting interface                              │     │
│  │  - Democratic decision-making                    │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  IVOR (/intro)                                   │     │
│  │  - AI assistant introduction                     │     │
│  │  - Chat interface                                │     │
│  │  - Trauma-informed conversations                 │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  News (/news)                                    │     │
│  │  - Community-curated news articles               │     │
│  │  - Moderation queue approved content             │     │
│  │  - Category filtering and search                 │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Story Archive (/stories)                        │     │
│  │  - Migrated blkoutuk.com content                 │     │
│  │  - Historical BLKOUT articles                    │     │
│  │  - Category filtering and search                 │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Voices (/voices)                                │     │
│  │  - Editorial content (5 articles, growing)       │     │
│  │  - Opinion, Analysis, Editorial categories       │     │
│  │  - Featured articles spotlight                   │     │
│  │  - Article pitch/submission form                 │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Admin (/admin)                                  │     │
│  │  - Platform administration                       │     │
│  │  - ModerationTools widget                        │     │
│  │  - Extension downloads                           │     │
│  │  - Stats dashboard                               │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Extensions (/extensions/)                       │     │
│  │  - blkout-events-curator-v1.0.0.zip             │     │
│  │  - blkout-news-curator-v1.0.0.zip               │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
           │                    │                    │
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ events-blkout    │  │ news-blkout      │  │ IVOR API         │
│ .vercel.app      │  │ .vercel.app      │  │ (Railway)        │
│                  │  │                  │  │                  │
│ /admin           │  │ /admin           │  │ /api/ivor/chat   │
│ - Event queue    │  │ - News queue     │  │ /api/ivor/       │
│ - Download ext   │  │ - Download ext   │  │   stream         │
│                  │  │                  │  │                  │
│ Google Sheets ←──│  │ Supabase ←───────│  │ GROQ AI ←────────│
│ Supabase ←───────│  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
           │                    │
           │                    │
           ▼                    ▼
┌──────────────────────────────────────────┐
│      External Services (Links)           │
│                                          │
│  blkouthub.com                           │
│  - Community forums                      │
│  - Enhanced governance                   │
│                                          │
│  blkout-scrollytelling.vercel.app        │
│  - Liberation storytelling               │
│  - Multimedia narratives                 │
│                                          │
│  voices-blkout.vercel.app (Phase 2)      │
│  - Editorial admin dashboard             │
│  - Rich text editor & image management   │
│  - Publishing workflow                   │
└──────────────────────────────────────────┘
```

### API Integration Flow

```
User Browser
     │
     ├── Main Platform (blkout.vercel.app)
     │   ├── Static assets (cached 1 year)
     │   ├── API routes (/api/*)
     │   │   ├── /api/news → Proxy to Supabase
     │   │   ├── /api/stories → Proxy to Supabase
     │   │   ├── /api/events → Proxy to Railway
     │   │   └── /api/stats → Aggregated stats
     │   └── Frontend (React SPA)
     │
     ├── Events Calendar (events-blkout.vercel.app)
     │   ├── Frontend (React SPA)
     │   └── API routes
     │       ├── Google Sheets API
     │       └── Supabase (extension submissions)
     │
     ├── Newsroom (news-blkout.vercel.app)
     │   ├── Frontend (React SPA)
     │   └── API routes
     │       └── Supabase (articles + moderation)
     │
     └── IVOR Backend (Railway)
         └── FastAPI
             ├── /api/ivor/chat
             ├── /api/ivor/stream
             └── GROQ AI integration
```

---

## Future Development Phases

### Phase 2: Enhanced Integration & Governance (Q1 2026)

#### Planned Features

**1. Unified Authentication**
- Single sign-on across all services
- Role-based access control (Admin, Curator, Member)
- OAuth integration with BLKOUTHUB
- Curator application and approval workflow

**2. Advanced Governance**
- Proposal submission from any service
- Cross-platform voting synchronization
- Governance analytics dashboard
- Community decision tracking
- Treasury transparency dashboard (75% creator sovereignty)

**3. Enhanced Content Curation**
- AI-assisted content moderation (IVOR integration)
- Bulk import tools for curators
- Advanced search and filtering
- Content recommendation engine
- Duplicate detection

**4. Platform Analytics**
- Community engagement metrics
- Content performance tracking
- Curator productivity dashboard
- Platform health monitoring
- Liberation values compliance tracking

#### Technical Improvements

**API Gateway**
- Centralized API gateway for all services
- Rate limiting and quota management
- API key management for curators
- Request/response logging
- Circuit breaker patterns

**Database Consolidation**
- Migration from Google Sheets to Supabase
- Unified schema across services
- Real-time subscriptions
- Advanced querying capabilities
- Backup and disaster recovery

**Developer Experience**
- Monorepo setup with Turborepo
- Shared component library
- Design system documentation
- E2E testing infrastructure
- CI/CD automation

---

### Phase 3: Mobile & Advanced Features (Q2-Q3 2026)

#### Planned Features

**1. Mobile Applications**
- React Native apps for iOS & Android
- Push notifications for events/news
- Offline-first architecture
- Mobile-optimized content curation
- Native IVOR integration

**2. Advanced AI Features**
- IVOR voice interface
- Automated content categorization
- Smart event discovery
- Personalized recommendations
- Multi-language support (starting with AAVE, Patois)

**3. Creator Tools**
- Revenue dashboard with real-time tracking
- Content analytics for creators
- Collaboration tools
- Media library management
- Scheduling and publishing tools

**4. Community Features**
- Direct messaging
- Community forums (integrated with BLKOUTHUB)
- Event RSVPs and check-ins
- Community calendar integration
- Social sharing tools

#### Technical Improvements

**Performance**
- CDN optimization
- Image optimization pipeline
- Video streaming infrastructure
- Progressive Web App (PWA) enhancements
- Edge computing for global latency

**Security**
- End-to-end encryption for messages
- Advanced DDoS protection
- Content moderation AI
- Automated security scanning
- Penetration testing

---

### Phase 4: Platform Maturity & Scale (Q4 2026+)

#### Planned Features

**1. Cooperative Economics**
- Creator payout automation (75% revenue share)
- Transparent treasury management
- Community funding proposals
- Grant management system
- Financial reporting dashboard

**2. Platform Federation**
- ActivityPub integration
- Federated events and content
- Cross-platform governance
- Decentralized moderation
- Open protocol standards

**3. Advanced Governance**
- Quadratic voting
- Liquid democracy features
- Delegation systems
- Governance experiments
- Community constitution tools

**4. Ecosystem Expansion**
- Third-party developer API
- Plugin marketplace
- White-label platform offerings
- Partner integrations
- International expansion

#### Technical Improvements

**Scalability**
- Kubernetes deployment
- Multi-region redundancy
- Database sharding
- Event streaming architecture
- GraphQL federation

**Liberation Values**
- Automated bias detection
- Accessibility scoring
- Cultural authenticity validation
- Community impact measurement
- Ethics review board integration

---

## Integration Points

### Current Integration Matrix

| Service | Main Platform | Events | News | IVOR | BLKOUTHUB | Scrollytelling |
|---------|--------------|--------|------|------|-----------|----------------|
| **Main Platform** | - | Link | Link | API | Link | Link |
| **Events** | Download | - | - | - | - | - |
| **News** | Download | - | - | - | - | - |
| **IVOR** | API | - | - | - | - | - |
| **BLKOUTHUB** | Link | - | - | - | - | - |
| **Scrollytelling** | Link | - | - | - | - | - |

### Phase 2 Integration Goals

| Service | Main Platform | Events | News | IVOR | BLKOUTHUB | Scrollytelling | Voices |
|---------|--------------|--------|------|------|-----------|----------------|--------|
| **Main Platform** | - | SSO, API | SSO, API | API | SSO, API | SSO | Voices Display |
| **Events** | Download, API | - | Crosspost | AI Assist | Sync | - | - |
| **News** | Download, API | Crosspost | - | AI Assist | Sync | Archive | - |
| **Voices** | Display API | - | Archive | AI Assist | Sync | Featured | Admin Dashboard |
| **IVOR** | API | API | API | - | API | API | Content Assist |
| **BLKOUTHUB** | SSO, Governance | Event Sync | News Sync | AI Assist | - | Story Sync | Voice Sync |
| **Scrollytelling** | Link | Archive | Archive | - | Stories | - | Featured |

**Legend:**
- **SSO** = Single Sign-On
- **API** = Direct API integration
- **Link** = Navigation link only
- **Sync** = Data synchronization
- **Download** = Extension download hosting
- **Crosspost** = Content sharing between services
- **AI Assist** = IVOR-powered features

---

## Technical Stack

### Frontend Technologies

**Core Framework:**
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.1.0 (build tool)

**UI & Styling:**
- Tailwind CSS 3.4.0
- Framer Motion 11.0.0 (animations)
- Radix UI (accessible components)
- Lucide React (icons)

**State & Data:**
- React Hooks (local state)
- Supabase Client (database)
- Fetch API (HTTP requests)

### Backend Technologies

**IVOR API:**
- FastAPI (Python)
- GROQ AI models
- PostgreSQL
- Railway hosting

**Database:**
- Supabase (PostgreSQL)
- Google Sheets API (Events - Phase 1)

**Hosting:**
- Vercel (all frontend services)
- Railway (IVOR backend)

### Development Tools

**Code Quality:**
- ESLint (linting)
- TypeScript (type checking)
- Prettier (formatting - planned)

**Testing:**
- Vitest (unit tests)
- Accessibility tests (planned)
- E2E tests (Phase 2)

**Deployment:**
- Git (version control)
- GitHub (code hosting)
- Vercel CLI (deployment)
- Vercel GitHub integration (auto-deploy)

---

## Key Architectural Decisions

### 1. Modular Service Architecture
**Decision:** Deploy each major feature as an independent Vercel project
**Rationale:**
- Independent deployment cycles
- Service isolation reduces blast radius
- Team autonomy for different modules
- Easier to scale individual services

**Trade-offs:**
- Requires API integration between services
- Potential for service version mismatches
- More complex deployment coordination

### 2. Extension-Based Content Curation
**Decision:** Chrome extensions for curators instead of web-based forms
**Rationale:**
- Auto-extraction from existing web pages
- Reduced manual data entry
- Better curator experience
- Works across any website

**Trade-offs:**
- Requires curator technical setup
- Limited to Chrome browser
- Version management complexity

### 3. Dual Backend Strategy (Sheets + Supabase)
**Decision:** Support both Google Sheets and Supabase for events
**Rationale:**
- Backwards compatibility with existing workflows
- Gradual migration path
- Non-technical admin access via Sheets
- Developer-friendly API via Supabase

**Trade-offs:**
- Data synchronization challenges
- Duplicate moderation interfaces
- Technical debt to resolve in Phase 2

### 4. Centralized Extension Hosting
**Decision:** Host extensions on main platform, download from admin dashboards
**Rationale:**
- Single source of truth for extensions
- Easier version management
- Reduced deployment surface area
- Simplified curator experience

**Trade-offs:**
- Main platform becomes critical dependency
- All services must link to main platform

---

## Success Markers for Phase 1

Phase 1 establishes the following foundational markers that enable future development:

### ✅ Technical Foundation
- [x] Modular service architecture proven in production
- [x] Independent deployment pipelines established
- [x] API integration patterns defined
- [x] Chrome extension distribution system working
- [x] Admin tooling infrastructure in place

### ✅ Community Foundation
- [x] Content curation workflow operational
- [x] Moderation queue system validated
- [x] Liberation values embedded in UI/UX
- [x] Trauma-informed design principles applied
- [x] Accessibility standards met (WCAG 3.0 Bronze)

### ✅ Content Foundation
- [x] Events discovery and submission working
- [x] News curation and publication working
- [x] Photo competition infrastructure in place
- [x] IVOR AI assistant accessible
- [x] Community storytelling platform linked

### 🎯 Next Phase Enablers

Phase 1 creates these pathways to Phase 2:

**Authentication Infrastructure**
- Admin dashboard structure → SSO integration points identified
- Role-based UI → RBAC system architecture defined
- Curator tools → User management requirements clear

**Governance Infrastructure**
- Governance page structure → Proposal system architecture defined
- Community voting UI → Democratic tooling requirements clear
- Decision tracking → Governance database schema outlined

**Data Infrastructure**
- Dual backend (Sheets + Supabase) → Migration path to unified database
- Extension submission flow → Content pipeline architecture validated
- Moderation queue → Workflow automation opportunities identified

**Integration Infrastructure**
- Service linking → API gateway requirements defined
- External service integration → OAuth patterns established
- Cross-platform features → Event/content sync architecture planned

---

## Migration & Update Strategy

### Chrome Extension Updates

**Process:**
1. Update extension code in source directories
2. Increment version in `manifest.json`
3. Repackage using Python zipfile script
4. Update `ModerationTools.tsx` with new version number
5. Deploy main platform (Vercel auto-deploy)
6. Notify curators via BLKOUTHUB

**Version Naming:**
```
blkout-[service]-curator-v[major].[minor].[patch].zip
```

### Service Deployments

**Automatic (via GitHub):**
- Main platform: Push to `main` → Vercel auto-deploys
- Events calendar: Push to `main` → Vercel auto-deploys
- Newsroom: Push to `main` → Vercel auto-deploys

**Manual (via Vercel CLI):**
```bash
vercel --prod
```

### Database Migrations

**Current (Phase 1):**
- Manual SQL via Supabase dashboard
- Schema changes documented in commit messages

**Planned (Phase 2):**
- Migration tool (Prisma or TypeORM)
- Versioned migration files
- Automated rollback capabilities

---

## Monitoring & Observability

### Current Monitoring

**Vercel Analytics:**
- Deployment success/failure
- Build logs and errors
- Function execution metrics
- Traffic analytics

**Application Logs:**
- Browser console errors
- API request/response logging
- Extension submission tracking

### Phase 2 Monitoring Goals

**Application Performance:**
- Core Web Vitals tracking
- API latency monitoring
- Error tracking (Sentry)
- User session replay

**Business Metrics:**
- Content submission rates
- Curator productivity
- Community engagement
- Platform health score

**Liberation Values Metrics:**
- Accessibility compliance score
- Cultural authenticity validation
- Trauma-informed UX compliance
- Community impact measurement

---

## Conclusion

Phase 1 of the BLKOUT Platform establishes a **solid modular foundation** for community-owned liberation technology:

**✅ What We've Built:**
- 4 production services deployed and integrated
- 2 Chrome extensions for content curation
- AI-powered community assistant (IVOR)
- Liberation-focused UI with trauma-informed design
- Democratic governance infrastructure (foundation)
- Community onboarding and engagement flows

**🎯 What Phase 1 Enables:**
- **Authentication & Authorization** - Service structure ready for SSO
- **Advanced Governance** - Proposal and voting infrastructure in place
- **Content Ecosystem** - Curation workflow validated and scalable
- **Community Growth** - Onboarding and discovery systems operational
- **Technical Maturity** - API patterns and deployment routes established

**🚀 Path Forward:**
Phase 1 creates clear markers and pathways toward:
- Unified authentication (Phase 2 Q1 2026)
- Advanced governance tools (Phase 2 Q1-Q2 2026)
- Mobile applications (Phase 3 Q2-Q3 2026)
- Cooperative economics (Phase 4 Q4 2026+)
- Platform federation (Phase 4 Q4 2026+)

The platform is **production-ready**, **community-focused**, and **built for growth** while maintaining liberation values at every layer.

---

**Documentation Version:** 1.0
**Last Updated:** 2025-10-06
**Maintained By:** BLKOUT Development Team
**License:** Community-Owned Liberation Technology

🏴‍☠️ **For the culture. By the culture.**
