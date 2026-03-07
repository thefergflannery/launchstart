import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client — uses service role key, bypasses RLS.
 * Only use in server-side admin API routes. NEVER expose to the client.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error('Supabase admin env vars missing');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
