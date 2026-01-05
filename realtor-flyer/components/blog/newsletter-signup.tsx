"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setEmail("");
            toast.success("Thanks for subscribing! Check your inbox soon.");
        }, 1000);
    };

    return (
        <div className="bg-brand-navy rounded-2xl p-8 md:p-12 text-center text-white my-12">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-brand-gold" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                    Get Real Estate Marketing Tips
                </h3>
                <p className="text-brand-gray-light">
                    Join thousands of Canadian realtors who receive our weekly marketing guides and flyer templates.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-brand-gold h-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-semibold h-11"
                    >
                        {loading ? "Joining..." : "Subscribe Free"}
                    </Button>
                </form>
                <p className="text-xs text-brand-gray-light/60">
                    No spam. Unsubscribe at any time.
                </p>
            </div>
        </div>
    );
}
