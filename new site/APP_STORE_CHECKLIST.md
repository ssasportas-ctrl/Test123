# MeritOne App Store - Quick Action Checklist

## ✅ BEFORE YOU START
- [ ] Apple Developer Account ($99/year)
- [ ] Mac with Xcode 15+
- [ ] Read: APP_STORE_SUBMISSION.md (comprehensive guide)

## 📋 WEEK 1: Prepare Documents

### Required Documents
- [ ] Privacy Policy (see PRIVACY_POLICY.md)
- [ ] Terms of Service (see TERMS_OF_SERVICE.md)
- [ ] Support email: support@azardermatology.com
- [ ] Support URL: azardermatology.com/support

### Publish Online
- [ ] Host Privacy Policy at: https://azardermatology.com/privacy-policy
- [ ] Host Terms of Service at: https://azardermatology.com/terms
- [ ] Verify URLs work

## 📸 WEEK 1-2: Create Marketing Assets

### App Icon
- [ ] Design: 1024x1024px PNG
- [ ] No transparency required
- [ ] Must be recognizable at small sizes
- [ ] Unique from other dermatology apps

### Screenshots (iPhone 6.5")
- [ ] Screenshot 1: App launch screen
- [ ] Screenshot 2: Services browsing
- [ ] Screenshot 3: Booking flow
- [ ] Screenshot 4: Payment
- [ ] Screenshot 5: Confirmation
- [ ] Dimensions: 1284 x 2778px
- [ ] Add text overlay (20pt+ font)

### App Store Metadata
- [ ] App Name: `MeritOne`
- [ ] Subtitle: `Book Dermatology Appointments`
- [ ] Description: (see APP_STORE_SUBMISSION.md Phase 3.3)
- [ ] Keywords: dermatology, skincare, appointment, booking
- [ ] Category: Medical
- [ ] Age Rating: 4+

## 🔧 WEEK 2: Technical Setup

### Xcode Configuration
- [ ] Update bundle ID: `com.azardermatology.meritone`
- [ ] Set version to: `1.0`
- [ ] Set build to: `1`
- [ ] Update copyright year: `2026`
- [ ] Add medical disclaimer in app

### Code Changes Needed
```swift
// In your app, add this somewhere visible:
// "This app is for appointment scheduling only. 
// It does not provide medical advice. 
// See Terms of Service for full disclaimer."
```

### Create Signing Certificate
- [ ] Go to: https://developer.apple.com/account
- [ ] Create iOS Distribution certificate
- [ ] Download to Xcode

### Create Provisioning Profile
- [ ] Create "App Store" provisioning profile
- [ ] Download to Xcode
- [ ] Assign to project

## 🏗️ WEEK 2-3: Build & Test

### Test on Device
- [ ] Install on real iPhone (not simulator)
- [ ] Test all features
- [ ] Try booking an appointment
- [ ] Test payment with test card: 4242 4242 4242 4242
- [ ] Check for crashes
- [ ] Verify layout on different screen sizes

### Build Archive
```bash
cd MeritOne-iOS
xcodebuild -scheme MeritOne -configuration Release \
  -archivePath build/MeritOne.xcarchive archive
```

## 📤 WEEK 3: App Store Connect Setup

### Create App
- [ ] Go to: https://appstoreconnect.apple.com
- [ ] Create new app
- [ ] Bundle ID: `com.azardermatology.meritone`
- [ ] Platform: iOS

### Fill App Information
- [ ] App name, subtitle, category
- [ ] Privacy policy URL (must be live)
- [ ] Support URL
- [ ] Support email
- [ ] Age rating questionnaire
- [ ] Copyright: © 2026 Angela Azar, MD PC

### Upload Assets
- [ ] App icon (1024x1024)
- [ ] Screenshots (all iPhone sizes)
- [ ] App description
- [ ] Keywords
- [ ] Category: Medical

### Build & Upload
- [ ] Validate app in Xcode
- [ ] Upload to App Store Connect
- [ ] Select build for submission

## 🚀 WEEK 3: Submit for Review

### Final Checks
- [ ] All required fields complete
- [ ] Build uploaded successfully
- [ ] Screenshots pass review guidelines
- [ ] Privacy policy is live and accessible
- [ ] No medical claims in description
- [ ] Contact info included

### Submit
- [ ] Click "Submit for Review"
- [ ] Answer compliance questions
- [ ] Fill testing notes:
  ```
  Test Account:
  Email: testuser@example.com
  Password: [test123!]
  
  This is an appointment booking app.
  No special hardware needed.
  Can test in both locations.
  ```

### Monitor Status
- [ ] Check daily for status updates
- [ ] Watch email for App Review questions
- [ ] Be ready to respond within 24 hours

## 📊 Expected Timeline

| When | What |
|------|------|
| Day 1 | App submitted |
| Days 2-3 | App Review team reviews |
| Days 3-5 | Approval OR rejection with details |
| Day 6+ | App available in App Store (24 hours after approval) |

## ❌ Common Rejection Reasons & Fixes

| Issue | Fix |
|-------|-----|
| Missing privacy policy | Publish & link in App Store Connect |
| Medical claims | Remove "treats" or "cures" language |
| Crashes on device | Test thoroughly, fix bugs |
| Payment not working | Test with real Stripe keys |
| Misleading screenshots | Update to show actual app UI |

## ✅ Post-Approval

- [ ] App appears in App Store
- [ ] Create App Store listing page on website
- [ ] Link from website to App Store
- [ ] Promote on social media
- [ ] Monitor reviews and ratings
- [ ] Respond to user feedback

## 📞 Support Contacts

**During Submission:**
- App Review Questions: apple@appstoreconnect.apple.com (auto)

**After Approval:**
- support@azardermatology.com
- (516) 715-4123

---

## Total Estimated Time: 2-3 Weeks
## Total Cost: $99 (Apple Developer Account)

**You've got this! 🚀**
