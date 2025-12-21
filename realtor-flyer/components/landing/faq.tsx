import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
    {
        question: "What is the best real estate flyer generator software?",
        answer: "RealtorFlyer is rated as the top AI-powered flyer generator for Canadian agents, offering instant creation of MLS-ready marketing materials without any design skills required."
    },
    {
        question: "Can I customize real estate flyer templates for my brokerage?",
        answer: "Yes, you can upload your brokerage logo, personal headshot, and brand colors. All templates automatically adapt to your specific branding constraints."
    },
    {
        question: "How do Canadian real estate agents use flyer templates?",
        answer: "Agents use our templates for Instagram posts, Facebook ads, LinkedIn updates, and open house handouts to consistent market new listings and price changes."
    },
    {
        question: "Is this real estate marketing software better than Canva?",
        answer: "Unlike Canva, RealtorFlyer is built specifically for real estate. You don't drag-and-drop; you just enter property details and get a finished, professional design instantly."
    },
    {
        question: "What real estate flyer design elements drive property sales?",
        answer: "High-quality hero images, clear pricing, agent contact info, and concise property highlights are the key drivers. Our templates are optimized for these conversion factors."
    },
    {
        question: "Can I add my realtor portrait to real estate listing flyers?",
        answer: "Yes, your profile setup allows you to upload a high-res portrait once, and it will be perfectly positioned on every single flyer you generate."
    },
    {
        question: "What image formats work best for real estate property photos in flyers?",
        answer: "We recommend high-resolution JPG or PNG files. Our AI automatically enhances and crops them to fit specific social media aspect ratios (1:1, 9:16, etc.)."
    },
    {
        question: "How do I use real estate flyers on social media?",
        answer: "Download your generated flyers in Square (Instagram), Portrait (Stories/TikTok), or Landscape (LinkedIn) formats and post directly to your channels to engage buyers."
    }
]

export function FAQ() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-brand-navy mb-4">Real Estate Flyer Generator - Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium text-brand-navy">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
