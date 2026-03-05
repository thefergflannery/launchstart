import { createClient } from '@supabase/supabase-js';

// Lazy initialisation — avoids throwing at build time when env vars aren't present
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

export const supabase = {
  from: (...args: Parameters<ReturnType<typeof createClient>['from']>) =>
    getSupabaseClient().from(...args),
};
