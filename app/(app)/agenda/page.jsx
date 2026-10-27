import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { activeProfessionals, appointmentsForDay } from '@/lib/queries';
import { DAY_END, DAY_START, addDays, formatDay, isValidDate, minutesOf, timeOf, todayLocal } from '@/lib/agenda';
import StatusBadge from '@/components/StatusBadge';

export const metadata = { title: 'Agenda' };

const HOUR_PX = 64;
const px = (minutes) => ((minutes - DAY_START) / 60) * HOUR_PX;

export default async function AgendaPage({ searchParams }) {
  const sp = await searchParams;
  const today = todayLocal();
  const date = isValidDate(sp.fecha) ? sp.fecha : today;
  const [professionals, appointments] = await Promise.all([activeProfessionals(), appointmentsForDay(date)]);

  const hours = [];
  for (let m = DAY_START; m < DAY_END; m += 60) hours.push(m);
  const halfHours = [];
  for (let m = DAY_START; m < DAY_END; m += 30) halfHours.push(m);

  return (
    <>
      <div className="page-head">
        <h1 className="heading">Agenda</h1>
        <Link href={`/agenda/nuevo?fecha=${date}`} className="mfl-btn mfl-btn--primary">Agendar turno</Link>
      </div>

      <div className="day-nav">
        <Link className="icon-btn" href={`/agenda?fecha=${addDays(date, -1)}`} aria-label="Día anterior">
          <ChevronLeft size={18} strokeWidth={1.5} />
        </Link>
        <Link className="icon-btn" href={`/agenda?fecha=${addDays(date, 1)}`} aria-label="Día siguiente">
          <ChevronRight size={18} strokeWidth={1.5} />
        </Link>
        <span className="title mfl-num">{formatDay(date)}</span>
        {date !== today && <Link href="/agenda" className="mfl-btn mfl-btn--ghost mfl-btn--sm">Ir a hoy</Link>}
        <form className="day-nav__pick">
          <label className="sr-only" htmlFor="fecha">Ir a la fecha</label>
          <input className="mfl-input" type="date" id="fecha" name="fecha" defaultValue={date} />
          <button type="submit" className="mfl-btn mfl-btn--secondary mfl-btn--sm">Ver</button>
        </form>
      </div>

      {professionals.length === 0 ? (
        <section className="mfl-card">
          <p className="mfl-card__body">Para dar turnos, primero cargá a los kinesiólogos del consultorio.</p>
          <Link href="/kinesiologos" className="mfl-btn mfl-btn--secondary mfl-btn--sm" style={{ alignSelf: 'flex-start' }}>Cargar kinesiólogos</Link>
        </section>
      ) : (
        <div className="day-grid-wrap">
          <div className="day-grid" style={{ '--cols': professionals.length }}>
            <div className="day-grid__corner" />
            {professionals.map((p) => <div key={p.id} className="day-grid__head">{p.name}</div>)}

            <div className="day-grid__hours" style={{ height: px(DAY_END) }}>
              {hours.map((m) => <span key={m} className="mfl-num" style={{ top: px(m) }}>{timeOf(m)}</span>)}
            </div>
            {professionals.map((p) => (
              <div key={p.id} className="day-grid__col" style={{ height: px(DAY_END) }}>
                {halfHours.map((m) => (
                  <Link
                    key={m}
                    className="day-grid__cell"
                    style={{ top: px(m), height: HOUR_PX / 2 }}
                    href={`/agenda/nuevo?fecha=${date}&kine=${p.id}&hora=${timeOf(m)}`}
                    aria-label={`Agendar con ${p.name} a las ${timeOf(m)}`}
                  />
                ))}
                {appointments.filter((a) => a.professional_id === p.id).map((a) => {
                  const top = px(minutesOf(a.time));
                  const height = Math.max(px(minutesOf(a.end)) - top, 24);
                  return (
                    <Link key={a.id} href={`/agenda/${a.id}`} className={`appt appt--${a.status}`} style={{ top, height }}>
                      <span className="appt__time mfl-num">{a.time} a {a.end}{a.status === 'confirmado' ? ' ✓' : ''}</span>
                      <span className="appt__name">{a.first_name} {a.last_name}</span>
                      {height >= 60 && <StatusBadge status={a.status} />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
