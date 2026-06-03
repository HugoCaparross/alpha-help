import {
  UserPlus,
  ClipboardCheck,
  BookOpen,
  HeartHandshake,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crear una cuenta",
    description:
      "Regístrese gratuitamente para acceder a todos los recursos y contenidos disponibles.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Completar la evaluación inicial",
    description:
      "Realice una breve evaluación que permitirá personalizar la experiencia y recopilar información relevante para la investigación.",
  },
  {
    icon: BookOpen,
    number: "03",
    title: "Acceder a los contenidos",
    description:
      "Consulte materiales prácticos, recursos educativos y herramientas diseñadas para las familias.",
  },
  {
    icon: HeartHandshake,
    number: "04",
    title: "Acompañamiento continuo",
    description:
      "Reciba apoyo y formación durante todo el proceso para afrontar los desafíos emocionales de la adolescencia.",
  },
];

export default function Participation() {
  return (
    <section className="participation-section">
      <div className="container-custom">
        <div className="section-header">
          <span className="section-badge">Participación</span>

          <h2 className="section-title">¿Cómo funciona ALPHA-HELP?</h2>

          <p className="section-description">
            Hemos diseñado un proceso sencillo, accesible y orientado a las
            familias para facilitar la participación en el proyecto.
          </p>
        </div>

        <div className="participation-timeline">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article key={step.number} className="participation-card">
                <div className="participation-number">{step.number}</div>

                <div className="participation-icon">
                  <Icon size={28} />
                </div>

                <h3 className="participation-title">{step.title}</h3>

                <p className="participation-description">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
