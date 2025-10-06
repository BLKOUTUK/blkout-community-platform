// BLKOUT Events Curator - Content Script
// Analyzes page for extractable event data

console.log('BLKOUT Events Curator content script loaded');

// Message handler for popup requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractPageData') {
    const eventData = extractEventData();
    sendResponse(eventData);
  }
  return true;
});

function extractEventData() {
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
      if (jsonData['@type'] === 'Event') {
        data.dataSource = 'Schema.org JSON-LD';
        Object.assign(data, parseSchemaOrgEvent(jsonData));
        return data;
      }
    } catch (e) {
      console.error('Failed to parse JSON-LD:', e);
    }
  }

  // Platform-specific extraction would go here
  // For now, return basic data
  return data;
}

function parseSchemaOrgEvent(eventData) {
  return {
    title: eventData.name || '',
    description: eventData.description || '',
    startDate: eventData.startDate || '',
    endDate: eventData.endDate || '',
    location: eventData.location?.name || eventData.location?.address?.addressLocality || '',
    organizer: eventData.organizer?.name || '',
    images: Array.isArray(eventData.image) ? eventData.image : [eventData.image].filter(Boolean)
  };
}
