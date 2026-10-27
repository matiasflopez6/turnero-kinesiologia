import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { activeProfessionals, appointmentsForPatient } from '@/lib/queries';
import { formatDay, todayLocal } from '@/lib/agenda';
import { FINDINGS, ZONES } from '@/lib/body';
import BodyMap from '@/components/BodyMap';
import NoteForm from '@/components/NoteForm';
import ReminderButton from '@/components/ReminderButton';
import StatusBadge from '@/components/StatusBadge';
import { removeFinding, removeNote, resetMap } from '../clinical-actions';

export const metadata = { title: 'Paciente' };

const TABS = [
  ['resumen', 'Resumen'],
  ['mapa', 'Mapa corporal'],
  ['evolucion', 'Evolución'],
];

function age(birth) {
  if (!birth) return null;
  const b = new Date(birth);
  const now = new Date();
  let years = now.getFullYear() - b.getFullYear();
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) years -= 1;
  return years;
}

function Resumen({ p, appointments }) {
  const now = new Date();
  const upcoming = appointments.filter((a) => a.starts_at >= now && a.status !== 'cancelado').reverse();
  const past = appointments.filter((a) => !(a.starts_at >= now && a.status !== 'cancelado'));
  const years = age(p.birth_date);
  return (
    <>
      <section className="mfl-card">
        <dl className="facts">
          <div><dt>Celular</dt><dd className="mfl-num">{p.phone || 'Sin cargar'}</dd></div>
          <div><dt>DNI</dt><dd className="mfl-num">{p.dni || 'Sin cargar'}</dd></div>
          <div><dt>Cobertura</dt><dd>{p.health_plan || 'Particular'}</dd></div>
          <div><dt>Edad</dt><dd className="mfl-num">{years != null ? `${years} años` : 'Sin cargar'}</dd></div>
          {p.email && <div><dt>Email</dt><dd>{p.email}</dd></div>}
          <div><dt>Diagnóstico</dt><dd>{p.diagnosis || 'Sin cargar'}</dd></div>
          {p.referred_by && <div><dt>Derivado por</dt><dd>{p.referred_by}</dd></div>}
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

function Mapa({ p, findings }) {
  return (
    <>
      <BodyMap patientId={p.id} findings={findings} />
      {findings.length > 0 && (
        <section className="stack">
          <h2 className="title">Hallazgos marcados</h2>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Zona</th><th>Hallazgo</th><th className="num">EVA</th><th>Notas</th><th aria-label="Acciones" /></tr></thead>
              <tbody>
                {findings.map((f) => (
                  <tr key={f.id}>
                    <td>{ZONES[f.zone]}</td>
                    <td>{FINDINGS[f.finding]}</td>
                    <td className="num mfl-num">{f.eva ?? '—'}</td>
                    <td className="muted">{f.notes}</td>
                    <td className="cell-action">
                      <form action={removeFinding}>
                        <input type="hidden" name="id" value={f.id} />
                        <input type="hidden" name="patient_id" value={p.id} />
                        <button type="submit" className="mfl-btn mfl-btn--ghost mfl-btn--sm">Quitar</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className="danger">
            <summary>Reiniciar mapa corporal</summary>
            <p className="body-s muted">Se borran todos los hallazgos marcados. La evolución no se toca.</p>
            <form action={resetMap}>
              <input type="hidden" name="patient_id" value={p.id} />
              <button type="submit" className="mfl-btn mfl-btn--ghost">Sí, reiniciar mapa</button>
            </form>
          </details>
        </section>
      )}
    </>
  );
}

function Evolucion({ p, notes, professionals }) {
  const withEva = notes.filter((n) => n.eva != null);
  const first = withEva[withEva.length - 1];
  const last = withEva[0];
  const delta = withEva.length >= 2 ? last.eva - first.eva : null;

  return (
    <>
      {delta != null && (
        <div className="mfl-metric" style={{ maxWidth: 420 }}>
          <span className="mfl-metric__value">{delta > 0 ? `+${delta}` : delta === 0 ? '0' : `−${-delta}`}</span>
          <span className="mfl-metric__label">puntos de dolor (EVA)</span>
          <span className="mfl-metric__compare mfl-num">
            De {first.eva} el {formatDay(first.note_date).toLowerCase()} a {last.eva} el {formatDay(last.note_date).toLowerCase()}
          </span>
          <span className="mfl-metric__bar"><span style={{ width: `${last.eva * 10}%` }} /></span>
        </div>
      )}

      <section className="mfl-card">
        <h2 className="mfl-card__title">Registrar sesión</h2>
        <NoteForm patientId={p.id} professionals={professionals} today={todayLocal()} hasNotes={notes.length > 0} />
      </section>

      <section className="stack">
        <h2 className="title">Historia clínica</h2>
        {notes.length === 0 ? (
          <p className="muted">Todavía no hay sesiones registradas. Empezá por la evaluación inicial.</p>
        ) : (
          <ol className="timeline">
            {notes.map((n) => (
              <li key={n.id}>
                <div className="timeline__head">
                  <span className="title mfl-num">{formatDay(n.note_date)}</span>
                  <span className={`mfl-badge ${n.kind === 'evaluacion' ? 'mfl-badge--pulse' : ''}`}>
                    {n.kind === 'evaluacion' ? 'Evaluación inicial' : 'Sesión'}
                  </span>
                  {n.zone && <span className="muted">{ZONES[n.zone]}</span>}
                  {n.eva != null && <span className="mfl-num">EVA {n.eva}</span>}
                </div>
                <p className="timeline__body">{n.body}</p>
                <div className="timeline__foot">
                  <span className="body-s muted">{n.professional || 'Kinesiólogo sin indicar'}</span>
                  <details className="danger">
                    <summary>Borrar</summary>
                    <form action={removeNote}>
                      <input type="hidden" name="id" value={n.id} />
                      <input type="hidden" name="patient_id" value={p.id} />
                      <button type="submit" className="mfl-btn mfl-btn--ghost mfl-btn--sm">Sí, borrar sesión</button>
                    </form>
                  </details>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}

export default async function PacientePage({ params, searchParams }) {
  const { id } = await params;
  const { tab: rawTab } = await searchParams;
  const tab = TABS.some(([k]) => k === rawTab) ? rawTab : 'resumen';
  const { rows } = await query('SELECT * FROM patients WHERE id = $1', [Number(id) || 0]);
  const p = rows[0];
  if (!p) notFound();

  let content;
  if (tab === 'mapa') {
    const { rows: findings } = await query(
      `SELECT id, zone, finding, eva, notes FROM body_findings WHERE patient_id = $1 ORDER BY eva DESC NULLS LAST, zone`,
      [p.id]
    );
    content = <Mapa p={p} findings={findings} />;
  } else if (tab === 'evolucion') {
    const [{ rows: notes }, professionals] = await Promise.all([
      query(
        `SELECT n.id, to_char(n.note_date, 'YYYY-MM-DD') AS note_date, n.kind, n.zone, n.eva, n.body, pr.name AS professional
           FROM clinical_notes n LEFT JOIN professionals pr ON pr.id = n.professional_id
          WHERE n.patient_id = $1 ORDER BY n.note_date DESC, n.id DESC`,
        [p.id]
      ),
      activeProfessionals(),
    ]);
    content = <Evolucion p={p} notes={notes} professionals={professionals} />;
  } else {
    content = <Resumen p={p} appointments={await appointmentsForPatient(p.id)} />;
  }

  return (
    <>
      <div>
        <Link href="/pacientes" className="back">Pacientes</Link>
        <div className="page-head">
          <div>
            <h1 className="heading">{p.first_name} {p.last_name}</h1>
            {p.diagnosis && <p className="muted">{p.diagnosis}</p>}
          </div>
          <Link
            href={`/agenda/nuevo?paciente=${p.id}`}
            className={`mfl-btn ${tab === 'resumen' ? 'mfl-btn--primary' : 'mfl-btn--secondary'}`}
          >
            Agendar turno
          </Link>
        </div>
      </div>

      {p.alerts && (
        <p className="alert-box" role="note">
          <strong>Alertas y contraindicaciones:</strong> {p.alerts}
        </p>
      )}

      <nav className="tabs" aria-label="Secciones del paciente">
        {TABS.map(([key, label]) => (
          <Link key={key} href={`/pacientes/${p.id}${key === 'resumen' ? '' : `?tab=${key}`}`} aria-current={tab === key ? 'page' : undefined}>
            {label}
          </Link>
        ))}
      </nav>

      {content}
    </>
  );
}
