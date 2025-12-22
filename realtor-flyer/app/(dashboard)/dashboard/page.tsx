import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Image, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: authUser.email },
        include: {
            projects: {
                orderBy: { createdAt: "desc" },
                take: 6,
                include: {
                    generatedImages: {
                        take: 1,
                        orderBy: { createdAt: "desc" },
                    },
                },
            },
            _count: {
                select: { generatedImages: true, projects: true },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    const isNewUser = user._count.projects === 0 && user._count.generatedImages === 0;

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Welcome Hero for New Users */}
            {isNewUser ? (
                <div className="mb-10">
                    <Card className="bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy-light text-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(245,158,11,0.15),transparent_50%)]" />
                        <CardContent className="py-12 px-8 relative z-10">
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-brand-gold/20 rounded-xl">
                                        <Sparkles className="h-8 w-8 text-brand-gold" />
                                    </div>
                                    <Badge className="bg-brand-gold/20 text-brand-gold border-brand-gold/30 hover:bg-brand-gold/30">
                                        Welcome, {user.name?.split(" ")[0]}!
                                    </Badge>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                                    Create Your First Flyer
                                </h1>
                                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                                    Generate professional real estate marketing flyers in seconds.
                                    Upload your listing photos, customize the style, and let AI do the rest.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/projects/new">
                                        <Button size="lg" className="bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold px-8 h-12 shadow-lg shadow-brand-gold/25">
                                            <Plus className="mr-2 h-5 w-5" />
                                            Create Your First Flyer
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                /* Header for Returning Users */
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, {user.name?.split(" ")[0]}!</h1>
                        <p className="text-muted-foreground mt-1">Create stunning real estate flyers in seconds</p>
                    </div>
                    <Link href="/projects/new">
                        <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold">
                            <Plus className="mr-2 h-5 w-5" />
                            Create New Flyer
                        </Button>
                    </Link>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Credits Remaining
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{user.creditsRemaining}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {user.planType === "free" ? (
                                <Link href="/billing" className="text-brand-gold hover:underline">
                                    Upgrade for more →
                                </Link>
                            ) : (
                                `${user.planType} plan`
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Flyers Created
                        </CardTitle>
                        <Image className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{user._count.generatedImages}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Across {user._count.projects} projects
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Plan
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold capitalize">{user.planType}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {user.planType === "free" ? "3 flyers/month" : "Unlimited potential"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Projects */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Projects</h2>
                    {user.projects.length > 0 && (
                        <Link href="/projects" className="text-sm text-brand-gold hover:underline">
                            View all →
                        </Link>
                    )}
                </div>

                {user.projects.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Image className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Create your first real estate flyer in under 60 seconds
                            </p>
                            <Link href="/projects/new">
                                <Button className="bg-brand-gold hover:bg-brand-gold/90 text-black">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Flyer
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.projects.map((project) => {
                            // Use address as the primary display title, fallback to project name
                            const displayTitle = project.propertyAddress || project.name;

                            return (
                                <Link key={project.id} href={`/projects/${project.id}`}>
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                        <div className="aspect-square bg-muted relative overflow-hidden rounded-t-lg">
                                            {project.generatedImages[0] ? (
                                                <img
                                                    src={
                                                        project.generatedImages[0].url ||
                                                        (project.generatedImages[0].imageData
                                                            ? `data:${project.generatedImages[0].mimeType};base64,${project.generatedImages[0].imageData}`
                                                            : undefined)
                                                    }
                                                    alt={displayTitle}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Image className="h-12 w-12 text-muted-foreground/50" />
                                                </div>
                                            )}
                                            <Badge
                                                className="absolute top-2 right-2"
                                                variant={project.status === "completed" ? "default" : "secondary"}
                                            >
                                                {project.status}
                                            </Badge>
                                        </div>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base truncate">{displayTitle}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {project.listingType} • ${project.price}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick Tips */}
            {user._count.generatedImages < 3 && (
                <Card className="bg-brand-navy text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-brand-gold" />
                            Pro Tips for Better Flyers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li>✓ Use specific property details for more accurate results</li>
                            <li>✓ Try different color schemes to match your brand</li>
                            <li>✓ The "luxury" style works great for high-end listings</li>
                            <li>✓ Add a compelling tagline to grab attention</li>
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
