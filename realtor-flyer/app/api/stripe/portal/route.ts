import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST() {
    try {
        // 1. Authenticate user
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { email: authUser.email },
        });

        if (!dbUser?.stripeCustomerId) {
            return NextResponse.json(
                { error: 'No subscription found. Please subscribe first.' },
                { status: 400 }
            );
        }

        // 3. Create Customer Portal session
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: `${baseUrl}/billing`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error('Portal error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create portal session' },
            { status: 500 }
        );
    }
}
