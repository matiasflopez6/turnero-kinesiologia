import Link from 'next/link';
import { activeProfessionals, patientsForSelect } from '@/lib/queries';
import { DEFAULT_DURATION, isValidDate, todayLocal } from '@/lib/agenda';
import AppointmentForm from '../AppointmentForm';

export const metadata = { title: 'Agendar turno' };

export default async function NuevoTurnoPage({ searchParams }) {
  const sp = await searchParams;
  const [patients, professionals] = await Promise.all([patientsForSelect(), activeProfessionals()]);
  const initial = {
    patient_id: sp.paciente ?? '',
    professional_id: sp.kine ?? (professionals.length === 1 ? professionals[0].id : ''),
    date: isValidDate(sp.fecha) ? sp.fecha : todayLocal(),
    time: /^\d{2}:\d{2}$/.test(sp.hora || '') ? sp.hora : '',
    duration: DEFAULT_DURATION,
  };

  return (
    <>
      <div>
        <Link href={`/agenda?fecha=${initial.date}`} className="back">Agenda</Link>
        <h1 className="heading">Agendar turno</h1>
      </div>
      <section className="mfl-card">
        {professionals.length === 0 ? (
          <p className="mfl-card__body">Primero cargá a los kinesiólogos en <Link href="/kinesiologos">Kinesiólogos</Link>.</p>
        ) : patients.length === 0 ? (
          <p className="mfl-card__body">Primero cargá un paciente en <Link href="/pacientes/nuevo">Nuevo paciente</Link>.</p>
        ) : (
          <AppointmentForm initial={initial} patients={patients} professionals={professionals} />
        )}
      </section>
    </>
  );
}
