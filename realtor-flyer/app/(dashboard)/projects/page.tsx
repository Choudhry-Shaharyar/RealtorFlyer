import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectFilters } from "@/components/projects/project-filters";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { Suspense } from "react";

interface ProjectsPageProps {
    searchParams: { sort?: string };
}

// Helper to get order by clause based on sort parameter
function getOrderBy(sort: string | undefined) {
    switch (sort) {
        case "date-asc":
            return { createdAt: "asc" as const };
        case "address-asc":
            return { propertyAddress: "asc" as const };
        case "address-desc":
            return { propertyAddress: "desc" as const };
        case "date-desc":
        default:
            return { createdAt: "desc" as const };
    }
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const orderBy = getOrderBy(searchParams.sort);

    const projects = await prisma.project.findMany({
        where: {
            user: { email: user.email! },
        },
        orderBy,
        include: {
            generatedImages: {
                take: 1,
                orderBy: { createdAt: "desc" },
            },
        },
    });

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">My Projects</h1>
                    <p className="text-muted-foreground mt-1">Manage and view all your real estate flyers</p>
                </div>
                <Link href="/projects/new">
                    <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold">
                        <Plus className="mr-2 h-5 w-5" />
                        Create New Flyer
                    </Button>
                </Link>
            </div>

            {projects.length > 0 && (
                <div className="mb-6">
                    <Suspense fallback={<div className="h-10" />}>
                        <ProjectFilters />
                    </Suspense>
                </div>
            )}

            {projects.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Start creating amazing real estate flyers today.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => {
                        // Use address as the primary display title, fallback to project name
                        const displayTitle = project.propertyAddress || project.name;

                        return (
                            <Link key={project.id} href={`/projects/${project.id}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full group">
                                    <div className="aspect-square bg-muted relative overflow-hidden rounded-t-lg">
                                        {project.generatedImages[0] ? (
                                            <img
                                                src={`data:${project.generatedImages[0].mimeType};base64,${project.generatedImages[0].imageData}`}
                                                alt={displayTitle}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Image className="h-12 w-12 text-muted-foreground/50" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex items-center gap-2">
                                            <Badge
                                                variant={project.status === "completed" ? "default" : "secondary"}
                                            >
                                                {project.status}
                                            </Badge>
                                        </div>
                                        {/* Delete button - visible on hover */}
                                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DeleteProjectButton
                                                projectId={project.id}
                                                projectName={displayTitle}
                                            />
                                        </div>
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
    );
}
