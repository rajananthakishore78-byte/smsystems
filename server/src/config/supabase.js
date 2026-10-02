import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;

// New-style Supabase keys (sb_secret_ / sb_publishable_) with fallbacks to the
// legacy service_role / anon keys used by older projects.
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
const serverKey = secretKey || publicKey;

let supabase = null;
let supabaseKeyType = null;

if (supabaseUrl && serverKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, serverKey);
    supabaseKeyType = secretKey ? 'secret' : 'publishable';
    console.log(`✅ Supabase client initialized with the ${supabaseKeyType} key (Storage / Auth / REST available).`);
  } catch (err) {
    console.warn('⚠️ Supabase initialization failed:', err.message);
  }
} else {
  console.log('ℹ️ Supabase REST keys not configured - the API uses the direct PostgreSQL connection only.');
}

// Client built with the browser-safe key, for public data only.
const supabasePublic = supabaseUrl && publicKey ? createClient(supabaseUrl, publicKey) : null;

export { supabase, supabasePublic, supabaseKeyType };
