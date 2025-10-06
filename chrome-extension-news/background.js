// BLKOUT News Curator - Background Service Worker
// Handles badge notifications, auto-sync, and analytics

class NewsBackgroundService {
  constructor() {
    this.apiEndpoint = 'https://blkout-api-railway-production.up.railway.app/api';
    this.dashboardUrl = 'https://liberation.blkoutcollective.org/admin/news';
    this.init();
  }

  init() {
    // Set up listeners
    chrome.runtime.onInstalled.addListener(() => this.onInstalled());
    chrome.alarms.create('updateBadge', { periodInMinutes: 5 });
    chrome.alarms.create('syncQueue', { periodInMinutes: 15 });
    chrome.alarms.onAlarm.addListener((alarm) => this.handleAlarm(alarm));
  }

  async onInstalled() {
    console.log('BLKOUT News Curator installed');
    await this.updateBadge();
  }

  async handleAlarm(alarm) {
    if (alarm.name === 'updateBadge') {
      await this.updateBadge();
    } else if (alarm.name === 'syncQueue') {
      await this.syncPendingSubmissions();
    }
  }

  async updateBadge() {
    try {
      const response = await fetch(`${this.apiEndpoint}/news/moderation-queue/size`);
      if (response.ok) {
        const data = await response.json();
        const count = data.queueSize || 0;

        if (count > 0) {
          chrome.action.setBadgeText({ text: count.toString() });
          chrome.action.setBadgeBackgroundColor({ color: '#EA580C' }); // Orange
        } else {
          chrome.action.setBadgeText({ text: '' });
        }
      }
    } catch (error) {
      console.error('Failed to update badge:', error);
    }
  }

  async syncPendingSubmissions() {
    try {
      const result = await chrome.storage.local.get(null);
      const pendingKeys = Object.keys(result).filter(key =>
        key.startsWith('news_pending_review_')
      );

      for (const key of pendingKeys) {
        const articleData = result[key];
        const response = await fetch(`${this.apiEndpoint}/news/moderation-queue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });

        if (response.ok) {
          await chrome.storage.local.remove(key);
          console.log(`Synced pending article: ${key}`);
        }
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

// Initialize service
const service = new NewsBackgroundService();
