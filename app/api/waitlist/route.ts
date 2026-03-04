import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('waitlist')
    .insert({ email: email.toLowerCase().trim() });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already on waitlist' }, { status: 409 });
    }
    console.error('Waitlist insert error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
