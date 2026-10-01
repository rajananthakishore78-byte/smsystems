import React from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles 
} from 'lucide-react';
import { useInquiry } from '../context/InquiryContext.jsx';

export default function Services() {
  const { openQuoteModal, getWhatsAppLink } = useInquiry();

  const packages = [
    {
      name: "Residential 4-Camera HD Pack",
      tagline: "Ideal for 2-3 BHK flats, independent houses, and villas",
      price: "₹13,499",
      mrp: "₹19,999",
      discount: "32% OFF",
      features: [
        "2x Outdoor Weatherproof Bullet Cameras (Full HD 1080p)",
        "2x Indoor Ceiling Dome Cameras (Night Vision)",
        "1x 4-Channel Turbo HD Digital Video Recorder (DVR)",
        "1x 1TB WD Purple Surveillance Hard Drive (15-Day Storage)",
        "1x 4-Channel SMPS Power Supply Unit",
        "90 Meters 3+1 Pure Copper Shielded Cable",
        "Free On-Site Installation & Mobile App Configuration",
        "2 Years Full On-Site Replacement Warranty"
      ],
      recommended: false
    },
    {
      name: "Commercial 8-Camera 5MP AI Pack",
      tagline: "Tailored for retail showrooms, restaurants, clinics, and offices",
      price: "₹26,999",
      mrp: "₹38,999",
      discount: "31% OFF",
      features: [
        "4x 5MP ColorVu Full-Time Color Bullet Cameras",
        "4x 5MP Audio Dome Cameras with Built-in Mic",
        "1x 8-Channel AI AcuSense DVR (Human & Vehicle Detection)",
        "1x 2TB Surveillance Hard Drive (30-Day Backup)",
        "1x 8-Channel Industrial Power Supply Unit",
        "180 Meters High-Grade Copper CCTV Cable + BNC Jacks",
        "Full PVC Conduit Casing & Waterproof Junction Boxes",
        "2 Years On-Site Support & 1 Free Preventive Maintenance"
      ],
      recommended: true
    },
    {
      name: "Enterprise 16-Camera 4K PoE IP Setup",
      tagline: "Engineered for warehouses, factories, schools & multi-floor buildings",
      price: "₹64,999",
      mrp: "₹89,999",
      discount: "28% OFF",
      features: [
        "8x 4K Ultra HD IP Bullet Cameras (60m Smart IR)",
        "8x 4K IP Wide-Angle Dome Cameras (IK10 Vandal-Proof)",
        "1x 16-Channel 4K NVR with 16x Independent PoE Ports",
        "2x 4TB Surveillance Hard Drives (8TB Total Backup)",
        "Industrial 19-Inch 4U Server Rack with Cable Management",
        "Cat6 Shielded Gigabit Ethernet Cabling",
        "Remote viewing on multiple PCs, Tablets & Smartphones",
        "3 Years Comprehensive Comprehensive Warranty"
      ],
      recommended: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold uppercase tracking-wider">
          <Wrench className="w-3.5 h-3.5 text-brand-600" />
          <span>Professional Installation & AMC</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Turnkey CCTV Installation & AMC Packages
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Everything included: genuine cameras, storage, cables, professional conduit pipe dressing, and lifetime support from our physical showroom team.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-white transition-all shadow-sm ${
              pkg.recommended
                ? 'border-2 border-orange-500 shadow-card-hover -translate-y-2'
                : 'border border-slate-200 hover:border-slate-300'
            }`}
          >
            {pkg.recommended && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white font-bold text-xs px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                Showroom Best Seller
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  {pkg.discount}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{pkg.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{pkg.tagline}</p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-brand-600">{pkg.price}</span>
                  <span className="text-xs text-slate-400 line-through">MRP: {pkg.mrp}</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-bold mt-1">
                  Complete kit + Free professional installation included
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Package Inclusions:</p>
                {pkg.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
              <button
                onClick={() => openQuoteModal({ name: pkg.name, offer_price: parseInt(pkg.price.replace(/[^0-9]/g, '')) })}
                className="w-full py-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-orange-glow transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Book This Package</span>
              </button>

              <a
                href={getWhatsAppLink({ name: pkg.name, offer_price: parseInt(pkg.price.replace(/[^0-9]/g, '')) })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Quote</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Showroom Installation Process */}
      <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 space-y-8 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Our Workflow</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How We Secure Your Property</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm border border-brand-200">
              1
            </span>
            <h4 className="text-sm font-bold text-slate-900">Free Site Survey</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our engineer inspects blind spots, perimeter angles, cable routes, and lighting conditions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm border border-brand-200">
              2
            </span>
            <h4 className="text-sm font-bold text-slate-900">Clean Installation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Heavy-duty PVC conduit casing, BNC waterproofing, and concealed indoor cabling.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm border border-brand-200">
              3
            </span>
            <h4 className="text-sm font-bold text-slate-900">Mobile Sync & Demo</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We connect your phone, configure motion alert notifications, and train family/staff.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm border border-brand-200">
              4
            </span>
            <h4 className="text-sm font-bold text-slate-900">2-Year Doorstep Care</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Showroom-backed warranty with standby replacement if a camera or adapter faults.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
