import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CreditCard, Sparkles, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function BillingPage() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
    });

    if (!dbUser) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
            <p className="text-muted-foreground mb-8">Manage your plan and credits</p>

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
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Plan Type</p>
                            <p className="text-2xl font-bold capitalize">{dbUser.planType}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Credits Remaining</p>
                            <div className="flex items-end gap-2">
                                <p className="text-2xl font-bold">{dbUser.creditsRemaining}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upgrade Call to Action (Placeholder since full billing flow isn't implemented) */}
                <Card className="bg-brand-navy text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Upgrade to Pro</CardTitle>
                        <CardDescription className="text-white/80">Unlock unlimited potential</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-brand-gold" />
                            <span className="text-sm">Unlimited flyer generation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-brand-gold" />
                            <span className="text-sm">Priority support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-brand-gold" />
                            <span className="text-sm">Premium templates</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold">
                            Upgrade Now
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
