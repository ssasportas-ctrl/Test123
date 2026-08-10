import SwiftUI

struct CheckInView: View {
    @EnvironmentObject private var store: AppStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Spacer()

                Text("SHOW AT FRONT DESK").mtEyebrow()

                if let code = store.patient?.referralCode {
                    Image(systemName: "qrcode")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 220, height: 220)
                        .foregroundStyle(MTColor.ink)
                        .padding(24)
                        .background(MTColor.card)
                        .clipShape(RoundedRectangle(cornerRadius: 20))

                    Text(code)
                        .font(MTFont.label(18, weight: .bold))
                        .tracking(3)
                        .foregroundStyle(MTColor.inkMuted)
                }

                Text("Staff will scan this to log your visit and add points.")
                    .font(.subheadline)
                    .foregroundStyle(MTColor.inkMuted)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)

                Spacer()
            }
            .background(MTColor.backgroundSage.ignoresSafeArea())
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}
