import pg from 'pg';

// Un solo pool por proceso, también durante el recargado en desarrollo.
const pool = globalThis.__pgPool ?? new pg.Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== 'production') globalThis.__pgPool = pool;

export function query(text, params) {
  return pool.query(text, params);
}

// Corre fn con un cliente dentro de una transacción.
export async function transaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
