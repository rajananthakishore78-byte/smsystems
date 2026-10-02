import { defaultProducts, defaultOffers, defaultSettings, defaultInquiries, defaultCategories } from './seedData.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory data store for turnkey local operation before / alongside Supabase
class FallbackDb {
  constructor() {
    this.products = [...defaultProducts];
    this.offers = [...defaultOffers];
    this.settings = { ...defaultSettings };
    this.inquiries = [...defaultInquiries];
    this.categories = [...defaultCategories];
  }

  // --- PRODUCTS ---
  async getProducts({ category, brand, search, featured, dealOfDay } = {}) {
    let result = [...this.products];
    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (brand && brand !== 'All') {
      result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    if (featured === 'true' || featured === true) {
      result = result.filter(p => p.is_featured);
    }
    if (dealOfDay === 'true' || dealOfDay === true) {
      result = result.filter(p => p.is_deal_of_day);
    }
    return result;
  }

  async getProductById(id) {
    return this.products.find(p => p.id === id || p.slug === id) || null;
  }

  async createProduct(data) {
    const original = parseFloat(data.original_price) || 0;
    const offer = parseFloat(data.offer_price) || original;
    const discount = original > 0 ? Math.round(((original - offer) / original) * 100) : 0;

    const newProduct = {
      id: `prod-${uuidv4().slice(0, 8)}`,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: data.category || 'Bullet Cameras',
      brand: data.brand || 'Hikvision',
      original_price: original,
      offer_price: offer,
      discount_percent: discount,
      image_url: data.image_url || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      gallery: data.gallery || [data.image_url],
      description: data.description || '',
      specs: typeof data.specs === 'object' ? data.specs : {},
      in_stock: data.in_stock !== false,
      is_featured: !!data.is_featured,
      is_deal_of_day: !!data.is_deal_of_day,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id, data) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const existing = this.products[idx];
    const original = data.original_price !== undefined ? parseFloat(data.original_price) : existing.original_price;
    const offer = data.offer_price !== undefined ? parseFloat(data.offer_price) : existing.offer_price;
    const discount = original > 0 ? Math.round(((original - offer) / original) * 100) : 0;

    const updated = {
      ...existing,
      ...data,
      original_price: original,
      offer_price: offer,
      discount_percent: discount,
      updated_at: new Date().toISOString()
    };
    this.products[idx] = updated;
    return updated;
  }

  async deleteProduct(id) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // --- OFFERS ---
  async getOffers({ activeOnly = false } = {}) {
    if (activeOnly) {
      return this.offers.filter(o => o.is_active);
    }
    return [...this.offers];
  }

  async createOffer(data) {
    const newOffer = {
      id: `offer-${uuidv4().slice(0, 8)}`,
      title: data.title,
      subtitle: data.subtitle || '',
      discount_text: data.discount_text || '',
      banner_image_url: data.banner_image_url || '',
      coupon_code: data.coupon_code || '',
      badge_color: data.badge_color || 'orange',
      is_active: data.is_active !== false,
      valid_until: data.valid_until || null,
      created_at: new Date().toISOString()
    };
    this.offers.unshift(newOffer);
    return newOffer;
  }

  async updateOffer(id, data) {
    const idx = this.offers.findIndex(o => o.id === id);
    if (idx === -1) return null;
    this.offers[idx] = { ...this.offers[idx], ...data };
    return this.offers[idx];
  }

  async deleteOffer(id) {
    const idx = this.offers.findIndex(o => o.id === id);
    if (idx === -1) return false;
    this.offers.splice(idx, 1);
    return true;
  }

  // --- INQUIRIES ---
  async getInquiries() {
    return [...this.inquiries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async createInquiry(data) {
    const newInquiry = {
      id: `inq-${uuidv4().slice(0, 8)}`,
      customer_name: data.customer_name || data.name,
      customer_phone: data.customer_phone || data.phone,
      customer_email: data.customer_email || data.email || '',
      service_type: data.service_type || 'Site Inspection',
      camera_count: data.camera_count || '4 Cameras',
      product_name: data.product_name || '',
      message: data.message || '',
      status: 'New',
      created_at: new Date().toISOString()
    };
    this.inquiries.unshift(newInquiry);
    return newInquiry;
  }

  async updateInquiryStatus(id, status) {
    const inq = this.inquiries.find(i => i.id === id);
    if (!inq) return null;
    inq.status = status;
    return inq;
  }

  // --- SHOWROOM SETTINGS ---
  async getSettings() {
    return { ...this.settings };
  }

  async updateSettings(data) {
    this.settings = { ...this.settings, ...data, updated_at: new Date().toISOString() };
    return { ...this.settings };
  }

  // --- CATEGORIES ---
  async getCategories({ activeOnly = false } = {}) {
    const rows = [...this.categories].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    if (activeOnly) return rows.filter(c => c.is_active);
    return rows;
  }

  async getCategoryById(id) {
    return this.categories.find(c => c.id === id) || null;
  }

  async createCategory(data) {
    const maxOrder = this.categories.reduce((m, c) => Math.max(m, c.sort_order || 0), 0);
    const newCategory = {
      id: `cat-${uuidv4().slice(0, 8)}`,
      name: data.name,
      icon_url: data.icon_url || '',
      description: data.description || '',
      tagline: data.tagline || '',
      sort_order: data.sort_order !== undefined ? Number(data.sort_order) : maxOrder + 1,
      is_active: data.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id, data) {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...data, updated_at: new Date().toISOString() };
    return this.categories[idx];
  }

  async deleteCategory(id) {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.categories.splice(idx, 1);
    return true;
  }
}

export const fallbackDb = new FallbackDb();
