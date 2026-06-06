import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for public use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client that bypasses RLS — only use in API routes.
// anon grants on demo_leads/assessments/tool_runs are revoked (2026-06-06 lockdown),
// so falling back to the anon client would silently fail every write. Fail loud instead.
// (Skipped during `next build` — NEXT_PHASE is set then; the key only matters at runtime.)
if (
  !supabaseServiceKey &&
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PHASE !== 'phase-production-build'
) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is not set — supabaseAdmin would fall back to the anon client and all server-side writes would fail.'
  );
}
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' &&
         supabaseAnonKey !== 'placeholder-key';
};
