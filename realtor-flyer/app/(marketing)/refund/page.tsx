import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Refund Policy",
    description: "Refund Policy for RealtorFlyer - Cancellation and refund terms for our subscription plans",
}

export default function RefundPage() {
    return (
        <div className="container max-w-4xl py-12 md:py-16">
            <article className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold text-brand-navy mb-2">Refund Policy</h1>
                <p className="text-muted-foreground mb-8">Last Updated: January 2, 2026</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">Overview</h2>
                    <p className="text-muted-foreground mb-4">
                        We want you to be satisfied with RealtorFlyer. This Refund Policy explains our terms for cancellations and refunds. As a digital SaaS product where AI generations consume API costs immediately upon use, our refund policy reflects these operational realities while remaining fair to our customers.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">Monthly Subscriptions</h2>
                    <p className="text-muted-foreground mb-4">
                        Monthly subscriptions are <strong>non-refundable</strong> once the billing cycle has started. This is because:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>AI flyer generations consume third-party API costs immediately when used</li>
                        <li>Your flyer generation credits are available immediately upon subscription</li>
                        <li>Any flyers you've generated remain yours to keep and use</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                        <strong>Cancellation:</strong> You may cancel your monthly subscription at any time. Your access will continue until the end of your current billing period, after which your subscription will not renew.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">Annual Subscriptions</h2>
                    <p className="text-muted-foreground mb-4">
                        If you have an annual subscription and wish to cancel:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li><strong>Within 14 days:</strong> If you cancel within 14 days of purchase and have not used any flyer generations, you may request a full refund.</li>
                        <li><strong>After 14 days:</strong> You may be eligible for a prorated refund for unused months, calculated from the date of your cancellation request. Prorated refunds are issued at our discretion and will be calculated based on the number of full months remaining in your subscription.</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                        <strong>Used Credits:</strong> If you have used a significant portion of your flyer generation credits, the refund amount may be reduced accordingly.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">Exceptions</h2>
                    <p className="text-muted-foreground mb-4">
                        We may consider refunds in exceptional circumstances, including:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li><strong>Service Outages:</strong> Extended platform unavailability that significantly impacts your ability to use the service</li>
                        <li><strong>Technical Issues:</strong> Persistent bugs or errors that prevent you from using core features, which we are unable to resolve</li>
                        <li><strong>Billing Errors:</strong> Accidental duplicate charges or incorrect billing amounts</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">How to Cancel Your Subscription</h2>
                    <p className="text-muted-foreground mb-4">
                        You can cancel your subscription at any time:
                    </p>
                    <ol className="list-decimal pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Log in to your RealtorFlyer account</li>
                        <li>Go to <strong>Settings → Billing</strong></li>
                        <li>Click <strong>"Manage Subscription"</strong> to access the Stripe Customer Portal</li>
                        <li>Select <strong>"Cancel Subscription"</strong></li>
                    </ol>
                    <p className="text-muted-foreground mb-4">
                        Alternatively, you can contact us at{" "}
                        <a href="mailto:support@realtorflyer.ca" className="text-primary hover:underline">support@realtorflyer.ca</a>{" "}
                        and we will cancel your subscription for you.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">How to Request a Refund</h2>
                    <p className="text-muted-foreground mb-4">
                        To request a refund, please email us at{" "}
                        <a href="mailto:support@realtorflyer.ca" className="text-primary hover:underline">support@realtorflyer.ca</a>{" "}
                        with:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Your account email address</li>
                        <li>The reason for your refund request</li>
                        <li>Your subscription type (monthly or annual)</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                        We will review your request and respond within 5 business days. Approved refunds will be processed to your original payment method within 5-10 business days.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">Free Trial</h2>
                    <p className="text-muted-foreground mb-4">
                        If you are on a free trial, no payment is required and therefore no refund is applicable. You may cancel your trial at any time before it converts to a paid subscription.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">Plan Changes</h2>
                    <p className="text-muted-foreground mb-4">
                        <strong>Upgrades:</strong> When you upgrade your plan, you will be charged a prorated amount for the remainder of your billing period based on the price difference.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        <strong>Downgrades:</strong> When you downgrade, the change will take effect at the start of your next billing cycle. No partial refunds are issued for downgrades.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">Contact Us</h2>
                    <p className="text-muted-foreground mb-4">
                        If you have questions about this Refund Policy or need assistance with your subscription, please contact us:
                    </p>
                    <p className="text-muted-foreground mb-4">
                        <strong>RealtorFlyer</strong><br />
                        Email:{" "}
                        <a href="mailto:support@realtorflyer.ca" className="text-primary hover:underline">
                            support@realtorflyer.ca
                        </a><br />
                        Website:{" "}
                        <a href="https://realtorflyer.ca" className="text-primary hover:underline">
                            https://realtorflyer.ca
                        </a>
                    </p>
                </section>
            </article>
        </div>
    )
}
