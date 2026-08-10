import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cbdekqzzxysxachifevr.supabase.co'
// Public anon key — safe to ship client-side, RLS policies enforce access control.
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZGVrcXp6eHlzeGFjaGlmZXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Njc3MDYsImV4cCI6MjA5OTU0MzcwNn0.fMGrhoLwuI9RmPN7NfSBJxnFUxhhsOGwyKZLPv_Lz-A'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
