export function Gallery() {
    return (
        <section id="examples" className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center text-brand-navy mb-4">See What You Can Create</h2>
                <p className="text-center text-muted-foreground mb-12">Professional templates for every stage of your listing.</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Placeholders for gallery images w/ overlays describing them */}
                    <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-bold">Just Listed</span>
                        </div>
                        <p className="text-slate-500 font-medium">Just Listed Template</p>
                    </div>
                    <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-bold">Open House</span>
                        </div>
                        <p className="text-slate-500 font-medium">Open House Template</p>
                    </div>
                    <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-bold">Just Sold</span>
                        </div>
                        <p className="text-slate-500 font-medium">Just Sold Template</p>
                    </div>
                    <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-bold">Price Improvement</span>
                        </div>
                        <p className="text-slate-500 font-medium">Price Drop Template</p>
                    </div>
                    <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-bold">Coming Soon</span>
                        </div>
                        <p className="text-slate-500 font-medium">Coming Soon Template</p>
                    </div>
                    <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-bold">Market Update</span>
                        </div>
                        <p className="text-slate-500 font-medium">Market Update Template</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
