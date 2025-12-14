import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Login - RealtorFlyer",
    description: "Sign in to your account",
}

export default function LoginPage() {
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
                            &ldquo;This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Davis, Real Estate Agent</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card className="border-none shadow-none">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold text-brand-navy">Welcome back</CardTitle>
                            <CardDescription>
                                Sign in to your account to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LoginForm />
                            <p className="px-8 text-center text-sm text-muted-foreground mt-4">
                                By clicking continue, you agree to our{" "}
                                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
