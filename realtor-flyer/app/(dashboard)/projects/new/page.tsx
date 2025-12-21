import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { NewProjectForm } from "@/components/projects/new-project-form";

export default async function NewProjectPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
        redirect("/login");
    }

    // Fetch user profile data to pre-populate agent information
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
            name: true,
            phone: true,
            companyName: true,
            profilePhoto: true,
        },
    });

    return (
        <NewProjectForm
            initialAgentData={dbUser ? {
                name: dbUser.name,
                phone: dbUser.phone,
                companyName: dbUser.companyName,
                profilePhoto: dbUser.profilePhoto,
            } : undefined}
        />
    );
}
