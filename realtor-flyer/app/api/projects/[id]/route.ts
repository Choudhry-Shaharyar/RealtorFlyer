import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET_NAME = "realtor-flyer-assets";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: authUser.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find the project and verify ownership, including related images
        const project = await prisma.project.findUnique({
            where: { id: params.id },
            select: {
                userId: true,
                generatedImages: { select: { id: true, url: true } },
                projectImages: { select: { id: true, imageUrl: true } },
            },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (project.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Delete files from Supabase Storage (use admin client to bypass RLS)
        const adminSupabase = createAdminClient();
        const filesToDelete: string[] = [];

        // Collect generated image paths
        for (const img of project.generatedImages) {
            if (img.url) {
                // Extract path from URL: .../storage/v1/object/public/bucket/path
                const match = img.url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
                if (match) filesToDelete.push(match[1]);
            }
        }

        // Collect project image paths
        for (const img of project.projectImages) {
            if (img.imageUrl && img.imageUrl.includes('/storage/')) {
                const match = img.imageUrl.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
                if (match) filesToDelete.push(match[1]);
            }
        }

        // Delete storage files in parallel (don't block on errors)
        if (filesToDelete.length > 0) {
            try {
                await adminSupabase.storage
                    .from(BUCKET_NAME)
                    .remove(filesToDelete);
            } catch (storageError) {
                console.warn("Storage cleanup error (continuing with delete):", storageError);
            }
        }

        // Delete the project (cascade will handle related database records)
        await prisma.project.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete project error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to delete project" },
            { status: 500 }
        );
    }
}

