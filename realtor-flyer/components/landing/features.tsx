import { Palette, Maximize, Zap, Image as ImageIcon, Tag, CalendarClock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
    {
        title: "Multiple Templates",
        description: "Modern, Luxury, Classic, Minimalist — find your style that matches your brand.",
        icon: Palette,
    },
    {
        title: "Every Social Size",
        description: "Instagram Square, Stories, Facebook, LinkedIn, Twitter — all generated instantly.",
        icon: Maximize,
    },
    {
        title: "60-Second Generation",
        description: "AI creates your flyer while you grab coffee. No more hours in Canva.",
        icon: Zap,
    },
    {
        title: "Your Branding",
        description: "Your photo, colors, and agency logo automatically applied to every post.",
        icon: ImageIcon,
    },
    {
        title: "Price Drops That Pop",
        description: "Specialized templates for price reductions, sold listings, and open houses.",
        icon: Tag,
    },
    {
        title: "Open House Ready",
        description: "Date and time overlays included seamlessly in the design.",
        icon: CalendarClock,
    },
]

export function Features() {
    return (
        <section id="features" className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
                        Everything You Need to Stand Out
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground text-lg">
                        Powerful tools designed specifically for real estate professionals.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <Card key={feature.title} className="border-none shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="space-y-1 pb-2">
                                <div className="w-12 h-12 rounded-lg bg-brand-navy/10 flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-brand-navy" />
                                </div>
                                <CardTitle className="text-xl text-brand-navy">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
