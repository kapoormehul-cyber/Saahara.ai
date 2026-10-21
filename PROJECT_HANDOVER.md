# SAAHARA AI — AZINHACK ’26 Project Handover & Architecture Guide

**Tagline:** *“Safer journeys. Stronger together.”*  
**Prepared for:** Team Handover & Local Setup  
**Date:** October 2026

---

## 1. Project Architecture Overview

SAAHARA AI is structured as a **single, unified full-stack monorepo**.

* **Frontend and backend reside in the same project root** (`saahara-ai/`) and share a single root `package.json` and `node_modules` directory.
* **Frontend:** Located in `src/` and `public/`, built with **React 19**, **TypeScript**, and **Vite 8**.
* **Backend:** Located in `server/`, built with **Node.js**, **Express 5**, and executed directly in TypeScript via **`tsx`**.
* **Communication Channel:**
  * When developing locally, Vite runs on port **`5173`** and Express runs on port **`3001`**.
  * Vite's development server (`vite.config.ts`) includes a pre-configured proxy: all requests starting with `/api` are automatically forwarded to `http://localhost:3001`.
  * The command `npm run dev:all` runs both frontend and backend concurrently in one terminal using `concurrently`.
* **Database / Persistence:**
  * No external database (such as MongoDB or PostgreSQL) is required. The prototype uses a reactive, client-side persistence architecture (`src/services/storageService.ts` wrapping HTML5 `localStorage` with custom pub/sub event emitters). This ensures immediate reactivity across all components without external database installation or credentials.

---

## 2. Project Folder Structure

```
saahara-ai/
├── server/                         # BACKEND (Node.js + Express + TypeScript)
│   ├── index.ts                    # Express API server, endpoints & Privacy Filter
│   ├── intelligenceEngine.ts       # Round 2: Multi-step Safety Intelligence, SSRF guard, cache
│   └── test-agent.ts               # Round 2: 27-test automated test suite
├── src/                            # FRONTEND (React 19 + TypeScript + Tailwind CSS)
│   ├── assets/                     # Static images, SVG badges, hero graphics
│   ├── components/                 # Reusable UI components & feature modules
│   │   ├── AuthModal.tsx           # 4-step account onboarding & 2FA modal
│   │   ├── DashboardOverview.tsx   # Live community overview & transit metrics
│   │   ├── LandingPage.tsx         # Public marketing landing page & trust commitments
│   │   ├── Common/                 # Shared UI elements
│   │   │   ├── EmergencyDrawer.tsx # Urgent 112/1091/181 one-tap emergency sheet
│   │   │   ├── FooterDialogs.tsx   # Privacy, Safety, Support, Terms dialogs
│   │   │   ├── JudgeTourModal.tsx  # 4-section interactive judge walkthrough
│   │   │   ├── Navbar.tsx          # Top navigation, Judge Walkthrough button, alerts bell
│   │   │   ├── NearbyAlertsModal.tsx # Consent-based corridor safety alerts modal
│   │   │   └── RouteChangeBanner.tsx # Neutral, assistive route diversion notification
│   │   ├── LivingSafetyMap/        # Module 1: Living Safety Map
│   │   │   ├── SafetyMap.tsx       # Leaflet map, nationwide search, uncertainty radii, AI investigation trigger
│   │   │   ├── SafetyListView.tsx  # Density list view with observation history timeline & AI Investigate action
│   │   │   └── SubmitReportModal.tsx # Grouped observation submission & conflict detection
│   │   ├── SaheliCircle/           # Module 2: Nearby Community & Walking Companions
│   │   │   ├── CommunityFeed.tsx   # Walking companion feed & public meeting points
│   │   │   ├── ConnectionRequestsDrawer.tsx # Mutual consent connection approvals
│   │   │   ├── CreatePostModal.tsx # Create walking accompaniment request
│   │   │   ├── PrivateChatModal.tsx # Mutual-consent locked direct messaging
│   │   │   └── UserProfileModal.tsx # Privacy-preserving limited profile preview
│   │   ├── SaheliSignal/           # Module 3: First-Hand Place Observations
│   │   │   ├── SignalBoard.tsx     # Recent place observations & corridor notices with AI Investigate
│   │   │   └── PublishSignalModal.tsx # First-hand place observation submission
│   │   ├── SaheliShare/            # Module 4: Cab-Trip Coordination & Ride Sharing
│   │   │   ├── SaheliShareModule.tsx # Corridor & time matching view (Zero cab API dep)
│   │   │   ├── CreateRideModal.tsx # Post existing trip details
│   │   │   ├── SelectiveSharingModal.tsx # Selective disclosure modal with explicit consent
│   │   │   ├── FareCalculatorModal.tsx # Hypothetical fare split estimator
│   │   │   └── ActiveSharedTripView.tsx # Coordinated trip card & trusted contact export
│   │   ├── SupportNavigator/       # Module 5: Survivor Support Navigator
│   │   │   ├── SupportNavigatorModule.tsx # Directory of verified helplines & legal aid
│   │   │   └── EvidencePreservationGuide.tsx # 4-step digital evidence recording guide
│   │   ├── TinyFishResearch/       # Module 6 & Round 2: TinyFish Public Research & Safety Intelligence
│   │   │   ├── LiveSafetyIntelligenceAgent.tsx # Round 2: Interactive multi-step AI research agent
│   │   │   └── TinyFishPanel.tsx   # Tabbed panel: Live Intelligence Agent + Statutory Knowledge Base
│   │   └── ProfileSettings/        # User profile, privacy controls & data export/purge
│   │       └── ProfileSettingsView.tsx
│   ├── data/
│   │   └── sampleData.ts           # Searchable Indian locations, helplines, seed reports
│   │   └── tinyFishService.ts      # Client adapter for /api/tinyfish/intelligence & /api/tinyfish/research
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces and data models
│   ├── App.css                     # Global utility styles
│   ├── App.tsx                     # Main application container & tab router
│   ├── index.css                   # Tailwind CSS imports & theme definitions
│   └── main.tsx                    # React DOM entry point
├── public/                         # Public static assets (favicon.svg, logo.svg)
├── .env.example                    # Environment variable template (No secrets!)
├── .gitignore                      # Git ignore rules (node_modules, dist, .env)
├── .oxlintrc.json                  # Linter configuration
├── index.html                      # HTML document shell
├── package.json                    # Single unified dependencies & scripts definition
├── package-lock.json               # Locked dependency tree
├── tsconfig.json                   # TypeScript project references root
├── tsconfig.app.json               # Frontend TypeScript configuration
├── tsconfig.node.json              # Node/Vite TypeScript configuration
└── vite.config.ts                  # Vite build config with Tailwind v4 & /api proxy
```

---

## 3. Technologies Used

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19** | Dynamic, declarative UI rendering |
| **Language & Typings** | **TypeScript 6** | End-to-end type safety across client and server |
| **Build Tool & Bundler** | **Vite 8** | Ultra-fast HMR and production bundling |
| **Styling & Icons** | **Tailwind CSS v4** + **Lucide React** | Modern, accessible styling with plum/lavender palette |
| **Mapping Engine** | **Leaflet 1.9** + **@types/leaflet** | Interactive open-source maps with OpenStreetMap tiles |
| **Backend API Server** | **Express 5** | REST API proxy, privacy filters, status endpoints |
| **Server Runtime** | **tsx 4** | Native TypeScript execution for Node.js (no compile step) |
| **Concurrent Execution** | **concurrently 10** | Single command to run Express and Vite simultaneously |
| **Client Persistence** | **HTML5 localStorage + PubSub** | Zero-dependency local persistence with multi-tab reactivity |

---

## 4. Environment Variables Required

SAAHARA AI is designed to work immediately out-of-the-box without requiring mandatory API keys.

A template file named `.env.example` is provided in the project root:

```env
# SAAHARA AI Environment Variables — AZINHACK '26

# Backend Server Port (defaults to 3001 if omitted)
PORT=3001

# TinyFish AI Configuration
# (Optional) Get your API key from https://agent.tinyfish.ai/api-keys or TinyFish Developer Hub
# When omitted, SAAHARA AI operates seamlessly in a clearly labelled demo adapter mode with authoritative statutory records.
TINYFISH_API_KEY=your_tinyfish_api_key_here
TINYFISH_API_URL=https://api.search.tinyfish.ai
```

> **Security Rule:** Never commit a `.env` file containing real API keys or credentials. The `.gitignore` file is configured to exclude all `.env` files while preserving `.env.example`.

---

## 5. How to Run the Project Locally

### Prerequisites
* **Node.js:** v18.0.0 or higher (tested on Node v24.x)
* **npm:** v9.0.0 or higher

### Step-by-Step Instructions

1. **Unzip or clone the project folder:**
   ```bash
   cd saahara-ai
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Set up your local environment file:**
   * On Linux / macOS / Git Bash:
     ```bash
     cp .env.example .env
     ```
   * On Windows PowerShell:
     ```powershell
     Copy-Item .env.example .env
     ```
   *(Note: Leaving `TINYFISH_API_KEY` blank is completely valid; the app will run with pre-verified statutory snapshots).*

4. **Start the development server:**
   ```bash
   npm run dev:all
   ```
   This command starts:
   * **Express Backend** at `http://localhost:3001`
   * **Vite Frontend** at `http://localhost:5173`

5. **Open in your browser:**
   * Open **`http://localhost:5173`** to use the application.
   * You can verify the backend API at **`http://localhost:3001/api/tinyfish/status`**.

### Other Available Commands

* `npm run dev`: Runs only the Vite frontend dev server (port 5173).
* `npm run server`: Runs only the Express backend server (port 3001).
* `npm run test:agent`: Runs the 27-test automated verification suite for the Round 2 Live Safety Intelligence Agent.
* `npm run build`: Type-checks and creates an optimized production build in `dist/`.
* `npm run preview`: Previews the production build locally.

---

## 6. Implemented Features vs. UI/Demo Features

To ensure transparency for hackathon evaluations and team development, here is the exact breakdown of implemented code versus simulated demo behaviors:

| Module / Feature | What Is Fully Implemented | What Is a Demo Simulation / Future Production Track |
|---|---|---|
| **Living Safety Map** | Interactive Leaflet map with OpenStreetMap tiles; nationwide search bar with autocomplete across Indian transit hubs (*Indira Gandhi Metro, BKC, Connaught Place, MG Road, etc.*); keyboard navigation; 100–300m public landmark uncertainty radius buffers; dual Map/List view; direct *"Investigate with AI"* triggers on every observation card and map popup. | Municipal Open Data API integrations (e.g. BBMP Sahaaya or Delhi PWD civic tickets) are not hooked to live government ticket databases. |
| **Safety Issue Grouping** | Submitting a report at an existing location and category detects the issue, prompts confirmation, appends to the issue's chronological timeline, preserves original reports, and recalculates status. | Issue resolution is not tied to real municipal repair crews. |
| **Conflict & Uncertainty Logic** | If an issue previously reported defective is observed working, status automatically shifts to *"Condition Uncertain / Needs Recheck"* rather than declaring it fixed. Historical harassment records never auto-expire. | Multi-user threshold quorum algorithms can be integrated in production. |
| **Consent-Based Nearby Alerts** | Interactive permission modal with manual transit landmark fallback; recent corridor alerts; direct jump to map marker; no background GPS tracking. | Web Push Notifications / Service Worker background pings are simulated via local reactive state. |
| **Account Onboarding & Auth** | 4-step modal (*credentials, 2FA, profile, privacy*); strict 18+ age validation; broad category/field; honest phone-check verification badges (*phone check != identity proof*). | SMS OTP verification is simulated using the test code `2601`. Google Sign-In displays an explanatory dialog detailing what OAuth credentials are required. No plaintext passwords or OTPs are stored. |
| **Saheli Circle** | Community walking companion feed; public meeting place recommendations; limited profile inspection; mutual consent gating before unlocking direct chat; simulated chat dialog. | Push notifications for new requests are local; real-time WebSockets can be connected for multi-device messaging in production. |
| **Saheli Share (Cab Sharing)** | Works 100% independently of ride-hailing APIs (no Uber/Ola API required); departure window and corridor matching; selective sharing consent gate; unverified driver and vehicle badge labeling. | In-app ride bookings with cab companies are intentionally NOT implemented (operates as peer coordination). |
| **Fare Split Calculator** | Mathematical split calculator with clear non-payment disclaimers. | Direct UPI / banking payment gateway integration is a future production pathway. |
| **Survivor Support Navigator** | Verified directory of official Indian emergency helplines (**112**, **1091**, **181**, **15100 NALSA**, **14416 Tele-MANAS**, **1930 Cybercrime**) with "What this helps with" plain explanations; safe external links (`target="_blank"`); comprehensive 4-step evidence preservation protocol. | Direct telephonic CTI integration is handled via standard device `tel:` links. |
| **TinyFish Live Safety Intelligence (Round 2)** | Multi-step research workflow (`POST /api/tinyfish/intelligence`); bounded query plan formulation; calls TinyFish Search & Fetch APIs with strict SSRF URL protection; 15-minute in-memory caching (`forceRefresh` bypass); detects conflicting claims between official civic records and community reports; pre-verified Indian transit corridor fallbacks (*Indira Gandhi Metro, BKC Mumbai, 12th Main Indiranagar, Connaught Place, CMH Road*); strict trust states (`official_information_found`, `corroborated_by_independent_sources`, `conflicting_information`, etc.); explicit notice that absence of records != safe; 27 automated tests passing (`npm run test:agent`). | Direct live web crawling of non-indexed internal police intranets requires official law enforcement clearance. |
| **Judge Walkthrough** | 4 grouped evaluation sections with Next, Back, Skip, Exit, and Jump-to-Section controls; contextual interactive *"Tap here"* triggers that open live modals. | None. This is a fully functional guided walkthrough built specifically for hackathon evaluators. |

---

## 7. How to Share with Your Teammate

### Should You Send the Whole Project or Separate Folders?
**Send the whole `saahara-ai` project folder as a single package.**

* **Why?** Frontend and backend are designed as a single, coordinated monorepo sharing `package.json`, TypeScript configs, and Vite's proxy settings.
* Splitting them into separate folders would break relative paths, require two separate `npm install` runs, and require manual CORS and proxy re-configuration.

### What to Include vs Exclude When Sharing

When creating a `.zip` archive to send to your teammate, **EXCLUDE** the following large and sensitive folders:

```
[EXCLUDE from shareable ZIP]:
├── node_modules/       # Very large (~200MB) — your teammate should run `npm install`
├── dist/               # Generated build artifacts — regenerated via `npm run build`
└── .env                # Local secrets file (if created) — send .env.example instead
```

**Files and folders to INCLUDE:**
* `server/`
* `src/`
* `public/`
* `index.html`
* `package.json`
* `package-lock.json`
* `tsconfig*.json`
* `vite.config.ts`
* `.env.example`
* `.gitignore`
* `.oxlintrc.json`
* `README.md`
* `PROJECT_HANDOVER.md`

### Sharing Checklist for Your Teammate
When your teammate receives the folder, they just need to run:
1. `npm install`
2. `cp .env.example .env` (or on PowerShell: `Copy-Item .env.example .env`)
3. `npm run dev:all`
4. Open `http://localhost:5173` in their browser.
