import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Testimonials() {
    return (
        <section className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center text-brand-navy mb-12">Loved by Real Estate Professionals</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-slate-50 border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                            <Avatar>
                                <AvatarFallback>SM</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">Sarah M.</span>
                                <span className="text-xs text-muted-foreground">Keller Williams</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-brand-navy/80">"I used to spend 2 hours making social posts. Now it takes 2 minutes. Game changer!"</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-50 border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                            <Avatar>
                                <AvatarFallback>MT</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">Marcus T.</span>
                                <span className="text-xs text-muted-foreground">RE/MAX</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-brand-navy/80">"Sold a $1.2M home from an Instagram post made with RealtorFlyer. Best $19 I spend."</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-50 border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                            <Avatar>
                                <AvatarFallback>JL</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">Jennifer L.</span>
                                <span className="text-xs text-muted-foreground">Broker</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-brand-navy/80">"My listings look more professional than agents with full marketing teams."</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-50 border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                            <Avatar>
                                <AvatarFallback>DK</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">David K.</span>
                                <span className="text-xs text-muted-foreground">Century 21</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-brand-navy/80">"Finally, something that actually understands real estate marketing."</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
