import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { BlogPost } from "@/lib/blog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                <div className="relative h-48 w-full overflow-hidden">
                    {post.featuredImage ? (
                        <Image
                            src={post.featuredImage}
                            alt={post.featuredImageAlt || post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-brand-navy hover:bg-brand-navy-light text-white">
                            {post.category}
                        </Badge>
                    </div>
                </div>
                <CardHeader className="pb-2">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-brand-navy transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.description}
                    </p>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-muted-foreground flex items-center gap-4 mt-auto">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min read
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
