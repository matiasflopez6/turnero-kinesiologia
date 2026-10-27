'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { FINDINGS, ZONES } from '@/lib/body';
import { isValidDate } from '@/lib/agenda';

function readEva(value) {
  if (value === '' || value == null) return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 10 ? n : undefined;
}

export async function saveFinding(_prev, formData) {
  await requireUser();
  const patientId = Number(formData.get('patient_id'));
  const zone = String(formData.get('zone') || '');
  const finding = String(formData.get('finding') || '');
  const eva = readEva(formData.get('eva'));
  const notes = String(formData.get('notes') || '').trim();

  if (!ZONES[zone]) return { error: 'Elegí una zona en el mapa.', zone };
  if (!FINDINGS[finding]) return { error: 'Elegí qué encontraste en la zona.', zone };
  if (eva === undefined) return { error: 'La EVA va de 0 a 10.', zone };

  await query(
    `INSERT INTO body_findings (patient_id, zone, finding, eva, notes) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (patient_id, zone, finding) DO UPDATE SET eva = $4, notes = $5, updated_at = now()`,
    [patientId, zone, finding, eva, notes || null]
  );
  revalidatePath(`/pacientes/${patientId}`);
  return { ok: `Hallazgo guardado: ${FINDINGS[finding].toLowerCase()} en ${ZONES[zone].toLowerCase()}.`, zone };
}

export async function removeFinding(formData) {
  await requireUser();
  const patientId = Number(formData.get('patient_id'));
  await query('DELETE FROM body_findings WHERE id = $1 AND patient_id = $2', [Number(formData.get('id')), patientId]);
  revalidatePath(`/pacientes/${patientId}`);
}

export async function resetMap(formData) {
  await requireUser();
  const patientId = Number(formData.get('patient_id'));
  await query('DELETE FROM body_findings WHERE patient_id = $1', [patientId]);
  revalidatePath(`/pacientes/${patientId}`);
}

export async function saveNote(_prev, formData) {
  const user = await requireUser();
  const patientId = Number(formData.get('patient_id'));
  const values = {
    note_date: String(formData.get('note_date') || ''),
    kind: String(formData.get('kind') || 'sesion'),
    professional_id: String(formData.get('professional_id') || ''),
    zone: String(formData.get('zone') || ''),
    eva: String(formData.get('eva') ?? ''),
    body: String(formData.get('body') || '').trim(),
  };
  const eva = readEva(values.eva);

  if (!isValidDate(values.note_date)) return { error: 'Elegí la fecha de la sesión.', values };
  if (!['evaluacion', 'sesion'].includes(values.kind)) return { error: 'Elegí si es evaluación o sesión.', values };
  if (values.zone && !ZONES[values.zone]) return { error: 'Elegí una zona de la lista.', values };
  if (eva === undefined) return { error: 'La EVA va de 0 a 10.', values };
  if (!values.body) return { error: 'Escribí qué se hizo en la sesión.', values };

  await query(
    `INSERT INTO clinical_notes (patient_id, professional_id, note_date, kind, zone, eva, body, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [patientId, Number(values.professional_id) || null, values.note_date, values.kind, values.zone || null, eva, values.body, user.id]
  );
  revalidatePath(`/pacientes/${patientId}`);
  return { ok: 'Sesión guardada.', key: Date.now() };
}

export async function removeNote(formData) {
  await requireUser();
  const patientId = Number(formData.get('patient_id'));
  await query('DELETE FROM clinical_notes WHERE id = $1 AND patient_id = $2', [Number(formData.get('id')), patientId]);
  revalidatePath(`/pacientes/${patientId}`);
}
