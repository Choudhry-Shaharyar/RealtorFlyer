import { Building, Users, Star } from "lucide-react"

export function SocialProof() {
    return (
        <section className="py-12 border-y bg-slate-50/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <p className="font-semibold text-muted-foreground uppercase tracking-widest text-sm">
                        Trusted by top agents at
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Text placeholders for logos as per request logic */}
                        <div className="text-xl font-bold font-serif text-slate-600">RE/MAX</div>
                        <div className="text-xl font-bold font-serif text-slate-600">Keller Williams</div>
                        <div className="text-xl font-bold font-serif text-slate-600">Century 21</div>
                        <div className="text-xl font-bold font-serif text-slate-600">Coldwell Banker</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t">
                    <div className="flex flex-col items-center">
                        <h4 className="text-3xl font-bold text-brand-navy">500+</h4>
                        <p className="text-sm text-muted-foreground mt-1">Active Agents</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="text-3xl font-bold text-brand-navy">10k+</h4>
                        <p className="text-sm text-muted-foreground mt-1">Flyers Created</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="text-3xl font-bold text-brand-navy flex items-center gap-1">
                            4.9 <Star className="h-5 w-5 fill-brand-gold text-brand-gold" />
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="text-3xl font-bold text-brand-navy">60s</h4>
                        <p className="text-sm text-muted-foreground mt-1">Avg Create Time</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
