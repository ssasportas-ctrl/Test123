import SwiftUI

enum MTTab: String, CaseIterable, Identifiable {
    case home = "Home"
    case services = "Services"
    case shop = "Shop"
    case rewards = "Rewards"
    case me = "Me"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .home: return "house.fill"
        case .services: return "sparkles"
        case .shop: return "bag.fill"
        case .rewards: return "star.fill"
        case .me: return "person.fill"
        }
    }
}

struct RootSplitView: View {
    @StateObject private var store = AppStore()
    @State private var selection: MTTab = .home

    init() {
        configureTabBarAppearance()
    }

    var body: some View {
        TabView(selection: $selection) {
            NavigationStack { HomeView().background(MTColor.backgroundSage.ignoresSafeArea()) }
                .tabItem { Label(MTTab.home.rawValue, systemImage: MTTab.home.icon) }
                .tag(MTTab.home)

            NavigationStack { ServicesView().background(MTColor.backgroundSage.ignoresSafeArea()) }
                .tabItem { Label(MTTab.services.rawValue, systemImage: MTTab.services.icon) }
                .tag(MTTab.services)

            NavigationStack { ShopView().background(MTColor.backgroundSage.ignoresSafeArea()) }
                .tabItem { Label(MTTab.shop.rawValue, systemImage: MTTab.shop.icon) }
                .tag(MTTab.shop)

            NavigationStack { RewardsView().background(MTColor.backgroundSage.ignoresSafeArea()) }
                .tabItem { Label(MTTab.rewards.rawValue, systemImage: MTTab.rewards.icon) }
                .tag(MTTab.rewards)

            NavigationStack { MeView().background(MTColor.backgroundSage.ignoresSafeArea()) }
                .tabItem { Label(MTTab.me.rawValue, systemImage: MTTab.me.icon) }
                .tag(MTTab.me)
        }
        .tint(MTColor.goldFoil)
        .task { await store.loadEverything() }
        .environmentObject(store)
    }

    /// Dark charcoal/gold-foil tab bar, matching the web app's mobile bottom nav.
    private func configureTabBarAppearance() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(MTColor.sidebarSage)

        let normal = UITabBarItemAppearance()
        normal.normal.iconColor = UIColor.white.withAlphaComponent(0.56)
        normal.normal.titleTextAttributes = [.foregroundColor: UIColor.white.withAlphaComponent(0.56)]
        normal.selected.iconColor = UIColor(MTColor.goldFoil)
        normal.selected.titleTextAttributes = [.foregroundColor: UIColor(MTColor.goldFoil)]
        appearance.stackedLayoutAppearance = normal

        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}
