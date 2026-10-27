import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getQuote } from '@/lib/billing';
import { localDate } from '@/lib/agenda';
import { ZONES } from '@/lib/body';
import { money } from '@/lib/money';
import PrintButton from '@/components/PrintButton';
import QuoteBadge from '@/components/QuoteBadge';
import { deleteQuote, setQuoteStatus } from '../actions';

export const metadata = { title: 'Presupuesto' };

const shortDate = (d) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;

function StatusButton({ id, status, label, variant }) {
  return (
    <form action={setQuoteStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={`mfl-btn mfl-btn--${variant}`}>{label}</button>
    </form>
  );
}

export default async function PresupuestoPage({ params }) {
  const { id } = await params;
  const q = await getQuote(id);
  if (!q) notFound();
  const clinic = process.env.CLINIC_NAME || 'Consultorio';

  return (
    <>
      <div className="no-print">
        <Link href={`/pacientes/${q.patient_id}?tab=cuenta`} className="back">{q.first_name} {q.last_name}</Link>
        <div className="page-head">
          <h1 className="heading">Presupuesto N.º {q.id}</h1>
          <QuoteBadge status={q.status} />
        </div>
      </div>

      <article className="mfl-card quote-doc">
        <header className="quote-doc__head">
          <div>
            <p className="title">{clinic}</p>
            <p className="body-s muted">Presupuesto N.º {q.id}, del {shortDate(localDate(q.created_at))}</p>
          </div>
          {q.valid_until && <p className="body-s muted mfl-num">Válido hasta el {shortDate(q.valid_until)}</p>}
        </header>
        <p>
          Paciente: <strong>{q.first_name} {q.last_name}</strong>
          {q.dni && <span className="mfl-num">, DNI {q.dni}</span>}
          {q.health_plan && <span>, {q.health_plan}</span>}
        </p>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Descripción</th><th>Zona</th><th className="num">Sesiones</th><th className="num">Precio</th><th className="num">Importe</th></tr></thead>
            <tbody>
              {q.items.map((i) => (
                <tr key={i.id}>
                  <td>{i.description}</td>
                  <td>{i.zone ? ZONES[i.zone] : '—'}</td>
                  <td className="num mfl-num">{i.sessions}</td>
                  <td className="num mfl-num">{money(i.unit_price)}</td>
                  <td className="num mfl-num">{money(i.sessions * i.unit_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="quote-sum">
          <div className="quote-sum__row"><span>Subtotal</span><span className="mfl-num">{money(q.subtotal)}</span></div>
          {Number(q.discount_pct) > 0 && (
            <div className="quote-sum__row"><span>Descuento ({Number(q.discount_pct)} %)</span><span className="mfl-num">−{money(q.subtotal - q.total)}</span></div>
          )}
          <div className="quote-sum__row quote-sum__total"><span>Total</span><span className="mfl-num">{money(q.total)}</span></div>
        </div>
        {q.notes && <p className="muted">{q.notes}</p>}
      </article>

      <div className="actions no-print">
        {q.status === 'pendiente' && <StatusButton id={q.id} status="aceptado" label="Marcar como aceptado" variant="primary" />}
        <PrintButton />
        {q.status === 'pendiente' && <Link href={`/presupuestos/${q.id}/editar`} className="mfl-btn mfl-btn--secondary">Editar</Link>}
        {q.status === 'pendiente' && <StatusButton id={q.id} status="rechazado" label="Marcar como rechazado" variant="ghost" />}
        {q.status !== 'pendiente' && <StatusButton id={q.id} status="pendiente" label="Volver a pendiente" variant="ghost" />}
      </div>
      {q.status === 'aceptado' && (
        <p className="body-s muted no-print">Este total ya suma al saldo del paciente. Registrá los pagos desde su ficha, en la pestaña Cuenta.</p>
      )}
      {q.status !== 'aceptado' && (
        <details className="danger no-print">
          <summary>Borrar presupuesto</summary>
          <form action={deleteQuote}>
            <input type="hidden" name="id" value={q.id} />
            <button type="submit" className="mfl-btn mfl-btn--ghost">Sí, borrar presupuesto</button>
          </form>
        </details>
      )}
    </>
  );
}
