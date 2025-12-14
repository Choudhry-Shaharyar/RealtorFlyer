import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
    {
        question: "Is it really free to start?",
        answer: "Yes! You get 3 free flyers every month with no credit card required. You only need to upgrade if you want more generations or premium features."
    },
    {
        question: "Can I use my own listing photos?",
        answer: "Absolutely. You upload your property photos and our AI incorporates them into professional templates tailored to your brand."
    },
    {
        question: "What social media sizes do you support?",
        answer: "We support all major formats including Instagram Posts (Square & Portrait), Instagram Stories, Facebook Posts, LinkedIn, and Twitter."
    },
    {
        question: "Do you offer team or brokerage plans?",
        answer: "Yes, our Agency plan supports up to 5 team members with centralized billing and brand asset management. Contact us for larger enterprise needs."
    }
]

export function FAQ() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-brand-navy mb-4">Frequently Asked Questions</h2>
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
