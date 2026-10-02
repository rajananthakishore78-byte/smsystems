import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Users, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Camera, 
  ShieldCheck, 
  Cloud 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout() {
  const { adminUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products & Pricing', path: '/admin/products', icon: Package },
    { name: 'Offers & Banners', path: '/admin/offers', icon: Tag },
    { name: 'Customer Inquiries', path: '/admin/inquiries', icon: Users },
    { name: 'Showroom Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-orange-400 flex items-center justify-center text-white shadow-orange-glow">
                <Camera className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">SM <span className="text-brand-500">SYSTEMS</span></span>
                <p className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">Admin Portal</p>
              </div>
            </Link>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const active = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);

              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-brand-600 text-white shadow-orange-glow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Logged In As</p>
            <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">
              {adminUser?.email || 'admin@smsystems.in'}
            </p>
            <span className="text-[10px] inline-block mt-1 font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Full Administrator
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Showroom</span>
            </Link>

            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-1 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
