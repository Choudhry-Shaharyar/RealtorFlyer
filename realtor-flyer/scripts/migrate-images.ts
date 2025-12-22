/**
 * Migration Script: Base64 → Supabase Storage
 * 
 * This script migrates existing Base64 image data from the database
 * to Supabase Storage and updates records with the new URLs.
 * 
 * SAFETY: This script does NOT delete old Base64 data.
 * Run manually after verification to delete old data.
 * 
 * Usage: npx ts-node scripts/migrate-images.ts
 */

import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = "realtor-flyer-assets";

// Statistics
const stats = {
    generatedImages: { total: 0, migrated: 0, skipped: 0, failed: 0 },
    projectImages: { total: 0, migrated: 0, skipped: 0, failed: 0 },
    userPortraits: { total: 0, migrated: 0, skipped: 0, failed: 0 },
};

/**
 * Parse base64 data URL and convert to buffer
 */
function parseAndConvertBase64(dataUrl: string): {
    buffer: Buffer;
    mimeType: string;
    extension: string;
} | null {
    try {
        let base64: string;
        let mimeType: string;

        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
            mimeType = matches[1];
            base64 = matches[2];
        } else {
            // Assume raw base64 PNG
            mimeType = "image/png";
            base64 = dataUrl;
        }

        const extension = mimeType.split("/")[1] || "png";
        const buffer = Buffer.from(base64, "base64");

        return { buffer, mimeType, extension };
    } catch (error) {
        console.error("Failed to parse base64:", error);
        return null;
    }
}

/**
 * Upload buffer to Supabase Storage
 */
async function uploadToStorage(
    buffer: Buffer,
    path: string,
    mimeType: string
): Promise<string | null> {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(path, buffer, {
                contentType: mimeType,
                cacheControl: "3600",
                upsert: true,
            });

        if (error) {
            console.error(`Upload error for ${path}:`, error.message);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (error) {
        console.error(`Upload exception for ${path}:`, error);
        return null;
    }
}

/**
 * Migrate GeneratedImage records
 */
async function migrateGeneratedImages() {
    console.log("\n📷 Migrating GeneratedImage records...");

    const images = await prisma.generatedImage.findMany({
        where: {
            imageData: { not: "" },
            url: { equals: null }, // Only migrate records without URL
        },
        select: {
            id: true,
            userId: true,
            projectId: true,
            imageData: true,
            mimeType: true,
        },
    });

    stats.generatedImages.total = images.length;
    console.log(`Found ${images.length} records to migrate`);

    for (const image of images) {
        if (!image.imageData) {
            stats.generatedImages.skipped++;
            continue;
        }

        const parsed = parseAndConvertBase64(image.imageData);
        if (!parsed) {
            console.log(`  ❌ Failed to parse image ${image.id}`);
            stats.generatedImages.failed++;
            continue;
        }

        const path = `generated/${image.userId}/${image.projectId}/${image.id}.${parsed.extension}`;
        const url = await uploadToStorage(parsed.buffer, path, parsed.mimeType);

        if (url) {
            await prisma.generatedImage.update({
                where: { id: image.id },
                data: { url },
            });
            console.log(`  ✅ Migrated ${image.id}`);
            stats.generatedImages.migrated++;
        } else {
            console.log(`  ❌ Failed to upload ${image.id}`);
            stats.generatedImages.failed++;
        }
    }
}

/**
 * Migrate ProjectImage records
 */
async function migrateProjectImages() {
    console.log("\n🏠 Migrating ProjectImage records...");

    const images = await prisma.projectImage.findMany({
        where: {
            imageUrl: { startsWith: "data:" }, // Only migrate base64 data URLs
        },
        include: {
            project: {
                select: { userId: true },
            },
        },
    });

    stats.projectImages.total = images.length;
    console.log(`Found ${images.length} records to migrate`);

    for (const image of images) {
        const parsed = parseAndConvertBase64(image.imageUrl);
        if (!parsed) {
            console.log(`  ❌ Failed to parse image ${image.id}`);
            stats.projectImages.failed++;
            continue;
        }

        const path = `projects/${image.projectId}/${image.id}.${parsed.extension}`;
        const url = await uploadToStorage(parsed.buffer, path, parsed.mimeType);

        if (url) {
            await prisma.projectImage.update({
                where: { id: image.id },
                data: { imageUrl: url },
            });
            console.log(`  ✅ Migrated ${image.id}`);
            stats.projectImages.migrated++;
        } else {
            console.log(`  ❌ Failed to upload ${image.id}`);
            stats.projectImages.failed++;
        }
    }
}

/**
 * Migrate UserPortrait records
 */
async function migrateUserPortraits() {
    console.log("\n👤 Migrating UserPortrait records...");

    const portraits = await prisma.userPortrait.findMany({
        where: {
            imageUrl: { startsWith: "data:" }, // Only migrate base64 data URLs
        },
    });

    stats.userPortraits.total = portraits.length;
    console.log(`Found ${portraits.length} records to migrate`);

    for (const portrait of portraits) {
        const parsed = parseAndConvertBase64(portrait.imageUrl);
        if (!parsed) {
            console.log(`  ❌ Failed to parse portrait ${portrait.id}`);
            stats.userPortraits.failed++;
            continue;
        }

        const path = `portraits/${portrait.userId}/${portrait.id}.${parsed.extension}`;
        const url = await uploadToStorage(parsed.buffer, path, parsed.mimeType);

        if (url) {
            await prisma.userPortrait.update({
                where: { id: portrait.id },
                data: { imageUrl: url },
            });
            console.log(`  ✅ Migrated ${portrait.id}`);
            stats.userPortraits.migrated++;
        } else {
            console.log(`  ❌ Failed to upload ${portrait.id}`);
            stats.userPortraits.failed++;
        }
    }
}

/**
 * Main migration function
 */
async function main() {
    console.log("🚀 Starting Image Migration: Base64 → Supabase Storage");
    console.log("================================================");
    console.log(`Bucket: ${BUCKET_NAME}`);
    console.log(`Supabase URL: ${supabaseUrl}`);

    try {
        // Check if bucket exists
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        if (bucketsError) {
            console.error("Failed to list buckets:", bucketsError.message);
            process.exit(1);
        }

        const bucketExists = buckets.some((b) => b.name === BUCKET_NAME);
        if (!bucketExists) {
            console.error(`❌ Bucket "${BUCKET_NAME}" does not exist. Please create it first.`);
            process.exit(1);
        }
        console.log(`✅ Bucket "${BUCKET_NAME}" found`);

        // Run migrations
        await migrateGeneratedImages();
        await migrateProjectImages();
        await migrateUserPortraits();

        // Print summary
        console.log("\n================================================");
        console.log("📊 Migration Summary");
        console.log("================================================");
        console.log("\nGeneratedImage:");
        console.log(`  Total: ${stats.generatedImages.total}`);
        console.log(`  Migrated: ${stats.generatedImages.migrated}`);
        console.log(`  Skipped: ${stats.generatedImages.skipped}`);
        console.log(`  Failed: ${stats.generatedImages.failed}`);

        console.log("\nProjectImage:");
        console.log(`  Total: ${stats.projectImages.total}`);
        console.log(`  Migrated: ${stats.projectImages.migrated}`);
        console.log(`  Skipped: ${stats.projectImages.skipped}`);
        console.log(`  Failed: ${stats.projectImages.failed}`);

        console.log("\nUserPortrait:");
        console.log(`  Total: ${stats.userPortraits.total}`);
        console.log(`  Migrated: ${stats.userPortraits.migrated}`);
        console.log(`  Skipped: ${stats.userPortraits.skipped}`);
        console.log(`  Failed: ${stats.userPortraits.failed}`);

        const totalFailed =
            stats.generatedImages.failed +
            stats.projectImages.failed +
            stats.userPortraits.failed;

        if (totalFailed > 0) {
            console.log(`\n⚠️  ${totalFailed} records failed to migrate. Check logs above.`);
        } else {
            console.log("\n✅ All records migrated successfully!");
        }

        console.log("\n⚠️  REMINDER: Old Base64 data was NOT deleted.");
        console.log("    Run cleanup script after verification.");

    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
