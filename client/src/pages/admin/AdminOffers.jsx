import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, X, CheckCircle2, Sparkles, Loader2, Upload } from 'lucide-react';
import { getOffers, createOffer, updateOffer, deleteOffer, uploadImage } from '../../api/client.js';

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    discount_text: '',
    coupon_code: '',
    banner_image_url: '',
    is_active: true
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const res = await getOffers();
      if (res.data.success) {
        setOffers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingOffer(null);
    setForm({
      title: '',
      subtitle: '',
      discount_text: 'Flat 30% OFF',
      coupon_code: '',
      banner_image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      is_active: true
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (off) => {
    setEditingOffer(off);
    setForm({
      title: off.title,
      subtitle: off.subtitle || '',
      discount_text: off.discount_text || '',
      coupon_code: off.coupon_code || '',
      banner_image_url: off.banner_image_url || '',
      is_active: off.is_active !== false
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      if (res.data.success && res.data.url) {
        setForm(prev => ({ ...prev, banner_image_url: res.data.url }));
      }
    } catch (err) {
      setErrorMsg('Banner upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      setErrorMsg('Please specify an offer title.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      if (editingOffer) {
        const res = await updateOffer(editingOffer.id, form);
        if (res.data.success) {
          setOffers(prev => prev.map(o => o.id === editingOffer.id ? res.data.data : o));
          setModalOpen(false);
        }
      } else {
        const res = await createOffer(form);
        if (res.data.success) {
          setOffers(prev => [res.data.data, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving offer banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete offer "${title}"?`)) return;
    try {
      const res = await deleteOffer(id);
      if (res.data.success) {
        setOffers(prev => prev.filter(o => o.id !== id));
      }
    } catch (err) {
      alert('Failed to delete offer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Promotional Offers & Banners</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create festive discounts, seasonal bundles, and banner announcements displayed across the website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-orange-glow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Promotional Offer</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-brand-500/20 text-brand-400 border border-brand-500/30 px-2 py-0.5 rounded-md">
                    {offer.discount_text || "Deal"}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    offer.is_active 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {offer.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{offer.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{offer.subtitle}</p>

                {offer.coupon_code && (
                  <p className="text-xs font-mono text-amber-300 bg-slate-950 p-2 rounded-lg border border-slate-800 inline-block">
                    PROMO: {offer.coupon_code}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(offer)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(offer.id, offer.title)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-1">
              {editingOffer ? 'Edit Promotional Offer' : 'Create New Promotional Offer'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Configure promotional text, coupon code, and active display state.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali & Festive Security Bonanza"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Offer Subtitle / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Upgrade family and showroom safety with 5MP CCTV kits"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Discount Tag Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 35% OFF + Free 1TB HDD"
                    value={form.discount_text}
                    onChange={(e) => setForm({ ...form, discount_text: e.target.value })}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Promo Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. FESTIVE35"
                    value={form.coupon_code}
                    onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Banner Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={form.banner_image_url}
                    onChange={(e) => setForm({ ...form, banner_image_url: e.target.value })}
                    className="flex-1 bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                  />
                  <label className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer flex items-center gap-1 font-semibold flex-shrink-0">
                    <Upload className="w-3.5 h-3.5 text-brand-400" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="accent-brand-500 rounded"
                  />
                  <span className="font-semibold text-slate-300">Active (Display live on website)</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-orange-500 text-white font-extrabold shadow-orange-glow flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingOffer ? 'Update Offer' : 'Publish Offer'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
