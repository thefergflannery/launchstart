import { NextRequest, NextResponse } from 'next/server';
import { runScan } from '@/lib/scanner';
import { getUser, createSupabaseServerClient } from '@/lib/supabase-server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const maxDuration = 30;

const ANON_LIMIT = 1;           // per day for unauthenticated
const FREE_LIMIT = 3;           // per day for free users (PRD §F-003)
const EARLY_ACCESS_LIMIT = 20;  // per day for early access users
const PRO_LIMIT = 50;

function ipHash(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url?: string };

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: 'Only HTTP and HTTPS URLs are supported' },
        { status: 400 }
      );
    }

    const user = await getUser();
    const supabase = createSupabaseServerClient();

    // Rate limiting
    const hash = ipHash(request);
    const endpoint = 'scan';

    if (user) {
      // Authenticated: check per-user limit based on plan
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      const plan = profile?.plan ?? 'free';
      const maxPerDay =
        plan === 'agency' ? 9999
        : plan === 'pro' ? PRO_LIMIT
        : plan === 'early_access' ? EARLY_ACCESS_LIMIT
        : FREE_LIMIT;

      const { data: allowed } = await supabase.rpc('check_and_increment_rate_limit', {
        p_ip_hash: `user:${user.id}`,
        p_endpoint: endpoint,
        p_max_per_day: maxPerDay,
      });

      if (!allowed) {
        return NextResponse.json(
          { error: `Daily scan limit reached. Upgrade for more scans.` },
          { status: 429 }
        );
      }
    } else {
      // Unauthenticated: strict IP-based rate limiting
      const { data: allowed } = await supabase.rpc('check_and_increment_rate_limit', {
        p_ip_hash: hash,
        p_endpoint: endpoint,
        p_max_per_day: ANON_LIMIT,
      });

      if (!allowed) {
        return NextResponse.json(
          { error: 'Free limit reached for today. Sign up for more scans.' },
          { status: 429 }
        );
      }
    }

    // Run the scan
    const results = await runScan(parsedUrl.toString());

    const allChecks = [...results.accessibility, ...results.seo, ...results.launch];
    const passed = allChecks.filter((c) => c.status === 'pass').length;
    const summary = `${passed}/${allChecks.length} checks passed`;

    const { data, error } = await supabase
      .from('scans')
      .insert({
        url: parsedUrl.toString(),
        results,
        summary,
        ...(user ? { user_id: user.id } : {}),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, results });
  } catch (err) {
    console.error('Scan error:', err);
    return NextResponse.json(
      { error: 'Scan failed. Please check the URL and try again.' },
      { status: 500 }
    );
  }
}
