import Link from 'next/link';
import { query } from '@/lib/db';
import { money } from '@/lib/money';
import ServiceForm from './ServiceForm';

export const metadata = { title: 'Prestaciones' };

export default async function PrestacionesPage() {
  const { rows } = await query('SELECT id, name, price, active FROM services ORDER BY active DESC, name');
  return (
    <>
      <h1 className="heading">Prestaciones</h1>
      <section className="mfl-card">
        <h2 className="mfl-card__title">Nueva prestación</h2>
        <ServiceForm />
      </section>
      {rows.length === 0 ? (
        <section className="mfl-card">
          <p className="mfl-card__body">Todavía no cargaste prestaciones. Con ellas armás los presupuestos en un par de clics.</p>
        </section>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Prestación</th><th className="num">Precio</th><th>Estado</th><th aria-label="Acciones" /></tr></thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td className="num mfl-num">{money(s.price)}</td>
                  <td>{s.active ? <span className="mfl-badge mfl-badge--gain">Disponible</span> : <span className="mfl-badge">Sin usar</span>}</td>
                  <td className="cell-action"><Link href={`/prestaciones/${s.id}`}>Editar</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
