import { supabase } from '../config/supabase.js';
import { fallbackDb } from '../database/fallbackDb.js';

export const getProducts = async (req, res) => {
  try {
    const { category, brand, search, featured, dealOfDay } = req.query;

    if (supabase) {
      let query = supabase.from('products').select('*');

      if (category && category !== 'All') {
        query = query.ilike('category', `%${category}%`);
      }
      if (brand && brand !== 'All') {
        query = query.ilike('brand', `%${brand}%`);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`);
      }
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }
      if (dealOfDay === 'true') {
        query = query.eq('is_deal_of_day', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
      // If table empty or error, fallback seamlessly
    }

    const data = await fallbackDb.getProducts({ category, brand, search, featured, dealOfDay });
    return res.json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();

      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    const data = await fallbackDb.getProductById(id);
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
    const discount = original > 0 ? Math.round(((original - offer) / original) * 100) : 0;

    const newProd = {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: body.category || 'Bullet Cameras',
      brand: body.brand || 'Hikvision',
      original_price: original,
      offer_price: offer,
      discount_percent: discount,
      image_url: body.image_url || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      gallery: body.gallery || (body.image_url ? [body.image_url] : []),
      description: body.description || '',
      specs: typeof body.specs === 'object' ? body.specs : {},
      in_stock: body.in_stock !== false,
      is_featured: !!body.is_featured,
      is_deal_of_day: !!body.is_deal_of_day
    };

    if (supabase) {
      const { data, error } = await supabase.from('products').insert([newProd]).select();
      if (!error && data && data[0]) {
        return res.status(201).json({ success: true, data: data[0] });
      }
    }

    const created = await fallbackDb.createProduct(newProd);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (!error && data && data[0]) {
        return res.json({ success: true, data: data[0] });
      }
    }

    const updated = await fallbackDb.updateProduct(id, body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found to update' });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        return res.json({ success: true, message: 'Product deleted successfully' });
      }
    }

    const deleted = await fallbackDb.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found to delete' });
    }
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
