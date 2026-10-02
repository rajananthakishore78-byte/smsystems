import { store } from '../database/store.js';

export const getProducts = async (req, res) => {
  try {
    const { category, brand, search, featured, dealOfDay } = req.query;
    const data = await store.getProducts({ category, brand, search, featured, dealOfDay });
    return res.json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const data = await store.getProductById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'CCTV Product not found' });
    }
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.original_price || !body.offer_price) {
      return res.status(400).json({
        success: false,
        message: 'Name, original price, and offer price are required.'
      });
    }

    const original = parseFloat(body.original_price);
    const offer = parseFloat(body.offer_price);

    const newProd = {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: body.category || 'Bullet Cameras',
      brand: body.brand || 'Hikvision',
      original_price: original,
      offer_price: offer,
      discount_percent: original > 0 ? Math.round(((original - offer) / original) * 100) : 0,
      image_url: body.image_url || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      gallery: body.gallery || (body.image_url ? [body.image_url] : []),
      description: body.description || '',
      specs: typeof body.specs === 'object' ? body.specs : {},
      in_stock: body.in_stock !== false,
      is_featured: !!body.is_featured,
      is_deal_of_day: !!body.is_deal_of_day
    };

    const created = await store.createProduct(newProd);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'A product with this slug already exists.' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await store.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found to update' });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Another product already uses this slug.' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await store.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found to delete' });
    }
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
