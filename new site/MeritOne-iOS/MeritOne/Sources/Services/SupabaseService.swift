import Foundation
import Supabase

final class SupabaseService {
    static let shared = SupabaseService()

    let client: SupabaseClient

    private init() {
        client = SupabaseClient(supabaseURL: Config.supabaseURL, supabaseKey: Config.supabaseAnonKey)
    }

    // MARK: - Auth

    var currentUserId: UUID? {
        get async {
            try? await client.auth.session.user.id
        }
    }

    /// `role: "patient"` metadata is required by the `handle_new_patient_user` DB trigger
    /// to auto-create the matching `patients` row on sign-up.
    func signInWithOTP(email: String, fullName: String) async throws {
        try await client.auth.signInWithOTP(email: email, data: ["role": "patient", "full_name": .string(fullName)])
    }

    func verifyOTP(email: String, token: String) async throws {
        try await client.auth.verifyOTP(email: email, token: token, type: .email)
    }

    func signOut() async throws {
        try await client.auth.signOut()
    }

    // MARK: - Patient

    func fetchPatient(id: UUID) async throws -> Patient {
        try await client.database.from("patients")
            .select()
            .eq("id", value: id)
            .single()
            .execute()
            .value
    }

    func fetchLoyaltySettings(practiceId: UUID) async throws -> LoyaltySettings {
        try await client.database.from("loyalty_settings")
            .select()
            .eq("practice_id", value: practiceId)
            .single()
            .execute()
            .value
    }

    func fetchPointsLedger(patientId: UUID) async throws -> [PointsLedgerEntry] {
        try await client.database.from("points_ledger")
            .select()
            .eq("patient_id", value: patientId)
            .order("created_at", ascending: false)
            .execute()
            .value
    }

    func fetchMilestones(practiceId: UUID) async throws -> [Milestone] {
        try await client.database.from("milestones")
            .select()
            .eq("practice_id", value: practiceId)
            .eq("active", value: true)
            .order("visit_count", ascending: true)
            .execute()
            .value
    }

    func fetchRewards(practiceId: UUID) async throws -> [Reward] {
        try await client.database.from("rewards")
            .select()
            .eq("practice_id", value: practiceId)
            .eq("active", value: true)
            .order("points_cost", ascending: true)
            .execute()
            .value
    }

    func fetchRedemptions(patientId: UUID) async throws -> [Redemption] {
        try await client.database.from("redemptions")
            .select()
            .eq("patient_id", value: patientId)
            .order("created_at", ascending: false)
            .execute()
            .value
    }

    /// Server-side RPC: validates points balance, inserts the redemption, and deducts
    /// points atomically. Patients have no direct INSERT policy on `redemptions`.
    func redeemReward(reward: Reward) async throws -> Redemption {
        struct Params: Encodable { let p_reward_id: UUID }
        return try await client.database.rpc("redeem_reward", params: Params(p_reward_id: reward.id))
            .single()
            .execute()
            .value
    }

    func fetchServices(practiceId: UUID) async throws -> [Service] {
        try await client.database.from("services")
            .select()
            .eq("practice_id", value: practiceId)
            .eq("active", value: true)
            .execute()
            .value
    }

    func fetchProducts(practiceId: UUID) async throws -> [Product] {
        try await client.database.from("products")
            .select()
            .eq("practice_id", value: practiceId)
            .eq("active", value: true)
            .execute()
            .value
    }

    func fetchMembershipPlans(practiceId: UUID) async throws -> [MembershipPlan] {
        try await client.database.from("membership_plans")
            .select()
            .eq("practice_id", value: practiceId)
            .eq("active", value: true)
            .execute()
            .value
    }

    func fetchActiveMembership(patientId: UUID) async throws -> PatientMembership? {
        let memberships: [PatientMembership] = try await client.database.from("patient_memberships")
            .select()
            .eq("patient_id", value: patientId)
            .eq("status", value: "active")
            .execute()
            .value
        return memberships.first
    }
}
