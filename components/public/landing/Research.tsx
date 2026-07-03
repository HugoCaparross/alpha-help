import { FlaskConical, GraduationCap, ShieldCheck, Users } from "lucide-react";

const RESEARCH_PILLARS = [
  {
    icon: GraduationCap,
    title: "Proyecto universitario",
    description:
      "Alpha-Help forma parte de una iniciativa académica orientada a mejorar el conocimiento sobre el bienestar emocional durante la adolescencia.",
  },
  {
    icon: FlaskConical,
    title: "Basado en evidencia científica",
    description:
      "Todos los contenidos y recursos han sido desarrollados a partir de investigación científica y buenas prácticas profesionales.",
  },
  {
    icon: ShieldCheck,
    title: "Confidencialidad garantizada",
    description:
      "La información recopilada se trata de forma segura, anónima y conforme a la normativa vigente de protección de datos.",
  },
  {
    icon: Users,
    title: "Equipo multidisciplinar",
    description:
      "El proyecto cuenta con profesionales e investigadores especializados en adolescencia, salud mental y educación.",
  },
] as const;

/**
 * Sección que presenta los pilares científicos
 * y la credibilidad del proyecto.
 */
export default function Research() {
  return (
    <section className="research-section" aria-labelledby="research-title">
      <div className="container-custom">
        <div className="research-wrapper">
          <header className="research-content">
            <span className="section-badge">Investigación y confianza</span>

            <h2 id="research-title" className="section-title">
              Un proyecto respaldado por la investigación
            </h2>

            <p className="section-description">
              Alpha-Help nace con el objetivo de acercar el conocimiento
              científico a las familias y proporcionar herramientas útiles para
              afrontar los desafíos emocionales de la adolescencia.
            </p>
          </header>

          <div className="research-grid">
            {RESEARCH_PILLARS.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article key={pillar.title} className="research-card">
                  <div className="research-icon" aria-hidden="true">
                    <Icon size={32} />
                  </div>

                  <h3 className="research-card-title">{pillar.title}</h3>

                  <p className="research-card-description">
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
