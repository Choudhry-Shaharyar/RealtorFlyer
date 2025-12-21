"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const supabase = createClient()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })

        if (error) {
            toast.error("Failed to make request", {
                description: error.message,
            })
            setIsLoading(false)
        } else {
            setIsSuccess(true)
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="grid gap-6 text-center">
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-xl">Check your email</h3>
                    <p className="text-muted-foreground text-sm">
                        We sent you a password reset link. Be sure to check your spam folder too.
                    </p>
                </div>
                <Link href="/login">
                    <Button variant="outline" className="w-full">
                        Return to Login
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        required
                    />
                </div>
                <Button disabled={isLoading} className="bg-brand-navy hover:bg-brand-navy-light text-white">
                    {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send Reset Link
                </Button>
                <div className="text-center">
                    <Link href="/login" className="text-sm text-muted-foreground hover:underline inline-flex items-center">
                        <ArrowLeft className="mr-2 h-3 w-3" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </form>
    )
}
