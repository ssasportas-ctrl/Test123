import Foundation

/// Static contact/booking info for the practice, sourced from the live site
/// (angela-azar-md-pc.netlify.app). Mirrors rewards-app/src/lib/practice.js.
enum PracticeInfo {
    static let siteURL = URL(string: "https://angela-azar-md-pc.netlify.app")!
    static let bookingURL = URL(string: "https://angela-azar-md-pc.netlify.app/book-appointment.html")!
    static let phone = "516-715-4123"
    static let phoneURL = URL(string: "tel:5167154123")!
}
