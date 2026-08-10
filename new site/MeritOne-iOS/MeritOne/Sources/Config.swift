import Foundation

enum Config {
    static let supabaseURL = URL(string: "https://cbdekqzzxysxachifevr.supabase.co")!
    // Public anon/publishable key — safe to ship in-app, RLS policies enforce access control.
    static let supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZGVrcXp6eHlzeGFjaGlmZXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Njc3MDYsImV4cCI6MjA5OTU0MzcwNn0.fMGrhoLwuI9RmPN7NfSBJxnFUxhhsOGwyKZLPv_Lz-A"
}
