"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadProfilePhoto } from "@/lib/supabase-storage";

export async function signOutAction() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function updateProfileAction({
    name,
    phone,
    profilePhoto,
    companyName,
}: {
    name: string;
    phone?: string;
    profilePhoto?: string;
    companyName?: string;
}) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        throw new Error("Not authenticated");
    }

    try {
        // Get the user's database ID
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true },
        });

        if (!dbUser) {
            throw new Error("User not found");
        }

        let photoUrl = profilePhoto;

        // Upload photo to Supabase Storage if it's base64
        if (profilePhoto && profilePhoto.startsWith("data:")) {
            try {
                photoUrl = await uploadProfilePhoto(profilePhoto, dbUser.id);
            } catch (uploadError) {
                console.error("Photo upload failed, saving base64 as fallback:", uploadError);
                // Keep the base64 as fallback if storage upload fails
            }
        }

        await prisma.user.update({
            where: { email: user.email },
            data: {
                name,
                phone,
                profilePhoto: photoUrl,
                companyName,
            },
        });
        revalidatePath("/dashboard");
        revalidatePath("/profile");
    } catch (error) {
        console.error("Profile update failed:", error);
        throw new Error("Failed to update profile");
    }
}

