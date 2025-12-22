"use server";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                companyName: true,
                profilePhoto: true,
                planType: true,
                creditsRemaining: true,
                subscriptionStatus: true,
                currentPeriodEnd: true,
                stripeCustomerId: true,
            },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(dbUser);
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}
