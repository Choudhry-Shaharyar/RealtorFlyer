import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client using the service role key.
 * This client bypasses Row Level Security (RLS) and should
 * ONLY be used for server-side operations like storage uploads.
 * 
 * NEVER expose this client or the service role key to the browser.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseServiceKey) {
        throw new Error(
            'SUPABASE_SERVICE_ROLE_KEY is not set. ' +
            'Add it to your .env file (get it from Supabase Dashboard > Settings > API)'
        )
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
