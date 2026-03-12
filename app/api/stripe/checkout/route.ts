import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUser, getProfile, createSupabaseServerClient } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Plans: onceoff = €10 one-time | recurring = €29/month | agency = €99/month
// Set these price IDs (price_...) in Vercel environment variables.
const PRICE_IDS: Record<string, string> = {
  onceoff:   process.env.STRIPE_PRICE_ONCEOFF!,
  recurring: process.env.STRIPE_PRICE_RECURRING!,
  agency:    process.env.STRIPE_PRICE_AGENCY!,
};

export async function POST(request: NextRequest) {
  try {
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
    let customerId: string;
    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      const supabase = createSupabaseServerClient();
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // onceoff = one-time payment; recurring + agency = monthly subscription
    const isOneTime = plan === 'onceoff';
    const params: Stripe.Checkout.SessionCreateParams = isOneTime
      ? {
          customer: customerId,
          mode: 'payment',
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${baseUrl}/dashboard?upgraded=1`,
          cancel_url: `${baseUrl}/pricing`,
          metadata: { supabase_user_id: user.id, plan: plan! },
        }
      : {
          customer: customerId,
          mode: 'subscription',
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${baseUrl}/dashboard?upgraded=1`,
          cancel_url: `${baseUrl}/pricing`,
          metadata: { supabase_user_id: user.id, plan: plan! },
          subscription_data: { metadata: { supabase_user_id: user.id, plan: plan! } },
        };

    const session = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed';
    console.error('[stripe/checkout]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
