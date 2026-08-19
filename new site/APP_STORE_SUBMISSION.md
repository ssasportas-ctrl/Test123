# MeritOne iOS - Apple App Store Submission Guide

## Phase 1: Pre-Submission Preparation (1-2 weeks)

### 1.1 Accounts & Access
- [ ] Apple Developer Account ($99/year) - https://developer.apple.com
- [ ] App Store Connect access - https://appstoreconnect.apple.com
- [ ] Xcode 15+ installed on Mac
- [ ] Valid signing certificate & provisioning profiles

### 1.2 App Configuration

**Bundle ID:**
```
com.azardermatology.meritone
```

**Version & Build:**
- Initial Release: Version 1.0, Build 1
- Each submission: Increment build number (1, 2, 3...)
- Major updates: Increment version (1.0 → 1.1)

### 1.3 Create Required Documents

#### Privacy Policy
**Required by App Store - Must include:**

```
# MeritOne Privacy Policy

Last Updated: [DATE]

## Data We Collect
- Name and email address
- Phone number
- Appointment history
- Payment information (processed by Stripe)

## How We Use Data
- To book appointments
- To send appointment reminders
- To process payments
- To improve our service

## Data Security
- All data encrypted in transit
- PCI compliant payment processing via Stripe
- No sharing with third parties

## Your Rights
- You can request deletion of your data
- You can opt-out of communications
- Contact: privacy@azardermatology.com

## Contact Us
Angela Azar, MD PC
[Address]
[Phone]
[Email]
```

**Host it at:** https://your-domain.com/privacy-policy

#### Terms of Service
**Must include:**
- Service disclaimer (not medical advice)
- Cancellation policy
- Liability limitations
- User responsibilities
- Account terms

**Sample:**
```
# MeritOne Terms of Service

1. Medical Disclaimer
MeritOne is an appointment scheduling app. It does NOT provide medical 
advice, diagnosis, or treatment. Always consult with Dr. Angela Azar 
or a licensed healthcare provider.

2. Service Description
MeritOne allows patients to:
- Browse available services
- Book appointments
- Manage their appointment history
- Receive appointment reminders

3. Payment
Payments are processed by Stripe. By using MeritOne, you authorize 
charges to your payment method for booked services.

4. Cancellation
Cancellations must be made 24 hours before appointment.

5. Liability
MeritOne is provided "as-is". We are not liable for missed 
appointments or service delays.

6. User Conduct
Users must not:
- Use app for illegal purposes
- Harass staff
- Make false claims
- Reverse engineer the app
```

#### Support Email
- [ ] Create: support@azardermatology.com
- [ ] Set auto-responder
- [ ] Commit to 48-hour response time

---

## Phase 2: App Store Connect Setup (30 minutes)

### 2.1 Create App
1. Go to: https://appstoreconnect.apple.com
2. Click "My Apps" → "+"
3. Select "New App"
4. Fill in:
   - **Platform:** iOS
   - **App Name:** MeritOne
   - **Primary Language:** English
   - **Bundle ID:** com.azardermatology.meritone
   - **SKU:** MERITONE001 (any unique ID)

### 2.2 Fill Out App Information

**General Information:**
- App Name: `MeritOne`
- Subtitle: `Book Dermatology Appointments`
- Category: `Medical` or `Lifestyle`
- Content Rights: "This app does not contain content regulated by law"

**Age Rating:**
Ratings questionnaire - Select:
- No tobacco, alcohol, gambling
- No violence
- No mature content
- No medical/health restrictions
- Answer: **4+ years**

**Copyright:**
- Copyright: `2026 Angela Azar, MD PC`
- Trademark information: Not needed

---

## Phase 3: Marketing & Metadata (1-2 days)

### 3.1 Branding & Screenshots

**iPhone Screenshots** (Required - 6.5" display):
1. **Screen 1:** App launch / login screen
   - Text: "Book your dermatology appointment"
2. **Screen 2:** Services browsing
   - Show: Service images + pricing
   - Text: "Browse our services"
3. **Screen 3:** Booking appointment
   - Show: Calendar + location
   - Text: "Choose your preferred time"
4. **Screen 4:** Payment
   - Show: Stripe integration
   - Text: "Secure payment"
5. **Screen 5:** Confirmation
   - Show: Appointment confirmed
   - Text: "Ready to see you!"

**Screenshot Text:**
- Minimum 20pt font
- Contrasting colors (white text on dark background)
- No watermarks or status bar visible
- 1284 x 2778px (6.5" iPhone)

**iPad Screenshots (Optional but recommended):**
- 2048 x 2732px
- Same messaging as iPhone

### 3.2 App Preview Video (Optional but helps approval)
- 30 seconds max
- Shows app workflow
- No spoken narration needed
- Can be created in iMovie/QuickTime

### 3.3 App Description
```
MeritOne makes it easy to book dermatology appointments with Dr. Angela Azar.

FEATURES:
• Browse our complete service menu with pricing
• Secure online booking with your preferred date and time
• View appointment history
• Secure payment processing
• Appointment reminders

ABOUT US:
Angela Azar, MD PC is a board-certified dermatologist offering:
• General dermatology
• Cosmetic treatments
• Medical skincare
• Skin concerns management

Locations:
• Great Neck, NY
• Jackson Heights, NY

PRIVACY & DISCLAIMER:
MeritOne is an appointment scheduling app only. It does not provide 
medical advice or diagnosis. Always consult with our providers for 
medical concerns. See our Privacy Policy for data handling details.

Questions? Contact support@azardermatology.com
```

**Keywords (max 100 chars):**
```
dermatology, skin care, appointment booking, dermatologist, skincare, cosmetic
```

**Support URL:**
```
https://azardermatology.com/support
```

**Privacy Policy URL:**
```
https://azardermatology.com/privacy-policy
```

---

## Phase 4: Build & Technical Setup (1-2 days)

### 4.1 Prepare Xcode Project

**Update Info.plist:**
```xml
<key>CFBundleShortVersionString</key>
<string>1.0</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>NSHumanReadableCopyright</key>
<string>© 2026 Angela Azar, MD PC. All rights reserved.</string>
```

### 4.2 Create Signing Certificate
1. Xcode → Preferences → Accounts
2. Select Apple ID
3. Click "Manage Certificates"
4. Create new "iOS Distribution" certificate
5. Download & install

### 4.3 Create Provisioning Profile
1. Go to: https://developer.apple.com/account
2. Certificates, IDs & Profiles
3. Create "App Store" provisioning profile
4. Download to Xcode

### 4.4 Build Archive
```bash
cd MeritOne-iOS
xcodebuild -scheme MeritOne -configuration Release \
  -derivedDataPath build archive \
  -archivePath build/MeritOne.xcarchive
```

### 4.5 Validate & Upload
1. Open Xcode Organizer (Window → Organizer)
2. Select archive
3. Click "Validate App"
4. Once passed, click "Distribute App"
5. Select "App Store Connect" → "Upload"

---

## Phase 5: App Review Submission (10 minutes)

### 5.1 Final Check
- [ ] Version & build number correct
- [ ] All required fields filled
- [ ] Screenshots uploaded (2048x1536 or 1284x2778)
- [ ] Privacy policy URL valid
- [ ] Support email configured
- [ ] Age rating completed
- [ ] Build uploaded successfully

### 5.2 Submit for Review
1. App Store Connect → Your App
2. Scroll to "Build" section
3. Select uploaded build
4. Click "Submit for Review"
5. Answer questionnaire:
   - Export Compliance: NO (unless crypto)
   - Advertising ID: NO (unless showing ads)
   - Third-party content: NO
   - Cryptography: NO

### 5.3 Review Information
```
Testing Notes:
MeritOne is an appointment booking app for dermatology services.

Test Account (for App Review team):
Email: testuser@example.com
Password: [Test123!]

Demo Credentials:
- Can browse services
- Can book appointments
- Can make test payments (use test card: 4242 4242 4242 4242)

No special hardware needed.
Locations tested: Great Neck and Jackson Heights, NY
```

---

## Phase 6: Timeline & Follow-Up

### Expected Timeline
- Submission: Day 1
- In Review: Days 2-3
- Approval/Rejection: Days 3-5 (usually 24-48 hours)

### If Rejected
- Common reasons:
  - Missing privacy policy
  - Misleading medical claims
  - Payment not working
  - Crashes on test device

- Response: Fix issue → Upload new build → Resubmit

### Post-Approval
- App appears in App Store in 24 hours
- Users can search and download
- Promote on website & social media

---

## Critical Do's & Don'ts

### ✅ DO
- Be honest about app capabilities
- Include medical disclaimers
- Test on real device before submission
- Respond quickly to App Review questions
- Keep privacy policy updated
- Monitor reviews and ratings

### ❌ DON'T
- Claim to diagnose or treat conditions
- Use misleading screenshots
- Hide payment info
- Include unlicensed medical advice
- Submit unfinished features
- Ignore App Review rejection reasons

---

## Files Needed - Checklist

**Digital Assets:**
- [ ] App icon (1024x1024px)
- [ ] Screenshots (iPhone: 1284x2778px minimum 2)
- [ ] Privacy policy (published URL)
- [ ] Support email configured
- [ ] App description (written)

**Technical:**
- [ ] Signing certificate
- [ ] Provisioning profile
- [ ] Xcode project configured
- [ ] Build archive uploaded

**Legal:**
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Medical disclaimer in app
- [ ] Trademark/copyright info

---

## Estimated Cost
- Apple Developer Account: $99/year
- App Store Submission: FREE
- Design/Screenshots: $0 (DIY) or $300-500 (designer)
- **Total: $99-600**

---

## Resources
- Apple App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect Help: https://help.apple.com/app-store-connect/
- Xcode Documentation: https://developer.apple.com/xcode/

---

## Next Steps
1. [ ] Create Apple Developer Account
2. [ ] Prepare required documents (Privacy Policy, etc.)
3. [ ] Design screenshots
4. [ ] Configure Xcode project
5. [ ] Build & test on real device
6. [ ] Submit to App Store Connect
7. [ ] Monitor review status
8. [ ] Launch & promote
