import { Hero } from "@/components/landing/hero"
import { SocialProof } from "@/components/landing/social-proof"
import { Problem } from "@/components/landing/problem"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { Pricing } from "@/components/landing/pricing"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"
import { FinalCTA } from "@/components/landing/final-cta"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <SocialProof />
            <Problem />
            <HowItWorks />
            <Features />
            <Pricing />
            <Testimonials />
            <FAQ />
            <FinalCTA />
        </div>
    )
}

