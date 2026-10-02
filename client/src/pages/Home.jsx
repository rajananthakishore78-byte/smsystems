import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  PhoneCall, 
  MessageCircle, 
  Tag, 
  Zap, 
  Award,
  ChevronRight
} from 'lucide-react';
import { getProducts, getOffers } from '../api/client.js';
import { useInquiry } from '../context/InquiryContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductDetailModal from '../components/ProductDetailModal.jsx';

export default function Home() {
  const { settings, openQuoteModal, getWhatsAppLink } = useInquiry();
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, offRes] = await Promise.all([
          getProducts(),
          getOffers({ activeOnly: true })
        ]);
        if (prodRes.data.success) {
          setProducts(prodRes.data.data);
        }
        if (offRes.data.success) {
          setOffers(offRes.data.data);
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.is_featured);
  const dealsOfDay = products.filter(p => p.is_deal_of_day);

  const categories = [
    {
      name: "Bullet Cameras",
      icon: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80",
      desc: "Outdoor, IP67 Weatherproof, Night Vision",
      count: "Outdoor Security"
    },
    {
      name: "Dome Cameras",
      icon: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80",
      desc: "Indoor, Ceiling Mount, Vandal-Proof",
      count: "Home & Office"
    },
    {
      name: "PTZ Cameras",
      icon: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80",
      desc: "360° Pan-Tilt-Zoom, Smart AI Tracking",
      count: "Perimeter & Commercial"
    },
    {
      name: "Wireless Smart Cameras",
      icon: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
      desc: "WiFi & 4G SIM, Solar, Two-Way Audio",
      count: "Plug & Play"
    },
    {
      name: "Complete Packages",
      icon: "https://images.unsplash.com/photo-1528312635006-8ea0bc49ec63?auto=format&fit=crop&w=400&q=80",
      desc: "Turnkey 4-Cam & 8-Cam Kits with Installation",
      count: "Best Value Bundles"
    },
    {
      name: "DVR & NVR Kits",
      icon: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
      desc: "4K Video Recorders & Surveillance Storage",
      count: "24/7 Recording"
    }
  ];

  return (
    <div className="space-y-16 pb-20 bg-white">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-slate-200">
        {/* Subtle Warm Orange Glow Ambient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[550px] sm:h-[550px] bg-brand-400/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Authorized CCTV Camera Experience Showroom</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Protect What Matters Most With <span className="text-brand-600">Next-Gen 4K CCTV</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Visit our premier showroom to experience 24/7 full-color night vision, AI human tracking, and 4K surveillance cameras. 
                Get <strong>wholesale showroom pricing</strong>, <strong>genuine brand warranty</strong>, and <strong>free on-site installation</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-brand-600 text-white shadow-orange-glow hover:bg-brand-700 active:scale-95 transition-all flex items-center justify-center gap-2.5"
                >
                  <Camera className="w-5 h-5" />
                  <span>Explore CCTV Products & Deals</span>
                </Link>

                <button
                  onClick={() => openQuoteModal()}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-brand-600" />
                  <span>Book Free Site Inspection</span>
                </button>
              </div>

              {/* Showroom trust metrics */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">15,000+</p>
                  <p className="text-xs text-slate-500 font-medium">Cameras Installed</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-brand-600">2 Years</p>
                  <p className="text-xs text-slate-500 font-medium">On-Site Warranty</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Genuine Brands</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-orange-200/80 bg-white shadow-xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Live Showroom Demo</span>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-md font-bold">
                    {settings.demo_badge_text || '4K Ultra HD'}
                  </span>
                </div>

                <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                  <img
                    src={settings.demo_image_url || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"}
                    alt="CCTV Camera Demonstration"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  
                  {/* Overlay Specs Card */}
                  <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-white/95 backdrop-blur border border-slate-200/80 flex items-center justify-between shadow-md">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{settings.demo_product_name || 'Hikvision ColorVu 5MP'}</p>
                      <p className="text-[11px] text-emerald-600 font-semibold">{settings.demo_product_feature || 'F1.0 Full-Time Night Color'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through">{settings.demo_mrp || '₹4,999'}</span>
                      <p className="text-sm font-extrabold text-brand-600">{settings.demo_offer_price || '₹3,299'}</p>
                    </div>
                  </div>
                </div>

                {/* Showroom Perks */}
                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  {[settings.demo_perk_1, settings.demo_perk_2, settings.demo_perk_3].map((perk, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span>{perk || ['Free Mobile App Setup on Android & iPhone', 'Free Site Survey by Certified Security Engineers', 'Doorstep Demo & Replacement Guarantee'][i]}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat With Showroom Expert on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banners & Active Offers Carousel */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-200">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Showroom Exclusive Offers</h2>
                <p className="text-xs text-slate-500">Limited-time discounts on CCTV bundles & smart cameras</p>
              </div>
            </div>
            <Link to="/products" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-orange-400 p-6 flex flex-col justify-between group hover:shadow-card-hover transition-all duration-300"
              >
                <div className="space-y-2">
                  <div className="inline-block bg-brand-600 text-white text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    {offer.discount_text || "Special Deal"}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {offer.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {offer.coupon_code && (
                    <span className="text-[11px] font-mono bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded font-bold">
                      CODE: {offer.coupon_code}
                    </span>
                  )}
                  <button
                    onClick={() => openQuoteModal()}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 ml-auto"
                  >
                    <span>Claim Offer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Exploration Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Surveillance Hardware</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Browse By CCTV Category</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From indoor ceiling cameras to high-zoom motorized outdoor surveillance, explore equipment tested in our showroom.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-card-hover transition-all text-center flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-xl bg-slate-50 p-2 mb-3 overflow-hidden border border-slate-200 group-hover:scale-105 transition-transform">
                <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals of the Day / Flash Offers */}
      {dealsOfDay.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-brand-600 text-white relative overflow-hidden shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-brand-600 flex items-center justify-center shadow-md">
                  <Zap className="w-6 h-6 fill-brand-600 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">Deal of the Day</h3>
                  <p className="text-xs text-brand-100 font-medium">Extra discounts + Free on-site setup included today</p>
                </div>
              </div>
              <Link
                to="/products"
                className="self-start sm:self-auto text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl backdrop-blur transition-all flex items-center gap-1"
              >
                <span>View All Deals</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealsOfDay.slice(0, 3).map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Showroom Bestsellers</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured CCTV Systems</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>See Full Catalog ({products.length} Products)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(featuredProducts.length > 0 ? featuredProducts : products).slice(0, 8).map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Showroom Experience & Installation Services */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200">
                <Award className="w-4 h-4 text-brand-600" />
                <span>Why Choose {settings.showroom_name || 'SM SYSTEMS'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Don't Buy CCTV Blindly Online — <span className="text-brand-600">Test In Our Showroom First</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Most online cameras look similar on paper, but resolution, night-time focal distance, and sensor quality vary drastically in real life.
                At our experience center, you can test pitch-dark night vision, test the audio mic clarity, and try mobile app notifications before purchasing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Genuine Brand Stock
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct authorized partners of Hikvision, Dahua, CP Plus & Western Digital.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Clean Installation
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Conduit pipe casing, neat cable routing, and storm-proof outdoor sealing.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    2-Year On-Site Service
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Free doorstep technician support and instant standby camera replacements.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Zero Hidden Costs
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Itemized transparent billing covering cameras, DVR, storage, and cables.
                  </p>
                </div>
              </div>
            </div>

            {/* Visit Showroom Location Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-orange-200 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Showroom Location</h3>
                    <p className="text-xs text-slate-500">Live Demonstrations Open Today</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Open Now
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-700 font-semibold leading-relaxed">
                  {settings.address}
                </p>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>{settings.opening_hours}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <PhoneCall className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span className="font-semibold">{settings.phone_primary} / {settings.phone_secondary}</span>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${settings.phone_primary?.replace(/\s+/g, '')}`}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <PhoneCall className="w-4 h-4 text-slate-600" />
                  <span>Call Showroom</span>
                </a>

                <button
                  onClick={() => openQuoteModal()}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center gap-2 shadow-orange-glow transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Schedule Site Survey</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
