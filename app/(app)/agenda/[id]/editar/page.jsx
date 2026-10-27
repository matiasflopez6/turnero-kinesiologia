import Link from 'next/link';
import { notFound } from 'next/navigation';
import { activeProfessionals, getAppointment, patientsForSelect } from '@/lib/queries';
import AppointmentForm from '../../AppointmentForm';

export const metadata = { title: 'Reprogramar turno' };

export default async function EditarTurnoPage({ params }) {
  const { id } = await params;
  const [appointment, patients, professionals] = await Promise.all([getAppointment(id), patientsForSelect(), activeProfessionals()]);
  if (!appointment) notFound();
  return (
    <>
      <div>
        <Link href={`/agenda/${appointment.id}`} className="back">Turno de {appointment.first_name} {appointment.last_name}</Link>
        <h1 className="heading">Reprogramar turno</h1>
      </div>
      <section className="mfl-card">
        <AppointmentForm appointment={appointment} patients={patients} professionals={professionals} />
      </section>
    </>
  );
}
