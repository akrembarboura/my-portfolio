import { createClient } from '@supabase/supabase-js'

// Backend & Admin are temporarily hidden/disabled unless explicitly enabled via VITE_ENABLE_BACKEND=true
export const BACKEND_ENABLED = import.meta.env.VITE_ENABLE_BACKEND === 'true'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  BACKEND_ENABLED && supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null
