"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Link {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    headings: Link[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0% 0% -80% 0%" }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="hidden lg:block space-y-4 sticky top-24">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                On this page
            </h4>
            <ul className="space-y-3 text-sm border-l pl-4">
                {headings.map((heading) => (
                    <li key={heading.id} className={cn(heading.level === 3 && "pl-4")}>
                        <a
                            href={`#${heading.id}`}
                            className={cn(
                                "block transition-colors hover:text-brand-navy",
                                activeId === heading.id
                                    ? "text-brand-navy font-bold border-l-2 border-brand-navy -ml-[18px] pl-[14px]"
                                    : "text-muted-foreground"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
