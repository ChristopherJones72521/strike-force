# Strike Force Prototype Architecture Overview

This document provides a high-level overview of the Strike Force Prototype application architecture, focusing on key components and data flow.

## Core Components

### Shared

Located in `native-app/StrikeForcePrototype/Shared/`:

*   **`Session.swift`**: Defines the `Session` struct (used for temporary session data and Watch Connectivity transfer) and the `ChallengeInfo` struct.
*   **`PunchData.swift`**: Defines the `PunchData` struct holding data for a single punch (timestamp, acceleration, force). Conforms to `Identifiable`. Includes encoding/decoding logic for Watch Connectivity.
*   **`SessionType.swift`**: Defines the `SessionType` enum (workout, arcadePower, etc.) and `SessionState` enum (idle, running, etc.).
*   **`SessionEntity+Extension.swift`**: Extends the Core Data `SessionEntity` class with helper methods like `decodePunches()` and `formattedDuration`.
*   **`Styling.swift`**: Contains reusable SwiftUI `ViewModifier`s for consistent UI elements (e.g., `GradientBackgroundModifier`, `CardModifier`).
*   **`AppConfig.swift`**: Holds centralized configuration constants (physics factors, thresholds, durations, feature flags).

### iOS App (`native-app/StrikeForcePrototype/`)

*   **`StrikeForcePrototypeApp.swift`**: Main application entry point, sets up Core Data (`PersistenceController`), `WatchManager`, and the main view (`OnboardingView` or `MainTabView`).
*   **`PersistenceController.swift`**: Manages the Core Data stack (setup, saving, preview context).
*   **`WatchManager.swift`**: Singleton class managing `WCSession` delegate methods for iOS. Handles receiving data (`userInfo`, messages) from the Watch, saving sessions to Core Data, and publishing events/data to the UI (e.g., pending actions).
*   **`OnboardingView.swift`**: Initial view shown to new users or logged-out users. Handles the presentation of authentication options. Includes `AuthOptionsPageView` and presents `EmailSignUpView`.
*   **`EmailSignUpView.swift`**: Simple view for the current email sign-up workaround (generates UUID, saves to Keychain).
*   **`KeychainHelper.swift`**: Utility for saving/loading the user ID string from the Keychain.
*   **`MainTabView.swift`**: The main container view after login/onboarding. Hosts the `TabView` with `HomeView`, `HistoryView`, `LeaderboardView`, `SettingsView`. Manages presentation of sheets (like the share sheet via `ActivityView`) and alerts (like incoming challenges) based on data received via `WatchManager` publishers or `UserDefaults`. Contains the `presentShareSheet` callback function passed to child views.
*   **`HomeView.swift`**: Dashboard view. Displays summary stats (`StatCard`), a chart (`SwiftUI.Charts`), recent activity list, and segmented controls. Fetches data using `@FetchRequest`. Calls `presentShareSheet` callback.
*   **`HistoryView.swift`**: Displays a list of all saved sessions from Core Data using `@FetchRequest`. Uses `NavigationLink` to `SessionDetailView`. Passes `presentShareSheet` callback down.
*   **`SessionDetailView.swift`**: Shows detailed metrics and individual punch data for a selected `SessionEntity`. Includes a share button that uses the `presentShareSheet` callback.
*   **`SettingsView.swift`**: Placeholder view for app/user settings.
*   **`LeaderboardView.swift`**: Placeholder view for leaderboards.
*   **`ActivityView.swift`**: `UIViewControllerRepresentable` wrapper for `UIActivityViewController` (standard iOS share sheet).
*   **`MessageComposeView.swift`**: `UIViewControllerRepresentable` wrapper for `MFMessageComposeViewController` (used for sending challenges via SMS - currently triggered by `WatchManager`).

### Watch App (`native-app/StrikeForcePrototype/StrikeForcePrototype Watch App/`)

*   **`StrikeForcePrototypeApp.swift` (Watch)**: Main Watch App entry point, creates and injects `MotionManager` as an `EnvironmentObject`.
*   **`ContentView.swift`**: Main view, uses a `TabView` to switch between `SessionControlView` (during session) and the main content area. Manages the display logic based on `motionManager.sessionState`. Contains subviews like `ModeSelectionView`, `RunningSessionView`, `EndedSessionView`, etc.
*   **`MotionManager.swift`**: `ObservableObject` managing `CMMotionManager`, `HKWorkoutSession` (optional), session state (`SessionState`), timers, punch detection logic, data aggregation (max/avg force, punch count), and publishing results (`sessionPublisher`, `punchDataPublisher`). Uses `AppConfig` for constants. Handles WCSession delegate methods for receiving messages (like start challenge).
*   **`EndedSessionView.swift` (within `ContentView.swift`)**: Displays the session summary. Receives the final `Session` object via `.onReceive(motionManager.sessionPublisher)` and sends it to the iOS app using `WCSession.default.transferUserInfo`. Also contains buttons for Share, Challenge Contact, Restart, End.

## Key Data Flows

### Session Saving

1.  **Watch:** User stops session -> `SessionControlView` calls `motionManager.stopSession()`.
2.  **Watch:** `motionManager.stopSession()` sets state to `.finishing`, stops sensors/timers.
3.  **Watch:** If HealthKit disabled (current state), `stopSession()` calls `finishWorkout()`. (If HK enabled, delegate calls `finishWorkout()` later).
4.  **Watch:** `finishWorkout()` calculates final stats, creates `Session` object, calls `sessionPublisher.send(finalSession)`.
5.  **Watch:** `EndedSessionView` appears (triggered by state change to `.ended` which happens in `completeFinishingState()` called by `finishWorkout()`).
6.  **Watch:** `EndedSessionView.onReceive(motionManager.sessionPublisher)` receives the buffered `Session` object (because `sessionPublisher` is a `CurrentValueSubject`).
7.  **Watch:** `EndedSessionView` encodes the `Session` and calls `WCSession.default.transferUserInfo(["sessionData": encodedSession])`.
8.  **iOS:** `WatchManager.session(_:didReceiveUserInfo:)` receives the `userInfo`.
9.  **iOS:** `WatchManager` decodes the `Session` data.
10. **iOS:** `WatchManager.saveSessionToCoreData()` creates a `SessionEntity` and saves it using `PersistenceController`.
11. **iOS:** `@FetchRequest` in `HomeView`/`HistoryView` automatically updates the UI.

### Sharing (from Watch)

1.  **Watch:** User taps Share/Challenge/Share Result button in `EndedSessionView`.
2.  **Watch:** Button action prepares a data dictionary (e.g., `["action": "shareSession", "text": "..."]`).
3.  **Watch:** `WCSession.default.sendMessage(...)` (for immediate attempt) and `WCSession.default.transferUserInfo(...)` (for guaranteed background transfer) are called with the data.
4.  **iOS:** `WatchManager.session(_:didReceiveUserInfo:)` receives the `userInfo` via background transfer.
5.  **iOS:** `handlePendingAction` saves data to `UserDefaults` (e.g., `pendingShareSessionData`) and schedules a notification.
6.  **iOS:** If app is active, `handlePendingAction` sends signal via publisher (e.g., `checkPendingSharePublisher`).
7.  **iOS:** `MainTabView.onReceive` catches the signal OR `MainTabView.onChange(of: scenePhase)` detects app becoming active.
8.  **iOS:** `checkForPendingShare()` (or similar) is called.
9.  **iOS:** Function reads `UserDefaults`, formats share string, sets `@State var itemToShare`.
10. **iOS:** `.sheet(item: $itemToShare)` modifier presents `ActivityView`.

*(Note: Immediate `sendMessage` handling on iOS was mostly removed in favor of the guaranteed `transferUserInfo` + `UserDefaults` flow).*
