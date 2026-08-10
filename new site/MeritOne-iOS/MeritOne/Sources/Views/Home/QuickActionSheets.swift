import SwiftUI

struct MembershipSheet: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss

    private var activePlan: MembershipPlan? {
        store.membershipPlans.first { $0.id == store.activeMembership?.planId }
    }

    var body: some View {
        MTModal(eyebrow: "MEMBERSHIP", title: activePlan?.name ?? "Membership", onClose: { dismiss() }) {
            if let membership = store.activeMembership {
                VStack(alignment: .leading, spacing: 8) {
                    (Text("Your membership is ") + Text(membership.status).foregroundColor(MTColor.ink).fontWeight(.semibold))
                        .font(.subheadline)
                        .foregroundStyle(MTColor.inkMuted)
                    if let description = activePlan?.description {
                        Text(description).font(.subheadline).foregroundStyle(MTColor.inkMuted)
                    }
                }
            } else {
                VStack(alignment: .leading, spacing: 12) {
                    Text("You don't have an active membership yet.")
                        .font(.subheadline)
                        .foregroundStyle(MTColor.inkMuted)

                    ForEach(store.membershipPlans) { plan in
                        MTCard {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(plan.name).font(MTFont.label(15, weight: .bold)).foregroundStyle(MTColor.ink)
                                if let description = plan.description {
                                    Text(description).font(.footnote).foregroundStyle(MTColor.inkMuted)
                                }
                                if let price = plan.monthlyPrice {
                                    Text("\(price, format: .currency(code: "USD"))/mo")
                                        .font(MTFont.label(13, weight: .bold))
                                        .foregroundStyle(MTColor.gold)
                                }
                            }
                            .padding(14)
                        }
                    }

                    Link(destination: PracticeInfo.bookingURL) {
                        Text("Ask About Membership")
                            .font(MTFont.label(14, weight: .bold))
                            .foregroundStyle(MTColor.goldFoil)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(MTColor.charcoal)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                    }
                }
            }
        }
    }
}

struct GiftCardSheet: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        MTModal(eyebrow: "GIFT CARDS", title: "Give MeritMD", onClose: { dismiss() }) {
            VStack(alignment: .leading, spacing: 14) {
                Text("Gift cards aren't available for online purchase yet. Call the office and our front desk can set one up for you over the phone.")
                    .font(.subheadline)
                    .foregroundStyle(MTColor.inkMuted)

                Link(destination: PracticeInfo.phoneURL) {
                    Text("Call \(PracticeInfo.phone)")
                        .font(MTFont.label(14, weight: .bold))
                        .foregroundStyle(MTColor.goldFoil)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(MTColor.charcoal)
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                }
            }
        }
    }
}

struct ReferSheet: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss
    @State private var copied = false

    private var code: String { store.patient?.referralCode ?? "" }
    private var bonus: Int { store.loyaltySettings?.referralBonusPoints ?? 100 }
    private var link: String { "\(PracticeInfo.siteURL.absoluteString)/book-appointment.html?ref=\(code)" }

    var body: some View {
        MTModal(eyebrow: "REFER A FRIEND", title: "Earn \(bonus) points", onClose: { dismiss() }) {
            VStack(alignment: .leading, spacing: 14) {
                Text("Share your code — when a friend books their first visit, you both get rewarded.")
                    .font(.subheadline)
                    .foregroundStyle(MTColor.inkMuted)

                Text(code.isEmpty ? "—" : code)
                    .font(MTFont.serif(28))
                    .tracking(4)
                    .foregroundStyle(MTColor.gold)

                Button {
                    UIPasteboard.general.string = link
                    copied = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2) { copied = false }
                } label: {
                    Text(copied ? "Link Copied!" : "Copy Referral Link")
                        .font(MTFont.label(14, weight: .bold))
                        .foregroundStyle(MTColor.goldFoil)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(MTColor.charcoal)
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .disabled(code.isEmpty)
                .opacity(code.isEmpty ? 0.5 : 1)
            }
        }
    }
}
