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

// Canonical host (14 Sep 2026): www and the Coolify sslip hostname answer this app too.
// Page requests on an alias 301 to blkoutuk.com; /api stays reachable on every host.
// GET/HEAD only — a 301 would turn a POST into a GET.
const CANONICAL_HOST = 'blkoutuk.com';
const HOST_ALIASES = new Set(['www.blkoutuk.com', 'rckcogcwos884c4sgww0gwow.72.61.201.5.sslip.io']);
app.use((req, res, next) => {
  const host = String(req.headers.host || '').toLowerCase().replace(/:\d+$/, '');
  if (HOST_ALIASES.has(host) && (req.method === 'GET' || req.method === 'HEAD') && !req.path.startsWith('/api/')) {
    return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
  }
  next();
});

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

// /newsroom/* is the pre-2025 site's news path. Nothing links it now, but old links and
// crawlers still hit /newsroom/null (21 pageviews Jul–Aug 2026 in Plausible) and the SPA
// shell answered 200. Send them to the newsroom that exists.
app.use((req, res, next) => {
  if (req.path === '/newsroom' || req.path.startsWith('/newsroom/')) {
    return res.redirect(301, 'https://news.blkoutuk.com/');
  }
  next();
});

// Vanity redirects → canonical pages on their own subdomains.
// 302 (not 301) so these marketing URLs stay repointable year to year.
// Must precede express.static / SPA fallback so they aren't shadowed.
app.use((req, res, next) => {
  if (req.path === '/ivorstable' || req.path === '/ivorstable/') {
    return res.redirect(302, 'https://comms.blkoutuk.com/ivors-table.html');
  }
  if (req.path === '/picnic' || req.path === '/picnic/') {
    return res.redirect(302, 'https://commons.blkoutuk.com/picnic.html');
  }
  // Newsletter signup. Own the shared link so the list host stays swappable.
  if (['/subscribe', '/subscribe/', '/newsletter', '/newsletter/'].includes(req.path)) {
    return res.redirect(302, 'https://sendfox.com/blkoutuk');
  }
  next();
});

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist'), { redirect: false }));

// SPA fallback - serve index.html for all non-API routes
// /stories/<slug> republishes Voices articles (and the archive) inside the SPA, so a crawler saw a
// bare shell and search engines saw a duplicate of voices.blkoutuk.com. Serve the shell with the
// story's title, description and a canonical: the Voices URL for Voices pieces, itself for archive
// pieces (which also get Article schema and their text). Any failure falls through to the shell.
app.get('/stories/:slug', async (req, res, next) => {
  const slug = String(req.params.slug || '');
  if (!/^[a-z0-9][a-z0-9-]{2,200}$/i.test(slug)) return next();
  try {
    const { default: storiesHandler } = await import('./api/stories.ts');
    const payload = await new Promise((resolve, reject) => {
      const fakeRes = {
        _status: 200,
        setHeader() { return this; },
        status(c) { this._status = c; return this; },
        json(body) { resolve({ status: this._status, body }); },
        end() { resolve({ status: this._status, body: null }); },
      };
      Promise.resolve(storiesHandler({ method: 'GET', query: { slug, limit: '1' }, headers: {} }, fakeRes)).catch(reject);
    });
    const story = payload && payload.body && payload.body.data && Array.isArray(payload.body.data.stories) ? payload.body.data.stories.find((st) => st.slug === slug) : null;
    if (!story) return next();
    const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const strip = (v) => String(v ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const description = strip(story.excerpt || story.content).slice(0, 300);
    const isVoices = story.source === 'voices';
    const canonical = isVoices ? `https://voices.blkoutuk.com/articles/${slug}` : `https://blkoutuk.com/stories/${slug}`;
    const shellPath = path.join(DIST, fs.existsSync(path.join(DIST, 'shell.html')) ? 'shell.html' : 'index.html');
    let html = fs.readFileSync(shellPath, 'utf8');
    const headBits = [`<link rel="canonical" href="${esc(canonical)}" />`];
    if (!isVoices) {
      const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: story.title, description, url: canonical, mainEntityOfPage: canonical,
        author: { '@type': 'Organization', name: story.author || 'BLKOUT UK' }, publisher: { '@type': 'Organization', name: 'BLKOUT UK', url: 'https://blkoutuk.com' },
        ...(story.publishedAt ? { datePublished: story.publishedAt } : {}), ...(story.category ? { articleSection: story.category } : {}) };
      headBits.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
    }
    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(story.title)} | BLKOUT</title>\n    ${headBits.join('\n    ')}`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
      .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(story.title)}" />`)
      .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
      .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${esc(canonical)}" />`);
    if (!isVoices) {
      const body = `<article><h1>${esc(story.title)}</h1>${story.excerpt ? `<p>${esc(strip(story.excerpt))}</p>` : ''}<div>${String(story.content || '').replace(/<(script|iframe|style|object|embed)[\s\S]*?<\/\1>/gi, '').replace(/\son\w+="[^"]*"/gi, '')}</div></article>`;
      html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
    }
    res.setHeader('Cache-Control', 'no-store');
    res.send(html);
  } catch (error) {
    console.error('STORY HEAD INJECTION FAILED — serving bare shell:', error);
    next();
  }
});

// Prerendered routes (scripts/prerender.mjs) live at dist/<route>/index.html and the bare
// shell at dist/shell.html. An extensionless GET gets its prerendered page if one exists,
// otherwise the shell — never another route's prerendered content.
const fs = require('fs');
const DIST = path.join(__dirname, 'dist');
app.use((req, res, next) => {
  // Skip if already handled by API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  const clean = path.normalize(req.path).replace(/\/+$/, '');
  const prerendered = path.join(DIST, clean, 'index.html');
  if (clean && prerendered.startsWith(DIST + path.sep) && !path.extname(clean) && fs.existsSync(prerendered)) {
    return res.sendFile(prerendered);
  }
  res.sendFile(path.join(DIST, fs.existsSync(path.join(DIST, 'shell.html')) ? 'shell.html' : 'index.html'));
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
