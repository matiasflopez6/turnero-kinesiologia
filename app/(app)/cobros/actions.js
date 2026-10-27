'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { isValidDate } from '@/lib/agenda';
import { METHODS, parseAmount } from '@/lib/money';

export async function savePayment(_prev, formData) {
  await requireUser();
  const values = {
    patient_id: String(formData.get('patient_id') || ''),
    paid_on: String(formData.get('paid_on') || ''),
    amount: String(formData.get('amount') || ''),
    method: String(formData.get('method') || ''),
    notes: String(formData.get('notes') || '').trim(),
  };
  const amount = parseAmount(values.amount);
  if (!values.patient_id) return { error: 'Elegí el paciente.', values };
  if (!isValidDate(values.paid_on)) return { error: 'Elegí la fecha del cobro.', values };
  if (!amount || amount <= 0) return { error: 'Escribí el monto en pesos, por ejemplo 18000.', values };
  if (!METHODS[values.method]) return { error: 'Elegí el medio de pago.', values };

  await query('INSERT INTO payments (patient_id, paid_on, amount, method, notes) VALUES ($1, $2, $3, $4, $5)', [
    Number(values.patient_id), values.paid_on, amount, values.method, values.notes || null,
  ]);
  redirect(`/pacientes/${values.patient_id}?tab=cuenta`);
}

export async function deletePayment(formData) {
  await requireUser();
  const patientId = Number(formData.get('patient_id'));
  await query('DELETE FROM payments WHERE id = $1 AND patient_id = $2', [Number(formData.get('id')), patientId]);
  revalidatePath(`/pacientes/${patientId}`);
  revalidatePath('/cobros');
}
