import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Phone, Mail, User, Send } from 'lucide-react';
import { useInquiry } from '../context/InquiryContext.jsx';
import { submitInquiry } from '../api/client.js';

export default function QuoteModal() {
  const { quoteModalOpen, closeQuoteModal, selectedProduct, settings } = useInquiry();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service_type: 'Home Security',
    camera_count: '4 Cameras',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!quoteModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        service_type: formData.service_type,
        camera_count: formData.camera_count,
        product_name: selectedProduct ? selectedProduct.name : 'General CCTV Inquiry',
        message: formData.message || `Customer inquiry regarding ${selectedProduct ? selectedProduct.name : 'security installation'}`
      };

      const res = await submitInquiry(payload);
      if (res.data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.data.message || 'Failed to submit quote request.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Server error. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      service_type: 'Home Security',
      camera_count: '4 Cameras',
      message: ''
    });
    closeQuoteModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Inquiry Received!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our certified showroom CCTV specialist will call you at <strong className="text-orange-600">{formData.phone}</strong> within 30 minutes.
            </p>
            <div className="pt-4">
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-600 text-white shadow-orange-glow hover:bg-brand-700 transition-all"
              >
                Close & Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Request Quotation & Demo</h3>
                <p className="text-xs text-slate-500">Free site survey & showroom consultation</p>
              </div>
            </div>

            {selectedProduct && (
              <div className="mb-4 p-3 rounded-xl bg-orange-50/60 border border-orange-200 flex items-center gap-3">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 p-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{selectedProduct.name}</p>
                  <p className="text-xs text-brand-600 font-bold">
                    Offer Price: ₹{Number(selectedProduct.offer_price).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Optional)</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property / Service Type</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full bg-slate-50 text-xs text-slate-800 py-2.5 px-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Home Security">Independent Home / Villa</option>
                    <option value="Apartment / Flat">Apartment / Gated Community</option>
                    <option value="Retail Store / Showroom">Retail Store / Showroom</option>
                    <option value="Commercial Office">Commercial Office / IT</option>
                    <option value="Factory / Warehouse">Factory / Warehouse</option>
                    <option value="Site Inspection & Survey">Free Site Survey Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Required Cameras</label>
                  <select
                    value={formData.camera_count}
                    onChange={(e) => setFormData({ ...formData, camera_count: e.target.value })}
                    className="w-full bg-slate-50 text-xs text-slate-800 py-2.5 px-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="1-2 Cameras">1 - 2 WiFi Smart Cameras</option>
                    <option value="4 Cameras">4 Cameras (Most Popular)</option>
                    <option value="8 Cameras">8 Cameras Complete Kit</option>
                    <option value="16+ Cameras">16+ Enterprise Cameras</option>
                    <option value="Unsure">Unsure (Need Recommendation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Requirements / Location</label>
                <textarea
                  rows="2"
                  placeholder="Tell us about your property location, night vision needs, audio needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 p-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-brand-600 text-white shadow-orange-glow hover:bg-brand-700 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Quotation Request</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-500">
                🔒 Your contact details are secure. We never share your data.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
