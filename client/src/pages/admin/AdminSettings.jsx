import React, { useState, useEffect, useRef } from 'react';
import { Settings, Save, CheckCircle2, Building, Phone, MapPin, Clock, Sparkles, Loader2, AlertCircle, Image, Trash2, Upload, Share2 } from 'lucide-react';
import { getSettings, updateSettings, uploadImage } from '../../api/client.js';
import { useInquiry } from '../../context/InquiryContext.jsx';

export default function AdminSettings() {
  const { fetchSettings } = useInquiry();
  const [form, setForm] = useState({
    showroom_name: '',
    logo_url: '',
    tagline: '',
    phone_primary: '',
    phone_secondary: '',
    whatsapp_number: '',
    email: '',
    address: '',
    google_maps_url: '',
    opening_hours: '',
    announcement_bar: '',
    instagram_url: '',
    facebook_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const logoInputRef = useRef(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await getSettings();
      if (res.data.success && res.data.data) {
        setForm(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please choose an image file (PNG, JPG, SVG or WebP) for the showroom logo.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Logo file must be smaller than 5MB.');
      return;
    }

    setUploadingLogo(true);
    setErrorMsg('');
    try {
      const res = await uploadImage(file);
      if (res.data.success && res.data.url) {
        setForm((prev) => ({ ...prev, logo_url: res.data.url }));
        setSuccessMsg('Logo uploaded! Click "Save All Settings" to apply it site-wide.');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        setErrorMsg(res.data.message || 'Logo upload failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Logo upload failed. Please try again.');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateSettings(form);
      if (res.data.success) {
        setSuccessMsg('Showroom profile and website settings saved successfully!');
        await fetchSettings(); // refresh context
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update showroom settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-black text-white">Showroom & Website Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Edit physical showroom details, contact numbers, opening hours, and homepage announcement banner.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Announcement Ticker Bar */}
          <div className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/30 space-y-2">
            <label className="font-extrabold text-white flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Top Website Announcement Ticker</span>
            </label>
            <p className="text-[11px] text-slate-400">
              This message appears at the very top banner of every page on the showroom website.
            </p>
            <input
              type="text"
              value={form.announcement_bar}
              onChange={(e) => setForm({ ...form, announcement_bar: e.target.value })}
              className="w-full bg-slate-950 text-xs text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Showroom Identity */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-400" />
              <span>Showroom Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Showroom Business Name</label>
                <input
                  type="text"
                  required
                  value={form.showroom_name}
                  onChange={(e) => setForm({ ...form, showroom_name: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Showroom Logo Upload */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="block font-semibold text-slate-300 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-brand-400" />
                <span>Showroom Logo</span>
              </label>
              <p className="text-[11px] text-slate-400">
                Displayed in the website header & footer next to the showroom name. Recommended: square PNG or SVG under 5MB.
              </p>

              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {form.logo_url ? (
                    <img src={form.logo_url} alt="Showroom logo preview" className="w-full h-full object-contain p-1.5" />
                  ) : (
                    <Image className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoSelect}
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>{form.logo_url ? 'Replace Logo' : 'Upload Logo'}</span>
                      </>
                    )}
                  </button>

                  {form.logo_url && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, logo_url: '' })}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 font-bold text-xs flex items-center gap-1.5 transition-colors w-full justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Numbers & WhatsApp */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-400" />
              <span>Phone Numbers & WhatsApp</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={form.phone_primary}
                  onChange={(e) => setForm({ ...form, phone_primary: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Secondary / Hotline</label>
                <input
                  type="text"
                  value={form.phone_secondary}
                  onChange={(e) => setForm({ ...form, phone_secondary: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">WhatsApp Number (with country code)</label>
                <input
                  type="text"
                  placeholder="e.g. 919840123456"
                  value={form.whatsapp_number}
                  onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-brand-400" />
              <span>Social Media Links</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Paste your showroom's profile URLs. The Instagram & Facebook icons in the website footer open these links in a new tab.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Instagram Profile URL</label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/your-showroom"
                  value={form.instagram_url || ''}
                  onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Facebook Page URL</label>
                <input
                  type="url"
                  placeholder="https://www.facebook.com/your-showroom"
                  value={form.facebook_url || ''}
                  onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Location & Timings */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>Showroom Address & Working Hours</span>
            </h3>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Physical Showroom Address</label>
              <textarea
                rows="2"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={form.opening_hours}
                  onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Google Maps Embed URL</label>
                <input
                  type="text"
                  placeholder="https://www.google.com/maps/embed?..."
                  value={form.google_maps_url}
                  onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-orange-500 text-white font-extrabold shadow-orange-glow hover:from-brand-500 hover:to-orange-400 transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
