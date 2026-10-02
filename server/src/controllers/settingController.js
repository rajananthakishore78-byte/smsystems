import { store } from '../database/store.js';

export const getSettings = async (req, res) => {
  try {
    const data = await store.getSettings();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const data = await store.updateSettings(req.body);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
