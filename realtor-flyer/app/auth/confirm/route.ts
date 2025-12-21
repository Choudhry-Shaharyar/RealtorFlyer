import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/dashboard'

    if (token_hash && type) {
        const supabase = createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            // Get the authenticated user
            const { data: { user } } = await supabase.auth.getUser()

            if (user?.email) {
                // Create or update user in database
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: {},
                    create: {
                        email: user.email,
                        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
                        creditsRemaining: 3, // Default free credits
                        planType: 'free',
                    },
                })
            }

            // redirect user to specified redirect URL or dashboard
            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    // redirect the user to an error page with some instructions
    return NextResponse.redirect(new URL('/login?error=auth_verify_error', request.url))
}
