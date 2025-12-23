import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that don't require authentication
const PUBLIC_ROUTES = new Set(['/', '/login', '/reset-password'])

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip middleware for static assets and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/auth') ||
        /\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2)$/.test(pathname)
    ) {
        return NextResponse.next()
    }

    // Skip auth check for public routes
    if (PUBLIC_ROUTES.has(pathname)) {
        return NextResponse.next()
    }

    // Validate environment variables - fail open if missing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('[Middleware] Missing Supabase environment variables')
        return NextResponse.next()
    }

    // Create response object for cookie handling
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    try {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    // Update request cookies
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    // Create new response with updated cookies
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    // Set cookies on response
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options as any)
                    )
                },
            },
        })

        // Verify user session
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            // Log but don't expose auth service errors to users
            console.warn('[Middleware] Auth error:', error.message)
        }

        // Redirect unauthenticated users to login
        if (!user) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }

        return response
    } catch (err) {
        // CRITICAL: Never block requests due to middleware errors
        // Let the page/API handle auth state
        console.error('[Middleware] Unexpected error:', err)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public files (images, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
}
