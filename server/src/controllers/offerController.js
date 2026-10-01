import { supabase } from '../config/supabase.js';
import { fallbackDb } from '../database/fallbackDb.js';

export const getOffers = async (req, res) => {
  try {
    const { activeOnly } = req.query;

    if (supabase) {
      let query = supabase.from('offers').select('*');
      if (activeOnly === 'true') {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    const data = await fallbackDb.getOffers({ activeOnly: activeOnly === 'true' });
    return res.json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createOffer = async (req, res) => {
  try {
    const body = req.body;
    if (!body.title) {
      return res.status(400).json({ success: false, message: 'Offer title is required.' });
    }

    const newOffer = {
      title: body.title,
      subtitle: body.subtitle || '',
      discount_text: body.discount_text || '',
      banner_image_url: body.banner_image_url || '',
      coupon_code: body.coupon_code || '',
      badge_color: body.badge_color || 'orange',
      is_active: body.is_active !== false,
      valid_until: body.valid_until || null
    };

    if (supabase) {
      const { data, error } = await supabase.from('offers').insert([newOffer]).select();
      if (!error && data && data[0]) {
        return res.status(201).json({ success: true, data: data[0] });
      }
    }

    const created = await fallbackDb.createOffer(newOffer);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (supabase) {
      const { data, error } = await supabase
        .from('offers')
        .update(body)
        .eq('id', id)
        .select();

      if (!error && data && data[0]) {
        return res.json({ success: true, data: data[0] });
      }
    }

    const updated = await fallbackDb.updateOffer(id, body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (!error) {
        return res.json({ success: true, message: 'Offer deleted successfully' });
      }
    }

    const deleted = await fallbackDb.deleteOffer(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    return res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
