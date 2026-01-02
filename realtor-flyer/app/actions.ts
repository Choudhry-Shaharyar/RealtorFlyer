"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOutAction() {
    const supabase = await createClient();
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
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        throw new Error("Not authenticated");
    }

    try {
        await prisma.user.update({
            where: { email: user.email },
            data: {
                name,
                phone,
                profilePhoto, // Now stores URL directly (upload handled by /api/upload/profile-photo)
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

