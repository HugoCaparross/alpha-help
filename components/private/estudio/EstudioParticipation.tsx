const steps = [
  {
    number: "01",
    title: "Registro",
    description:
      "Creación de la cuenta y aceptación del consentimiento informado.",
  },
  {
    number: "02",
    title: "Evaluación inicial",
    description: "Cumplimentación de los cuestionarios de referencia.",
  },
  {
    number: "03",
    title: "Sesiones y recursos",
    description: "Acceso a materiales, actividades y contenidos formativos.",
  },
  {
    number: "04",
    title: "Evaluación final",
    description: "Valoración de resultados y cierre de la participación.",
  },
];

export default function EstudioParticipation() {
  return (
    <section className="estudio-card">
      <div className="estudio-card-header">
        <div>
          <h2 className="estudio-card-title">¿Cómo será tu participación?</h2>

          <p className="estudio-card-description">
            La participación en Alpha-Help se desarrolla de forma progresiva y
            está diseñada para que puedas completar cada fase de manera sencilla
            y acompañada.
          </p>
        </div>
      </div>

      <div className="estudio-timeline">
        {steps.map((step) => (
          <article key={step.number} className="estudio-step">
            <span className="estudio-step-number">{step.number}</span>

            <h3 className="estudio-step-title">{step.title}</h3>

            <p className="estudio-step-description">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
