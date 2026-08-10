import XCTest
@testable import MeritOne

final class LoyaltyCalculatorTests: XCTestCase {
    private let practiceId = UUID()
    private let patientId = UUID()

    private func earn(_ points: Int) -> PointsLedgerEntry {
        PointsLedgerEntry(id: UUID(), patientId: patientId, practiceId: practiceId, entryType: .earn, points: points, dollarAmount: nil, note: nil, createdAt: Date())
    }

    private func ledgerEntry(_ type: PointsEntryType, _ points: Int) -> PointsLedgerEntry {
        PointsLedgerEntry(id: UUID(), patientId: patientId, practiceId: practiceId, entryType: type, points: points, dollarAmount: nil, note: nil, createdAt: Date())
    }

    private func redemption(_ creditValue: Double, status: RedemptionStatus) -> Redemption {
        Redemption(id: UUID(), patientId: patientId, rewardId: UUID(), pointsSpent: 0, creditValue: creditValue, code: "CODE", status: status, redeemedAt: nil, createdAt: Date())
    }

    private func milestone(_ visitCount: Int, _ bonusPoints: Int) -> Milestone {
        Milestone(id: UUID(), practiceId: practiceId, visitCount: visitCount, bonusPoints: bonusPoints, label: "Milestone", active: true)
    }

    func testSumsPointsAcrossLedgerEntries() {
        let summary = LoyaltyCalculator.summary(ledger: [earn(100), earn(100)], redemptions: [], milestones: [])
        XCTAssertEqual(summary.pointsBalance, 200)
    }

    func testNeverReturnsNegativePointsBalance() {
        let ledger = [earn(100), ledgerEntry(.redeem, -250)]
        let summary = LoyaltyCalculator.summary(ledger: ledger, redemptions: [], milestones: [])
        XCTAssertEqual(summary.pointsBalance, 0)
    }

    func testCountsVisitsAsEarnEntriesOnly() {
        let ledger = [earn(100), earn(100), ledgerEntry(.referralBonus, 50)]
        let summary = LoyaltyCalculator.summary(ledger: ledger, redemptions: [], milestones: [])
        XCTAssertEqual(summary.visitCount, 2)
    }

    func testCreditBalanceIncludesOnlyActiveRedemptions() {
        let redemptions = [redemption(25, status: .active), redemption(10, status: .redeemed), redemption(5, status: .cancelled)]
        let summary = LoyaltyCalculator.summary(ledger: [], redemptions: redemptions, milestones: [])
        XCTAssertEqual(summary.creditBalance, 25)
    }

    func testPicksNearestMilestoneAboveCurrentVisitCount() {
        let ledger = [earn(100), earn(100), earn(100)]
        let milestones = [milestone(2, 20), milestone(5, 50), milestone(10, 100)]
        let summary = LoyaltyCalculator.summary(ledger: ledger, redemptions: [], milestones: milestones)
        XCTAssertEqual(summary.nextMilestone?.visitCount, 5)
        XCTAssertEqual(summary.nextMilestone?.bonusPoints, 50)
    }

    func testReturnsNilNextMilestoneOnceEveryMilestonePassed() {
        let ledger = [earn(100), earn(100), earn(100)]
        let summary = LoyaltyCalculator.summary(ledger: ledger, redemptions: [], milestones: [milestone(1, 10)])
        XCTAssertNil(summary.nextMilestone)
    }
}
