// BLKOUT Liberation Platform - API Configuration
// Centralized API URL configuration for all backend services

// Admin API Backend (deployed on Coolify)
export const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || 'https://api.blkoutuk.cloud';

// IVOR AI Assistant
export const IVOR_API_URL = import.meta.env.VITE_IVOR_API_URL || 'https://ivor.blkoutuk.cloud';

// Voices Backend (articles/stories)
export const VOICES_API_URL = import.meta.env.VITE_VOICES_API_URL || 'https://voices.blkoutuk.cloud';

// Events Backend
export const EVENTS_API_URL = import.meta.env.VITE_EVENTS_API_URL || 'https://events.blkoutuk.cloud';

// News Backend
export const NEWS_API_URL = import.meta.env.VITE_NEWS_API_URL || 'https://news.blkoutuk.cloud';

// API Endpoints
export const API_ENDPOINTS = {
  // Admin endpoints
  adminStats: `${ADMIN_API_URL}/api/admin/stats`,
  adminStatsSimple: `${ADMIN_API_URL}/api/admin/stats-simple`,
  moderationQueue: `${ADMIN_API_URL}/api/admin/moderation-queue`,
  contentApproval: `${ADMIN_API_URL}/api/admin/approve`,
  health: `${ADMIN_API_URL}/api/health`,

  // IVOR endpoints
  ivorChat: `${IVOR_API_URL}/api/chat`,
  ivorStream: `${IVOR_API_URL}/api/stream`,

  // Content endpoints
  voicesArticles: `${VOICES_API_URL}/api/articles`,
  eventsCalendar: `${EVENTS_API_URL}/api/events`,
  newsArticles: `${NEWS_API_URL}/api/news`
};

// Helper function to check API health
export async function checkApiHealth(): Promise<{
  admin: boolean;
  ivor: boolean;
  voices: boolean;
}> {
  const results = {
    admin: false,
    ivor: false,
    voices: false
  };

  try {
    const adminResponse = await fetch(`${ADMIN_API_URL}/api/health`, { method: 'GET' });
    results.admin = adminResponse.ok;
  } catch {
    results.admin = false;
  }

  try {
    const ivorResponse = await fetch(`${IVOR_API_URL}/health`, { method: 'GET' });
    results.ivor = ivorResponse.ok;
  } catch {
    results.ivor = false;
  }

  try {
    const voicesResponse = await fetch(`${VOICES_API_URL}/health`, { method: 'GET' });
    results.voices = voicesResponse.ok;
  } catch {
    results.voices = false;
  }

  return results;
}

export default API_ENDPOINTS;
