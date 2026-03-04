import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' });

const PLAN_MAP: Record<string, string> = {
  [process.env.STRIPE_PRICE_PRO ?? '']: 'pro',
  [process.env.STRIPE_PRICE_AGENCY ?? '']: 'agency',
};

async function updateProfile(supabaseUserId: string, plan: string, stripeSubscriptionId: string) {
  const supabase = createSupabaseServerClient();
  await supabase
    .from('profiles')
    .update({ plan, stripe_subscription_id: stripeSubscriptionId })
    .eq('id', supabaseUserId);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id;
    const plan = session.metadata?.plan;
    const subscriptionId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id ?? '';

    if (userId && plan) {
      await updateProfile(userId, plan, subscriptionId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.supabase_user_id;
    if (userId) {
      await updateProfile(userId, 'free', '');
    }
  }

  return NextResponse.json({ received: true });
}
