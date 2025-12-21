import { Metadata } from "next"
import Link from "next/link"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Reset Password - RealtorFlyer",
    description: "Set a new password",
}

export default function ResetPasswordPage() {
    return (
        <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-brand-navy" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Link href="/">RealtorFlyer</Link>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Secure your account with a strong password.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card className="border-none shadow-none">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold text-brand-navy">Set New Password</CardTitle>
                            <CardDescription>
                                Enter your new password below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResetPasswordForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
