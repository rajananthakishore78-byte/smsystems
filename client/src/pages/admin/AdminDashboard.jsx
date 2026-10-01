import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Tag, 
  Users, 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MessageCircle, 
  Database, 
  Cloud, 
  Flame, 
  CheckCircle2 
} from 'lucide-react';
import { getProducts, getOffers, getInquiries, getAuthStatus, updateInquiryStatus } from '../../api/client.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    offerCount: 0,
    inquiryCount: 0,
    newInquiryCount: 0
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [cloudStatus, setCloudStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [prodRes, offRes, inqRes, authRes] = await Promise.all([
        getProducts(),
        getOffers(),
        getInquiries(),
        getAuthStatus().catch(() => ({ data: { services: {} } }))
      ]);

      const products = prodRes.data.data || [];
      const offers = offRes.data.data || [];
      const inquiries = inqRes.data.data || [];

      setStats({
        productCount: products.length,
        offerCount: offers.length,
        inquiryCount: inquiries.length,
        newInquiryCount: inquiries.filter(i => i.status === 'New').length
      });

      setRecentInquiries(inquiries.slice(0, 5));
      setCloudStatus(authRes.data.services);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateInquiryStatus(id, newStatus);
      setRecentInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      if (newStatus !== 'New') {
        setStats(s => ({ ...s, newInquiryCount: Math.max(0, s.newInquiryCount - 1) }));
      }
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Showroom Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time management of CCTV hardware catalog, pricing, discounts, and customer inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products?action=new"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-orange-glow transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Camera / Kit</span>
          </Link>
          <Link
            to="/admin/offers"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Tag className="w-4 h-4 text-brand-400" />
            <span>Manage Offers</span>
          </Link>
        </div>
      </div>

      {/* Cloud Integration Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Full-Stack Cloud Infrastructure</h4>
            <p className="text-xs text-slate-400">PostgreSQL (Supabase) • Media CDN (Cloudinary) • Security (Firebase)</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${
            cloudStatus?.supabase 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>Supabase (Postgres): {cloudStatus?.supabase ? 'Live Connected' : 'Local Fallback'}</span>
          </div>

          <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${
            cloudStatus?.cloudinary 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>Cloudinary: {cloudStatus?.cloudinary ? 'Live Connected' : 'Auto Base64 Fallback'}</span>
          </div>

          <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${
            cloudStatus?.firebase 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>Firebase: {cloudStatus?.firebase ? 'Active' : 'Passcode Active'}</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/products"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 hover:shadow-orange-glow transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total CCTV Hardware</span>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.productCount}</span>
            <span className="text-xs text-brand-400 font-semibold">Active in Catalog</span>
          </div>
        </Link>

        <Link
          to="/admin/offers"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 hover:shadow-orange-glow transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Promo Deals</span>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.offerCount}</span>
            <span className="text-xs text-amber-400 font-semibold">Live on Homepage</span>
          </div>
        </Link>

        <Link
          to="/admin/inquiries"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 hover:shadow-orange-glow transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">New Leads to Call</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{stats.newInquiryCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Pending Follow-up</span>
          </div>
        </Link>

        <Link
          to="/admin/inquiries"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 hover:shadow-orange-glow transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Customer Inquiries</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.inquiryCount}</span>
            <span className="text-xs text-emerald-400 font-semibold">Quotes Generated</span>
          </div>
        </Link>
      </div>

      {/* Recent Leads Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Recent Customer Quote Requests & Leads</h3>
          </div>
          <Link
            to="/admin/inquiries"
            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No customer inquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Phone / WhatsApp</th>
                  <th className="pb-3 font-semibold">Service Type</th>
                  <th className="pb-3 font-semibold">Cameras</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-white">
                      {inq.customer_name}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`tel:${inq.customer_phone}`} 
                          className="font-mono text-brand-400 hover:underline"
                        >
                          {inq.customer_phone}
                        </a>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">{inq.service_type}</td>
                    <td className="py-3 text-slate-400">{inq.camera_count}</td>
                    <td className="py-3">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                          inq.status === 'New' 
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : inq.status === 'Contacted'
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Survey Scheduled">Survey Scheduled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={`https://wa.me/${inq.customer_phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.customer_name)},%20this%20is%20SM%20SYSTEMS%20CCTV%20Showroom%20regarding%20your%20security%20quote%20request.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
