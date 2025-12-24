import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FinalCTA() {
    return (
        <section className="w-full py-24 bg-brand-navy text-white text-center">
            <div className="container max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Create Your First Flyer?</h2>
                <p className="text-xl text-brand-white/80 mb-10 max-w-2xl mx-auto">
                    Join agents already saving hours every week. Create your first professional design in seconds.
                </p>
                <Link href="/login">
                    <Button size="lg" className="h-12 md:h-14 px-6 md:px-10 text-base md:text-lg font-bold bg-brand-gold hover:bg-brand-gold-light text-brand-navy shadow-xl shadow-brand-gold/20 whitespace-normal md:whitespace-nowrap">
                        Start Free — No Credit Card Required
                    </Button>
                </Link>
                <p className="mt-6 text-sm text-brand-white/60">
                    3 free flyers/mo • No watermark on paid plans • Cancel anytime
                </p>
            </div>
        </section>
    )
}
