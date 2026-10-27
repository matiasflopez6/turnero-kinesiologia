import Link from 'next/link';
import { requireUser } from '@/lib/auth';

export default async function InicioPage() {
  const user = await requireUser();
  const today = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date());

  return (
    <>
      <div>
        <h1 className="heading">Hola, {user.name.split(' ')[0]}</h1>
        <p className="muted">
          {today.charAt(0).toUpperCase() + today.slice(1)}
        </p>
      </div>
      <section className="mfl-card empty">
        <h2 className="mfl-card__title">Turnos de hoy</h2>
        <p className="mfl-card__body">Todavía no hay turnos para hoy.</p>
        <Link href="/agenda" className="mfl-btn mfl-btn--secondary mfl-btn--sm">
          Ver agenda
        </Link>
      </section>
    </>
  );
}
