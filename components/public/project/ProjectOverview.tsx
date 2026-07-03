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
              Alpha-Help es un proyecto de investigación orientado a mejorar la
              comprensión del bienestar emocional durante la adolescencia,
              identificar factores de protección y proporcionar herramientas
              útiles para las familias.
            </p>

            <p className="section-description">
              La participación de madres, padres y tutores permite obtener
              información rigurosa que contribuirá al desarrollo de nuevas
              estrategias de prevención, detección e intervención basadas en
              evidencia científica.
            </p>

            <p className="section-description">
              El proyecto combina investigación, formación y acompañamiento para
              ofrecer una experiencia útil tanto para las familias como para la
              comunidad científica.
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
