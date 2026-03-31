import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { sendWelcomeEmail } from '@/lib/email';

export const runtime = 'nodejs';

// Called by the signup form after successful Supabase signup.
// Verifies the user is authenticated before sending — prevents abuse.
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    // Only send if RESEND_API_KEY is configured — silently skip in dev if not set
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: true });
    }

    await sendWelcomeEmail(user.email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Never fail the signup flow due to an email error
    console.error('Welcome email failed:', err);
    return NextResponse.json({ ok: true });
  }
}
