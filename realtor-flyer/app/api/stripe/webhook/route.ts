import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { stripe, getCreditsForPlan, getPlanFromPriceId } from '@/lib/stripe';
import Stripe from 'stripe';

// Disable body parsing for webhooks (we need raw body)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    console.log('[Stripe Webhook] Received webhook request');

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    console.log('[Stripe Webhook] Signature present:', !!signature);

    if (!signature) {
        console.error('[Stripe Webhook] No signature in request');
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log('[Stripe Webhook] Event verified:', event.type, 'ID:', event.id);
    } catch (err) {
        console.error('[Stripe Webhook] Signature verification failed:', err);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    try {
        console.log('[Stripe Webhook] Processing event type:', event.type);

        switch (event.type) {
            case 'checkout.session.completed': {
                console.log('[Stripe Webhook] Handling checkout.session.completed');
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('[Stripe Webhook] Session ID:', session.id);
                console.log('[Stripe Webhook] Session metadata:', session.metadata);
                await handleCheckoutCompleted(session);
                break;
            }

            case 'customer.subscription.updated': {
                console.log('[Stripe Webhook] Handling customer.subscription.updated');
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                console.log('[Stripe Webhook] Handling customer.subscription.deleted');
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }

            case 'invoice.payment_succeeded': {
                console.log('[Stripe Webhook] Handling invoice.payment_succeeded');
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoicePaymentSucceeded(invoice);
                break;
            }

            case 'invoice.payment_failed': {
                console.log('[Stripe Webhook] Handling invoice.payment_failed');
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoicePaymentFailed(invoice);
                break;
            }

            default:
                console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        console.log('[Stripe Webhook] Event processed successfully');
        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[Stripe Webhook] Handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log('[Stripe Webhook] handleCheckoutCompleted called');

    const dbUserId = session.metadata?.db_user_id;
    const plan = session.metadata?.plan;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    console.log('[Stripe Webhook] Extracted data:', { dbUserId, plan, subscriptionId, customerId });

    if (!dbUserId || !plan) {
        console.error('[Stripe Webhook] Missing metadata - dbUserId:', dbUserId, 'plan:', plan);
        return;
    }

    // Fetch the subscription to get period end
    console.log('[Stripe Webhook] Fetching subscription:', subscriptionId);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Debug logging
    console.log('[Stripe Webhook] Subscription keys:', Object.keys(subscription));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let periodEnd = (subscription as any).current_period_end;
    console.log('[Stripe Webhook] Subscription period end:', periodEnd);

    // Fallback if periodEnd is missing (should verify why)
    if (!periodEnd) {
        console.warn('[Stripe Webhook] Warning: current_period_end missing, defaulting to 30 days');
        periodEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end || false;

    console.log('[Stripe Webhook] Updating user in database...');
    const updatedUser = await prisma.user.update({
        where: { id: dbUserId },
        data: {
            planType: plan,
            creditsRemaining: getCreditsForPlan(plan),
            stripeCustomerId: customerId, // Save Stripe customer ID on successful checkout
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: 'active',
            currentPeriodEnd: new Date(periodEnd * 1000),
            cancelAtPeriodEnd: cancelAtPeriodEnd,
        },
    });

    console.log(`[Stripe Webhook] User ${dbUserId} successfully updated to ${plan} plan`);
    console.log('[Stripe Webhook] Updated user data:', {
        id: updatedUser.id,
        planType: updatedUser.planType,
        creditsRemaining: updatedUser.creditsRemaining,
        subscriptionStatus: updatedUser.subscriptionStatus,
        stripeCustomerId: updatedUser.stripeCustomerId,
    });
}

// Handle subscription updates (plan changes, etc.)
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    // Find user by Stripe customer ID
    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        console.error('User not found for customer:', customerId);
        return;
    }

    // Get the plan from the price ID
    const priceId = subscription.items.data[0]?.price?.id;
    const planType = priceId ? getPlanFromPriceId(priceId) : 'free';

    // Map Stripe status to our status
    let subscriptionStatus: string;
    switch (subscription.status) {
        case 'active':
        case 'trialing':
            subscriptionStatus = 'active';
            break;
        case 'past_due':
            subscriptionStatus = 'past_due';
            break;
        case 'canceled':
        case 'unpaid':
            subscriptionStatus = 'cancelled';
            break;
        default:
            subscriptionStatus = 'inactive';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let periodEnd = (subscription as any).current_period_end;

    if (!periodEnd) {
        console.warn('[Stripe Webhook] Warning: current_period_end missing in update, defaulting to 30 days');
        periodEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end || false;

    await prisma.user.update({
        where: { id: user.id },
        data: {
            planType,
            subscriptionStatus,
            currentPeriodEnd: new Date(periodEnd * 1000),
            cancelAtPeriodEnd: cancelAtPeriodEnd,
        },
    });

    console.log(`Subscription updated for user ${user.id}: ${planType}, ${subscriptionStatus}`);
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        console.error('User not found for customer:', customerId);
        return;
    }

    // Reset to free plan
    await prisma.user.update({
        where: { id: user.id },
        data: {
            planType: 'free',
            creditsRemaining: 3,
            stripeSubscriptionId: null,
            subscriptionStatus: 'cancelled',
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
        },
    });

    console.log(`Subscription cancelled for user ${user.id}, reset to free plan`);
}

// Handle successful payment (renewal)
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    // Only process subscription renewals, not initial payments
    if (invoice.billing_reason !== 'subscription_cycle') {
        return;
    }

    const customerId = invoice.customer as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoiceAny = invoice as any;
    const subscriptionId = typeof invoiceAny.subscription === 'string'
        ? invoiceAny.subscription
        : invoiceAny.subscription?.id;

    if (!subscriptionId) {
        console.error('No subscription ID in invoice');
        return;
    }

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        console.error('User not found for customer:', customerId);
        return;
    }

    // Get subscription to find the plan
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price?.id;
    const planType = priceId ? getPlanFromPriceId(priceId) : user.planType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let periodEnd = (subscription as any).current_period_end;

    if (!periodEnd) {
        console.warn('[Stripe Webhook] Warning: current_period_end missing in invoice payment, defaulting to 30 days');
        periodEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    }

    // Reset credits to plan allocation
    await prisma.user.update({
        where: { id: user.id },
        data: {
            creditsRemaining: getCreditsForPlan(planType),
            subscriptionStatus: 'active',
            currentPeriodEnd: new Date(periodEnd * 1000),
            cancelAtPeriodEnd: false, // Reset on renewal
        },
    });

    console.log(`Credits reset for user ${user.id}: ${getCreditsForPlan(planType)} credits`);
}

// Handle failed payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        console.error('User not found for customer:', customerId);
        return;
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            subscriptionStatus: 'past_due',
        },
    });

    console.log(`Payment failed for user ${user.id}, status set to past_due`);
}
