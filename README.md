# Veylora — Fuel Consumption Optimizer

**Veylora** is a personalized, offline-first web app that helps you understand and reduce the fuel your vehicle burns. It turns your own vehicle profile and trip data into an explainable calculus-based consumption model, then recommends a speed that costs you less fuel and less money.

- **Live app:** https://<your-project>.pages.dev/ (Cloudflare Pages)
- **Source:** https://github.com/vvsrinath/Veylora
- **No sign-up, no server, no tracking.** Everything is stored on your device.

---

## Table of contents

- [What it does](#what-it-does)
- [Screens & routes](#screens--routes)
- [The mathematics](#the-mathematics)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Data, storage & privacy](#data-storage--privacy)
- [External APIs](#external-apis)
- [PWA & offline behaviour](#pwa--offline-behaviour)
- [Deployment](#deployment)
- [Python math engine (reference)](#python-math-engine-reference)
- [Configuration reference](#configuration-reference)
- [Accuracy & disclaimer](#accuracy--disclaimer)
- [Known limitations](#known-limitations)
- [License](#license)

---

## What it does

You add a vehicle (type, fuel, tank size, mileage, age, condition), record trips using GPS (or a built-in simulator when location is unavailable), and enter the fuel you used. Veylora then:

1. Builds a **speed–consumption curve** `F(v)` for your vehicle using a simplified quadratic model.
2. Computes its **first and second derivatives**, checks that the stationary point is a **minimum**, and reports an estimated **optimal speed**.
3. Applies **real-world context** — temperature, air quality, terrain, road type, traffic, load, AC use, tyre pressure, wind — as transparent multiplicative adjustments.
4. Calculates **mileage (km/L), L/100 km, fuel cost, cost per km, and CO₂** from your measured data.
5. Produces **plain-language recommendations** and a **data-quality score** so you know how much to trust each result.

It is designed for cars, motorcycles, scooters, three-wheelers, and other vehicles.

---

## Screens & routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `Landing` | Marketing page: hero, value, how it works, features, install section. |
| `/dashboard` | `Dashboard` | Active-vehicle snapshot: KPIs, live context card, recent trips. |
| `/vehicle-setup` | `VehicleSetup` | Guided multi-step wizard to add a vehicle. |
| `/my-vehicles` | `MyVehicles` | List, switch, and manage vehicles. |
| `/trip/start` | `StartTrip` | Live GPS trip recorder with speed gauge and route path. |
| `/trip/fuel-entry` | `FuelEntry` | Enter fuel before/after/refilled and price. |
| `/trip/report/:tripId` | `TripReport` | Full trip analysis: stats, recommendations, data quality. |
| `/trip/history` | `TripHistory` | All recorded trips with filters. |
| `/optimization` | `Optimization` | Consumption curve, calculus panel, physics panel, weighted score, constraints. |
| `/profile` | `Profile` | User summary and aggregates. |
| `/settings` | `Settings` | Offline mode, reduced motion, install, data export/reset. |
| `*` | — | Redirects to `/`. |

The app boots through `Splash`, is wrapped in `AppDataProvider` (React Context + `localStorage`), and uses `BrowserRouter`.

---

## The mathematics

The core model is a quadratic relationship between speed and fuel consumption.

### Consumption curve

```
F(v) = a·v² + b·v + c        [L/100 km]     (v = speed in km/h)
```

### Derivatives

```
First derivative:   F'(v)  = 2a·v + b
Second derivative:  F''(v) = 2a
Stationary point:   v*     = −b / (2a)
```

Because `a > 0`, `F''(v) = 2a > 0`, so `v*` is a **local minimum** — the estimated most-efficient speed.

The theoretical optimum is then clamped by real constraints:

```
v_recommended = min( v*, legal limit, road cap, weather cap, traffic cap )
```

### How the coefficients are seeded

`getConsumptionModel()` (`src/utils/fuelMath.ts`) starts from a per-vehicle-type base `{a, b, c}` and adjusts them:

| Input | Effect |
| --- | --- |
| Vehicle type | Base coefficients (car, motorcycle, scooter, three-wheeler, other). |
| Fuel type | Multiplies `c` (diesel 0.85, CNG 0.72, ethanol blend 1.05, …). |
| Maintenance condition | Multiplies `c` (well-maintained 0.96, required 1.14). |
| Vehicle age | Raises `c` slightly and nudges `b`, moving the optimum down. |

### Context adjustments

Environmental and situational factors are applied as transparent multipliers:

- **In the app** (`src/utils/fuelMath.ts`): temperature, AQI, terrain/grade, road type.
- **In the Python engine** (`backend/veylora_math/context.py`): cold start, heat/AC load, AC use, wind, air quality, traffic, road condition, grade, extra load, tyre pressure — combined as `φ = ∏(1 + δᵢ)` and `F_ctx(v) = F(v)·φ`.

### Physics cross-check

`src/utils/physicsMath.ts` models road load from first principles for a sanity cross-check:

```
F_road = rolling resistance + slope force + aerodynamic drag
       = C_rr·m·g·cos θ + m·g·sin θ + ½·ρ·C_d·A·v²
P      = F_road · v
```

with per-vehicle-type defaults for drag coefficient, frontal area, rolling coefficient, and mass, plus fuel energy densities (MJ/L) used to reason about energy use.

### Worked example (car)

```
a = 0.003, b = −0.348, c = 16.6
v* = −(−0.348) / (2 × 0.003) = 58 km/h
```

---

## Features

- **Vehicle profiles** — type, fuel, tank capacity, manufacturer & observed mileage, age, odometer, weight, maintenance/tyre/engine condition, service history.
- **Live GPS trip tracking** — distance (haversine), speed samples, max/avg speed, duration, route points, GPS accuracy — with an automatic simulator fallback when GPS is denied or unavailable. The source (`gps` / `simulated` / `none`) is always recorded, never misrepresented.
- **Live context capture** — on GPS fixes the app fetches reverse-geocoded country/place, temperature + air quality, elevation, and OpenStreetMap road data.
- **Fuel & cost analysis** — km/L, L/100 km, fuel used, fuel cost, cost per km, CO₂ emitted and CO₂ saved vs. manufacturer mileage.
- **Calculus-based optimization** — interactive consumption curve, symbolic derivation (function, F′, F″, stationary point), min-consumption speed, savings estimate.
- **Physics panel** — road-load forces and required power at a speed.
- **Weighted optimization score** — normalizes and weights multiple metrics into a single explainable score.
- **Constraint panel** — legal, road, weather, and traffic speed caps.
- **Road/terrain/weather context** — from OpenStreetMap and Open-Meteo.
- **Driver-behaviour metrics** — speed variation, idling %, harsh acceleration/braking counts, average acceleration.
- **Data-quality scoring** — a 0–100 score with reasons (trip length, missing/estimated fuel, GPS accuracy, maintenance completeness).
- **Personalized, non-judgemental recommendations** — up to four practical suggestions per trip.
- **Country comparison** — 14 country profiles (fuel prices, currency, emission norms) for cross-country cost/emission comparison.
- **Offline-first** — vehicles, trips, settings, and the app shell all work without a connection.
- **Installable PWA** — install prompt on open; never shown once installed.
- **Accessibility** — reduced-motion support (system + manual toggle), focus-visible styles, no forced animation.
- **Data export / reset** — download your vehicles and trips as JSON; clear local data.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 18, TypeScript 5.5 |
| Build | Vite 5 |
| Routing | react-router-dom 6 |
| Styling | Tailwind CSS 3.4 (+ PostCSS, Autoprefixer) |
| Animation | framer-motion 11 |
| Charts | recharts 2 |
| Icons | lucide-react |
| State | React Context + `localStorage` |
| PWA | Web App Manifest + Service Worker (hand-written) |
| Research engine | Python 3 + SymPy |
| Hosting | Cloudflare Pages |

No backend server, database, or auth provider is required.

---

## Project structure

```
.
├─ backend/
│  └─ veylora_math/            # Python reference implementation (SymPy)
│     ├─ __init__.py
│     ├─ calculus.py           # F(v), F', F'', v*, curve sampling, fit
│     └─ context.py            # contextual multiplicative deltas
├─ public/
│  ├─ manifest.webmanifest     # PWA manifest
│  ├─ sw.js                    # service worker (offline caching)
│  ├─ icon-192.png
│  ├─ icon-512.png
│  ├─ icon-512-maskable.png
│  ├─ apple-touch-icon.png
│  ├─ _redirects               # SPA fallback (Cloudflare Pages)
│  └─ _headers                 # Cache-Control for sw.js / index / manifest
├─ src/
│  ├─ App.tsx                  # Router + route table + InstallPrompt
│  ├─ index.tsx                # entry: registers SW, mounts app
│  ├─ pages/                   # route screens (see table above)
│  ├─ components/
│  │  ├─ landing/  layout/  dashboard/  optimization/
│  │  ├─ reports/  trip/  ui/  vehicle/
│  │  ├─ InstallPrompt.tsx     # global PWA install banner
│  │  └─ Logo.tsx
│  ├─ contexts/AppDataContext.tsx
│  ├─ hooks/                   # useLiveTrip, usePwa, useCurrentSnapshot, …
│  ├─ utils/                   # fuelMath, physicsMath, optimizationMath,
│  │                           # tripStats, recommendations, environmentApi,
│  │                           # storage, costEmissionMaintenance, pwa, format, id
│  ├─ data/                    # content copy, seed demo data, countries
│  └─ types/                   # vehicle.ts, trip.ts
├─ index.html
├─ tailwind.config.js
├─ vite.config.ts
├─ vercel.json                 # SPA rewrites (alternative host)
└─ package.json
```

---

## Getting started

### Prerequisites

- **Node.js 18+** (CI uses Node 22) and npm.
- **Python 3.10+** with `sympy` — only if you want to run the research engine.

### Install & run

```bash
npm install
npm run dev
```

Then open the printed local URL (Vite, typically `http://localhost:5173`).

> The service worker is intentionally **not** registered on `localhost`, so development always serves fresh code.

### Production build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

### Build for deployment

Cloudflare Pages serves the app from the domain root, so the default build works as-is:

```bash
npm run build
```

For a sub-path host, set the base path explicitly:

```bash
VITE_BASE_PATH=/<repo>/ npm run build
```

This makes asset, manifest, and service-worker URLs resolve correctly under that sub-path.

---

## Available scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `npx vite` | Start the dev server with HMR. |
| `npm run build` | `npx vite build` | Production bundle in `dist/` (Vite does not type-check). |
| `npm run preview` | `npx vite preview` | Preview the built app locally. |
| `npm run lint` | `eslint . --ext .js,.jsx,.ts,.tsx` | Lint the codebase. |

---

## Data, storage & privacy

- **No backend.** The app never uploads your vehicles, trips, or location to any Veylora server.
- All app data lives in **`localStorage`**:

  | Key | Contents |
  | --- | --- |
  | `veylora:vehicles` | Vehicle profiles |
  | `veylora:activeVehicleId` | Currently selected vehicle |
  | `veylora:trips` | Recorded trips |
  | `veylora:settings` | Offline mode, reduced motion, units |
  | `veylora.installed` | PWA installed flag (suppresses install prompt) |
  | `veylora.installDismissed` | Install prompt dismissal flag |

- Persistent-storage permission is requested on first interaction so the browser is less likely to evict your data.
- **Settings → Export your data** downloads vehicles + trips as JSON; **Reset local data** clears everything back to the seeded sample vehicle.
- Trip context (weather/AQI/roads) is fetched from public APIs **only while a trip is being recorded** and only for the trip's coordinates.

---

## External APIs

All are free and **keyless**; each call fails gracefully (the feature simply shows as unavailable):

| Provider | Used for |
| --- | --- |
| [Open-Meteo](https://open-meteo.com/) `api.open-meteo.com` | Temperature, humidity, feels-like, wind, weather code |
| [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) | US AQI, PM2.5, PM10 |
| [Open-Meteo Elevation](https://open-meteo.com/en/docs/elevation-api) | Elevation → grade / climb analysis |
| [BigDataCloud](https://www.bigdatacloud.com/) | Reverse geocoding → country, state, city |
| [Overpass API](https://overpass-api.de/) (OpenStreetMap) | Predominant road type, surface, average max speed |

Because these require a connection, trip context is marked `live` when fetched and simply omitted otherwise; core features keep working offline.

---

## PWA & offline behaviour

Veylora is an installable Progressive Web App.

- **Manifest** (`public/manifest.webmanifest`): standalone display (`display_override`), portrait, theme/background `#07131F`, 192/512 icons + a maskable icon, `launch_handler: navigate-existing`.
- **Service worker** (`public/sw.js`):
  - Pre-caches the app shell (icons, manifest, root document).
  - **Cache-first** for static assets (hashed JS/CSS, icons) with background refresh.
  - **Network-first** for navigations, falling back to the cached shell offline.
  - Versioned caches (`veylora-shell-v2`); old caches are purged on activate.
- **Install prompt** (`src/components/InstallPrompt.tsx`):
  - Appears when a visitor opens the site (Chrome/Edge use the native `beforeinstallprompt`; iOS Safari gets an "Add to Home Screen" hint).
  - **Never appears once the app is installed** — guarded by the `appinstalled` event, `display-mode: standalone` detection, and a persisted `veylora.installed` flag.
  - "Not now"/dismissal is remembered so it stops nagging.

Updating: when you ship a new build, bump `CACHE_VERSION` in `public/sw.js` so clients refresh the shell.

---

## Deployment

The app is deployed to **Cloudflare Pages** with Git integration on this repository.

- **URL:** https://<your-project>.pages.dev/
- **Triggers:** every push to `main` (pull requests get preview deployments).
- **Build command:** `npm run build`
- **Build output directory:** `dist`

Configuration notes:

- **SPA routing** — `public/_redirects` (`/* /index.html 200`) makes deep links like `/trip/history` fall back to the app shell.
- **Service-worker freshness** — `public/_headers` sets `Cache-Control: no-cache` on `sw.js`, `index.html`, and `manifest.webmanifest`, while Vite's hashed assets stay immutable.
- **Base path** — Cloudflare serves from the root, so no `VITE_BASE_PATH` is needed. Set it only for a sub-path host.

Other hosts:

- **Vercel** — `vercel.json` rewrites all routes to `/index.html` (SPA).
- **Netlify** — `public/_redirects` provides the same fallback.

Custom domains are configured in the Cloudflare Pages project; the build is host-agnostic because asset and manifest URLs are root-relative.

---

## Python math engine (reference)

`backend/veylora_math/` is a self-contained research/reference implementation of the same mathematics used by the app, written with SymPy so the printed derivation always matches the numbers.

- `calculus.py`
  - `fuel_consumption`, `first_derivative`, `second_derivative`
  - `optimal_speed`, `clamp_to_legal`, `build_curve_points`
  - `derive_optimization` (full symbolic + numeric derivation)
  - `quadratic_from_three_points` (analytic fit)
- `context.py`
  - `ContextInputs`, `ContextResult`, `context_deltas`, `compute_context`, `apply_context`

Run a module directly (add the package folder to the path):

```bash
PYTHONPATH=backend/veylora_math python3 - <<'PY'
import calculus, context

print(calculus.derive_optimization(0.003, -0.348, 16.6, legal_limit_kmh=80)["optimal_speed_kmh"])
print(context.compute_context(context.ContextInputs(traffic="moderate", ac_used=True)).to_dict())
PY
```

The Python package mirrors the TypeScript utilities in `src/utils/`; the TypeScript is what actually ships in the browser.

---

## Configuration reference

| File | Purpose |
| --- | --- |
| `vite.config.ts` | Vite base path (root by default; `VITE_BASE_PATH` override) and React plugin. |
| `tailwind.config.js` | Theme colors (`navy`, `accent`, `soft`, `lighttext`, …) and fonts. |
| `tsconfig.json` | Strict TypeScript, `noUnusedLocals`, bundler resolution. |
| `postcss.config.js` | Tailwind + Autoprefixer. |
| `public/manifest.webmanifest` | PWA identity, icons, display mode. |
| `public/sw.js` | Offline caching strategy + cache version. |
| `public/_redirects`, `public/_headers` | SPA fallback and cache headers for Cloudflare Pages. |
| `vercel.json` | SPA rewrites for the Vercel alternative host. |

### Theme tokens

| Token | Value | Use |
| --- | --- | --- |
| `navy` | `#07131F` | App background (dark) |
| `accent` | `#2DD8A0` | Primary/brand green |
| `soft` | `#F4F8FA` | Light surfaces |
| `lighttext` / `lightmuted` / `lightborder` | `#0F2436` / `#5B7284` / `#E2E8EE` | Light-theme text/borders |

---

## Accuracy & disclaimer

Veylora is an **educational estimation tool**, not a guarantee of savings.

- The quadratic model is intentionally simplified; coefficients are seeded from typical values and refined by your inputs, not lab-calibrated.
- Context factors (weather, AQI, grade, traffic, load, tyre pressure) are conservative, transparent estimates.
- Results are only as good as the data you enter. The **data-quality score** and **source** (`gps`/`simulated`, `measured`/`estimated`) tell you how much to trust a trip.

**Always follow legal speed limits and road-safety rules.** Do not drive in a way that endangers you or others to chase an estimated optimum.

---

## Known limitations

- The Python package `__init__.py` re-exports `fit` and `engine` helpers (`fit_quadratic`, `build_standard_model`, …) that are not included in this version, so `import veylora_math` fails; import `calculus`/`context` directly instead. The bundled JavaScript production build does not include the research package, so this does not affect the live app.
- Live context (weather/AQI/roads/elevation) needs a network connection and depends on third-party free APIs and their rate limits.
- GPS accuracy on a phone is reported and factored into data quality but cannot be improved by the app.
- The main JS bundle is a single chunk (~800 kB, ~233 kB gzipped); route-level code-splitting is a future improvement.

---

## License

No license file is currently included in this repository. Unless stated otherwise, all rights are reserved by the author. Add a `LICENSE` file (for example, MIT) to make reuse terms explicit.

---

<p align="center">Built by <a href="https://github.com/vvsrinath">Srinath Vatchavari Venkateshan</a> · Research project, Kalasalingam University</p>
