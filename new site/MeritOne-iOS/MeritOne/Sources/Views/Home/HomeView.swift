import SwiftUI

private enum QuickAction: Identifiable {
    case membership, giftCards, refer
    var id: Self { self }
}

struct HomeView: View {
    @EnvironmentObject private var store: AppStore
    @State private var showCheckIn = false
    @State private var activeSheet: QuickAction?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 28) {
                header

                InsiderCard(summary: store.summary, showCheckIn: $showCheckIn)

                quickActions

                featuredTreatments
            }
            .padding(24)
        }
        .sheet(isPresented: $showCheckIn) {
            CheckInView()
        }
        .sheet(item: $activeSheet) { sheet in
            switch sheet {
            case .membership: MembershipSheet()
            case .giftCards: GiftCardSheet()
            case .refer: ReferSheet()
            }
        }
        .overlay {
            if store.isLoading && store.patient == nil {
                ProgressView().tint(MTColor.gold)
            }
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("WELCOME BACK").mtEyebrow()
            Text(store.patient?.fullName ?? "Guest")
                .font(MTFont.serif(38))
                .foregroundStyle(MTColor.ink)
            Rectangle()
                .fill(MTColor.gold)
                .frame(width: 64, height: 3)
        }
    }

    private var quickActions: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 130), spacing: 16)], spacing: 16) {
            Link(destination: PracticeInfo.bookingURL) {
                QuickActionTile(icon: "calendar", title: "BOOK")
            }
            Button { activeSheet = .membership } label: {
                QuickActionTile(icon: "sparkles", title: "MEMBERSHIP")
            }
            Button { activeSheet = .giftCards } label: {
                QuickActionTile(icon: "gift.fill", title: "GIFT CARDS")
            }
            Button { activeSheet = .refer } label: {
                QuickActionTile(icon: "person.2.fill", title: "REFER")
            }
        }
        .buttonStyle(.plain)
    }

    private var featuredTreatments: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("CURATED FOR YOU").mtEyebrow()
                    Text("Featured Treatments")
                        .font(MTFont.serif(26))
                        .foregroundStyle(MTColor.ink)
                }
                Spacer()
                Text("SEE ALL")
                    .mtEyebrow()
            }

            if store.services.isEmpty {
                Text("Featured treatments will appear here.")
                    .foregroundStyle(MTColor.inkMuted)
                    .padding(.top, 4)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(store.services.filter(\.featured).prefix(6)) { service in
                            ServiceCard(service: service)
                        }
                    }
                }
            }
        }
    }
}

private struct InsiderCard: View {
    let summary: LoyaltySummary
    @Binding var showCheckIn: Bool

    var body: some View {
        MTFoilCard {
            VStack(spacing: 0) {
                VStack(alignment: .leading, spacing: 22) {
                    HStack(spacing: 7) {
                        Image(systemName: "star.fill").foregroundStyle(MTColor.goldFoil)
                        Text(summary.tierLabel.uppercased()).mtEyebrow(color: MTColor.goldFoil)
                    }

                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 5) {
                            Text("POINTS").mtEyebrow(color: .white.opacity(0.45))
                            Text("\(summary.pointsBalance)")
                                .font(MTFont.serif(42, weight: .medium))
                                .foregroundStyle(Color(hex: "F8F6EE"))
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 5) {
                            Text("CREDITS").mtEyebrow(color: .white.opacity(0.45))
                            Text(summary.creditBalance, format: .currency(code: "USD").precision(.fractionLength(0)))
                                .font(MTFont.serif(42, weight: .medium))
                                .foregroundStyle(Color(hex: "F8F6EE"))
                        }
                    }

                    VStack(alignment: .leading, spacing: 9) {
                        HStack {
                            Text("\(summary.visitCount) visits")
                                .font(.subheadline)
                                .foregroundStyle(.white.opacity(0.6))
                            Spacer()
                            if let next = summary.nextMilestone {
                                Text("\(max(0, next.visitCount - summary.visitCount)) more visits to +\(next.bonusPoints) bonus points")
                                    .font(.subheadline)
                                    .foregroundStyle(MTColor.goldFoil)
                            }
                        }
                        ProgressView(value: progress)
                            .tint(MTColor.goldFoil)
                    }
                }
                .padding(24)

                Divider().overlay(Color.white.opacity(0.1))

                HStack(spacing: 0) {
                    footerButton(icon: "star", title: "REWARDS") {}
                    Divider().frame(height: 24).overlay(Color.white.opacity(0.1))
                    footerButton(icon: "qrcode", title: "CHECK IN") { showCheckIn = true }
                }
            }
        }
    }

    private var progress: Double {
        guard let next = summary.nextMilestone, next.visitCount > 0 else { return 1 }
        return min(1, Double(summary.visitCount) / Double(next.visitCount))
    }

    private func footerButton(icon: String, title: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                Text(title).font(MTFont.label(12.5, weight: .bold))
            }
            .foregroundStyle(MTColor.goldFoil)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 17)
        }
        .buttonStyle(.plain)
    }
}

private struct QuickActionTile: View {
    let icon: String
    let title: String

    var body: some View {
        MTCard {
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 17))
                    .foregroundStyle(MTColor.goldDeep)
                    .frame(width: 38, height: 38)
                    .background(MTColor.backgroundSage)
                    .clipShape(Circle())
                Text(title)
                    .font(MTFont.label(11.5, weight: .bold))
                    .foregroundStyle(MTColor.ink)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
        }
    }
}

private struct ServiceCard: View {
    let service: Service

    var body: some View {
        MTCard {
            VStack(alignment: .leading, spacing: 8) {
                RoundedRectangle(cornerRadius: 12)
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "EFECE1"), MTColor.backgroundSage],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 200, height: 120)
                    .overlay(Image(systemName: "sparkles").foregroundStyle(MTColor.gold))

                Text(service.name)
                    .font(MTFont.label(15, weight: .bold))
                    .foregroundStyle(MTColor.ink)
                    .lineLimit(1)

                if let price = service.price {
                    Text(price, format: .currency(code: "USD"))
                        .font(.footnote)
                        .foregroundStyle(MTColor.inkMuted)
                }
            }
            .padding(14)
        }
        .frame(width: 220)
    }
}
