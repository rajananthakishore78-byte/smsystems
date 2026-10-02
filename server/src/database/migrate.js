// Applies schema.sql to the database in DATABASE_URL and seeds the showroom
// catalog on first run. Usage: npm run db:setup   (from the server folder)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildInsert, isPostgresConfigured, pool, TABLE_COLUMNS } from './postgresDb.js';
import { defaultOffers, defaultProducts, defaultSettings, defaultCategories } from './seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Seed records carry demo ids / timestamps that PostgreSQL generates for us.
const stripGenerated = ({ id, created_at, updated_at, ...rest }) => rest;

const seedTable = async (table, rows) => {
  const { rows: [{ count }] } = await pool.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
  if (count > 0) {
    console.log(`↩️  ${table}: ${count} existing row(s), seeding skipped.`);
    return;
  }

  for (const row of rows) {
    const { sql, params } = buildInsert(table, TABLE_COLUMNS[table], stripGenerated(row));
    await pool.query(sql, params);
  }
  console.log(`✅ ${table}: seeded ${rows.length} row(s).`);
};

const run = async () => {
  if (!isPostgresConfigured) {
    console.error('❌ DATABASE_URL is not set in server/.env - nothing to migrate.');
    process.exit(1);
  }

  const target = new URL(process.env.DATABASE_URL);
  console.log(`🔌 Target database: ${target.hostname}:${target.port || 5432}${target.pathname}`);

  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schemaSql);
  console.log('✅ schema.sql applied (tables + indexes verified).');

  await seedTable('showroom_settings', [defaultSettings]);
  await seedTable('products', defaultProducts);
  await seedTable('offers', defaultOffers);
  await seedTable('categories', defaultCategories);

  await pool.end();
  console.log('🎉 Database is ready.');
};

run().catch(async (error) => {
  console.error('❌ Migration failed:', error.message);
  await pool.end().catch(() => {});
  process.exit(1);
});
