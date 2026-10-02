import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../api/client.js';

const InquiryContext = createContext();

export const InquiryProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    showroom_name: "SM SYSTEMS",
    logo_url: "",
    tagline: "Premier CCTV Camera Showroom & Certified Surveillance Installation Center",
    phone_primary: "+91 98401 23456",
    phone_secondary: "+91 94440 98765",
    whatsapp_number: "919840123456",
    email: "sales@smsystems.in",
    address: "Showroom No. 18, Orange Square, Ring Road Junction, Anna Nagar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    opening_hours: "Mon - Sat: 9:00 AM - 9:00 PM | Sun: 10:00 AM - 6:00 PM",
    announcement_bar: "⚡ Exclusive Showroom Offer: Get FREE On-Site Site Survey & 2-Year Replacement Warranty on all 4K CCTV setups!",
    instagram_url: "",
    facebook_url: ""
  });

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      if (res.data.success && res.data.data) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.warn("Could not fetch showroom settings, using defaults:", err.message);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const openQuoteModal = (product = null) => {
    setSelectedProduct(product);
    setQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setSelectedProduct(null);
    setQuoteModalOpen(false);
  };

  // Helper for generating direct WhatsApp inquiry link
  const getWhatsAppLink = (product = null) => {
    const phone = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '919840123456';
    let text = `Hello ${settings.showroom_name}! I am visiting your website and interested in your CCTV cameras & security services.`;
    if (product) {
      text = `Hello ${settings.showroom_name}! I am interested in *${product.name}* (Offer Price: ₹${product.offer_price?.toLocaleString('en-IN')}). Can you please share showroom demo availability and installation quote?`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <InquiryContext.Provider
      value={{
        settings,
        fetchSettings,
        quoteModalOpen,
        selectedProduct,
        openQuoteModal,
        closeQuoteModal,
        getWhatsAppLink
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiry = () => useContext(InquiryContext);
