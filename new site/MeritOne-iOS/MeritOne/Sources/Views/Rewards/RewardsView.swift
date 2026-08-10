import SwiftUI

struct RewardsView: View {
    @EnvironmentObject private var store: AppStore
    @State private var redeemingReward: Reward?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("\(store.summary.pointsBalance) POINTS AVAILABLE").mtEyebrow()
                    Text("Rewards")
                        .font(MTFont.serif(34))
                        .foregroundStyle(MTColor.ink)
                }

                if store.rewards.isEmpty {
                    Text("No rewards available yet.")
                        .foregroundStyle(MTColor.inkMuted)
                } else {
                    ForEach(store.rewards) { reward in
                        RewardRow(
                            reward: reward,
                            pointsBalance: store.summary.pointsBalance,
                            onRedeem: { redeemingReward = reward }
                        )
                    }
                }

                if !store.redemptions.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("YOUR REDEMPTIONS").mtEyebrow()
                        ForEach(store.redemptions) { redemption in
                            HStack {
                                Text(redemption.code)
                                    .font(MTFont.label(14, weight: .bold))
                                Spacer()
                                Text(redemption.status.rawValue.capitalized)
                                    .font(.footnote)
                                    .foregroundStyle(MTColor.inkMuted)
                            }
                            .padding(.vertical, 8)
                        }
                    }
                    .padding(.top, 8)
                }
            }
            .padding(24)
        }
        .background(MTColor.backgroundSage.ignoresSafeArea())
        .alert(item: $redeemingReward) { reward in
            Alert(
                title: Text("Redeem \(reward.title)?"),
                message: Text("This will use \(reward.pointsCost) points."),
                primaryButton: .default(Text("Redeem")) {
                    Task { await store.redeem(reward) }
                },
                secondaryButton: .cancel()
            )
        }
    }
}

private struct RewardRow: View {
    let reward: Reward
    let pointsBalance: Int
    let onRedeem: () -> Void

    private var canAfford: Bool { pointsBalance >= reward.pointsCost }

    var body: some View {
        MTCard {
            HStack(alignment: .top, spacing: 16) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(reward.title)
                        .font(MTFont.label(16, weight: .bold))
                        .foregroundStyle(MTColor.ink)
                    if let description = reward.description {
                        Text(description)
                            .font(.footnote)
                            .foregroundStyle(MTColor.inkMuted)
                    }
                    Text("\(reward.pointsCost) points")
                        .font(MTFont.label(13, weight: .bold))
                        .foregroundStyle(MTColor.gold)
                }
                Spacer()
                Button("REDEEM", action: onRedeem)
                    .font(MTFont.label(11.5, weight: .bold))
                    .foregroundStyle(canAfford ? MTColor.goldFoil : MTColor.inkMuted)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(canAfford ? MTColor.charcoal : MTColor.hairline)
                    .clipShape(Capsule())
                    .disabled(!canAfford)
            }
            .padding(18)
        }
    }
}
