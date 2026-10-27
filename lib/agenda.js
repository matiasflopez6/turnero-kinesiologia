// Fechas, horarios y textos de la agenda. El consultorio trabaja en hora de Argentina (UTC-3, sin horario de verano).
export const TZ = 'America/Argentina/Buenos_Aires';
const OFFSET = '-03:00';

export const DAY_START = 8 * 60; // 08:00
export const DAY_END = 20 * 60; // 20:00
export const SLOT_STEP = 15;
export const DURATIONS = [30, 45, 60, 90];
export const DEFAULT_DURATION = 45;

export const STATUS = {
  sin_confirmar: { label: 'Sin confirmar', badge: 'alert' },
  confirmado: { label: 'Confirmado', badge: 'gain' },
  cancelado: { label: 'Cancelado', badge: 'error' },
};

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function toTimestamp(date, time) {
  return new Date(`${date}T${time}:00${OFFSET}`);
}

function parts(d) {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(d));
  return Object.fromEntries(p.map((x) => [x.type, x.value]));
}

export function localDate(d) {
  const p = parts(d);
  return `${p.year}-${p.month}-${p.day}`;
}

export function localTime(d) {
  const p = parts(d);
  return `${p.hour}:${p.minute}`;
}

export function todayLocal() {
  return localDate(new Date());
}

export function isValidDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !Number.isNaN(new Date(`${s}T12:00:00Z`).getTime());
}

export function addDays(date, n) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// "Jueves 30/10"
export function formatDay(date) {
  const d = new Date(`${date}T12:00:00Z`);
  return `${DAYS[d.getUTCDay()]} ${date.slice(8, 10)}/${date.slice(5, 7)}`;
}

export function minutesOf(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function timeOf(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

// Teléfono argentino a formato internacional para WhatsApp: 11 2345 6789 → 5491123456789.
export function whatsappNumber(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('54')) {
    digits = digits.slice(2);
    if (digits.startsWith('9')) digits = digits.slice(1);
  }
  if (digits.startsWith('0')) digits = digits.slice(1);
  // Saca el 15 de celulares escritos a la antigua: código de área (2 a 4 cifras) + 15 + número.
  if (digits.length === 12) {
    const area = [2, 3, 4].find((n) => digits.slice(n, n + 2) === '15');
    if (area) digits = digits.slice(0, area) + digits.slice(area + 2);
  }
  return digits.length === 10 ? `549${digits}` : null;
}

export function reminderText({ firstName, startsAt, professional, clinic }) {
  const day = formatDay(localDate(startsAt));
  return (
    `Hola ${firstName}, te recordamos tu turno de kinesiología el ${day.toLowerCase()} a las ${localTime(startsAt)}` +
    ` con ${professional} en ${clinic}. Respondé este mensaje para confirmarlo o reprogramarlo.`
  );
}

export function whatsappLink(phone, text) {
  const number = whatsappNumber(phone);
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null;
}
