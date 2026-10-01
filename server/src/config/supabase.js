import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase Client initialized successfully with PostgreSQL connection.');
  } catch (err) {
    console.warn('⚠️ Supabase initialization failed, running with local in-memory PostgreSQL fallback:', err.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not provided in .env - running with local PostgreSQL fallback store.');
}

export { supabase };
