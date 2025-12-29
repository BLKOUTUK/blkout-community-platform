# Resume: BLKOUT Unified Command Center Dashboard

## Context for Next Session

**What happened this session:**
- Event cancelled due to deployment failures
- Spent session fixing blkoutuk.com (got Stories archive working)
- Realized need for comprehensive validation dashboard
- Started planning unified command center but didn't implement

**Where we left off:**
- Created plan at `/home/robbe/.claude/plans/calm-soaring-taco.md`
- Plan includes health check dashboard design
- User wants ONE unified control center, not scattered dashboards

## Prompt to Resume

```
Continue building the BLKOUT Unified Command Center dashboard.

**Read first:**
- /home/robbe/.claude/plans/calm-soaring-taco.md (the approved plan)
- /home/robbe/blkout-platform/archive/legacy-active-projects/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform/SESSION_HANDOFF.md (deployment status)

**Requirements:**
- ONE unified control center for all BLKOUT operations
- Must integrate: Platform Health, CRM, Finance, Grants, Data Analytics
- Pre-promotion validation checklist
- Real-time service monitoring (7 services)
- Database integrity checks (281 articles, events, moderation queue)
- Deployment validation before going live
- Prevents failures like the event cancellation

**Architecture:**
- Location: blkout-community-platform repo (NOT blkout-website)
- Route: /command-center or /operations
- Integration with existing: AdminDashboard, IntegrationDashboard patterns
- Use existing: useIvorMonitoring hook, Supabase connections

**Critical learnings from this session:**
- ALWAYS verify which codebase is production
- ALWAYS test deployments before critical moments
- Build validation BEFORE tinkering with deploys
- Trust but verify - env vars, routes, databases

**Goal:** Organizational intelligence dashboard that prevents deployment emergencies and enables trust-building with community through reliable platform.

**Start by:** Reading the plan, understanding current platform status from SESSION_HANDOFF.md, then implement systematically with proper validation at each step.
```

## Quick Reference

**Correct Production Repo**:
- `/home/robbe/blkout-platform/archive/legacy-active-projects/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform`
- GitHub: `BLKOUTUK/blkout-community-platform`
- Deployment: Coolify "blkout-core" → blkoutuk.com

**Current Platform Status**:
- ✅ Stories: Working (281 articles)
- ❌ Newsroom: Empty (env vars not reaching code)
- ❌ Events: Blank page (same issue)
- ❌ Admin: Buttons don't work (same issue)

**Remaining Technical Debt**:
1. Fix VITE_ environment variable passing in Docker/Coolify
2. Get Newsroom/Events working
3. Enable admin moderation workflow
4. Remove hardcoded credentials from Dockerfile (security)

**Then Build**: Unified command center to monitor and validate everything before promotion.
