import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import ServiceForm from '../ServiceForm';

export const metadata = { title: 'Editar prestación' };

export default async function EditarPrestacionPage({ params }) {
  const { id } = await params;
  const { rows } = await query('SELECT id, name, price, active FROM services WHERE id = $1', [Number(id) || 0]);
  if (!rows[0]) notFound();
  return (
    <>
      <div>
        <Link href="/prestaciones" className="back">Prestaciones</Link>
        <h1 className="heading">{rows[0].name}</h1>
      </div>
      <section className="mfl-card">
        <ServiceForm service={rows[0]} />
      </section>
    </>
  );
}
