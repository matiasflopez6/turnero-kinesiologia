import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import ProfessionalForm from '../ProfessionalForm';

export const metadata = { title: 'Editar kinesiólogo' };

export default async function EditarKinesiologoPage({ params }) {
  const { id } = await params;
  const { rows } = await query('SELECT id, name, phone, active FROM professionals WHERE id = $1', [Number(id) || 0]);
  if (!rows[0]) notFound();
  return (
    <>
      <div>
        <Link href="/kinesiologos" className="back">Kinesiólogos</Link>
        <h1 className="heading">{rows[0].name}</h1>
      </div>
      <section className="mfl-card">
        <ProfessionalForm professional={rows[0]} />
      </section>
    </>
  );
}
