# SAAHARA AI — Privacy-First Women Safety & Community Support Platform

> **AZINHACK ’26 Official Submission**  
> *Tagline:* **“Safer journeys. Stronger together.”**

---

## Table of Contents

1. [Executive Summary & Vision](#executive-summary--vision)
2. [Problem Statement & The Real-World Challenge](#problem-statement--the-real-world-challenge)
3. [Our Solution & Target Users](#our-solution--target-users)
4. [Key Features & Modules](#key-features--modules)
   - [1. Living Safety Map](#1-living-safety-map)
   - [2. Issue Grouping & Observation History](#2-issue-grouping--observation-history)
   - [3. Saheli Circle (Walking Companions)](#3-saheli-circle-walking-companions)
   - [4. Saheli Signal (Place Observations)](#4-saheli-signal-place-observations)
   - [5. Saheli Share (Consensual Cab Coordination)](#5-saheli-share-consensual-cab-coordination)
   - [6. Survivor Support Navigator](#6-survivor-support-navigator)
   - [7. Consent-Based Nearby Safety Alerts](#7-consent-based-nearby-safety-alerts)
   - [8. Account Onboarding & Privacy Controls](#8-account-onboarding--privacy-controls)
   - [9. Streamlined Judge Walkthrough](#9-streamlined-judge-walkthrough)
5. [System Architecture & Monorepo Structure](#system-architecture--monorepo-structure)
6. [Technology Stack](#technology-stack)
7. [TinyFish Integration — How We Use TinyFish](#tinyfish-integration--how-we-use-tinyfish)
   - [1. Why TinyFish Is Used](#1-why-tinyfish-is-used)
   - [2. TinyFish Tools & Capabilities Actually Implemented](#2-tinyfish-tools--capabilities-actually-implemented)
   - [3. End-to-End Architectural Workflow](#3-end-to-end-architectural-workflow)
   - [4. User-Facing Features & Verified UI Components](#4-user-facing-features--verified-ui-components)
   - [5. Example Real-World Use Case: Free Legal Aid in India](#5-example-real-world-use-case-free-legal-aid-in-india)
   - [6. Configuration & Credential Setup Guide](#6-configuration--credential-setup-guide)
   - [7. Testing Status & Known Limitations](#7-testing-status--known-limitations)
   - [8. Privacy, Data Filtering & Responsible-Use Guidelines](#8-privacy-data-filtering--responsible-use-guidelines)
   - [9. Step-by-Step Hackathon Judge Demonstration](#9-step-by-step-hackathon-judge-demonstration)
8. [Live vs Simulated Features Breakdown](#live-vs-simulated-features-breakdown)
9. [Privacy, Security & Responsible-Use Commitments](#privacy-security--responsible-use-commitments)
10. [Setup & Local Installation Guide](#setup--local-installation-guide)
11. [Known Limitations & Future Roadmap](#known-limitations--future-roadmap)
12. [Credits & Acknowledgements](#credits--acknowledgements)

---

## Executive Summary & Vision

**SAAHARA AI** is a privacy-first women-safety and community-support web platform built for **AZINHACK ’26**. 

Rather than relying on invasive continuous GPS tracking, alarmist crime heatmaps, or commercial ride-hailing dependencies, SAAHARA AI empowers women commuters through:
* **Informed Civic Visibility:** Actionable physical observations (streetlights, transit crowd presence, sidewalk barriers).
* **Mutual-Consent Community:** Direct accompaniment and trip sharing strictly locked behind bilateral opt-in.
* **Radical Verification Honesty:** Clear labeling of what has actually been checked (e.g. simulated phone OTP) without ever equating a phone number with identity proof or trustworthiness.
* **Trauma-Informed Support Discovery:** Verified 24/7 statutory helplines and AI-assisted public information retrieval from official government domains (`.gov.in` and `.nic.in`).

---

## Problem Statement & The Real-World Challenge

Women navigating Indian urban transit corridors (such as Bengaluru, Delhi NCR, Mumbai, and Hyderabad) face significant daily safety friction:

1. **Intrusive Tracking vs Safety Dilemma:** Conventional safety applications mandate 24/7 live GPS broadcasting to private servers or emergency contacts. This invasive surveillance creates privacy fatigue and digital vulnerability.
2. **Sensationalized Fearmongering:** Crime heatmap apps label entire working-class neighborhoods or transit stops as "dangerous" or "red zones", creating chronic anxiety without providing physical solutions.
3. **Physical Infrastructure Blindspots:** Safety is fundamentally shaped by physical street conditions—such as a non-functioning streetlight on 12th Main Road, a darkened underpass, or a crowded vs deserted bus bay. Existing navigation maps rarely reflect civic infrastructure realities.
4. **Transit Isolation:** Late-night commuters walking from metro station gates to nearby office tech parks (e.g. Kadubeesanahalli, BKC, Connaught Place) often travel isolated despite dozens of peers heading in the exact same direction.
5. **Ride-Hailing Dependency:** Existing shared mobility options rely on expensive, proprietary taxi-aggregator APIs that are inaccessible to open community solutions and lack granular privacy filters.
6. **Fragmented Emergency Redressal:** Survivors seeking legal aid, emergency refuge (One Stop Centres / Sakhi), or cyber harassment takedowns struggle to navigate bureaucratic portals and frequently fall victim to misinformation.

---

## Our Solution & Target Users

### The Solution
SAAHARA AI bridges physical street reality with community solidarity through a multi-tiered, privacy-preserving architecture:
* **Approximation over Surveillance:** Uses 100–300 meter uncertainty radius buffers around public transit landmarks. Private residential addresses are never gathered, stored, or rendered.
* **Consent Gating:** All peer connections, companion chats, and cab details require bilateral opt-in before disclosure.
* **Civic Observation Grouping:** Physical issues at the same location are grouped into chronological observation timelines rather than spamming duplicate markers.
* **Authoritative Knowledge Retrieval:** TinyFish-powered search retrieves statutory facts directly from official gazettes and portals.

### Target Users
* **Daily Metro & Bus Commuters:** Women navigating first-mile and last-mile connections between transit hubs and workplaces.
* **College Students & Shift Workers:** Women travelling during non-peak or late hours requiring compatible walking companions.
* **Solo Travellers:** Women seeking to share unverified cab details selectively with verified peers without broadcasting to third parties.
* **Survivors & Advocates:** Individuals requiring rapid, confidential access to statutory legal aid, One Stop Centres, and evidence preservation guidelines.

---

## Key Features & Modules

### 1. Living Safety Map
* **Interactive Leaflet Mapping:** Built on OpenStreetMap tiles with custom SVG uncertainty discs (100–300m radius) centered on public junctions and transit stops.
* **Nationwide Transit Landmark Search:** Autocomplete search input covering major transit hubs across Indian metropolitan areas (*Indira Gandhi Metro Station, Bandra Kurla Complex [BKC], Connaught Place Metro, 12th Main Road Indiranagar, MG Road Metro, Cyber City, etc.*). Includes full keyboard accessibility (`ArrowDown`, `ArrowUp`, `Enter`, `Esc`).
* **Multi-Category Filtering:** Street Lighting, Transit Stops & Crowd Visibility, Infrastructure Obstructions, Accessibility (ramps/tactile paths), and Community Observations.
* **Dual Map/List View:** Instant toggle between interactive map view and high-density, accessible card list view.

### 2. Issue Grouping & Observation History
* **Location-and-Category Grouping:** Submitting an observation matching an existing location and category prompts the user to confirm whether they are updating the ongoing issue or logging an unrelated problem.
* **Observation Timelines:** Rather than overwriting past reports or creating duplicate pins, new submissions append an `ObservationHistoryEntry` to the issue's chronological record.
* **Conflict & Uncertainty Logic:** If an issue previously reported as defective is subsequently reported as working, the status automatically recalibrates to **`Condition Uncertain / Needs Recheck`** rather than prematurely declaring the hazard fixed.
* **Permanent Retention of Serious Concerns:** Historical harassment or serious safety records (`isHistoricalConcern`) never auto-expire or disappear over time.

### 3. Saheli Circle (Walking Companions)
* **Accompaniment Feed:** Community posts for walking companions from transit gates to office parks.
* **Public Meeting Recommendations:** Enforces safety guidelines recommending well-lit, public meeting spots (e.g. Metro station ticket concourse, well-lit cafe foyers).
* **Privacy-Preserving Limited Profiles:** Displays only display name, broad occupation category (*college student, working professional, self-employed, other*), broad field, and approximate neighborhood.
* **Bilateral Consent Gate:** Direct messaging is strictly locked until both parties explicitly accept the accompaniment request.

### 4. Saheli Signal (Place Observations)
* **First-Hand Civic Observations:** Voluntary place sightings (*"Streetlights on 12th Main are bright tonight", "Feeder bus stop has active crowd visibility"*).
* **Community Validation:** Upvoting ("Mark Helpful") and corroboration counters.
* **Anti-Defamation Protections:** Sightings are restricted to physical infrastructure and civic crowd conditions; accusations or doxxing of individuals are prohibited.

### 5. Saheli Share (Consensual Cab Coordination)
* **Zero Aggregator Dependency:** Works 100% independently of commercial ride-hailing APIs (no Uber/Ola API required).
* **Corridor & Departure Matching:** Discovers compatible peers travelling in similar directions during similar departure windows.
* **Selective Sharing Modal:** Users selectively choose which specific details to disclose: Cab Provider, Driver Name, Vehicle Number, Pickup Landmark, and Estimated Fare.
* **Unverified Driver Badge:** Manually entered driver and vehicle information is prominently branded as **User-Entered & Unverified** to ensure users exercise independent caution.
* **Hypothetical Fare Splitter:** Split estimation calculator (e.g. ₹420 / 2 = ₹210) clearly disclaimed as voluntary guidance, not a payment gateway.

### 6. Survivor Support Navigator
* **Calm, Trauma-Informed Palette:** Gentle plum and lavender design, free of triggering crime graphics or alarmist red banners.
* **Verified National Helplines:** One-tap calling (`tel:`) to official 24/7 services:
  * **112:** National Emergency Response Support System (ERSS — Police, Fire, Medical)
  * **1091:** Women Police Helpline (Patrol & Distress Dispatch)
  * **181:** Women Helpline Scheme (Ministry of Women and Child Development)
  * **15100:** National Legal Services Authority (NALSA Free Legal Aid)
  * **14416:** Tele-MANAS (24x7 Mental Health Support by NIMHANS)
  * **1930:** National Cyber Crime Reporting Portal
* **"What this helps with" Section:** Plain-language guidance on eligibility and scope for every resource.
* **Safe External Links:** All official portal links point to authentic `.gov.in`/`.nic.in` domains with `target="_blank" rel="noopener noreferrer"`.
* **Evidence Preservation Protocol:** 4-step actionable guide on timestamped screenshots, raw message header exports, contemporaneous notes, and Medico-Legal Certificates (MLC).

### 7. Consent-Based Nearby Safety Alerts
* **Opt-In Permission & Manual Fallback:** Activated via the header bell icon with a consent modal allowing users to opt into proximity alerts or pick a manual landmark.
* **Zero Continuous Tracking:** Does not perform background GPS monitoring. Correlates recent corridor issues and provides direct jumps to map markers.

### 8. Account Onboarding & Privacy Controls
* **4-Step Onboarding Modal:**
  1. *Credentials:* Email/password with visibility toggle, plus a transparent Google Sign-In demo notice explaining required OAuth configurations.
  2. *Verification:* Simulated 2FA verification (`2601`).
  3. *Profile Details:* Display name, broad occupation, broad field, approximate area, and strict 18+ age validation to prevent adult-minor risks.
  4. *Privacy Preferences:* Toggles for approximate area only, hiding daily travel routines, requiring mutual consent for messaging, and selective ride sharing.
* **Honest Verification Badges:** Badges declare phone verification and explicitly clarify that phone checks do not constitute proof of identity, gender, or trustworthiness.

### 9. Streamlined Judge Walkthrough
* **Single "Judge Walkthrough" Trigger:** Prominently positioned in the top navigation bar.
* **4 Grouped Evaluation Sections:**
  1. *Dashboard & Living Safety Map* (search, grouping, history, observation submission).
  2. *Saheli Circle & Saheli Signal* (walking companions, mutual consent gate, place sightings).
  3. *Saheli Share* (independent cab coordination, selective disclosure, fare calculator).
  4. *Account Verification, Privacy & Support Navigator* (onboarding, phone verification honesty, verified 24/7 helplines, TinyFish research).
* **Interactive Evaluation Controls:** Next, Back, Skip, Exit, and Jump-to-Section controls with live modal triggers.

---

## System Architecture & Monorepo Structure

SAAHARA AI is structured as a **single, unified full-stack monorepo** sharing a single `package.json`:

```
saahara-ai/
├── server/                         # BACKEND (Node.js + Express 5 + TypeScript)
│   └── index.ts                    # Express API server, TinyFish proxy & Privacy Filter
├── src/                            # FRONTEND (React 19 + TypeScript + Tailwind CSS v4)
│   ├── assets/                     # Logos, icons, hero illustrations
│   ├── components/                 # UI components and feature modules
│   │   ├── AuthModal.tsx           # 4-step onboarding & verification modal
│   │   ├── DashboardOverview.tsx   # Transit metrics & active modules summary
│   │   ├── LandingPage.tsx         # Public landing page with vision & trust commitments
│   │   ├── Common/                 # Shared widgets (Navbar, EmergencyDrawer, JudgeTourModal, etc.)
│   │   ├── LivingSafetyMap/        # SafetyMap, SafetyListView, SubmitReportModal
│   │   ├── SaheliCircle/           # CommunityFeed, UserProfileModal, PrivateChatModal
│   │   ├── SaheliSignal/           # SignalBoard, PublishSignalModal
│   │   ├── SaheliShare/            # SaheliShareModule, SelectiveSharingModal, FareCalculatorModal
│   │   ├── SupportNavigator/       # SupportNavigatorModule, EvidencePreservationGuide
│   │   ├── TinyFishResearch/       # TinyFishPanel
│   │   └── ProfileSettings/        # ProfileSettingsView
│   ├── data/
│   │   └── sampleData.ts           # Indian transit hubs, statutory helplines, seed reports
│   ├── services/
│   │   ├── storageService.ts       # Central data manager, pub/sub, issue grouping logic
│   │   └── tinyFishService.ts      # Client adapter for /api/tinyfish/research & fallback
│   ├── types/
│   │   └── index.ts                # TypeScript data contracts & models
│   ├── App.css                     # Global styles
│   ├── App.tsx                     # Main application layout & active tab state
│   ├── index.css                   # Tailwind CSS v4 imports
│   └── main.tsx                    # React DOM entry point
├── public/                         # Public assets (favicon.svg, logo.svg)
├── .env.example                    # Template environment variables (no secrets)
├── .gitignore                      # Git exclusion rules (node_modules, dist, .env)
├── .oxlintrc.json                  # Linter configuration
├── index.html                      # HTML document shell
├── package.json                    # Monorepo dependencies & scripts
├── tsconfig.json                   # TypeScript project root
├── tsconfig.app.json               # Frontend TypeScript configuration
├── tsconfig.node.json              # Vite/Node TypeScript configuration
└── vite.config.ts                  # Vite build config with Tailwind v4 & /api proxy
```

### Communication Flow
* Frontend development server runs on **port 5173**.
* Backend API server runs on **port 3001**.
* In [`vite.config.ts`](file:///C:/Users/Mehul/.gemini/antigravity/scratch/saahara-ai/vite.config.ts), Vite proxies `/api/*` requests directly to `http://localhost:3001`.
* `npm run dev:all` starts both servers concurrently via `concurrently`.

---

## Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19** | Modern component rendering and interactive state management |
| **Language & Typings** | **TypeScript 6** | End-to-end static typing across client and server |
| **Build Tool & Bundler** | **Vite 8** | High-speed HMR development and production asset bundling |
| **Styling & Icons** | **Tailwind CSS v4** + **Lucide React** | Responsive design system using plum/lavender color palette |
| **Mapping Engine** | **Leaflet 1.9** + **@types/leaflet** | Open-source interactive map rendering with SVG uncertainty radii |
| **Backend API Server** | **Express 5** | REST endpoints, privacy filtering, external API proxying |
| **Server Runtime** | **tsx 4** | Instant TypeScript execution for Node.js without build steps |
| **Concurrent Runner** | **concurrently 10** | Single command to execute frontend and backend simultaneously |
| **Client Persistence** | **HTML5 localStorage + PubSub** | Zero-dependency reactive local state with multi-component sync |
| **AI Public Research** | **TinyFish Search API** (`/v1/search`) | Scoped discovery of statutory guidelines on official `.gov.in`/`.nic.in` domains |

---

## TinyFish Integration — How We Use TinyFish

### 1. Why TinyFish Is Used

In moments of vulnerability or distress, women seeking emergency refuge, free legal counsel, or cyber harassment assistance face a confusing digital landscape. Generic search engine results and social media are frequently polluted with outdated helpline numbers, sponsored commercial advocate listings, broken links, or misleading legal opinions.

**TinyFish is integrated into SAAHARA AI to solve this statutory information discovery challenge.** 

Its role is to help users quickly surface **authoritative, verified public information** from official Indian government repositories (`.gov.in`, `.nic.in`, `nalsa.gov.in`, `ncw.nic.in`), including:
* **Statutory Free Legal Counsel:** Legal aid rights guaranteed under the Legal Services Authorities Act, 1987.
* **Workplace Sexual Harassment Redressal:** Rules governing Internal Complaints Committees (ICCs) under the POSH Act, 2013.
* **Emergency Refuge & Trauma Support:** Central guidelines and operational protocols for One Stop Centres (Sakhi Centres) and the Women Helpline Scheme (WHL 181).
* **Cyber Crime & Digital Takedowns:** Mandatory 24-hour non-consensual explicit content removal protocols under the Information Technology Rules, 2021.

> [!IMPORTANT]
> **Boundary of Use:** TinyFish in SAAHARA AI is strictly a **public-information discovery engine**. It is **not** an emergency dispatch mechanism (users in immediate danger must dial **112**), does not perform background identity checks, and does not process private user profile data.

---

### 2. TinyFish Tools & Capabilities Actually Implemented

To ensure total transparency for hackathon evaluators and developers, here is the exact audit of TinyFish tools used in this codebase:

| Tool / Capability | Status in Codebase | Exact File & Location | Purpose & Implementation Details |
|---|---|---|---|
| **TinyFish Search API (`/v1/search`)** | **Implemented** | [`server/index.ts`](file:///C:/Users/Mehul/.gemini/antigravity/scratch/saahara-ai/server/index.ts#L47-L85) | Executes targeted search queries restricted to official government domains (`gov.in`, `nic.in`, `nalsa.gov.in`, `ncw.nic.in`) with a result limit of 3. Invoked via `POST` with `X-API-Key`. |
| **Server-Side Privacy Filter Guard** | **Implemented** | [`server/index.ts`](file:///C:/Users/Mehul/.gemini/antigravity/scratch/saahara-ai/server/index.ts#L18-L30) | Custom Express middleware inspecting all outgoing queries to prevent private identity data from reaching external AI APIs. |
| **Client Adapter & Sanitizer** | **Implemented** | [`src/services/tinyFishService.ts`](file:///C:/Users/Mehul/.gemini/antigravity/scratch/saahara-ai/src/services/tinyFishService.ts#L38-L72) | Truncates input queries to a 150-character ceiling and handles seamless failover between live API responses and statutory fallback snapshots. |
| **Pre-Verified Statutory Fallback Adapter** | **Implemented** | [`src/data/sampleData.ts`](file:///C:/Users/Mehul/.gemini/antigravity/scratch/saahara-ai/src/data/sampleData.ts#L720-L808) | Provides curated, gazette-verified statutory snapshots for NALSA, MWCD, and Cyber Crime Portal so the prototype remains functional even when offline or without an API key. |
| **TinyFish Fetch API** | **Not Implemented** | — | Not present in the current prototype; reserved for future deep extraction of dynamic circulars. |
| **TinyFish Web Agent / Browser Infra** | **Not Implemented** | — | SAAHARA AI does **not** launch autonomous browser agents or headless browser crawlers. All communication is lightweight REST JSON. |

---

### 3. End-to-End Architectural Workflow

The following trace details the complete execution lifecycle when a user initiates a research query:

```
[ User Action in UI ]
        │
        ▼
[ TinyFishPanel.tsx ] ──────────────► User selects a topic preset or types a question
        │
        ▼
[ tinyFishService.ts ] ─────────────► Sanitizes query: trims whitespace, slices to 150 chars max
        │
        ▼  POST /api/tinyfish/research
[ Vite Proxy (port 5173) ] ─────────► Forwards /api/* to http://localhost:3001
        │
        ▼
[ Express Backend (server/index.ts) ]
        │
        ├──► [ Privacy Filter Guard ] ──► Any sensitive keywords (password, coords, phone)?
        │                                  ├── YES ──► Returns HTTP 400 Bad Request (Halt)
        │                                  └── NO  ──► Passes to route handler
        │
        ├──► Is TINYFISH_API_KEY configured?
        │       │
        │       ├── YES ──► Calls TinyFish Search API:
        │       │            POST https://api.search.tinyfish.ai/v1/search
        │       │            Header: X-API-Key: <key>
        │       │            Body: { query, domains: ['gov.in', 'nic.in', ...], limit: 3 }
        │       │            Returns status: "live_result"
        │       │
        │       └── NO (or on timeout/network error)
        │               ──► Transparent Fallback: Loads curated statutory record from NALSA/MWCD
        │                   Returns status: "demo_curated_result"
        │
        ▼
[ Client Response Rendered ] ───────► Displays structured cards in TinyFishPanel.tsx
        │
        ▼
[ Inspect Official Source ] ────────► User clicks verified .gov.in link (opens in secure new tab)
```

---

### 4. User-Facing Features & Verified UI Components

The TinyFish Research module is rendered via [`src/components/TinyFishResearch/TinyFishPanel.tsx`](file:///C:/Users/Mehul/.gemini/antigravity/scratch/saahara-ai/src/components/TinyFishResearch/TinyFishPanel.tsx) and includes the following verified features:

* **Mandatory Explanatory Banner:** Prominently rendered at the top of the panel:
  > *“TinyFish Research helps SAAHARA AI find and organize relevant public information from official websites. It supports resource discovery; it does not verify user identities or replace professional or emergency assistance.”*
* **Real-Time Integration Status Badge:**
  * Displays **`Live TinyFish Connected`** (in emerald) when an authenticated key is detected by the backend.
  * Displays **`Demo resources — live retrieval not configured`** (in amber) when no key is present, ensuring judges are never misled.
* **One-Click Topic Preset Buttons:**
  1. *“Free Legal Aid & ICCs”* (`legal_aid`) — Scoped to NALSA clinics and POSH internal complaints committees.
  2. *“One Stop Centres (Sakhi)”* (`emergency_shelter`) — Scoped to MWCD emergency hospital shelter guidelines.
  3. *“Cyber Harassment & Takedowns”* (`cyber_safety`) — Scoped to 24-hour non-consensual image removal under IT Rules 2021.
* **Custom Query Input & Form:** Allows arbitrary user queries with a loading spinner during API dispatch.
* **Fact vs Summary Separation:** Visual containers separate immutable statutory facts (drawn directly from official gazettes) from summarized procedural notes.
* **“Inspect Official Source” Action:** Each result card includes a dedicated external link button with `target="_blank" rel="noopener noreferrer"` and `e.stopPropagation()` pointing directly to the genuine government domain (`https://nalsa.gov.in`, `https://wcd.nic.in/schemes/one-stop-centre-scheme-1`, `https://cybercrime.gov.in`).
* **Integration Setup Guide Accordion:** A collapsible in-app drawer explaining to developers how to configure the backend `.env` file.

---

### 5. Example Real-World Use Case: Free Legal Aid in India

**User Scenario:** A working professional or student in Bengaluru is facing workplace harassment or domestic distress and wants to know if she has a statutory right to free legal representation without incurring heavy advocate fees.

1. **User Action:** She opens SAAHARA AI and clicks the **“TinyFish AI”** tab in the top navigation bar.
2. **Preset Selection:** She clicks the preset button **“Free Legal Aid & ICCs”**.
3. **Execution:** The application sends a sanitized query for statutory legal aid schemes under the Legal Services Authorities Act, 1987.
4. **Results Surface:**
   * **Issuing Authority:** National Legal Services Authority (NALSA) / Supreme Court of India.
   * **Eligibility Guidance:** Section 12(c) of the Legal Services Authorities Act, 1987 explicitly entitles every woman, irrespective of financial status, to free legal counsel.
   * **Verified Statutory Facts:** Zero court fees, typing, or advocate expenses are payable; legal aid clinics exist at every District Court complex and Taluk Committee; 24/7 toll-free helpline `15100`.
   * **AI Summary Notice:** Labeled as derived from official NALSA statutory gazette notifications.
5. **Inspecting the Source:** The user clicks **“Inspect Official Source”**, which immediately opens [`https://nalsa.gov.in`](https://nalsa.gov.in) in a new browser tab, allowing her to locate her nearest Taluk Legal Services clinic directly.

---

### 6. Configuration & Credential Setup Guide

SAAHARA AI is configured using standard environment variables on the Node/Express backend. **Credentials are never exposed to the client bundle.**

#### Environment Variable Definitions (in `.env`):
```env
# SAAHARA AI Backend Port
PORT=3001

# TinyFish Search API Configuration
# Obtain your key from https://agent.tinyfish.ai/api-keys
TINYFISH_API_KEY=your_tinyfish_api_key_here
TINYFISH_API_URL=https://api.search.tinyfish.ai
```

#### Setup Steps:
1. Copy the provided template to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and assign your key:
   ```env
   TINYFISH_API_KEY=tf_live_sample_key_abcdef123456
   ```
3. Restart the unified development environment:
   ```bash
   npm run dev:all
   ```
4. Verify backend configuration at `http://localhost:3001/api/tinyfish/status`:
   ```json
   {
     "isConfigured": true,
     "endpoint": "https://api.search.tinyfish.ai",
     "mode": "live_api",
     "message": "TinyFish API connected with authenticated backend key."
   }
   ```

> [!CAUTION]
> **Zero Credential Exposure:** Real API keys must never be committed to Git. The project's [`.gitignore`](file:///C:/Users/Mehul/.gemini/antigravity/scratch/saahara-ai/.gitignore) explicitly excludes all `.env` files while preserving the safe `.env.example` template.

---

### 7. Testing Status & Known Limitations

#### Verified & Tested Capabilities:
* **Backend Status Health Check:** `GET /api/tinyfish/status` verified to report accurate connection states.
* **Backend Research Endpoint:** `POST /api/tinyfish/research` verified with mock queries, live request formatting, and automatic fallback responses.
* **Privacy Filter Guard Middleware:** Verified to reject payloads containing sensitive keywords (`phone`, `coords`, `latitude`, `password`).
* **Frontend Component Lifecycle:** Verified that `TinyFishPanel.tsx` initializes, queries status on mount, triggers queries on preset clicks, and displays the appropriate fallback badge when unconfigured.
* **Safe External Redirection:** Verified that all official government URLs open securely in a new tab without interfering with the single-page application router.
* **Build Verification:** Complete TypeScript project compiled cleanly with zero errors (`tsc -b && vite build`).

#### Known Limitations:
* **Optional Live Access:** The prototype does not include a pre-packaged paid TinyFish key; by default, it runs in transparent demo fallback mode using authentic statutory records.
* **No Dynamic Web Scraping:** SAAHARA AI does not crawl or download dynamic PDF circulars in real-time.
* **Domain Restrictions:** Outgoing live queries are strictly limited to pre-whitelisted government domains (`gov.in`, `nic.in`, `nalsa.gov.in`, `ncw.nic.in`) to prevent untrusted results from appearing.

---

### 8. Privacy, Data Filtering & Responsible-Use Guidelines

To prevent inadvertent data leakage, SAAHARA AI enforces multi-layered privacy controls on all research requests:

1. **What Is Sent to TinyFish:**
   * Only the sanitized public research query string (capped at 150 characters) and the broad topic category name (e.g. `legal_aid`, `emergency_shelter`).
2. **What Is Strictly Blocked (Privacy Filter Guard):**
   * The backend middleware inspects incoming requests and instantly terminates the request with `HTTP 400` if any of the following are detected:
     `password`, `otp`, `phone`, `coords`, `latitude`, `longitude`, `driver_license`.
3. **Responsible-Use Recommendations for Users & Evaluators:**
   * **Never input personal trauma narratives or incident accounts** into the research search bar.
   * **Never enter real names of individuals, private home addresses, phone numbers, or cab vehicle numbers** into research queries.
   * Use the research engine solely for general, objective statutory inquiries (e.g., *"What documents are needed for free legal aid under NALSA?"*).

---

### 9. Step-by-Step Hackathon Judge Demonstration

Hackathon judges can test and evaluate the complete TinyFish integration in under two minutes:

1. **Open the Application:** Navigate to **`http://localhost:5173`** in your browser.
2. **Navigate to TinyFish Research:** Click on the **“TinyFish AI”** tab in the top navigation bar (or click *“Explore Support Navigator”* from the landing page).
3. **Verify Connection Transparency:**
   * Note the amber badge: **`Demo resources — live retrieval not configured`** (unless you configured a live key in `.env`).
   * Review the introductory banner emphasizing that TinyFish aids discovery and does not replace emergency dispatch.
4. **Test Preset Query:** Click on the preset button **“Free Legal Aid & ICCs”**.
   * Observe the retrieved card for *National Legal Services Authority (NALSA)*.
   * Notice the separate container for **Verified Statutory Facts** highlighting Section 12(c) rights.
5. **Test Official Source Inspection:** Click the **“Inspect Official Source”** button on the card.
   * Confirm that your browser opens [`https://nalsa.gov.in`](https://nalsa.gov.in) in a new tab securely.
6. **Test Custom Query:**
   * Type a question in the search input: `Sakhi One Stop Centre district hospital guidelines`
   * Click **“Search Official Data”**.
   * Observe the loading state and the resulting official MWCD scheme guidelines.
7. **Inspect Developer Guide:** Click **“Integration Setup Guide”** in the top-right corner of the panel to view the backend architecture and `.env` setup instructions.

---

## Live vs Simulated Features Breakdown

| Feature / Module | Current Working Prototype Implementation | Future Live Production Track |
|---|---|---|
| **Living Safety Map** | **Functional Prototype:** Real Leaflet mapping with OpenStreetMap tiles, SVG uncertainty radii, nationwide Indian transit search, location-and-category issue grouping, and observation history timelines. | Municipal Open Data API integration (e.g. BBMP Sahaaya, Delhi PWD, Mumbai BMC). |
| **Account & Onboarding** | **Functional Prototype:** 4-step modal with age verification (strictly 18+), broad category/field, privacy preferences, and simulated 2FA (`2601`). Honest verification badges state phone check != identity proof. | Telecom SMS gateway (Twilio / MSG91) or Google OAuth / OpenID Connect. |
| **Issue Grouping & History** | **Functional Prototype:** Real-time grouping by normalized location & category, conflict detection setting status to "Condition Uncertain / Needs Recheck", and permanent preservation of historical records. | Distributed audit ledger with civic corroboration threshold rules. |
| **Nearby Safety Alerts** | **Functional Prototype:** Consent-based permission modal with manual landmark selection fallback; triggers recent corridor alerts without background GPS tracking. | Web Push Notifications API / Service Workers with voluntary geofence pings. |
| **Saheli Share Matching** | **Functional Prototype:** Deterministic corridor & departure window matching, selective disclosure gate with explicit preview, and unverified driver labeling. | Zero-knowledge corridor clustering and encrypted peer-to-peer data interchange. |
| **Fare Splitting Calculator** | **Functional Prototype:** Mathematical split calculator with clear non-payment disclaimers. | UPI Deep Links / Intent URLs for optional peer-to-peer voluntary settlement. |
| **Survivor Support Navigator** | **Functional Prototype:** Verified directory of official Indian helplines and schemes with plain explanations, safe external links (`target="_blank"`), and evidence preservation guide. | Direct telephonic CTI integration and district-level One Stop Centre hospital directory. |
| **TinyFish Public Research** | **Functional Prototype with Fallback:** Backend Express proxy with privacy filter middleware; calls TinyFish Search API if `TINYFISH_API_KEY` is set, or serves pre-verified statutory snapshots with transparent labeling. | Live production TinyFish agent with streaming citations and automated gazette indexing. |

---

## Privacy, Security & Responsible-Use Commitments

1. **Zero Continuous GPS Broadcasting:** SAAHARA AI never records or broadcasts exact user coordinates. Public markers use 100–300 meter uncertainty radii around transit landmarks.
2. **Data Minimization:** No government identity documents (Aadhaar, PAN, passport), residential addresses, or daily travel schedules are required or stored.
3. **Age Safety Controls:** Strict 18+ requirement during onboarding to eliminate risks of adult-minor contact in public transit matching.
4. **Backend Privacy Filter Guard:** Express middleware actively intercepts outgoing research queries and rejects payloads containing sensitive keywords (`phone`, `password`, `latitude`, `coords`, `driver_license`).
5. **No False Verification Badges:** Email or phone verification confirms only receipt of a message; it is never branded as proof of identity, gender, or moral character.
6. **Data Sovereignty:** Users can download their local data snapshot as a JSON file or purge all browser storage with a single click.

---

## Setup & Local Installation Guide

### Prerequisites
* **Node.js:** v18.0.0 or higher (tested on Node v24.x)
* **npm:** v9.0.0 or higher

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/saahara-ai.git
   cd saahara-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   * On Linux / macOS / Git Bash:
     ```bash
     cp .env.example .env
     ```
   * On Windows PowerShell:
     ```powershell
     Copy-Item .env.example .env
     ```
   *(Optional: If you have a TinyFish developer key, add it to `.env`. Otherwise, leave it blank to run in labelled demo fallback mode).*

4. **Start the Development Server:**
   ```bash
   npm run dev:all
   ```
   * Frontend: **`http://localhost:5173`**
   * Backend API: **`http://localhost:3001/api/tinyfish/status`**

5. **Build for Production (Validation):**
   ```bash
   npm run build
   ```

---

## Known Limitations & Future Roadmap

* **Local Browser Session Persistence:** The prototype uses HTML5 `localStorage` for zero-setup evaluation. Production deployment would integrate an end-to-end encrypted database (e.g. SQLite/PostgreSQL with client-side derived keys).
* **Real-Time Cross-Device WebSockets:** In the current prototype, companion requests and simulated chat messages sync reactively across tabs within the same browser instance. A production rollout would integrate encrypted WebSocket relays.
* **Adult-Only Scope:** The prototype is strictly restricted to adults (18+) to eliminate risks of adult-minor contact. A future youth safety track would incorporate parental consent workflows and verified school zones.
* **Civic Municipal Integration:** Linking community observations directly with municipal public works departments (e.g. BBMP, PWD) to track official civic repair tickets.

---

## Credits & Acknowledgements

* **AZINHACK ’26:** Developed for the AZINHACK ’26 Hackathon.
* **Mapping Data:** OpenStreetMap contributors and Leaflet.
* **Statutory Resources:** Ministry of Women and Child Development (MWCD), National Legal Services Authority (NALSA), National Cyber Crime Reporting Portal (MHA), and NIMHANS (Tele-MANAS).
* **Research Infrastructure:** TinyFish AI Search API (`api.search.tinyfish.ai`).

---

*“Safer journeys. Stronger together.”*  
*SAAHARA AI — AZINHACK ’26*
