import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    console.log('[Main Middleware] Request received for:', request.nextUrl.pathname)

    try {
        const result = await updateSession(request)
        console.log('[Main Middleware] updateSession completed successfully')
        return result
    } catch (error) {
        console.error('[Main Middleware] FATAL ERROR in updateSession:', error)
        console.error('[Main Middleware] Error type:', typeof error)
        console.error('[Main Middleware] Error message:', error instanceof Error ? error.message : 'Unknown')
        console.error('[Main Middleware] Error stack:', error instanceof Error ? error.stack : 'N/A')

        // On fatal error, allow the request through
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes - handle their own auth)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
