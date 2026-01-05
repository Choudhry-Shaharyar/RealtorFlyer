"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://realtorflyer.ca"}/blog/${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Share</span>
            <div className="flex flex-row md:flex-col gap-2">
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-500 hover:text-white transition-colors">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Share on Twitter</span>
                    </Button>
                </a>
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">Share on LinkedIn</span>
                    </Button>
                </a>
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-500 hover:text-white transition-colors">
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Share on Facebook</span>
                    </Button>
                </a>
                <Button variant="outline" size="icon" className="rounded-full" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                    <span className="sr-only">Copy Link</span>
                </Button>
            </div>
        </div>
    );
}
