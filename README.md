# 📹 ApexVision - CCTV Camera Showroom & Security Systems Portal

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
| **Authentication** | **Firebase** Authentication (Web Client & Firebase Admin SDK) |

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

### 3. Admin Login Credentials
- **Access URL**: `http://localhost:5173/admin/login`
- **Default Master Passcode**: `cctv_admin_secure_2026` *(or `admin123`)*

---

## ☁️ Cloud Service Configurations (Supabase, Cloudinary, Firebase)

Whenever you are ready to link your production cloud accounts, simply update `server/.env` and `client/.env`:

### 1. Supabase (PostgreSQL Database)
1. Go to [supabase.com](https://supabase.com/) and create a new project.
2. In the left sidebar, click **SQL Editor** ➔ **New Query**.
3. Copy the contents of [`server/src/database/schema.sql`](file:///server/src/database/schema.sql) and click **Run**.
4. In Supabase, go to **Project Settings** ➔ **API**.
5. Copy your **Project URL** and **service_role secret key**.
6. In `server/.env`, set:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

### 2. Cloudinary (Image & Banner Uploads)
1. Sign up for a free account at [cloudinary.com](https://cloudinary.com/).
2. On your Cloudinary Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.
3. In `server/.env`, set:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 3. Firebase (Admin Authentication)
1. Go to [console.firebase.google.com](https://console.firebase.google.com/) and create a project.
2. Enable **Authentication** ➔ **Sign-in method** ➔ **Email/Password**.
3. Go to **Project Settings** ➔ **Service accounts** ➔ Click **Generate new private key**.
4. In `server/.env`, fill in:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```
5. *(Optional for Client SDK)* In **Project Settings** ➔ **General** ➔ **Your apps** ➔ Add a Web App, and paste the config keys into `client/.env`.

---

## 🚢 Deployment Guide

### Option A: Monolithic Deployment (Render / Railway)
The Express server is configured to serve the production React build from `client/dist`.
1. Run `npm run build` to compile the Vite frontend.
2. Set your environment variables in your hosting dashboard.
3. Start the server with `npm start`.

### Option B: Decoupled Deployment
- **Frontend**: Deploy `client/` to **Vercel**, **Netlify**, or **Firebase Hosting**. Set `VITE_API_URL` to your backend URL.
- **Backend**: Deploy `server/` to **Render**, **Railway**, or **Fly.io**. Set `CLIENT_URL` to your deployed frontend domain.

---

## 📄 License
This project is open-source and ready for commercial use by CCTV Showrooms, Security Integrators, and Surveillance Equipment Dealers.

---

# smsystems

