import Foundation

struct Practice: Codable, Identifiable, Hashable {
    let id: UUID
    let name: String
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id, name
        case createdAt = "created_at"
    }
}

struct Patient: Codable, Identifiable, Hashable {
    let id: UUID
    let practiceId: UUID
    let fullName: String
    let phone: String?
    let email: String
    let referralCode: String
    let referredBy: UUID?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id, phone, email
        case practiceId = "practice_id"
        case fullName = "full_name"
        case referralCode = "referral_code"
        case referredBy = "referred_by"
        case createdAt = "created_at"
    }
}

struct LoyaltySettings: Codable, Hashable {
    let practiceId: UUID
    let pointsPerDollar: Double
    let pointsToDollarRedemption: Double
    let referralBonusPoints: Int

    enum CodingKeys: String, CodingKey {
        case practiceId = "practice_id"
        case pointsPerDollar = "points_per_dollar"
        case pointsToDollarRedemption = "points_to_dollar_redemption"
        case referralBonusPoints = "referral_bonus_points"
    }
}

enum PointsEntryType: String, Codable {
    case earn, redeem, adjustment
    case referralBonus = "referral_bonus"
    case milestoneBonus = "milestone_bonus"
}

struct PointsLedgerEntry: Codable, Identifiable, Hashable {
    let id: UUID
    let patientId: UUID
    let practiceId: UUID
    let entryType: PointsEntryType
    let points: Int
    let dollarAmount: Double?
    let note: String?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id, points, note
        case patientId = "patient_id"
        case practiceId = "practice_id"
        case entryType = "entry_type"
        case dollarAmount = "dollar_amount"
        case createdAt = "created_at"
    }
}

struct Reward: Codable, Identifiable, Hashable {
    let id: UUID
    let practiceId: UUID
    let title: String
    let description: String?
    let pointsCost: Int
    let creditValue: Double
    let imageUrl: String?
    let active: Bool

    enum CodingKeys: String, CodingKey {
        case id, title, description, active
        case practiceId = "practice_id"
        case pointsCost = "points_cost"
        case creditValue = "credit_value"
        case imageUrl = "image_url"
    }
}

enum RedemptionStatus: String, Codable {
    case active, redeemed, expired, cancelled
}

struct Redemption: Codable, Identifiable, Hashable {
    let id: UUID
    let patientId: UUID
    let rewardId: UUID
    let pointsSpent: Int
    let creditValue: Double
    let code: String
    let status: RedemptionStatus
    let redeemedAt: Date?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id, code, status
        case patientId = "patient_id"
        case rewardId = "reward_id"
        case pointsSpent = "points_spent"
        case creditValue = "credit_value"
        case redeemedAt = "redeemed_at"
        case createdAt = "created_at"
    }
}

struct Milestone: Codable, Identifiable, Hashable {
    let id: UUID
    let practiceId: UUID
    let visitCount: Int
    let bonusPoints: Int
    let label: String
    let active: Bool

    enum CodingKeys: String, CodingKey {
        case id, label, active
        case practiceId = "practice_id"
        case visitCount = "visit_count"
        case bonusPoints = "bonus_points"
    }
}

struct MembershipPlan: Codable, Identifiable, Hashable {
    let id: UUID
    let practiceId: UUID
    let name: String
    let description: String?
    let monthlyPrice: Double?
    let active: Bool

    enum CodingKeys: String, CodingKey {
        case id, name, description, active
        case practiceId = "practice_id"
        case monthlyPrice = "monthly_price"
    }
}

struct PatientMembership: Codable, Identifiable, Hashable {
    let id: UUID
    let patientId: UUID
    let planId: UUID?
    let status: String
    let currentPeriodEnd: Date?

    enum CodingKeys: String, CodingKey {
        case id, status
        case patientId = "patient_id"
        case planId = "plan_id"
        case currentPeriodEnd = "current_period_end"
    }
}

struct Service: Codable, Identifiable, Hashable {
    let id: UUID
    let practiceId: UUID
    let name: String
    let description: String?
    let price: Double?
    let memberPrice: Double?
    let bookingUrl: String
    let category: String?
    let featured: Bool
    let active: Bool

    enum CodingKeys: String, CodingKey {
        case id, name, description, price, category, featured, active
        case practiceId = "practice_id"
        case memberPrice = "member_price"
        case bookingUrl = "booking_url"
    }
}

struct Product: Codable, Identifiable, Hashable {
    let id: UUID
    let practiceId: UUID
    let name: String
    let description: String?
    let price: Double
    let imageUrl: String?
    let active: Bool

    enum CodingKeys: String, CodingKey {
        case id, name, description, price, active
        case practiceId = "practice_id"
        case imageUrl = "image_url"
    }
}

/// Client-side aggregate derived from `points_ledger` + `patient_memberships`, not a single table.
struct LoyaltySummary: Hashable {
    var pointsBalance: Int = 0
    var creditBalance: Double = 0
    var visitCount: Int = 0
    var tierLabel: String = "Insider"
    var nextMilestone: Milestone?
}
