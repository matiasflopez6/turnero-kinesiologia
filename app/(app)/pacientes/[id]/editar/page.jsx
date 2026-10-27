import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import PatientForm from '../../PatientForm';

export const metadata = { title: 'Editar paciente' };

export default async function EditarPacientePage({ params }) {
  const { id } = await params;
  const { rows } = await query(
    `SELECT id, first_name, last_name, dni, phone, email, to_char(birth_date, 'YYYY-MM-DD') AS birth_date, health_plan, notes, diagnosis, referred_by, alerts
       FROM patients WHERE id = $1`,
    [Number(id) || 0]
  );
  const patient = rows[0];
  if (!patient) notFound();
  return (
    <>
      <div>
        <Link href={`/pacientes/${patient.id}`} className="back">{patient.first_name} {patient.last_name}</Link>
        <h1 className="heading">Editar paciente</h1>
      </div>
      <section className="mfl-card">
        <PatientForm patient={patient} />
      </section>
    </>
  );
}
