import { FlaskConical, ShieldCheck, Users } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Seguro y confidencial",
    description: "Toda la información se trata de forma segura y confidencial.",
  },
  {
    icon: Users,
    title: "Participación gratuita",
    description: "Las familias pueden participar sin ningún coste económico.",
  },
  {
    icon: FlaskConical,
    title: "Basado en evidencia científica",
    description:
      "Desarrollado a partir de investigación universitaria rigurosa.",
  },
] as const;

/**
 * Beneficios principales del proyecto.
 */
export default function Features() {
  return (
    <section className="features-section" aria-labelledby="features-title">
      <div className="container-custom">
        <header className="sr-only">
          <h2 id="features-title">Principales características del proyecto</h2>
        </header>

        <div className="features-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="feature-card">
                <div className="feature-card-icon" aria-hidden="true">
                  <Icon size={28} />
                </div>

                <h3 className="feature-card-title">{feature.title}</h3>

                <p className="feature-card-description">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
