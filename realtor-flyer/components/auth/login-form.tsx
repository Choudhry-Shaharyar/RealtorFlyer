"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { AlertCircle, Loader2, Check, X } from "lucide-react"
import Link from "next/link"

// Password validation helpers
const PASSWORD_REQUIREMENTS = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One lowercase letter (a-z)", test: (p: string) => /[a-z]/.test(p) },
    { label: "One uppercase letter (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One number (0-9)", test: (p: string) => /[0-9]/.test(p) },
    { label: "One special character (!@#$%^&*...)", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|<>?,./`~]/.test(p) },
]

function parseSupabaseError(error: { message: string; code?: string }): string {
    // Map common Supabase error messages to user-friendly messages
    const errorMappings: Record<string, string> = {
        "Invalid login credentials": "Incorrect email or password. Please try again.",
        "Email not confirmed": "Please verify your email before signing in. Check your inbox.",
        "User already registered": "An account with this email already exists. Try signing in instead.",
        "Password should be at least 8 characters": "Password must be at least 8 characters long.",
        "signup_disabled": "Sign ups are currently disabled. Please try again later.",
        "email_address_invalid": "Please enter a valid email address.",
    }

    // Check for partial matches
    for (const [key, friendly] of Object.entries(errorMappings)) {
        if (error.message.toLowerCase().includes(key.toLowerCase())) {
            return friendly
        }
    }

    // Handle password complexity errors from Supabase
    if (error.message.includes("Password") || error.message.includes("password")) {
        return error.message
    }

    // Default to the original message if no mapping found
    return error.message
}

interface LoginFormProps {
    redirectPlan?: string
}

export function LoginForm({ redirectPlan }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [signupPassword, setSignupPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Validate password against all requirements
    const passwordValidation = useMemo(() => {
        return PASSWORD_REQUIREMENTS.map(req => ({
            ...req,
            met: req.test(signupPassword)
        }))
    }, [signupPassword])

    const isPasswordValid = passwordValidation.every(req => req.met)
    const passwordsMatch = signupPassword === confirmPassword && confirmPassword.length > 0

    async function handleSocialLogin(provider: "google") {
        setIsLoading(true)

        // Build the redirect URL - if user selected a plan, redirect to billing after OAuth
        const callbackUrl = redirectPlan
            ? `/auth/callback?next=${encodeURIComponent(`/billing?plan=${redirectPlan}`)}`
            : `/auth/callback`

        const fullRedirectUrl = `${window.location.origin}${callbackUrl}`
        console.log('Redirect URL:', fullRedirectUrl)  // Check this in browser console

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: fullRedirectUrl,
                queryParams: {
                    prompt: "select_account",
                },
            },
        })

        if (error) {
            toast.error("Could not sign in with Google", {
                description: parseSupabaseError(error),
            })
            setIsLoading(false)
        }
    }

    async function onSignIn(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            toast.error("Sign in failed", {
                description: parseSupabaseError(error),
            })
            setIsLoading(false)
        } else if (data.user) {
            // Debug: log the email_confirmed_at value
            console.log('User email_confirmed_at:', data.user.email_confirmed_at)

            // Check if email is verified
            if (!data.user.email_confirmed_at) {
                await supabase.auth.signOut()
                toast.error("Email not verified", {
                    description: "Please check your inbox and verify your email before signing in.",
                })
                setIsLoading(false)
                return
            }

            router.refresh()
            // If user selected a plan, redirect to billing with plan param
            if (redirectPlan) {
                router.push(`/billing?plan=${redirectPlan}`)
            } else {
                router.push("/dashboard")
            }
        }
    }

    async function onSignUp(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        // Client-side validation
        if (!isPasswordValid) {
            toast.error("Password requirements not met", {
                description: "Please ensure your password meets all the requirements below.",
            })
            return
        }

        if (!passwordsMatch) {
            toast.error("Passwords don't match", {
                description: "Please make sure both passwords are identical.",
            })
            return
        }

        setIsLoading(true)
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string

        const { error } = await supabase.auth.signUp({
            email,
            password: signupPassword,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        })

        if (error) {
            toast.error("Registration failed", {
                description: parseSupabaseError(error),
            })
            setIsLoading(false)
        } else {
            toast.success("Account created!", {
                description: "Check your email to confirm your account before signing in."
            })
            setIsLoading(false)
            // Clear form
            setSignupPassword("")
            setConfirmPassword("")
        }
    }

    return (
        <div className="grid gap-6">
            <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                    <form onSubmit={onSignIn}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="signin-email">Email</Label>
                                <Input
                                    id="signin-email"
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
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="signin-password">Password</Label>
                                    <Link href="/login?view=forgot_password" className="text-xs text-muted-foreground hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="signin-password"
                                    name="password"
                                    placeholder="Enter your password"
                                    type="password"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <Button disabled={isLoading} className="bg-brand-navy hover:bg-brand-navy-light text-white">
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isLoading ? "Signing In..." : "Sign In with Email"}
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                <TabsContent value="signup">
                    <form onSubmit={onSignUp}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
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
                            <div className="grid gap-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password"
                                    name="password"
                                    placeholder="Create a strong password"
                                    type="password"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    required
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    onFocus={() => setShowPasswordRequirements(true)}
                                />

                                {/* Password Requirements */}
                                {showPasswordRequirements && (
                                    <div className="mt-2 p-3 bg-slate-50 rounded-lg border text-sm">
                                        <p className="font-medium text-slate-700 mb-2">Password must contain:</p>
                                        <ul className="space-y-1">
                                            {passwordValidation.map((req, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    {req.met ? (
                                                        <Check className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <X className="h-4 w-4 text-slate-300" />
                                                    )}
                                                    <span className={req.met ? "text-green-700" : "text-slate-500"}>
                                                        {req.label}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    type="password"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {confirmPassword.length > 0 && (
                                    <p className={`text-xs flex items-center gap-1 ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                                        {passwordsMatch ? (
                                            <>
                                                <Check className="h-3 w-3" />
                                                Passwords match
                                            </>
                                        ) : (
                                            <>
                                                <X className="h-3 w-3" />
                                                Passwords do not match
                                            </>
                                        )}
                                    </p>
                                )}
                            </div>
                            <Button
                                disabled={isLoading || !isPasswordValid || !passwordsMatch}
                                className="bg-brand-navy hover:bg-brand-navy-light text-white"
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleSocialLogin("google")}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                )}
                Google
            </Button>
        </div>
    )
}

