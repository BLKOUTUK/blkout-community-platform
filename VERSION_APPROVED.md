# BLKOUT Community Platform - Approved Production Version

**Version:** 1.0.0-production
**Commit:** `096f5832ccd7f7dceeeed966d846dbe54999c5f9`
**Approved Date:** 2026-01-27
**Status:** ✅ FINAL APPROVED VERSION

---

## Overview

This document captures the approved "final" version of the BLKOUT Community Platform. All features documented here have been tested, reviewed, and approved for production deployment.

## Platform Identity

- **Name:** blkout-community-platform
- **Repository:** BLKOUTUK/blkout-community-platform
- **Production URL:** https://blkoutuk.com
- **Tech Stack:** React 18, TypeScript, Vite, TailwindCSS, Supabase

## Source Statistics

- **Total Source Files:** 156 TypeScript/TSX files
- **Source Size:** 2.3MB
- **Components:** Modular architecture with extracted tabs/utils

---

## Approved Routes & Pages

| Route | Component | Status |
|-------|-----------|--------|
| `/` | Home (VideoHero + Grid) | ✅ Production |
| `/about` | AboutUs.tsx | ✅ Production |
| `/stories` | StoryArchive.tsx | ✅ Production |
| `/intro` | IVORIntroduction.tsx | ✅ Production |
| `/discover` | DiscoverPage.tsx | ✅ Production |
| `/governance` | GovernancePage.tsx | ✅ Production |
| `/governance-proposals` | GovernanceProposalsPage.tsx | ✅ Production |
| `/my-account` | MemberPortalPage.tsx | ✅ Production |
| `/finances` | FinancialDashboard.tsx | ✅ Production |
| `/terms` | TermsOfService.tsx | ✅ Production |
| `/privacy` | PrivacyPolicy.tsx | ✅ Production |
| `/platform` | PlatformPage.tsx | ✅ Production |
| `/admin` | AdminDashboard.tsx (modularized) | ✅ Production |
| `/health-dashboard` | HealthDashboard.tsx (modularized) | ✅ Production |
| `/movement` | TheoryOfChangeMasonry.tsx | ✅ Production |
| `/shop` | ShopPage.tsx | ✅ Production |
| `/board` | BoardNavigationHub.tsx | ✅ Production |

---

## Modularized Components

### AdminDashboard (87% reduction)
- **Original:** 1,737 lines → **Final:** 213 lines
- **Structure:**
  ```
  src/components/admin/
  ├── AdminDashboard.tsx     # Main orchestrator
  ├── types.ts               # Shared types
  ├── tabs/
  │   ├── OverviewTab.tsx
  │   ├── ModerationTab.tsx
  │   ├── SubmissionsTab.tsx
  │   └── ExtensionTab.tsx
  ├── submissions/
  │   ├── SingleStorySubmission.tsx
  │   ├── SingleEventSubmission.tsx
  │   └── BulkEventSubmission.tsx
  └── utils/
      └── expandRecurringEvent.ts
  ```

### HealthDashboard (79% reduction)
- **Original:** 1,384 lines → **Final:** 290 lines
- **Structure:**
  ```
  src/components/pages/health/
  ├── HealthDashboard.tsx    # Main orchestrator
  ├── types.ts               # Shared types
  ├── tabs/
  │   ├── OverviewTab.tsx
  │   ├── RoutesTab.tsx
  │   ├── DatabaseTab.tsx
  │   ├── InfrastructureTab.tsx
  │   └── ChecklistTab.tsx
  └── utils/
      ├── statusHelpers.tsx
      └── reportGenerator.ts
  ```

### Movement Page
- **Component:** TheoryOfChangeMasonry.tsx
- **Features:**
  - ScrollVideo component with IntersectionObserver
  - Scroll-triggered video autoplay
  - Standardized masonry card heights
  - HorizontalCTAScroll companion component

---

## Database Migrations Included

| Migration | Description |
|-----------|-------------|
| `20260110_create_board_management_tables.sql` | Governance board tables |
| `20260127_create_ivor_intelligence_table.sql` | IVOR intelligence storage |
| `20260127_verify_intelligence.sql` | Intelligence verification |
| `003_content_performance_feedback_loop.sql` | Performance feedback system |

---

## Services Included

| Service | Purpose |
|---------|---------|
| `analytics-dashboard-queries.ts` | Dashboard analytics |
| `feedback-loop-service.ts` | Content feedback system |
| `performance-metrics-service.ts` | Performance tracking |
| `platformHealthCheck.ts` | Health monitoring |
| `promotionChecklist.ts` | Pre-deployment checks |

---

## Infrastructure

- **Lighthouse Config:** `.lighthouserc.json` for performance audits
- **Test Config:** `vitest.config.ts` for testing
- **API Endpoints:** `api/admin/performance-metrics.ts`
- **Supabase Functions:** `supabase/functions/refresh-intelligence/`

---

## Key Features

1. **Video Hero Homepage** - Immersive entry experience
2. **Progressive Grid Reveal** - Interactive content discovery
3. **IVOR AI Assistant** - Community support chatbot
4. **Story Moderation** - Community content review
5. **Governance Portal** - Democratic decision-making
6. **Financial Dashboard** - Transparent finances
7. **Health Dashboard** - System monitoring
8. **Movement Page** - Theory of change storytelling
9. **Admin Dashboard** - Content management

---

## Dead Code Removed

The following legacy files have been removed:
- `App-debug.tsx`
- `App-minimal.tsx`
- `App-optimized.tsx`
- `App-original.tsx`

---

## Deployment

- **Host:** Coolify (self-hosted)
- **Domain:** blkoutuk.com
- **Auto-deploy:** On push to `main` branch
- **Supersedes:** blkout-website (scrollytelling) - now archived

---

## Approval Record

| Date | Action | Commit |
|------|--------|--------|
| 2026-01-27 | Movement scroll videos | `1f4fa612` |
| 2026-01-27 | AdminDashboard + HealthDashboard modularization | `b2e69610` |
| 2026-01-27 | DB migrations + infrastructure | `096f5832` |
| 2026-01-27 | **VERSION APPROVED** | `096f5832` |

---

*This version is approved as the production baseline for BLKOUT Community Platform.*
