import { store } from '../database/store.js';

export const getCategories = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const data = await store.getCategories({ activeOnly: activeOnly === 'true' });
    return res.json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const data = await store.getCategoryById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name?.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const created = await store.createCategory({
      name: body.name.trim(),
      icon_url: body.icon_url || '',
      description: body.description || '',
      tagline: body.tagline || '',
      sort_order: body.sort_order !== undefined ? Number(body.sort_order) : undefined,
      is_active: body.is_active !== false
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    const status = error.code === '23505' ? 409 : 500;
    const message = error.code === '23505'
      ? 'A category with this name already exists.'
      : error.message;
    return res.status(status).json({ success: false, message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updated = await store.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    const status = error.code === '23505' ? 409 : 500;
    const message = error.code === '23505'
      ? 'A category with this name already exists.'
      : error.message;
    return res.status(status).json({ success: false, message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await store.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
