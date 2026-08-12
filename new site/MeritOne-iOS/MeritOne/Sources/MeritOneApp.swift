import SwiftUI

@main
struct MeritOneApp: App {
    @StateObject private var session = SessionManager()

    var body: some Scene {
        WindowGroup {
            Group {
                if session.isSignedIn {
                    RootSplitView()
                        .environmentObject(session)
                } else {
                    AuthView()
                        .environmentObject(session)
                }
            }
            .tint(MTColor.gold)
        }
    }
}

/// Appwrite's REST client has no auth-state stream (unlike Supabase's
/// realtime `authStateChanges`), so sign-in/out just flip this flag directly.
@MainActor
final class SessionManager: ObservableObject {
    @Published var isSignedIn: Bool

    private let service = AppwriteService.shared

    init() {
        isSignedIn = service.hasSession
        if isSignedIn { Task { await validateStoredSession() } }
    }

    /// A stored session secret may have expired server-side since last launch.
    private func validateStoredSession() async {
        do {
            _ = try await service.currentAccount()
        } catch {
            await service.signOut()
            isSignedIn = false
        }
    }

    func markSignedIn() {
        isSignedIn = true
    }

    func signOut() async {
        await service.signOut()
        isSignedIn = false
    }
}
