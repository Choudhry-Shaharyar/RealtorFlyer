import { ClipboardList, Palette, Share2, ArrowRight } from "lucide-react"

export function HowItWorks() {
    return (
        <section className="py-20 bg-brand-navy-light/5">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-brand-navy">Create Professional Flyers in 3 Simple Steps</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-12 relative max-w-6xl mx-auto">
                    <div className="hidden md:block absolute top-12 left-[20%] w-[25%] border-t-2 border-dashed border-brand-navy/20"></div>
                    <div className="hidden md:block absolute top-12 right-[20%] w-[25%] border-t-2 border-dashed border-brand-navy/20"></div>

                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border mb-6">
                            <ClipboardList className="h-10 w-10 text-brand-gold" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy mb-2">1. Enter Listing</h3>
                        <p className="text-muted-foreground">Add price, beds, baths, and details. Or just paste the MLS link.</p>
                    </div>

                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border mb-6">
                            <Palette className="h-10 w-10 text-brand-gold" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy mb-2">2. Choose Style</h3>
                        <p className="text-muted-foreground">Pick from our curated templates that automatically adapt to your brand.</p>
                    </div>

                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border mb-6">
                            <Share2 className="h-10 w-10 text-brand-gold" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy mb-2">3. Download & Post</h3>
                        <p className="text-muted-foreground">Get high-res images for Instagram, Facebook, and LinkedIn instantly.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
