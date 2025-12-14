import { XCircle } from "lucide-react"

export function Problem() {
    return (
        <section className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-brand-navy">Stop Wasting Time on Design</h2>
                    <p className="mt-4 text-muted-foreground text-lg">Your job is to sell homes, not fiddle with pixels.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-slate-50">
                        <XCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="font-semibold text-lg text-brand-navy mb-2">Hours on Canva</h3>
                        <p className="text-muted-foreground">Wrestling with templates that never look quite right and breaking branding rules.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-slate-50">
                        <XCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="font-semibold text-lg text-brand-navy mb-2">Expensive Designers</h3>
                        <p className="text-muted-foreground">Paying $50-100 per post and waiting days for revisions you didn't ask for.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-slate-50">
                        <XCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="font-semibold text-lg text-brand-navy mb-2">Inconsistent Brand</h3>
                        <p className="text-muted-foreground">A messy Instagram feed that confuses potential clients and hurts your professional image.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
