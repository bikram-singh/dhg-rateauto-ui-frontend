<div align="center">

# 🏥 DHG Vaccine Fee Dashboard

### React 18 · Deep Ocean Teal · AI-Powered · Voice Enabled
### `dhg-rateauto-ui-frontend` — Dummy Health Group Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![nginx](https://img.shields.io/badge/nginx-1.25--alpine-009639?logo=nginx&logoColor=white)](https://nginx.org)
[![GKE](https://img.shields.io/badge/Deploy-GKE_Autopilot-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com/kubernetes-engine)
[![JWT](https://img.shields.io/badge/Auth-JWT_8hr-FF6D00?logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Claude AI](https://img.shields.io/badge/AI-Claude_Sonnet-7C3AED?logo=anthropic&logoColor=white)](https://anthropic.com)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps)
[![License](https://img.shields.io/badge/License-Internal-grey)](https://github.com/bikram-singh/dhg-rateauto-ui-frontend)

<br/>

**🌐 Live:** [`https://dev.gcpcloudhub.shop/vaccinefee-ui`](https://dev.gcpcloudhub.shop/vaccinefee-ui)

*An enterprise-grade vaccine pricing dashboard with real-time KPIs, AI voice advisor, global search, 20 functional pages, JWT authentication, dark/light mode, and full data export — built on React 18 and deployed on GKE Autopilot.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [All 20 Pages](#-all-20-pages)
- [Project Structure](#-project-structure)
- [Theme System](#-theme-system)
- [Authentication](#-authentication)
- [Global Search](#-global-search)
- [AI Vaccine Advisor](#-ai-vaccine-advisor)
- [API Integration](#-api-integration)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Docker](#-docker)
- [Kubernetes](#-kubernetes)
- [Local Development](#-local-development)
- [Environment Variables](#-environment-variables)
- [ESLint & Code Quality](#-eslint--code-quality)
- [Security](#-security)
- [Related Repositories](#-related-repositories)

---

## 🌐 Overview

The **DHG Vaccine Fee Dashboard** is a full-featured healthcare analytics platform built for the Dummy Health Group. It provides real-time visibility into vaccine pricing across **~150 hospitals** in India, USA, Europe, and Asia — enabling administrators and clinicians to compare prices, track availability, book appointments, and get AI-powered vaccination advice.

### 🔑 Key Numbers

| Metric | Value |
|---|---|
| 📄 **Total Pages** | 20 functional pages |
| 🏥 **Hospitals** | ~150 (India + USA + Europe + Asia + Middle East) |
| 💉 **Vaccines** | 40 real vaccines with manufacturers |
| 💰 **Pricing Records** | 5,000+ across all hospitals |
| 🌍 **Countries** | 15+ (India, USA, UK, Germany, Singapore, UAE, etc.) |
| 🤖 **AI** | Claude Sonnet — voice + chat advisor |
| ⚡ **Auto-refresh** | Every 30 seconds with countdown |
| 🎨 **Theme** | Deep Ocean Teal — dark/light mode |
| 📱 **PWA** | Installable as mobile app |

---

## 🚀 Live Demo

| URL | Description |
|---|---|
| 🌐 **Dashboard** | [`https://dev.gcpcloudhub.shop/vaccinefee-ui`](https://dev.gcpcloudhub.shop/vaccinefee-ui) |
| ⚡ **API** | [`https://dev.gcpcloudhub.shop/vaccinefee/api`](https://dev.gcpcloudhub.shop/vaccinefee/api) |
| 📖 **Swagger** | [`https://dev.gcpcloudhub.shop/vaccinefee/api/docs`](https://dev.gcpcloudhub.shop/vaccinefee/api/docs) |

### 🔐 Login Credentials

| Role | Username | Password | Access |
|---|---|---|---|
| 👑 **Admin** | `bikram` | `Admin@123` | Full CRUD — all pages |
| 👁️ **Viewer** | `viewer` | `View@123` | Read-only — no write buttons |

---

## 📸 Screenshots

> **How to add screenshots:** Create a folder `docs/screenshots/` in this repository, upload your PNG/JPG files there, then replace the placeholder paths below.

```bash
# Create the screenshots folder
mkdir -p docs/screenshots

# Add your screenshots (from Windows — copy files to repo)
# Name them clearly: dashboard.png, hospitals.png, etc.

git add docs/screenshots/
git commit -m "docs: add UI screenshots"
git push
```

### Dashboard
<!-- Replace with actual screenshot after uploading -->
```
docs/screenshots/dashboard.png
```
> 📌 **To add:** Take a screenshot of the Dashboard page and save as `docs/screenshots/dashboard.png`, then replace the block above with:
> `![Dashboard](docs/screenshots/dashboard.png)`

### Hospitals List
```
docs/screenshots/hospitals.png
```
> 📌 **To add:** `![Hospitals List](docs/screenshots/hospitals.png)`

### Vaccine Advisor (AI)
```
docs/screenshots/vaccine-advisor.png
```
> 📌 **To add:** `![Vaccine Advisor](docs/screenshots/vaccine-advisor.png)`

### Pricing Page
```
docs/screenshots/pricing.png
```
> 📌 **To add:** `![Pricing](docs/screenshots/pricing.png)`

### Light Mode
```
docs/screenshots/light-mode.png
```
> 📌 **To add:** `![Light Mode](docs/screenshots/light-mode.png)`

> 💡 **Tip:** Once you have uploaded all screenshots to `docs/screenshots/`, you can also host them anywhere (Google Drive public link, Imgur, etc.) and use the direct image URL instead of a relative path.

---

## 🛠️ Tech Stack

### Frontend Core

| Technology | Version | Purpose |
|---|---|---|
| ⚛️ **React** | 18 | UI component framework |
| 📦 **react-scripts** | Latest | Build tooling (CRA) |
| 📊 **Recharts** | Latest | Bar charts, line charts, pie charts, radar |
| 🎨 **Lucide React** | 0.383.0 | Icon library (200+ icons used) |
| 🌐 **Web Speech API** | Browser native | Voice input + text-to-speech |

### Serving & Deployment

| Technology | Version | Purpose |
|---|---|---|
| 🌐 **nginx** | 1.25-alpine | Production static file serving on port 8080 |
| 🐳 **Docker** | Multi-stage | Node builder → nginx runtime image |
| ☸️ **GKE Autopilot** | Latest | Kubernetes deployment target |
| 📦 **GAR** | — | Google Artifact Registry for Docker images |

### Backend Integration

| Technology | Purpose |
|---|---|
| 🐍 **FastAPI** | REST API backend (Python) |
| 🔐 **JWT** | 8-hour tokens, HS256 algorithm |
| 🐘 **PostgreSQL** | Cloud SQL via PSC (10.10.0.3) |
| 🤖 **Claude API** | AI Vaccine Advisor powered by Anthropic |

---

## ✨ Features

### 🔍 Global Search
Search across **all 4 categories simultaneously** from the top search bar:
- 🗂️ **Pages** — all 20 pages with descriptions, click to navigate directly
- 💉 **Vaccines** — name, manufacturer, min price, hospital count
- 🏥 **Hospitals** — name, location, avg price, vaccine count
- 🏢 **Departments** — name, quick navigation

Type `"vaccine card"` → shows the Vaccine Card page → click → navigates there instantly.

### 🤖 AI Vaccine Advisor
- Powered by **Claude Sonnet** via Anthropic API
- **Voice input** using Web Speech API (`en-IN` — Indian English)
- **Text-to-speech** reads AI responses aloud
- Knows all 40 vaccines, their prices, and all 150 hospitals
- Suggested questions for quick start
- New chat / clear conversation button

### 📊 Live KPI Dashboard
- **Auto-refresh every 30 seconds** with countdown timer
- Manual refresh button with spin animation
- Live stats: Total Vaccines, Hospitals Covered, Avg Price, Availability
- Low stock alerts (⚠️) and out-of-stock warnings (🚫)

### 🔔 Bell Notifications
- Real-time low stock alerts in the header
- Animated pulse indicator on bell icon
- Dismiss individual alerts or dismiss all
- Shows vaccine + hospital name + stock count

### 🌙 Dark / Light Mode
- **Smooth 0.3s CSS transition** between modes
- Dark: Deep Ocean Teal (`#0A1628` background, `#2DD4BF` accent)
- Light: Soft teal-blue (`#EBF5F7` background, dark navy text)
- All 20 pages theme-aware via central `theme.js` helper
- Persists preference in session

### 📤 Data Export (every page)
- **CSV export** — all table data
- **Print** — browser print dialog with clean formatting
- **Appointment slip** — printable booking confirmation
- **Vaccine Card** — printable vaccination record

### 📱 PWA — Installable
- `manifest.json` configured for mobile installation
- Works on Android (Add to Home Screen) and iOS (Share → Add to Home)
- Offline-capable shell

### 🔐 RBAC — Role-Based Access
| Role | Capability |
|---|---|
| **Admin** | View + Create + Edit + Delete all data |
| **Viewer** | View only — all write/edit/delete buttons hidden |

---

## 📱 All 20 Pages

### 🏠 MAIN

| Page | Path | Key Features |
|---|---|---|
| **Dashboard** | `/` (default) | Live KPIs, price chart, paginated table, filters (department/vaccine/hospital/location/price), CSV export, auto-refresh 30s |

---

### 🏥 HOSPITALS (5 pages)

| Page | Key Features |
|---|---|
| **Departments** | 13 department cards — pricing record count, avg price per department |
| **Hospitals List** | Sortable table of all ~150 hospitals — location, avg price, vaccine count |
| **Hospital Profiles** | Click any hospital → full profile — bar chart, pie chart, vaccine table, CSV export |
| **Rankings** | Score-based hospital ranking using availability + price + insurance coverage |
| **Compare** | Side-by-side comparison of up to 4 hospitals — radar chart, metric table |

---

### 💉 VACCINES (4 pages)

| Page | Key Features |
|---|---|
| **Vaccine Search** | Filter by age group, disease category, max price slider, availability toggle |
| **Vaccine Details** | Clinical info, side effects, dosage schedule, which hospitals offer it |
| **Vaccine Card** | Fill patient details, select vaccines received, print professional vaccination record |
| **Appointments** | 5-step booking wizard: vaccine → hospital → date/time → patient info → confirm + print slip |

---

### 💰 PRICING (3 pages)

| Page | Key Features |
|---|---|
| **Pricing** | Full pricing table — filters, stock status badges, insurance badges, CSV export |
| **Price History** | 10-month historical trend, compare up to 5 vaccines, min/max/avg stats |
| **Price Prediction** | ML linear regression — 3-month forecast with confidence range, visual chart |

---

### 📊 ANALYTICS (3 pages)

| Page | Key Features |
|---|---|
| **City Analytics** | Compare Delhi vs Mumbai vs Bengaluru — bar chart, radar chart, city rankings |
| **Advanced Reports** | KPI summary, top vaccines chart, availability pie chart, PDF export, email report UI |
| **Reports** | Summary analytics — vaccine distribution, hospital coverage, price trends |

---

### 🔧 ADMIN (3 pages)

| Page | Key Features |
|---|---|
| **Admin Panel** | Full CRUD — add/edit/delete vaccines, hospitals, departments, pricing via UI |
| **User Management** | Add/delete users, assign Admin/Viewer role — no Cloud Shell needed |
| **Audit Log** | Track every action: LOGIN/CREATE/UPDATE/DELETE/VIEW with timestamp — export CSV |

---

### ✨ AI (1 page)

| Page | Key Features |
|---|---|
| **Vaccine Advisor** | Claude-powered chat, voice input (en-IN), text-to-speech, vaccine + hospital data context |

---

## 📁 Project Structure

```
dhg-rateauto-ui-frontend/
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── 📄 ci.yml              # Lint → Build → Docker push → GKE deploy
│       └── 📄 gke-deploy.yml     # Reusable deploy workflow
│
├── 📁 Docker/
│   └── 📄 Dockerfile             # Multi-stage: node:20-alpine → nginx:1.25-alpine
│
├── 📁 k8s/
│   ├── 📄 deployment.yaml        # K8s Deployment (2 replicas, rolling update)
│   ├── 📄 service.yaml           # ClusterIP Service on port 8080
│   ├── 📄 hpa.yaml               # Horizontal Pod Autoscaler
│   └── 📄 serviceaccount.yaml    # K8s ServiceAccount
│
├── 📁 dhg-vaccinefee-ui/         # React application root
│   ├── 📄 package.json           # Dependencies: react, recharts, lucide-react
│   ├── 📄 .eslintrc.js           # ESLint config (warnings = errors in CI)
│   │
│   └── 📁 src/
│       ├── 📄 theme.js           # ⭐ Central dark/light color system
│       ├── 📄 index.css          # Design tokens, layout, components (966 lines)
│       ├── 📄 App.js             # Root component
│       │
│       ├── 📁 services/
│       │   └── 📄 api.js         # All API calls with JWT auth + paginated fetching
│       │
│       ├── 📁 pages/
│       │   ├── 📄 Dashboard.jsx  # Main orchestrator — auth gate, routes all 20 pages
│       │   ├── 📄 LoginPage.jsx  # JWT login with branded DHG form
│       │   └── 📄 AdminPanel.jsx # CRUD admin interface
│       │
│       └── 📁 components/
│           ├── 📄 Header.jsx              # Logo, global search, bell alerts, dark mode
│           ├── 📄 Sidebar.jsx             # Grouped nav — always-visible sub-items
│           ├── 📄 Filters.jsx             # Dashboard filter bar
│           ├── 📄 StatsCards.jsx          # Live KPI cards with auto-refresh
│           ├── 📄 PriceChart.jsx          # Recharts line/bar chart
│           ├── 📄 DataTable.jsx           # Paginated table with search
│           ├── 📄 AIVaccineAdvisor.jsx    # Claude AI + voice + TTS
│           ├── 📄 HospitalProfilePage.jsx # Hospital detail with charts
│           ├── 📄 HospitalRankingPage.jsx # Score-based rankings
│           ├── 📄 CompareHospitalsPage.jsx# Side-by-side hospital comparison
│           ├── 📄 DepartmentsPage.jsx     # 13 department cards
│           ├── 📄 HospitalsPage.jsx       # Hospitals table
│           ├── 📄 VaccineSearchPage.jsx   # Filtered vaccine search
│           ├── 📄 VaccineDetailPage.jsx   # Vaccine clinical details
│           ├── 📄 VaccineCardPage.jsx     # Printable vaccination record
│           ├── 📄 AppointmentPage.jsx     # 5-step booking wizard
│           ├── 📄 PricingPage.jsx         # Full pricing table
│           ├── 📄 PriceHistoryPage.jsx    # Historical price trends
│           ├── 📄 PricePredictionPage.jsx # ML 3-month forecast
│           ├── 📄 CityAnalyticsPage.jsx   # City comparison analytics
│           ├── 📄 AdvancedReportsPage.jsx # PDF/email report generator
│           ├── 📄 ReportsPage.jsx         # Summary analytics
│           ├── 📄 UserManagementPage.jsx  # User CRUD (Admin only)
│           └── 📄 AuditLogPage.jsx        # Action history log
│
└── 📄 README.md                   # This file
```

---

## 🎨 Theme System

The entire dashboard uses a **centralised theme helper** in `src/theme.js`:

```javascript
export const theme = (dark = true) => ({
  // Backgrounds
  page:       dark ? "#0A1628"                : "#EBF5F7",
  card:       dark ? "#0D1F35"                : "#FFFFFF",
  cardAlt:    dark ? "#0F2440"                : "#F0FBFC",
  input:      dark ? "rgba(255,255,255,0.08)" : "#F0FBFC",
  hover:      dark ? "rgba(255,255,255,0.04)" : "rgba(8,145,178,0.05)",
  tableHead:  dark ? "rgba(255,255,255,0.05)" : "#EBF8FA",

  // Text
  text:       dark ? "rgba(255,255,255,0.88)" : "#0C2340",
  textSec:    dark ? "rgba(255,255,255,0.55)" : "#2E6B7A",
  textMuted:  dark ? "rgba(255,255,255,0.35)" : "#6B9EAA",

  // Borders
  border:     dark ? "rgba(255,255,255,0.08)" : "rgba(8,145,178,0.12)",
  borderMid:  dark ? "rgba(255,255,255,0.12)" : "rgba(8,145,178,0.2)",

  // Accents (same in both modes)
  teal:       "#2DD4BF",
  tealMid:    "#0891B2",
  tealBg:     dark ? "rgba(45,212,191,0.1)"  : "rgba(8,145,178,0.08)",
  green:      "#34D399",
  red:        "#F87171",
  amber:      "#FCD34D",
  price:      dark ? "#2DD4BF"               : "#0891B2",
});
```

Every component imports this and uses `t.card`, `t.text`, `t.border` etc. — toggling `darkMode` instantly switches the entire UI.

### Deep Ocean Teal Design Tokens

| Token | Dark Mode | Light Mode |
|---|---|---|
| Page BG | `#0A1628` | `#EBF5F7` |
| Cards | `#0D1F35` | `#FFFFFF` |
| Sidebar | `#091422` | `#091422` (stays dark) |
| Accent | `#2DD4BF` | `#2DD4BF` |
| Primary Text | `rgba(255,255,255,0.88)` | `#0C2340` |
| Secondary Text | `rgba(255,255,255,0.55)` | `#2E6B7A` |

---

## 🔐 Authentication

### JWT Flow

```
1. User submits credentials on LoginPage.jsx
         │
2. POST /vaccinefee/api/auth/login
   → FastAPI verifies against PostgreSQL users table
   → Returns JWT (HS256, 8hr expiry)
         │
3. Token stored in localStorage: "dhg_jwt_token"
         │
4. Dashboard.jsx validates token on load:
   const payload = JSON.parse(atob(jwt.split(".")[1]));
   if (payload.exp * 1000 > Date.now()) { /* valid */ }
         │
5. Every API call includes: Authorization: Bearer <token>
         │
6. Token expiry → automatic redirect to LoginPage
```

### Role-Based UI

```javascript
// Admin sees everything
// Viewer sees no write buttons
{currentUser?.role === "Admin" && (
  <button onClick={handleCreate}>Add Hospital</button>
)}
```

---

## 🔍 Global Search

The Header search bar searches **4 categories simultaneously**:

```javascript
const ALL_PAGES = [
  { label: "Dashboard",        icon: "🏠", desc: "Main dashboard with live KPIs" },
  { label: "Hospitals List",   icon: "🏥", desc: "All hospitals directory" },
  { label: "Vaccine Card",     icon: "🪪", desc: "Print your vaccination record card" },
  // ... all 20 pages
];

const searchResults = useMemo(() => {
  // Pages — matches label or description
  const matchPages = ALL_PAGES.filter(p =>
    p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
  );
  // Vaccines — matches name or manufacturer
  const matchVaccines = vaccines.filter(v =>
    v.name.toLowerCase().includes(q) || v.manufacturer.toLowerCase().includes(q)
  );
  // Hospitals — matches name or location
  const matchHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)
  );
  // Departments
  const matchDepts = departments.filter(d => d.name.toLowerCase().includes(q));

  return { pages: matchPages, vaccines: matchVaccines,
           hospitals: matchHospitals, departments: matchDepts };
}, [searchQuery, vaccines, hospitals, departments, pricing]);
```

Clicking any result calls `onNavigate(item.label)` to switch the active page.

---

## 🤖 AI Vaccine Advisor

### Architecture

```
User types/speaks question
        │
        ▼
Web Speech API (voice input, en-IN locale)
        │
        ▼
AIVaccineAdvisor.jsx builds system prompt:
  - All 40 vaccines + manufacturers + price ranges
  - All ~150 hospitals + locations
  - Current pricing data
        │
        ▼
POST /vaccinefee/api/ai/chat
  → FastAPI forwards to Anthropic API
  → claude-sonnet-4-20250514
        │
        ▼
Response displayed in chat bubbles
        │
        ▼
SpeechSynthesis API reads response aloud (en-IN, rate: 0.9)
```

### Features

- 🎤 **Voice Input** — click mic → speak → transcribes automatically
- 🔊 **Text-to-Speech** — toggle speaker button to hear responses
- 💬 **Chat History** — full conversation context maintained per session
- 🔄 **New Chat** — clear conversation and start fresh
- 💡 **Suggested Questions** — pre-built questions for quick start
- 📊 **Data-aware** — AI knows real prices, hospitals, and vaccine details

---

## 🌐 API Integration

### `src/services/api.js`

```javascript
const API_BASE = "/vaccinefee/api";

// Public endpoints — no auth header
export const fetchPublicVaccines = () =>
  fetchJSON(`${API_BASE}/vaccines/?limit=200`);

// Protected endpoints — JWT required
export const fetchPricing = (token) =>
  fetchJSONAuth(`${API_BASE}/pricing/`, token);

// Paginated fetch (5,000+ records)
export const fetchAllPricing = async (token) => {
  let all = [], skip = 0;
  while (true) {
    const batch = await fetchJSONAuth(
      `${API_BASE}/pricing/?limit=500&skip=${skip}`, token
    );
    if (!batch.length) break;
    all = [...all, ...batch];
    if (batch.length < 500) break;
    skip += 500;
  }
  return all;  // Returns all 5,000+ records
};
```

The **paginated fetch** solves the 504 Gateway Timeout — instead of requesting all 5,000+ records at once, it batches in groups of 500.

---

## ⚙️ CI/CD Pipeline

### Pipeline Flow

```
On Push to main:
  ┌──────────┐   ┌──────────────┐   ┌────────────────┐   ┌───────────────┐
  │ Setup    │──▶│ npm install  │──▶│ npm run lint   │──▶│ npm run build │
  │ Node 20  │   │              │   │ (ESLint)        │   │ (React prod)  │
  └──────────┘   └──────────────┘   └────────────────┘   └───────┬───────┘
                                                                  │
  ┌──────────────────┐   ┌──────────────────┐   ┌────────────────▼───────┐
  │ kubectl          │◀──│ Push to GAR       │◀──│ Docker build           │
  │ set image        │   │ us-central1-      │   │ -f Docker/Dockerfile   │
  │ (rolling deploy) │   │ docker.pkg.dev/...│   │ nginx:1.25-alpine      │
  └──────────┬───────┘   └──────────────────┘   └────────────────────────┘
             │
  ┌──────────▼──────────┐
  │ kubectl rollout      │
  │ status (verify)      │
  └─────────────────────┘
```

### Key CI Behaviour

- **`process.env.CI = true`** — ESLint warnings are treated as errors. Any unused variable, missing hook dependency, or import error **fails the build**
- **WIF auth** — no JSON keys; GitHub OIDC → short-lived GCP token per run
- **Rolling update** — `maxSurge: 1, maxUnavailable: 0` — zero downtime deploys

---

## 🐳 Docker

### Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY dhg-vaccinefee-ui/package*.json ./
RUN npm ci --only=production
COPY dhg-vaccinefee-ui/ .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.25-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY Docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### nginx Configuration

```nginx
server {
    listen 8080;
    root /usr/share/nginx/html;
    index index.html;

    # All routes serve index.html (React SPA routing)
    location /vaccinefee-ui {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to backend service
    location /vaccinefee/api {
        proxy_pass http://dhg-vaccinefee-api:8080;
    }
}
```

### Build Locally

```bash
# Build the Docker image
docker build -f Docker/Dockerfile -t dhg-vaccinefee-ui:local .

# Run locally
docker run -p 8080:8080 dhg-vaccinefee-ui:local

# Open in browser
open http://localhost:8080/vaccinefee-ui
```

---

## ☸️ Kubernetes

### Deployment Strategy

```yaml
# k8s/deployment.yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1          # One extra pod during update
    maxUnavailable: 0    # Never reduce below desired count
progressDeadlineSeconds: 900  # 15 min timeout

# Container
containers:
  - name: dhg-vaccinefee-ui
    image: us-central1-docker.pkg.dev/dhg-vaccine-rateauto-nonpord/dhg-vaccinefee-repo/dhg-vaccinefee-ui:latest
    ports:
      - containerPort: 8080
    resources:
      requests:
        memory: "128Mi"
        cpu: "100m"
      limits:
        memory: "256Mi"
        cpu: "500m"
```

### Key K8s Resources

| File | Purpose |
|---|---|
| `deployment.yaml` | Pod spec, image, resources, rolling update strategy |
| `service.yaml` | ClusterIP service exposing port 8080 internally |
| `hpa.yaml` | Auto-scales pods based on CPU/memory |
| `serviceaccount.yaml` | K8s ServiceAccount for Workload Identity |

---

## 🖥️ Local Development

### Prerequisites

```bash
node --version  # >= 18
npm --version   # >= 9
```

### Quick Start

```bash
# 1. Clone
git clone https://github.com/bikram-singh/dhg-rateauto-ui-frontend.git
cd dhg-rateauto-ui-frontend/dhg-vaccinefee-ui

# 2. Install dependencies
npm install

# 3. Start dev server (with hot reload)
npm start
# → http://localhost:3000
# → Proxies /vaccinefee/api to backend automatically

# 4. Build for production
npm run build
# → outputs to /build folder

# 5. Run linter
npm run lint
# → ESLint with react-hooks rules
```

### Available Scripts

| Script | Command | Description |
|---|---|---|
| 🚀 **Start** | `npm start` | Dev server on port 3000, hot reload |
| 🏗️ **Build** | `npm run build` | Production React build → `/build` |
| 🔍 **Lint** | `npm run lint` | ESLint — all warnings treated as errors |
| 🧪 **Test** | `npm test` | Run Jest tests |

---

## 🔧 Environment Variables

The app uses the API base path prefix `/vaccinefee/api` which is handled at the nginx/gateway level — no `.env` file needed for the API URL.

For local development, `package.json` includes a proxy:

```json
{
  "proxy": "http://localhost:8000"
}
```

This forwards `/vaccinefee/api/*` calls from React dev server to the local FastAPI backend running on port 8000.

---

## 📋 ESLint & Code Quality

### Rules Enforced

```json
{
  "extends": ["react-app", "react-app/jest"],
  "rules": {
    "no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-undef": "error"
  }
}
```

### CI Enforcement

Because `process.env.CI = true` in GitHub Actions:
- ⚠️ **Warnings → Errors**: any ESLint warning causes build failure
- All unused imports, unused variables, missing hook dependencies must be resolved before merge

### Common Patterns Used

```javascript
// ✅ Correct — disable only when intentional
useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

// ✅ Correct — avoid && with numbers (renders 0)
{price > 0 ? `₹${price}` : ""}   // NOT: {price && `₹${price}`}

// ✅ Correct — theme via helper
const t = theme(darkMode);
<div style={{ background: t.card, color: t.text }}>
```

---

## 🔒 Security

### Frontend Security Model

| Layer | Implementation |
|---|---|
| **Auth** | JWT stored in `localStorage`, 8-hour expiry, auto-redirect on expiry |
| **RBAC** | Role checked on every write button — Viewer sees read-only UI |
| **HTTPS** | All traffic via Google-managed SSL cert (TLS 1.2+) |
| **No secrets in code** | API keys injected via K8s Secrets at runtime |
| **CSP** | nginx configured with security headers |
| **Input sanitisation** | React's default XSS protection (JSX escapes output) |
| **API auth** | Every protected endpoint sends `Authorization: Bearer <token>` |

### JWT Token Validation

```javascript
// Dashboard.jsx — validates token on every load
const validateToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();  // Not expired
  } catch {
    return false;  // Malformed token
  }
};
```

---

## 🔗 Related Repositories

| Repository | Purpose | Role |
|---|---|---|
| [`dhg-rateauto-ui-frontend`](https://github.com/bikram-singh/dhg-rateauto-ui-frontend) | **This repo** — React Frontend | App layer |
| [`dhg-rateauto-api-backend`](https://github.com/bikram-singh/dhg-rateauto-api-backend) | FastAPI Backend | App layer |
| [`dhg-rateauto-tf-vpc`](https://github.com/bikram-singh/dhg-rateauto-tf-vpc) | VPC Network | Infrastructure |
| [`dhg-rateauto-tf-gke`](https://github.com/bikram-singh/dhg-rateauto-tf-gke) | GKE Cluster | Infrastructure |
| [`dhg-rateauto-tf-gke-routing`](https://github.com/bikram-singh/dhg-rateauto-tf-gke-routing) | Gateway API / HTTPS | Infrastructure |
| [`dhg-rateauto-tf-postgres`](https://github.com/bikram-singh/dhg-rateauto-tf-postgres) | Cloud SQL PostgreSQL | Infrastructure |
| [`dhg-rateauto-tf-gcs-buckets`](https://github.com/bikram-singh/dhg-rateauto-tf-gcs-buckets) | GCS Buckets | Infrastructure |

---

<div align="center">

**Maintained by Bikram Singh**

`dhg-vaccine-rateauto-nonpord` · `us-central1` · React 18 + GKE Autopilot

🌐 **Live:** [`https://dev.gcpcloudhub.shop/vaccinefee-ui`](https://dev.gcpcloudhub.shop/vaccinefee-ui)

</div>
