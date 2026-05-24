# DHG Enterprise UI — Vaccine Pricing Dashboard

React dashboard for the Dummy Health Group (DHG) healthcare vaccine pricing system.

## Stack
- **React 18** — UI framework
- **Recharts** — bar/line charts
- **Lucide React** — icons
- **nginx** — production static serving (port 8080)
- **GKE** — Kubernetes deployment via GitHub Actions

## Local Development

```bash
npm install
npm start        # http://localhost:3000
```

## Build

```bash
npm run build    # outputs to /build
```

## Docker

```bash
docker build -f .docker/Dockerfile -t dhg-enterprise-ui:local .
docker run -p 8080:8080 dhg-enterprise-ui:local
```

## Project Structure

```
src/
  components/
    Header.jsx       # Top bar with logo, search, user
    Sidebar.jsx      # Left nav (Dashboard, Departments, Hospitals, Pricing)
    Filters.jsx      # Department / Vaccine / Facility / Location dropdowns + price range
    StatsCards.jsx   # Total Vaccines, Hospitals Covered, Avg Price, Price Trend
    PriceChart.jsx   # Grouped bar chart + trend line (Recharts)
    DataTable.jsx    # Paginated table with search, status badges, insurance badges
  pages/
    Dashboard.jsx    # Page layout compositor
  App.js
  index.css          # Complete design system (CSS variables, all component styles)

.docker/
  Dockerfile         # Multi-stage: node:20-alpine builder → nginx:1.25-alpine

k8s/
  deployment.yaml
  service.yaml
  hpa.yaml
  serviceaccount.yaml

.github/workflows/
  ci.yml             # Lint → Test → Build → Docker push → GKE deploy (dev/test/stage)
  gke-deploy.yml     # Reusable deploy workflow
```

## CI/CD

Push to `main` triggers: lint → test → build → Docker image push to Google Artifact Registry → GKE rollout (dev → test → stage).

## Changes from Original

| Area | Before | After |
|------|--------|-------|
| npm registry | JFrog Artifactory (private) | Public npmjs.org |
| Docker base image | UHG golden images | `node:20-alpine` + `nginx:1.25-alpine` |
| CI runner | `uhg-runner` | `ubuntu-latest` |
| Dashboard UI | Minimal placeholder | Full design matching screenshot |
| Logo | `/logo.png` img tag | Inline SVG DHG shield |
| Data | 2 hardcoded vaccines | 12 rows across 6 vaccine types, 5 hospitals |
