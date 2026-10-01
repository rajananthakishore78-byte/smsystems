import { supabase } from '../config/supabase.js';
import { fallbackDb } from '../database/fallbackDb.js';

export const getInquiries = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    const data = await fallbackDb.getInquiries();
    return res.json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createInquiry = async (req, res) => {
  try {
    const { name, customer_name, phone, customer_phone, email, customer_email, service_type, camera_count, product_name, message } = req.body;

    const leadData = {
      customer_name: customer_name || name,
      customer_phone: customer_phone || phone,
      customer_email: customer_email || email || '',
      service_type: service_type || 'Site Inspection',
      camera_count: camera_count || '4 Cameras',
      product_name: product_name || '',
      message: message || '',
      status: 'New'
    };

    if (!leadData.customer_name || !leadData.customer_phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and Phone number are required for quotation and inspection requests.'
      });
    }

    if (supabase) {
      const { data, error } = await supabase.from('inquiries').insert([leadData]).select();
      if (!error && data && data[0]) {
        return res.status(201).json({
          success: true,
          message: 'Thank you! Your CCTV inquiry has been received. Our showroom technician will contact you shortly.',
          data: data[0]
        });
      }
    }

    const created = await fallbackDb.createInquiry(leadData);
    return res.status(201).json({
      success: true,
      message: 'Thank you! Your CCTV inquiry has been received. Our showroom technician will contact you shortly.',
      data: created
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)
        .select();

      if (!error && data && data[0]) {
        return res.json({ success: true, data: data[0] });
      }
    }

    const updated = await fallbackDb.updateInquiryStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
