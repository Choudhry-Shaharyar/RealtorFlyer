import Stripe from 'stripe';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});

// Plan configuration with Price IDs and credits
export const PLANS = {
    free: {
        name: 'Free',
        priceId: null,
        credits: 3,
        price: 0,
    },
    starter: {
        name: 'Starter',
        priceId: process.env.STRIPE_PRICE_STARTER,
        credits: 30,
        price: 19,
    },
    pro: {
        name: 'Professional',
        priceId: process.env.STRIPE_PRICE_PRO,
        credits: 100,
        price: 49,
    },
    agency: {
        name: 'Agency',
        priceId: process.env.STRIPE_PRICE_AGENCY,
        credits: 500,
        price: 149,
    },
} as const;

export type PlanType = keyof typeof PLANS;

// Get credits for a plan type
export function getCreditsForPlan(planType: string): number {
    const plan = PLANS[planType as PlanType];
    return plan?.credits ?? 3;
}

// Get plan type from Stripe Price ID
export function getPlanFromPriceId(priceId: string): PlanType {
    for (const [key, plan] of Object.entries(PLANS)) {
        if (plan.priceId === priceId) {
            return key as PlanType;
        }
    }
    return 'free';
}

// Validate plan type
export function isValidPlan(plan: string): plan is PlanType {
    return plan in PLANS;
}
