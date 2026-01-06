# Repository Context - BLKOUT Platform

## Current Session (December 31, 2024) - POST-RESTRUCTURE
- **Working Directory**: /home/robbe/blkout-platform/apps/community-platform
- **Repository**: blkout-community-platform
- **GitHub Remote**: https://github.com/BLKOUTUK/blkout-community-platform.git
- **Active Branch**: main
- **Status**: ✅ ACTIVE (relocated from archive to apps/ during restructure)
- **Last Modified Files**:
  - src/components/movement/TheoryOfChangeMasonry.tsx (Theory of Change page)
  - src/components/ui/MobileNav.tsx (navigation integration)
  - src/App.tsx (route + homepage card)

## Repository Map (Post-Restructure - December 31, 2024)

**ACTIVE Development** (`/home/robbe/blkout-platform/apps/`):
- `community-platform/` → GitHub: BLKOUTUK/blkout-community-platform ✅ ACTIVE (Theory of Change deployed)
- `news-blkout/` → GitHub: BLKOUTUK/news-blkout
- `events-calendar/` → GitHub: BLKOUTUK/events-calendar
- `crm/` → GitHub: BLKOUTUK/blkout-crm
- `ivor-core/` → GitHub: BLKOUTUK/ivor-core
- `comms-blkout/` → GitHub: BLKOUTUK/comms-blkout
- `blog/` → GitHub: BLKOUTUK/blog
- `scrollytelling/` → GitHub: BLKOUTUK/scrollytelling
- `research-agent/` → GitHub: BLKOUTUK/research-agent

**ARCHIVED Projects** (`/home/robbe/blkout-archive/`):
- `BLKOUTNXT_Ecosystem/` - 33 historical repos
- `BLKOUT_LIBERATION_PLATFORM/` - Legacy platform iterations (excluding community-platform which moved to active)
- `BLKOUTWEB_Integration/` - Old website integration
- `learning-journey/` - Docs and campaigns
- `brand-assets/` - Legacy images/videos
- `deprecated/` - Old configs

**✅ IMPORTANT**: blkout-community-platform is ACTIVE at `/home/robbe/blkout-platform/apps/community-platform/`

## Navigation Lessons Learned

### December 30, 2024: Repository Confusion
- **Issue**: Confused blkout-website with blkout-community-platform
- **Result**: Committed Theory of Change to wrong repository initially
- **Prevention**: Always run `git remote -v` before committing

### December 31, 2024: Wrong Repository Assumption
- **Issue**: Searched for Theory of Change in wrong repositories multiple times
- **User Correction**: "the page is 90% complete, it was deployed at blkoutuk.com/movement, I think it is a branch of git blkout-community-platform"
- **Prevention**: When user mentions "the page" or specific URL, ask which repo/app serves that URL

## Recent Operations (Last Session - Theory of Change)

**Tasks Completed**:
- ✅ Integrated Theory of Change page into platform navigation
- ✅ Fixed text positioning on 15+ cards to avoid covering faces
- ✅ Reduced text sizes and removed excessive caps
- ✅ Enabled autoplay on all decorative videos
- ✅ Added to mobile navigation and homepage
- ✅ Successfully deployed to production (blkoutuk.com/movement)

**Repository Used**: blkout-community-platform (now in blkout-archive/)

## Session Start Protocol

1. **Read this file FIRST** on every session start
2. **Verify location**: Run `pwd && git remote -v`
3. **Display context** to user:
   - Current repository
   - Last session summary (1 line)
   - Common mistakes to watch for

## Common Mistakes to Prevent

- ❌ Assuming "the website" means one specific repo (ask which!)
- ❌ Working in blkout-archive/ instead of blkout-platform/apps/
- ❌ Not verifying git remote before committing
- ❌ Searching all repos when user specifies a URL (map URL → repo first)

---

**Last Updated**: December 31, 2024
**Auto-updated by**: Session-end hook (will activate Week 2)
