import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import QuoteModal from './components/QuoteModal.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Customer Pages
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminOffers from './pages/admin/AdminOffers.jsx';
import AdminInquiries from './pages/admin/AdminInquiries.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 selection:bg-brand-600 selection:text-white">
      {/* Show Public Header/Footer only when not in admin dashboard */}
      {!isAdminPath && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Showroom Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Console */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
      <QuoteModal />
    </div>
  );
}
