import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Upload, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Tag, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../../api/client.js';

export default function AdminProducts() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [form, setForm] = useState({
    name: '',
    category: 'Bullet Cameras',
    brand: 'Hikvision',
    original_price: '',
    offer_price: '',
    image_url: '',
    description: '',
    resolution: '',
    night_vision: '',
    audio: '',
    weatherproof: '',
    warranty: '2 Years Comprehensive',
    in_stock: true,
    is_featured: false,
    is_deal_of_day: false
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
    if (searchParams.get('action') === 'new') {
      openAddModal();
    }
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: 'Bullet Cameras',
      brand: 'Hikvision',
      original_price: '',
      offer_price: '',
      image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      description: '',
      resolution: '5MP (2560 x 1944)',
      night_vision: 'ColorVu 24/7 Color 30m',
      audio: 'Built-in Mic',
      weatherproof: 'IP67 Weatherproof',
      warranty: '2 Years Comprehensive On-Site',
      in_stock: true,
      is_featured: false,
      is_deal_of_day: false
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      category: prod.category || 'Bullet Cameras',
      brand: prod.brand || 'Hikvision',
      original_price: prod.original_price,
      offer_price: prod.offer_price,
      image_url: prod.image_url || '',
      description: prod.description || '',
      resolution: prod.specs?.resolution || '',
      night_vision: prod.specs?.night_vision || '',
      audio: prod.specs?.audio || '',
      weatherproof: prod.specs?.weatherproof || '',
      warranty: prod.specs?.warranty || '2 Years Comprehensive',
      in_stock: prod.in_stock !== false,
      is_featured: !!prod.is_featured,
      is_deal_of_day: !!prod.is_deal_of_day
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  // Cloudinary image upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    setErrorMsg('');

    try {
      const res = await uploadImage(file);
      if (res.data.success && res.data.url) {
        setForm(prev => ({ ...prev, image_url: res.data.url }));
      } else {
        setErrorMsg('Image upload failed: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      setErrorMsg('Image upload error: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.original_price || !form.offer_price) {
      setErrorMsg('Please specify product name, original price, and offer price.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    const payload = {
      name: form.name,
      category: form.category,
      brand: form.brand,
      original_price: parseFloat(form.original_price),
      offer_price: parseFloat(form.offer_price),
      image_url: form.image_url,
      description: form.description,
      specs: {
        resolution: form.resolution,
        night_vision: form.night_vision,
        audio: form.audio,
        weatherproof: form.weatherproof,
        warranty: form.warranty
      },
      in_stock: form.in_stock,
      is_featured: form.is_featured,
      is_deal_of_day: form.is_deal_of_day
    };

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, payload);
        if (res.data.success) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data.data : p));
          setModalOpen(false);
        }
      } else {
        const res = await createProduct(payload);
        if (res.data.success) {
          setProducts(prev => [res.data.data, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving CCTV product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the showroom catalog?`)) {
      return;
    }
    try {
      const res = await deleteProduct(id);
      if (res.data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Discount % live calculator
  const original = parseFloat(form.original_price) || 0;
  const offer = parseFloat(form.offer_price) || 0;
  const computedDiscount = original > 0 && offer > 0 ? Math.round(((original - offer) / original) * 100) : 0;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Product & Pricing Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Add CCTV cameras, edit live offer prices, upload high-res images to Cloudinary, and toggle featured deals.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-orange-glow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New CCTV Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search products by model or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 px-3 py-2.5 rounded-xl focus:outline-none focus:border-brand-500 w-full sm:w-auto"
        >
          <option value="All">All Categories</option>
          <option value="Bullet Cameras">Bullet Cameras</option>
          <option value="Dome Cameras">Dome Cameras</option>
          <option value="PTZ Cameras">PTZ Cameras</option>
          <option value="Wireless Smart Cameras">Wireless Smart Cameras</option>
          <option value="Complete Packages">Complete Packages</option>
          <option value="DVR & NVR Kits">DVR & NVR Kits</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Brand</th>
                  <th className="py-3 px-4 font-semibold">MRP</th>
                  <th className="py-3 px-4 font-semibold">Offer Price</th>
                  <th className="py-3 px-4 font-semibold">Discount</th>
                  <th className="py-3 px-4 font-semibold">Badges</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt=""
                          className="w-10 h-10 rounded-lg object-contain bg-slate-950 p-1 border border-slate-800 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-500">{p.in_stock ? 'In Stock' : 'Out of Stock'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{p.category}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        {p.brand}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 line-through">
                      ₹{Number(p.original_price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-black text-brand-400">
                      ₹{Number(p.offer_price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {p.discount_percent}% OFF
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {p.is_featured && (
                          <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        {p.is_deal_of_day && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                            Deal
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit details & price"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-1">
              {editingProduct ? 'Edit CCTV Product Details & Pricing' : 'Add New CCTV Product to Catalog'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Update pricing, specifications, and upload images to Cloudinary.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Title / Model Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hikvision 5MP ColorVu Audio Bullet Camera"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Bullet Cameras">Bullet Cameras (Outdoor)</option>
                    <option value="Dome Cameras">Dome Cameras (Ceiling/Indoor)</option>
                    <option value="PTZ Cameras">PTZ Cameras (360° Speed Dome)</option>
                    <option value="Wireless Smart Cameras">Wireless Smart Cameras (WiFi/4G)</option>
                    <option value="Complete Packages">Complete Packages (Turnkey Kits)</option>
                    <option value="DVR & NVR Kits">DVR & NVR Kits</option>
                    <option value="Accessories">Accessories & Hard Drives</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hikvision, Dahua, CP Plus"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Pricing & Offer Section */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-brand-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-brand-400" />
                    <span>Showroom Pricing & Offers</span>
                  </span>
                  {computedDiscount > 0 && (
                    <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      🔥 Live Savings: {computedDiscount}% OFF
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Original Price / MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4999"
                      value={form.original_price}
                      onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                      className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Showroom Offer Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 3299"
                      value={form.offer_price}
                      onChange={(e) => setForm({ ...form, offer_price: e.target.value })}
                      className="w-full bg-slate-900 text-brand-400 font-bold p-2.5 rounded-xl border border-brand-500/50 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cloudinary Image Upload Section */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-300">Product Image (Cloudinary Upload / URL)</label>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  {/* Image Preview */}
                  <div className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {form.image_url ? (
                      <img src={form.image_url} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImg}
                        className="px-4 py-2 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2"
                      >
                        {uploadingImg ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading to Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-brand-400" />
                            <span>Upload Image (Cloudinary)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      className="w-full bg-slate-950 text-slate-200 p-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Description</label>
                <textarea
                  rows="2"
                  placeholder="Key selling points, aperture details, lens specifications, surveillance applications..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                ></textarea>
              </div>

              {/* Technical Specifications */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">Technical Specifications</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Resolution</label>
                    <input
                      type="text"
                      placeholder="e.g. 5MP 2560x1944 or 4K 8MP"
                      value={form.resolution}
                      onChange={(e) => setForm({ ...form, resolution: e.target.value })}
                      className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Night Vision</label>
                    <input
                      type="text"
                      placeholder="e.g. ColorVu 24/7 Color 40m"
                      value={form.night_vision}
                      onChange={(e) => setForm({ ...form, night_vision: e.target.value })}
                      className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Audio</label>
                    <input
                      type="text"
                      placeholder="e.g. Built-in Mic / 2-Way Audio"
                      value={form.audio}
                      onChange={(e) => setForm({ ...form, audio: e.target.value })}
                      className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Weatherproof Rating</label>
                    <input
                      type="text"
                      placeholder="e.g. IP67 Waterproof Metal"
                      value={form.weatherproof}
                      onChange={(e) => setForm({ ...form, weatherproof: e.target.value })}
                      className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                    className="accent-brand-500 rounded"
                  />
                  <span className="font-semibold text-slate-300">In Stock</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="accent-brand-500 rounded"
                  />
                  <span className="font-semibold text-slate-300">Featured</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_deal_of_day}
                    onChange={(e) => setForm({ ...form, is_deal_of_day: e.target.checked })}
                    className="accent-brand-500 rounded"
                  />
                  <span className="font-semibold text-slate-300">Deal of Day</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-orange-500 text-white font-extrabold shadow-orange-glow hover:from-brand-500 hover:to-orange-400 transition-all flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingProduct ? 'Save Product Changes' : 'Publish Product to Showroom'}</span>
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
