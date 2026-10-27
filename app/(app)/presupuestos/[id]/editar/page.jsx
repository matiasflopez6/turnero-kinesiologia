import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { activeServices, getQuote } from '@/lib/billing';
import { patientsForSelect } from '@/lib/queries';
import QuoteForm from '../../QuoteForm';

export const metadata = { title: 'Editar presupuesto' };

export default async function EditarPresupuestoPage({ params }) {
  const { id } = await params;
  const [quote, patients, services] = await Promise.all([getQuote(id), patientsForSelect(), activeServices()]);
  if (!quote) notFound();
  if (quote.status !== 'pendiente') redirect(`/presupuestos/${quote.id}`);
  return (
    <>
      <div>
        <Link href={`/presupuestos/${quote.id}`} className="back">Presupuesto N.º {quote.id}</Link>
        <h1 className="heading">Editar presupuesto</h1>
      </div>
      <section className="mfl-card">
        <QuoteForm quote={quote} patients={patients} services={services} />
      </section>
    </>
  );
}
