"use client";

import { useState } from "react";
import { BlogPost } from "@/lib/blog";
import { BlogCard } from "./blog-card";
import { Button } from "@/components/ui/button";

interface BlogListProps {
    posts: BlogPost[];
    categories: string[];
}

export function BlogList({ posts, categories }: BlogListProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const filteredPosts = selectedCategory === "All"
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    return (
        <div className="space-y-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center pb-8 border-b">
                <Button
                    variant={selectedCategory === "All" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("All")}
                    className={selectedCategory === "All" ? "bg-brand-navy text-white" : ""}
                >
                    All Posts
                </Button>
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? "bg-brand-navy text-white" : ""}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-xl text-muted-foreground">No posts found in this category.</p>
                </div>
            )}
        </div>
    );
}
