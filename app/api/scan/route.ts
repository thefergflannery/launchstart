import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { runScan } from '@/lib/scanner';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url?: string };

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
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

    // Run the scan
    const results = await runScan(parsedUrl.toString());

    // Persist to Supabase
    const { data, error } = await supabase
      .from('scans')
      .insert({ url: parsedUrl.toString(), results })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save report' },
        { status: 500 }
      );
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
