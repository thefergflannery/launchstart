import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUser, getProfile, createSupabaseServerClient } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' });

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO!,
  agency: process.env.STRIPE_PRICE_AGENCY!,
};

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { plan } = await request.json() as { plan?: string };
  const priceId = plan ? PRICE_IDS[plan] : undefined;
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const profile = await getProfile(user.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  // Reuse existing Stripe customer if available
  let customerId = profile?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    // Persist customer ID
    const supabase = createSupabaseServerClient();
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgraded=1`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: { supabase_user_id: user.id, plan },
    subscription_data: { metadata: { supabase_user_id: user.id, plan } },
  });

  return NextResponse.json({ url: session.url });
}
