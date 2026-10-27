export const metadata = { title: 'Pacientes' };

export default function Page() {
  return (
    <>
      <h1 className="heading">Pacientes</h1>
      <section className="mfl-card empty">
        <p className="mfl-card__body">Todavía no hay pacientes cargados. La ficha de pacientes llega en la próxima entrega.</p>
      </section>
    </>
  );
}
