interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Add more VITE_ env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
