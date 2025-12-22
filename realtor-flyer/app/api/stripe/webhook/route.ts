import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { stripe, getCreditsForPlan, getPlanFromPriceId } from '@/lib/stripe';
import Stripe from 'stripe';

// Disable body parsing for webhooks (we need raw body)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoicePaymentSucceeded(invoice);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoicePaymentFailed(invoice);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const dbUserId = session.metadata?.db_user_id;
    const plan = session.metadata?.plan;
    const subscriptionId = session.subscription as string;

    if (!dbUserId || !plan) {
        console.error('Missing metadata in checkout session');
        return;
    }

    // Fetch the subscription to get period end
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodEnd = (subscription as any).current_period_end;

    await prisma.user.update({
        where: { id: dbUserId },
        data: {
            planType: plan,
            creditsRemaining: getCreditsForPlan(plan),
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: 'active',
            currentPeriodEnd: new Date(periodEnd * 1000),
        },
    });

    console.log(`User ${dbUserId} subscribed to ${plan} plan`);
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
    const periodEnd = (subscription as any).current_period_end;

    await prisma.user.update({
        where: { id: user.id },
        data: {
            planType,
            subscriptionStatus,
            currentPeriodEnd: new Date(periodEnd * 1000),
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
    const periodEnd = (subscription as any).current_period_end;

    // Reset credits to plan allocation
    await prisma.user.update({
        where: { id: user.id },
        data: {
            creditsRemaining: getCreditsForPlan(planType),
            subscriptionStatus: 'active',
            currentPeriodEnd: new Date(periodEnd * 1000),
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
