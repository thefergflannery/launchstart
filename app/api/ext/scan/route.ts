/**
 * POST /api/ext/scan
 * Chrome extension scan endpoint — accepts Authorization: Bearer <jwt>
 * instead of cookie-based auth (cookies aren't available in extensions).
 * PRD ref: §3.3
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runScan } from '@/lib/scanner';

export const runtime = 'nodejs';
export const maxDuration = 30;

const FREE_LIMIT = 3;
const EARLY_ACCESS_LIMIT = 20;
const PRO_LIMIT = 50;

// CORS headers — required for extension requests
const CORS = {
  'Access-Control-Allow-Origin': 'chrome-extension://*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(request: NextRequest) {
  // CORS preflight passthrough
  const origin = request.headers.get('origin') ?? '';

  try {
    // Extract Bearer token
    const authHeader = request.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: 'Authorization required.' }, { status: 401, headers: CORS });
    }

    // Validate token with Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401, headers: CORS });
    }

    // Parse URL
    const body = await request.json() as { url?: string };
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400, headers: CORS });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400, headers: CORS });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: 'Only HTTP and HTTPS URLs are supported.' }, { status: 400, headers: CORS });
    }

    // Check plan + rate limit
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, role')
      .eq('id', user.id)
      .single();

    const plan = profile?.plan ?? 'free';
    const isAdmin = profile?.role === 'admin';

    const maxPerDay =
      isAdmin ? 9999
      : plan === 'agency' ? 9999
      : plan === 'pro' ? PRO_LIMIT
      : plan === 'early_access' ? EARLY_ACCESS_LIMIT
      : FREE_LIMIT;

    if (!isAdmin) {
      const { data: allowed } = await supabase.rpc('check_and_increment_rate_limit', {
        p_ip_hash: `user:${user.id}`,
        p_endpoint: 'scan',
        p_max_per_day: maxPerDay,
      });

      if (!allowed) {
        return NextResponse.json(
          { error: 'Daily scan limit reached. Upgrade your plan for more scans.' },
          { status: 429, headers: CORS }
        );
      }
    }

    // Run scan
    const results = await runScan(parsedUrl.toString());
    const allChecks = [...results.accessibility, ...results.seo, ...results.launch];
    const passed = allChecks.filter((c) => c.status === 'pass').length;
    const summary = `${passed}/${allChecks.length} checks passed`;

    const { data, error: insertError } = await supabase
      .from('scans')
      .insert({ url: parsedUrl.toString(), results, summary, user_id: user.id })
      .select('id')
      .single();

    if (insertError) {
      console.error('Extension scan insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save report.' }, { status: 500, headers: CORS });
    }

    return NextResponse.json({ id: data.id, results }, { headers: CORS });
  } catch (err) {
    console.error('Extension scan error:', err);
    return NextResponse.json(
      { error: 'Scan failed. Please check the URL and try again.' },
      { status: 500, headers: CORS }
    );
  }
}
