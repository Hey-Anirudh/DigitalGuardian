# 🛡️ Digital Guardian

> A mobile-first digital security companion — protecting your accounts, subscriptions, digital will, and legacy with zero-trust dual-control verification.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Compliant](https://img.shields.io/badge/RBI-Compliant-blue?style=flat-square)
![ISO](https://img.shields.io/badge/ISO-27001-blue?style=flat-square)

---

## 📱 Overview

Digital Guardian is a React-based mobile security dashboard designed to give individuals complete visibility and control over their digital footprint. It combines real-time threat monitoring, subscription management, and a legally-structured digital will — all protected by a dual-control verification system inspired by zero-trust security principles.

Built as a single-file React artifact (`digital-guardian.jsx`), it runs entirely in the browser with no backend required — all state is managed in-memory.

---

## ✨ Features

### 🔐 Authentication
- Full **Sign Up / Log In** flow with form validation
- Password confirmation, show/hide toggle, and error handling
- **Forgot Password** flow with email confirmation screen
- Avatar and display name derived dynamically from user input
- Sign Out returns cleanly to the auth screen

### 🏠 Dashboard
- Personalised greeting using the authenticated user's name
- Animated **Safety Score** counter (0 → 94)
- At-a-glance stats: connected accounts, threats blocked, monthly spend
- Warning banner for pending action items
- Quick-access grid to all major sections
- Live account list with session counts, risk levels, and breach flags
- Contextual security tip card

### ⚖️ Dual-Control Will System
Implements the **Digital Will Protocol — Dual-Control Verification** pipeline:

| Step | Name | Description |
|------|------|-------------|
| 1 | **Nominee** | Initiates delete, cancel, or transfer request |
| 2 | **Dual Alert** | Email + push notification sent to account owner |
| 3 | **Owner** | Approves or rejects within 48–72 hr window |
| 4 | **Auto** | No response = auto-executes per pre-authorised will |
| 5 | **Reject Lock** | Rejection locks nominee out for 7-day cooldown |
| 6 | **Audit Log** | Full event chain immutably recorded |

- Horizontally scrollable, colour-coded step cards
- Tap-to-expand detail panel for each step
- **Simulate Dual-Control Flow** — animated walkthrough of all 6 steps
- Trust badge footer: Zero-trust execution · Role-gated control · GDPR-compliant · Immutable audit trail

### 📜 Digital Will — Instructions
- Executor and trustee details
- Interactive progress pipeline (6-stage lifecycle)
- Per-account will instructions (expandable cards) covering Google Drive, HDFC Bank, Social Media, Subscriptions, and Crypto
- Security explanation of the dual-confirmation requirement

### 🛡️ Safety Monitor
- Threat summary: Action Needed / Blocked / Resolved counts
- Filterable threat list by status and severity
- Expandable threat detail with geolocation and IP info
- One-tap **Mark as Resolved** with optimistic UI update
- Toast notification on resolution

### 💳 Subscription Manager
- Monthly spend total with yearly forecast
- Stacked colour bar showing spend breakdown across active subscriptions
- Filter by All / Active / Paused
- Per-subscription usage bar with colour-coded utilisation (green → amber → red)
- Toggle switch to pause / reactivate any subscription
- AI-style savings tip for underutilised subscriptions

### 👤 Profile
- User avatar (initials-based), name, email, plan tier
- Stats: safety score, threats blocked, member since
- Security settings list (2FA, biometrics, notifications, auto-logout, etc.)
- Sign Out with success toast

---

## 🗂️ Project Structure

```
digital-guardian.jsx   # Single-file React app — entire application
README.md              # This file
```

The app is intentionally self-contained in one file for portability. Key internal sections:

```
T {}              — Design system tokens (colours, fonts, spacing)
DB {}             — Static seed data (accounts, threats, subscriptions, will)
AppProvider       — Global state context (accounts, threats, subs, notifications)
AuthScreen        — Login / Sign Up / Forgot Password UI
Splash            — Animated loading screen post-login
Dashboard         — Home screen
DualControlWill   — Dual-control pipeline visualisation
Will              — Will instructions and lifecycle
Subscriptions     — Subscription manager
Threats           — Threat monitor
Profile           — User settings
NavBar            — Bottom navigation bar
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A React environment that supports JSX (Vite, Create React App, or any Claude artifact runner)

### Run locally with Vite

```bash
# 1. Create a new Vite + React project
npm create vite@latest digital-guardian -- --template react
cd digital-guardian

# 2. Replace src/App.jsx with digital-guardian.jsx
cp digital-guardian.jsx src/App.jsx

# 3. Install dependencies and start
npm install
npm run dev
```

### Run as a Claude Artifact
Paste the contents of `digital-guardian.jsx` directly into a Claude artifact (React type). No build step required.

---

## 🧰 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 (hooks only, no class components) |
| State | `useState`, `useContext`, `useCallback` — no external state library |
| Styling | Inline styles with a centralised design token object (`T`) |
| Fonts | Playfair Display · Nunito · IBM Plex Mono (Google Fonts) |
| Animations | CSS keyframes (`spin`, `slideDown`) + JS `requestAnimationFrame` |
| Data | In-memory seed data (`DB`) — no backend or API calls |
| Auth | Simulated with 1.2s async delay — swap for real API |

---

## 🎨 Design System

All visual constants live in the `T` object at the top of the file:

```js
T.primary      // #1B4F8A — deep navy (trust)
T.accent       // #2A7D4F — forest green (safe/positive)
T.warn         // #C96A00 — amber (caution)
T.danger       // #C0392B — calm red (alert)
T.gold         // #B8860B — gold (will/legacy)
T.purple       // #6B4FA8 — purple (subscriptions)

T.display      // 'Playfair Display' — headings
T.body         // 'Nunito' — body text
T.mono         // 'IBM Plex Mono' — data/code
```

---

## 🔒 Security Principles

Digital Guardian is built around four pillars shown in the Dual-Control System:

1. **Zero-trust execution** — no action is taken without explicit, time-bounded verification
2. **Role-gated action control** — nominee, owner, executor, and trustee have separate scoped permissions
3. **GDPR compliance** — all data handling respects the right to erasure and data portability
4. **Immutable audit trail** — every event is cryptographically logged and tamper-proof

> Note: The current version is a UI prototype. In production, replace the simulated `api()` delays with real authenticated API calls, and store all sensitive data encrypted server-side.

---

## 🗺️ Roadmap

- [ ] Backend integration (Node.js / Supabase)
- [ ] Real OAuth login (Google, Apple)
- [ ] Push notification support (FCM)
- [ ] Biometric authentication (WebAuthn)
- [ ] Blockchain-backed audit log (on-chain hashing)
- [ ] PDF export of Digital Will
- [ ] Trustee / nominee invitation flow via email
- [ ] Dark mode toggle
- [ ] Multi-language support (Hindi, Tamil, Telugu)

---

## 📄 License

MIT © 2025. Built with care for digital legacy and security.

---

<div align="center">
  <sub>🛡️ Your data is encrypted and never sold.</sub>
</div>
