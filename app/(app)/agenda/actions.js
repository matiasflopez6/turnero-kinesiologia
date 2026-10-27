'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { DAY_END, DAY_START, DURATIONS, isValidDate, localTime, minutesOf, toTimestamp } from '@/lib/agenda';

// Turnos activos de un kinesiólogo en un día, en minutos desde las 00:00.
export async function getBusy(professionalId, date, excludeId) {
  await requireUser();
  if (!isValidDate(date)) return [];
  const { rows } = await query(
    `SELECT starts_at, ends_at FROM appointments
      WHERE professional_id = $1 AND status <> 'cancelado' AND id <> $4
        AND starts_at < $3 AND ends_at > $2`,
    [Number(professionalId) || 0, toTimestamp(date, '00:00'), toTimestamp(date, '23:59'), Number(excludeId) || 0]
  );
  return rows.map((r) => [minutesOf(localTime(r.starts_at)), minutesOf(localTime(r.ends_at))]);
}

export async function saveAppointment(_prev, formData) {
  await requireUser();
  const id = Number(formData.get('id')) || null;
  const values = {
    patient_id: String(formData.get('patient_id') || ''),
    professional_id: String(formData.get('professional_id') || ''),
    date: String(formData.get('date') || ''),
    time: String(formData.get('time') || ''),
    duration: String(formData.get('duration') || ''),
    notes: String(formData.get('notes') || '').trim(),
  };

  if (!values.patient_id) return { error: 'Elegí el paciente.', values };
  if (!values.professional_id) return { error: 'Elegí el kinesiólogo.', values };
  if (!isValidDate(values.date)) return { error: 'Elegí la fecha del turno.', values };
  if (!/^\d{2}:\d{2}$/.test(values.time)) return { error: 'Elegí un horario libre.', values };
  const duration = Number(values.duration);
  if (!DURATIONS.includes(duration)) return { error: 'Elegí la duración del turno.', values };
  const start = minutesOf(values.time);
  if (start < DAY_START || start + duration > DAY_END) {
    return { error: 'El turno tiene que empezar y terminar dentro del horario del consultorio.', values };
  }

  const startsAt = toTimestamp(values.date, values.time);
  const endsAt = new Date(startsAt.getTime() + duration * 60000);
  const params = [Number(values.patient_id), Number(values.professional_id), startsAt, endsAt, values.notes || null];

  let appointmentId = id;
  try {
    if (id) {
      await query(
        `UPDATE appointments SET patient_id = $1, professional_id = $2, starts_at = $3, ends_at = $4, notes = $5,
                status = CASE WHEN starts_at <> $3 THEN 'sin_confirmar' ELSE status END,
                reminded_at = CASE WHEN starts_at <> $3 THEN NULL ELSE reminded_at END
          WHERE id = $6`,
        [...params, id]
      );
    } else {
      const { rows } = await query(
        `INSERT INTO appointments (patient_id, professional_id, starts_at, ends_at, notes)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        params
      );
      appointmentId = rows[0].id;
    }
  } catch (err) {
    if (err.code === '23P01') {
      return { error: 'Ese horario se pisa con otro turno del mismo kinesiólogo. Elegí otro horario.', values };
    }
    throw err;
  }
  redirect(`/agenda/${appointmentId}`);
}

export async function setStatus(formData) {
  await requireUser();
  const id = Number(formData.get('id'));
  const status = String(formData.get('status'));
  if (!['sin_confirmar', 'confirmado', 'cancelado'].includes(status)) return;
  try {
    await query('UPDATE appointments SET status = $1 WHERE id = $2', [status, id]);
  } catch (err) {
    // Reactivar un turno cancelado cuyo horario ya se ocupó.
    if (err.code === '23P01') redirect(`/agenda/${id}?error=ocupado`);
    throw err;
  }
  revalidatePath(`/agenda/${id}`);
}

export async function markReminded(id) {
  await requireUser();
  await query('UPDATE appointments SET reminded_at = now() WHERE id = $1', [Number(id)]);
  revalidatePath(`/agenda/${id}`);
  revalidatePath('/');
}
