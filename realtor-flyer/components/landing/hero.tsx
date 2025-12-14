"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-8 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-navy-light/10 via-background to-background">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4 max-w-3xl"
                    >
                        <div className="flex justify-center gap-2">
                            <Badge variant="outline" className="border-brand-gold text-brand-gold bg-brand-gold/10 px-3 py-1 text-sm font-medium rounded-full">
                                AI-Powered
                            </Badge>
                            <Badge variant="outline" className="text-muted-foreground px-3 py-1 text-sm font-medium rounded-full">
                                No credit card required
                            </Badge>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-brand-navy">
                            Create Stunning <br className="hidden md:inline" />
                            Real Estate Posts in <span className="text-brand-gold">60 Seconds</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
                            Professional social media flyers that sell homes. No design skills needed. Just enter the address and let AI do the rest.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link href="/login">
                            <Button size="lg" className="h-12 px-8 text-lg font-semibold bg-brand-gold hover:bg-brand-gold-light text-brand-navy">
                                Start Free — 3 Flyers on Us
                            </Button>
                        </Link>
                        <Link href="#examples">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                See Examples
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative mt-16 w-full max-w-5xl rounded-xl border bg-background p-2 shadow-2xl"
                    >
                        {/* Placeholder for Hero Image */}
                        <div className="aspect-[16/9] w-full bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/20 to-transparent z-10" />
                            <p className="text-muted-foreground text-lg italic">Hero Mockup / Carousel Placeholder</p>
                            {/* 
                 TODO: Add an actual image here using standard next/image 
                 <Image src="/images/hero-mockup.png" alt="RealtorFlyer Application Mockup" fill className="object-cover" />
               */}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
