import Foundation

@MainActor
final class AppStore: ObservableObject {
    @Published var patient: Patient?
    @Published var loyaltySettings: LoyaltySettings?
    @Published var ledger: [PointsLedgerEntry] = []
    @Published var milestones: [Milestone] = []
    @Published var rewards: [Reward] = []
    @Published var redemptions: [Redemption] = []
    @Published var services: [Service] = []
    @Published var products: [Product] = []
    @Published var activeMembership: PatientMembership?
    @Published var membershipPlans: [MembershipPlan] = []

    @Published var isLoading = false
    @Published var errorMessage: String?

    private let service = SupabaseService.shared

    var summary: LoyaltySummary {
        let pointsBalance = ledger.reduce(0) { $0 + $1.points }
        // Each "earn" entry is posted per completed visit/purchase, so its count doubles as visit count.
        let visitCount = ledger.filter { $0.entryType == .earn }.count
        let creditsRedeemed = redemptions
            .filter { $0.status == .active || $0.status == .redeemed }
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

    func loadEverything() async {
        guard let userId = await service.currentUserId else { return }
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let patient = try await service.fetchPatient(id: userId)
            self.patient = patient

            async let settings = service.fetchLoyaltySettings(practiceId: patient.practiceId)
            async let ledgerEntries = service.fetchPointsLedger(patientId: patient.id)
            async let milestoneList = service.fetchMilestones(practiceId: patient.practiceId)
            async let rewardList = service.fetchRewards(practiceId: patient.practiceId)
            async let redemptionList = service.fetchRedemptions(patientId: patient.id)
            async let serviceList = service.fetchServices(practiceId: patient.practiceId)
            async let productList = service.fetchProducts(practiceId: patient.practiceId)
            async let membership = service.fetchActiveMembership(patientId: patient.id)
            async let membershipPlanList = service.fetchMembershipPlans(practiceId: patient.practiceId)

            self.loyaltySettings = try await settings
            self.ledger = try await ledgerEntries
            self.milestones = try await milestoneList
            self.rewards = try await rewardList
            self.redemptions = try await redemptionList
            self.services = try await serviceList
            self.products = try await productList
            self.activeMembership = try await membership
            self.membershipPlans = try await membershipPlanList
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func redeem(_ reward: Reward) async {
        guard patient != nil else { return }
        do {
            let redemption = try await service.redeemReward(reward: reward)
            redemptions.insert(redemption, at: 0)
            await loadEverything() // balance changed server-side; re-sync the ledger
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
