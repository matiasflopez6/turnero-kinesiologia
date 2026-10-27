'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { query, transaction } from '@/lib/db';
import { isValidDate } from '@/lib/agenda';
import { ZONES } from '@/lib/body';
import { parseAmount } from '@/lib/money';

export async function saveQuote(_prev, formData) {
  await requireUser();
  const id = Number(formData.get('id')) || null;
  const values = {
    patient_id: String(formData.get('patient_id') || ''),
    discount_pct: String(formData.get('discount_pct') || '0'),
    valid_until: String(formData.get('valid_until') || ''),
    notes: String(formData.get('notes') || '').trim(),
    items: String(formData.get('items') || '[]'),
  };

  let items;
  try {
    items = JSON.parse(values.items);
  } catch {
    items = [];
  }
  items = items
    .map((i) => ({
      service_id: Number(i.service_id) || null,
      description: String(i.description || '').trim(),
      zone: ZONES[i.zone] ? i.zone : null,
      sessions: Number(i.sessions),
      unit_price: parseAmount(i.unit_price),
    }))
    .filter((i) => i.description || i.unit_price);

  const discount = parseAmount(values.discount_pct) ?? 0;
  if (!values.patient_id) return { error: 'Elegí el paciente.', values };
  if (items.length === 0) return { error: 'Agregá al menos una prestación.', values };
  if (items.some((i) => !i.description)) return { error: 'Cada línea necesita una descripción.', values };
  if (items.some((i) => !Number.isInteger(i.sessions) || i.sessions < 1)) return { error: 'Las sesiones tienen que ser 1 o más.', values };
  if (items.some((i) => i.unit_price == null || i.unit_price < 0)) return { error: 'Revisá los precios: van en pesos, por ejemplo 18000.', values };
  if (discount < 0 || discount > 100) return { error: 'El descuento va de 0 a 100 %.', values };
  if (values.valid_until && !isValidDate(values.valid_until)) return { error: 'Revisá la fecha de validez.', values };

  const quoteId = await transaction(async (db) => {
    let qid = id;
    if (id) {
      const { rowCount } = await db.query(
        `UPDATE quotes SET patient_id = $1, discount_pct = $2, valid_until = $3, notes = $4 WHERE id = $5 AND status = 'pendiente'`,
        [Number(values.patient_id), discount, values.valid_until || null, values.notes || null, id]
      );
      if (rowCount === 0) return null;
      await db.query('DELETE FROM quote_items WHERE quote_id = $1', [id]);
    } else {
      const { rows } = await db.query(
        `INSERT INTO quotes (patient_id, discount_pct, valid_until, notes) VALUES ($1, $2, $3, $4) RETURNING id`,
        [Number(values.patient_id), discount, values.valid_until || null, values.notes || null]
      );
      qid = rows[0].id;
    }
    for (const i of items) {
      await db.query(
        `INSERT INTO quote_items (quote_id, service_id, description, zone, sessions, unit_price) VALUES ($1, $2, $3, $4, $5, $6)`,
        [qid, i.service_id, i.description, i.zone, i.sessions, i.unit_price]
      );
    }
    return qid;
  });

  if (!quoteId) return { error: 'Este presupuesto ya fue aceptado o rechazado y no se puede editar.', values };
  redirect(`/presupuestos/${quoteId}`);
}

export async function setQuoteStatus(formData) {
  await requireUser();
  const id = Number(formData.get('id'));
  const status = String(formData.get('status'));
  if (!['pendiente', 'aceptado', 'rechazado'].includes(status)) return;
  await query('UPDATE quotes SET status = $1 WHERE id = $2', [status, id]);
  revalidatePath(`/presupuestos/${id}`);
}

export async function deleteQuote(formData) {
  await requireUser();
  const { rows } = await query(`DELETE FROM quotes WHERE id = $1 AND status <> 'aceptado' RETURNING patient_id`, [
    Number(formData.get('id')),
  ]);
  redirect(rows[0] ? `/pacientes/${rows[0].patient_id}?tab=cuenta` : '/presupuestos');
}
