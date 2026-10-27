import Link from 'next/link';
import { query } from '@/lib/db';
import ProfessionalForm from './ProfessionalForm';

export const metadata = { title: 'Kinesiólogos' };

export default async function KinesiologosPage() {
  const { rows } = await query('SELECT id, name, phone, active FROM professionals ORDER BY active DESC, name');
  return (
    <>
      <h1 className="heading">Kinesiólogos</h1>
      <section className="mfl-card">
        <h2 className="mfl-card__title">Nuevo kinesiólogo</h2>
        <ProfessionalForm />
      </section>
      {rows.length === 0 ? (
        <section className="mfl-card">
          <p className="mfl-card__body">Todavía no cargaste kinesiólogos. Agregá el primero para empezar a dar turnos.</p>
        </section>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Nombre</th><th>Teléfono</th><th>Estado</th><th aria-label="Acciones" /></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="mfl-num">{p.phone || <span className="muted">Sin teléfono</span>}</td>
                  <td>{p.active ? <span className="mfl-badge mfl-badge--gain">Activo</span> : <span className="mfl-badge">Inactivo</span>}</td>
                  <td className="cell-action"><Link href={`/kinesiologos/${p.id}`}>Editar</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
