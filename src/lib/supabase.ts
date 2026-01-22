import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase URLが設定されている場合のみ実際のクライアントを作成
let supabase: SupabaseClient;

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // 環境変数が設定されていない場合、ダミーURLでクライアントを作成
    // 実際の使用時にはエラーハンドリングで対応
    supabase = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder');
    console.warn('Supabase環境変数が設定されていません。ローカルストレージに保存されます。');
  }
} catch (error) {
  console.error('Supabase client initialization error:', error);
  // エラーが発生した場合でも、ダミークライアントを作成
  supabase = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder');
}

export { supabase };
