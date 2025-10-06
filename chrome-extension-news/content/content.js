// BLKOUT News Curator - Content Script
// Analyzes page for extractable article data

console.log('BLKOUT News Curator content script loaded');

// Message handler for popup requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractPageData') {
    const articleData = extractArticleData();
    sendResponse(articleData);
  }
  return true;
});

function extractArticleData() {
  const data = {
    url: window.location.href,
    domain: window.location.hostname,
    dataSource: 'Unknown',
    images: []
  };

  // Extract from Schema.org JSON-LD
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of jsonLdScripts) {
    try {
      const jsonData = JSON.parse(script.textContent);
      if (['NewsArticle', 'Article', 'BlogPosting'].includes(jsonData['@type'])) {
        data.dataSource = `Schema.org JSON-LD (${jsonData['@type']})`;
        Object.assign(data, parseSchemaOrgArticle(jsonData));
        return data;
      }
    } catch (e) {
      console.error('Failed to parse JSON-LD:', e);
    }
  }

  // Fallback to Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogTitle) {
    data.dataSource = 'Open Graph';
    data.headline = ogTitle.content;
    if (ogImage) data.images.push(ogImage.content);
  }

  return data;
}

function parseSchemaOrgArticle(articleData) {
  return {
    headline: articleData.headline || articleData.name || '',
    author: articleData.author?.name || '',
    publication: articleData.publisher?.name || '',
    publishedDate: articleData.datePublished || '',
    summary: articleData.description || '',
    content: articleData.articleBody || '',
    images: Array.isArray(articleData.image) ? articleData.image : [articleData.image].filter(Boolean)
  };
}
