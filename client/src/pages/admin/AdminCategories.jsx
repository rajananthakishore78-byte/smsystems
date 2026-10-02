import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, Plus, Pencil, Trash2, X, Save, Loader2, CheckCircle2, AlertCircle, Upload, Image, Eye, EyeOff } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, uploadImage } from '../../api/client.js';

const EMPTY_FORM = {
  name: '',
  icon_url: '',
  description: '',
  tagline: '',
  sort_order: 0,
  is_active: true
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, sort_order: categories.length + 1 });
    setErrorMsg('');
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name || '',
      icon_url: cat.icon_url || '',
      description: cat.description || '',
      tagline: cat.tagline || '',
      sort_order: cat.sort_order ?? 0,
      is_active: cat.is_active !== false
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please choose an image file (PNG, JPG or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Icon file must be smaller than 5MB.');
      return;
    }
    setUploading(true);
    setErrorMsg('');
    try {
      const res = await uploadImage(file);
      if (res.data.success && res.data.url) {
        setForm((prev) => ({ ...prev, icon_url: res.data.url }));
      } else {
        setErrorMsg(res.data.message || 'Icon upload failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Icon upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const payload = { ...form, name: form.name.trim(), sort_order: Number(form.sort_order) || 0 };
      if (editing) {
        await updateCategory(editing.id, payload);
        setSuccessMsg('Category updated successfully!');
      } else {
        await createCategory(payload);
        setSuccessMsg('Category added successfully!');
      }
      setShowForm(false);
      setEditing(null);
      await loadCategories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? Products already tagged with it keep working, but the homepage tile disappears.`)) return;
    try {
      await deleteCategory(cat.id);
      setSuccessMsg('Category deleted successfully!');
      await loadCategories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const toggleActive = async (cat) => {
    try {
      await updateCategory(cat.id, { is_active: !cat.is_active });
      await loadCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update category.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-brand-400" />
            Product Categories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            These tiles power the homepage "Browse By CCTV Category" grid. Clicking a tile opens Products & Deals filtered to that category.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-orange-500 text-white text-xs font-extrabold shadow-orange-glow hover:from-brand-500 hover:to-orange-400 transition-all flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
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
      ) : categories.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <LayoutGrid className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-white">No categories yet</p>
          <p className="text-xs text-slate-400">Add your first category tile to show it on the homepage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {cat.icon_url ? (
                  <img src={cat.icon_url} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-6 h-6 text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">{cat.name}</h3>
                  {!cat.is_active && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Hidden</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{cat.description || '—'}</p>
                <p className="text-[11px] text-brand-400 font-semibold truncate">{cat.tagline || '—'}</p>
                <p className="text-[10px] text-slate-500 mt-1">Order: {cat.sort_order ?? 0}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => toggleActive(cat)}
                    title={cat.is_active ? 'Hide from homepage' : 'Show on homepage'}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    {cat.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {cat.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="w-full max-w-lg my-8 p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white">
                {editing ? `Edit "${editing.name}"` : 'Add New Category'}
              </h2>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bullet Cameras"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Must exactly match the Category assigned to products for the tile click to filter them.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {form.icon_url ? (
                  <img src={form.icon_url} alt="Icon preview" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-7 h-7 text-slate-600" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{uploading ? 'Uploading...' : 'Upload Icon'}</span>
                </button>
                <input
                  type="url"
                  placeholder="Or paste image URL (https://...)"
                  value={form.icon_url}
                  onChange={(e) => setForm({ ...form, icon_url: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Description (under the name)</label>
              <input
                type="text"
                placeholder="e.g. Outdoor, IP67 Weatherproof, Night Vision"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tagline (small caption)</label>
                <input
                  type="text"
                  placeholder="e.g. Outdoor Security"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 accent-orange-600"
              />
              Show on homepage
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-orange-500 text-white text-xs font-extrabold shadow-orange-glow flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{editing ? 'Save Changes' : 'Add Category'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
