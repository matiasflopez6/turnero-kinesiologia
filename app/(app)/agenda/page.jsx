export const metadata = { title: 'Agenda' };

export default function Page() {
  return (
    <>
      <h1 className="heading">Agenda</h1>
      <section className="mfl-card empty">
        <p className="mfl-card__body">Todavía no hay turnos cargados. La agenda por kinesiólogo llega en la próxima entrega.</p>
      </section>
    </>
  );
}
