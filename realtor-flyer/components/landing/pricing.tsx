"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"

const PricingCard = ({ title, price, yearlyPrice, period, features, recommended = false, buttonText = "Get Started", onAction }: any) => (
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
            <Button
                className={`w-full ${recommended ? 'bg-brand-navy hover:bg-brand-navy-light text-white' : ''}`}
                variant={recommended ? 'default' : 'outline'}
            >
                {buttonText}
            </Button>
        </CardFooter>
    </Card>
)

export function Pricing() {
    const [period, setPeriod] = useState<"monthly" | "yearly">("monthly")

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
                    />
                    <PricingCard
                        title="Pro"
                        price={49}
                        yearlyPrice={39}
                        period={period}
                        features={["100 flyers/month", "Priority generation", "Bulk download", "Analytics dashboard", "Priority support"]}
                        buttonText="Go Pro"
                    />
                    <PricingCard
                        title="Agency"
                        price={149}
                        yearlyPrice={119}
                        period={period}
                        features={["500 flyers/month", "5 team seats", "White-label option", "API access", "Dedicated support"]}
                        buttonText="Contact Sales"
                    />
                </div>
            </div>
        </section>
    )
}
