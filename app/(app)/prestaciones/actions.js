'use server';

import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { parseAmount } from '@/lib/money';

export async function saveService(_prev, formData) {
  await requireUser();
  const id = Number(formData.get('id')) || null;
  const values = {
    name: String(formData.get('name') || '').trim(),
    price: String(formData.get('price') || '').trim(),
    active: formData.get('active') === 'on',
  };
  const price = parseAmount(values.price);
  if (!values.name) return { error: 'Escribí el nombre de la prestación.', values };
  if (price == null || price < 0) return { error: 'Escribí el precio en pesos, por ejemplo 18000.', values };

  if (id) {
    await query('UPDATE services SET name = $1, price = $2, active = $3 WHERE id = $4', [values.name, price, values.active, id]);
  } else {
    await query('INSERT INTO services (name, price) VALUES ($1, $2)', [values.name, price]);
  }
  redirect('/prestaciones');
}
