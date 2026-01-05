import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

import { BlogPost, getBlogPosts } from "@/lib/blog";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareButtons } from "@/components/blog/share-buttons";
import { RelatedPosts } from "@/components/blog/related-posts";
import { CallToAction } from "@/components/blog/call-to-action";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { Badge } from "@/components/ui/badge";

// Custom components available in MDX
const components = {
    CallToAction,
    Image: (props: any) => <Image {...props} />,
    a: (props: any) => <Link {...props} className="text-brand-navy underline hover:text-brand-gold" />,
    // Add IDs to headers are handled by rehype-slug, but we can style them here
    h2: (props: any) => <h2 {...props} className="text-3xl font-bold mt-12 mb-6 text-brand-navy scroll-mt-24" />,
    h3: (props: any) => <h3 {...props} className="text-2xl font-semibold mt-8 mb-4 text-brand-navy scroll-mt-24" />,
    p: (props: any) => <p {...props} className="mb-6 leading-relaxed text-lg text-slate-700" />,
    ul: (props: any) => <ul {...props} className="list-disc pl-6 mb-6 space-y-2 text-lg text-slate-700" />,
    ol: (props: any) => <ol {...props} className="list-decimal pl-6 mb-6 space-y-2 text-lg text-slate-700" />,
    li: (props: any) => <li {...props} className="pl-2" />,
    blockquote: (props: any) => <blockquote {...props} className="border-l-4 border-brand-gold pl-4 italic my-6 text-xl text-slate-600 bg-gray-50 py-2 rounded-r-lg" />,
    // Table components for markdown tables
    table: (props: any) => <div className="overflow-x-auto my-8"><table {...props} className="w-full border-collapse border border-slate-300 rounded-lg text-left" /></div>,
    thead: (props: any) => <thead {...props} className="bg-brand-navy text-white" />,
    tbody: (props: any) => <tbody {...props} className="divide-y divide-slate-200" />,
    tr: (props: any) => <tr {...props} className="hover:bg-slate-50 transition-colors" />,
    th: (props: any) => <th {...props} className="px-4 py-3 font-semibold text-sm uppercase tracking-wide" />,
    td: (props: any) => <td {...props} className="px-4 py-3 text-slate-700" />,
};


interface PageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
    const post = await getPostContent(params.slug);
    if (!post) return {};

    return {
        title: post.meta.title,
        description: post.meta.description,
        openGraph: {
            title: post.meta.title,
            description: post.meta.description,
            type: "article",
            publishedTime: post.meta.publishedAt,
            authors: [post.meta.author],
            images: post.meta.featuredImage ? [{ url: post.meta.featuredImage }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.meta.title,
            description: post.meta.description,
            images: post.meta.featuredImage ? [post.meta.featuredImage] : [],
        },
    };
}

// Generate static params for all posts
export async function generateStaticParams() {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

async function getPostContent(slug: string) {
    const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const source = fs.readFileSync(filePath, "utf-8");

    const { content, frontmatter } = await compileMDX<{ title: string; description: string; publishedAt: string; author: string; category: string; featuredImage: string; readingTime: number; tags: string[] }>({
        source,
        components,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm], // Enable GFM tables, strikethrough, etc.
                rehypePlugins: [rehypeSlug], // Add IDs to headers
            },
        },
    });


    return { content, meta: frontmatter, raw: source };
}

// Extract headings for TOC
function getHeadings(source: string) {
    const headingLines = source.split("\n").filter((line) => line.match(/^#{2,3}\s/));
    return headingLines.map((raw) => {
        const text = raw.replace(/^#{2,3}\s/, "");
        const level = raw.startsWith("###") ? 3 : 2;
        // Simple slugify for ID matching (rehype-slug uses github-slugger, ideally we match that logic)
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        return { text, id, level };
    });
}

export default async function BlogPostPage({ params }: PageProps) {
    const post = await getPostContent(params.slug);

    if (!post) {
        notFound();
    }

    const headings = getHeadings(post.raw);

    return (
        <article className="min-h-screen bg-white pb-20">
            {/* Progress Bar (Client side implementation omitted for MVP simplicity, can add later) */}

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-brand-navy mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                </Link>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Left Sidebar - Desktop only */}
                    <aside className="hidden xl:block xl:col-span-2">
                        <div className="sticky top-24 space-y-8">
                            <ShareButtons title={post.meta.title} slug={params.slug} />
                            <TableOfContents headings={headings} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="xl:col-span-8 space-y-8">
                        {/* Header */}
                        <div className="space-y-6 text-center lg:text-left">
                            <Badge className="bg-brand-navy hover:bg-brand-navy-light text-white mb-4">
                                {post.meta.category}
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight">
                                {post.meta.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden relative">
                                        {/* Avatar placeholder */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-brand-gold text-brand-navy font-bold text-xs">
                                            {post.meta.author.charAt(0)}
                                        </div>
                                    </div>
                                    <span className="font-medium text-slate-900">{post.meta.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(post.meta.publishedAt), "MMMM d, yyyy")}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {post.meta.readingTime} min read
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {post.meta.featuredImage && (
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg my-8">
                                <Image
                                    src={post.meta.featuredImage}
                                    alt={post.meta.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />
                            </div>
                        )}

                        {/* Mobile Share (Top) */}
                        <div className="xl:hidden">
                            <ShareButtons title={post.meta.title} slug={params.slug} />
                        </div>

                        {/* MDX Content */}
                        <div className="prose prose-lg max-w-none prose-headings:text-brand-navy prose-a:text-brand-navy prose-strong:text-brand-navy">
                            {post.content}
                        </div>

                        {/* Newsletter Signup */}
                        <NewsletterSignup />

                        {/* Related Posts */}
                        <RelatedPosts currentSlug={params.slug} category={post.meta.category} />
                    </div>

                    {/* Right Sidebar - Empty for now, can be used for ads or related content */}
                    <aside className="hidden xl:block xl:col-span-2">
                        {/* Reserved for future use */}
                    </aside>
                </div>
            </div>
        </article>
    );
}
