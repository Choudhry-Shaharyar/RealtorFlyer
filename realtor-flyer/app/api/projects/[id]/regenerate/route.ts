import { prisma } from "@/lib/db";
import { generateFlyerImage, FlyerParams } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadGeneratedFlyer } from "@/lib/supabase-storage";

// Force dynamic to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
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
            where: { id },
            include: {
                projectImages: {
                    orderBy: { uploadOrder: "asc" },
                },
            },
        });

        if (!project || project.userId !== user.id) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Parse request body for edited parameters (optional)
        let body: any = {};
        try {
            const text = await request.text();
            if (text) {
                body = JSON.parse(text);
            }
        } catch {
            // No body provided, use project defaults
        }

        // Get existing property images from database if not in body
        const existingPropertyImages = project.projectImages.map(img => img.imageUrl);

        console.log(`Regenerate: Body has ${body.propertyImages?.length || 0} images`);
        console.log(`Regenerate: Database has ${existingPropertyImages.length} images`);

        // Build flyer parameters, preferring body values over project defaults
        const flyerParams: FlyerParams = {
            listingType: (body.listingType || project.listingType) as FlyerParams["listingType"],
            price: body.price || project.price || "0",
            originalPrice: body.originalPrice || project.originalPrice || undefined,
            bedrooms: body.bedrooms ? parseInt(body.bedrooms) : project.bedrooms,
            bathrooms: body.bathrooms ? parseFloat(body.bathrooms) : project.bathrooms,
            squareFeet: body.squareFeet ? parseInt(body.squareFeet.replace(/,/g, "")) : (project.squareFeet || undefined),
            description: body.description !== undefined ? body.description : (project.description || undefined),
            propertyAddress: body.propertyAddress !== undefined ? body.propertyAddress : (project.propertyAddress || undefined),
            agentName: body.agentName || project.agentName || user.name || "Agent",
            agentPhone: body.agentPhone || project.agentPhone || user.phone || "",
            agentCompany: body.agentCompany !== undefined ? body.agentCompany : (project.agentCompany || user.companyName || undefined),
            // Use body images if provided, otherwise use existing project images
            agentPortrait: body.agentPortrait || undefined,
            propertyImages: body.propertyImages && body.propertyImages.length > 0
                ? body.propertyImages
                : (existingPropertyImages.length > 0 ? existingPropertyImages : undefined),
            colorScheme: (body.colorScheme || project.colorScheme) as FlyerParams["colorScheme"],
            style: (body.style || project.style) as FlyerParams["style"],
            aspectRatio: (body.aspectRatio || project.aspectRatio) as FlyerParams["aspectRatio"],
        };

        console.log(`Regenerate: Passing ${flyerParams.propertyImages?.length || 0} images to Gemini`);

        // Update project with new values (if different)
        if (Object.keys(body).length > 0) {
            await prisma.project.update({
                where: { id },
                data: {
                    listingType: flyerParams.listingType,
                    price: flyerParams.price,
                    originalPrice: flyerParams.originalPrice,
                    bedrooms: flyerParams.bedrooms,
                    bathrooms: flyerParams.bathrooms,
                    squareFeet: flyerParams.squareFeet,
                    description: flyerParams.description,
                    propertyAddress: flyerParams.propertyAddress,
                    agentName: flyerParams.agentName,
                    agentPhone: flyerParams.agentPhone,
                    agentCompany: flyerParams.agentCompany,
                    colorScheme: flyerParams.colorScheme,
                    style: flyerParams.style,
                    aspectRatio: flyerParams.aspectRatio,
                },
            });
        }

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
                    prompt: JSON.stringify(flyerParams),
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

