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

    // TEMPORARY: Pass through all requests to test Edge bundling
    // TODO: Re-enable auth after confirming Edge works
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
}
