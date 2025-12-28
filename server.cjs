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

// IVOR Chat - proxy to ivor-core backend
app.all('/api/ivor/:path*', async (req, res) => {
  try {
    // Proxy to ivor.blkoutuk.cloud
    const ivorUrl = process.env.IVOR_API_URL || 'https://ivor.blkoutuk.cloud';
    const targetPath = req.path.replace('/api/ivor', '/api');

    const response = await fetch(`${ivorUrl}${targetPath}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('IVOR proxy error:', error);
    res.status(500).json({ error: 'IVOR service unavailable' });
  }
});

// Admin routes
app.all('/api/admin/*', async (req, res) => {
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
app.all('/api/webhooks/*', async (req, res) => {
  try {
    const webhookPath = req.path.replace('/api/webhooks/', '');
    const handler = await import(`./api/webhooks/${webhookPath}.ts`);
    return handler.default(req, res);
  } catch (error) {
    console.error('Webhook API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
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
