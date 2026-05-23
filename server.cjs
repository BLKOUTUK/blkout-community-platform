/**
 * BLKOUT Liberation Platform - Production Server
 * Express server for Coolify deployment
 * Serves static files and API routes
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes - Import and mount Vercel-style handlers
// Health check
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'blkout-liberation-platform',
    version: '1.0.0-production'
  });
});

// Stories API
app.get('/api/stories', async (req, res) => {
  try {
    const { default: handler } = await import('./api/stories.ts');
    return handler(req, res);
  } catch (error) {
    console.error('Stories API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// News API
app.get('/api/news', async (req, res) => {
  try {
    const { default: handler } = await import('./api/news.ts');
    return handler(req, res);
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Events API
app.get('/api/events', async (req, res) => {
  try {
    const { default: handler } = await import('./api/events.ts');
    return handler(req, res);
  } catch (error) {
    console.error('Events API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Content API
app.get('/api/content', async (req, res) => {
  try {
    const { default: handler } = await import('./api/content.ts');
    return handler(req, res);
  } catch (error) {
    console.error('Content API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// IVOR Chat - DISABLED (Express 5 wildcard route syntax issue)
// Frontend calls https://ivor.blkoutuk.cloud directly
/*
app.all('/api/ivor/:path*', async (req, res) => {
  // Commented out - causing server crash
});
*/

// Commons interest form
app.post('/api/commons-interest', async (req, res) => {
  try {
    const { default: handler } = await import('./api/commons-interest.ts');
    return handler(req, res);
  } catch (error) {
    console.error('Commons interest API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin routes
app.all('/api/admin/:endpoint', async (req, res) => {
  try {
    const adminPath = req.path.replace('/api/admin/', '');
    const handler = await import(`./api/admin/${adminPath}.ts`);
    return handler.default(req, res);
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook routes
app.all('/api/webhooks/:webhook', async (req, res) => {
  try {
    const webhookPath = req.path.replace('/api/webhooks/', '');
    const handler = await import(`./api/webhooks/${webhookPath}.ts`);
    return handler.default(req, res);
  } catch (error) {
    console.error('Webhook API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Commons moved to its own subdomain (BLKOUTUK/commons, commons.blkoutuk.com).
// Map the old report filenames (without 01-/02- prefix) to the new ones,
// then send everything else under /commons/* to the subdomain root.
// Must precede express.static so static /commons assets don't shadow the redirect.
app.use((req, res, next) => {
  if (req.path === '/commons/reports/data-capitalism-algorithmic-racism.pdf') {
    return res.redirect(301, 'https://commons.blkoutuk.com/reports/01-data-capitalism-algorithmic-racism.pdf');
  }
  if (req.path === '/commons/reports/strategic-roadmap.pdf') {
    return res.redirect(301, 'https://commons.blkoutuk.com/reports/02-strategic-roadmap.pdf');
  }
  if (req.path === '/commons' || req.path === '/commons/') {
    return res.redirect(301, 'https://commons.blkoutuk.com/');
  }
  if (req.path.startsWith('/commons/')) {
    return res.redirect(301, `https://commons.blkoutuk.com/${req.path.replace(/^\/commons\//, '')}`);
  }
  next();
});

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for all non-API routes
app.use((req, res, next) => {
  // Skip if already handled by API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏴 BLKOUT Liberation Platform running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 IVOR API: ${process.env.IVOR_API_URL || 'https://ivor.blkoutuk.cloud'}`);
});
