# BLKOUT Chrome Extension v1.0.2 - Clean Install

## Quick Installation Steps

1. **Download**: This folder contains the complete extension
2. **Open Chrome**: Go to `chrome://extensions/`
3. **Enable Developer Mode**: Toggle on the top-right
4. **Load Extension**: Click "Load unpacked" and select THIS folder (`blkout-extension-clean`)
5. **Done**: The BLKOUT extension should appear in your toolbar

## What's Inside
- ✅ manifest.json (extension config)
- ✅ background.js (service worker)
- ✅ popup/ folder (main extension UI)
- ✅ assets/ folder (icons)

## If You Get "Cannot Load Extension" Error:
1. Make sure you're selecting the `blkout-extension-clean` folder (not its parent)
2. Check that the folder contains `manifest.json`
3. Try refreshing Chrome extensions page
4. Disable/re-enable Developer mode

## Features (v1.0.2)
- Enhanced content detection for news sites
- Support for Reuters, Al Jazeera, HuffPost, Sky News, etc.
- Improved social media content scraping
- Smart event detection
- No authentication required - community submissions only

## Test It
1. Go to any news article (BBC, Guardian, etc.)
2. Click the BLKOUT extension icon
3. Should auto-detect content and show submission form