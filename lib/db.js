import pg from 'pg';

// Un solo pool por proceso, también durante el recargado en desarrollo.
const pool = globalThis.__pgPool ?? new pg.Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== 'production') globalThis.__pgPool = pool;

export function query(text, params) {
  return pool.query(text, params);
}
