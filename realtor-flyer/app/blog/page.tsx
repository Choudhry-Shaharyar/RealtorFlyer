import { Metadata } from "next";
import { getBlogPosts, getAllCategories } from "@/lib/blog";
import { BlogList } from "@/components/blog/blog-list";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";

export const metadata: Metadata = {
    title: "Real Estate Marketing Blog | RealtorFlyer",
    description: "Tips, guides, and ideas for Canadian real estate agents to create stunning marketing flyers and grow their business. Learn about just listed flyers, open house marketing, and AI tools.",
    openGraph: {
        title: "Real Estate Marketing Blog - RealtorFlyer",
        description: "Expert tips and templates for Canadian real estate marketing.",
        type: "website",
        url: "https://realtorflyer.ca/blog",
        siteName: "RealtorFlyer",
    }
};

export default async function BlogPage() {
    const posts = await getBlogPosts();
    const categories = await getAllCategories();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-brand-navy text-white py-20 px-4 text-center">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Real Estate Marketing <span className="text-brand-gold">Insights</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Actionable tips, design ideas, and industry news to help you sell more homes using AI-powered marketing.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <BlogList posts={posts} categories={categories} />
                <NewsletterSignup />
            </div>
        </div>
    );
}
