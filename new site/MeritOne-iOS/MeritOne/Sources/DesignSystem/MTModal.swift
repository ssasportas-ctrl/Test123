import SwiftUI

/// Bottom-sheet content shell shared by the Home quick-action sheets
/// (Membership, Gift Cards, Refer) — mirrors rewards-app's Modal.jsx.
struct MTModal<Content: View>: View {
    let eyebrow: String
    let title: String
    let onClose: () -> Void
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text(eyebrow).mtEyebrow()
            Text(title)
                .font(MTFont.serif(24))
                .foregroundStyle(MTColor.ink)

            content

            Button("Close", action: onClose)
                .font(MTFont.label(13.5, weight: .semibold))
                .foregroundStyle(MTColor.ink)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 13)
                .overlay(RoundedRectangle(cornerRadius: 999).strokeBorder(MTColor.hairline))
        }
        .padding(24)
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .background(MTColor.backgroundSage.ignoresSafeArea())
    }
}
