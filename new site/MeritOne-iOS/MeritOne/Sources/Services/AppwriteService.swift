import Foundation

/// Minimal Appwrite REST client.
///
/// The official Swift SDK isn't used: it pulls swift-nio versions that need
/// Swift 5.9+, and this project builds on Swift 5.8. The app only needs a
/// handful of endpoints, so they're called directly over URLSession.
final class AppwriteService {
    static let shared = AppwriteService()

    private let session = URLSession(configuration: .default)
    private let decoder: JSONDecoder
    private let sessionSecretKey = "appwrite.session.secret"

    private init() {
        decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let text = try decoder.singleValueContainer().decode(String.self)
            if let date = AppwriteService.isoFormatter.date(from: text) { return date }
            if let date = AppwriteService.isoFormatterNoFraction.date(from: text) { return date }
            throw DecodingError.dataCorruptedError(in: try decoder.singleValueContainer(),
                                                   debugDescription: "Unrecognised date: \(text)")
        }
    }

    private static let isoFormatter: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()

    private static let isoFormatterNoFraction: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()

    // MARK: - Session storage

    private(set) var sessionSecret: String? {
        get { UserDefaults.standard.string(forKey: sessionSecretKey) }
        set {
            if let newValue { UserDefaults.standard.set(newValue, forKey: sessionSecretKey) }
            else { UserDefaults.standard.removeObject(forKey: sessionSecretKey) }
        }
    }

    var hasSession: Bool { sessionSecret != nil }

    // MARK: - Request plumbing

    struct APIError: LocalizedError {
        let message: String
        var errorDescription: String? { message }
    }

    private struct ErrorPayload: Decodable { let message: String }

    private func request(
        _ method: String,
        _ path: String,
        query: [URLQueryItem] = [],
        body: [String: Any]? = nil
    ) async throws -> Data {
        var components = URLComponents(url: Config.appwriteEndpoint.appendingPathComponent(path),
                                       resolvingAgainstBaseURL: false)!
        if !query.isEmpty { components.queryItems = query }

        var req = URLRequest(url: components.url!)
        req.httpMethod = method
        req.setValue(Config.appwriteProjectId, forHTTPHeaderField: "X-Appwrite-Project")
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let sessionSecret { req.setValue(sessionSecret, forHTTPHeaderField: "X-Appwrite-Session") }
        if let body { req.httpBody = try JSONSerialization.data(withJSONObject: body) }

        let (data, response) = try await session.data(for: req)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(status) else {
            let message = (try? JSONDecoder().decode(ErrorPayload.self, from: data))?.message
                ?? "Request failed (\(status))"
            throw APIError(message: message)
        }
        return data
    }

    private struct DocumentList<T: Decodable>: Decodable {
        let documents: [T]
    }

    private func listDocuments<T: Decodable>(_ collection: String, queries: [String] = []) async throws -> [T] {
        var items = queries.map { URLQueryItem(name: "queries[]", value: $0) }
        items.append(URLQueryItem(name: "queries[]", value: #"{"method":"limit","values":[500]}"#))
        let data = try await request("GET", "databases/\(Config.databaseId)/collections/\(collection)/documents",
                                     query: items)
        return try decoder.decode(DocumentList<T>.self, from: data).documents
    }

    private func equal(_ attribute: String, _ value: Any) -> String {
        let encoded = (try? JSONSerialization.data(withJSONObject: ["method": "equal", "attribute": attribute, "values": [value]]))
            .flatMap { String(data: $0, encoding: .utf8) }
        return encoded ?? ""
    }

    private func order(_ attribute: String, descending: Bool) -> String {
        let method = descending ? "orderDesc" : "orderAsc"
        let encoded = (try? JSONSerialization.data(withJSONObject: ["method": method, "attribute": attribute, "values": []]))
            .flatMap { String(data: $0, encoding: .utf8) }
        return encoded ?? ""
    }

    // MARK: - Auth

    private struct Token: Decodable { let userId: String }
    private struct Session: Decodable { let secret: String }
    struct Account: Decodable {
        let id: String
        let name: String
        let email: String
        enum CodingKeys: String, CodingKey {
            case id = "$id"
            case name, email
        }
    }

    /// Sends a one-time code. Returns the user id needed to complete sign-in.
    func sendEmailOTP(email: String) async throws -> String {
        let data = try await request("POST", "account/tokens/email",
                                     body: ["userId": "unique()", "email": email])
        return try decoder.decode(Token.self, from: data).userId
    }

    func verifyOTP(userId: String, secret: String) async throws {
        let data = try await request("POST", "account/sessions/token",
                                     body: ["userId": userId, "secret": secret])
        sessionSecret = try decoder.decode(Session.self, from: data).secret
    }

    func currentAccount() async throws -> Account {
        let data = try await request("GET", "account")
        return try decoder.decode(Account.self, from: data)
    }

    func updateName(_ name: String) async throws {
        _ = try await request("PATCH", "account/name", body: ["name": name])
    }

    func signOut() async {
        _ = try? await request("DELETE", "account/sessions/current")
        sessionSecret = nil
    }

    // MARK: - Patient

    func fetchPatient(id: String) async throws -> Patient {
        let data = try await request("GET", "databases/\(Config.databaseId)/collections/patients/documents/\(id)")
        return try decoder.decode(Patient.self, from: data)
    }

    /// Mirrors the web client: migrated patients already have a document, new
    /// sign-ups create their own (allowed by the collection's create permission).
    func fetchOrCreatePatient(account: Account) async throws -> Patient {
        do {
            return try await fetchPatient(id: account.id)
        } catch let error as APIError where error.message.lowercased().contains("could not be found") {
            let code = String(UUID().uuidString.replacingOccurrences(of: "-", with: "").prefix(6)).uppercased()
            let body: [String: Any] = [
                "documentId": account.id,
                "data": [
                    "practice_id": Config.practiceId,
                    "full_name": account.name.isEmpty ? String(account.email.split(separator: "@").first ?? "Guest") : account.name,
                    "email": account.email,
                    "referral_code": code,
                    "created_at": AppwriteService.isoFormatter.string(from: Date()),
                ],
                "permissions": ["read(\"user:\(account.id)\")", "update(\"user:\(account.id)\")"],
            ]
            let data = try await request("POST", "databases/\(Config.databaseId)/collections/patients/documents", body: body)
            return try decoder.decode(Patient.self, from: data)
        }
    }

    func fetchLoyaltySettings(practiceId: String) async throws -> LoyaltySettings? {
        try await listDocuments("loyalty_settings", queries: [equal("practice_id", practiceId)]).first
    }

    func fetchPointsLedger(patientId: String) async throws -> [PointsLedgerEntry] {
        try await listDocuments("points_ledger",
                                queries: [equal("patient_id", patientId), order("created_at", descending: true)])
    }

    func fetchMilestones(practiceId: String) async throws -> [Milestone] {
        try await listDocuments("milestones",
                                queries: [equal("practice_id", practiceId), equal("active", true),
                                          order("visit_count", descending: false)])
    }

    func fetchRewards(practiceId: String) async throws -> [Reward] {
        try await listDocuments("rewards",
                                queries: [equal("practice_id", practiceId), equal("active", true),
                                          order("points_cost", descending: false)])
    }

    func fetchRedemptions(patientId: String) async throws -> [Redemption] {
        try await listDocuments("redemptions",
                                queries: [equal("patient_id", patientId), order("created_at", descending: true)])
    }

    func fetchServices(practiceId: String) async throws -> [Service] {
        try await listDocuments("services", queries: [equal("practice_id", practiceId), equal("active", true)])
    }

    func fetchProducts(practiceId: String) async throws -> [Product] {
        try await listDocuments("products", queries: [equal("practice_id", practiceId), equal("active", true)])
    }

    func fetchMembershipPlans(practiceId: String) async throws -> [MembershipPlan] {
        try await listDocuments("membership_plans", queries: [equal("practice_id", practiceId), equal("active", true)])
    }

    func fetchActiveMembership(patientId: String) async throws -> PatientMembership? {
        try await listDocuments("patient_memberships",
                                queries: [equal("patient_id", patientId), equal("status", "active")]).first
    }

    // MARK: - Redemption

    private struct Execution: Decodable { let responseBody: String }
    private struct ExecutionError: Decodable { let error: String? }

    /// The balance check and point deduction run server-side so a client can't
    /// mint a redemption without spending points.
    func redeemReward(rewardId: String) async throws -> Redemption {
        let payload = String(data: try JSONSerialization.data(withJSONObject: ["rewardId": rewardId]), encoding: .utf8)!
        let data = try await request("POST", "functions/redeemReward/executions",
                                     body: ["body": payload, "async": false])
        let responseBody = try decoder.decode(Execution.self, from: data).responseBody
        let bodyData = Data(responseBody.utf8)
        if let failure = try? JSONDecoder().decode(ExecutionError.self, from: bodyData), let message = failure.error {
            throw APIError(message: message)
        }
        return try decoder.decode(Redemption.self, from: bodyData)
    }
}
