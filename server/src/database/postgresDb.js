import pg from 'pg';
import dotenv from 'dotenv';
import { defaultSettings } from './seedData.js';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

// BigDECIMAL/numeric columns (prices) come back from pg as strings, which would
// break the client's currency formatting. Parse them as numbers instead.
pg.types.setTypeParser(1700, (value) => (value === null ? null : parseFloat(value)));

// Managed Postgres (Supabase, Neon, Railway, ...) requires SSL; a local server
// usually does not, so decide from the host unless DATABASE_SSL is explicit.
const resolveSsl = (connStr) => {
  if (process.env.DATABASE_SSL === 'false') return false;
  if (process.env.DATABASE_SSL === 'true') return { rejectUnauthorized: false };
  try {
    const host = new URL(connStr).hostname;
    return host === 'localhost' || host === '127.0.0.1' ? false : { rejectUnauthorized: false };
  } catch {
    return false;
  }
};

export const isPostgresConfigured = Boolean(connectionString);

export const pool = isPostgresConfigured
  ? new pg.Pool({
      connectionString,
      ssl: resolveSsl(connectionString),
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000
    })
  : null;

if (pool) {
  // A dropped idle connection must never crash the API process.
  pool.on('error', (err) => {
    console.error('⚠️ PostgreSQL idle client error:', err.message);
  });
}

// Whitelisted columns per table: protects queries from arbitrary column names.
const PRODUCT_COLUMNS = [
  'name', 'slug', 'category', 'brand', 'original_price', 'offer_price', 'discount_percent',
  'image_url', 'gallery', 'description', 'specs', 'in_stock', 'is_featured', 'is_deal_of_day'
];
const OFFER_COLUMNS = [
  'title', 'subtitle', 'discount_text', 'banner_image_url', 'coupon_code', 'badge_color',
  'is_active', 'valid_until'
];
const INQUIRY_COLUMNS = [
  'customer_name', 'customer_phone', 'customer_email', 'service_type', 'camera_count',
  'product_name', 'message', 'status'
];
const SETTING_COLUMNS = [
  'showroom_name', 'logo_url', 'tagline', 'phone_primary', 'phone_secondary', 'whatsapp_number',
  'email', 'address', 'city', 'state', 'pincode', 'google_maps_url', 'opening_hours',
  'announcement_bar'
];

export const TABLE_COLUMNS = {
  products: PRODUCT_COLUMNS,
  offers: OFFER_COLUMNS,
  inquiries: INQUIRY_COLUMNS,
  showroom_settings: SETTING_COLUMNS
};

const query = (sql, params = []) => pool.query(sql, params);

const normalizeValue = (column, value) => {
  if (column === 'specs') {
    return typeof value === 'string' ? value : JSON.stringify(value || {});
  }
  if (column === 'gallery') {
    return Array.isArray(value) ? value : value ? [value] : [];
  }
  if (column === 'valid_until') {
    return value || null;
  }
  return value;
};

export const buildInsert = (table, columns, data) => {
  const entries = columns
    .filter((column) => data[column] !== undefined)
    .map((column) => [column, normalizeValue(column, data[column])]);

  if (entries.length === 0) {
    throw new Error(`No valid ${table} fields provided`);
  }

  const params = entries.map(([, value]) => value);
  const names = entries.map(([column]) => column);
  const placeholders = entries.map(([column], index) => (column === 'specs' ? `$${index + 1}::jsonb` : `$${index + 1}`));

  return {
    sql: `INSERT INTO ${table} (${names.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
    params
  };
};

const buildUpdate = (table, columns, data) => {
  const entries = columns
    .filter((column) => data[column] !== undefined)
    .map((column) => [column, normalizeValue(column, data[column])]);

  if (entries.length === 0) return null;

  const params = entries.map(([, value]) => value);
  const assignments = entries.map(([column], index) => `${column} = $${index + 1}${column === 'specs' ? '::jsonb' : ''}`);

  return { assignments, params };
};

export const postgresDb = {
  // --- HEALTH ---
  async ping() {
    const { rows } = await query('SELECT NOW() AS server_time');
    return rows[0].server_time;
  },

  // --- PRODUCTS ---
  async getProducts({ category, brand, search, featured, dealOfDay } = {}) {
    const where = [];
    const params = [];

    if (category && category !== 'All') {
      params.push(`%${category}%`);
      where.push(`category ILIKE $${params.length}`);
    }
    if (brand && brand !== 'All') {
      params.push(`%${brand}%`);
      where.push(`brand ILIKE $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      where.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length} OR brand ILIKE $${params.length} OR category ILIKE $${params.length})`);
    }
    if (featured === 'true' || featured === true) {
      where.push('is_featured = true');
    }
    if (dealOfDay === 'true' || dealOfDay === true) {
      where.push('is_deal_of_day = true');
    }

    const sql = `SELECT * FROM products${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC`;
    const { rows } = await query(sql, params);
    return rows;
  },

  async getProductById(id) {
    const { rows } = await query('SELECT * FROM products WHERE id::text = $1 OR slug = $1 LIMIT 1', [id]);
    return rows[0] || null;
  },

  async createProduct(data) {
    const original = parseFloat(data.original_price) || 0;
    const offer = parseFloat(data.offer_price) || original;
    const { sql, params } = buildInsert('products', PRODUCT_COLUMNS, {
      ...data,
      discount_percent: original > 0 ? Math.round(((original - offer) / original) * 100) : 0
    });
    const { rows } = await query(sql, params);
    return rows[0];
  },

  async updateProduct(id, data) {
    const update = buildUpdate('products', PRODUCT_COLUMNS, data);
    if (!update) return this.getProductById(id);

    const params = [...update.params, id];
    const { rows } = await query(
      `UPDATE products SET ${update.assignments.join(', ')}, updated_at = NOW() WHERE id::text = $${params.length} RETURNING *`,
      params
    );
    return rows[0] || null;
  },

  async deleteProduct(id) {
    const { rowCount } = await query('DELETE FROM products WHERE id::text = $1', [id]);
    return rowCount > 0;
  },

  // --- OFFERS ---
  async getOffers({ activeOnly = false } = {}) {
    const sql = `SELECT * FROM offers${activeOnly ? ' WHERE is_active = true' : ''} ORDER BY created_at DESC`;
    const { rows } = await query(sql);
    return rows;
  },

  async createOffer(data) {
    const { sql, params } = buildInsert('offers', OFFER_COLUMNS, data);
    const { rows } = await query(sql, params);
    return rows[0];
  },

  async updateOffer(id, data) {
    const update = buildUpdate('offers', OFFER_COLUMNS, data);
    if (!update) return null;

    const params = [...update.params, id];
    const { rows } = await query(
      `UPDATE offers SET ${update.assignments.join(', ')} WHERE id::text = $${params.length} RETURNING *`,
      params
    );
    return rows[0] || null;
  },

  async deleteOffer(id) {
    const { rowCount } = await query('DELETE FROM offers WHERE id::text = $1', [id]);
    return rowCount > 0;
  },

  // --- INQUIRIES ---
  async getInquiries() {
    const { rows } = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
    return rows;
  },

  async createInquiry(data) {
    const { sql, params } = buildInsert('inquiries', INQUIRY_COLUMNS, { status: 'New', ...data });
    const { rows } = await query(sql, params);
    return rows[0];
  },

  async updateInquiryStatus(id, status) {
    const { rows } = await query(
      'UPDATE inquiries SET status = $1 WHERE id::text = $2 RETURNING *',
      [status, id]
    );
    return rows[0] || null;
  },

  // --- SHOWROOM SETTINGS ---
  async getSettings() {
    const { rows } = await query('SELECT * FROM showroom_settings ORDER BY id ASC LIMIT 1');
    if (rows[0]) return rows[0];

    const { sql, params } = buildInsert('showroom_settings', SETTING_COLUMNS, defaultSettings);
    const created = await query(sql, params);
    return created.rows[0];
  },

  async updateSettings(data) {
    const current = await this.getSettings();
    const update = buildUpdate('showroom_settings', SETTING_COLUMNS, data);
    if (!update) return current;

    const params = [...update.params, current.id];
    const { rows } = await query(
      `UPDATE showroom_settings SET ${update.assignments.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`,
      params
    );
    return rows[0] || current;
  }
};
