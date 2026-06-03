import { ShieldCheck, Users, FlaskConical } from "lucide-react";

const features = [
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
];

export default function Features() {
  return (
    <section className="features-section">
      <div className="container-custom">
        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="feature-card">
                <div className="feature-card-icon">
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
