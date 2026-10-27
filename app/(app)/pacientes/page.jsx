import Link from 'next/link';
import { query } from '@/lib/db';

export const metadata = { title: 'Pacientes' };

export default async function PacientesPage({ searchParams }) {
  const q = String((await searchParams).q || '').trim();
  // Busca sin distinguir mayúsculas ni tildes, por nombre, DNI o celular.
  const { rows } = await query(
    `WITH q AS (SELECT translate(lower($1), 'áéíóúüñ', 'aeiouun') AS text, regexp_replace($1, '\\D', '', 'g') AS digits)
     SELECT id, first_name, last_name, dni, phone, health_plan
       FROM patients, q
      WHERE q.text = ''
         OR translate(lower(first_name || ' ' || last_name || ' ' || first_name), 'áéíóúüñ', 'aeiouun') LIKE '%' || q.text || '%'
         OR (q.digits <> '' AND (coalesce(dni, '') LIKE '%' || q.digits || '%'
                                 OR regexp_replace(coalesce(phone, ''), '\\D', '', 'g') LIKE '%' || q.digits || '%'))
      ORDER BY lower(last_name), lower(first_name)
      LIMIT 200`,
    [q]
  );

  return (
    <>
      <div className="page-head">
        <h1 className="heading">Pacientes</h1>
        <Link href="/pacientes/nuevo" className="mfl-btn mfl-btn--primary">Nuevo paciente</Link>
      </div>
      <form className="search" role="search">
        <label className="mfl-field__label" htmlFor="q">Buscar</label>
        <div className="search__row">
          <input className="mfl-input" id="q" name="q" defaultValue={q} placeholder="Nombre, apellido, DNI o celular" />
          <button type="submit" className="mfl-btn mfl-btn--secondary">Buscar</button>
        </div>
      </form>
      {rows.length === 0 ? (
        <section className="mfl-card">
          <p className="mfl-card__body">
            {q ? `No encontramos pacientes para "${q}".` : 'Todavía no hay pacientes. Cargá el primero con "Nuevo paciente".'}
          </p>
        </section>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Paciente</th><th>DNI</th><th>Celular</th><th>Cobertura</th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td><Link href={`/pacientes/${p.id}`}>{p.last_name}, {p.first_name}</Link></td>
                  <td className="mfl-num">{p.dni || '—'}</td>
                  <td className="mfl-num">{p.phone || '—'}</td>
                  <td>{p.health_plan || 'Particular'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
