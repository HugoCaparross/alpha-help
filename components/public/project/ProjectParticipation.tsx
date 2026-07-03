import Link from "next/link";

import {
  BookOpen,
  ClipboardCheck,
  HeartHandshake,
  UserPlus,
} from "lucide-react";

const PARTICIPATION_STEPS = [
  {
    number: "01",
    title: "Crear una cuenta",
    description:
      "Regístrate gratuitamente para acceder al área privada del estudio.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Completar la evaluación inicial",
    description:
      "Responde los cuestionarios para conocer la situación inicial de la familia.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Acceder a los contenidos",
    description:
      "Consulta materiales y recursos desarrollados por el equipo investigador.",
    icon: BookOpen,
  },
  {
    number: "04",
    title: "Continuar el seguimiento",
    description:
      "Participa en las siguientes fases del estudio conforme se vayan habilitando.",
    icon: HeartHandshake,
  },
] as const;

/**
 * Explica el proceso de participación
 * en el proyecto Alpha-Help.
 */
export default function ProjectParticipation() {
  return (
    <section
      className="project-section"
      aria-labelledby="project-participation-title"
    >
      <div className="container-custom">
        <div className="project-section-heading">
          <span className="project-section-number" aria-hidden="true">
            5
          </span>

          <h2 id="project-participation-title" className="section-title">
            ¿Cómo participar?
          </h2>

          <p className="section-description">
            El proceso de participación ha sido diseñado para ser sencillo,
            accesible y completamente guiado.
          </p>
        </div>

        <div className="participation-timeline">
          {PARTICIPATION_STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <article key={step.number} className="participation-card">
                <div className="participation-number" aria-hidden="true">
                  {step.number}
                </div>

                <div className="participation-icon" aria-hidden="true">
                  <Icon size={28} />
                </div>

                <h3 className="participation-title">{step.title}</h3>

                <p className="participation-description">{step.description}</p>
              </article>
            );
          })}
        </div>

        <div className="project-cta">
          <Link href="/register" className="btn-primary">
            Comenzar ahora
          </Link>
        </div>
      </div>
    </section>
  );
}
