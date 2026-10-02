export const defaultProducts = [
  {
    id: "prod-001",
    name: "Hikvision 5MP ColorVu Audio Bullet Camera",
    slug: "hikvision-5mp-colorvu-bullet",
    category: "Bullet Cameras",
    brand: "Hikvision",
    original_price: 4999,
    offer_price: 3299,
    discount_percent: 34,
    image_url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Industry-leading 24/7 full-color imaging with F1.0 super-aperture. Built-in microphone with real-time audio over coaxial cable. Tough IP67 water and dust resistant housing for all-weather outdoor perimeter surveillance.",
    specs: {
      resolution: "5MP (2560 x 1944)",
      night_vision: "ColorVu 24/7 Color up to 40m",
      lens: "3.6mm Fixed Focal Lens",
      audio: "Built-in Noise Reduction Mic",
      weatherproof: "IP67 Weatherproof Rated",
      connectivity: "TVI / AHD / CVI / CVBS Switchable",
      warranty: "2 Years Comprehensive On-Site"
    },
    in_stock: true,
    is_featured: true,
    is_deal_of_day: true
  },
  {
    id: "prod-002",
    name: "Dahua 4MP WizSense AI Smart Dome Camera",
    slug: "dahua-4mp-wizsense-dome",
    category: "Dome Cameras",
    brand: "Dahua",
    original_price: 5499,
    offer_price: 3699,
    discount_percent: 33,
    image_url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Next-gen deep learning algorithm focused on human and vehicle classification with SMD Plus (Smart Motion Detection). Ideal for office ceilings, retail stores, banks, and modern residences.",
    specs: {
      resolution: "4MP (2688 x 1520) @ 30fps",
      night_vision: "Smart IR LED up to 30m",
      lens: "2.8mm Wide Angle (103° FOV)",
      audio: "Built-in Audio Interface",
      weatherproof: "IK10 Vandal-Proof & IP67",
      connectivity: "PoE (Power over Ethernet) / 12V DC",
      warranty: "2 Years Replacement Warranty"
    },
    in_stock: true,
    is_featured: true,
    is_deal_of_day: false
  },
  {
    id: "prod-003",
    name: "Imou Cruiser 360° Outdoor WiFi PTZ Smart Camera",
    slug: "imou-cruiser-360-ptz-wifi",
    category: "Wireless Smart Cameras",
    brand: "Imou",
    original_price: 6999,
    offer_price: 4499,
    discount_percent: 36,
    image_url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Full 360-degree coverage with motorized pan & tilt. Features smart active deterrence with a built-in 110dB security siren and dual spotlights. Two-way crystal clear audio and smart human tracking.",
    specs: {
      resolution: "4MP Quad HD (2560 x 1440)",
      night_vision: "Smart Full-Color 4 Modes (30m)",
      lens: "Pan 355° & Tilt 90° Motorized",
      audio: "2-Way Talk with Speaker & Siren",
      weatherproof: "IP66 Weather Resistant",
      connectivity: "Dual-Antenna 2.4GHz Wi-Fi + RJ45",
      warranty: "1 Year Doorstep Warranty"
    },
    in_stock: true,
    is_featured: true,
    is_deal_of_day: true
  },
  {
    id: "prod-004",
    name: "CP Plus 4K 8MP Ultra HD IP Motorized Bullet Camera",
    slug: "cp-plus-4k-8mp-motorized-bullet",
    category: "Bullet Cameras",
    brand: "CP Plus",
    original_price: 11999,
    offer_price: 7999,
    discount_percent: 33,
    image_url: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ultra High Definition 8 Megapixel motorized zoom camera engineered for long-range security surveillance. Delivers license plate recognition and crisp facial recognition even in total darkness.",
    specs: {
      resolution: "8MP 4K Ultra HD (3840 x 2160)",
      night_vision: "Smart Matrix IR up to 60m",
      lens: "2.7mm - 13.5mm 5x Motorized Optical Zoom",
      audio: "1-Ch Audio Input / Output",
      weatherproof: "IP67 Heavy-duty Metal Housing",
      connectivity: "Gigabit PoE IEEE 802.3af",
      warranty: "3 Years Comprehensive Warranty"
    },
    in_stock: true,
    is_featured: false,
    is_deal_of_day: false
  },
  {
    id: "prod-005",
    name: "Complete 4-Camera Full HD Showroom Home Security Pack",
    slug: "complete-4-camera-hd-package",
    category: "Complete Packages",
    brand: "Hikvision",
    original_price: 19999,
    offer_price: 13499,
    discount_percent: 32,
    image_url: "https://images.unsplash.com/photo-1528312635006-8ea0bc49ec63?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1528312635006-8ea0bc49ec63?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Our #1 best-selling turnkey showroom package! Includes 2x Outdoor Bullet Cameras, 2x Indoor Dome Cameras, 4-Channel Turbo HD DVR, 1TB Surveillance Hard Drive, 4-Ch SMPS Power Supply, 90m 3+1 Pure Copper Cable, Connectors, and Free Professional On-Site Installation.",
    specs: {
      package_includes: "2 Bullets + 2 Domes + 4CH DVR + 1TB HDD + Cable + Power Supply",
      resolution: "Full HD 1080p / 2MP Clear Imaging",
      storage: "1TB WD Purple Surveillance Drive (15 Days Recording)",
      remote_viewing: "Live Mobile App on iOS & Android",
      installation: "Free On-Site Standard Installation Included",
      warranty: "2 Years On-Site Showroom Warranty"
    },
    in_stock: true,
    is_featured: true,
    is_deal_of_day: true
  },
  {
    id: "prod-006",
    name: "Commercial 8-Camera 5MP AI Surveillance Package",
    slug: "commercial-8-camera-5mp-ai-package",
    category: "Complete Packages",
    brand: "Dahua",
    original_price: 38999,
    offer_price: 26999,
    discount_percent: 31,
    image_url: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Engineered specifically for supermarkets, warehouses, manufacturing units, and multi-story offices. Includes 4 outdoor bullets, 4 indoor domes, 8-channel AI DVR, 2TB hard drive, rack mount, power units, and full setup.",
    specs: {
      package_includes: "4 Bullets + 4 Domes + 8CH AI DVR + 2TB HDD + 8-CH SMPS + Rack",
      resolution: "5MP Super HD AI Clarity",
      storage: "2TB Surveillance Grade Drive (30 Days Recording)",
      ai_features: "Tripwire, Intrusion Detection, People Counting",
      installation: "Professional Wiring & Cable Conduit Dressing Included",
      warranty: "2 Years Replacement Guarantee"
    },
    in_stock: true,
    is_featured: true,
    is_deal_of_day: false
  },
  {
    id: "prod-007",
    name: "Hikvision 8-Channel 4K AcuSense NVR with PoE",
    slug: "hikvision-8ch-4k-acusense-nvr",
    category: "DVR & NVR Kits",
    brand: "Hikvision",
    original_price: 14500,
    offer_price: 9999,
    discount_percent: 31,
    image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Plug & Play Network Video Recorder with 8 independent PoE network interfaces. Supports H.265+ ultra compression, decoding up to 8 channels of 4K IP cameras with real-time AcuSense false alarm filtering.",
    specs: {
      channels: "8-Channels IP PoE up to 8MP/4K",
      compression: "H.265+ / H.265 / H.264+",
      sata_interface: "2 SATA Interfaces (Up to 10TB each)",
      output: "HDMI 4K (3840x2160) & VGA Simultaneous",
      network: "1x RJ45 1000M Self-adaptive + 8x PoE ports",
      warranty: "2 Years Manufacturer Warranty"
    },
    in_stock: true,
    is_featured: false,
    is_deal_of_day: false
  },
  {
    id: "prod-008",
    name: "Solar Powered 4G LTE Wireless PTZ Camera with Battery",
    slug: "solar-powered-4g-wireless-ptz",
    category: "Wireless Smart Cameras",
    brand: "Uniview",
    original_price: 13999,
    offer_price: 8999,
    discount_percent: 35,
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Zero electricity and zero Wi-Fi required! 100% wire-free solar-powered 4G SIM card camera with built-in high-capacity rechargeable batteries. Perfect for agricultural farms, construction sites, and remote properties.",
    specs: {
      power: "8W Monocrystalline Solar Panel + 19,200mAh Battery",
      connectivity: "4G LTE Nano SIM Card Slot (Works with all major telcos)",
      resolution: "3MP 2K Super HD",
      night_vision: "Color Night Vision with White Spotlights",
      storage: "MicroSD up to 256GB + Encrypted Cloud Backup",
      weatherproof: "IP66 Severe Weather Proofing",
      warranty: "1 Year Showroom Warranty"
    },
    in_stock: true,
    is_featured: true,
    is_deal_of_day: true
  },
  {
    id: "prod-009",
    name: "Western Digital Purple 4TB Surveillance Hard Drive",
    slug: "wd-purple-4tb-surveillance-hdd",
    category: "Accessories",
    brand: "Western Digital",
    original_price: 8999,
    offer_price: 6499,
    discount_percent: 28,
    image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Built for 24/7, always-on, high-definition security systems. Engineered with AllFrame technology to reduce frame drops and improve video playback performance in NVRs and DVRs.",
    specs: {
      capacity: "4TB (3.5 inch)",
      interface: "SATA 6 Gb/s",
      workload_rate: "Up to 180 TB/year",
      cameras_supported: "Up to 64 HD Video Streams",
      mtbf: "1.5 Million Hours",
      warranty: "3 Years Official WD Replacement Warranty"
    },
    in_stock: true,
    is_featured: false,
    is_deal_of_day: false
  },
  {
    id: "prod-010",
    name: "Hikvision Smart Video Door Phone with 7-Inch Touchscreen",
    slug: "hikvision-video-door-phone-touchscreen",
    category: "Accessories",
    brand: "Hikvision",
    original_price: 12500,
    offer_price: 8499,
    discount_percent: 32,
    image_url: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
    ],
    description: "See and speak to visitors at your doorstep from anywhere using your smartphone. 7-inch indoor capacitive touch monitor with outdoor bell station featuring night vision camera and RFID keycard unlock.",
    specs: {
      monitor: "7-Inch Colorful TFT Touch Display (1024 x 600)",
      camera_unit: "2MP HD Low Light IR Camera with 129° Wide View",
      connectivity: "Wi-Fi + Standard PoE Interface",
      remote_unlock: "Electronic Door Strike Integration via Hik-Connect App",
      storage: "MicroSD Slot up to 32GB for snapshot logs",
      warranty: "2 Years On-Site Warranty"
    },
    in_stock: true,
    is_featured: true,
    is_deal_of_day: false
  }
];

export const defaultOffers = [
  {
    id: "offer-001",
    title: "Diwali & Festive Security Bonanza",
    subtitle: "Upgrade your family and shop safety with premium 5MP CCTV kits",
    discount_text: "Flat 35% OFF + Free 1TB HDD & Cable",
    banner_image_url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
    coupon_code: "FESTIVE35",
    badge_color: "orange",
    is_active: true,
    valid_until: "2026-11-30T23:59:59Z"
  },
  {
    id: "offer-002",
    title: "Commercial & Business 8-Camera Bundle",
    subtitle: "Complete enterprise video protection with AI human detection & remote phone monitoring",
    discount_text: "Save ₹12,000 + Free Installation",
    banner_image_url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80",
    coupon_code: "BIZGUARD",
    badge_color: "amber",
    is_active: true,
    valid_until: "2026-12-31T23:59:59Z"
  },
  {
    id: "offer-003",
    title: "Smart WiFi Camera Mega Sale",
    subtitle: "No cabling required! Plug & Play 360° cameras with 2-way talk and siren",
    discount_text: "Starting at ₹1,999 Only",
    banner_image_url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80",
    coupon_code: "SMARTHOME",
    badge_color: "orange",
    is_active: true,
    valid_until: "2026-10-31T23:59:59Z"
  }
];

export const defaultSettings = {
  showroom_name: "SM SYSTEMS",
  logo_url: "",
  tagline: "Premier CCTV Camera Showroom & Certified Surveillance Installation Center",
  phone_primary: "+91 98401 23456",
  phone_secondary: "+91 94440 98765",
  whatsapp_number: "919486171929",
  email: "sales@smsystems.in",
  address: "Showroom No. 18, Orange Square, Ring Road Junction, Anna Nagar, Chennai, Tamil Nadu - 600040",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600040",
  google_maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.002986478951!2d80.2074!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzU3LjciTiA4MMKwMTInMjYuNiJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
  opening_hours: "Monday - Saturday: 9:00 AM - 9:00 PM | Sunday: 10:00 AM - 6:00 PM",
  announcement_bar: "⚡ Exclusive Showroom Offer: Get FREE On-Site Site Survey & 2-Year Replacement Warranty on all 4K CCTV setups this month!",
  instagram_url: "",
  facebook_url: "",
  demo_badge_text: "4K Ultra HD",
  demo_image_url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
  demo_product_name: "Hikvision ColorVu 5MP",
  demo_product_feature: "F1.0 Full-Time Night Color",
  demo_mrp: "₹4,999",
  demo_offer_price: "₹3,299",
  demo_perk_1: "Free Mobile App Setup on Android & iPhone",
  demo_perk_2: "Free Site Survey by Certified Security Engineers",
  demo_perk_3: "Doorstep Demo & Replacement Guarantee",
  experience_years: 12,
  installations_done: "15,000+",
  clients_served: "8,500+"
};

export const defaultCategories = [
  {
    id: "cat-001",
    name: "Bullet Cameras",
    icon_url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80",
    description: "Outdoor, IP67 Weatherproof, Night Vision",
    tagline: "Outdoor Security",
    sort_order: 1,
    is_active: true
  },
  {
    id: "cat-002",
    name: "Dome Cameras",
    icon_url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80",
    description: "Indoor, Ceiling Mount, Vandal-Proof",
    tagline: "Home & Office",
    sort_order: 2,
    is_active: true
  },
  {
    id: "cat-003",
    name: "PTZ Cameras",
    icon_url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80",
    description: "360° Pan-Tilt-Zoom, Smart AI Tracking",
    tagline: "Perimeter & Commercial",
    sort_order: 3,
    is_active: true
  },
  {
    id: "cat-004",
    name: "Wireless Smart Cameras",
    icon_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    description: "WiFi & 4G SIM, Solar, Two-Way Audio",
    tagline: "Plug & Play",
    sort_order: 4,
    is_active: true
  },
  {
    id: "cat-005",
    name: "Complete Packages",
    icon_url: "https://images.unsplash.com/photo-1528312635006-8ea0bc49ec63?auto=format&fit=crop&w=400&q=80",
    description: "Turnkey 4-Cam & 8-Cam Kits with Installation",
    tagline: "Best Value Bundles",
    sort_order: 5,
    is_active: true
  },
  {
    id: "cat-006",
    name: "DVR & NVR Kits",
    icon_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
    description: "4K Video Recorders & Surveillance Storage",
    tagline: "24/7 Recording",
    sort_order: 6,
    is_active: true
  }
];

export const defaultInquiries = [
  {
    id: "inq-101",
    customer_name: "Vikram Rathore",
    customer_phone: "+91 98840 55123",
    customer_email: "vikram.r@gmail.com",
    service_type: "Commercial Showroom",
    camera_count: "8 Cameras",
    product_name: "Commercial 8-Camera 5MP AI Surveillance Package",
    message: "Need 8 cameras installed at our retail textile showroom in T.Nagar with mobile viewing on 2 phones and 1 month recording backup.",
    status: "New",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "inq-102",
    customer_name: "Priya Sundaram",
    customer_phone: "+91 97910 88234",
    customer_email: "priya.sundar@yahoo.com",
    service_type: "Home Security",
    camera_count: "4 Cameras",
    product_name: "Complete 4-Camera Full HD Showroom Home Security Pack",
    message: "Looking for independent villa surveillance covering gate, car parking, and backyard.",
    status: "Contacted",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];
