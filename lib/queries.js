import 'server-only';
import { query } from './db';
import { localDate, localTime, reminderText, toTimestamp, whatsappLink } from './agenda';

const CLINIC = () => process.env.CLINIC_NAME || 'el consultorio';

const APPOINTMENT_SELECT = `
  SELECT a.id, a.patient_id, a.professional_id, a.starts_at, a.ends_at, a.status, a.notes, a.reminded_at,
         p.first_name, p.last_name, p.phone, pr.name AS professional
    FROM appointments a
    JOIN patients p ON p.id = a.patient_id
    JOIN professionals pr ON pr.id = a.professional_id`;

// Suma al turno lo que las pantallas necesitan: fecha y hora locales y el link de WhatsApp.
function decorate(a) {
  const text = reminderText({ firstName: a.first_name, startsAt: a.starts_at, professional: a.professional, clinic: CLINIC() });
  return {
    ...a,
    date: localDate(a.starts_at),
    time: localTime(a.starts_at),
    end: localTime(a.ends_at),
    duration: Math.round((a.ends_at - a.starts_at) / 60000),
    whatsapp: whatsappLink(a.phone, text),
  };
}

export async function getAppointment(id) {
  const { rows } = await query(`${APPOINTMENT_SELECT} WHERE a.id = $1`, [Number(id) || 0]);
  return rows[0] ? decorate(rows[0]) : null;
}

export async function appointmentsForDay(date, { includeCancelled = false } = {}) {
  const { rows } = await query(
    `${APPOINTMENT_SELECT}
      WHERE a.starts_at >= $1 AND a.starts_at < $2 ${includeCancelled ? '' : "AND a.status <> 'cancelado'"}
      ORDER BY a.starts_at, pr.name`,
    [toTimestamp(date, '00:00'), toTimestamp(date, '23:59')]
  );
  return rows.map(decorate);
}

export async function appointmentsForPatient(patientId) {
  const { rows } = await query(`${APPOINTMENT_SELECT} WHERE a.patient_id = $1 ORDER BY a.starts_at DESC LIMIT 100`, [
    Number(patientId) || 0,
  ]);
  return rows.map(decorate);
}

export async function activeProfessionals() {
  const { rows } = await query('SELECT id, name FROM professionals WHERE active ORDER BY name');
  return rows;
}

export async function patientsForSelect() {
  const { rows } = await query('SELECT id, first_name, last_name, dni FROM patients ORDER BY lower(last_name), lower(first_name)');
  return rows;
}
