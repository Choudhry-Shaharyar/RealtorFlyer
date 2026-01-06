import { prisma } from "@/lib/db";
import { generateFlyerImage, FlyerParams } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadGeneratedFlyer, uploadProjectImage } from "@/lib/supabase-storage";

// Force dynamic to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        // 1. Authenticate
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Get user and check credits
        const user = await prisma.user.findUnique({
            where: { email: authUser.email },
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

        // 3. Parse request body
        const body = await request.json();
        const {
            listingType,
            price,
            originalPrice,
            soldPrice, // Optional: sold price for SOLD listings
            soldOverAsking, // Optional: boolean for "Sold Over Asking" badge
            openHouseDate, // Optional: formatted date for OPEN HOUSE
            openHouseTime, // Optional: formatted time for OPEN HOUSE
            bedrooms,
            bathrooms,
            squareFeet,
            description,
            agentName,
            agentPhone,
            agentCompany,
            agentPortrait, // Optional: base64 string
            propertyImages, // Optional: array of base64 strings
            colorScheme,
            style,
            aspectRatio,
        } = body;

        // 4. Validate required fields (only listing type and agent info required)
        if (!listingType || !agentName || !agentPhone) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 5. Create project
        const project = await prisma.project.create({
            data: {
                userId: user.id,
                name: `${listingType}${price ? ` - $${price}` : ""}`,
                listingType,
                price: price || null,
                originalPrice: originalPrice || null,
                bedrooms: bedrooms ? parseInt(bedrooms) : 0,
                bathrooms: bathrooms ? parseFloat(bathrooms) : 0,
                squareFeet: squareFeet ? parseInt(squareFeet.replace(/,/g, "")) : null,
                description: description || null,
                propertyAddress: body.propertyAddress || null,
                agentName,
                agentPhone,
                agentCompany,
                colorScheme,
                style,
                aspectRatio,
                status: "generating",
            },
        });

        // 6. Save property images to Supabase Storage and database
        if (propertyImages && Array.isArray(propertyImages) && propertyImages.length > 0) {
            await Promise.all(
                propertyImages.map(async (imgData: string, index: number) => {
                    // Generate a unique ID for the image
                    const imageId = `${Date.now()}_${index}_${Math.random().toString(36).substring(2, 8)}`;

                    // Upload to Supabase Storage
                    const imageUrl = await uploadProjectImage(imgData, project.id, imageId);

                    // Save URL to database (not base64)
                    await prisma.projectImage.create({
                        data: {
                            projectId: project.id,
                            imageUrl: imageUrl,
                            uploadOrder: index,
                        }
                    });
                })
            );
        }

        // 7. Generate image with Gemini
        const flyerParams: FlyerParams = {
            listingType: listingType as FlyerParams["listingType"],
            price: price || undefined,
            originalPrice: originalPrice || undefined,
            soldPrice: soldPrice || undefined,
            soldOverAsking: soldOverAsking || false,
            openHouseDate: openHouseDate || undefined,
            openHouseTime: openHouseTime || undefined,
            bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
            bathrooms: bathrooms ? parseFloat(bathrooms) : undefined,
            squareFeet: squareFeet ? parseInt(squareFeet.replace(/,/g, "")) : undefined,
            description: description || undefined,
            propertyAddress: body.propertyAddress,
            agentName,
            agentPhone,
            agentCompany: agentCompany || undefined,
            agentPortrait: agentPortrait || undefined,
            propertyImages: propertyImages || undefined, // Still pass base64 to Gemini for processing
            colorScheme: colorScheme as FlyerParams["colorScheme"],
            customHex: body.customHex,
            style: style as FlyerParams["style"],
            aspectRatio: aspectRatio as FlyerParams["aspectRatio"],
        };

        let imageResult;
        try {
            imageResult = await generateFlyerImage(flyerParams);
        } catch (genError) {
            // Update project status to failed
            await prisma.project.update({
                where: { id: project.id },
                data: { status: "failed" },
            });
            console.error("Gemini Generation Error", genError);
            throw new Error("Failed to generate image with AI");
        }

        // 8. Generate unique image ID and upload to Supabase Storage
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
                        propertyImages: undefined, // Don't store base64 in prompt
                        agentPortrait: undefined,
                    }),
                },
            });

            await prisma.$transaction([
                prisma.project.update({
                    where: { id: project.id },
                    data: { status: "completed" },
                }),
                prisma.user.update({
                    where: { id: user.id },
                    data: { creditsRemaining: { decrement: 1 } },
                }),
            ]);

            return NextResponse.json({
                success: true,
                projectId: project.id,
                imageId: generatedImage.id,
            });
        }

        // 9. Save generated image URL to database (no base64)
        const generatedImage = await prisma.generatedImage.create({
            data: {
                userId: user.id,
                projectId: project.id,
                url: imageUrl,
                mimeType: imageResult.mimeType,
                prompt: JSON.stringify({
                    ...flyerParams,
                    propertyImages: undefined, // Don't store base64 in prompt
                    agentPortrait: undefined,
                }),
            },
        });

        // 10. Update project status and deduct credit
        await prisma.$transaction([
            prisma.project.update({
                where: { id: project.id },
                data: { status: "completed" },
            }),
            prisma.user.update({
                where: { id: user.id },
                data: { creditsRemaining: { decrement: 1 } },
            }),
        ]);

        return NextResponse.json({
            success: true,
            projectId: project.id,
            imageId: generatedImage.id,
        });
    } catch (error) {
        console.error("Generation error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate flyer" },
            { status: 500 }
        );
    }
}

