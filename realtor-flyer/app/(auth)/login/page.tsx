import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Login - RealtorFlyer",
    description: "Sign in to your account",
}

export default function LoginPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const view = searchParams.view
    const plan = typeof searchParams.plan === 'string' ? searchParams.plan : undefined

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
                            &ldquo;RealtorFlyer has transformed how I market my listings. I can now generate professional open house flyers in minutes instead of hours.&rdquo;
                        </p>
                        <footer className="text-sm">Sarah Jenkins, RE/MAX Top Producer</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {plan && (
                        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-lg p-3 text-center text-sm">
                            <p className="text-brand-navy font-medium">
                                📦 You selected the <span className="font-bold capitalize">{plan}</span> plan
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">
                                Sign in or create an account to continue to checkout
                            </p>
                        </div>
                    )}
                    {searchParams.error === 'email_not_verified' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-sm">
                            <p className="text-red-700 font-medium">
                                ⚠️ Email not verified
                            </p>
                            <p className="text-red-600 text-xs mt-1">
                                Please check your inbox and verify your email before signing in.
                            </p>
                        </div>
                    )}
                    <Card className="border-none shadow-none">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold text-brand-navy">
                                {view === 'forgot_password' ? 'Reset Password' : 'Log in to RealtorFlyer'}
                            </CardTitle>
                            <CardDescription>
                                {view === 'forgot_password'
                                    ? "Enter your email to reset your password"
                                    : "Sign in to your account to continue"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {view === 'forgot_password' ? <ForgotPasswordForm /> : <LoginForm redirectPlan={plan} />}
                            {view !== 'forgot_password' && (
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
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

