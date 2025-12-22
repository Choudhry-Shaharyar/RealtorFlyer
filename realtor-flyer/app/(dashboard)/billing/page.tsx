"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Sparkles, Check, Loader2, Calendar, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface UserSubscription {
    planType: string;
    creditsRemaining: number;
    subscriptionStatus: string;
    currentPeriodEnd: string | null;
    stripeCustomerId: string | null;
}

const PLAN_CREDITS: Record<string, number> = {
    free: 3,
    starter: 30,
    pro: 100,
    agency: 500,
};

export default function BillingPage() {
    const [user, setUser] = useState<UserSubscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPortalLoading, setIsPortalLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await fetch("/api/user/profile");
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push("/login");
                        return;
                    }
                    throw new Error("Failed to load profile");
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load billing information");
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, [router]);

    const handleManageSubscription = async () => {
        setIsPortalLoading(true);
        try {
            const response = await fetch("/api/stripe/portal", {
                method: "POST",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to open billing portal");
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Failed to open billing portal");
        } finally {
            setIsPortalLoading(false);
        }
    };

    const handleUpgrade = async (plan: string) => {
        console.log('[Billing] Starting upgrade to plan:', plan);
        try {
            const response = await fetch("/api/stripe/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            });

            console.log('[Billing] Response status:', response.status);
            console.log('[Billing] Response headers:', Object.fromEntries(response.headers.entries()));

            // Get response as text first to debug HTML responses
            const responseText = await response.text();
            console.log('[Billing] Raw response (first 500 chars):', responseText.substring(0, 500));

            // Try to parse as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('[Billing] Failed to parse response as JSON:', parseError);
                console.error('[Billing] Full response text:', responseText);
                throw new Error(`Server returned invalid response (status ${response.status}). Check console for details.`);
            }

            if (!response.ok) {
                throw new Error(data.error || "Failed to start checkout");
            }

            if (data.url) {
                console.log('[Billing] Redirecting to checkout URL:', data.url);
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('[Billing] Upgrade error:', error);
            toast.error(error instanceof Error ? error.message : "Failed to start checkout");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const maxCredits = PLAN_CREDITS[user.planType] || 3;
    const creditPercentage = Math.min((user.creditsRemaining / maxCredits) * 100, 100);
    const isPaidPlan = user.planType !== "free";
    const hasActiveSubscription = user.subscriptionStatus === "active";

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
            <p className="text-muted-foreground mb-8">Manage your plan and credits</p>

            {/* Status Alert for past_due */}
            {user.subscriptionStatus === "past_due" && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-destructive">Payment Failed</p>
                        <p className="text-sm text-muted-foreground">
                            Your last payment failed. Please update your payment method to avoid service interruption.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={handleManageSubscription}
                        >
                            Update Payment Method
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Current Plan Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-brand-gold" />
                            Current Plan
                        </CardTitle>
                        <CardDescription>Your subscription details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Plan Type</p>
                                <p className="text-2xl font-bold capitalize">{user.planType}</p>
                            </div>
                            <Badge
                                variant={hasActiveSubscription ? "default" : "secondary"}
                                className={hasActiveSubscription ? "bg-green-500" : ""}
                            >
                                {user.subscriptionStatus === "active" ? "Active" :
                                    user.subscriptionStatus === "past_due" ? "Past Due" :
                                        user.subscriptionStatus === "cancelled" ? "Cancelled" : "Inactive"}
                            </Badge>
                        </div>

                        {/* Credits */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <p className="text-sm font-medium text-muted-foreground">Credits Remaining</p>
                                <p className="text-sm font-bold">{user.creditsRemaining} / {maxCredits}</p>
                            </div>
                            <Progress value={creditPercentage} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                                Each flyer generation uses 1 credit
                            </p>
                        </div>

                        {/* Renewal Date */}
                        {user.currentPeriodEnd && hasActiveSubscription && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Renews on {formatDate(user.currentPeriodEnd)}</span>
                            </div>
                        )}
                    </CardContent>
                    {isPaidPlan && user.stripeCustomerId && (
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleManageSubscription}
                                disabled={isPortalLoading}
                            >
                                {isPortalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <CreditCard className="mr-2 h-4 w-4" />
                                Manage Subscription
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Upgrade Call to Action */}
                {user.planType === "free" && (
                    <Card className="bg-brand-navy text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Upgrade to Starter</CardTitle>
                            <CardDescription className="text-white/80">Unlock your full potential</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-brand-gold" />
                                <span className="text-sm">30 flyers per month</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-brand-gold" />
                                <span className="text-sm">No watermark</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-brand-gold" />
                                <span className="text-sm">All premium templates</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-brand-gold" />
                                <span className="text-sm">HD downloads</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold"
                                onClick={() => handleUpgrade("starter")}
                            >
                                Upgrade for $19/mo
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Show other upgrade options for paid users */}
                {isPaidPlan && user.planType !== "agency" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Need More Credits?</CardTitle>
                            <CardDescription>Upgrade your plan for more monthly flyers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user.planType === "starter" && (
                                <div className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Professional</span>
                                        <span className="text-brand-navy font-bold">$49/mo</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">100 flyers/month + priority generation</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleUpgrade("pro")}
                                    >
                                        Upgrade to Pro
                                    </Button>
                                </div>
                            )}
                            {(user.planType === "starter" || user.planType === "pro") && (
                                <div className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Agency</span>
                                        <span className="text-brand-navy font-bold">$149/mo</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">500 flyers/month + team seats + API</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleUpgrade("agency")}
                                    >
                                        Upgrade to Agency
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
