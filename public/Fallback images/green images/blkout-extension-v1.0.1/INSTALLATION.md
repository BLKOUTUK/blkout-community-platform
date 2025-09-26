# BLKOUT Community Submission Tool - Installation Guide

## Fixed Version 1.0.1
**✅ Authentication Issue Resolved** - Now works without admin credentials!

This Chrome extension allows you to submit events and articles to the BLKOUT Liberation Platform directly from any webpage.

## What's Fixed
- ✅ Updated API endpoints to use correct production URLs
- ✅ Removed authentication dependency (no admin credentials required)
- ✅ Uses public content submission endpoint
- ✅ Fixed domain permissions in manifest

## Installation Steps

### 1. Download Extension
This extension is located in your BLKOUT platform repository:
```
/public/Fallback images/green images/blkout-extension-v1.0.1/
```

### 2. Install in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `blkout-extension-v1.0.1` folder
5. The BLKOUT extension should now appear in your extensions

### 3. How to Use

#### Quick Submission (Popup)
1. Click the BLKOUT extension icon in your browser toolbar
2. The extension will automatically scan the current page for content
3. Choose **Submit Event** or **Submit Article**
4. Fill in the form and click **Submit to BLKOUT**

#### Context Menu Submission
1. Right-click on any page, link, or selected text
2. Choose **Submit to BLKOUT** from the context menu
3. Fill in the quick form that appears
4. Click **Submit**

## Supported Platforms
The extension automatically detects content from:
- The Guardian
- BBC News
- The Independent
- Twitter/X
- Eventbrite
- Facebook Events
- Meetup
- Generic websites (articles and events)

## Content Processing
All submissions:
- ✅ Go through community moderation process
- ✅ Are reviewed by moderators before publishing
- ✅ Maintain liberation values and community standards
- ✅ Support community-submitted content without admin credentials

## Troubleshooting

### Extension Not Loading
- Ensure Developer mode is enabled in Chrome extensions
- Check that all files are present in the extension folder
- Try reloading the extension

### Submission Fails
- Check your internet connection
- The extension now uses `https://blkout-community-platform.vercel.app/api/content`
- All submissions are reviewed by moderators (24-48 hours)

### Permission Errors
- The extension may request permissions for various news sites
- These are used for content detection only
- No personal data is collected or transmitted

## Technical Details
- **API Endpoint**: `https://blkout-community-platform.vercel.app/api/content`
- **Authentication**: None required (public submissions)
- **Content Review**: All submissions go to moderation queue
- **Response Time**: Confirmation immediate, review within 24-48 hours

## Community Values
This extension supports BLKOUT's liberation values:
- 🏠 **Community First**: No admin barriers, accessible submissions
- 🤝 **Collective Wisdom**: Community moderation and review
- 🛡️ **Protected Spaces**: Content reviewed for safety and appropriateness
- 🌱 **Democratic Process**: All content subject to community review

---
**Status**: ✅ Ready for use (Fixed authentication issue)
**Version**: 1.0.1
**Last Updated**: 2025-09-26