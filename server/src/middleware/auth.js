import { isAdminEmail, isSupabaseAuthConfigured, verifySupabaseToken } from '../config/supabaseAuth.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const masterKey = process.env.ADMIN_SECRET_KEY;
    const adminKey = req.headers['x-admin-key'];

    // 1. Break-glass key for server-side scripts and curl. It lives only in
    // server/.env and is never shipped to the browser.
    if (masterKey && adminKey && adminKey === masterKey) {
      req.user = { role: 'admin', method: 'admin-key' };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: sign in to the admin portal or provide the admin key.'
      });
    }

    if (!isSupabaseAuthConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Supabase Auth is not configured on the server (set SUPABASE_URL and SUPABASE_JWKS_URL).'
      });
    }

    // 2. Supabase Auth session JWT, verified locally against the project JWKS.
    let payload;
    try {
      payload = await verifySupabaseToken(authHeader.slice('Bearer '.length).trim());
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please sign in again.',
        error: err.code || err.message
      });
    }

    // 3. A valid Supabase login is not automatically an admin.
    if (!isAdminEmail(payload.email)) {
      return res.status(403).json({
        success: false,
        message: 'This account is not authorized for the showroom admin portal.'
      });
    }

    req.user = { id: payload.sub, email: payload.email, role: 'admin', method: 'supabase-jwt' };
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication check failed',
      error: error.message
    });
  }
};
