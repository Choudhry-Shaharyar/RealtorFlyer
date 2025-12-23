import { NextResponse, type NextRequest } from 'next/server'

// Minimal middleware for debugging - remove Supabase to test Edge compatibility
export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    console.log('[Middleware] Path:', pathname)

    // For now, just pass through all requests to isolate if the issue is with Supabase
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes - handle their own auth)
         */
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
