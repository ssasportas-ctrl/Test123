# MeritOne (iOS)

A native SwiftUI app for the MeritMD visit-based rewards program, backed by the
existing Supabase project (`cbdekqzzxysxachifevr`). All Swift source is written
and ready — this machine doesn't have full Xcode installed yet, so the project
hasn't been generated or built. Once Xcode is installed, this takes about 5 minutes.

## What's here

```
MeritOne-iOS/
  project.yml                  # XcodeGen spec — generates the .xcodeproj
  MeritOne/
    Sources/
      MeritOneApp.swift        # App entry, session/auth state
      Config.swift             # Supabase URL + anon key
      DesignSystem/Theme.swift # Colors, serif/label fonts matching the mockup
      Models/Models.swift      # Codable structs matching every Supabase table
      Services/
        SupabaseService.swift  # Auth + all Postgrest queries
        AppStore.swift         # ObservableObject: loads data, computes points/visits/tier
      Views/
        Auth/AuthView.swift        # Email OTP sign-in
        RootSplitView.swift        # Sidebar nav: Home / Services / Shop / Rewards / Me
        Home/HomeView.swift        # Insider card, points/credits, visit progress, quick actions
        Home/CheckInView.swift     # QR check-in sheet
        Services/ServicesView.swift
        Shop/ShopView.swift
        Rewards/RewardsView.swift
        Me/MeView.swift
```

The app reads live data from these existing tables: `patients`, `loyalty_settings`,
`points_ledger`, `milestones`, `rewards`, `redemptions`, `services`, `products`,
`membership_plans`, `patient_memberships`. Visit count is derived client-side as
the number of `earn` entries in `points_ledger` (there's no separate visits table).

## One-time setup (after Xcode is installed)

1. Install [Xcode](https://apps.apple.com/us/app/xcode/id497799835) from the App Store, open it once to finish component install.
2. Install [XcodeGen](https://github.com/yonaskolb/XcodeGen) (turns `project.yml` into a real `.xcodeproj`):
   ```bash
   brew install xcodegen
   ```
3. Generate the Xcode project:
   ```bash
   cd "MeritOne-iOS"
   xcodegen generate
   open MeritOne.xcodeproj
   ```
4. In Xcode, wait for Swift Package resolution (pulls in `supabase-swift` automatically
   from `project.yml`), pick an iPhone simulator, and hit Run (`Cmd+R`).

If you'd rather not install XcodeGen: create a new iOS App project in Xcode named
"MeritOne", add the Supabase Swift package
(`https://github.com/supabase/supabase-swift`, "Supabase" product) via
File → Add Package Dependencies, then drag the `MeritOne/Sources` folder into the project.

## Known gap to resolve

`redemptions` has RLS policies for staff insert/update and patient *read*
(`redemptions_select_own`), but no policy letting a signed-in patient *insert*
their own redemption row. The in-app "Redeem" button will currently fail with a
permissions error until you either add an insert policy scoped to
`patient_id = auth.uid()` or move redemption through a server-side function
(recommended, so point balances can't be spoofed from the client). Say the word
and I'll wire up whichever you prefer.

## Auth

Sign-in uses Supabase email OTP (magic-code), matching `patients.id` to
`auth.users.id` per the existing schema. A patient row must already exist for
that auth user (created via `patients_insert_self` policy) before the app can
load their data.
