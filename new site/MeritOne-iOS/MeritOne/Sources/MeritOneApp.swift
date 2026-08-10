import SwiftUI
import Supabase

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

@MainActor
final class SessionManager: ObservableObject {
    @Published var isSignedIn = false

    private let service = SupabaseService.shared

    init() {
        Task { await observeAuthChanges() }
    }

    private func observeAuthChanges() async {
        for await state in await service.client.auth.authStateChanges {
            if state.event == .signedIn || state.event == .initialSession {
                isSignedIn = state.session != nil
            } else if state.event == .signedOut {
                isSignedIn = false
            }
        }
    }
}
