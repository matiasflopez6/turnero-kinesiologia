import Link from 'next/link';
import { activeServices } from '@/lib/billing';
import { patientsForSelect } from '@/lib/queries';
import { addDays, todayLocal } from '@/lib/agenda';
import QuoteForm from '../QuoteForm';

export const metadata = { title: 'Nuevo presupuesto' };

export default async function NuevoPresupuestoPage({ searchParams }) {
  const { paciente } = await searchParams;
  const [patients, services] = await Promise.all([patientsForSelect(), activeServices()]);
  const initial = { patient_id: paciente ?? '', valid_until: addDays(todayLocal(), 30), discount_pct: 0, items: [] };
  return (
    <>
      <div>
        <Link href={paciente ? `/pacientes/${paciente}?tab=cuenta` : '/presupuestos'} className="back">
          {paciente ? 'Volver a la ficha' : 'Presupuestos'}
        </Link>
        <h1 className="heading">Nuevo presupuesto</h1>
      </div>
      {services.length === 0 && (
        <p className="body-s muted">
          Tip: cargá tus <Link href="/prestaciones">prestaciones</Link> con precio y después las elegís de una lista.
        </p>
      )}
      <section className="mfl-card">
        {patients.length === 0 ? (
          <p className="mfl-card__body">Primero cargá un paciente en <Link href="/pacientes/nuevo">Nuevo paciente</Link>.</p>
        ) : (
          <QuoteForm initial={initial} patients={patients} services={services} />
        )}
      </section>
    </>
  );
}
