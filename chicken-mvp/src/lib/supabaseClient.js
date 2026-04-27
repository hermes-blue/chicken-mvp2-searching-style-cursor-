import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Vite: URL·anon key 없으면 null (로컬에서 .env 없을 때) */
export const supabase = url && key ? createClient(url, key) : null
