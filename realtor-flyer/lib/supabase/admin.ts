import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client using the service role key.
 * This client bypasses Row Level Security (RLS) and should
 * ONLY be used for server-side operations like storage uploads.
 * 
 * NEVER expose this client or the service role key to the browser.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Only throw at runtime when actually called, not during build
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error(
            'Missing Supabase environment variables. ' +
            'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
        )
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

