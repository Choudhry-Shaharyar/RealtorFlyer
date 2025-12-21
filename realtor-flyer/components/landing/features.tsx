import { Palette, Maximize, Zap, Image as ImageIcon, Tag, CalendarClock, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
    {
        title: "AI-Powered Real Estate Flyer Design",
        description: "Our AI generates professional property flyers that rival agency-designed templates. Perfect for real estate agents who need stunning marketing materials instantly.",
        icon: Zap,
    },
    {
        title: "Save Time on Real Estate Marketing",
        description: "Create real estate listing flyers in under 2 minutes. Spend less time designing, more time selling properties.",
        icon: Clock,
    },
    {
        title: "Professional Real Estate Branding",
        description: "Customize with your realtor branding, agent portrait, and company colors. Consistency across all your property marketing materials.",
        icon: Palette,
    },
    // {
    //     title: "Real Estate Flyer Templates Built-In",
    //     description: "Choose from professional real estate listing flyer templates optimized for Instagram, Facebook, and LinkedIn.",
    //     icon: ImageIcon,
    // },
]

export function Features() {
    return (
        <section id="features" className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
                        Why Canadian Realtors Choose RealtorFlyer
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground text-lg">
                        The best real estate marketing software for Canadian agents.
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
