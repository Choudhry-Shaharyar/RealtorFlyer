"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

interface NavLink {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const navLinks: NavLink[] = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { href: "/projects", label: "Projects", icon: <FolderOpen className="h-4 w-4" /> },
    { href: "/billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
];

export function NavLinks() {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loadingHref, setLoadingHref] = useState<string | null>(null);

    // Reset loading state when pathname changes
    useEffect(() => {
        setLoadingHref(null);
    }, [pathname]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Don't show loading if already on this page
        if (pathname === href || (href !== "/dashboard" && pathname.startsWith(href))) {
            return;
        }

        e.preventDefault();
        setLoadingHref(href);

        startTransition(() => {
            router.push(href);
        });
    };

    return (
        <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
                const isActive = pathname === link.href ||
                    (link.href !== "/dashboard" && pathname.startsWith(link.href));
                const isLoading = loadingHref === link.href;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => handleClick(e, link.href)}
                        className={cn(
                            "relative text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2",
                            isActive
                                ? "text-brand-navy bg-brand-gold/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                            isLoading && "opacity-70 pointer-events-none"
                        )}
                    >
                        <span className={cn(
                            "transition-colors duration-200",
                            isActive ? "text-brand-gold" : ""
                        )}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                link.icon
                            )}
                        </span>
                        {link.label}
                        {/* Active indicator bar */}
                        {isActive && (
                            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-gold rounded-full" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

