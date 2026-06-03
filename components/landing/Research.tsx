import { GraduationCap, FlaskConical, ShieldCheck, Users } from "lucide-react";

const pillars = [
  {
    icon: GraduationCap,
    title: "Proyecto universitario",
    description:
      "ALPHA-HELP forma parte de una iniciativa académica orientada a mejorar el conocimiento sobre el bienestar emocional durante la adolescencia.",
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
];

export default function Research() {
  return (
    <section className="research-section">
      <div className="container-custom">
        <div className="research-wrapper">
          <div className="research-content">
            <span className="section-badge">Investigación y confianza</span>

            <h2 className="section-title">
              Un proyecto respaldado por la investigación
            </h2>

            <p className="section-description">
              ALPHA-HELP nace con el objetivo de acercar el conocimiento
              científico a las familias y proporcionar herramientas útiles para
              afrontar los desafíos emocionales de la adolescencia.
            </p>
          </div>

          <div className="research-grid">
            {pillars.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="research-card">
                  <div className="research-icon">
                    <Icon size={32} />
                  </div>

                  <h3 className="research-card-title">{item.title}</h3>

                  <p className="research-card-description">
                    {item.description}
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
