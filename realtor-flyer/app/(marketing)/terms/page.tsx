import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Terms of Service for RealtorFlyer - AI-powered real estate flyer generation platform",
}

export default function TermsPage() {
    return (
        <div className="container max-w-4xl py-12 md:py-16">
            <article className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold text-brand-navy mb-2">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last Updated: January 2, 2026</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground mb-4">
                        Welcome to RealtorFlyer. By accessing or using our website at{" "}
                        <a href="https://realtorflyer.ca" className="text-primary hover:underline">https://realtorflyer.ca</a>{" "}
                        and our services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        RealtorFlyer is operated by an individual sole proprietor based in Ontario, Canada. These Terms constitute a legally binding agreement between you and RealtorFlyer.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">2. Eligibility</h2>
                    <p className="text-muted-foreground mb-4">
                        You must be at least 18 years of age to use RealtorFlyer. By using our services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">3. Description of Service</h2>
                    <p className="text-muted-foreground mb-4">
                        RealtorFlyer is a software-as-a-service (SaaS) platform that helps Canadian real estate agents generate AI-powered marketing flyers for property listings. Users can upload property photos and details, and our platform generates professional marketing materials using artificial intelligence technology (powered by Google Gemini).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">4. Account Registration</h2>
                    <p className="text-muted-foreground mb-4">
                        To use RealtorFlyer, you must create an account by providing accurate and complete information. You may register using email/password or through Google OAuth. You are responsible for:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Maintaining the confidentiality of your account credentials</li>
                        <li>All activities that occur under your account</li>
                        <li>Notifying us immediately of any unauthorized use of your account</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">5. Subscription Plans and Billing</h2>
                    <p className="text-muted-foreground mb-4">
                        RealtorFlyer offers subscription-based pricing with tiered plans (Starter, Pro, Agency). Each plan provides a set number of flyer generations per month.
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li><strong>Billing:</strong> Subscriptions are billed on a recurring monthly basis via Stripe. Your subscription will automatically renew unless cancelled before the next billing cycle.</li>
                        <li><strong>Payment:</strong> All payments are processed securely through Stripe. We do not store your credit card details on our servers.</li>
                        <li><strong>Price Changes:</strong> We reserve the right to modify pricing with 30 days advance notice. Price changes will take effect at the start of your next billing cycle.</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                        For information about refunds and cancellations, please see our{" "}
                        <a href="/refund" className="text-primary hover:underline">Refund Policy</a>.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">6. Intellectual Property Rights</h2>
                    <h3 className="text-lg font-medium text-brand-navy mt-6 mb-3">Your Content</h3>
                    <p className="text-muted-foreground mb-4">
                        You retain all ownership rights to the content you upload to RealtorFlyer, including property photos and listing details. You grant us a limited, non-exclusive license to use, store, and process your content solely for the purpose of providing our services to you.
                    </p>
                    <h3 className="text-lg font-medium text-brand-navy mt-6 mb-3">Generated Flyers</h3>
                    <p className="text-muted-foreground mb-4">
                        You own the rights to the flyers generated by our service. You may use, modify, distribute, and commercially exploit the generated flyers for your real estate marketing purposes without restriction.
                    </p>
                    <h3 className="text-lg font-medium text-brand-navy mt-6 mb-3">Our Platform</h3>
                    <p className="text-muted-foreground mb-4">
                        RealtorFlyer and its underlying technology, including but not limited to software, design, trademarks, and documentation, remain the exclusive property of RealtorFlyer. You may not copy, modify, distribute, or reverse engineer any part of our platform.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">7. Acceptable Use</h2>
                    <p className="text-muted-foreground mb-4">You agree not to:</p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Use the service for any unlawful purpose or in violation of any applicable laws</li>
                        <li>Upload content that infringes on third-party intellectual property rights</li>
                        <li>Upload content that is defamatory, obscene, or offensive</li>
                        <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                        <li>Use automated scripts or bots to access the service without our permission</li>
                        <li>Resell or redistribute our service without authorization</li>
                        <li>Interfere with or disrupt the integrity or performance of the service</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">8. AI-Generated Content Disclaimer</h2>
                    <p className="text-muted-foreground mb-4">
                        RealtorFlyer uses artificial intelligence to generate marketing materials. While we strive for accuracy and quality:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>AI-generated content may contain errors, inaccuracies, or unexpected results</li>
                        <li>You are responsible for reviewing and approving all generated content before use</li>
                        <li>We do not guarantee that generated flyers will be suitable for any particular purpose</li>
                        <li>You are responsible for ensuring generated content complies with real estate advertising regulations in your jurisdiction</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">9. Limitation of Liability</h2>
                    <p className="text-muted-foreground mb-4">
                        To the maximum extent permitted by law:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>RealtorFlyer is provided "as is" and "as available" without warranties of any kind, either express or implied</li>
                        <li>We do not warrant that the service will be uninterrupted, secure, or error-free</li>
                        <li>Our total liability to you for any claims arising from or related to these Terms or your use of the service shall not exceed the amount you paid us in the 12 months preceding the claim</li>
                        <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">10. Account Termination</h2>
                    <p className="text-muted-foreground mb-4">
                        <strong>By You:</strong> You may cancel your subscription and delete your account at any time through your account settings or by contacting us.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        <strong>By Us:</strong> We reserve the right to suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or for any other reason at our sole discretion with reasonable notice.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        Upon termination, your right to use the service will immediately cease. We may retain certain information as required by law or for legitimate business purposes.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">11. Privacy</h2>
                    <p className="text-muted-foreground mb-4">
                        Your use of RealtorFlyer is also governed by our{" "}
                        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, which describes how we collect, use, and protect your personal information in compliance with the Personal Information Protection and Electronic Documents Act (PIPEDA).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">12. Changes to Terms</h2>
                    <p className="text-muted-foreground mb-4">
                        We may update these Terms from time to time. We will notify you of any material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the service after such changes constitutes your acceptance of the new Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">13. Governing Law and Dispute Resolution</h2>
                    <p className="text-muted-foreground mb-4">
                        These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        Any disputes arising from these Terms or your use of RealtorFlyer shall be resolved through good faith negotiations. If a resolution cannot be reached, the dispute shall be submitted to the exclusive jurisdiction of the courts of Ontario, Canada.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">14. Severability</h2>
                    <p className="text-muted-foreground mb-4">
                        If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">15. Contact Information</h2>
                    <p className="text-muted-foreground mb-4">
                        If you have any questions about these Terms of Service, please contact us at:
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
