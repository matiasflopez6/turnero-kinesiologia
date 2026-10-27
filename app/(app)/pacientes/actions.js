'use server';

import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { isValidDate, whatsappNumber } from '@/lib/agenda';

const FIELDS = ['first_name', 'last_name', 'dni', 'phone', 'email', 'birth_date', 'health_plan', 'notes'];

export async function savePatient(_prev, formData) {
  await requireUser();
  const id = Number(formData.get('id')) || null;
  const values = Object.fromEntries(FIELDS.map((f) => [f, String(formData.get(f) || '').trim()]));

  if (!values.first_name || !values.last_name) return { error: 'Escribí el nombre y el apellido.', values };
  if (values.phone && !whatsappNumber(values.phone)) {
    return { error: 'Escribí el teléfono con código de área, sin 0 ni 15. Por ejemplo: 11 2345 6789.', values };
  }
  if (values.birth_date && !isValidDate(values.birth_date)) return { error: 'Revisá la fecha de nacimiento.', values };

  const params = FIELDS.map((f) => values[f] || null);
  let patientId = id;
  if (id) {
    await query(
      `UPDATE patients SET first_name = $1, last_name = $2, dni = $3, phone = $4, email = $5,
              birth_date = $6, health_plan = $7, notes = $8 WHERE id = $9`,
      [...params, id]
    );
  } else {
    const { rows } = await query(
      `INSERT INTO patients (${FIELDS.join(', ')}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      params
    );
    patientId = rows[0].id;
  }
  redirect(`/pacientes/${patientId}`);
}
