import Link from 'next/link';
import { listQuotes } from '@/lib/billing';
import { localDate } from '@/lib/agenda';
import { money, QUOTE_STATUS } from '@/lib/money';
import QuoteBadge from '@/components/QuoteBadge';

export const metadata = { title: 'Presupuestos' };

const shortDate = (d) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;

export default async function PresupuestosPage({ searchParams }) {
  const { estado } = await searchParams;
  const status = QUOTE_STATUS[estado] ? estado : undefined;
  const quotes = await listQuotes({ status });

  return (
    <>
      <div className="page-head">
        <h1 className="heading">Presupuestos</h1>
        <Link href="/presupuestos/nuevo" className="mfl-btn mfl-btn--primary">Nuevo presupuesto</Link>
      </div>
      <nav className="tabs" aria-label="Filtrar por estado">
        <Link href="/presupuestos" aria-current={!status ? 'page' : undefined}>Todos</Link>
        {Object.entries(QUOTE_STATUS).map(([key, s]) => (
          <Link key={key} href={`/presupuestos?estado=${key}`} aria-current={status === key ? 'page' : undefined}>{s.label}s</Link>
        ))}
      </nav>
      {quotes.length === 0 ? (
        <section className="mfl-card">
          <p className="mfl-card__body">{status ? 'No hay presupuestos con ese estado.' : 'Todavía no hay presupuestos. Armá el primero con "Nuevo presupuesto".'}</p>
        </section>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Número</th><th>Fecha</th><th>Paciente</th><th>Estado</th><th className="num">Total</th></tr></thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td className="mfl-num"><Link href={`/presupuestos/${q.id}`}>N.º {q.id}</Link></td>
                  <td className="mfl-num">{shortDate(localDate(q.created_at))}</td>
                  <td>{q.last_name}, {q.first_name}</td>
                  <td><QuoteBadge status={q.status} /></td>
                  <td className="num mfl-num">{money(q.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
