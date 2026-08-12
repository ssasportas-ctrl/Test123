export const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT ?? 'https://nyc.cloud.appwrite.io/v1'
export const APPWRITE_PROJECT = process.env.APPWRITE_PROJECT ?? '6a7c84a300376e2da9e6'
export const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY
export const DATABASE_ID = 'meritone'

export const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://cbdekqzzxysxachifevr.supabase.co'
export const SUPABASE_KEY = process.env.SUPABASE_KEY

if (!APPWRITE_API_KEY) {
  console.error('Missing APPWRITE_API_KEY environment variable.')
  process.exit(1)
}
