'use server';

import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { query } from '@/lib/db';

function read(formData) {
  return {
    name: String(formData.get('name') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    active: formData.get('active') === 'on',
  };
}

export async function saveProfessional(_prev, formData) {
  await requireUser();
  const id = Number(formData.get('id')) || null;
  const values = read(formData);
  if (!values.name) return { error: 'Escribí el nombre del kinesiólogo.', values };

  if (id) {
    await query('UPDATE professionals SET name = $1, phone = $2, active = $3 WHERE id = $4', [
      values.name, values.phone || null, values.active, id,
    ]);
  } else {
    await query('INSERT INTO professionals (name, phone) VALUES ($1, $2)', [values.name, values.phone || null]);
  }
  redirect('/kinesiologos');
}
