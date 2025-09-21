/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_GATEWAY_URL: string;
  readonly VITE_STORY_ARCHIVE_API: string;
  readonly VITE_EVENTS_API: string;
  readonly VITE_COMMUNITY_API: string;
  readonly VITE_WEBHOOK_API: string;
  readonly VITE_APP_MODE: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}