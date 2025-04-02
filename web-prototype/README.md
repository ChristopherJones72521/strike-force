# Strike Force Project

This repository contains the code and documentation for the Strike Force application project. It is organized into the following main sections:

## Directory Structure

```
/
├── native-app/         # Primary native iOS/watchOS application (Swift/Xcode)
│   └── StrikeForcePrototype/
├── web-prototype/      # Initial web-based prototype (HTML, CSS, JS, Python)
└── docs/               # Project documentation (Requirements, Briefs)
```

## 1. Native App (`native-app/`)

This directory contains the primary **Strike Force** application, built natively for iOS (iPhone) and watchOS (Apple Watch) using Swift and Xcode.

*   **Purpose:** To track punch metrics (force, speed), provide workout modes, leaderboards, and analytics, leveraging the Apple Watch sensors.
*   **Main Product:** This is the focus of current development efforts.
*   **Documentation:** Refer to the Product Requirements Document (`docs/Punch Power Pro - Product Requirements.docx`) for detailed specifications.
*   **Shared Code:** Core data structures like `Session` and `PunchData` are located in `native-app/StrikeForcePrototype/Shared/` and are shared between the iOS and watchOS targets.

**To build/run:** Open `native-app/StrikeForcePrototype/StrikeForcePrototype.xcodeproj` in Xcode.

## 2. Web Prototype (`web-prototype/`)

This directory contains an earlier prototype of the application built using web technologies (HTML, CSS, JavaScript, Python).

*   **Purpose:** Used for initial rapid iteration and feature exploration.
*   **Status:** This is considered a prototype and is **not** the primary application. It may not reflect the latest features or architecture of the native app.
*   **Documentation:** See `web-prototype/README.md` for details specific to this prototype.
*   **Backend:** Includes a simple Python server (`server.py`) likely used for serving the prototype's assets and potentially basic API simulation during its development.

**To run (prototype only):**
```bash
cd web-prototype
# Install dependencies if needed (e.g., npm install if package.json exists)
python3 server.py
# Open http://localhost:8080 (or the port specified by server.py)
```

## 3. Documentation (`docs/`)

This directory contains project planning and requirements documents:

*   `Punch Power Pro - Product Requirements.docx`: Detailed functional and non-functional requirements for the native application.
*   `Strike Force - Product Brief.pdf`: An earlier version or extract of the requirements.
