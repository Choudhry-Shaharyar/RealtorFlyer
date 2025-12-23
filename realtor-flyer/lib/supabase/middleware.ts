import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Creates a Supabase client configured for middleware use.
 * Updates session cookies on every request.
 */
export async function updateSession(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return { response: NextResponse.next(), user: null }
    }

    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                )
                response = NextResponse.next({
                    request: { headers: request.headers },
                })
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options as any)
                )
            },
        },
    })

    const { data: { user } } = await supabase.auth.getUser()

    return { response, user }
}
