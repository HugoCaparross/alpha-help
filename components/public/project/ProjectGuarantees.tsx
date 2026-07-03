import { FlaskConical, GraduationCap, ShieldCheck, Users } from "lucide-react";

/**
 * Garantías y principios
 * sobre los que se desarrolla Alpha-Help.
 */
const GUARANTEES = [
  {
    title: "Proyecto universitario",
    description:
      "Alpha-Help forma parte de un proyecto de investigación desarrollado en el ámbito universitario con fines científicos.",
    icon: GraduationCap,
  },
  {
    title: "Basado en evidencia científica",
    description:
      "Todos los contenidos, materiales y recursos se fundamentan en investigación científica y literatura especializada.",
    icon: FlaskConical,
  },
  {
    title: "Privacidad y confidencialidad",
    description:
      "Toda la información se trata siguiendo la normativa vigente en materia de protección de datos y confidencialidad.",
    icon: ShieldCheck,
  },
  {
    title: "Equipo multidisciplinar",
    description:
      "El proyecto cuenta con profesionales especializados en psicología, educación e investigación.",
    icon: Users,
  },
] as const;

/**
 * Sección de garantías del proyecto.
 */
export default function ProjectGuarantees() {
  return (
    <section
      className="project-section project-section-alt"
      aria-labelledby="project-guarantees-title"
    >
      <div className="container-custom">
        <div className="project-section-heading">
          <span className="project-section-number" aria-hidden="true">
            4
          </span>

          <h2 id="project-guarantees-title" className="section-title">
            Un proyecto en el que puedes confiar
          </h2>
        </div>

        <p className="section-description">
          Alpha-Help ha sido diseñado siguiendo criterios científicos, éticos y
          de calidad, garantizando la protección de la información y el rigor
          metodológico durante todo el estudio.
        </p>

        <div className="project-trust-grid">
          {GUARANTEES.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="project-trust-card">
                <div className="project-trust-icon" aria-hidden="true">
                  <Icon size={30} />
                </div>

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
