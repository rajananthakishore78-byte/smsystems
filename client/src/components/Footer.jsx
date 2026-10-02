import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  ShieldAlert, 
  Award, 
  Wrench, 
  CheckCircle2, 
  Lock,
  Instagram,
  Facebook
} from 'lucide-react';
import { useInquiry } from '../context/InquiryContext.jsx';

// Social pages opened in a new tab from the footer.
// URLs come from Admin Portal -> Settings; generic homepages are the fallback.
const FALLBACK_SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com/', Icon: Instagram },
  { name: 'Facebook', href: 'https://www.facebook.com/', Icon: Facebook }
];

const getSocialLinks = (settings = {}) => [
  { ...FALLBACK_SOCIAL_LINKS[0], href: settings.instagram_url?.trim() || FALLBACK_SOCIAL_LINKS[0].href },
  { ...FALLBACK_SOCIAL_LINKS[1], href: settings.facebook_url?.trim() || FALLBACK_SOCIAL_LINKS[1].href }
];

export default function Footer() {
  const { settings, getWhatsAppLink } = useInquiry();
  const socialLinks = getSocialLinks(settings);

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      {/* Showroom Key Highlights Band */}
      <div className="border-b border-slate-900 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Live Showroom Demo</h4>
              <p className="text-xs text-slate-400">Experience 4K, ColorVu & PTZ cameras in person</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">2-Year On-Site Warranty</h4>
              <p className="text-xs text-slate-400">Official brand warranties with doorstep service</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Expert Installation</h4>
              <p className="text-xs text-slate-400">Certified technicians & tidy conduit wiring</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Free Site Survey</h4>
              <p className="text-xs text-slate-400">No obligation security audit for home & shop</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.showroom_name || 'Showroom Logo'}
                className="w-10 h-10 rounded-xl object-contain bg-white border border-brand-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-orange-glow">
                <Camera className="w-6 h-6" />
              </div>
            )}
            <span className="text-xl font-extrabold text-white tracking-tight">
              {(settings.showroom_name || 'SM SYSTEMS').trim().split(/\s+/)[0]}
              {(settings.showroom_name || 'SM SYSTEMS').trim().split(/\s+/).length > 1 && (
                <span className="text-brand-500"> {(settings.showroom_name).trim().split(/\s+/).slice(1).join(' ')}</span>
              )}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            {settings.tagline || "Premier CCTV Camera Showroom & Certified Surveillance Installation Center."}
          </p>
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Authorized Dealership:</p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Hikvision</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Dahua</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">CP Plus</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Imou</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Western Digital</span>
            </div>
          </div>

          <div className="pt-3">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Follow Us:</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${settings.showroom_name || 'SM SYSTEMS'} on ${name}`}
                  aria-label={`${settings.showroom_name || 'SM SYSTEMS'} on ${name}`}
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2">
            Security Products
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/products?category=Bullet%20Cameras" className="hover:text-brand-400 transition-colors">
                Outdoor Bullet Cameras (IP67)
              </Link>
            </li>
            <li>
              <Link to="/products?category=Dome%20Cameras" className="hover:text-brand-400 transition-colors">
                Ceiling & Dome Cameras
              </Link>
            </li>
            <li>
              <Link to="/products?category=PTZ%20Cameras" className="hover:text-brand-400 transition-colors">
                360° PTZ Speed Dome Cameras
              </Link>
            </li>
            <li>
              <Link to="/products?category=Wireless%20Smart%20Cameras" className="hover:text-brand-400 transition-colors">
                Wireless WiFi & 4G SIM Cameras
              </Link>
            </li>
            <li>
              <Link to="/products?category=Complete%20Packages" className="hover:text-brand-400 transition-colors">
                Turnkey 4-Cam & 8-Cam Home/Shop Packages
              </Link>
            </li>
            <li>
              <Link to="/products?category=DVR%20%26%20NVR%20Kits" className="hover:text-brand-400 transition-colors">
                DVR, NVR & Surveillance Hard Drives
              </Link>
            </li>
          </ul>
        </div>

        {/* Showroom Hours & Services */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2">
            Showroom Hours
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-300 font-medium">Visiting Timings</p>
                <p className="text-slate-400 mt-0.5">{settings.opening_hours}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-400">
                Walk in anytime for a live demonstration of night-vision clarity, audio playback, and mobile app setup.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Showroom */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2">
            Visit & Contact
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <a href={`tel:${settings.phone_primary?.replace(/\s+/g, '')}`} className="hover:text-brand-400">
                {settings.phone_primary} / {settings.phone_secondary}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-brand-400">
                {settings.email}
              </a>
            </div>
            <div className="pt-2">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Admin Link */}
      <div className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} {settings.showroom_name}. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={name}
                aria-label={name}
                className="hover:text-brand-400 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
            <Link to="/products" className="hover:text-slate-300">Catalog</Link>
            <Link to="/services" className="hover:text-slate-300">Installation Packages</Link>
            <Link to="/contact" className="hover:text-slate-300">Showroom Map</Link>
            <Link to="/admin" className="hover:text-amber-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
