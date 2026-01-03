import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

// Force dynamic to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Get the authenticated user
            const { data: { user } } = await supabase.auth.getUser()

            if (user?.email) {
                // Check if email is verified (skip for OAuth providers like Google which auto-verify)
                const isOAuthProvider = user.app_metadata?.provider !== 'email'

                if (!isOAuthProvider && !user.email_confirmed_at) {
                    // Sign out unverified email users
                    await supabase.auth.signOut()
                    return NextResponse.redirect(`${origin}/login?error=email_not_verified`)
                }

                // Create or update user in database
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: {
                        // Update name from metadata if available
                        name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
                        // Sync email verification status from Supabase
                        emailVerified: user.email_confirmed_at ? new Date(user.email_confirmed_at) : undefined,
                    },
                    create: {
                        email: user.email,
                        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
                        emailVerified: user.email_confirmed_at ? new Date(user.email_confirmed_at) : null,
                        creditsRemaining: 3, // Default free credits
                        planType: 'free',
                    },
                })
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_code_error`)
}
