# Railway Deployment Guide - BLKOUT Community Platform

## Quick Deploy
1. **Login to Railway**: `railway login`
2. **Create Project**: `railway init`
3. **Set Environment Variables**: Copy from Vercel or set manually
4. **Deploy**: `railway up`

## Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production
```

## Phase 1 Beta Status ✅
- **Database Schema**: Applied to Supabase with real data
- **API Endpoints**: Working with live database integration
- **Admin Dashboard**: Ready with moderation queue and stats
- **Liberation Values**: 75% creator sovereignty compliance enforced

## Production URLs
- **Vercel**: https://blkout-community-platform-clurcky2q-robs-projects-54d653d3.vercel.app
- **Railway**: Will be available after deployment

## Files Configured
- `railway.toml` - Railway service configuration
- `nixpacks.toml` - Build environment setup
- `package.json` - Build and start scripts ready

## Manual Deployment Steps
1. Open Railway dashboard: https://railway.app
2. Create new project from GitHub repository
3. Add environment variables from Vercel
4. Deploy automatically triggers

The BLKOUT Community Platform is ready for Railway deployment with real database integration for Phase 1 beta launch.