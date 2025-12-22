"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PricingCardProps {
    title: string
    price: number
    yearlyPrice: number
    period: "monthly" | "yearly"
    features: string[]
    recommended?: boolean
    buttonText?: string
    planId?: string
    onSubscribe?: (planId: string) => Promise<void>
    isLoading?: boolean
}

const PricingCard = ({
    title,
    price,
    yearlyPrice,
    period,
    features,
    recommended = false,
    buttonText = "Get Started",
    planId,
    onSubscribe,
    isLoading,
}: PricingCardProps) => (
    <Card className={`relative flex flex-col ${recommended ? 'border-brand-gold shadow-lg scale-105 z-10' : ''}`}>
        {recommended && (
            <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-brand-gold text-brand-navy text-xs font-bold rounded-full uppercase tracking-wide">
                Most Popular
            </div>
        )}
        <CardHeader>
            <CardTitle className="text-2xl text-brand-navy">{title}</CardTitle>
            <div className="mt-4">
                <span className="text-4xl font-bold">${period === 'yearly' ? yearlyPrice : price}</span>
                <span className="text-muted-foreground">/mo</span>
            </div>
            <CardDescription>{period === 'yearly' && <span className="text-green-600 font-medium text-xs">Billed ${yearlyPrice * 12} yearly</span>}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
                {features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
        <CardFooter>
            {planId ? (
                <Button
                    className={`w-full ${recommended ? 'bg-brand-navy hover:bg-brand-navy-light text-white' : ''}`}
                    variant={recommended ? 'default' : 'outline'}
                    onClick={() => onSubscribe?.(planId)}
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {buttonText}
                </Button>
            ) : (
                <Link href="/login" className="w-full">
                    <Button
                        className={`w-full ${recommended ? 'bg-brand-navy hover:bg-brand-navy-light text-white' : ''}`}
                        variant={recommended ? 'default' : 'outline'}
                    >
                        {buttonText}
                    </Button>
                </Link>
            )}
        </CardFooter>
    </Card>
)

export function Pricing() {
    const [period, setPeriod] = useState<"monthly" | "yearly">("monthly")
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
    const router = useRouter()

    const handleSubscribe = async (planId: string) => {
        console.log('[Pricing] Starting checkout for plan:', planId)
        setLoadingPlan(planId)

        try {
            console.log('[Pricing] Making fetch request to /api/stripe/create-checkout')
            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId }),
            })

            console.log('[Pricing] Response status:', response.status)
            console.log('[Pricing] Response content-type:', response.headers.get('content-type'))

            // Get response as text first
            const responseText = await response.text()
            console.log('[Pricing] Raw response (first 1000 chars):', responseText.substring(0, 1000))

            // Try to parse as JSON
            let data
            try {
                data = JSON.parse(responseText)
            } catch (parseError) {
                console.error('[Pricing] JSON parse failed - Server returned HTML')
                console.error('[Pricing] Full response:', responseText)
                // Check if it's a 404 page
                if (responseText.includes('404') || responseText.includes('not found')) {
                    throw new Error('API endpoint not found (404). Check if the route exists.')
                }
                throw new Error(`Server error (${response.status}). Check browser console for details.`)
            }

            if (!response.ok) {
                if (response.status === 401) {
                    // User not logged in, redirect to login
                    router.push('/login')
                    return
                }
                throw new Error(data.error || 'Failed to create checkout')
            }

            if (data.url) {
                console.log('[Pricing] Success! Redirecting to:', data.url)
                window.location.href = data.url
            }
        } catch (error) {
            console.error('[Pricing] Checkout error:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to start checkout')
        } finally {
            setLoadingPlan(null)
        }
    }

    return (
        <section id="pricing" className="py-20">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
                        Real Estate Flyer Generator Pricing for Canadian Agents
                    </h2>
                    <p className="max-w-[600px] text-muted-foreground text-lg">
                        Save $500/month on design work. Start for free today.
                    </p>

                    <Tabs defaultValue="monthly" className="w-[400px] flex justify-center mt-6" onValueChange={(v) => setPeriod(v as "monthly" | "yearly")}>
                        <TabsList>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start max-w-7xl mx-auto">
                    <PricingCard
                        title="Free"
                        price={0}
                        yearlyPrice={0}
                        period={period}
                        features={["3 flyers/month", "Basic templates", "Standard support", "Small watermark"]}
                        buttonText="Start Free"
                    />
                    <PricingCard
                        title="Starter"
                        price={19}
                        yearlyPrice={15}
                        period={period}
                        features={["30 flyers/month", "All templates", "No watermark", "HD downloads", "Email support"]}
                        recommended={true}
                        buttonText="Subscribe"
                        planId="starter"
                        onSubscribe={handleSubscribe}
                        isLoading={loadingPlan === 'starter'}
                    />
                    <PricingCard
                        title="Pro"
                        price={49}
                        yearlyPrice={39}
                        period={period}
                        features={["100 flyers/month", "Priority generation", "Bulk download", "Analytics dashboard", "Priority support"]}
                        buttonText="Go Pro"
                        planId="pro"
                        onSubscribe={handleSubscribe}
                        isLoading={loadingPlan === 'pro'}
                    />
                    <PricingCard
                        title="Agency"
                        price={149}
                        yearlyPrice={119}
                        period={period}
                        features={["500 flyers/month", "5 team seats", "White-label option", "API access", "Dedicated support"]}
                        buttonText="Subscribe"
                        planId="agency"
                        onSubscribe={handleSubscribe}
                        isLoading={loadingPlan === 'agency'}
                    />
                </div>
            </div>
        </section>
    )
}
