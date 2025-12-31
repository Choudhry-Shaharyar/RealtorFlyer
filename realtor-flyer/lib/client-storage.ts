import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "realtor-flyer-assets";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Validates a base64 string or file size/type
 */
function validateImage(base64Data: string): { blob: Blob; mimeType: string; extension: string } {
    // 1. Check if it's a data URL
    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
        throw new Error("Invalid image format. Must be a base64 data URL.");
    }

    const mimeType = matches[1];
    const base64 = matches[2];

    // 2. Validate Type
    if (!ALLOWED_TYPES.includes(mimeType)) {
        throw new Error(`Invalid file type: ${mimeType}. Only JPEG, PNG, and WebP are allowed.`);
    }

    // 3. Convert to Blob to check size
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // 4. Validate Size
    if (blob.size > MAX_FILE_SIZE) {
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        throw new Error(`File too large: ${sizeMB}MB. Maximum allowed is 5MB.`);
    }

    const extension = mimeType.split("/")[1];

    return { blob, mimeType, extension };
}

/**
 * Uploads a base64 image to Supabase Storage from the client side
 * @param base64Data The full base64 string (data:image/...)
 * @param userId The current user's ID
 * @returns The public URL of the uploaded image
 */
export async function uploadBase64Image(base64Data: string, userId: string): Promise<string> {
    try {
        const { blob, mimeType, extension } = validateImage(base64Data);

        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const filename = `${timestamp}_${random}.${extension}`;

        // Path: uploads/{userId}/{filename}
        // distinct from 'projects' or 'profiles' folders to indicate temporary/direct uploads
        const path = `uploads/${userId}/${filename}`;

        const supabase = createClient();

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(path, blob, {
                contentType: mimeType,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Supabase storage upload error:", error);
            throw new Error(`Upload failed: ${error.message}`);
        }

        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return urlData.publicUrl;

    } catch (error) {
        console.error("Client upload error:", error);
        throw error;
    }
}
