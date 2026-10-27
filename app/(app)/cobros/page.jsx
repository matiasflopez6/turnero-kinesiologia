import Link from 'next/link';
import { query } from '@/lib/db';
import { listPayments } from '@/lib/billing';
import { todayLocal } from '@/lib/agenda';
import { METHODS, money } from '@/lib/money';

export const metadata = { title: 'Cobros' };

const shortDate = (d) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export default async function CobrosPage() {
  const today = todayLocal();
  const monthStart = `${today.slice(0, 7)}-01`;
  const prev = new Date(`${monthStart}T12:00:00Z`);
  prev.setUTCMonth(prev.getUTCMonth() - 1);
  const prevStart = prev.toISOString().slice(0, 10);

  const [{ rows: [totals] }, { rows: debtors }, payments] = await Promise.all([
    query(
      `SELECT coalesce(sum(amount) FILTER (WHERE paid_on >= $1), 0) AS this_month,
              coalesce(sum(amount) FILTER (WHERE paid_on >= $2 AND paid_on < $1), 0) AS last_month
         FROM payments`,
      [monthStart, prevStart]
    ),
    query(
      `SELECT p.id, p.first_name, p.last_name, b.charged - b.paid AS due
         FROM patient_balances b JOIN patients p ON p.id = b.patient_id
        WHERE b.charged - b.paid > 0 ORDER BY due DESC LIMIT 100`
    ),
    listPayments({ from: monthStart }),
  ]);

  const totalDue = debtors.reduce((s, d) => s + Number(d.due), 0);
  const month = MONTHS[Number(today.slice(5, 7)) - 1];

  return (
    <>
      <div className="page-head">
        <h1 className="heading">Cobros</h1>
        <Link href="/cobros/nuevo" className="mfl-btn mfl-btn--primary">Registrar cobro</Link>
      </div>

      <div className="metrics metrics--wide">
        <div className="mfl-metric">
          <span className="mfl-metric__value mfl-metric__value--money">{money(totals.this_month)}</span>
          <span className="mfl-metric__label">cobrado en {month}</span>
          <span className="mfl-metric__compare mfl-num">El mes pasado: {money(totals.last_month)}</span>
        </div>
        <div className="mfl-metric">
          <span className="mfl-metric__value mfl-metric__value--money">{money(totalDue)}</span>
          <span className="mfl-metric__label">por cobrar</span>
          <span className="mfl-metric__compare mfl-num">{debtors.length} {debtors.length === 1 ? 'paciente' : 'pacientes'} con saldo</span>
        </div>
      </div>

      <section className="stack">
        <h2 className="title">Pacientes con saldo pendiente</h2>
        {debtors.length === 0 ? (
          <p className="muted">Nadie debe nada. Los saldos salen de los presupuestos aceptados menos lo cobrado.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Paciente</th><th className="num">Saldo</th><th aria-label="Acciones" /></tr></thead>
              <tbody>
                {debtors.map((d) => (
                  <tr key={d.id}>
                    <td><Link href={`/pacientes/${d.id}?tab=cuenta`}>{d.last_name}, {d.first_name}</Link></td>
                    <td className="num mfl-num">{money(d.due)}</td>
                    <td className="cell-action"><Link href={`/cobros/nuevo?paciente=${d.id}`}>Registrar cobro</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="stack">
        <h2 className="title">Cobros de {month}</h2>
        {payments.length === 0 ? (
          <p className="muted">Todavía no registraste cobros este mes.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Fecha</th><th>Paciente</th><th>Medio</th><th className="num">Monto</th></tr></thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="mfl-num">{shortDate(p.paid_on)}</td>
                    <td><Link href={`/pacientes/${p.patient_id}?tab=cuenta`}>{p.last_name}, {p.first_name}</Link></td>
                    <td>{METHODS[p.method]}</td>
                    <td className="num mfl-num">{money(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
