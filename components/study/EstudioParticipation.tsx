const STEPS = [
  {
    number: "01",
    title: "Registro",
    description:
      "Creación de la cuenta y aceptación del consentimiento informado.",
  },
  {
    number: "02",
    title: "Evaluación inicial",
    description:
      "Cumplimentación de los cuestionarios iniciales para conocer la situación de partida.",
  },
  {
    number: "03",
    title: "Sesiones y materiales",
    description:
      "Acceso progresivo a las sesiones formativas y a los recursos de apoyo del programa.",
  },
  {
    number: "04",
    title: "Evaluación final",
    description:
      "Cumplimentación del cuestionario final para valorar la evolución durante el estudio.",
  },
] as const;

/**
 * Fases de participación en el estudio.
 */
export default function EstudioParticipation() {
  return (
    <section
      className="estudio-card"
      aria-labelledby="estudio-participation-title"
    >
      <div className="estudio-card-header">
        <div>
          <h2 id="estudio-participation-title" className="estudio-card-title">
            ¿Cómo será tu participación?
          </h2>

          <p className="estudio-card-description">
            La participación en Alpha-Help se desarrolla de forma progresiva.
            Cada etapa se desbloquea de manera ordenada para facilitar el
            seguimiento del programa y garantizar una experiencia sencilla.
          </p>
        </div>
      </div>

      <div className="estudio-timeline">
        {STEPS.map((step) => (
          <article key={step.number} className="estudio-step">
            <span className="estudio-step-number" aria-hidden="true">
              {step.number}
            </span>

            <h3 className="estudio-step-title">{step.title}</h3>

            <p className="estudio-step-description">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
