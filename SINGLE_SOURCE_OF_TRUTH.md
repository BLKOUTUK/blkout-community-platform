# BLKOUT Platform - Single Source of Truth
**Last Updated**: 2025-10-30
**Status**: ✅ Cleaned and Organized

## 🎯 Production Deployments

### Main Website
**Repository**: `/home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform/fresh-blkout/`
- **GitHub**: https://github.com/BLKOUTUK/blkout-community-platform
- **Production URL**: https://fresh-blkout.vercel.app
- **Vercel Project**: `fresh-blkout` (prj_PLq2fD5hvtFhtqmNnseztO0uzK97)
- **Purpose**: Main community platform with photo competition, Late.dev integration
- **Framework**: Vite + React + TypeScript
- **Last Updated**: October 30, 2025

### Main Domain
**Repository**: `/home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform/`
- **GitHub**: https://github.com/BLKOUTUK/blkout-community-platform
- **Production URL**: https://blkoutuk.com
- **Vercel Project**: `blkout-community-platform` (prj_f8yyG0DIO2rzUViJpPoeuACiUxwC)
- **Purpose**: Main domain deployment
- **Framework**: Vite + React + TypeScript

## 🌐 Supporting Services

### Mental Health Resources
- **URL**: https://mental-health.blkoutuk.com
- **Vercel Project**: `mental-health-briefing`
- **Purpose**: Mental health resources and support

### News Platform
- **URL**: https://news-blkout.vercel.app
- **Vercel Project**: `news-blkout`
- **Purpose**: Community news and articles

### Events Calendar
- **URL**: https://events-blkout.vercel.app
- **Vercel Project**: `black-qtipoc-events-calendar`
- **Purpose**: Community events calendar

### Blog
- **URL**: https://blkout-blog.vercel.app
- **Vercel Project**: `blkout-blog`
- **Purpose**: Community blog platform

### Scrollytelling Experience
- **URL**: https://blkout-scrollytelling.vercel.app
- **Vercel Project**: `blkout-scrollytelling`
- **Purpose**: Interactive storytelling experience

## 🤖 AI Services

### IVOR AI Assistant
- **URL**: https://ivor-core.vercel.app
- **Vercel Project**: `ivor-core`
- **Purpose**: AI-powered community assistant

## 🗂️ Repository Structure

```
/home/robbe/ACTIVE_PROJECTS/
└── BLKOUT_LIBERATION_PLATFORM/
    └── blkout-community-platform/
        ├── fresh-blkout/              ← MAIN WEBSITE (fresh-blkout.vercel.app)
        │   ├── src/
        │   │   ├── components/
        │   │   ├── lib/
        │   │   │   └── latedev.ts     ← Late.dev client
        │   │   └── pages/
        │   ├── api/
        │   │   └── webhooks/
        │   │       └── social-media-automation.ts
        │   ├── LATE_DEV_INTEGRATION.md
        │   ├── LATE_DEV_USAGE_EXAMPLES.md
        │   └── SINGLE_SOURCE_OF_TRUTH.md (this file)
        │
        └── (parent directory for blkoutuk.com)
```

## 🔧 Environment Variables

### Required for Fresh-BLKOUT
```bash
# Supabase
VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
VITE_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>

# Late.dev Social Media Automation
LATE_API_KEY=<your-late-api-key>

# GROQ AI (for IVOR)
GROQ_API_KEY=<your-groq-key>
```

### Vercel Environment Variables
All environment variables are configured in Vercel dashboard for:
- Production environment
- Preview environment

## 📋 Deployment Workflow

### For Fresh-BLKOUT
1. Make changes in `/fresh-blkout/` directory
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```
3. Vercel automatically deploys to https://fresh-blkout.vercel.app
4. Changes are live within 1-2 minutes

### For Adding Features
1. Add code to appropriate directory in `/fresh-blkout/src/`
2. Update documentation if needed
3. Test locally with `npm run dev`
4. Commit and push to GitHub
5. Verify deployment in Vercel dashboard

## 🚨 What NOT to Do

### ❌ NEVER Update These (Deleted/Legacy)
- ~~blkout-website~~ (deleted - was blkout-beta.vercel.app)
- ~~blkout-liberation-platform~~ (deleted)
- ~~blkout-liberation-frontend~~ (deleted)
- ~~blkout-liberation-frontend-dev~~ (deleted)
- ~~blkout-simple-technical~~ (deleted)
- ~~blkout-static~~ (deleted)
- ~~blkout-lib~~ (deleted)

### ❌ NEVER Work in Wrong Directory
**WRONG**: `/home/robbe/ACTIVE_PROJECTS/BLKOUTNXT_Ecosystem/BLKOUTNXT_Projects/website/blkout-website/`
**RIGHT**: `/home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform/fresh-blkout/`

## ✅ Quick Reference

### To Update Photo Competition
File: `src/components/competition/CompetitionLanding.tsx`
Location: `/fresh-blkout/src/components/competition/`

### To Update Social Media Integration
Files:
- `src/lib/latedev.ts` (client library)
- `api/webhooks/social-media-automation.ts` (webhook endpoint)

### To Deploy
```bash
cd /home/robbe/ACTIVE_PROJECTS/BLKOUT_LIBERATION_PLATFORM/blkout-community-platform/fresh-blkout
git add .
git commit -m "your changes"
git push origin main
```

### To Check Deployment Status
```bash
npx vercel ls | grep fresh-blkout
```

## 📞 Troubleshooting

### "Changes not appearing on site"
1. ✅ Verify you're in `/fresh-blkout/` directory (not blkout-website!)
2. ✅ Check git push succeeded
3. ✅ Check Vercel deployment: `npx vercel ls`
4. ✅ Wait 1-2 minutes for build to complete

### "Wrong site updating"
- You're probably in the wrong directory
- **Always work in**: `/fresh-blkout/`
- **Never work in**: `/blkout-website/` (deleted)

### "Environment variable missing"
```bash
cd /fresh-blkout
npx vercel env add VARIABLE_NAME production
npx vercel env add VARIABLE_NAME preview
```

---

**Status**: ✅ Production Ready
**Total Active Projects**: 8 (down from 15)
**Last Cleanup**: October 30, 2025
