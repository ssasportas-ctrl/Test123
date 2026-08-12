import Foundation

enum Config {
    static let appwriteEndpoint = URL(string: "https://nyc.cloud.appwrite.io/v1")!
    // Project id is public by design; access is enforced by Appwrite permissions.
    static let appwriteProjectId = "6a7c84a300376e2da9e6"
    static let databaseId = "meritone"
    // Every patient belongs to this practice.
    static let practiceId = "00000000-0000-0000-0000-000000000001"
}
