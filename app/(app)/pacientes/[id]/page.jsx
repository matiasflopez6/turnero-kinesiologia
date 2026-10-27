import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { appointmentsForPatient } from '@/lib/queries';
import { formatDay } from '@/lib/agenda';
import ReminderButton from '@/components/ReminderButton';
import StatusBadge from '@/components/StatusBadge';

export const metadata = { title: 'Paciente' };

function age(birth) {
  if (!birth) return null;
  const b = new Date(birth);
  const now = new Date();
  let years = now.getFullYear() - b.getFullYear();
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) years -= 1;
  return years;
}

export default async function PacientePage({ params }) {
  const { id } = await params;
  const { rows } = await query('SELECT * FROM patients WHERE id = $1', [Number(id) || 0]);
  const p = rows[0];
  if (!p) notFound();
  const appointments = await appointmentsForPatient(p.id);
  const now = new Date();
  const upcoming = appointments.filter((a) => a.starts_at >= now && a.status !== 'cancelado').reverse();
  const past = appointments.filter((a) => !(a.starts_at >= now && a.status !== 'cancelado'));
  const years = age(p.birth_date);

  return (
    <>
      <div>
        <Link href="/pacientes" className="back">Pacientes</Link>
        <div className="page-head">
          <h1 className="heading">{p.first_name} {p.last_name}</h1>
          <Link href={`/agenda/nuevo?paciente=${p.id}`} className="mfl-btn mfl-btn--primary">Agendar turno</Link>
        </div>
      </div>

      <section className="mfl-card">
        <dl className="facts">
          <div><dt>Celular</dt><dd className="mfl-num">{p.phone || 'Sin cargar'}</dd></div>
          <div><dt>DNI</dt><dd className="mfl-num">{p.dni || 'Sin cargar'}</dd></div>
          <div><dt>Cobertura</dt><dd>{p.health_plan || 'Particular'}</dd></div>
          <div><dt>Edad</dt><dd className="mfl-num">{years != null ? `${years} años` : 'Sin cargar'}</dd></div>
          {p.email && <div><dt>Email</dt><dd>{p.email}</dd></div>}
        </dl>
        {p.notes && <p className="muted">{p.notes}</p>}
        <Link href={`/pacientes/${p.id}/editar`} className="mfl-btn mfl-btn--ghost mfl-btn--sm mfl-btn--inline" style={{ alignSelf: 'flex-start' }}>
          Editar datos
        </Link>
      </section>

      <section className="stack">
        <h2 className="title">Próximos turnos</h2>
        {upcoming.length === 0 ? (
          <p className="muted">No tiene turnos próximos.</p>
        ) : (
          <ul className="appt-list">
            {upcoming.map((a) => (
              <li key={a.id}>
                <Link href={`/agenda/${a.id}`} className="mfl-num">{formatDay(a.date)}, {a.time}</Link>
                <span className="muted">{a.professional}</span>
                <StatusBadge status={a.status} />
                <ReminderButton href={a.whatsapp} appointmentId={a.id} small />
              </li>
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section className="stack">
          <h2 className="title">Turnos anteriores y cancelados</h2>
          <ul className="appt-list">
            {past.map((a) => (
              <li key={a.id}>
                <Link href={`/agenda/${a.id}`} className="mfl-num">{formatDay(a.date)}, {a.time}</Link>
                <span className="muted">{a.professional}</span>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
