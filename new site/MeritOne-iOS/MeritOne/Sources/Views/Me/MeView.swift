import SwiftUI

struct MeView: View {
    @EnvironmentObject private var store: AppStore
    @EnvironmentObject private var session: SessionManager
    @State private var language = "EN"

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("ACCOUNT").mtEyebrow()
                    Text("Me")
                        .font(MTFont.serif(34))
                        .foregroundStyle(MTColor.ink)
                }

                MTCard {
                    VStack(alignment: .leading, spacing: 14) {
                        infoRow(label: "Name", value: store.patient?.fullName ?? "—")
                        Divider().overlay(MTColor.hairline)
                        infoRow(label: "Email", value: store.patient?.email ?? "—")
                        Divider().overlay(MTColor.hairline)
                        infoRow(label: "Referral Code", value: store.patient?.referralCode ?? "—")
                    }
                    .padding(18)
                }

                MTCard {
                    HStack {
                        Text("Language").font(.subheadline).foregroundStyle(MTColor.inkMuted)
                        Spacer()
                        HStack(spacing: 12) {
                            languagePill("EN")
                            Text("|").foregroundStyle(MTColor.hairline)
                            languagePill("ES")
                        }
                    }
                    .padding(18)
                }

                if let membership = store.activeMembership {
                    MTCard {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("MEMBERSHIP").mtEyebrow()
                            Text(membership.status.capitalized)
                                .font(MTFont.serif(20))
                                .foregroundStyle(MTColor.ink)
                        }
                        .padding(18)
                    }
                }

                Button {
                    Task {
                        try? await SupabaseService.shared.signOut()
                        session.isSignedIn = false
                    }
                } label: {
                    Text("Sign Out")
                        .font(MTFont.label(15, weight: .bold))
                        .foregroundStyle(MTColor.danger)
                        .frame(maxWidth: .infinity)
                        .padding(14)
                }
                .buttonStyle(.plain)
                .background(MTColor.card)
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).strokeBorder(MTColor.hairline))
            }
            .padding(24)
        }
        .background(MTColor.backgroundSage.ignoresSafeArea())
    }

    private func languagePill(_ code: String) -> some View {
        Button {
            language = code
        } label: {
            Text(code)
                .font(MTFont.label(12, weight: .bold))
                .foregroundStyle(language == code ? MTColor.goldDeep : MTColor.inkMuted)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(language == code ? MTColor.gold.opacity(0.12) : Color.clear)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }

    private func infoRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundStyle(MTColor.inkMuted)
            Spacer()
            Text(value)
                .font(MTFont.label(14, weight: .semibold))
                .foregroundStyle(MTColor.ink)
        }
    }
}
