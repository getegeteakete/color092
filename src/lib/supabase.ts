import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// ダミーキー（環境変数未設定時のフォールバック用）
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder';

let supabase: SupabaseClient;

try {
  const url = supabaseUrl || PLACEHOLDER_URL;
  const key = supabaseAnonKey || PLACEHOLDER_KEY;
  supabase = createClient(url, key);
} catch {
  supabase = createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY);
}

export { supabase };
