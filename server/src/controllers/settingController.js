import { supabase } from '../config/supabase.js';
import { fallbackDb } from '../database/fallbackDb.js';

export const getSettings = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('showroom_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();

      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    const data = await fallbackDb.getSettings();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const body = req.body;

    if (supabase) {
      const { data, error } = await supabase
        .from('showroom_settings')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', 1)
        .select();

      if (!error && data && data[0]) {
        return res.json({ success: true, data: data[0] });
      }
    }

    const updated = await fallbackDb.updateSettings(body);
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
