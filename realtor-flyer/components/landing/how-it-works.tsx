import { ClipboardList, Palette, Share2, ArrowRight } from "lucide-react"

export function HowItWorks() {
    return (
        <section className="py-20 bg-brand-navy-light/5">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-brand-navy">How to Create Real Estate Flyers with AI</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-12 relative max-w-6xl mx-auto">
                    <div className="hidden md:block absolute top-12 left-[20%] w-[25%] border-t-2 border-dashed border-brand-navy/20"></div>
                    <div className="hidden md:block absolute top-12 right-[20%] w-[25%] border-t-2 border-dashed border-brand-navy/20"></div>

                    <div className="flex flex-col items-center text-center relative z-10 group cursor-default">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border mb-6 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                            <ClipboardList className="h-10 w-10 text-brand-gold group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">1. Upload Property Details</h3>
                        <p className="text-muted-foreground">Upload your listing photos and enter key details. Our AI analyzes the property images instantly.</p>
                    </div>

                    <div className="flex flex-col items-center text-center relative z-10 group cursor-default">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border mb-6 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                            <Palette className="h-10 w-10 text-brand-gold group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">2. Choose Flyer Design</h3>
                        <p className="text-muted-foreground">Select from professional real estate flyer templates that automatically match your agent branding.</p>
                    </div>

                    <div className="flex flex-col items-center text-center relative z-10 group cursor-default">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border mb-6 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                            <Share2 className="h-10 w-10 text-brand-gold group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">3. Download Marketing Flyer</h3>
                        <p className="text-muted-foreground">Get high-resolution flyers ready for MLS, Instagram, Facebook, and print marketing.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
