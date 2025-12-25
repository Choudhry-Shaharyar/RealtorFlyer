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
            <div className="container">
                <div className="flex flex-col items-center gap-6 text-center">
                    <p className="font-semibold text-muted-foreground uppercase tracking-widest text-sm">
                        Trusted by Canadian Agents at
                    </p>

                    {/* Infinite scrolling marquee - seamless loop with two strips */}
                    <div className="relative w-full overflow-hidden">
                        <div className="flex gap-16">
                            {/* First strip */}
                            <div className="animate-marquee flex gap-16 whitespace-nowrap shrink-0">
                                {BRANDS.map((brand, idx) => (
                                    <div
                                        key={idx}
                                        className="text-xl font-bold font-serif text-slate-500 px-4 py-2"
                                    >
                                        {brand}
                                    </div>
                                ))}
                            </div>
                            {/* Second strip - identical, creates seamless loop */}
                            <div className="animate-marquee flex gap-16 whitespace-nowrap shrink-0">
                                {BRANDS.map((brand, idx) => (
                                    <div
                                        key={`dup-${idx}`}
                                        className="text-xl font-bold font-serif text-slate-500 px-4 py-2"
                                    >
                                        {brand}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t">
                    <div className="flex flex-col items-center p-4 rounded-xl">
                        <h4 className="text-3xl font-bold text-brand-navy">500+</h4>
                        <p className="text-sm text-muted-foreground mt-1">Canadian Realtors</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-xl">
                        <h4 className="text-3xl font-bold text-brand-navy">10k+</h4>
                        <p className="text-sm text-muted-foreground mt-1">Flyers Created</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-xl">
                        <h4 className="text-3xl font-bold text-brand-navy flex items-center gap-1">
                            4.9 <Star className="h-5 w-5 fill-brand-gold text-brand-gold" />
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-xl">
                        <h4 className="text-3xl font-bold text-brand-navy">15s</h4>
                        <p className="text-sm text-muted-foreground mt-1">Avg Create Time</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
