# iOS Onboarding Flow Implementation Plan

## Goal
Implement the mandatory onboarding flow for new users or users logging back in, based on requirements in the Product Brief and PRD.

## Core Requirements
- Triggered on first launch, blocks main app access.
- Authentication:
    - Login / Create Account options.
    - Email/Password (identifier only, no confirmation needed).
    - OAuth: Sign in with Apple (P0).
    - OAuth: Google Sign-In (Deferred).
- Profile Data Collection:
    - Required: Email (for account), Weight (for force calc), Age (for leaderboards/analysis).
    - HealthKit Integration: Offer option to pull Weight & Age (and maybe DOB/Height if collected) from HealthKit. Request general workout permissions.
    - Optional: User Photo (pull from OAuth/Gravatar or upload - Deferred).
- Tutorial/Info:
    - Explain Arcade vs Workout modes (animation suggested).
    - Explain how force is measured (briefly).
    - Mention hardware limitations.
    - Encourage sharing/challenges.
- User Goals: Ask about primary goals (Force, Speed, Workout Tracking, Other).
- TOS Agreement: Final step.
- Watch App: Display message to open iPhone app if onboarding not complete.

## Premium Account Consideration
- Onboarding will focus on core free features initially.
- Structure should be flexible to potentially insert a premium upsell/trial screen later.
- No premium-specific logic in the initial onboarding build.

## Implementation Steps (Prioritized)

1.  **Basic Structure (`OnboardingView.swift`):**
    *   Create the main view using `TabView` with `.tabViewStyle(.page)`.
    *   Add `@State` variables for current page index and collected data.
    *   Add `@AppStorage("hasCompletedOnboarding")` binding.

2.  **Auth Options Page (First Page):**
    *   Display app logo/name.
    *   Add "Sign in with Apple" button.
    *   Add placeholder buttons for "Sign in with Google", "Sign up with Email", "Log In".

3.  **Sign in with Apple Flow:**
    *   Import `AuthenticationServices`.
    *   Add the standard "Sign in with Apple" button view.
    *   Implement the `ASAuthorizationController` delegate methods to handle the authorization request and callback.
    *   Retrieve user identifier (and email/name if available/requested).
    *   Securely store the user identifier (e.g., Keychain).
    *   On success, advance to the Profile Data step.

4.  **Profile Data Collection Pages:**
    *   Create separate pages/views within the `TabView` for:
        *   Age Input (`TextField` or `Picker`).
        *   Weight Input (`TextField` or `Picker`).
    *   Add a button/toggle on this page to "Use HealthKit Data".

5.  **HealthKit Integration:**
    *   Add `HealthKit` framework and necessary `Info.plist` keys.
    *   Create a `HealthKitManager` (or similar helper class) to handle authorization requests (`requestAuthorization`) for reading Age (DOB) and Weight.
    *   Implement logic to fetch data (`HKCharacteristicType`, `HKQuantityType`) if permission is granted.
    *   Update the profile data state variables with fetched data.

6.  **Tutorial Screens:**
    *   Create simple `View` structs for each tutorial step (e.g., explaining modes). Use `Text` and potentially placeholder `Image` views for animations initially.

7.  **User Goals Page:**
    *   Create a view with a `Picker` or list of buttons for goal selection. Store the selection in a state variable.

8.  **TOS Screen:**
    *   Display placeholder text for Terms of Service.
    *   Add an "Agree" button.

9.  **Completion Logic:**
    *   When "Agree" is tapped on the TOS page:
        *   Save all collected profile data (Email, UserID, Age, Weight, Goal) to a persistent store (e.g., `UserDefaults` for simplicity initially, or Core Data `User` entity later).
        *   Set the `@AppStorage("hasCompletedOnboarding")` variable to `true`.

10. **(Deferred)** Implement Email/Password signup/login flow.
11. **(Deferred)** Implement Google Sign-In flow.
12. **(Deferred)** Implement Photo Upload/Selection.
13. **(Deferred)** Add actual animations to tutorial screens.
