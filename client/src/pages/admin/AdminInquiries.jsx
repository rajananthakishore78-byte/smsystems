import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, MessageCircle, Clock, CheckCircle2, Search, Filter } from 'lucide-react';
import { getInquiries, updateInquiryStatus } from '../../api/client.js';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await getInquiries();
      if (res.data.success) {
        setInquiries(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const filtered = inquiries.filter(i => {
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchesSearch = 
      i.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.customer_phone?.includes(search) ||
      i.service_type?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Leads & Quote Requests</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inquiries submitted by website visitors requesting quotes, site surveys, or camera demos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Total Leads:</span>
          <span className="text-xs font-black text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
            {inquiries.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by customer name, phone number, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 px-3 py-2.5 rounded-xl focus:outline-none focus:border-brand-500 w-full sm:w-auto"
        >
          <option value="All">All Statuses</option>
          <option value="New">New Leads Only</option>
          <option value="Contacted">Contacted</option>
          <option value="Survey Scheduled">Survey Scheduled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Leads Found</h3>
          <p className="text-xs text-slate-400">Try changing your search term or status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => (
            <div
              key={lead.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white">{lead.customer_name}</h3>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    {new Date(lead.created_at).toLocaleString()}
                  </span>
                  {lead.product_name && (
                    <span className="text-[11px] font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full">
                      Product: {lead.product_name}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-400" />
                    <a href={`tel:${lead.customer_phone}`} className="font-mono text-brand-400 hover:underline">
                      {lead.customer_phone}
                    </a>
                  </div>

                  {lead.customer_email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.customer_email}</span>
                    </div>
                  )}

                  <div className="text-slate-400">
                    <span className="font-semibold text-slate-300">Type:</span> {lead.service_type}
                  </div>

                  <div className="text-slate-400">
                    <span className="font-semibold text-slate-300">Cameras:</span> {lead.camera_count}
                  </div>
                </div>

                {lead.message && (
                  <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    "{lead.message}"
                  </p>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800 flex-shrink-0">
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                  className={`text-xs font-bold rounded-xl px-3 py-2 border focus:outline-none ${
                    lead.status === 'New'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : lead.status === 'Contacted'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      : lead.status === 'Survey Scheduled'
                      ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Survey Scheduled">Survey Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>

                <a
                  href={`https://wa.me/${lead.customer_phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.customer_name)},%20this%20is%20SM%20SYSTEMS%20CCTV%20Showroom%20following%20up%20on%20your%20security%20quote%20request.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`tel:${lead.customer_phone}`}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-400" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
