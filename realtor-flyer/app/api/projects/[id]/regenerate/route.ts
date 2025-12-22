import { prisma } from "@/lib/db";
import { generateFlyerImage, FlyerParams } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadGeneratedFlyer } from "@/lib/supabase-storage";

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

        // Get property images - these are now URLs (or legacy base64)
        // For Gemini, we need base64 data, so we need to fetch from URLs if they're storage URLs
        const propertyImages: string[] = [];
        for (const img of project.projectImages) {
            if (img.imageUrl.startsWith('data:')) {
                // Legacy base64 data
                propertyImages.push(img.imageUrl);
            } else if (img.imageUrl.startsWith('http')) {
                // Storage URL - fetch and convert to base64
                try {
                    const response = await fetch(img.imageUrl);
                    const buffer = await response.arrayBuffer();
                    const base64 = Buffer.from(buffer).toString('base64');
                    const mimeType = response.headers.get('content-type') || 'image/jpeg';
                    propertyImages.push(`data:${mimeType};base64,${base64}`);
                } catch (fetchError) {
                    console.error(`Failed to fetch image ${img.imageUrl}:`, fetchError);
                    // Skip this image
                }
            }
        }

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

        // Upload to Supabase Storage
        const generatedImageId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        let imageUrl: string;
        try {
            imageUrl = await uploadGeneratedFlyer(
                imageResult.base64,
                user.id,
                project.id,
                generatedImageId
            );
        } catch (uploadError) {
            console.error("Storage upload error:", uploadError);
            // Fallback: save base64 to database if storage fails
            const generatedImage = await prisma.generatedImage.create({
                data: {
                    userId: user.id,
                    projectId: project.id,
                    imageData: imageResult.base64,
                    mimeType: imageResult.mimeType,
                    prompt: JSON.stringify({
                        ...flyerParams,
                        propertyImages: undefined,
                        agentPortrait: undefined,
                    }),
                },
            });

            await prisma.user.update({
                where: { id: user.id },
                data: { creditsRemaining: { decrement: 1 } },
            });

            return NextResponse.json({
                success: true,
                imageId: generatedImage.id,
            });
        }

        // Save new image URL to database
        const generatedImage = await prisma.generatedImage.create({
            data: {
                userId: user.id,
                projectId: project.id,
                url: imageUrl,
                mimeType: imageResult.mimeType,
                prompt: JSON.stringify({
                    ...flyerParams,
                    propertyImages: undefined,
                    agentPortrait: undefined,
                }),
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

