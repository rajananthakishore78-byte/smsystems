import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  MapPin
} from 'lucide-react';
import { useInquiry } from '../context/InquiryContext.jsx';

export default function ProductDetailModal({ product, onClose }) {
  const { openQuoteModal, getWhatsAppLink, settings } = useInquiry();
  const [selectedImg, setSelectedImg] = useState(product?.image_url || '');

  if (!product) return null;

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image_url];
  const savings = Math.max(0, (product.original_price || 0) - (product.offer_price || 0));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image & Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="space-y-4">
              <div className="relative h-72 w-full bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-6 overflow-hidden shadow-xs">
                <img
                  src={selectedImg || product.image_url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                {product.discount_percent > 0 && (
                  <span className="absolute top-3 left-3 bg-brand-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    {product.discount_percent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(img)}
                      className={`h-16 w-16 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-white p-1 transition-all ${
                        selectedImg === img ? 'border-orange-500 scale-105 shadow-sm' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Showroom Live Demo Highlight */}
            <div className="mt-6 p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-orange-800 font-bold">
                <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>Showroom Live Demonstration</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Experience this camera’s clarity, night vision, and mobile app in person at our showroom located at {settings.address?.split(',')[0]}.
              </p>
            </div>
          </div>

          {/* Right Column: Specs & Pricing */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Brand: {product.brand}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Pricing breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-brand-600">
                      ₹{Number(product.offer_price).toLocaleString('en-IN')}
                    </span>
                    {product.original_price > product.offer_price && (
                      <span className="text-sm text-slate-400 line-through">
                        MRP: ₹{Number(product.original_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-xs text-emerald-600 font-bold mt-1">
                      Save ₹{Number(savings).toLocaleString('en-IN')} on Showroom Pricing!
                    </p>
                  )}
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Available in Store
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Overview</h4>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Technical Specifications */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-orange-600" />
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 capitalize block text-[10px] font-medium">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-slate-800 font-bold mt-0.5 block">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={getWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    openQuoteModal(product);
                  }}
                  className="py-3 px-4 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-orange-glow flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Book Free Showroom Demo</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500 font-medium">
                Includes official manufacturer warranty & optional professional installation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
