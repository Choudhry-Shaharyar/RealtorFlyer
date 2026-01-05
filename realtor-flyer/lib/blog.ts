import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    author: string;
    category: string;
    tags: string[];
    featuredImage?: string;
    featuredImageAlt?: string;
    readingTime: number;
    content: string; // Raw MDX content
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export async function getBlogPosts(): Promise<BlogPost[]> {
    if (!fs.existsSync(BLOG_DIR)) {
        return [];
    }

    const files = fs.readdirSync(BLOG_DIR);

    const posts = files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const filePath = path.join(BLOG_DIR, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(fileContent);

            return {
                slug: data.slug || file.replace('.mdx', ''),
                title: data.title,
                description: data.description,
                publishedAt: data.publishedAt,
                updatedAt: data.updatedAt,
                author: data.author,
                category: data.category,
                tags: data.tags || [],
                featuredImage: data.featuredImage,
                featuredImageAlt: data.featuredImageAlt,
                readingTime: data.readingTime || 5,
                content: content,
            } as BlogPost;
        })
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    const posts = await getBlogPosts();
    return posts.find((post) => post.slug === slug) || null;
}

export async function getAllCategories(): Promise<string[]> {
    const posts = await getBlogPosts();
    const categories = new Set(posts.map((post) => post.category));
    return Array.from(categories);
}

export async function getRelatedPosts(currentSlug: string, category: string): Promise<BlogPost[]> {
    const posts = await getBlogPosts();
    return posts
        .filter((post) => post.category === category && post.slug !== currentSlug)
        .slice(0, 3);
}
