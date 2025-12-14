import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
    const session = await auth()

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="mb-4">Welcome back, {session?.user?.name || "User"}!</p>
            <div className="flex gap-4">
                <form
                    action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}
                >
                    <Button variant="destructive">Sign Out</Button>
                </form>
            </div>
        </div>
    )
}
