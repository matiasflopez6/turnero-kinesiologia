// Aplica el esquema y crea el primer administrador si la base está vacía.
import { readFile } from 'node:fs/promises';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

if (!DATABASE_URL) {
  console.error('Falta DATABASE_URL.');
  process.exit(1);
}

const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();

try {
  const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
  await client.query(schema);

  const { rows } = await client.query('SELECT count(*)::int AS n FROM users');
  if (rows[0].n === 0) {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn('La base no tiene usuarios. Definí ADMIN_EMAIL y ADMIN_PASSWORD para crear el primero.');
    } else {
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await client.query(
        'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3)',
        [ADMIN_EMAIL.trim().toLowerCase(), ADMIN_NAME || 'Administración', hash]
      );
      console.log(`Usuario administrador creado: ${ADMIN_EMAIL}`);
    }
  }
  console.log('Esquema aplicado.');
} finally {
  await client.end();
}
