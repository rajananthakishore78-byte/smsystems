import { store } from '../database/store.js';

export const getOffers = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const data = await store.getOffers({ activeOnly: activeOnly === 'true' });
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

    const created = await store.createOffer({
      title: body.title,
      subtitle: body.subtitle || '',
      discount_text: body.discount_text || '',
      banner_image_url: body.banner_image_url || '',
      coupon_code: body.coupon_code || '',
      badge_color: body.badge_color || 'orange',
      is_active: body.is_active !== false,
      valid_until: body.valid_until || null
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const updated = await store.updateOffer(req.params.id, req.body);
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
    const deleted = await store.deleteOffer(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    return res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
