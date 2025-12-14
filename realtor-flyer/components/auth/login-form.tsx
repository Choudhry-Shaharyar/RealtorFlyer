import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export function LoginForm() {
    return (
        <div className="flex flex-col gap-4">
            <form
                action={async () => {
                    "use server"
                    await signIn("google", { redirectTo: "/dashboard" })
                }}
            >
                <Button className="w-full bg-brand-navy hover:bg-brand-navy-light text-white" type="submit">
                    Continue with Google
                </Button>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or
                    </span>
                </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
                Email (Coming Soon)
            </Button>
        </div>
    )
}
