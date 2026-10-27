import 'server-only';
import { query } from './db';

const QUOTE_SELECT = `
  SELECT q.id, q.patient_id, q.status, q.discount_pct, to_char(q.valid_until, 'YYYY-MM-DD') AS valid_until, q.notes,
         q.created_at, t.subtotal, t.total, p.first_name, p.last_name, p.dni, p.health_plan
    FROM quotes q
    JOIN quote_totals t ON t.quote_id = q.id
    JOIN patients p ON p.id = q.patient_id`;

export async function getQuote(id) {
  const { rows } = await query(`${QUOTE_SELECT} WHERE q.id = $1`, [Number(id) || 0]);
  if (!rows[0]) return null;
  const { rows: items } = await query(
    'SELECT id, service_id, description, zone, sessions, unit_price FROM quote_items WHERE quote_id = $1 ORDER BY id',
    [rows[0].id]
  );
  return { ...rows[0], items };
}

export async function listQuotes({ patientId, status } = {}) {
  const { rows } = await query(
    `${QUOTE_SELECT}
      WHERE ($1::int IS NULL OR q.patient_id = $1) AND ($2::text IS NULL OR q.status = $2)
      ORDER BY q.created_at DESC LIMIT 200`,
    [patientId ?? null, status ?? null]
  );
  return rows;
}

export async function listPayments({ patientId, from } = {}) {
  const { rows } = await query(
    `SELECT pay.id, pay.patient_id, to_char(pay.paid_on, 'YYYY-MM-DD') AS paid_on, pay.amount, pay.method, pay.notes,
            p.first_name, p.last_name
       FROM payments pay JOIN patients p ON p.id = pay.patient_id
      WHERE ($1::int IS NULL OR pay.patient_id = $1) AND ($2::date IS NULL OR pay.paid_on >= $2)
      ORDER BY pay.paid_on DESC, pay.id DESC LIMIT 200`,
    [patientId ?? null, from ?? null]
  );
  return rows;
}

export async function patientBalance(patientId) {
  const { rows } = await query('SELECT charged, paid FROM patient_balances WHERE patient_id = $1', [patientId]);
  const b = rows[0] ?? { charged: 0, paid: 0 };
  return { charged: Number(b.charged), paid: Number(b.paid), due: Number(b.charged) - Number(b.paid) };
}

export async function activeServices() {
  const { rows } = await query('SELECT id, name, price FROM services WHERE active ORDER BY name');
  return rows;
}
