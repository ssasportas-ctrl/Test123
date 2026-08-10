import SwiftUI

enum MTColor {
    // Sidebar is now a deep charcoal (was sage green) — kept the same token
    // name so every call site picks up the new look without edits.
    static let sidebarSage = Color(hex: "14130F")
    static let backgroundSage = Color(hex: "F6F4EE")
    static let card = Color(hex: "FFFFFF")
    static let gold = Color(hex: "A9814A")
    static let goldDeep = Color(hex: "8A6836")
    static let goldFoil = Color(hex: "E4C989")
    static let charcoal = Color(hex: "14130F")
    static let charcoalDeep = Color(hex: "201D16")
    static let ink = Color(hex: "1B1A16")
    static let inkMuted = Color(hex: "7C7669")
    static let hairline = Color(hex: "E7E2D5")
    static let danger = Color(hex: "A6453A")
}

enum MTFont {
    static func serif(_ size: CGFloat, weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .serif)
    }

    static func label(_ size: CGFloat = 12, weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .default)
    }
}

extension View {
    /// Uppercase, letter-spaced small caption used throughout MeritOne (e.g. "WELCOME BACK", "POINTS").
    func mtEyebrow(color: Color = MTColor.goldDeep) -> some View {
        self
            .font(MTFont.label(11.5, weight: .bold))
            .tracking(1.5)
            .foregroundStyle(color)
    }
}

extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)
        let r = Double((rgb & 0xFF0000) >> 16) / 255
        let g = Double((rgb & 0x00FF00) >> 8) / 255
        let b = Double(rgb & 0x0000FF) / 255
        self.init(red: r, green: g, blue: b)
    }
}

struct MTCard<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        content
            .background(MTColor.card)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .strokeBorder(MTColor.hairline, lineWidth: 1)
            )
            .shadow(color: MTColor.ink.opacity(0.03), radius: 2, y: 1)
    }
}

/// Dark foil membership-card surface — the signature element of the redesign,
/// used only for the Home insider card.
struct MTFoilCard<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        content
            .background(
                LinearGradient(
                    colors: [MTColor.charcoalDeep, MTColor.charcoal, Color(hex: "0E0D0A")],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .strokeBorder(Color(hex: "2C2818"), lineWidth: 1)
            )
            .shadow(color: MTColor.charcoal.opacity(0.35), radius: 24, y: 14)
    }
}
