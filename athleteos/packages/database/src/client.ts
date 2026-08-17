import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createServerClient(supabaseUrl: string, supabaseAnonKey: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function createBrowserClient(supabaseUrl: string, supabaseAnonKey: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey);
}
