import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, RefreshCw, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadButton } from "@/components/projects/download-button";
import { RegenerateButton } from "@/components/projects/regenerate-button";

interface ProjectPageProps {
    params: { id: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        redirect("/login");
    }

    const project = await prisma.project.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            generatedImages: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!project || project.user.email !== user.email) {
        notFound();
    }

    const latestImage = project.generatedImages[0];

    // Get image source - prefer URL, fallback to Base64
    const imageSrc = latestImage?.url ||
        (latestImage?.imageData ? `data:${latestImage.mimeType};base64,${latestImage.imageData}` : null);

    return (
        <div className="container max-w-5xl mx-auto py-8 px-4">
            {/* Back Button */}
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Image Preview */}
                <div>
                    <Card>
                        <CardContent className="p-4">
                            {imageSrc ? (
                                <div className="relative">
                                    <img
                                        src={imageSrc}
                                        alt={project.name}
                                        className="w-full rounded-lg"
                                    />
                                    <Badge className="absolute top-2 right-2 bg-green-500">
                                        {project.status}
                                    </Badge>
                                </div>
                            ) : (
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                    <p className="text-muted-foreground">No image generated yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    {latestImage && (
                        <div className="flex gap-3 mt-4">
                            <DownloadButton
                                imageUrl={latestImage.url}
                                imageData={latestImage.imageData}
                                mimeType={latestImage.mimeType}
                                filename={`${project.listingType.toLowerCase().replace(" ", "-")}-flyer`}
                            />
                            <RegenerateButton projectId={project.id} />
                        </div>
                    )}
                </div>

                {/* Project Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        <p className="text-muted-foreground">Created {new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Listing Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type</span>
                                <Badge variant="outline">{project.listingType}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-semibold">${project.price}</span>
                            </div>
                            {project.originalPrice && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Original Price</span>
                                    <span className="line-through text-muted-foreground">${project.originalPrice}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bedrooms</span>
                                <span>{project.bedrooms}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bathrooms</span>
                                <span>{project.bathrooms}</span>
                            </div>
                            {project.squareFeet && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Square Feet</span>
                                    <span>{project.squareFeet.toLocaleString()}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Design Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Color Scheme</span>
                                <span className="capitalize">{project.colorScheme}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Style</span>
                                <span className="capitalize">{project.style}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Format</span>
                                <span>{project.aspectRatio}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {project.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Tagline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{project.description}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
