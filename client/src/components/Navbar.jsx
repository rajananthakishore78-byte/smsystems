import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  ShieldCheck, 
  PhoneCall, 
  Clock, 
  MessageCircle, 
  Search, 
  Menu, 
  X, 
  Sparkles
} from 'lucide-react';
import { useInquiry } from '../context/InquiryContext.jsx';

export default function Navbar() {
  const { settings, openQuoteModal, getWhatsAppLink } = useInquiry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products & Deals', path: '/products' },
    { name: 'Showroom Services', path: '/services' },
    { name: 'Visit Showroom', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Professional Announcement Bar */}
      <div className="bg-brand-600 text-white text-xs sm:text-sm py-2 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left truncate w-full min-w-0">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-200" />
            <span className="truncate">{settings.announcement_bar || "Exclusive Showroom Offer: Up to 40% OFF on 4K Kits!"}</span>
          </div>
          <div className="flex items-center gap-5 text-xs font-semibold flex-shrink-0">
            <span className="hidden md:flex items-center gap-1.5 opacity-90">
              <Clock className="w-3.5 h-3.5" />
              {settings.opening_hours?.split('|')[0] || "Mon - Sat: 9 AM - 9 PM"}
            </span>
            <a 
              href={`tel:${settings.phone_primary?.replace(/\s+/g, '')}`} 
              className="flex items-center gap-1.5 hover:text-amber-100 transition-colors bg-black/10 px-2 py-0.5 rounded-full"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              {settings.phone_primary || "+91 98401 23456"}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group min-w-0">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.showroom_name || 'Showroom Logo'}
                className="w-11 h-11 rounded-xl object-contain bg-white border border-brand-200 shadow-sm group-hover:border-brand-400 transition-colors"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center shadow-orange-glow group-hover:bg-brand-700 transition-colors duration-300">
                <Camera className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                  {(() => {
                    const parts = (settings.showroom_name || 'SM SYSTEMS').trim().split(/\s+/);
                    return (
                      <>
                        {parts[0]}
                        {parts.length > 1 && <span className="text-brand-600"> {parts.slice(1).join(' ')}</span>}
                      </>
                    );
                  })()}
                </span>
                <span className="hidden sm:inline text-[10px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200 px-1.5 py-0.5 rounded tracking-wider">
                  Showroom
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tracking-wide font-medium hidden sm:block">
                CCTV & Surveillance Experience Center
              </p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search CCTV cameras, 4K kits, DVRs, WiFi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active 
                      ? 'text-brand-700 bg-brand-50 border border-brand-200' 
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Call to Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-all hover:scale-105"
              title="Chat on WhatsApp with Showroom Expert"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={() => openQuoteModal()}
              className="px-4 py-2.5 rounded-xl font-bold text-sm bg-brand-600 text-white shadow-orange-glow hover:bg-brand-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Get Free Quote</span>
            </button>

          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => openQuoteModal()}                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search CCTV products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </form>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 w-fit"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Showroom
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
