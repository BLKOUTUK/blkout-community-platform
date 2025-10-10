const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Express API is working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Submit article endpoint
app.post('/api/voices/submit-article', async (req, res) => {
  try {
    const {
      name,
      email,
      title,
      category,
      content,
      excerpt,
      tags = [],
      featured = false,
      published = true,
      hero_image,
      hero_image_alt,
      thumbnail_image,
      thumbnail_alt
    } = req.body;

    // Validate
    if (!name || !email || !title || !category || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide name, email, title, category, and content',
      });
    }

    // Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Database connection not available',
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100) + '-' + Date.now().toString(36);

    const articleExcerpt = excerpt || content.substring(0, 200) + '...';

    const articleData = {
      title,
      content,
      excerpt: articleExcerpt,
      author: name,
      category,
      slug,
      published,
      published_at: published ? new Date().toISOString() : null,
      featured,
      tags,
      hero_image,
      hero_image_alt,
      thumbnail_image,
      thumbnail_alt,
    };

    const { data, error } = await supabase
      .from('voices_articles')
      .insert([articleData])
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to publish article',
        details: error.message,
      });
    }

    return res.json({
      success: true,
      message: 'Article published successfully!',
      data: data?.[0],
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'An unexpected error occurred',
    });
  }
});

// Export for Vercel
module.exports = app;
