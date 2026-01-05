import { getRelatedPosts } from "@/lib/blog";
import { BlogCard } from "./blog-card";

interface RelatedPostsProps {
    currentSlug: string;
    category: string;
}

export async function RelatedPosts({ currentSlug, category }: RelatedPostsProps) {
    const posts = await getRelatedPosts(currentSlug, category);

    if (posts.length === 0) return null;

    return (
        <div className="mt-16 pt-12 border-t">
            <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                ))}
            </div>
        </div>
    );
}
