import { PROJECT_TRUST } from "@/lib/constants/project";

/**
 * Garantías del proyecto.
 */
export default function ProjectTrust() {
  return (
    <section
      className="project-section project-section-alt"
      aria-labelledby="project-trust-title"
    >
      <div className="container-custom">
        <div className="project-section-heading">
          <span className="project-section-number" aria-hidden="true">
            4
          </span>

          <h2 id="project-trust-title" className="section-title">
            Un proyecto en el que puedes confiar
          </h2>
        </div>

        <p className="section-description">
          Alpha-Help ha sido diseñado siguiendo criterios científicos, éticos y
          de calidad, garantizando la protección de la información y el rigor
          metodológico durante todo el estudio.
        </p>

        <div className="project-trust-grid">
          {PROJECT_TRUST.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="project-trust-card">
                <Icon size={34} aria-hidden="true" />

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}