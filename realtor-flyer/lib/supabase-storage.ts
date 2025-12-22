import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET_NAME = "realtor-flyer-assets";

/**
 * Extract mime type and extension from a base64 data URL
 */
function parseBase64DataUrl(dataUrl: string): {
    base64: string;
    mimeType: string;
    extension: string
} {
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

    if (matches) {
        const mimeType = matches[1];
        const extension = mimeType.split("/")[1] || "png";
        return {
            base64: matches[2],
            mimeType,
            extension
        };
    }

    // If no header, assume it's raw base64 PNG
    return {
        base64: dataUrl,
        mimeType: "image/png",
        extension: "png"
    };
}

/**
 * Convert base64 string to Buffer
 */
function base64ToBuffer(base64: string): Buffer {
    return Buffer.from(base64, "base64");
}

/**
 * Generate a unique filename with timestamp
 */
function generateFilename(prefix: string, extension: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}.${extension}`;
}

/**
 * Upload a base64 image to Supabase Storage
 * @param base64Data - Base64 string (with or without data URL prefix)
 * @param folderPath - Path within the bucket (e.g., "generated/userId/projectId")
 * @param filename - Optional custom filename (auto-generated if not provided)
 * @returns Public URL of the uploaded image
 */
export async function uploadBase64Image(
    base64Data: string,
    folderPath: string,
    filename?: string
): Promise<string> {
    const supabase = createAdminClient();

    const { base64, mimeType, extension } = parseBase64DataUrl(base64Data);
    const buffer = base64ToBuffer(base64);

    const finalFilename = filename || generateFilename("img", extension);
    const fullPath = `${folderPath}/${finalFilename}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fullPath, buffer, {
            contentType: mimeType,
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error("Storage upload error:", error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Upload a Buffer directly to Supabase Storage
 * @param buffer - Image buffer
 * @param folderPath - Path within the bucket
 * @param mimeType - MIME type of the image
 * @param filename - Optional custom filename
 * @returns Public URL of the uploaded image
 */
export async function uploadBufferImage(
    buffer: Buffer,
    folderPath: string,
    mimeType: string,
    filename?: string
): Promise<string> {
    const supabase = createAdminClient();

    const extension = mimeType.split("/")[1] || "png";
    const finalFilename = filename || generateFilename("img", extension);
    const fullPath = `${folderPath}/${finalFilename}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fullPath, buffer, {
            contentType: mimeType,
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error("Storage upload error:", error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param path - Full path within the bucket
 */
export async function deleteImage(path: string): Promise<void> {
    const supabase = createAdminClient();

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

    if (error) {
        console.error("Storage delete error:", error);
        throw new Error(`Failed to delete image: ${error.message}`);
    }
}

/**
 * Get the public URL for an image path
 * @param path - Full path within the bucket
 * @returns Public URL
 */
export function getPublicUrl(path: string): string {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}

/**
 * Extract the storage path from a public URL
 * @param url - Full public URL
 * @returns Path within the bucket
 */
export function extractPathFromUrl(url: string): string | null {
    const pattern = new RegExp(`/storage/v1/object/public/${BUCKET_NAME}/(.+)$`);
    const match = url.match(pattern);
    return match ? match[1] : null;
}

/**
 * Upload generated flyer image
 * Convenience function with proper folder structure
 */
export async function uploadGeneratedFlyer(
    base64Data: string,
    userId: string,
    projectId: string,
    imageId: string
): Promise<string> {
    const { extension } = parseBase64DataUrl(base64Data);
    const filename = `${imageId}.${extension}`;
    const folderPath = `generated/${userId}/${projectId}`;

    return uploadBase64Image(base64Data, folderPath, filename);
}

/**
 * Upload project property image
 * Convenience function with proper folder structure
 */
export async function uploadProjectImage(
    base64Data: string,
    projectId: string,
    imageId: string
): Promise<string> {
    const { extension } = parseBase64DataUrl(base64Data);
    const filename = `${imageId}.${extension}`;
    const folderPath = `projects/${projectId}`;

    return uploadBase64Image(base64Data, folderPath, filename);
}

/**
 * Upload user portrait
 * Convenience function with proper folder structure
 */
export async function uploadUserPortrait(
    base64Data: string,
    userId: string,
    portraitId: string
): Promise<string> {
    const { extension } = parseBase64DataUrl(base64Data);
    const filename = `${portraitId}.${extension}`;
    const folderPath = `portraits/${userId}`;

    return uploadBase64Image(base64Data, folderPath, filename);
}

/**
 * Upload user profile photo
 * Convenience function with proper folder structure  
 */
export async function uploadProfilePhoto(
    base64Data: string,
    userId: string
): Promise<string> {
    const { extension } = parseBase64DataUrl(base64Data);
    const filename = `photo.${extension}`;
    const folderPath = `profiles/${userId}`;

    // Use upsert for profile photos (always overwrite)
    const supabase = createAdminClient();
    const { base64, mimeType } = parseBase64DataUrl(base64Data);
    const buffer = base64ToBuffer(base64);
    const fullPath = `${folderPath}/${filename}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fullPath, buffer, {
            contentType: mimeType,
            cacheControl: "3600",
            upsert: true, // Allow overwriting existing profile photo
        });

    if (error) {
        throw new Error(`Failed to upload profile photo: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}
