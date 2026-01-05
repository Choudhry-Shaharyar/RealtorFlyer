import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { email, source = "blog" } = await req.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existing) {
            if (existing.isActive) {
                return NextResponse.json(
                    { message: "You're already subscribed!", alreadySubscribed: true },
                    { status: 200 }
                );
            } else {
                // Reactivate subscription
                await prisma.newsletterSubscriber.update({
                    where: { email: email.toLowerCase() },
                    data: {
                        isActive: true,
                        unsubscribedAt: null,
                        subscribedAt: new Date(),
                    },
                });
                return NextResponse.json(
                    { message: "Welcome back! You've been resubscribed." },
                    { status: 200 }
                );
            }
        }

        // Create new subscriber
        await prisma.newsletterSubscriber.create({
            data: {
                email: email.toLowerCase(),
                source,
            },
        });

        return NextResponse.json(
            { message: "Successfully subscribed!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { error: "Failed to subscribe. Please try again." },
            { status: 500 }
        );
    }
}

// GET endpoint to count subscribers (for admin use)
export async function GET() {
    try {
        const count = await prisma.newsletterSubscriber.count({
            where: { isActive: true },
        });

        return NextResponse.json({ activeSubscribers: count });
    } catch (error) {
        console.error("Error fetching subscriber count:", error);
        return NextResponse.json(
            { error: "Failed to fetch count" },
            { status: 500 }
        );
    }
}
