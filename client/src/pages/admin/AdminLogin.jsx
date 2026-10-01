import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Lock, KeyRound, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAuthStatus } from '../../api/client.js';

export default function AdminLogin() {
  const { loginWithPasscode, loginWithFirebase, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState('passcode'); // 'passcode' or 'firebase'
  const [passcode, setPasscode] = useState('cctv_admin_secure_2026');
  const [email, setEmail] = useState('admin@securevisioncctv.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cloudStatus, setCloudStatus] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
    // Check cloud services status
    getAuthStatus()
      .then((res) => setCloudStatus(res.data.services))
      .catch(() => {});
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (authMode === 'passcode') {
        const res = await loginWithPasscode(passcode, email);
        if (res.success) {
          navigate('/admin');
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = await loginWithFirebase(email, password);
        if (res.success) {
          navigate('/admin');
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient orange glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-orange-400 mx-auto flex items-center justify-center text-white shadow-orange-glow">
            <Camera className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Showroom Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Secure management console for products, offers, pricing & inquiries.
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('passcode')}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'passcode'
                ? 'bg-brand-600 text-white shadow-orange-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin Passcode
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('firebase')}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'firebase'
                ? 'bg-brand-600 text-white shadow-orange-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Firebase Auth
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'passcode' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email (Label)</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Master Admin Passcode</label>
                  <span className="text-[11px] text-amber-400 font-medium">Default: cctv_admin_secure_2026</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter admin passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Firebase Admin Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Firebase Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-brand-600 to-orange-500 text-white shadow-orange-glow hover:from-brand-500 hover:to-orange-400 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Integration Status Badges */}
        {cloudStatus && (
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Connected Services:</p>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold text-center">
              <div className={`p-1.5 rounded-lg border ${cloudStatus.supabase ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                Supabase
              </div>
              <div className={`p-1.5 rounded-lg border ${cloudStatus.cloudinary ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                Cloudinary
              </div>
              <div className={`p-1.5 rounded-lg border ${cloudStatus.firebase ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                Firebase
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
