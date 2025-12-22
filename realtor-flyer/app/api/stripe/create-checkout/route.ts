import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { stripe, PLANS, PlanType } from '@/lib/stripe';

export async function POST(request: Request) {
    console.log('[Stripe Checkout] POST request received');

    try {
        // 1. Authenticate user
        console.log('[Stripe Checkout] Authenticating user...');
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser?.email) {
            console.log('[Stripe Checkout] Unauthorized - no auth user or email');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log('[Stripe Checkout] User authenticated:', authUser.email);

        // 2. Get request body
        const body = await request.json();
        const { plan } = body;
        console.log('[Stripe Checkout] Request body:', body);
        console.log('[Stripe Checkout] Selected plan:', plan);

        if (!plan || !['starter', 'pro', 'agency'].includes(plan)) {
            console.log('[Stripe Checkout] Invalid plan selected:', plan);
            return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
        }

        const selectedPlan = PLANS[plan as PlanType];
        console.log('[Stripe Checkout] Plan config:', {
            name: selectedPlan.name,
            priceId: selectedPlan.priceId,
            credits: selectedPlan.credits,
            hasEnvVar: {
                STRIPE_PRICE_STARTER: !!process.env.STRIPE_PRICE_STARTER,
                STRIPE_PRICE_PRO: !!process.env.STRIPE_PRICE_PRO,
                STRIPE_PRICE_AGENCY: !!process.env.STRIPE_PRICE_AGENCY,
                STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
            }
        });

        if (!selectedPlan.priceId) {
            console.error('[Stripe Checkout] Missing price ID for plan:', plan, '- Check STRIPE_PRICE_* env vars');
            return NextResponse.json({
                error: `Missing Stripe price configuration for ${plan} plan. Please check environment variables.`
            }, { status: 400 });
        }

        // 3. Get or create user in database
        console.log('[Stripe Checkout] Looking up database user...');
        let dbUser = await prisma.user.findUnique({
            where: { email: authUser.email },
        });

        if (!dbUser) {
            console.log('[Stripe Checkout] Creating new database user...');
            dbUser = await prisma.user.create({
                data: {
                    email: authUser.email,
                    name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
                },
            });
        }
        console.log('[Stripe Checkout] Database user ID:', dbUser.id);

        // 4. Get or create Stripe customer
        let stripeCustomerId = dbUser.stripeCustomerId;
        console.log('[Stripe Checkout] Existing Stripe customer ID:', stripeCustomerId);

        if (!stripeCustomerId) {
            console.log('[Stripe Checkout] Creating new Stripe customer...');
            const customer = await stripe.customers.create({
                email: authUser.email,
                name: dbUser.name || undefined,
                metadata: {
                    supabase_user_id: authUser.id,
                    db_user_id: dbUser.id,
                },
            });

            stripeCustomerId = customer.id;
            console.log('[Stripe Checkout] Created Stripe customer:', stripeCustomerId);

            // Save Stripe customer ID to database
            await prisma.user.update({
                where: { id: dbUser.id },
                data: { stripeCustomerId: customer.id },
            });
            console.log('[Stripe Checkout] Saved Stripe customer ID to database');
        }

        // 5. Create Checkout Session
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        console.log('[Stripe Checkout] Creating checkout session with baseUrl:', baseUrl);
        console.log('[Stripe Checkout] Price ID:', selectedPlan.priceId);

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: selectedPlan.priceId,
                    quantity: 1,
                },
            ],
            success_url: `${baseUrl}/dashboard?checkout=success`,
            cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
            subscription_data: {
                metadata: {
                    supabase_user_id: authUser.id,
                    db_user_id: dbUser.id,
                    plan: plan,
                },
            },
            metadata: {
                supabase_user_id: authUser.id,
                db_user_id: dbUser.id,
                plan: plan,
            },
        });

        console.log('[Stripe Checkout] Checkout session created successfully:', checkoutSession.id);
        console.log('[Stripe Checkout] Checkout URL:', checkoutSession.url);
        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error('[Stripe Checkout] ERROR:', error);
        console.error('[Stripe Checkout] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
