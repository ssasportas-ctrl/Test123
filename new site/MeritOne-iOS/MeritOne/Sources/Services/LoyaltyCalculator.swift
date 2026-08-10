import Foundation

enum LoyaltyCalculator {
    static func summary(ledger: [PointsLedgerEntry], redemptions: [Redemption], milestones: [Milestone]) -> LoyaltySummary {
        let pointsBalance = ledger.reduce(0) { $0 + $1.points }
        // Each "earn" entry is posted per completed visit/purchase, so its count doubles as visit count.
        let visitCount = ledger.filter { $0.entryType == .earn }.count
        // Only "active" redemptions (spent points, not yet used at checkout) count toward
        // the spendable credit balance — once staff mark one "redeemed" its value is spent.
        let creditsRedeemed = redemptions
            .filter { $0.status == .active }
            .reduce(0) { $0 + $1.creditValue }
        let nextMilestone = milestones.first { $0.visitCount > visitCount }

        return LoyaltySummary(
            pointsBalance: max(0, pointsBalance),
            creditBalance: creditsRedeemed,
            visitCount: visitCount,
            tierLabel: "Insider",
            nextMilestone: nextMilestone
        )
    }
}
