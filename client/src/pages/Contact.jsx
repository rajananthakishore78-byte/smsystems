import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Camera 
} from 'lucide-react';
import { useInquiry } from '../context/InquiryContext.jsx';
import { submitInquiry } from '../api/client.js';

export default function Contact() {
  const { settings, getWhatsAppLink } = useInquiry();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service_type: 'Site Inspection & Survey',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('Name and Phone number are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await submitInquiry({
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        service_type: formData.service_type,
        message: formData.message || 'Customer contact request from showroom website'
      });
      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest">
          <MapPin className="w-3.5 h-3.5" />
          <span>Showroom Experience Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Visit Our CCTV Showroom
        </h1>
        <p className="text-sm text-slate-600">
          Walk in to inspect live camera feeds, test smart AI tracking, and get customized security quotes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand-600" />
              <span>Showroom Contact Details</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Showroom Address:</p>
                  <p className="text-slate-800 font-semibold mt-0.5 leading-relaxed">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Phone Numbers:</p>
                  <a href={`tel:${settings.phone_primary?.replace(/\s+/g, '')}`} className="text-brand-600 font-semibold mt-0.5 block hover:underline">
                    {settings.phone_primary}
                  </a>
                  <a href={`tel:${settings.phone_secondary?.replace(/\s+/g, '')}`} className="text-slate-700 font-medium block hover:underline">
                    {settings.phone_secondary}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Email Address:</p>
                  <a href={`mailto:${settings.email}`} className="text-slate-800 font-semibold mt-0.5 block hover:text-brand-600">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Showroom Hours:</p>
                  <p className="text-slate-800 font-semibold mt-0.5">{settings.opening_hours}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Embedded Map Container */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 h-64 relative shadow-sm">
            <iframe
              title="Showroom Location Map"
              src={settings.google_maps_url || "https://maps.google.com"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-95 hover:opacity-100 transition-opacity"
            ></iframe>
          </div>
        </div>

        {/* Lead Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-extrabold text-slate-900">Book a Showroom Visit or Site Inspection</h3>
            <p className="text-xs text-slate-500">
              Fill out your details below and our security technician will reach out immediately.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900">Thank You!</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                Your message has been assigned to our senior CCTV specialist. We will contact you at <strong className="text-brand-600">{formData.phone}</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 p-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 p-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 p-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Purpose</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full bg-slate-50 text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Site Inspection & Survey">Schedule Free Site Survey</option>
                    <option value="Showroom Visit Demo">Book Live Showroom Demo</option>
                    <option value="4-Camera Home Kit Quote">4-Camera Home Kit Quote</option>
                    <option value="8-Camera Commercial Quote">8-Camera Commercial Quote</option>
                    <option value="CCTV AMC & Repair">CCTV AMC or Camera Repair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Requirements</label>
                <textarea
                  rows="3"
                  placeholder="Share details like number of floors, indoor/outdoor requirement, camera storage days..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 p-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-orange-glow hover:bg-brand-700 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to Showroom</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Your contact details are secure. We never share your data.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
