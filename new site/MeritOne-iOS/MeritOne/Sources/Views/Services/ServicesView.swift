import SwiftUI

struct ServicesView: View {
    @EnvironmentObject private var store: AppStore

    private var grouped: [(category: String, services: [Service])] {
        let groups = Dictionary(grouping: store.services) { $0.category ?? "More" }
        return groups.keys.sorted().map { ($0, groups[$0] ?? []) }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("EXPLORE").mtEyebrow()
                    Text("Services")
                        .font(MTFont.serif(34))
                        .foregroundStyle(MTColor.ink)
                }

                if store.services.isEmpty {
                    Text("No services available yet.")
                        .foregroundStyle(MTColor.inkMuted)
                } else {
                    ForEach(grouped, id: \.category) { group in
                        VStack(alignment: .leading, spacing: 12) {
                            Text(group.category.uppercased()).mtEyebrow()
                            ForEach(group.services) { service in
                                ServiceRow(service: service)
                            }
                        }
                    }
                }
            }
            .padding(24)
        }
        .background(MTColor.backgroundSage.ignoresSafeArea())
    }
}

private struct ServiceRow: View {
    let service: Service

    var body: some View {
        MTCard {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(service.name)
                        .font(MTFont.label(16, weight: .bold))
                        .foregroundStyle(MTColor.ink)
                    if let description = service.description {
                        Text(description)
                            .font(.footnote)
                            .foregroundStyle(MTColor.inkMuted)
                            .lineLimit(2)
                    }
                }
                Spacer()
                if let price = service.price {
                    Text(price, format: .currency(code: "USD"))
                        .font(MTFont.label(15, weight: .bold))
                        .foregroundStyle(MTColor.gold)
                }
            }
            .padding(18)
        }
    }
}
