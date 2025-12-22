"use client"

import { Star } from "lucide-react"

const BRANDS = [
    "RE/MAX",
    "Royal LePage",
    "Century 21",
    "eXp Realty",
]

export function SocialProof() {
    return (
        <section className="py-12 border-y bg-slate-50/50 overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center gap-6 text-center">
                    <p className="font-semibold text-muted-foreground uppercase tracking-widest text-sm">
                        Trusted by Canadian Agents at
                    </p>

                    {/* Infinite scrolling marquee */}
                    <div className="relative w-full overflow-hidden">
                        <div className="animate-marquee flex gap-16 whitespace-nowrap">
                            {/* Duplicate brands for seamless loop */}
                            {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, idx) => (
                                <div
                                    key={idx}
                                    className="text-xl font-bold font-serif text-slate-500 hover:text-brand-navy transition-colors duration-300 cursor-default px-4 py-2 rounded-lg hover:bg-white hover:shadow-md"
                                >
                                    {brand}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t">
                    <div className="flex flex-col items-center group hover-lift p-4 rounded-xl hover:bg-white cursor-default">
                        <h4 className="text-3xl font-bold text-brand-navy group-hover:text-brand-gold transition-colors">500+</h4>
                        <p className="text-sm text-muted-foreground mt-1">Canadian Realtors</p>
                    </div>
                    <div className="flex flex-col items-center group hover-lift p-4 rounded-xl hover:bg-white cursor-default">
                        <h4 className="text-3xl font-bold text-brand-navy group-hover:text-brand-gold transition-colors">10k+</h4>
                        <p className="text-sm text-muted-foreground mt-1">Flyers Created</p>
                    </div>
                    <div className="flex flex-col items-center group hover-lift p-4 rounded-xl hover:bg-white cursor-default">
                        <h4 className="text-3xl font-bold text-brand-navy flex items-center gap-1 group-hover:text-brand-gold transition-colors">
                            4.9 <Star className="h-5 w-5 fill-brand-gold text-brand-gold" />
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
                    </div>
                    <div className="flex flex-col items-center group hover-lift p-4 rounded-xl hover:bg-white cursor-default">
                        <h4 className="text-3xl font-bold text-brand-navy group-hover:text-brand-gold transition-colors">15s</h4>
                        <p className="text-sm text-muted-foreground mt-1">Avg Create Time</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
