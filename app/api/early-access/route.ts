/**
 * POST /api/early-access
 * Validates an early access code and upgrades the user's plan to 'early_access'.
 * PRD ref: §F-004
 *
 * The code is stored in EARLY_ACCESS_CODE env var.
 * Redemption count is tracked in a Supabase table: early_access_redemptions (count int).
 * Max redemptions: 25.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUser, createSupabaseServerClient } from '@/lib/supabase-server';

const MAX_SLOTS = 25;

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to redeem a code.' }, { status: 401 });
  }

  const { code } = (await request.json()) as { code?: string };
  if (!code?.trim()) {
    return NextResponse.json({ error: 'Please enter a code.' }, { status: 400 });
  }

  const validCode = process.env.EARLY_ACCESS_CODE;
  if (!validCode) {
    return NextResponse.json({ error: 'Early access is not configured.' }, { status: 503 });
  }

  if (code.trim().toUpperCase() !== validCode.toUpperCase()) {
    return NextResponse.json({ error: 'That code is not valid. Check for typos and try again.' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  // Check if user already has early access or better
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (profile?.plan && ['early_access', 'pro', 'agency'].includes(profile.plan)) {
    return NextResponse.json({ error: 'Your account already has full access.' }, { status: 400 });
  }

  // Check remaining slots
  const { data: redemption } = await supabase
    .from('early_access_redemptions')
    .select('count')
    .eq('id', 1)
    .single();

  const currentCount = redemption?.count ?? 0;

  if (currentCount >= MAX_SLOTS) {
    return NextResponse.json({
      error: 'All early access slots have been filled. Upgrade to Pro for full access.',
      exhausted: true,
    }, { status: 409 });
  }

  // Upgrade user plan
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ plan: 'early_access' })
    .eq('id', user.id);

  if (updateError) {
    console.error('Early access upgrade error:', updateError);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  // Increment redemption count
  await supabase
    .from('early_access_redemptions')
    .upsert({ id: 1, count: currentCount + 1 });

  const remaining = MAX_SLOTS - currentCount - 1;

  return NextResponse.json({
    success: true,
    remaining,
    message: `Code accepted! Your account now has full early access. ${remaining} slot${remaining === 1 ? '' : 's'} remaining.`,
  });
}

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('early_access_redemptions')
    .select('count')
    .eq('id', 1)
    .single();

  const used = data?.count ?? 0;
  return NextResponse.json({ used, remaining: Math.max(0, MAX_SLOTS - used), total: MAX_SLOTS });
}
