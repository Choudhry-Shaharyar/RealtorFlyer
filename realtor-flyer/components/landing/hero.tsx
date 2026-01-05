"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CAROUSEL_IMAGES = [
    {
        src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
        alt: "Luxury Modern Home",
        caption: "Modern Luxury Flyers"
    },
    {
        src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
        alt: "Spacious Interior",
        caption: "Open House Announcements"
    },
    {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
        alt: "Backyard Pool",
        caption: "Just Listed Property"
    }
]

function Carousel() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const next = () => setCurrent((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    const prev = () => setCurrent((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)

    return (
        <div className="relative w-full h-full">
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={CAROUSEL_IMAGES[current].src}
                        alt={CAROUSEL_IMAGES[current].alt}
                        fill
                        className="object-cover"
                        priority={current === 0}
                        sizes="(max-width: 768px) 100vw, 1280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                        <h3 className="text-white text-2xl font-bold">{CAROUSEL_IMAGES[current].caption}</h3>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={prev} className="bg-black/20 hover:bg-black/40 text-white rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" onClick={next} className="bg-black/20 hover:bg-black/40 text-white rounded-full">
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
                {CAROUSEL_IMAGES.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 w-2 rounded-full transition-all ${idx === current ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    )
}

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-10 pb-32 md:pt-12">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-navy-light/10 via-background to-background" />
            <div className="container">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4 max-w-4xl"
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
                            The <span className="text-brand-gold">AI</span> Real Estate <br className="hidden md:inline" />
                            Flyer Generator
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
                            The #1 <strong>AI flyer generator for realtors</strong>. Create stunning property listing flyers, open house materials, and social media posts in seconds.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
                    >
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button size="default" className="w-full sm:w-auto h-11 sm:h-12 px-4 sm:px-8 text-sm sm:text-lg font-semibold bg-brand-gold hover:bg-brand-gold-light text-brand-navy">
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link href="#examples" className="w-full sm:w-auto">
                            <Button size="default" variant="outline" className="w-full sm:w-auto h-11 sm:h-12 px-4 sm:px-8 text-sm sm:text-lg">
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
                        {/* Hero Carousel */}
                        <div className="aspect-[16/9] w-full bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden relative group">
                            <Carousel />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
