import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface CallToActionProps {
    title?: string;
    description?: string;
    buttonText?: string;
    href?: string;
}

export function CallToAction({
    title = "Create Stunning Real Estate Flyers in Seconds",
    description = "Stop wasting time on design. Use our AI-powered generator to create professional listing flyers, social media posts, and more.",
    buttonText = "Try RealtorFlyer For Free",
    href = "/login"
}: CallToActionProps) {
    return (
        <div className="my-8 rounded-xl border-2 border-brand-gold/20 bg-brand-gold/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-brand-gold" />
                    <span className="text-sm font-semibold text-brand-gold uppercase tracking-wide">AI-Powered Design</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-navy">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <Link href={href}>
                <Button className="bg-brand-navy hover:bg-brand-navy/90 text-white h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-all">
                    {buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
    );
}
