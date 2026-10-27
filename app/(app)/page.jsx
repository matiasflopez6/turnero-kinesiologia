import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { appointmentsForDay } from '@/lib/queries';
import { formatDay, todayLocal } from '@/lib/agenda';
import ReminderButton from '@/components/ReminderButton';
import StatusBadge from '@/components/StatusBadge';

export default async function InicioPage() {
  const user = await requireUser();
  const today = todayLocal();
  const appointments = await appointmentsForDay(today);
  const pending = appointments.filter((a) => a.status === 'sin_confirmar').length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="heading">Hola, {user.name.split(' ')[0]}</h1>
          <p className="muted">{formatDay(today)}</p>
        </div>
        <Link href={`/agenda/nuevo?fecha=${today}`} className="mfl-btn mfl-btn--primary">Agendar turno</Link>
      </div>

      <div className="metrics">
        <div className="mfl-metric">
          <span className="mfl-metric__value">{appointments.length}</span>
          <span className="mfl-metric__label">turnos hoy</span>
        </div>
        <div className="mfl-metric">
          <span className="mfl-metric__value">{pending}</span>
          <span className="mfl-metric__label">sin confirmar</span>
        </div>
      </div>

      <section className="stack">
        <h2 className="title">Turnos de hoy</h2>
        {appointments.length === 0 ? (
          <section className="mfl-card">
            <p className="mfl-card__body">Todavía no hay turnos para hoy.</p>
          </section>
        ) : (
          <ul className="appt-list">
            {appointments.map((a) => (
              <li key={a.id}>
                <Link href={`/agenda/${a.id}`} className="mfl-num">{a.time}</Link>
                <span>{a.first_name} {a.last_name}</span>
                <span className="muted">{a.professional}</span>
                <StatusBadge status={a.status} />
                {a.status === 'sin_confirmar' && <ReminderButton href={a.whatsapp} appointmentId={a.id} small />}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
