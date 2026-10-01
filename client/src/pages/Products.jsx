import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Camera
} from 'lucide-react';
import { getProducts } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductDetailModal from '../components/ProductDetailModal.jsx';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters state
  const categoryParam = searchParams.get('category') || 'All';
  const brandParam = searchParams.get('brand') || 'All';
  const queryParam = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'All',
    'Bullet Cameras',
    'Dome Cameras',
    'PTZ Cameras',
    'Wireless Smart Cameras',
    'Complete Packages',
    'DVR & NVR Kits',
    'Accessories'
  ];

  const brands = ['All', 'Hikvision', 'Dahua', 'CP Plus', 'Imou', 'Uniview', 'Western Digital'];

  useEffect(() => {
    fetchProducts();
  }, [categoryParam, brandParam, queryParam]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryParam !== 'All') params.category = categoryParam;
      if (brandParam !== 'All') params.brand = brandParam;
      if (queryParam) params.search = queryParam;

      const res = await getProducts(params);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleBrandChange = (brand) => {
    const newParams = new URLSearchParams(searchParams);
    if (brand === 'All') {
      newParams.delete('brand');
    } else {
      newParams.set('brand', brand);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val) => {
    const newParams = new URLSearchParams(searchParams);
    if (!val) {
      newParams.delete('search');
    } else {
      newParams.set('search', val);
    }
    setSearchParams(newParams);
  };

  // Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.offer_price - b.offer_price;
    if (sortBy === 'price-desc') return b.offer_price - a.offer_price;
    if (sortBy === 'discount') return (b.discount_percent || 0) - (a.discount_percent || 0);
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
            <Camera className="w-3.5 h-3.5" />
            <span>Showroom Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            CCTV Cameras, Kits & Accessories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {sortedProducts.length} verified surveillance products with showroom discount pricing.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
            <span>Sort by:</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-700 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-orange-500 shadow-xs"
          >
            <option value="featured">Featured & Recommended</option>
            <option value="discount">Highest Discount %</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Bars */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative max-w-lg">
          <input
            type="text"
            placeholder="Search by camera model, brand (Hikvision, Dahua), or specs (4K, ColorVu)..."
            value={queryParam}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const active = categoryParam.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  active
                    ? 'bg-brand-600 text-white shadow-orange-glow'
                    : 'bg-white text-slate-700 hover:bg-brand-50 hover:text-brand-600 border border-slate-200 shadow-xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Brand Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-500 font-semibold text-[11px] flex-shrink-0">Brand:</span>
          {brands.map((b) => {
            const active = brandParam.toLowerCase() === b.toLowerCase();
            return (
              <button
                key={b}
                onClick={() => handleBrandChange(b)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex-shrink-0 transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-700 border border-brand-300 font-bold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading showroom inventory...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Camera className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No CCTV Products Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any cameras matching your current search or category filter.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-500 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
