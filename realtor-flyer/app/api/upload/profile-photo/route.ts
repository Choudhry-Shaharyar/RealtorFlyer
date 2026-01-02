import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/lib/db";
import sharp from "sharp";

const BUCKET_NAME = "realtor-flyer-assets";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 800;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user?.email) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Get user's database ID
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true },
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Parse multipart form data
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: JPG, PNG, WebP" },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process image with sharp - resize and compress
        const processedImage = await sharp(buffer)
            .resize(MAX_DIMENSION, MAX_DIMENSION, {
                fit: "inside",
                withoutEnlargement: true,
            })
            .jpeg({ quality: 80 })
            .toBuffer();

        // Upload to Supabase Storage
        const adminClient = createAdminClient();
        const fileName = `profile.jpg`;
        const filePath = `profiles/${dbUser.id}/${fileName}`;

        const { data, error: uploadError } = await adminClient.storage
            .from(BUCKET_NAME)
            .upload(filePath, processedImage, {
                contentType: "image/jpeg",
                cacheControl: "3600",
                upsert: true, // Overwrite existing profile photo
            });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload image" },
                { status: 500 }
            );
        }

        // Get public URL with cache busting
        const { data: urlData } = adminClient.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error("Profile photo upload error:", error);
        return NextResponse.json(
            { error: "Failed to process upload" },
            { status: 500 }
        );
    }
}
