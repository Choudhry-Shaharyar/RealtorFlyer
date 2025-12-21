import { prisma } from "@/lib/db";
import { generateFlyerImage, FlyerParams } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
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
            select: {
                id: true,
                creditsRemaining: true,
                name: true,
                phone: true,
                companyName: true,
                profilePhoto: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.creditsRemaining < 1) {
            return NextResponse.json(
                { error: "No credits remaining. Please upgrade your plan." },
                { status: 402 }
            );
        }

        const project = await prisma.project.findUnique({
            where: { id: params.id },
            include: {
                projectImages: {
                    orderBy: { uploadOrder: 'asc' },
                },
            },
        });

        if (!project || project.userId !== user.id) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Get property images as base64 array
        const propertyImages = project.projectImages.map(img => img.imageUrl);

        // Regenerate with same settings, including images
        const flyerParams: FlyerParams = {
            listingType: project.listingType as FlyerParams["listingType"],
            price: project.price || "0",
            originalPrice: project.originalPrice || undefined,
            bedrooms: project.bedrooms,
            bathrooms: project.bathrooms,
            squareFeet: project.squareFeet || undefined,
            description: project.description || undefined,
            propertyAddress: project.propertyAddress || undefined,
            agentName: project.agentName || user.name || "Agent",
            agentPhone: project.agentPhone || user.phone || "",
            agentCompany: project.agentCompany || user.companyName || undefined,
            agentPortrait: user.profilePhoto || undefined,
            propertyImages: propertyImages.length > 0 ? propertyImages : undefined,
            colorScheme: project.colorScheme as FlyerParams["colorScheme"],
            style: project.style as FlyerParams["style"],
            aspectRatio: project.aspectRatio as FlyerParams["aspectRatio"],
        };

        const imageResult = await generateFlyerImage(flyerParams);

        // Save new image
        const generatedImage = await prisma.generatedImage.create({
            data: {
                userId: user.id,
                projectId: project.id,
                imageData: imageResult.base64,
                mimeType: imageResult.mimeType,
                prompt: JSON.stringify(flyerParams),
            },
        });

        // Deduct credit
        await prisma.user.update({
            where: { id: user.id },
            data: { creditsRemaining: { decrement: 1 } },
        });

        return NextResponse.json({
            success: true,
            imageId: generatedImage.id,
        });
    } catch (error) {
        console.error("Regeneration error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to regenerate" },
            { status: 500 }
        );
    }
}
