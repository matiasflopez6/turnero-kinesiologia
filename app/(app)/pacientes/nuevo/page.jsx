import Link from 'next/link';
import PatientForm from '../PatientForm';

export const metadata = { title: 'Nuevo paciente' };

export default function NuevoPacientePage() {
  return (
    <>
      <div>
        <Link href="/pacientes" className="back">Pacientes</Link>
        <h1 className="heading">Nuevo paciente</h1>
      </div>
      <section className="mfl-card">
        <PatientForm />
      </section>
    </>
  );
}
