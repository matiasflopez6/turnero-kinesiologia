import Link from 'next/link';
import { patientBalance } from '@/lib/billing';
import { patientsForSelect } from '@/lib/queries';
import { todayLocal } from '@/lib/agenda';
import { money } from '@/lib/money';
import PaymentForm from '../PaymentForm';

export const metadata = { title: 'Registrar cobro' };

export default async function NuevoCobroPage({ searchParams }) {
  const { paciente } = await searchParams;
  const patients = await patientsForSelect();
  const balance = paciente ? await patientBalance(Number(paciente)) : null;
  const initial = {
    patient_id: paciente ?? '',
    paid_on: todayLocal(),
    method: 'efectivo',
    amount: balance?.due > 0 ? String(Math.round(balance.due)) : '',
    suggested: balance?.due > 0 ? money(balance.due) : null,
  };
  return (
    <>
      <div>
        <Link href={paciente ? `/pacientes/${paciente}?tab=cuenta` : '/cobros'} className="back">
          {paciente ? 'Volver a la ficha' : 'Cobros'}
        </Link>
        <h1 className="heading">Registrar cobro</h1>
      </div>
      <section className="mfl-card">
        {patients.length === 0 ? (
          <p className="mfl-card__body">Primero cargá un paciente en <Link href="/pacientes/nuevo">Nuevo paciente</Link>.</p>
        ) : (
          <PaymentForm initial={initial} patients={patients} />
        )}
      </section>
    </>
  );
}
