import { Brain, Search, ShieldCheck } from "lucide-react";

const BENEFITS = [
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
] as const;

/**
 * Beneficios que obtienen las familias
 * al participar en Alpha-Help.
 */
export default function Benefits() {
  return (
    <section className="benefits-section" aria-labelledby="benefits-title">
      <div className="container-custom">
        <header className="section-header">
          <span className="section-badge">Beneficios para las familias</span>

          <h2 id="benefits-title" className="section-title">
            ¿Qué obtendrá al participar?
          </h2>

          <p className="section-description">
            Alpha-Help proporciona recursos basados en evidencia científica para
            ayudar a las familias a afrontar los desafíos emocionales de la
            adolescencia.
          </p>
        </header>

        <div className="benefits-grid">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article key={benefit.title} className="benefit-card">
                <div className="benefit-icon" aria-hidden="true">
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
