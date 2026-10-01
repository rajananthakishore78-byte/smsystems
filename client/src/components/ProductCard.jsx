import React from 'react';
import { ShieldCheck, MessageCircle, Eye, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useInquiry } from '../context/InquiryContext.jsx';

export default function ProductCard({ product, onSelect }) {
  const { openQuoteModal, getWhatsAppLink } = useInquiry();

  const savings = Math.max(0, (product.original_price || 0) - (product.offer_price || 0));

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-orange-400 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.discount_percent > 0 && (
          <span className="bg-brand-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-200" />
            {product.discount_percent}% OFF
          </span>
        )}
        {product.is_deal_of_day && (
          <span className="bg-orange-50 text-orange-700 border border-orange-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
            🔥 Deal of Day
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="bg-white/95 text-slate-700 border border-slate-200 font-bold text-[10px] px-2.5 py-0.5 rounded-md shadow-xs">
          {product.brand}
        </span>
      </div>

      {/* Product Image Area */}
      <div 
        onClick={() => onSelect ? onSelect(product) : openQuoteModal(product)}
        className="relative h-52 w-full bg-slate-50/70 border-b border-slate-100 overflow-hidden cursor-pointer flex items-center justify-center p-4"
      >
        <img
          src={product.image_url || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Quick View Hover Pill */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="bg-white text-slate-800 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5 text-orange-600" />
            View Specifications
          </span>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category */}
          <p className="text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-1">
            {product.category}
          </p>

          {/* Title */}
          <h3 
            onClick={() => onSelect ? onSelect(product) : openQuoteModal(product)}
            className="text-base font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Quick Specifications Badges */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {product.specs.resolution && (
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                  {product.specs.resolution.split('(')[0].trim()}
                </span>
              )}
              {product.specs.night_vision && (
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                  {product.specs.night_vision.split(' ')[0]} Night Vision
                </span>
              )}
              {product.specs.weatherproof && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                  {product.specs.weatherproof.split(' ')[0]}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing Area */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-brand-600">
                  ₹{Number(product.offer_price).toLocaleString('en-IN')}
                </span>
                {product.original_price > product.offer_price && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{Number(product.original_price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-[11px] text-emerald-600 font-semibold">
                  You Save: ₹{Number(savings).toLocaleString('en-IN')}
                </p>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              In Stock
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => onSelect ? onSelect(product) : openQuoteModal(product)}
              className="py-2 px-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <span>Specs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Inquire</span>
            </a>
          </div>

          <button
            onClick={() => openQuoteModal(product)}
            className="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-600 transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Request Installation Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
}
