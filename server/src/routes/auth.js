import express from 'express';
import { supabase } from '../config/supabase.js';
import { isFirebaseConfigured } from '../config/firebase.js';
import { dbMode, isPostgres } from '../database/store.js';
import { adminEmails, describeAuthMode, isAdminEmail, isSupabaseAuthConfigured } from '../config/supabaseAuth.js';

const router = express.Router();

const sessionPayload = (session, user) => ({
  token: session.access_token,
  refreshToken: session.refresh_token,
  expiresAt: session.expires_at,
  user: {
    id: user.id,
    email: user.email,
    role: 'admin',
    name: user.user_metadata?.full_name || 'Showroom Administrator'
  }
});

// Admin sign-in through Supabase Auth. The API verifies the returned JWT on
// every protected request, so no shared passcode ever reaches the browser.
router.post('/login', async (req, res) => {
  try {
    const { email, password, passcode } = req.body || {};

    // Passcode fallback only exists for local setups without Supabase Auth.
    if (!isSupabaseAuthConfigured) {
      const masterKey = process.env.ADMIN_SECRET_KEY;
      if (passcode && masterKey && passcode === masterKey) {
        return res.json({
          success: true,
          mode: 'passcode',
          token: masterKey,
          user: { email: email || 'admin@smsystems.in', role: 'admin', name: 'Showroom Administrator' }
        });
      }
      return res.status(503).json({
        success: false,
        message: 'Supabase Auth is not configured on the server. Set SUPABASE_URL and SUPABASE_JWKS_URL.'
      });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin email and password are required.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.session) {
      return res.status(401).json({ success: false, message: error?.message || 'Sign in failed.' });
    }

    if (!isAdminEmail(data.user.email)) {
      return res.status(403).json({
        success: false,
        message: `The account ${data.user.email} is not authorized for the showroom admin portal.`
      });
    }

    return res.json({ success: true, mode: 'supabase', ...sessionPayload(data.session, data.user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Exchanges a refresh token for a fresh access token so an admin who stays on
// the dashboard is not signed out every hour.
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'refreshToken is required.' });
    }
    if (!isSupabaseAuthConfigured) {
      return res.status(503).json({ success: false, message: 'Supabase Auth is not configured on the server.' });
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data?.session) {
      return res.status(401).json({ success: false, message: error?.message || 'Session refresh failed.' });
    }

    if (!isAdminEmail(data.user?.email)) {
      return res.status(403).json({ success: false, message: 'This account is not authorized for the showroom admin portal.' });
    }

    return res.json({ success: true, ...sessionPayload(data.session, data.user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Public status endpoint used by the login screen to show which services are live.
router.get('/status', (req, res) => {
  return res.json({
    success: true,
    services: {
      database: dbMode,
      postgres: isPostgres,
      supabaseAuth: isSupabaseAuthConfigured,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
      firebase: isFirebaseConfigured
    },
    auth: { mode: describeAuthMode(), adminCount: adminEmails.length }
  });
});

export default router;
