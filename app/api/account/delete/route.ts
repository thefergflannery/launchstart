import { NextResponse } from 'next/server';
import { getUser, createSupabaseServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

export async function DELETE() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const supabase = createSupabaseServerClient();

    // Delete all user's scans
    await supabase.from('scans').delete().eq('user_id', user.id);

    // Delete the profile row
    await supabase.from('profiles').delete().eq('id', user.id);

    // Delete the auth user — requires service role key
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { error } = await adminClient.auth.admin.deleteUser(user.id);
    if (error) {
      console.error('[account/delete]', error);
      return NextResponse.json({ error: 'Could not delete account.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[account/delete]', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
