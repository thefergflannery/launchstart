import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUser, getProfile } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const profile = await getProfile(user.id);
    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found.' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${baseUrl}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not open billing portal';
    console.error('[stripe/portal]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
