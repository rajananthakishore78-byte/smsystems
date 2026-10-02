import dotenv from 'dotenv';
import { fallbackDb } from './fallbackDb.js';
import { isPostgresConfigured, postgresDb, pool } from './postgresDb.js';

dotenv.config();

// Single entry point for every controller. When DATABASE_URL is present all reads
// and writes go to PostgreSQL; otherwise the in-memory demo store is used.
export const isPostgres = isPostgresConfigured;
export const dbMode = isPostgres ? 'postgres' : 'memory';
export const store = isPostgres ? postgresDb : fallbackDb;

// Boot-time probe so connection problems are visible immediately in the logs.
export const initDatabase = async () => {
  if (!isPostgres) {
    console.log('ℹ️ DATABASE_URL not set - using the in-memory demo store (writes are lost on restart).');
    return { mode: dbMode, connected: false };
  }

  // A cold DNS lookup can fail once on flaky networks, so retry briefly.
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const serverTime = await postgresDb.ping();
      console.log(`✅ PostgreSQL connected (${new URL(process.env.DATABASE_URL).host}) at ${serverTime.toISOString()}`);
      return { mode: dbMode, connected: true };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  console.error('❌ PostgreSQL connection failed:', lastError.message);
  console.error('   Requests will return errors until DATABASE_URL is reachable. Check the connection string / SSL mode.');
  return { mode: dbMode, connected: false, error: lastError.message };
};

export const checkDatabase = async () => {
  if (!isPostgres) return { mode: 'memory', connected: true, persistent: false };
  try {
    await postgresDb.ping();
    return { mode: 'postgres', connected: true, persistent: true };
  } catch (error) {
    return { mode: 'postgres', connected: false, persistent: true, error: error.message };
  }
};

export const closeDatabase = async () => {
  if (pool) await pool.end();
};
