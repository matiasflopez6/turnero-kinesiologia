import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAppointment } from '@/lib/queries';
import { formatDay, localDate, localTime } from '@/lib/agenda';
import ReminderButton from '@/components/ReminderButton';
import StatusBadge from '@/components/StatusBadge';
import { setStatus } from '../actions';

export const metadata = { title: 'Turno' };

function StatusButton({ id, status, label, variant }) {
  return (
    <form action={setStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={`mfl-btn mfl-btn--${variant}`}>{label}</button>
    </form>
  );
}

export default async function TurnoPage({ params, searchParams }) {
  const { id } = await params;
  const { error } = await searchParams;
  const a = await getAppointment(id);
  if (!a) notFound();

  return (
    <>
      <div>
        <Link href={`/agenda?fecha=${a.date}`} className="back">Agenda del {formatDay(a.date).toLowerCase()}</Link>
        <h1 className="heading">Turno de {a.first_name} {a.last_name}</h1>
      </div>

      {error === 'ocupado' && (
        <p className="form-error" role="alert">Ese horario ya lo ocupa otro turno. Reprogramalo antes de reactivarlo.</p>
      )}

      <section className="mfl-card">
        <div className="appt-detail">
          <StatusBadge status={a.status} />
          <p className="title mfl-num">{formatDay(a.date)}, de {a.time} a {a.end}</p>
          <p>Con {a.professional}</p>
          <p><Link href={`/pacientes/${a.patient_id}`}>Ver ficha del paciente</Link></p>
          {a.notes && <p className="muted">{a.notes}</p>}
        </div>
        <div className="actions">
          {a.status === 'sin_confirmar' && <StatusButton id={a.id} status="confirmado" label="Confirmar turno" variant="primary" />}
          {a.status !== 'cancelado' && <ReminderButton href={a.whatsapp} appointmentId={a.id} />}
          {a.status !== 'cancelado' && <Link href={`/agenda/${a.id}/editar`} className="mfl-btn mfl-btn--secondary">Reprogramar</Link>}
          {a.status === 'cancelado' && <StatusButton id={a.id} status="sin_confirmar" label="Reactivar turno" variant="secondary" />}
        </div>
        {a.reminded_at && (
          <p className="body-s muted mfl-num">
            Recordatorio enviado el {localDate(a.reminded_at).slice(8, 10)}/{localDate(a.reminded_at).slice(5, 7)} a las {localTime(a.reminded_at)}.
          </p>
        )}
      </section>

      {a.status !== 'cancelado' && (
        <details className="danger">
          <summary>Cancelar turno</summary>
          <p className="body-s muted">El horario queda libre para otro paciente. Podés reactivarlo después si sigue libre.</p>
          <StatusButton id={a.id} status="cancelado" label="Sí, cancelar turno" variant="ghost" />
        </details>
      )}
    </>
  );
}
