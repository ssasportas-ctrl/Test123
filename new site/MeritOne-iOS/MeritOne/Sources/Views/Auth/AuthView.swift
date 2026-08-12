import SwiftUI

struct AuthView: View {
    @EnvironmentObject private var session: SessionManager
    @State private var email = ""
    @State private var fullName = ""
    @State private var otp = ""
    @State private var pendingUserId: String?
    @State private var stage: Stage = .enterEmail
    @State private var isSubmitting = false
    @State private var errorMessage: String?

    private enum Stage { case enterEmail, enterCode }

    var body: some View {
        ZStack {
            MTColor.backgroundSage.ignoresSafeArea()

            VStack(spacing: 28) {
                Spacer()

                Text("MeritOne")
                    .font(MTFont.serif(30))
                    .foregroundStyle(MTColor.ink)

                MTCard {
                    VStack(alignment: .leading, spacing: 16) {
                        Text(stage == .enterEmail ? "SIGN IN" : "ENTER CODE")
                            .mtEyebrow()

                        if stage == .enterEmail {
                            Text("Welcome back")
                                .font(MTFont.serif(24))
                                .foregroundStyle(MTColor.ink)

                            TextField("Full name (first time only)", text: $fullName)
                                .textContentType(.name)
                                .padding(14)
                                .background(MTColor.backgroundSage.opacity(0.5))
                                .clipShape(RoundedRectangle(cornerRadius: 12))

                            TextField("Email address", text: $email)
                                .textContentType(.emailAddress)
                                .keyboardType(.emailAddress)
                                .textInputAutocapitalization(.never)
                                .autocorrectionDisabled()
                                .padding(14)
                                .background(MTColor.backgroundSage.opacity(0.5))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        } else {
                            Text("Check your email")
                                .font(MTFont.serif(24))
                                .foregroundStyle(MTColor.ink)
                            Text("We sent a 6-digit code to \(email)")
                                .font(.subheadline)
                                .foregroundStyle(MTColor.inkMuted)

                            TextField("6-digit code", text: $otp)
                                .keyboardType(.numberPad)
                                .padding(14)
                                .background(MTColor.backgroundSage.opacity(0.5))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }

                        if let errorMessage {
                            Text(errorMessage)
                                .font(.footnote)
                                .foregroundStyle(MTColor.danger)
                        }

                        Button(action: primaryAction) {
                            HStack {
                                Spacer()
                                if isSubmitting {
                                    ProgressView().tint(.white)
                                } else {
                                    Text(stage == .enterEmail ? "Continue" : "Verify & Sign In")
                                        .font(MTFont.label(15, weight: .bold))
                                }
                                Spacer()
                            }
                            .padding(14)
                            .background(MTColor.charcoal)
                            .foregroundStyle(MTColor.goldFoil)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                            .opacity(isSubmitting || (stage == .enterEmail ? email.isEmpty : otp.isEmpty) ? 0.5 : 1)
                        }
                        .disabled(isSubmitting || (stage == .enterEmail ? email.isEmpty : otp.isEmpty))
                    }
                    .padding(20)
                }
                .padding(.horizontal, 24)

                Spacer()
                Spacer()
            }
        }
    }

    private func primaryAction() {
        errorMessage = nil
        isSubmitting = true
        Task {
            defer { isSubmitting = false }
            do {
                if stage == .enterEmail {
                    pendingUserId = try await AppwriteService.shared.sendEmailOTP(email: email)
                    stage = .enterCode
                } else if let pendingUserId {
                    try await AppwriteService.shared.verifyOTP(userId: pendingUserId, secret: otp)
                    if !fullName.isEmpty {
                        try? await AppwriteService.shared.updateName(fullName)
                    }
                    session.markSignedIn()
                }
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }
}
