"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function LoadingBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Reset loading state when navigation completes
        setIsLoading(false);
        setProgress(0);
    }, [pathname, searchParams]);

    useEffect(() => {
        let progressInterval: NodeJS.Timeout;

        if (isLoading) {
            // Simulate progress
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + 10;
                });
            }, 100);
        }

        return () => {
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [isLoading]);

    // Listen for click events on links to start loading
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (link && link.href && !link.href.startsWith("#")) {
                const url = new URL(link.href, window.location.origin);
                // Only show loading for internal navigation
                if (url.origin === window.location.origin && url.pathname !== pathname) {
                    setIsLoading(true);
                    setProgress(20);
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [pathname]);

    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent overflow-hidden">
            <div
                className={cn(
                    "h-full bg-brand-gold transition-all duration-300 ease-out",
                    "shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                )}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
