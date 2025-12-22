import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    console.log('[Middleware] ====== START ======')
    console.log('[Middleware] Path:', pathname)
    console.log('[Middleware] Method:', request.method)

    // Check if Supabase environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('[Middleware] NEXT_PUBLIC_SUPABASE_URL exists:', !!supabaseUrl)
    console.log('[Middleware] NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey)

    if (!supabaseUrl || !supabaseAnonKey) {
        console.log('[Middleware] Missing Supabase env vars, continuing without auth check')
        return NextResponse.next()
    }

    console.log('[Middleware] Supabase URL (first 30 chars):', supabaseUrl.substring(0, 30))

    try {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })

        console.log('[Middleware] Creating Supabase client...')

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        const cookies = request.cookies.getAll()
                        console.log('[Middleware] Getting cookies, count:', cookies.length)
                        return cookies
                    },
                    setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                        console.log('[Middleware] Setting cookies, count:', cookiesToSet.length)
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        )
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        console.log('[Middleware] Supabase client created, getting user...')

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            console.log('[Middleware] Error getting user:', error.message)
        }

        console.log('[Middleware] User exists:', !!user)
        console.log('[Middleware] User email:', user?.email || 'N/A')

        if (
            !user &&
            !pathname.startsWith('/login') &&
            !pathname.startsWith('/auth') &&
            !pathname.startsWith('/reset-password') &&
            pathname !== '/'
        ) {
            console.log('[Middleware] No user + protected route, redirecting to /login')
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        console.log('[Middleware] ====== END (success) ======')
        return response
    } catch (error) {
        console.error('[Middleware] CAUGHT ERROR:', error)
        console.error('[Middleware] Error type:', typeof error)
        console.error('[Middleware] Error message:', error instanceof Error ? error.message : 'Unknown')
        console.error('[Middleware] Error stack:', error instanceof Error ? error.stack : 'N/A')

        // On error, continue without blocking
        console.log('[Middleware] Continuing despite error...')
        return NextResponse.next()
    }
}
