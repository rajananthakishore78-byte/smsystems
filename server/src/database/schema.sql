-- ==============================================================
-- CCTV SHOWROOM DATABASE SCHEMA (PostgreSQL / Supabase)
-- ==============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    category VARCHAR(100) NOT NULL, -- 'Dome Cameras', 'Bullet Cameras', 'PTZ Cameras', 'Wireless Smart Cameras', 'DVR & NVR Kits', 'Complete Packages', 'Accessories'
    brand VARCHAR(100) NOT NULL,    -- 'Hikvision', 'Dahua', 'CP Plus', 'Imou', 'Uniview', 'Seagate', etc.
    original_price DECIMAL(10, 2) NOT NULL, -- MRP
    offer_price DECIMAL(10, 2) NOT NULL,    -- Showroom Discounted Price
    discount_percent INTEGER DEFAULT 0,
    image_url TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    description TEXT,
    specs JSONB DEFAULT '{}'::jsonb, -- e.g. {"resolution": "5MP 2560x1944", "night_vision": "ColorVu 30m", "audio": "Built-in Mic", "weatherproof": "IP67"}
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_deal_of_day BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. OFFERS & PROMOTIONAL BANNERS TABLE
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    discount_text VARCHAR(100), -- e.g. "Flat 35% OFF + Free 1TB HDD"
    banner_image_url TEXT,
    coupon_code VARCHAR(50),
    badge_color VARCHAR(50) DEFAULT 'orange',
    is_active BOOLEAN DEFAULT true,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CUSTOMER INQUIRIES & QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(150),
    service_type VARCHAR(100) DEFAULT 'Site Inspection', -- 'Home Security', 'Commercial Showroom', 'Site Survey', 'CCTV Repair & AMC'
    camera_count VARCHAR(50) DEFAULT '4 Cameras',
    product_name VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Contacted', 'Survey Scheduled', 'Completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SHOWROOM PROFILE & CONTACT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS showroom_settings (
    id SERIAL PRIMARY KEY,
    showroom_name VARCHAR(200) NOT NULL DEFAULT 'SM SYSTEMS',
    logo_url TEXT DEFAULT '',
    tagline VARCHAR(255) DEFAULT 'Authorized Security Surveillance & CCTV Camera Experience Center',
    phone_primary VARCHAR(50) DEFAULT '+91 98765 43210',
    phone_secondary VARCHAR(50) DEFAULT '+91 91234 56789',
    whatsapp_number VARCHAR(50) DEFAULT '919876543210',
    email VARCHAR(150) DEFAULT 'sales@smsystems.in',
    address TEXT DEFAULT '124, Orange Boulevard, Electronics & Security Hub, 1st Floor, Tech Park Road',
    city VARCHAR(100) DEFAULT 'Chennai',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(20) DEFAULT '600001',
    google_maps_url TEXT DEFAULT 'https://maps.google.com',
    opening_hours VARCHAR(255) DEFAULT 'Mon - Sat: 9:30 AM - 8:30 PM | Sunday: 10:00 AM - 5:00 PM',
    announcement_bar TEXT DEFAULT '🔥 Mega Showroom Clearance: Get Free Site Inspection & 2-Year On-Site Warranty on all 4K CCTV Kits!',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add logo column to existing installations
ALTER TABLE showroom_settings ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '';

-- Index for speedy queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_deal_of_day ON products(is_deal_of_day);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- ==============================================================
-- ROW LEVEL SECURITY
-- The API connects as the table owner (which bypasses RLS), so these rules only
-- restrict the browser-safe publishable key going through PostgREST/Storage.
-- Without them, anyone holding the publishable key could read customer phone
-- numbers and delete the catalog.
-- ==============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE showroom_settings ENABLE ROW LEVEL SECURITY;

-- Catalog data is public: read-only access for the publishable key.
DROP POLICY IF EXISTS "public read products" ON products;
CREATE POLICY "public read products" ON products FOR SELECT TO anon, authenticated USING (true);

-- Only live promotional banners are publicly readable.
DROP POLICY IF EXISTS "public read active offers" ON offers;
CREATE POLICY "public read active offers" ON offers FOR SELECT TO anon, authenticated USING (is_active = true);

-- inquiries and showroom_settings intentionally have no policies: only the API
-- (connecting as the owner) may read or write them.
