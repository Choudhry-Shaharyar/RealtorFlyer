import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, FolderOpen, User, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { prisma } from "@/lib/db";
import { ProfileSetupModal } from "@/components/dashboard/profile-setup-modal";
import { NavLinks } from "@/components/dashboard/nav-links";
import { LoadingBar } from "@/components/dashboard/loading-bar";

// Force dynamic to prevent build-time execution
export const dynamic = 'force-dynamic';


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get user metadata
    const userExample = user.user_metadata;
    const userName = userExample?.full_name || userExample?.name || user.email?.split("@")[0] || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    // Fetch or create DB user (fallback for users who might be missing from database)
    const dbUser = await prisma.user.upsert({
        where: { email: user.email! },
        update: {},
        create: {
            email: user.email!,
            name: userName,
            creditsRemaining: 3,
            planType: 'free',
        },
        select: { name: true, phone: true, profilePhoto: true, companyName: true },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <LoadingBar />
            {dbUser && <ProfileSetupModal user={dbUser} />}

            {/* Top Navigation */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-brand-navy rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">RF</span>
                            </div>
                            <span className="font-semibold text-lg hidden sm:block">RealtorFlyer</span>
                        </Link>

                        {/* Nav Links */}
                        <NavLinks />

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={dbUser?.profilePhoto || userExample?.avatar_url || userExample?.picture || ""} alt={userName} />
                                        <AvatarFallback>
                                            {userInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{userName}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer">
                                        <Home className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/projects" className="cursor-pointer">
                                        <FolderOpen className="mr-2 h-4 w-4" />
                                        Projects
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/billing" className="cursor-pointer">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Billing
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <SignOutButton />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
