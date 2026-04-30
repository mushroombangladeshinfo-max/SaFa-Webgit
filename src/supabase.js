import { createClient } from '@supabase/supabase-js'

// These names MUST match the "Variable name" fields in Cloudflare exactly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)