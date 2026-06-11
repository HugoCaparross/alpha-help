import { Brain, Search, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Comprender",
    description:
      "Acceda a información rigurosa y actualizada sobre los principales desafíos emocionales durante la adolescencia.",
  },
  {
    icon: Search,
    title: "Detectar",
    description:
      "Aprenda a identificar señales de alerta y factores de riesgo que pueden afectar al bienestar emocional.",
  },
  {
    icon: ShieldCheck,
    title: "Actuar",
    description:
      "Obtenga herramientas y estrategias prácticas para afrontar situaciones complejas con mayor confianza.",
  },
];

export default function Benefits() {
  return (
    <section className="benefits-section">
      <div className="container-custom">
        <div className="section-header">
          <span className="section-badge">Beneficios para las familias</span>

          <h2 className="section-title">¿Qué obtendrá al participar?</h2>

          <p className="section-description">
            ALPHA-HELP proporciona recursos basados en evidencia científica para
            ayudar a las familias a afrontar los desafíos emocionales de la
            adolescencia.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article key={benefit.title} className="benefit-card">
                <div className="benefit-icon">
                  <Icon size={32} />
                </div>

                <h3 className="benefit-title">{benefit.title}</h3>

                <p className="benefit-description">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
