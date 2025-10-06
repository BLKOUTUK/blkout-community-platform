// BLKOUT Extension Popup Logic
const API_BASE = 'https://blkout-community-platform.vercel.app/api';

class BlkoutPopup {
  constructor() {
    this.currentTab = null;
    this.detectedContent = null;
    this.init();
  }
  
  async init() {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab;
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Scan current page
    this.scanCurrentPage();
  }
  
  setupEventListeners() {
    // Quick action buttons
    document.getElementById('submit-event').addEventListener('click', () => {
      this.showForm('event');
    });
    
    document.getElementById('submit-article').addEventListener('click', () => {
      this.showForm('article');
    });
    
    // Form type change
    document.getElementById('type').addEventListener('change', (e) => {
      this.toggleFormFields(e.target.value);
    });
    
    // Form submission
    document.getElementById('submission-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', () => {
      this.hideForm();
    });
  }
  
  async scanCurrentPage() {
    try {
      // Inject content script to detect content
      const results = await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        func: this.detectPageContent
      });
      
      if (results && results[0] && results[0].result) {
        this.detectedContent = results[0].result;
        this.updateDetectionStatus(true);
      } else {
        this.updateDetectionStatus(false);
      }
    } catch (error) {
      console.error('Error scanning page:', error);
      this.updateDetectionStatus(false);
    }
  }
  
  // Enhanced content detection function (injected into page)
  detectPageContent() {
    const url = window.location.href;
    const hostname = window.location.hostname;
    const title = document.querySelector('h1')?.textContent?.trim() ||
                 document.title?.trim();

    // Helper function to extract clean text
    const cleanText = (text) => text?.replace(/\s+/g, ' ').trim();

    // Helper function to find content using multiple selectors
    const findContent = (selectors) => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return cleanText(element.textContent);
      }
      return null;
    };

    // Helper function to find author
    const findAuthor = (selectors) => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = cleanText(element.textContent);
          if (text && text.length > 0 && text.length < 100) return text;
        }
      }
      return null;
    };

    // Enhanced Guardian detection
    if (hostname.includes('theguardian.com')) {
      const headline = findContent([
        'h1[data-gu-name="headline"]',
        '.content__headline',
        '[data-component="headline"]',
        'h1.headline',
        'h1'
      ]);

      const standfirst = findContent([
        '[data-gu-name="standfirst"]',
        '.content__standfirst',
        '[data-component="standfirst"]',
        '.standfirst'
      ]);

      const content = findContent([
        '[data-gu-name="body"]',
        '.content__article-body',
        '[data-component="text-block"]',
        'article .content',
        '.article-body'
      ]);

      const author = findAuthor([
        '[data-gu-name="author"]',
        '.byline',
        '[data-component="contributor-byline"]',
        '.contributor__name'
      ]);

      if (headline && (content || standfirst)) {
        return {
          type: 'article',
          platform: 'guardian',
          title: headline,
          description: standfirst || content?.substring(0, 400),
          author: author || 'The Guardian',
          url
        };
      }
    }
    
    // Enhanced BBC detection
    if (hostname.includes('bbc.co.uk') || hostname.includes('bbc.com')) {
      const headline = findContent([
        'h1[data-testid="headline"]',
        '[data-component="headline"]',
        'h1[class*="headline"]',
        'h1.story-headline',
        'h1'
      ]);

      const content = findContent([
        '[data-component="text-block"]',
        '[data-testid="article-body"]',
        '.story-body__inner',
        'article [class*="text"]',
        '.article-body'
      ]);

      const author = findAuthor([
        '[data-testid="author-name"]',
        '.byline',
        '.author-name',
        '[class*="byline"]'
      ]);

      if (headline && content) {
        return {
          type: 'article',
          platform: 'bbc',
          title: headline,
          description: content.substring(0, 400),
          author: author || 'BBC News',
          url
        };
      }
    }
    
    // Enhanced Independent detection
    if (hostname.includes('independent.co.uk')) {
      const headline = findContent([
        'h1[data-testid="headline"]',
        'h1.headline',
        'h1',
        '[data-testid="article-headline"]'
      ]);

      const content = findContent([
        '.sc-1tw5ko3-3',
        'article [class*="text"]',
        '.article-content',
        '[data-testid="article-content"]',
        'article'
      ]);

      const author = findAuthor([
        '[data-testid="author-name"]',
        '.byline',
        '.author-name',
        '[class*="byline"]'
      ]);

      if (headline && content) {
        return {
          type: 'article',
          platform: 'independent',
          title: headline,
          description: content.substring(0, 400),
          author: author || 'The Independent',
          url
        };
      }
    }

    // Sky News detection
    if (hostname.includes('news.sky.com')) {
      const headline = findContent([
        'h1[data-testid="headline"]',
        'h1.headline',
        'h1',
        '.article__headline'
      ]);

      const content = findContent([
        '[data-testid="article-content"]',
        '.article__body',
        'article [class*="text"]',
        '.story-body'
      ]);

      const author = findAuthor([
        '.author',
        '.byline',
        '[data-testid="author"]'
      ]);

      if (headline && content) {
        return {
          type: 'article',
          platform: 'sky-news',
          title: headline,
          description: content.substring(0, 400),
          author: author || 'Sky News',
          url
        };
      }
    }

    // Channel 4 News detection
    if (hostname.includes('channel4.com')) {
      const headline = findContent([
        'h1.article__headline',
        'h1',
        '.headline'
      ]);

      const content = findContent([
        '.article__body',
        'article [class*="content"]',
        '.story-content'
      ]);

      if (headline && content) {
        return {
          type: 'article',
          platform: 'channel4',
          title: headline,
          description: content.substring(0, 400),
          author: 'Channel 4 News',
          url
        };
      }
    }

    // ITV News detection
    if (hostname.includes('itv.com')) {
      const headline = findContent([
        'h1.article__title',
        'h1',
        '.headline'
      ]);

      const content = findContent([
        '.article__body',
        'article [class*="content"]',
        '.story-body'
      ]);

      if (headline && content) {
        return {
          type: 'article',
          platform: 'itv',
          title: headline,
          description: content.substring(0, 400),
          author: 'ITV News',
          url
        };
      }
    }
    
    // Enhanced Twitter/X detection
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const tweetText = findContent([
        '[data-testid="tweetText"]',
        '[data-testid="tweet-text"]',
        '.tweet-text',
        '[class*="tweet"][class*="text"]'
      ]);

      const userName = findAuthor([
        '[data-testid="User-Name"]',
        '[data-testid="username"]',
        '.username',
        '[class*="username"]'
      ]);

      if (tweetText && tweetText.length > 20) {
        return {
          type: 'article',
          platform: 'twitter',
          title: tweetText.length > 100 ? tweetText.substring(0, 100) + '...' : tweetText,
          description: tweetText,
          author: userName || 'Twitter User',
          url
        };
      }
    }

    // LinkedIn detection
    if (hostname.includes('linkedin.com')) {
      const content = findContent([
        '.feed-shared-text',
        '[data-testid="main-feed-activity-card"] .feed-shared-text',
        '.article-content',
        'article'
      ]);

      const author = findAuthor([
        '.feed-shared-actor__name',
        '.author-name',
        '[data-testid="post-author-name"]'
      ]);

      if (content && content.length > 50) {
        return {
          type: 'article',
          platform: 'linkedin',
          title: content.length > 100 ? content.substring(0, 100) + '...' : content,
          description: content,
          author: author || 'LinkedIn User',
          url
        };
      }
    }

    // Instagram detection (for public posts)
    if (hostname.includes('instagram.com')) {
      const content = findContent([
        'article [class*="caption"]',
        '[class*="caption"]',
        'meta[property="og:description"]'
      ]);

      const author = findAuthor([
        'header [class*="username"]',
        '[class*="username"]'
      ]);

      if (content && content.length > 20) {
        return {
          type: 'article',
          platform: 'instagram',
          title: content.length > 100 ? content.substring(0, 100) + '...' : content,
          description: content,
          author: author || 'Instagram User',
          url
        };
      }
    }

    // Reuters detection
    if (hostname.includes('reuters.com')) {
      const headline = findContent([
        'h1[data-testid="headline"]',
        'h1.ArticleHeader_headline',
        'h1',
        '.headline'
      ]);

      const content = findContent([
        '[data-testid="paragraph"]',
        '.ArticleBodyWrapper',
        '.StandardArticleBody_body',
        'article [data-testid="body"]'
      ]);

      const author = findAuthor([
        '.Attribution_container',
        '.byline',
        '[data-testid="author-name"]'
      ]);

      if (headline && content) {
        return {
          type: 'article',
          platform: 'reuters',
          title: headline,
          description: content.substring(0, 400),
          author: author || 'Reuters',
          url
        };
      }
    }

    // Al Jazeera detection
    if (hostname.includes('aljazeera.com')) {
      const headline = findContent([
        'h1.article-heading',
        'h1[data-testid="post-title"]',
        'h1',
        '.headline'
      ]);

      const content = findContent([
        '.wysiwyg',
        '.article-p-wrapper',
        'article .content',
        '[data-testid="article-body"]'
      ]);

      const author = findAuthor([
        '.article-author-name',
        '.byline',
        '[data-testid="author-name"]'
      ]);

      if (headline && content) {
        return {
          type: 'article',
          platform: 'aljazeera',
          title: headline,
          description: content.substring(0, 400),
          author: author || 'Al Jazeera',
          url
        };
      }
    }

    // HuffPost detection
    if (hostname.includes('huffpost.com') || hostname.includes('huffingtonpost')) {
      const headline = findContent([
        'h1.headline__title',
        'h1[data-testid="card-headline"]',
        'h1',
        '.headline'
      ]);

      const content = findContent([
        '.entry__text',
        '.yr-entry-text',
        'article .content',
        '[data-testid="card-text"]'
      ]);

      const author = findAuthor([
        '.entry-wirepartner__byline',
        '.author-card__details',
        '.byline'
      ]);

      if (headline && content) {
        return {
          type: 'article',
          platform: 'huffpost',
          title: headline,
          description: content.substring(0, 400),
          author: author || 'HuffPost',
          url
        };
      }
    }

    // Platform-specific event detection
    if (hostname.includes('eventbrite.com')) {
      const eventTitle = document.querySelector('h1[data-automation="event-title"]')?.textContent?.trim();
      const description = document.querySelector('[data-automation="event-description"]')?.textContent?.trim();
      const dateTime = document.querySelector('[data-automation="event-date-time"]')?.textContent?.trim();
      const location = document.querySelector('[data-automation="event-location"]')?.textContent?.trim();
      
      if (eventTitle) {
        return {
          type: 'event',
          platform: 'eventbrite',
          title: eventTitle,
          description: description?.substring(0, 300),
          dateTime,
          location,
          url
        };
      }
    }
    
    if (hostname.includes('facebook.com') && url.includes('/events/')) {
      const eventTitle = document.querySelector('[data-testid="event-title"]')?.textContent?.trim() ||
                        document.querySelector('h1')?.textContent?.trim();
      const description = document.querySelector('[data-testid="event-description"]')?.textContent?.trim();
      
      if (eventTitle) {
        return {
          type: 'event',
          platform: 'facebook',
          title: eventTitle,
          description: description?.substring(0, 300),
          url
        };
      }
    }
    
    if (hostname.includes('meetup.com')) {
      const eventTitle = document.querySelector('h1')?.textContent?.trim();
      const description = document.querySelector('[data-testid="description"]')?.textContent?.trim() ||
                         document.querySelector('.event-description')?.textContent?.trim();
      
      if (eventTitle && eventTitle.length > 10) {
        return {
          type: 'event',
          platform: 'meetup',
          title: eventTitle,
          description: description?.substring(0, 300),
          url
        };
      }
    }
    
    // Enhanced generic content detection
    const content = findContent([
      'article',
      '[role="main"]',
      'main',
      '.post-content',
      '.article-content',
      '.content',
      '.story',
      '[class*="content"]',
      '[class*="article"]',
      '.entry-content'
    ]);

    const author = findAuthor([
      '.author',
      '.byline',
      '.writer',
      '[class*="author"]',
      '[class*="byline"]',
      '.post-author',
      'meta[name="author"]'
    ]) || findContent(['meta[name="author"]']);

    if (title && content && content.length > 200) {
      // Enhanced event keyword detection
      const eventKeywords = [
        'event', 'workshop', 'conference', 'meetup', 'gathering',
        'protest', 'march', 'rally', 'celebration', 'seminar',
        'webinar', 'summit', 'festival', 'exhibition', 'performance',
        'concert', 'screening', 'talk', 'panel', 'discussion',
        'fundraiser', 'vigil', 'demonstration', 'action'
      ];

      const timeKeywords = [
        'date:', 'time:', 'when:', 'registration:', 'tickets:',
        'rsvp', 'book now', 'register', 'attend', 'join us'
      ];

      const titleLower = title.toLowerCase();
      const contentLower = content.toLowerCase().substring(0, 800);

      const hasEventKeywords = eventKeywords.some(keyword =>
        titleLower.includes(keyword) || contentLower.includes(keyword)
      );

      const hasTimeIndicators = timeKeywords.some(keyword =>
        contentLower.includes(keyword)
      );

      const isEvent = hasEventKeywords || hasTimeIndicators;

      // Try to extract better description for articles
      let description = content.substring(0, 300);

      // Look for meta description as backup
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                             document.querySelector('meta[property="og:description"]')?.getAttribute('content');

      if (metaDescription && metaDescription.length > 100) {
        description = metaDescription.length > 300 ? metaDescription.substring(0, 300) : metaDescription;
      }

      return {
        type: isEvent ? 'event' : 'article',
        platform: 'generic',
        title,
        description,
        author: author || 'Unknown',
        url
      };
    }
    
    return null;
  }
  
  updateDetectionStatus(found) {
    const statusEl = document.getElementById('detection-status');
    
    if (found && this.detectedContent) {
      statusEl.className = 'detection-status';
      statusEl.innerHTML = `
        <strong>✅ Content Detected!</strong>
        <p><strong>${this.detectedContent.type.toUpperCase()}:</strong> ${this.detectedContent.title?.substring(0, 80)}...</p>
        <p><small>From: ${this.detectedContent.platform}</small></p>
      `;
    } else {
      statusEl.className = 'detection-status none';
      statusEl.innerHTML = `
        <strong>🔍 No content detected</strong>
        <p>Use the buttons below to manually submit content.</p>
      `;
    }
  }
  
  showForm(type) {
    document.querySelector('.quick-actions').style.display = 'none';
    document.getElementById('submission-form').style.display = 'block';
    
    // Pre-fill form if content was detected
    if (this.detectedContent) {
      document.getElementById('type').value = this.detectedContent.type || type;
      document.getElementById('title').value = this.detectedContent.title || '';
      document.getElementById('description').value = this.detectedContent.description || '';
      
      if (this.detectedContent.type === 'event' && this.detectedContent.location) {
        document.getElementById('event-location').value = this.detectedContent.location;
      }
    } else {
      document.getElementById('type').value = type;
      document.getElementById('title').value = this.currentTab.title || '';
    }
    
    this.toggleFormFields(document.getElementById('type').value);
  }
  
  hideForm() {
    document.querySelector('.quick-actions').style.display = 'grid';
    document.getElementById('submission-form').style.display = 'none';
    document.getElementById('status-message').innerHTML = '';
  }
  
  toggleFormFields(type) {
    const eventFields = document.getElementById('event-fields');
    const articleFields = document.getElementById('article-fields');
    
    if (type === 'event') {
      eventFields.style.display = 'block';
      articleFields.style.display = 'none';
      
      // Set default date to today
      if (!document.getElementById('event-date').value) {
        document.getElementById('event-date').value = new Date().toISOString().split('T')[0];
      }
    } else {
      eventFields.style.display = 'none';
      articleFields.style.display = 'block';
    }
  }
  
  async handleSubmit() {
    const formData = new FormData(document.getElementById('submission-form'));
    const type = formData.get('type');
    
    const submitData = {
      title: formData.get('title'),
      description: formData.get('description'),
      sourceUrl: this.currentTab.url,
      detectedAt: new Date().toISOString(),
      submittedVia: 'chrome-extension'
    };
    
    if (type === 'event') {
      // Event-specific fields
      submitData.date = formData.get('date') || new Date().toISOString().split('T')[0];
      submitData.time = formData.get('time') || '18:00';
      submitData.duration = 120; // Default 2 hours
      submitData.organizer = 'Community Submitted';
      submitData.category = 'Community';
      submitData.location = {
        type: 'physical',
        address: formData.get('location') || 'TBD'
      };
      submitData.capacity = 50;
      submitData.featured = false;
      submitData.status = 'draft';
      submitData.tags = ['community-submitted'];
    } else {
      // Article-specific fields - match API structure
      submitData.excerpt = submitData.description; // API expects 'excerpt' not 'description'
      submitData.content = submitData.description; // Full content same as description for now
      submitData.category = formData.get('category') || 'Community Response';
      submitData.priority = 'medium';
      submitData.type = 'community_response'; // Fixed type
      submitData.author = 'Community Submitted';
      submitData.status = 'draft';
      submitData.tags = ['community-submitted'];
      submitData.featured = false;
      
      // Remove description since API uses excerpt/content
      delete submitData.description;
    }
    
    this.showStatus('Submitting...', 'info');
    
    try {
      // Use the public content API endpoint
      const endpoint = '/content';
      console.log('Submitting to:', API_BASE + endpoint);

      // Prepare data for the content API
      const apiData = {
        contentType: type,
        ...submitData
      };

      console.log('Submit data:', apiData);

      const response = await fetch(API_BASE + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Liberation-Source': 'chrome-extension'
        },
        body: JSON.stringify(apiData)
      });
      
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (response.ok && responseData.success) {
        this.showStatus('✅ Successfully submitted to BLKOUT! Moderators will review it shortly.', 'success');
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        throw new Error(`Submission failed: ${responseData.message || responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      this.showStatus(`❌ Submission failed: ${error.message}. Please try again or use the website directly.`, 'error');
    }
  }
  
  showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    statusEl.innerHTML = message;
    statusEl.className = `status-message status-${type}`;
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BlkoutPopup();
});