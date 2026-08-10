import SwiftUI

struct ShopView: View {
    @EnvironmentObject private var store: AppStore

    private let columns = [GridItem(.adaptive(minimum: 160), spacing: 16)]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("MERITMD").mtEyebrow()
                    Text("Shop")
                        .font(MTFont.serif(34))
                        .foregroundStyle(MTColor.ink)
                }

                if store.products.isEmpty {
                    Text("No products available yet.")
                        .foregroundStyle(MTColor.inkMuted)
                } else {
                    LazyVGrid(columns: columns, spacing: 16) {
                        ForEach(store.products) { product in
                            ProductTile(product: product)
                        }
                    }
                }
            }
            .padding(24)
        }
        .background(MTColor.backgroundSage.ignoresSafeArea())
    }
}

private struct ProductTile: View {
    let product: Product

    var body: some View {
        MTCard {
            VStack(alignment: .leading, spacing: 8) {
                RoundedRectangle(cornerRadius: 12)
                    .fill(MTColor.backgroundSage)
                    .aspectRatio(1, contentMode: .fit)
                    .overlay(Image(systemName: "bag.fill").foregroundStyle(MTColor.gold))

                Text(product.name)
                    .font(MTFont.label(14, weight: .bold))
                    .foregroundStyle(MTColor.ink)
                    .lineLimit(2)

                Text(product.price, format: .currency(code: "USD"))
                    .font(.footnote)
                    .foregroundStyle(MTColor.inkMuted)
            }
            .padding(12)
        }
    }
}
