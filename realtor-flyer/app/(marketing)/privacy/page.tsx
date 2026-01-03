import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Privacy Policy for RealtorFlyer - How we collect, use, and protect your personal information",
}

export default function PrivacyPage() {
    return (
        <div className="container max-w-4xl py-12 md:py-16">
            <article className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold text-brand-navy mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last Updated: January 2, 2026</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">1. Introduction</h2>
                    <p className="text-muted-foreground mb-4">
                        RealtorFlyer ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website at{" "}
                        <a href="https://realtorflyer.ca" className="text-primary hover:underline">https://realtorflyer.ca</a>{" "}
                        and our AI-powered flyer generation services.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        We comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) and Canada's Anti-Spam Legislation (CASL). By using our services, you consent to the collection and use of your information as described in this policy.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">2. Information We Collect</h2>

                    <h3 className="text-lg font-medium text-brand-navy mt-6 mb-3">Account Information</h3>
                    <p className="text-muted-foreground mb-4">When you create an account, we collect:</p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Name and email address (via email/password signup or Google OAuth)</li>
                        <li>Phone number (optional, for flyer contact information)</li>
                        <li>Profile photo (optional)</li>
                        <li>Company/brokerage name (optional)</li>
                    </ul>

                    <h3 className="text-lg font-medium text-brand-navy mt-6 mb-3">Payment Information</h3>
                    <p className="text-muted-foreground mb-4">
                        Payment processing is handled by Stripe. We do not store your credit card numbers or banking details on our servers. Stripe may collect and store payment information in accordance with their{" "}
                        <a href="https://stripe.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                    </p>

                    <h3 className="text-lg font-medium text-brand-navy mt-6 mb-3">Content You Provide</h3>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Property photos you upload</li>
                        <li>Property listing details (address, price, features, etc.)</li>
                        <li>Generated flyer outputs</li>
                    </ul>

                    <h3 className="text-lg font-medium text-brand-navy mt-6 mb-3">Automatically Collected Information</h3>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Usage analytics (pages visited, features used, time spent)</li>
                        <li>Device information (browser type, operating system)</li>
                        <li>IP address and approximate location</li>
                        <li>Cookies and similar tracking technologies</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">3. How We Use Your Information</h2>
                    <p className="text-muted-foreground mb-4">We use your information to:</p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Provide and maintain our flyer generation service</li>
                        <li>Process your subscription payments</li>
                        <li>Send transactional emails (account confirmations, password resets, billing notices)</li>
                        <li>Provide customer support</li>
                        <li>Improve our services and develop new features</li>
                        <li>Detect and prevent fraud or abuse</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">4. Third-Party Services</h2>
                    <p className="text-muted-foreground mb-4">We use the following third-party services to operate RealtorFlyer:</p>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-border rounded-lg mb-4">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-brand-navy border-b">Service</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-brand-navy border-b">Purpose</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-brand-navy border-b">Data Shared</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-muted-foreground">
                                <tr className="border-b">
                                    <td className="px-4 py-2">Supabase</td>
                                    <td className="px-4 py-2">Authentication & database</td>
                                    <td className="px-4 py-2">Account info, uploaded content</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2">Stripe</td>
                                    <td className="px-4 py-2">Payment processing</td>
                                    <td className="px-4 py-2">Email, payment details</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2">Google Gemini API</td>
                                    <td className="px-4 py-2">AI content generation</td>
                                    <td className="px-4 py-2">Property photos, listing details</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2">Vercel</td>
                                    <td className="px-4 py-2">Website hosting</td>
                                    <td className="px-4 py-2">Analytics, server logs</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2">Resend</td>
                                    <td className="px-4 py-2">Transactional emails</td>
                                    <td className="px-4 py-2">Email address, message content</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Cloudflare</td>
                                    <td className="px-4 py-2">DNS & security</td>
                                    <td className="px-4 py-2">IP address, traffic data</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Each third-party service has its own privacy policy governing how they handle your data.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">5. Data Retention</h2>
                    <p className="text-muted-foreground mb-4">We retain your personal information for as long as:</p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Your account remains active</li>
                        <li>Necessary to provide our services</li>
                        <li>Required by law (e.g., financial records)</li>
                        <li>Needed to resolve disputes or enforce our agreements</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                        When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">6. Your Rights Under PIPEDA</h2>
                    <p className="text-muted-foreground mb-4">Under Canadian privacy law, you have the right to:</p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                        <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                        <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal exceptions)</li>
                        <li><strong>Withdraw Consent:</strong> Withdraw your consent to our processing of your information</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                        To exercise these rights, please contact us at{" "}
                        <a href="mailto:support@realtorflyer.ca" className="text-primary hover:underline">support@realtorflyer.ca</a>.
                        We will respond to your request within 30 days.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">7. Cookies and Tracking</h2>
                    <p className="text-muted-foreground mb-4">We use cookies and similar technologies to:</p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Keep you logged in to your account</li>
                        <li>Remember your preferences</li>
                        <li>Analyze how our service is used</li>
                        <li>Improve our service performance</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                        You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">8. Email Communications (CASL Compliance)</h2>
                    <p className="text-muted-foreground mb-4">
                        In compliance with Canada's Anti-Spam Legislation (CASL):
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li><strong>Transactional Emails:</strong> We will send you emails necessary for the operation of your account (confirmations, password resets, billing notices) without requiring additional consent.</li>
                        <li><strong>Marketing Emails:</strong> We will only send promotional or marketing emails if you have explicitly opted in. You can unsubscribe at any time using the link in any email.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">9. Data Security</h2>
                    <p className="text-muted-foreground mb-4">
                        We implement appropriate technical and organizational measures to protect your personal information, including:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                        <li>Encryption of data in transit (HTTPS)</li>
                        <li>Secure authentication protocols</li>
                        <li>Regular security assessments</li>
                        <li>Access controls limiting who can access your data</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                        However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">10. Children's Privacy</h2>
                    <p className="text-muted-foreground mb-4">
                        RealtorFlyer is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will delete it promptly.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">11. International Data Transfers</h2>
                    <p className="text-muted-foreground mb-4">
                        Your information may be processed and stored in countries other than Canada, including the United States (where some of our service providers are located). These countries may have different data protection laws. By using our service, you consent to the transfer of your information to these countries.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">12. Changes to This Policy</h2>
                    <p className="text-muted-foreground mb-4">
                        We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and updating the "Last Updated" date. We encourage you to review this policy periodically.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-brand-navy mt-8 mb-4">13. Contact Us</h2>
                    <p className="text-muted-foreground mb-4">
                        If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
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
                    <p className="text-muted-foreground mb-4">
                        For privacy complaints, you may also contact the Office of the Privacy Commissioner of Canada at{" "}
                        <a href="https://www.priv.gc.ca" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.priv.gc.ca</a>.
                    </p>
                </section>
            </article>
        </div>
    )
}
