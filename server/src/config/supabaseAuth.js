import { createRemoteJWKSet, jwtVerify } from 'jose';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const jwksUrl = process.env.SUPABASE_JWKS_URL;
const issuer = supabaseUrl ? `${supabaseUrl}/auth/v1` : null;

// Supabase Auth issues asymmetric (ES256/RS256) tokens, so the API can verify
// them locally against the project's public JWKS endpoint - no shared secret.
export const isSupabaseAuthConfigured = Boolean(jwksUrl && issuer);

// Comma separated allowlist: only these accounts may use the admin portal.
// Supabase allows public sign-ups, so a valid JWT alone is not enough.
export const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email) =>
  Boolean(email) && adminEmails.includes(String(email).trim().toLowerCase());

let jwks = null;

const getJwks = () => {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(jwksUrl), {
      cooldownDuration: 30000,
      cacheMaxAge: 10 * 60 * 1000
    });
  }
  return jwks;
};

export const verifySupabaseToken = async (token) => {
  const { payload } = await jwtVerify(token, getJwks(), {
    issuer,
    audience: 'authenticated'
  });
  return payload;
};

export const describeAuthMode = () => {
  if (!isSupabaseAuthConfigured) return 'passcode';
  if (adminEmails.length === 0) return 'supabase-no-admins';
  return 'supabase';
};

if (isSupabaseAuthConfigured && adminEmails.length === 0) {
  console.warn('⚠️ Supabase Auth is configured but ADMIN_EMAILS is empty - no account can access the admin portal.');
}
