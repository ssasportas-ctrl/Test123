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
    @State private var language = "EN"

    var body: some View {
        NavigationSplitView {
            sidebar
        } detail: {
            NavigationStack {
                detailView
                    .background(MTColor.backgroundSage.ignoresSafeArea())
            }
        }
        .task { await store.loadEverything() }
        .environmentObject(store)
    }

    private var sidebar: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("MeritOne")
                .font(MTFont.serif(22))
                .foregroundStyle(MTColor.goldFoil)
                .padding(.horizontal, 20)
                .padding(.top, 28)
                .padding(.bottom, 22)

            ForEach(MTTab.allCases) { tab in
                sidebarRow(tab)
            }

            Spacer()

            HStack(spacing: 12) {
                languagePill("EN")
                Text("|").foregroundStyle(Color.white.opacity(0.25))
                languagePill("ES")
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 24)
            .overlay(Divider().overlay(Color.white.opacity(0.08)), alignment: .top)
        }
        .background(MTColor.sidebarSage.ignoresSafeArea())
    }

    private func sidebarRow(_ tab: MTTab) -> some View {
        let active = selection == tab
        return Button {
            selection = tab
        } label: {
            HStack(spacing: 13) {
                Image(systemName: tab.icon)
                    .frame(width: 20)
                Text(tab.rawValue)
                    .font(MTFont.label(14.5, weight: .medium))
                Spacer()
            }
            .foregroundStyle(active ? Color(hex: "F5F2E6") : Color.white.opacity(0.56))
            .padding(.vertical, 12)
            .padding(.horizontal, 16)
            .background(active ? MTColor.goldFoil.opacity(0.08) : Color.clear)
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(alignment: .leading) {
                if active {
                    RoundedRectangle(cornerRadius: 2)
                        .fill(MTColor.goldFoil)
                        .frame(width: 3, height: 18)
                        .offset(x: -14)
                }
            }
            .padding(.horizontal, 14)
        }
        .buttonStyle(.plain)
    }

    private func languagePill(_ code: String) -> some View {
        Button {
            language = code
        } label: {
            Text(code)
                .font(MTFont.label(12, weight: .bold))
                .foregroundStyle(language == code ? MTColor.goldFoil : Color.white.opacity(0.5))
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(language == code ? MTColor.goldFoil.opacity(0.12) : Color.clear)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private var detailView: some View {
        switch selection {
        case .home: HomeView()
        case .services: ServicesView()
        case .shop: ShopView()
        case .rewards: RewardsView()
        case .me: MeView()
        }
    }
}
