# 📹 SM SYSTEMS - CCTV Camera Showroom & Security Systems Portal

A modern, high-converting, full-stack website and content management system for a **CCTV Camera Showroom & Security Surveillance Business**. Designed with a vibrant **Orange & Surveillance Slate Theme**, rich product showcase with dynamic discount badges, quotation generators, WhatsApp ordering, and a secure **Admin Portal** for total site management.

---

## 🚀 Key Features

### 🌟 Customer Showroom Experience
- **Orange Security Theme**: High-contrast, sleek modern palette (`#EA580C` / `#F97316`) crafted specifically for security systems.
- **Top Announcement Bar**: Displays live showroom clearance offers and working hours.
- **Product Catalog & Pricing**:
  - Filter by CCTV categories: **Bullet**, **Dome**, **PTZ Speed Domes**, **Wireless WiFi & 4G**, **DVR/NVR Kits**, **Complete Packages**, and **Accessories**.
  - Displays original price (MRP), showroom offer price, and automatically calculated **% OFF** badges.
  - Live technical specifications chips (Resolution, ColorVu Night Vision, IP67 Weatherproof).
- **Interactive Deep-Dive Modal**:
  - Zoomable image gallery with thumbnail preview.
  - Detailed technical specifications sheet.
  - *Showroom Live Demo* indicator for hands-on experience.
- **Instant WhatsApp & Quote Integration**:
  - One-click direct WhatsApp quote with pre-filled camera model and offer pricing.
  - "Book Free Site Inspection" pop-up modal saving inquiries directly into the database.
- **Showroom Services & Location**:
  - Interactive Google Maps embed with physical address, visiting hours, and direct call buttons.
  - Turnkey 4-Camera, 8-Camera, and 16-Camera installation packages.

### 🛡️ Admin Portal (`/admin`)
- **Protected Access**: Guarded by Firebase Authentication & Master Admin Passcode.
- **Product & Pricing Manager (Full CRUD)**:
  - Add, edit, or delete any CCTV camera, DVR, or accessory.
  - Set MRP and Showroom Offer Price with instant live savings calculator.
  - **Cloudinary Image Upload**: Drag-and-drop or select photos to stream directly to Cloudinary CDN with automatic thumbnail previews.
  - Toggle stock status, "Featured" badges, and "Deal of the Day".
- **Promotional Offers & Banners**:
  - Create, modify, and publish festive discounts, coupon codes, and banner graphics on the homepage.
- **Customer Leads & Inquiries Manager**:
  - Real-time customer quote requests dashboard.
  - Update status: `New` ➔ `Contacted` ➔ `Survey Scheduled` ➔ `Completed`.
  - One-click WhatsApp follow-up and direct calling for showroom sales teams.
- **Showroom Profile & Website Settings**:
  - Edit showroom business name, contact phones, WhatsApp number, address, Google Maps link, and announcement ticker without touching code.

---

## 🛠️ Full-Stack Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM, Axios |
| **Backend** | Node.js, Express.js REST API, Multer (Memory Streaming), CORS |
| **Database** | **PostgreSQL** hosted on **Supabase** (with automatic local turnkey fallback) |
| **Media CDN** | **Cloudinary** for CCTV product & banner uploads |
| **Authentication** | **Supabase Auth** (email + password, session JWTs verified locally against Supabase JWKS) |

---

## ⚡ Quick Start (Instant Run)

The application comes pre-loaded with realistic CCTV showroom seed inventory and an auto-fallback database, meaning you can run and test the complete frontend, backend, and admin portal immediately!

### 1. Install Dependencies
```bash
npm run install:all
```
*(Or run `npm install` inside the root, `server/`, and `client/` directories)*

### 2. Start Development Servers
```bash
npm run dev
```
- **Showroom Website**: `http://localhost:5173`
- **Admin Portal**: `http://localhost:5173/admin`
- **Backend API**: `http://localhost:5000/api`

### 3. Admin Portal Access (Supabase Auth)
The admin portal signs in with **Supabase Auth** (email + password). The API verifies every session JWT locally against your project's JWKS endpoint, so no shared passcode is ever sent to the browser.
1. Open **Dashboard ➔ Authentication ➔ Users ➔ Add user**, create the admin account and tick **Auto Confirm User**.
2. Add that same address to `ADMIN_EMAILS` in `server/.env`:
   ```env
   ADMIN_EMAILS=admin@your-showroom.com,manager@your-showroom.com
   ```
3. Restart the API (`.env` is read at startup) and sign in at `http://localhost:5173/admin/login`.

A valid Supabase login alone is not enough: any account missing from `ADMIN_EMAILS` is rejected with `403`. Access tokens expire hourly and are refreshed automatically in the background. `ADMIN_SECRET_KEY` is kept as a break-glass key for scripts and `curl` (`x-admin-key` header) and doubles as the passcode login for local setups without Supabase Auth.

---

## ☁️ Cloud Service Configurations (PostgreSQL, Supabase Auth, Cloudinary)

Whenever you are ready to link your production cloud accounts, simply update `server/.env` and `client/.env`:

### 1. PostgreSQL Database (Supabase)
Every product, offer, inquiry and showroom setting lives in PostgreSQL (Supabase). Products, offers and settings are seeded automatically the first time the tables are created.
1. Go to [supabase.com](https://supabase.com/) and create a new project.
2. Copy the connection string from **Project Settings** ➔ **Database** ➔ **Connection string** ➔ **URI**.
3. In `server/.env`, set:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
   ```
   (set `DATABASE_SSL=false` only when pointing at a local PostgreSQL server without SSL)
4. Create the tables and seed the showroom catalog:
   ```bash
   npm run db:setup --prefix server
   ```
   This runs [`server/src/database/schema.sql`](server/src/database/schema.sql) and seeds products, offers and settings **only when those tables are empty**, so it is safe to re-run.
5. Verify the API is talking to PostgreSQL:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected: `"database": { "mode": "postgres", "connected": true, "persistent": true }`.

> Without `DATABASE_URL` the API falls back to an in-memory demo store, where every admin edit is lost when the server restarts.

### 2. Cloudinary (Image & Banner Uploads)
✅ **Configured & verified** — the API initializes Cloudinary at boot (`✅ Cloudinary initialized`), and `POST /api/upload` returns real `https://res.cloudinary.com/...` CDN URLs. When keys are absent it falls back to inline base64 data-URIs.
1. Sign up for a free account at [cloudinary.com](https://cloudinary.com/).
2. On your Cloudinary Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.
3. In `server/.env`, set:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 3. Supabase Keys (Auth, Storage & REST)
Admin sign-in, image storage and any direct REST access use the keys from **Project Settings ➔ API keys**:
```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx   # safe to expose in the browser
SUPABASE_SECRET_KEY=sb_secret_xxx             # server-side only, never ship this
SUPABASE_JWKS_URL=https://YOUR_PROJECT_REF.supabase.co/auth/v1/.well-known/jwks.json
ADMIN_EMAILS=admin@your-showroom.com
```
`DATABASE_URL`, `SUPABASE_SECRET_KEY` and `ADMIN_SECRET_KEY` are server-only secrets - keep them out of `client/.env` and out of Git.

> **Row level security:** `schema.sql` enables RLS on all tables and grants the publishable key read-only access to `products` and active `offers`. Without those policies the publishable key could read customer inquiries and delete the catalog through PostgREST.

> **Legacy:** Firebase admin auth (`FIREBASE_*` in `server/.env`, `client/src/firebase.js`) is no longer used and can be removed once you are happy with Supabase Auth.

---

## 🚢 Deployment Guide (Netlify frontend + Render API)

The site is split into two services:

| Service | Host | Config file | URL |
| :--- | :--- | :--- | :--- |
| **API** (Express + PostgreSQL) | [Render](https://render.com) | [`render.yaml`](render.yaml) | `https://YOUR-SERVICE.onrender.com` |
| **Frontend** (React build) | [Netlify](https://netlify.com) | [`netlify.toml`](netlify.toml) | `https://YOUR-SITE.netlify.app` |

### 1. API on Render
1. Render dashboard ➔ **New ➔ Blueprint** ➔ connect this repo (it picks up `render.yaml`).
2. Render asks for every `sync: false` variable — copy the values from your local `server/.env`:

   | Variable | Value |
   | :--- | :--- |
   | `DATABASE_URL` | Supabase **IPv4 pooler** string: `postgresql://postgres.<REF>:<DB_PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres` |
   | `DATABASE_SSL` | `true` |
   | `SUPABASE_URL` | `https://<REF>.supabase.co` |
   | `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` |
   | `SUPABASE_SECRET_KEY` | `sb_secret_…` (server-side only) |
   | `SUPABASE_JWKS_URL` | `https://<REF>.supabase.co/auth/v1/.well-known/jwks.json` |
   | `ADMIN_EMAILS` | your admin email(s), comma separated |
   | `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Cloudinary dashboard values |
   | `ADMIN_SECRET_KEY` | a fresh random string (break-glass `x-admin-key`) |
   | `CLIENT_URL` | your Netlify URL, e.g. `https://YOUR-SITE.netlify.app` |

   > ⚠️ Use the **pooler** host (`aws-0-….pooler.supabase.com`), not `db.<REF>.supabase.co` — the direct host is IPv6-only and causes intermittent `ENOTFOUND`/`ECONNRESET` on most hosts. It connects as `postgres` with `bypassrls=true`, so the API keeps working while RLS still protects the publishable key.
3. Deploy. Health check: `https://YOUR-SERVICE.onrender.com/api/health` must return `"database": {"mode": "postgres", "connected": true}`.

### 2. Frontend on Netlify
1. Netlify ➔ **Add new site ➔ Import an existing repo** ➔ pick this repo. `netlify.toml` already sets the build (`npm install --prefix client && npm run build`), publish dir (`client/dist`), Node 22, and the SPA fallback (`/* → /index.html`).
2. Set **Site settings ➔ Environment variables**: `VITE_API_URL=https://YOUR-SERVICE.onrender.com/api` (note the `/api` suffix — it is baked into the bundle at build time, so redeploy after changing it).
   - *Alternative, no CORS at all:* instead of `VITE_API_URL`, uncomment the `/api/*` proxy redirect in `netlify.toml` (it must sit above the `/*` fallback) so Netlify forwards API calls to Render.
3. Deploy. Open the site, then `/admin/login` and sign in.

### 3. Post-deploy checks
```bash
curl https://YOUR-SERVICE.onrender.com/api/health          # postgres connected
curl https://YOUR-SERVICE.onrender.com/api/auth/status     # cloudinary: true, supabaseAuth: true
curl https://YOUR-SERVICE.onrender.com/api/products        # 10 seeded products
```
Then in the browser: home page renders, admin login works, and a logo upload returns a `res.cloudinary.com` URL.

### Local production preview
```bash
npm run build     # builds client/dist
npm start         # Express serves the API + the built client on :5000
```

### Other hosts
- **Monolithic (Render/Railway single service):** the server already serves `client/dist`, so build the client and start with `npm start` — no `VITE_API_URL` needed.
- **Vercel/Firebase hosting:** set `VITE_API_URL` exactly like the Netlify step and add an SPA rewrite to `/index.html`.

---

## 📄 License
This project is open-source and ready for commercial use by CCTV Showrooms, Security Integrators, and Surveillance Equipment Dealers.

---

# smsystems

