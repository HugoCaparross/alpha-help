import { PROJECT_PROCESS } from "@/lib/constants/project";

/**
 * Explica qué es Alpha-Help y cuáles son
 * sus principales objetivos.
 */
export default function ProjectOverview() {
  return (
    <section
      className="project-section project-section-alt"
      aria-labelledby="project-overview-title"
    >
      <div className="container-custom">
        <div className="project-split">
          <div>
            <div className="project-section-heading">
              <span className="project-section-number" aria-hidden="true">
                2
              </span>

              <h2 id="project-overview-title" className="section-title">
                ¿Qué es Alpha-Help?
              </h2>
            </div>

            <p className="section-description">
              Alpha-Help es un proyecto de investigación orientado a madres y
              padres de niños y niñas de entre 10 y 16 años.
            </p>

            <p className="section-description">
              El proyecto ofrece un programa de intervención online de 9
              sesiones mensuales orientadas a mejorar la comprensión del
              bienestar emocional del menor durante la etapa de la adolescencia
              y la preadolescencia.
            </p>

            <p className="section-description">
              Estas sesiones vendrán acompañadas de contenidos de consulta
              elaborados por expertos profesionales en salud mental
              infanto-juvenil.
            </p>

            <p className="section-description">
              Los contenidos que se ofrecen en el programa ayudarán a los
              participantes a reconocer e identificar mejor los factores de
              riesgo y protección de diferentes problemáticas presentes en la
              adolescencia.
            </p>
          </div>

          <div className="project-process">
            {PROJECT_PROCESS.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="project-process-item">
                  <div className="project-process-icon" aria-hidden="true">
                    <Icon size={28} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}